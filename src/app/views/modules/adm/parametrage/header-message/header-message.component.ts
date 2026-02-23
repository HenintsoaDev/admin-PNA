import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HeaderMessageService } from 'app/services/admin/parametre/header_message.service';
import { ModuleService } from 'app/services/admin/parametre/module.service';
import { AuthService } from 'app/services/auth.service';
import { PassageService } from 'app/services/table/passage.service';
import { sous_module } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header-message',
  templateUrl: './header-message.component.html',
  styleUrls: ['./header-message.component.scss']
})
export class HeaderMessageComponent extends Translatable implements OnInit {

    endpoint = "";
    header = [
        {"nomColonne" :  this.__('header_message.expediteur'),"colonneTable" : "expediteur","table" : "header_message"},
        {"nomColonne" :  this.__('header_message.message'),"colonneTable" : "txt_messenger","table" : "header_message"},
        {"nomColonne" :  this.__('header_message.publie'),"colonneTable" : "publie","table" : "header_message"},
        {"nomColonne" :  this.__('header_message.module'),"colonneTable" : "module","table" : "header_message"},
        {"nomColonne" : this.__('global.action')}
    ];

    objetBody = [
        {'name' : 'expediteur','type' : 'text',},
        {'name' : 'txt_messenger','type' : 'text',},
        {'name' : 'publie','type' : 'montant',},
        {'name' : 'module','type' : 'text',},
        {'name' : 'state#rowid',},
    ];

    listIcon = [
        {'icon' : 'state','autority' : 'PRM_55',},
        {'icon' : 'edit','action' : 'edit','tooltip' : this.__('global.tooltip_edit'),'autority' : 'PRM_54',},
        {'icon' : 'delete','action' : 'delete','tooltip' : this.__('global.tooltip_delete'),'autority' : 'PRM_56',},
    ];

    searchGlobal = [];

    titleModal : string = "";
    modalRef?: BsModalRef;
    @ViewChild('updateHeaderMessage') updateHeaderMessage: TemplateRef<any> | undefined;
    @ViewChild('newHeaderMessage') newHeaderMessage: TemplateRef<any> | undefined;

    list_message: any = [];
    message : any = {};
    sous_module: sous_module = new sous_module();
    listSousModules:sous_module [] = [];

    filteredModules: sous_module[] = [];
    searchControl = new FormControl('');

    subscription: Subscription;
    idMessage: number | undefined;
    expediteur: string;
    txt_messenger: string;
    publie_value : number = 0; // 0: Non publié, 1: Publié

    loadingButton: boolean = false;

    constructor(
        private passageService: PassageService,
        private modalService: BsModalService,
        private moduleService: ModuleService,
        private headerMessageService : HeaderMessageService,
        private toastr: ToastrService,
        private authService : AuthService
    ) {
        super();
    }

    async ngOnInit(): Promise<void> {
        this.authService.initAutority("PRM","ADM");
        this.passageService.appelURL(null);
        this.endpoint = environment.baseUrl + '/' + environment.header_message;
        await this.getModuleActive();

        this.searchControl.valueChanges.subscribe(value => {
            const lower = value?.toLowerCase() || '';
            this.filteredModules = this.listSousModules.filter(mod =>
                mod.name.toLowerCase().includes(lower)
            );
        });

        this.subscription = this.passageService.getObservable().subscribe(event => {
            if(event.data){
                this.idMessage = event.data.id;

                if(event.data.action == 'edit'){
                    // Action pour modification
                    this.titleModal = this.__('header_message.modifier_message');
                    this.openUpdateModal();
                }else if(event.data.action == 'delete'){
                    this.deleteHeaderMessage();
                }else if(event.data.state == 0 || event.data.state == 1){
                    this.openModalToogleStateModule();
                }
        
                // Nettoyage immédiat de l'event
                this.passageService.clear();
            }
        });
    }

    getModuleActive() {
        this.moduleService.getModuleActive().subscribe({
            next: (response) => {
                if (response.code === 200) {
                    this.listSousModules = response.data;
                    this.filteredModules = this.listSousModules;
                } else {}
            },
            error: (error) => {}
        });
    }

    openNewMessageModal()
    {
        this.titleModal = this.__('header_message.ajout_message');
        this.modalRef = this.modalService.show(this.newHeaderMessage, {
            backdrop: 'static',
            keyboard: false
        });
    }

    openUpdateModal()
    {
        this.recupererDonnee();
        this.titleModal = this.__('header_message.update_info');
        this.modalRef = this.modalService.show(this.updateHeaderMessage, {
            backdrop: 'static',
            keyboard: false
        });
    }

    sendNewHeaderMessage() {

        this.loadingButton = true;
        this.headerMessageService.sendNewHeaderMessage({
            expediteur: this.expediteur,
            txt_messenger: this.txt_messenger,
            module_id: this.sous_module.id,
            publie: this.publie_value
        }).subscribe({
            next: (response) => {
                if (response.code === 201) {
                    this.toastr.success(response.msg, this.__("global.success"));
                    this.closeModal();
                    this.passageService.appelURL(null);
                    this.expediteur = undefined;
                    this.txt_messenger = undefined;
                } else {
                    this.toastr.error(response.msg, this.__("global.error"));
                }
                this.loadingButton = false;
            },error: (error) => {
                this.toastr.error(this.__("global.error"), this.__("global.error"));
                this.loadingButton = false;
            }
        });
    }

    sendUpdateHeaderMessage() {
        this.loadingButton = true;
        this.headerMessageService.sendUpdateHeaderMessage({
            id: this.idMessage,
            expediteur: this.expediteur,
            txt_messenger: this.txt_messenger,
            module_id: this.sous_module.id,
            publie: this.publie_value
        }).subscribe({
            next: (response) => {
                if (response.code === 201) {
                    this.toastr.success(response.msg, this.__("global.success"));
                    this.closeModal();
                    this.passageService.appelURL(null);
                    this.expediteur = undefined;
                    this.txt_messenger = undefined;
                } else {
                    this.toastr.error(response.msg, this.__("global.error"));
                }
                this.loadingButton = false;
            }
            ,error: (error) => {
                this.toastr.error(this.__("global.error"), this.__("global.error"));
                this.loadingButton = false;
            }
        });
    }

    deleteHeaderMessage() {
        Swal.fire({
            title: this.__("global.confirmation"),
            text: this.__("global.supprimer_donnee_?"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.__("global.oui_supprimer"),
            cancelButtonText: this.__("global.cancel"),
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal-button--confirm-custom',
                cancelButton: 'swal-button--cancel-custom'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                this.headerMessageService.deleteHeaderMessage(this.idMessage).subscribe({
                    next: (response) => {
                        if (response.code === 204) {
                            this.toastr.success(response.msg, this.__("global.success"));
                            this.closeModal();
                            this.passageService.appelURL(null);
                        } else {
                            this.toastr.error(response.msg, this.__("global.error"));
                        }
                    }
                    ,error: (error) => {
                        this.toastr.error(this.__("global.error"), this.__("global.error"));
                    }
                });
            }
        });
    }

    openModalToogleStateModule()
    {
        this.recupererDonnee();
        Swal.fire({
            title: this.__("global.confirmation"),
            text: this.__("global.changer_state_?"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.__("global.oui_changer"),
            cancelButtonText: this.__("global.cancel"),
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal-button--confirm-custom',
                cancelButton: 'swal-button--cancel-custom'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                let state = 0;
                (this.message.state == 1) ? state = 0 : state = 1;
                this.headerMessageService.changeStateHeaderMessage(this.message, state).subscribe({
                    next: (response) => {
                        if (response.code === 201) {
                            this.toastr.success(response.msg, this.__("global.success"));
                            this.passageService.appelURL(null);
                        } else {
                            this.toastr.error(response.msg, this.__("global.error"));
                        }
                    }
                    ,error: (error) => {
                        this.toastr.error(this.__("global.error"), this.__("global.error"));
                    }
                });
            }
        });
    }

    // Récuperation des données via plocal
    recupererDonnee(){
        // Récupérer la liste affichée dans le tableau depuis le localStorage.
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
        this.list_message = result.data;
        console.log("Liste des messages", this.list_message);
        
        // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
        const res = this.list_message.filter(_ => _.rowid == this.idMessage);
        this.message = res[0];
        this.expediteur = this.message.expediteur;
        this.txt_messenger = this.message.txt_messenger;
        this.publie_value = this.message.publie_value;
        this.sous_module = this.listSousModules.find(mod => mod.id === this.message.module_id);
    }

    // Fermeture du modal
    closeModal() {
        this.modalRef?.hide();
        this.expediteur = undefined;
        this.txt_messenger = undefined;
        this.publie_value = 0;
    }

}
