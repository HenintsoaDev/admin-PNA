import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BureauService } from 'app/services/admin/gestion-bureau/bureau.service';
import { AuthService } from 'app/services/auth.service';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-releve-solde-bureau',
  templateUrl: './releve-solde-bureau.component.html',
  styleUrls: ['./releve-solde-bureau.component.scss']
})
export class ReleveSoldeBureauComponent extends Translatable implements OnInit {

    endpoint = "";
    header = [
        {"nomColonne" :  this.__('suivi_compte.date'),"colonneTable" : "date_transaction","table" : "releve_solde_agence"},
        {"nomColonne" :  this.__('suivi_compte.num_transac'),"colonneTable" : "num_transac","table" : "releve_solde_agence"},
        {"nomColonne" :  this.__('suivi_compte.solde_avant'),"colonneTable" : "solde_avant","table" : "releve_solde_agence", "align": "right"},
        {"nomColonne" :  this.__('suivi_compte.montant'),"colonneTable" : "montant","table" : "releve_solde_agence", "align": "right"},
        {"nomColonne" :  this.__('suivi_compte.solde_apres'),"colonneTable" : "solde_apres","table" : "releve_solde_agence", "align": "right"},
        {"nomColonne" :  this.__('suivi_compte.operation'),"colonneTable" : "operation","table" : "releve_solde_agence"},
        {"nomColonne" :  this.__('suivi_compte.coms'),"colonneTable" : "commentaire","table" : "releve_solde_agence"},
        {"nomColonne" :  this.__('suivi_compte.type_compte'),"colonneTable" : "wallet_carte","table" : "releve_solde_agence"}
    ];

    objetBody = [
        {'name' : 'date_transaction','type' : 'text',},
        {'name' : 'num_transac','type' : 'text',},
        {'name' : 'solde_avant','type' : 'montant',},
        {'name' : 'montant','type' : 'text',},
        {'name' : 'solde_apres','type' : 'montant',},
        {'name' : 'operation','type' : 'text',},
        {'name' : 'commentaire','type' : 'text',},
        {'name' : 'wallet_carte','type' : 'text',}
    ]

    listIcon = [];
    searchGlobal = [ 'releve_solde_agence.date_transaction', 'releve_solde_agence.operation', 'releve_solde_agence.commentaire','releve_solde_agence.wallet_carte']
    
    subscription: Subscription;

    typeCompte: string;
    dateDebut: string; //new Date().toISOString().substring(0, 10);
    dateFin: string; //new Date().toISOString().substring(0, 10);
    walletCarteProfil : string = "2";

    listBureauActive = [];
    agenceId : any;

    showDataTable = false;
    loadingData = false;
    searchControl = new FormControl('');
    filteredBureau = []

    releve_data: any = [];
    releve_totaux: any;
listShow: any = false;

    constructor(
        private passageService: PassageService,
        private toastr: ToastrService, 
        private authService: AuthService,
        private datePipe: DatePipe,
        private bureauService : BureauService
    ) {
        super();
    }

    ngOnInit(): void {
        this.endpoint = environment.baseUrl + '/' + environment.releve_solde_bureau; 
        //this.passageService.clear();
        
        this.bureauService.getAgenceBureauActive().subscribe({
            next: (res) => {
                if(res['code'] == 200) {
                    console.log(res);
                    this.listBureauActive = res['data'];
                    this.filteredBureau = this.listBureauActive;
                }
                else{
                    this.toastr.error(res['msg'], this.__("global.error"));
                }               
            },
            error: (err) => {}
        });


        this.passageService.clear();

        /***************************************** */
           // Écouter les changements de modal à travers le service si il y a des actions
           this.subscription = this.passageService.getObservable().subscribe(event => {
   
             if( event.data){
   
               // Nettoyage immédiat de l'event
               this.passageService.clear();  // ==> à implémenter dans ton service
         
             }
            
           
       });
       /***************************************** */




        
        this.searchControl.valueChanges.subscribe(value => {
            const lower = value?.toLowerCase() || '';
            this.filteredBureau = this.listBureauActive.filter(bureau =>
                bureau.name.toLowerCase().includes(lower)
            );
        });
    }
    ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
    }
    
    async filtreTableau() {
        
        this.listShow = true;
        let filtre_search = "" ;
        filtre_search = ",releve_solde_agence.wallet_carte|e|"+this.typeCompte;

        const date_debut = this.datePipe.transform(this.dateDebut, 'yyyy-MM-dd');
        const dateFin = this.datePipe.transform(this.dateFin, 'yyyy-MM-dd');
      
        let filtreDate = "" ;
        if(this.dateDebut && this.dateFin){
            if( this.dateDebut > this.dateFin ){
              this.toastr.warning(this.__('msg.dateDebut_dateFin_error'),this.__("msg.warning"));
              return;
            }else{
              filtreDate = "&date_debut="+date_debut +"&date_fin="+dateFin;
            }
        }
        
        this.loadingData = true;
        this.showDataTable = false;
        const filtreParMulti =  filtre_search + filtreDate + "&__order__=desc,date_transaction&agence=" + this.agenceId;
        await this.passageService.appelURL(filtreParMulti);
        this.loadingData = false;
        this.showDataTable = true;

    }

    async exportExcel(fileName) {
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
    
        this.releve_data = result.data;
        this.releve_totaux = result.totaux;

        const date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
        const date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');
    
        let title = this.__("releve_solde_bureau.list_releve") + ' ' ;


        const resultat = this.listBureauActive.filter(_ => _.rowid == this.agenceId);
        const agenceName = resultat[0].name;
        
        title += " : " + agenceName + " " ;

        const mapTypeCompte: { [key: string]: string } = { '0': "("+this.__("global.wallet") + ")", '1': "("+this.__("global.carte")+ ")",};
        title += mapTypeCompte[this.typeCompte] || '';
        title += (date_debut != null ? " " + this.__("suivi_compte.from") + ' ' + date_debut + ' ' : '');       
        title += (date_fin != null ? " " + this.__("suivi_compte.to") + ' ' + date_fin + ' ' : '');    
        

        
        this.authService.exportExcel(this.print(this.releve_data), title).then(
            (response: any)=>{
                    const a = document.createElement("a"); 
                    a.href = response.data;
                    a.download = `${title}.xlsx`;
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

        const date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
        const date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');
    
        let title = this.__("releve_solde_bureau.list_releve") + ' ' ;
        const resultat = this.listBureauActive.filter(_ => _.rowid == this.agenceId);
        const agenceName = resultat[0].name;

        title += " : " + agenceName + " " ;

        const mapTypeCompte: { [key: string]: string } = { '0': "("+this.__("global.wallet") + ")", '1': "("+this.__("global.carte")+ ")",};
          
        title += mapTypeCompte[this.typeCompte] || '';
        title += (date_debut != null ? " " + this.__("suivi_compte.from") + ' ' + date_debut + ' ' : '');       
        title += (date_fin != null ? " " + this.__("suivi_compte.to") + ' ' + date_fin + ' ' : '');    
        
        
        this.authService.exportPdf(this.print(this.releve_data), title).then(
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

}
