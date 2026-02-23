import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PartenaireFinancierService } from 'app/services/admin/gestion-commission/partenaire-financier.service';
import { AuthService } from 'app/services/auth.service';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-partenaire-financier',
  templateUrl: './partenaire-financier.component.html',
  styleUrls: ['./partenaire-financier.component.scss']
})
export class PartenaireFinancierComponent extends Translatable implements OnInit {

    endpoint : any;
            
    header = [
        {"nomColonne" : this.__('global.name'),"colonneTable" : "nom","table" : "partenaire_financier"},
        {"nomColonne" : this.__('utilisateur.email'),"colonneTable" : "email","table" : "partenaire_financier"},
        {"nomColonne" : this.__('global.solde_wallet'),"colonneTable" : "solde","table" : "partenaire_financier", "align": "right"},
        {"nomColonne" : this.__('global.solde_carte'),"colonneTable" : "solde_carte","table" : "partenaire_financier", "align": "right"},
        {"nomColonne" : this.__('global.state'),"colonneTable" : "etat","table" : "partenaire_financier"},
        {"nomColonne" : ""}
    ];

    objetBody = [
        {'name' : 'nom','type' : 'text',},
        {'name' : 'email','type' : 'text',},
        {'name' : 'solde','type' : 'montant',},
        {'name' : 'solde_carte','type' : 'montant',},
        {'name' : 'state_label','type' : 'text',},
        {'name' : 'id'}
    ];

    listIcon = [
        {'icon' : 'info','action' : 'info','tooltip' : 'Détail','autority' : 'GCR_4',},
    ];

    subscription: Subscription;
    searchGlobal = ["partenaire_financier.nom","partenaire_financier.email"]; 

    titleModal : string = "";
    modalRef?: BsModalRef;

    code : string;
    namePartenaire : string;
    mailPartenaire : string;
    isWalletCarte : number;
    wallet_carte : string = "WC";

    tauxCommissionSunupaye : number;
    tauxCommissionService : number;

    tauxCommissionSunupayeCarte : number;
    tauxCommissionServiceCarte : number;

    solde_wallet : number;
    solde_carte : number;
    statePartenaire : string;

    showListPartenaire : boolean = true;
    loading: boolean = false;
    
    idPartenaire : any;

    //Filtre data
    typeCompte: string = "2";
    dateDebut: string = "" //new Date().toISOString().substring(0, 10);
    dateFin: string = ""//new Date().toISOString().substring(0, 10);
    typeService : string = "2";

    @ViewChild('newPartenaire') newPartenaire: TemplateRef<any> | undefined;
    @ViewChild('updatePartenaire') updatePartenaire: TemplateRef<any> | undefined;

    /** DATA TABLE POUR L'HISTORIQUE MOUVEMENT COMPTE */
    endpointMouvementCompte = "";
    headerMouvementCompte = [
        {"nomColonne" : this.__('suivi_compte.date'),"colonneTable" : "date_transaction","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.num_transac'),"colonneTable" : "num_transac","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.solde_avant'),"colonneTable" : "solde_avant","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.montant'),"colonneTable" : "montant","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.solde_apres'),"colonneTable" : "solde_apres","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.operation'),"colonneTable" : "operation","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.coms'),"colonneTable" : "commentaire","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.type_compte'),"colonneTable" : "wallet_carte","table" : "releve_compte_commission"}
    ];
    objetBodyMouvementCompte = [
        {'name' : 'date_transaction','type' : 'text',},
        {'name' : 'num_transac','type' : 'text',},
        {'name' : 'solde_avant','type' : 'text',},
        {'name' : 'montant','type' : 'text',},
        {'name' : 'solde_apres','type' : 'text',},
        {'name' : 'operation','type' : 'text',},
        {'name' : 'commentaire','type' : 'text',},
        {'name' : 'wallet_carte','type' : 'text',}
    ];

    listIconMouvementCompte = [];
    searchGlobalMouvementCompte = [
        'releve_compte_commission.date_transaction',
        'releve_compte_commission.num_transac',  
        'releve_compte_commission.operation', 
        'releve_compte_commission.commentaire',
        'releve_compte_commission.wallet_carte'
    ]; 

    releve_data: any = [];
    releve_totaux: any;

    constructor(
        private passageService: PassageService,
        private modalService: BsModalService,
        private partenaireFinancierService: PartenaireFinancierService,
        private toastr: ToastrService,
        private datePipe: DatePipe,
        private authService: AuthService
    ) {
        super()
    }

    async ngOnInit() {
        this.authService.initAutority('GCR','ADM');
        this.passageService.appelURL(null);
        this.endpoint = environment.baseUrl + '/' + environment.partenaire_financier;
        this.endpointMouvementCompte = environment.baseUrl + '/' + environment.suivi_mouvement_partenaire_financier; 
        this.subscription = this.passageService.getObservable().subscribe(event => {
            if(event.data){
                this.idPartenaire = event.data.id;
                if(event.data.action == 'info')
                {
                    //this.showListPartenaire = false;
                    this.getDetailPartenaire(event.data.id);
                    this.passageService.clear();

                } 
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
            filtre_search = ",releve_compte_partenaire.wallet_carte|e|"+this.typeCompte;
        }

        let filtre_service = "" ;
        if(this.typeService != '2'){
            filtre_service = ",releve_compte_partenaire.type_service|e|"+this.typeService;
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
        
        const filtreParMulti =  filtre_search + filtre_service + filtreDate + "&_order_=desc,date_transaction";
        this.passageService.appelURL(filtreParMulti);
    }

    openModalAddPartenaire()
    {
        this.titleModal = this.__('partenaire.add_new_partenaire');
        this.modalRef = this.modalService.show(this.newPartenaire, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'
        });
    }

    openModalUpdatePartenaire()
    {
        this.titleModal = this.__('partenaire.update_new_partenaire');
        this.modalRef = this.modalService.show(this.updatePartenaire, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'
        });
    }

    sendNewPartenaire()
    {

        if(this.wallet_carte == 'W') {
            this.isWalletCarte = 0;
            this.tauxCommissionServiceCarte = 0;
            this.tauxCommissionSunupayeCarte = 0;
        }
        else if(this.wallet_carte == 'C') {
            this.isWalletCarte = 1;
            this.tauxCommissionService = 0;
            this.tauxCommissionSunupaye = 0;
        }
        else if(this.wallet_carte == 'WC') this.isWalletCarte = 2;

        this.partenaireFinancierService.addPartenaire({
            'code' : this.code,
            'nom' : this.namePartenaire,
            'email' : this.mailPartenaire,
            'taux_commission_service' : this.tauxCommissionService,
            'taux_commission_service_carte' : this.tauxCommissionServiceCarte,
            'taux_commission_sunupaye' : this.tauxCommissionSunupaye,
            'taux_commission_sunupaye_carte' : this.tauxCommissionSunupayeCarte,
            'wallet_carte' : this.isWalletCarte
        }).subscribe((response) => {
            if (response['code'] == 201) {
                this.passageService.appelURL(this.endpoint);
                this.toastr.success(response.msg, this.__("global.success"));
                this.closeModal();
            }else{
                this.toastr.error(response.msg, this.__("global.error"));
            }
        });
    }

    sendUpdatePartenaire(){

        if(this.wallet_carte == 'W') {
            this.isWalletCarte = 0;
            this.tauxCommissionServiceCarte = 0;
            this.tauxCommissionSunupayeCarte = 0;
        }
        else if(this.wallet_carte == 'C') {
            this.isWalletCarte = 1;
            this.tauxCommissionService = 0;
            this.tauxCommissionSunupaye = 0;
        }
        else if(this.wallet_carte == 'WC') this.isWalletCarte = 2;
        
        this.loading = true;
        this.partenaireFinancierService.updatePartenaire(this.idPartenaire,{
            'code' : this.code,
            'nom' : this.namePartenaire,
            'email' : this.mailPartenaire,
            'taux_commission_service' : this.tauxCommissionService,
            'taux_commission_service_carte' : this.tauxCommissionServiceCarte,
            'taux_commission_sunupaye' : this.tauxCommissionSunupaye,
            'taux_commission_sunupaye_carte' : this.tauxCommissionSunupayeCarte,
            'wallet_carte' : this.isWalletCarte
        }).subscribe((response) => {
            if (response['code'] == 201) {
                //this.passageService.appelURL(this.endpoint);
                this.toastr.success(response.msg, this.__("global.success"));
                this.closeModal();
            }else{
                this.toastr.error(response.msg, this.__("global.error"));
            }
            this.loading = false;
        });
    }

    getDetailPartenaire(id){
        this.loading = true;
        this.partenaireFinancierService.getDetailPartenaire(id).subscribe((response) => {
            if (response['code'] == 200) {
                this.code = response.data.code;
                this.namePartenaire = response.data.nom;
                this.mailPartenaire = response.data.email;
                this.tauxCommissionService = response.data.taux_commission_service;
                this.tauxCommissionSunupaye = response.data.taux_commission_sunupaye;
                this.tauxCommissionServiceCarte = response.data.taux_commission_service_carte;
                this.tauxCommissionSunupayeCarte = response.data.taux_commission_sunupaye_carte;



                if(response.data.walet_carte == 0) this.wallet_carte = 'W';
                else if(response.data.walet_carte == 1) this.wallet_carte = 'C' ;
                else if(response.data.walet_carte == 2) this.wallet_carte = 'WC' ;



                this.solde_wallet = response.data.solde_wallet;
                this.solde_carte = response.data.solde_carte;
                this.statePartenaire = response.data.state;
                this.showListPartenaire = false; 
            }else{
                this.toastr.error(response.msg, this.__("global.error"));
            }
            this.loading = false;
        });
    }

    exportExcel(fileName)
    {
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
    
        this.releve_data = result.data;
        this.releve_totaux = result.totaux;
        
        this.authService.exportExcel(this.print(this.releve_data),this.__("releve_solde_bureau.list_releve")).then(
            (response: any)=>{
                    const a = document.createElement("a"); 
                    a.href = response.data;
                    a.download = `${fileName}.xlsx`;
                    a.click(); 
            },
            (error:any)=>{console.log(error)}
        );
    }

    async exportPdf(fileName) {
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
    
        this.releve_data = result.data;
        this.releve_totaux = result.totaux;
        
        this.authService.exportPdf(this.print(this.releve_data),this.__("releve_solde_bureau.list_releve")).then(
            (response: any)=>{},
            (error:any)=>{console.log(error)}
        );
    }

    print(releves:any[]){
        const tab = releves.map((releve: any, index: number) => {
            const t: any = {};
                t[this.__('suivi_compte.date')] = releve.date_transaction;
                t[this.__('suivi_compte.num_transac')] = releve.num_transac;
                t[this.__('suivi_compte.solde_avant')] = releve.solde_avant;
                t[this.__('suivi_compte.montant')] = releve.montant;
                t[this.__('suivi_compte.solde_apres')] = (releve.statut == 0) ? "En attente de validation" : releve.solde_apres;
                t[this.__('suivi_compte.operation')] = releve.operation;
                t[this.__('suivi_compte.coms')] = releve.commentaire;
                t[this.__('suivi_compte.type_compte')] = releve.wallet_carte;
            return t;
        });

        // puis ajouter les totaux à la fin
        tab.push({
            [this.__('suivi_compte.date')]: '',
            [this.__('suivi_compte.num_transac')]: this.__('global.total_debit') + ": " + (this.releve_totaux?.DEBIT ?? 0),
            [this.__('suivi_compte.solde_avant')]: '',
            [this.__('suivi_compte.montant')]: '',
            [this.__('suivi_compte.solde_apres')]: '',
            [this.__('suivi_compte.operation')]: '',
            [this.__('suivi_compte.coms')]: this.__('global.total_credit') + ": " + (this.releve_totaux?.CREDIT ?? 0),
            [this.__('suivi_compte.type_compte')]: '',
        });

        return tab;
    }

    // Activer ou désactiver un partenaire
    activerPartenaire(state){
        Swal.fire({
            title: this.__('global.confirmation'),
            text: this.__('global.changer_state_?'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: this.__('global.yes'),
            cancelButtonText: this.__('global.no')
        }).then((result) => {
            if (result.isConfirmed) {
                this.loading = true;
                this.partenaireFinancierService.activerPartenaire(this.idPartenaire, state).subscribe((response) => {
                    if (response['code'] == 201) {
                        (state == 0) ? this.statePartenaire = "Désactiver" : this.statePartenaire = "Activer";
                        this.toastr.success(response.msg, this.__("global.success"));
                    }else{
                        this.toastr.error(response.msg, this.__("global.error"));
                    }
                    this.loading = false;
                });
            }
        })
        
    }

    backList(){
        this.code = undefined;
        this.namePartenaire = undefined;
        this.mailPartenaire = undefined;
        this.tauxCommissionService = undefined;
        this.tauxCommissionSunupaye = undefined;
        this.tauxCommissionServiceCarte = undefined;
        this.tauxCommissionSunupayeCarte = undefined;
        this.isWalletCarte = undefined;
        this.solde_wallet = undefined;
        this.solde_carte = undefined;
        this.statePartenaire = undefined;
        this.showListPartenaire = true; 
        this.passageService.appelURL(this.endpoint);
    }

    // Fermeture du modal
    closeModal() {
        this.modalRef?.hide();
    }

    isDisabledByWalletType(wallet: string): boolean {
        if (wallet === 'W') {
          return this.tauxCommissionService == undefined || this.tauxCommissionSunupaye == undefined;
        } else if (wallet === 'C') {
          return this.tauxCommissionServiceCarte == undefined || this.tauxCommissionSunupayeCarte == undefined;
        } else if (wallet === 'WC') {
          return this.tauxCommissionService == undefined || this.tauxCommissionSunupaye == undefined ||
                 this.tauxCommissionServiceCarte == undefined || this.tauxCommissionSunupayeCarte == undefined;
        }
        return true;
      }

}
