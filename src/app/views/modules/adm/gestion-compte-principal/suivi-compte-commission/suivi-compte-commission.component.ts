import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-suivi-compte-commission',
  templateUrl: './suivi-compte-commission.component.html',
  styleUrls: ['./suivi-compte-commission.component.scss']
})
export class SuiviCompteCommissionComponent extends Translatable implements OnInit {

    typeCommission : any;
    typeCompte : string = "2";
    dateDebut : any;
    dateFin : any;
    endpoint : string = "";
    showTableSuivi = false;

    header = [
        {"nomColonne" : this.__('suivi_compte.date'),"colonneTable" : "date_transaction","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.num_transac'),"colonneTable" : "num_transac","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.solde_avant'),"colonneTable" : "solde_avant","table" : "releve_compte_commission", "align": "right"},
        {"nomColonne" :  this.__('suivi_compte.montant'),"colonneTable" : "montant","table" : "releve_compte_commission", "align": "right"},
        {"nomColonne" :  this.__('suivi_compte.solde_apres'),"colonneTable" : "solde_apres","table" : "releve_compte_commission", "align": "right"},
        {"nomColonne" :  this.__('suivi_compte.operation'),"colonneTable" : "operation","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.coms'),"colonneTable" : "commentaire","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.type_compte'),"colonneTable" : "wallet_carte","table" : "releve_compte_commission"}
    ];

    
    objetBody = [
        {'name' : 'date_transaction','type' : 'text',},
        {'name' : 'num_transac','type' : 'text',},
        {'name' : 'solde_avant','type' : 'montant',},
        {'name' : 'montant','type' : 'montant',},
        {'name' : 'solde_apres','type' : 'montant',},
        {'name' : 'operation','type' : 'text',},
        {'name' : 'commentaire','type' : 'text',},
        {'name' : 'wallet_carte','type' : 'text',}
    ];

    listIcon = [];
    searchGlobal = [
        'releve_compte_commission.date_transaction',
        'releve_compte_commission.num_transac',  
        'releve_compte_commission.operation', 
        'releve_compte_commission.commentaire',
        'releve_compte_commission.wallet_carte'
    ]; 

    soldeCarteParametrable: string;
    soldeWalletCarteParametrable: string;

    suivi_comptes: any = [];
    suivi_comptes_totaux: any;

    constructor(
        private passageService: PassageService,
        private toastr: ToastrService,
        private datePipe: DatePipe, 
        private authService: AuthService
    ) {
        super();
    }

    async  ngOnInit() {
        this.endpoint = environment.baseUrl + '/' + environment.suivi_compte_commission; 
    }

    afficheSolde(){
        const soldeCarteParametrable = localStorage.getItem(environment.soldeCarteParametrable);
        const soldeWalletParametrable = localStorage.getItem(environment.soldeWalletCarteParametrable);
  
        this.soldeCarteParametrable = (soldeCarteParametrable) ? soldeCarteParametrable : undefined;
        this.soldeWalletCarteParametrable = (soldeWalletParametrable) ? soldeWalletParametrable : undefined;
    }

    searchSuiviDefault()
    {
        const type_commission = "&type_service="+this.typeCommission;
        const filtreParMulti =  type_commission + "&__order__=desc,date_transaction";
        this.typeCompte = "2";
        this.dateDebut = undefined;
        this.dateFin = undefined;
        this.passageService.appelURL(filtreParMulti);
        setTimeout(()=>{this.afficheSolde();},2000)
        this.showTableSuivi = true;
    }

    filtreTableau()
    {
        const type_commission = "&type_service="+this.typeCommission;
        let filtre_search = "" ;
        if(this.typeCompte != '2'){
            filtre_search = ",releve_compte_commission.wallet_carte|e|"+this.typeCompte;
        }

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
        
        const filtreParMulti =  filtre_search + filtreDate + "&__order__=desc,date_transaction" + type_commission;
        this.passageService.appelURL(filtreParMulti);
    }

    backSelectCommission()
    {
        this.showTableSuivi = false;
    }

    async exportExcel(fileName) {

        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
        
        this.suivi_comptes = result.data;
        this.suivi_comptes_totaux = result.totaux;

        const date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
        const date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');
    
        let title = this.__("suivi_compte.title_export") + ' ' ;
        title  += this.typeCommission == 1 ?  " " + this.__("suivi_commission.hors_paiement_masse") :  " " + this.__("operation_compte.paiement_masse")

        const mapTypeCompte: { [key: string]: string } = { '0': "("+this.__("global.wallet") + ")", '1': "("+this.__("global.carte")+ ")",};

          
        title += mapTypeCompte[this.typeCompte] || '';

        title  += " " + this.__("suivi_compte.from") + ' ' + date_debut  + ' '
        title  += this.__("suivi_compte.to") + ' ' + date_fin
        
        
        this.authService.exportExcel(this.print(this.suivi_comptes),title).then(
            (response: any)=>{
                const a = document.createElement("a"); 
                a.href = response.data;
                a.download = `${fileName}.xlsx`;
                a.click(); 
            },
            (error:any)=>{}
        );
    }

    async exportPdf(fileName) {
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);

        this.suivi_comptes = result.data;
        this.suivi_comptes_totaux = result.totaux;

        const date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
        const date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');
    
        let title = this.__("suivi_compte.title_export") + ' ' ;
        title  += this.typeCommission == 1 ?  " " + this.__("suivi_commission.hors_paiement_masse") :  " " + this.__("operation_compte.paiement_masse")

        const mapTypeCompte: { [key: string]: string } = { '0': "("+this.__("global.wallet") + ")", '1': "("+this.__("global.carte")+ ")",};

        title += mapTypeCompte[this.typeCompte] || '';

        title += (date_debut != null ? " " + this.__("suivi_compte.from") + ' ' + date_debut + ' ' : '');       
        title += (date_fin != null ? " " + this.__("suivi_compte.to") + ' ' + date_fin + ' ' : '');    
        
        
        this.authService.exportPdf(this.print(this.suivi_comptes), title).then(
            (response: any)=>{},
            (error:any)=>{}
        );
    }

    print(suivis:any[]){

        const tab = suivis.map((suivi: any, index: number) => {
            const t: any = {};
            t[this.__('suivi_compte.date')] = suivi.date_transaction;
            t[this.__('suivi_compte.num_transac')] = suivi.num_transac;
            t[this.__('suivi_compte.solde_avant')] = suivi.solde_avant;
            t[this.__('suivi_compte.montant')] = suivi.montant;
            t[this.__('suivi_compte.solde_apres')] = suivi.solde_apres;
            t[this.__('suivi_compte.operation')] = suivi.operation;
            t[this.__('suivi_compte.coms')] = suivi.commentaire;
            t[this.__('suivi_compte.type_compte')] = suivi.wallet_carte;
                  
            return t;
        });

        // puis ajouter les totaux à la fin
        tab.push({
            [this.__('suivi_compte.date')]: '',
            [this.__('suivi_compte.num_transac')]: '',
            [this.__('suivi_compte.solde_avant')]: this.__('global.total_debit'),
            [this.__('suivi_compte.montant')]: this.suivi_comptes_totaux?.DEBIT ?? 0,
            [this.__('suivi_compte.solde_apres')]: '',
            [this.__('suivi_compte.operation')]: this.__('global.total_credit'),
            [this.__('suivi_compte.coms')]: this.suivi_comptes_totaux?.CREDIT ?? 0,
            [this.__('suivi_compte.type_compte')]: '',
        });

        return tab;
    
    }

}
