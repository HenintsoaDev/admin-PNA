import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-solde-distributeur',
  templateUrl: './solde-distributeur.component.html',
  styleUrls: ['./solde-distributeur.component.scss']
})
export class SoldeDistributeurComponent extends Translatable implements OnInit {

    endpoint : any;
        
    header = [
        {"nomColonne" : this.__('solde_bureau.code'),"colonneTable" : "code","table" : "solde_bureau"},
        {"nomColonne" : this.__('solde_bureau.bureau'),"colonneTable" : "agence","table" : "solde_bureau"},
        {"nomColonne" : this.__('solde_bureau.adresse'),"colonneTable" : "adresse","table" : "solde_bureau"},
        {"nomColonne" : this.__('solde_bureau.solde_wallet'),"colonneTable" : "solde","table" : "solde_bureau", "align": "right"},
        {"nomColonne" : this.__('solde_bureau.solde_carte'),"colonneTable" : "solde_carte","table" : "solde_bureau", "align": "right"},
        {"nomColonne" : this.__('global.action')}
    ];

    objetBody = [
        {'name' : 'code','type' : 'text',},
        {'name' : 'agence','type' : 'text',},
        {'name' : 'adresse','type' : 'text',},
        {'name' : 'solde','type' : 'montant',},
        {'name' : 'solde_carte','type' : 'montant',},
        {'name' :  'state#rowid'}
    ];

    listIcon = [
        {'icon' : 'info','action' : 'info','tooltip' : 'Détail','autority' : 'GBU_6',},
    ];

    subscription: Subscription;

    searchGlobal = ["agence.code","agence.name","agence.adresse"]; 
    dataSolde : any;
    idSolde : any;

    titleModal: string = "";
    modalRef?: BsModalRef;

    solde_data: any = [];
    solde_global: any;

    @ViewChild('infoSolde') infoSolde: TemplateRef<any> | undefined;

    constructor(
        private passageService: PassageService,
        private modalService: BsModalService,
        private authService: AuthService
    ) {
        super();
    }

    ngOnInit(): void {
        this.passageService.appelURL(null);
        this.endpoint = environment.baseUrl + '/' + environment.solde_distributeur;

        //Event for icon table
        this.subscription = this.passageService.getObservable().subscribe(event => {
            if(event.data){
                this.idSolde = event.data.id;
                if(event.data.action == 'info')
                {this.openModalInfoSolde();} 
        
                // Nettoyage immédiat de l'event
                this.passageService.clear();
            }
        });
    }
    ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
      }
    
    openModalInfoSolde()
    {
        this.recupererDonnee();
        this.titleModal = this.__('solde_bureau.info_solde');
        this.modalRef = this.modalService.show(this.infoSolde, {
            backdrop: 'static',
            keyboard: false
        });
    }

    // Récuperation des données
    recupererDonnee(){
        // Récupérer la liste affichée dans le tableau depuis le localStorage.
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
        this.dataSolde = result.data;

        // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
        const res = this.dataSolde.filter(_ => _.rowid == this.idSolde);
        if(res.length != 0){
            this.dataSolde = res[0];
        }
    }

    // Fermeture du modal
    closeModal() {
        this.modalRef?.hide();
    }

    async exportExcel(fileName) {
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
    
        this.solde_data = result.data;
        this.solde_global = result.solde_global;
        
        this.authService.exportExcel(this.print(this.solde_data),this.__("solde_distributeur.list_solde_distributeur")).then(
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
    
        this.solde_data = result.data;
        this.solde_global = result.solde_global;
        
        this.authService.exportPdf(this.print(this.solde_data),this.__("solde_bureau.list_solde_bureau")).then(
            (response: any)=>{},
            (error:any)=>{console.log(error)}
        );
    }

    print(soldes:any[]){
        const tab = soldes.map((solde: any, index: number) => {
            const t: any = {};
                t[this.__('solde_bureau.code')] = solde.code;
                t[this.__('solde_bureau.bureau')] = solde.agence;
                t[this.__('solde_bureau.adresse')] = solde.adresse;
                t[this.__('solde_bureau.solde_wallet')] = solde.solde;;
                t[this.__('solde_bureau.solde_carte')] = solde.solde_carte;;
            return t;
        });

        // puis ajouter les totaux à la fin
        tab.push({
            [this.__('solde_bureau.code')]: '',
            [this.__('solde_bureau.bureau')]: '',
            [this.__('solde_bureau.adresse')]: '',
            [this.__('solde_bureau.solde_wallet')]: this.__('global.total_wallet') + ": " + (this.solde_global?.total_solde ?? 0) ,
            [this.__('solde_bureau.solde_carte')]: this.__('global.total_carte') + ": " + (this.solde_global?.total_solde_carte ?? 0),
        });

        return tab;
    }

}
