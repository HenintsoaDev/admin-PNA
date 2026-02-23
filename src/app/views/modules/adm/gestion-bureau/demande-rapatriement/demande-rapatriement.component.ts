import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { AuthService } from 'app/services/auth.service';
import { PassageService } from 'app/services/table/passage.service';
import { Auth } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import formatNumber from 'number-handler'
import { DemandeRapatriementService } from 'app/services/admin/gestion-bureau/demande-rapatriement.service';

@Component({
  selector: 'app-demande-rapatriement',
  templateUrl: './demande-rapatriement.component.html',
  styleUrls: ['./demande-rapatriement.component.scss']
})
export class DemandeRapatriementComponent extends Translatable implements OnInit {

  endpoint = "";
  header = [
      {"nomColonne" : this.__('demande_rapatriement.date'),"colonneTable" : "date_demande","table" : "demande_rapatriement_bureau"},
      {"nomColonne" :  this.__('demande_rapatriement.num_demande'),"colonneTable" : "num_demande","table" : "demande_rapatriement_bureau"},
      {"nomColonne" :  this.__('demande_rapatriement.ref_demande'),"colonneTable" : "ref_demande","table" : "demande_rapatriement_bureau"},
      {"nomColonne" :  this.__('demande_rapatriement.bureau'),"colonneTable" : "name","table" : "bureau"},
      {"nomColonne" :  this.__('demande_rapatriement.montant'),"colonneTable" : "montant","table" : "demande_rapatriement_bureau", "align": "right"},
      {"nomColonne" :  this.__('demande_rapatriement.demandeur'),"colonneTable" : "nom","table" : "user"},
      {"nomColonne" :  this.__('demande_rapatriement.wallet_carte'),"colonneTable" : "wallet_carte","table" : "demande_credit_bureau"},
      {"nomColonne" : this.__('global.action')}
  ];

  objetBody = [
      {'name' : 'date_demande','type' : 'date',},
      {'name' : 'num_demande','type' : 'text',},
      {'name' : 'ref_demande','type' : 'text',},
      {'name' : 'agence_debiter','type' : 'text',},
      {'name' : 'montant','type' : 'montant',},
      {'name' : 'user_demande','type' : 'montant',},
      {'name' : 'wallet_carte','type' : 'text',},
      {'name' : 'state#rowid'}

  ]

  listIcon = [  
    {
    'icon' : 'info',
    'action' : 'detail',
    'tooltip' : this.__('global.tooltip_detail'),
    'autority' : 'GBU_18',

  },];
  searchGlobal = [ 'demande_rapatriement_bureau.date_demande', 'demande_rapatriement_bureau.num_demande', 'demande_rapatriement_bureau.ref_demande', 'agence.name', 'demande_rapatriement_bureau.montant', 'user.nom']
  subscription: Subscription;
  

  typeCompte: string = "2";
  dateDebut: string = new Date().toISOString().substring(0, 10);
  dateFin: string =  new Date().toISOString().substring(0, 10);
  walletCarteProfil : string = "2";

  //UserStorage
  userStorage: Auth;
  demande_rapatriements: any = [];
  demande_rapatriement: any = [];
  idDemande: number;
  filtre_etat: string = '2';
  listDemandes:any [] = [];
  modalRef?: BsModalRef;
  titleModal: string = "";


  @ViewChild('detailDemandeRapatriement') detailDemandeRapatriement: TemplateRef<any> | undefined;
  showCode: boolean = false;
  index: any = 0;
  bureaux:any [] = [];
  filteredBureau: any[] = [];
  searchControl = new FormControl('');
  bureauId : number;
  montant:string = "";
  wallet_carte:string ="";
  infoBureau: any={};
  info:boolean =false;
  code_validation: any = "";
  isDisabled: boolean = false;
  formatNumber : any = formatNumber;
  triDesc: string = '';
  etatSelect: number = 0;


  constructor(
    private passageService: PassageService,
    private toastr: ToastrService,
    private datePipe: DatePipe, 
    private authService: AuthService,
    private modalService: BsModalService,
    private demandeService :DemandeRapatriementService
    ) {
      super();
  }

  async ngOnInit() {
    this.authService.initAutority("GBU","ADM");

    this.endpoint = environment.baseUrl + '/' + environment.demande_rapatriement;

    this.filtreTableau(0);
    
      this.userStorage = JSON.parse(localStorage.getItem(environment.userItemName) || null);
      this.typeCompte = this.userStorage.info?.wallet_carte.toString();
      this.walletCarteProfil = this.userStorage.info?.wallet_carte.toString();

       /***************************************** */
            // Écouter les changements de modal à travers le service si il y a des actions
            this.subscription = this.passageService.getObservable().subscribe(event => {
    

              if(event.data){
                this.idDemande = event.data.id;
    
                    const action = event.data.action;
                    const state = event.data.state;

                    switch (action) {
                      case 'detail':
                        this.openModalDetailDemande();
                        
                        // Nettoyage immédiat de l'event
                        this.passageService.clear();
                        break;
                    }

                             
              }
             
        });
        /***************************************** */
    

  }


   
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onTabChanged(event: any): void {
    this.index = event.index;
    this.filtreTableau(this.index );
  }

  filtreTableau(etat) {
    this.etatSelect = etat;



     if(etat == 0) {
      this.objetBody[0].name = 'date_demande';
      this.objetBody[5].name = 'user_demande';
      this.header[5].nomColonne = this.__('demande_rapatriement.demandeur')
      this.triDesc = 'date_demande';

    }else if(etat == 1){
      this.objetBody[0].name = 'date_autorisation';
      this.objetBody[5].name = 'user_autorise';
      this.header[5].nomColonne = this.__('demande_rapatriement.user_autorise')
      this.triDesc = 'date_autorisation';


    }else if(etat == 2){
      this.objetBody[0].name = 'date_validation';
      this.objetBody[5].name = 'user_validation';
      this.header[5].nomColonne = this.__('demande_rapatriement.user_validation')
      this.triDesc = 'date_validation';

    } 
  

      let filtre_search = "" ;
      if(this.typeCompte != '2'){
          filtre_search = ",demande_debit_bureau.wallet_carte|e|"+this.typeCompte;
      }

      const filtre_etat = ",demande_debit_bureau.etat|e|"+etat;
      
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
      
      const tab = "&tab="+ etat;
      
      const filtreParMulti =  filtre_etat + filtre_search + filtreDate + tab;

      console.log("xxxxxx");

      this.passageService.appelURL(filtreParMulti);

  }

     // Detail d'un modal
     async openModalDetailDemande() {
      this.titleModal = this.__('demande_rapatriement.title_detail_modal');
      this.showCode = false;
      this.code_validation = "";
      this.isDisabled = false;
      if (this.detailDemandeRapatriement) {
          this.recupererDonnee();
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.detailDemandeRapatriement, {
          class: 'modal-xl', backdrop:"static"
        });
      }
  
    }

     // Récuperation des données
     recupererDonnee(){

      // Récupérer la liste affichée dans le tableau depuis le localStorage.
      const storedData = localStorage.getItem('data');
      let result : any;
      if (storedData) result = JSON.parse(storedData);
      this.listDemandes = result.data;
      console.log(this.listDemandes);
      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.listDemandes.filter(_ => _.rowid == this.idDemande);
      if(res.length != 0){
        this.demande_rapatriement = res[0];
      }
   }


 
  async exportExcel(fileName) {

      const storedData = localStorage.getItem('data');
      let result : any;
      if (storedData) result = JSON.parse(storedData);
      
  
      this.demande_rapatriements = result.data;

      let titleExport ="";
      if(this.index == 0)  titleExport = this.__("demande_rapatriement.list_demande_rapatriement_en_attente");
      if(this.index == 1)  titleExport = this.__("demande_rapatriement.list_demande_rapatriement_autorise");
      if(this.index == 2)  titleExport = this.__("demande_rapatriement.list_demande_rapatrier");

      const date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
      const date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');
  
      let title = titleExport + ' ' ;

      const mapTypeCompte: { [key: string]: string } = { '0': "("+this.__("global.wallet") + ")", '1': "("+this.__("global.carte")+ ")",};
        
      title += mapTypeCompte[this.typeCompte] || '';
      title += (date_debut != null ? " " + this.__("suivi_compte.from") + ' ' + date_debut + ' ' : '');       
      title += (date_fin != null ? " " + this.__("suivi_compte.to") + ' ' + date_fin + ' ' : '');    
      
      
      this.authService.exportExcel(this.print(this.demande_rapatriements),title).then(
        (response: any)=>{
          console.log('respons beee',response)
              const a = document.createElement("a"); 
              a.href = response.data;
              a.download = `${title}.xlsx`;
              a.click(); 
        },
        (error:any)=>{
          console.log(error)
        }
      );
    }

    async exportPdf(fileName) {

      const storedData = localStorage.getItem('data');
      let result : any;
      if (storedData) result = JSON.parse(storedData);
      
  
      this.demande_rapatriements = result.data;
      let titleExport ="";
      if(this.index == 0)  titleExport = this.__("demande_rapatriement.list_demande_rapatriement_en_attente");
      if(this.index == 1)  titleExport = this.__("demande_rapatriement.list_demande_rapatriement_autorise");
      if(this.index == 2)  titleExport = this.__("demande_rapatriement.list_demande_rapatrier");


      const date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
      const date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');
  
      let title = titleExport + ' ' ;

      const mapTypeCompte: { [key: string]: string } = { '0': "("+this.__("global.wallet") + ")", '1': "("+this.__("global.carte")+ ")",};
        
      title += mapTypeCompte[this.typeCompte] || '';
      title += (date_debut != null ? " " + this.__("suivi_compte.from") + ' ' + date_debut + ' ' : '');       
      title += (date_fin != null ? " " + this.__("suivi_compte.to") + ' ' + date_fin + ' ' : '');    
      
      
      
      this.authService.exportPdf(this.print(this.demande_rapatriements),title).then(
        (response: any)=>{},
        (error:any)=>{
          console.log(error)
        }
      );
    }
  
    print(demande_rapatriements:any[]){

      const tab = demande_rapatriements.map((demande_rapatriement: any, index: number) => {
        const t: any = {};
          if(demande_rapatriement.etat == 0) t[this.__('demande_rapatriement.date')] = demande_rapatriement.date_demande;
          if(demande_rapatriement.etat == 1) t[this.__('demande_rapatriement.date')] = demande_rapatriement.date_autorise;
          if(demande_rapatriement.etat == 2) t[this.__('demande_rapatriement.date')] = demande_rapatriement.date_validation;
          t[this.__('demande_rapatriement.num_demande')] = demande_rapatriement.num_demande;
          t[this.__('demande_rapatriement.ref_demande')] = demande_rapatriement.ref_demande;
          t[this.__('demande_rapatriement.bureau')] = demande_rapatriement.agence_debiter;
          t[this.__('demande_rapatriement.montant') + ' (' + this.__('global.currency') + ')'] = demande_rapatriement.montant;

          if(demande_rapatriement.etat == 0) t[this.__('demande_rapatriement.user_demande')] = demande_rapatriement.user_demande;
          if(demande_rapatriement.etat == 1) t[this.__('demande_rapatriement.user_autorise')] = demande_rapatriement.user_autorise;
          if(demande_rapatriement.etat == 2) t[this.__('demande_rapatriement.user_validation')] = demande_rapatriement.user_validation;
          t[this.__('demande_rapatriement.wallet_carte')] = demande_rapatriement.wallet_carte;
                
        return t;
      });

      return tab;
  
    }



    // Fermeture du modal
    closeModal() {
      this.modalRef?.hide();
    }

    passerCode(){ 
      this.isDisabled = true;
      this.demandeService.initierDemande(this.idDemande).subscribe({
        next: (res) => {
            if(res['code'] == 200) {
                this.toastr.success(res['msg'], this.__("global.success"));
                this.showCode = true; 
                this.isDisabled = false;

            }
            else{
                this.toastr.error(res['msg'], this.__("global.error"));
                this.isDisabled = false;
            }                
        },
        error: (err) => {}
    });

      

    
    }


       //Rejet virement
    autoriseDemande() {
        Swal.fire({
            title: this.__("global.confirmation"),
            text: this.__("global.autorise_demande_?"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.__("global.oui_autoriser"),
            cancelButtonText: this.__("global.cancel"),
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal-button--confirm-custom',
                cancelButton: 'swal-button--cancel-custom'
            },
        }).then((result) => {
            if (result.isConfirmed) {
              this.isDisabled = true;
                this.demandeService.autoriseDemande(this.idDemande).subscribe({
                    next: (res) => {
                        if(res['code'] == 201) {
                            this.toastr.success(res['msg'], this.__("global.success"));
                            this.actualisationTableau();
                            this.closeModal();
                        }
                        else{
                            this.toastr.error(res['msg'], this.__("global.error"));
                            this.isDisabled = false;
                        }                
                    },
                    error: (err) => {}
                });
            }
        });
    }



       //Rejet virement
       validerDemande() {
        Swal.fire({
            title: this.__("global.confirmation"),
            text: this.__("global.valider_demande_?"),
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
              this.isDisabled = true;
              const data =  {
                "code_validation": this.code_validation
              }
                this.demandeService.valideDemande(this.idDemande, data).subscribe({
                    next: (res) => {
                        if(res['code'] == 201) {
                            this.toastr.success(res['msg'], this.__("global.success"));
                            this.actualisationTableau();
                            this.closeModal();

                        }
                        else{
                            this.toastr.error(res.data, this.__("global.error"));
                            this.isDisabled = false;
                        }                
                    },
                    error: (err) => {}
                });
            }
        });
    }

      // Actualisation des données
      actualisationTableau(){
        this.passageService.appelURL('');
     }

         // Ouverture du modal pour l'ajout
    openModalAdd(template: TemplateRef<any>) {
      this.titleModal = this.__('demande_rapatriement.title_add_modal');
      this.info =false;

      this.bureauId=null;
      this.montant = "";
      this.wallet_carte = null;
      this.isDisabled = false;

      this.actualisationSelectBureau();
      this.modalRef = this.modalService.show(template, { class: 'modal-lg', backdrop:"static" });
    }

    recupererInfoBureau(event:MatSelectChange){
      const idbureau = event.value;
      this.bureauId= idbureau;
       // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
       const res = this.filteredBureau.filter(_ => _.rowid == idbureau);
       if(res.length != 0){
          this.info =true;
          this.infoBureau = res[0];
    }
  }



  
     async actualisationSelectBureau(){
      this.bureaux = await this.authService.getSelectList(environment.liste_bureau_active,['name']);
      this.filteredBureau = this.bureaux;
      
      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredBureau = this.bureaux.filter(bureau =>
          bureau.name.toLowerCase().includes(lower)
        );
      });

    }

       // Quand on faire l'ajout ou modification
       onSubmit() {


      
            const msg = this.__("global.enregistrer_donnee_?");
            const msg_btn = this.__("global.oui_enregistrer");

            Swal.fire({
              title: this.__("global.confirmation"),
              text: msg,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: msg_btn,
              cancelButtonText: this.__("global.cancel"),
              allowOutsideClick: false,
              customClass: {
                  confirmButton: 'swal-button--confirm-custom',
                  cancelButton: 'swal-button--cancel-custom'
              },
              }).then((result) => {
              if (result.isConfirmed) {
                
                let wallet =0;
                if(this.wallet_carte == 'W') wallet = 0;
                else if(this.wallet_carte == 'C') wallet = 1;

                this.isDisabled = true;
                  const data = {
                    "montant": this.montant,
                    "agence_id": this.bureauId,
                    "wallet_carte": wallet
                  }
                   this.demandeService.ajoutDemande(data).subscribe({
                    next: (res) => {
                        
                          if(res['code'] == 201) {
                            this.toastr.success(res['msg'], this.__("global.success"));
                            this.actualisationTableau();
                            this.closeModal();
                          }
                          else if(res['code'] == 400){
                            if(res['data'].tel) this.toastr.error(res['data'].tel[0], this.__("global.error"));
                            if(res['data'].email) this.toastr.error(res['data'].email[0], this.__("global.error"));
                            else this.toastr.error(res['data'], this.__("global.error"));
                          }else{
                              this.toastr.error(res['msg'], this.__("global.error"));
                              this.isDisabled = false;
                          }            
                                
                      },
                      error: (err) => {
                      }
                  }); 
    
                
    
               
                }
            });
    
        
      }

}
