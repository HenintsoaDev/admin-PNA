import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HistoriqueVirementsService } from 'app/services/admin/gestion-compte-principal/historique-virement.service';
import { PassageService } from 'app/services/table/passage.service';
import { Auth } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-historique-virements',
  templateUrl: './historique-virements.component.html',
  styleUrls: ['./historique-virements.component.scss']
})
export class HistoriqueVirementsComponent extends Translatable implements OnInit {

    endpoint = "";
    header = [
        {"nomColonne" : this.__('global.date'),"colonneTable" : "datevirement","table" : "virement"},
        {"nomColonne" : this.__('global.montant'),"colonneTable" : "montant","table" : "virement", "align": "right"},
        {"nomColonne" : this.__('global.statut'),"colonneTable" : "statut","table" : "virement"},
        {"nomColonne" : this.__('global.date') +" "+ this.__('global.validation'),"colonneTable" : "datevalidation","table" : "virement"},
        {"nomColonne" : this.__('suivi_compte.type_compte'),"colonneTable" : "wallet_carte","table" : "virement"},
        {"nomColonne" : this.__('global.action')}
    ];

    objetBody = [
        {'name' : 'date_virement','type' : 'text',},
        {'name' : 'montant','type' : 'montant',},
        {'name' : 'statut','type' : 'statut',},
        {'name' : 'date_validation','type' : 'text',},
        {'name' : 'wallet_carte','type' : 'text',},
        {'name' :  'state#rowid'}
    ];

    listIcon = [
        {'icon' : 'edit','action' : 'edit','tooltip' : 'Modification','autority' : 'GCP_5',},
        {'icon' : 'check','action' : 'validation','tooltip' : 'Valider','autority' : 'GCP_6',},
        {'icon' : 'close','action' : 'rejeter','tooltip' : 'Rejeter','autority' : 'GCP_7',},
        {'icon' : 'delete','action' : 'delete','tooltip' : 'Supprimer','autority' : 'GCP_8',},
    ];

    searchGlobal = [ 'virement.datevirement', 'virement.datevalidation', 'virement.user_crea','virement.user_validation']; 
    subscription: Subscription;
    idVirement : number;

    soldeVirementCP: string;
    soldeVirementCarteCp: string;

    typeCompte: string = "2";
    dateDebut: string = "" //new Date().toISOString().substring(0, 10);
    dateFin: string = ""//new Date().toISOString().substring(0, 10);
    walletCarteProfil : string = "2";

    dataVirement : any;
    typeCompteSelectedUpdate : any;
    montantCompteUpdate : any;

    typeCompteSelectedAdd : any;
    montantCompteAdd : any;

    virement_data: any = [];
    virement_totaux: any;

    titleModal: string = "";
    modalRef?: BsModalRef;

    loadingSendBtn : boolean = false;

    @ViewChild('updateVirement') updateVirement: TemplateRef<any> | undefined;

    userStorage: Auth;

    constructor(
        private passageService: PassageService,
        private toastr: ToastrService,
        private datePipe: DatePipe, 
        private hitsoriqueVirementService : HistoriqueVirementsService,
        private modalService: BsModalService,
        private authService: AuthService
    ) {
        super();
    }

    ngOnInit(): void {
        this.authService.initAutority("GCP","ADM");
        this.passageService.appelURL(null);
        this.endpoint = environment.baseUrl + '/' + environment.historique_virement;

        const soldeLocalCP = localStorage.getItem(environment.soldeVirementCp);
        const soldeCarteLocalCP = localStorage.getItem(environment.soldeVirementCarteCp);

        this.soldeVirementCP = (soldeLocalCP) ? soldeLocalCP : undefined;
        this.soldeVirementCarteCp = (soldeCarteLocalCP) ? soldeCarteLocalCP : undefined;

        //Event for icon table
        this.subscription = this.passageService.getObservable().subscribe(event => {
            if(event.data){
                this.idVirement = event.data.id;
    
                if(event.data.action == 'edit') this.openModalUpdateVirement();
                else if(event.data.action == 'validation') this.openModalValidateVirement();
                else if(event.data.action == 'rejeter') this.openModalRejetVirement();
                else if(event.data.action == 'delete') this.openModalDeleteVirement();
        
                // Nettoyage immédiat de l'event
                this.passageService.clear();  // ==> à implémenter dans ton service
            }
        });
    }


    ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
    }
  
    filtreTableau()
    {
        let filtre_search = "" ; 
        if(this.typeCompte != '2'){
            filtre_search = ",virement.wallet_carte|e|"+this.typeCompte;
        }

        const date_debut = this.datePipe.transform(this.dateDebut, 'yyyy-MM-dd');
        const date_fin = this.datePipe.transform(this.dateFin, 'yyyy-MM-dd');
      
        let filtreDate = "" ;
        if(date_debut && date_fin){
            if( date_debut > date_fin ){
              this.toastr.warning(this.__('msg.dateDebut_dateFin_error'),this.__("msg.warning"));
              return;
            }else{
              filtreDate = "&date_debut="+date_debut +"&date_fin="+date_fin;
            }
        }
        
        const filtreParMulti =  filtre_search + filtreDate + "&_order_=desc,date_transaction";
        this.passageService.appelURL(filtreParMulti);
    }

    //Validate virement
    openModalValidateVirement() {
        Swal.fire({
            title: this.__("global.confirmation"),
            text: this.__("virement.validate_virement") + " ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.__("virement.oui_valider"),
            cancelButtonText: this.__("global.cancel"),
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal-button--confirm-custom',
                cancelButton: 'swal-button--cancel-custom'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                this.hitsoriqueVirementService.validerVirement(this.idVirement).subscribe({
                    next: (res) => {
                        if(res['code'] == 201) {
                            this.toastr.success(res['msg'], this.__("global.success"));
                            this.actualisationTableau();
                        }
                        else{
                            this.toastr.error(res['msg'], this.__("global.error"));
                        }                
                    },
                    error: (err) => {}
                });
            }
        });
    }

    //Rejet virement
    openModalRejetVirement() {
        Swal.fire({
            title: this.__("global.confirmation"),
            text: this.__("virement.rejet_virement") + " ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.__("virement.oui_rejeter"),
            cancelButtonText: this.__("global.cancel"),
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal-button--confirm-custom',
                cancelButton: 'swal-button--cancel-custom'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                this.hitsoriqueVirementService.rejeterVirement(this.idVirement).subscribe({
                    next: (res) => {
                        if(res['code'] == 201) {
                            this.toastr.success(res['msg'], this.__("global.success"));
                            this.actualisationTableau();
                        }
                        else{
                            this.toastr.error(res['msg'], this.__("global.error"));
                        }                
                    },
                    error: (err) => {}
                });
            }
        });
    }

    // Suppression virement
    openModalDeleteVirement() {
    
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
                
                this.hitsoriqueVirementService.deleteVirement(this.idVirement).subscribe({
                    next: (res) => {
                        if(res['code'] == 204) {
                            this.toastr.success(res['msg'], this.__("global.success"));
                            this.actualisationTableau();
                        }
                        else{
                            this.toastr.error(res['msg'], this.__("global.error"));
                        }                
                    },
                    error: (err) => {}
                });
    
            }
        });
    
    }

    //New virement
    openModalAddVirement(template: TemplateRef<any>) {
        this.titleModal = this.__('virement.add');
        this.modalRef = this.modalService.show(template, {
            backdrop: 'static',
            keyboard: false
        });
    }

    //Update virement
    openModalUpdateVirement() {
        this.recupererDonnee();
        this.titleModal = this.__('virement.update');
        this.modalRef = this.modalService.show(this.updateVirement, {
            backdrop: 'static',
            keyboard: false
        });
    }

    // Actualisation des données
    actualisationTableau(){
        this.passageService.appelURL('');
    }

    // Récuperation des données
    recupererDonnee(){
        // Récupérer la liste affichée dans le tableau depuis le localStorage.
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
        this.dataVirement = result.data;

        // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
        const res = this.dataVirement.filter(_ => _.rowid == this.idVirement);
        if(res.length != 0){
            this.dataVirement = res[0];
            let montantString = this.dataVirement.montant;
            montantString = montantString.replace(/\s/g, '');
            montantString = montantString.replace(',', '.');
            this.montantCompteUpdate = parseFloat(montantString);
            this.typeCompteSelectedUpdate = (this.dataVirement.wallet_carte == 'Wallet') ? "0" : "1";
        }
    }

    //New virement
    sendAdd() {
        Swal.fire({
            title: this.__("global.confirmation"),
            text: this.__("virement.confirm_add_virement") + " ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.__("virement.oui_add"),
            cancelButtonText: this.__("global.cancel"),
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal-button--confirm-custom',
                cancelButton: 'swal-button--cancel-custom'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                this.loadingSendBtn = true;
                this.hitsoriqueVirementService.addVirement(this.montantCompteAdd,this.typeCompteSelectedAdd).subscribe({
                    next: (res) => {
                        this.closeModal();
                        if(res['code'] == 201) {
                            this.toastr.success(res['msg'], this.__("global.success"));
                            this.actualisationTableau();
                            this.montantCompteAdd = undefined;
                            this.typeCompteSelectedAdd = undefined;
                        }
                        else{
                            this.toastr.error(res['msg'], this.__("global.error"));
                        }              
                        this.loadingSendBtn = false;  
                    },
                    error: (err) => {this.loadingSendBtn = false;}
                });
            }
        });
        
    }

    //Update virement
    sendUpdate()
    {

        Swal.fire({
            title: this.__("global.confirmation"),
            text: this.__("virement.confirm_update_virement") + " ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.__("virement.oui_update"),
            cancelButtonText: this.__("global.cancel"),
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal-button--confirm-custom',
                cancelButton: 'swal-button--cancel-custom'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                this.loadingSendBtn = true;
                this.hitsoriqueVirementService.updateVirement(this.dataVirement.rowid,this.montantCompteUpdate,this.typeCompteSelectedUpdate).subscribe({
                    next: (res) => {
                        this.closeModal();
                        if(res['code'] == 201) {
                            this.toastr.success(res['msg'], this.__("global.success"));
                            this.actualisationTableau();
                            this.montantCompteUpdate = undefined;
                            this.typeCompteSelectedUpdate = undefined;
                        }
                        else{
                            this.toastr.error(res['msg'], this.__("global.error"));
                        }   
                        this.loadingSendBtn = false;             
                    },
                    error: (err) => {this.loadingSendBtn = false; }
                });
            }
        });
        
    }

    // Fermeture du modal
    closeModal() {
        this.modalRef?.hide();
    }

    async exportExcel() {
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
    
        this.virement_data = result.data;
        this.virement_totaux = result.totaux;

        const date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
        const date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');
    
        let title = this.__("virement.list_virement") + ' ' ;

        const mapTypeCompte: { [key: string]: string } = { '0': "("+this.__("global.wallet") + ")", '1': "("+this.__("global.carte")+ ")",};

          
        title += mapTypeCompte[this.typeCompte] || '';

        title += (date_debut != null ? " " + this.__("suivi_compte.from") + ' ' + date_debut + ' ' : '');       
        title += (date_fin != null ? " " + this.__("suivi_compte.TO") + ' ' + date_fin + ' ' : '');    
        
        
        console.log(title);
        
        
        this.authService.exportExcel(this.print(this.virement_data), title).then(
            (response: any)=>{
                console.log('respons beee',response)
                    const a = document.createElement("a"); 
                    a.href = response.data;
                    a.download = `${title}.xlsx`;
                    a.click(); 
            },
            (error:any)=>{console.log(error)}
        );
    }

    async exportPdf() {
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
    
        this.virement_data = result.data;
        this.virement_totaux = result.totaux;


        const date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
        const date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');
    
        let title = this.__("virement.list_virement") + ' ' ;

        const mapTypeCompte: { [key: string]: string } = { '0': "("+this.__("global.wallet") + ")", '1': "("+this.__("global.carte")+ ")",};

          
        title += mapTypeCompte[this.typeCompte] || '';

        title += (date_debut != null ? " " + this.__("suivi_compte.from") + ' ' + date_debut + ' ' : '');       
        title += (date_fin != null ? " " + this.__("suivi_compte.to") + ' ' + date_fin + ' ' : '');    
        
        
        
        
        this.authService.exportPdf(this.print(this.virement_data), title).then(
            (response: any)=>{},
            (error:any)=>{console.log(error)}
        );
    }

    print(virements:any[]){
        const tab = virements.map((virement: any, index: number) => {
            const t: any = {};
                t[this.__('global.date') + " " + this.__('global.of') + " " + this.__('global.virement')] = virement.date_virement;
                t[this.__('global.montant')] = virement.montant;
                t[this.__('global.user_creation')] = virement.user_crea;
                t[this.__('global.statut')] = (virement.statut == 0) ? "En attente de validation" : (virement.statut == 1) ? "Validé" : "Rejeté";
                t[this.__('global.user_validation')] = virement.user_validation;
                t[this.__('global.date') + " " + this.__('global.of') + " " + this.__('global.validation')] = virement.date_validation;
                t[this.__('suivi_compte.type_compte')] = virement.wallet_carte;
            return t;
        });

        // puis ajouter les totaux à la fin
        tab.push({
          [this.__('global.date') + " " + this.__('global.of') + " " + this.__('global.virement')]: '',
          [this.__('global.montant')]: this.__('virement.total_carte') + ": " + (this.virement_totaux?.Carte ?? 0),
          [this.__('global.user_creation')]: '',
          [this.__('global.statut')]: '',
          [this.__('global.user_validation')]: '',
          [this.__('global.date') + " " + this.__('global.of') + " " + this.__('global.validation')]: this.__('virement.total_wallet') + ": " + (this.virement_totaux?.Wallet ?? 0),
          [this.__('suivi_compte.type_compte')]: '',
        });

        return tab;
    }

}
