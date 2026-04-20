import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PassageService } from 'app/services/table/passage.service';
import { facture, region } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import { FactureFournisseurService } from 'app/services/boutique/fournisseurs/facture_fournisseur.service';
import formatNumber from 'number-handler'
import { soumission, soumissionPj } from 'shared/interfaces/soumission';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export class FactureComponent extends Translatable implements OnInit {

  modalRef?: BsModalRef;
    formatNumber: any = formatNumber;

  /***************************************** */
  endpoint = "";
  header = [
    
    {
      "nomColonne" : this.__('facture.numero'),
      "colonneTable" : "numero",
      "table" : "facture_fournisseur"
    },
    {
      "nomColonne" : this.__('facture.fournisseur'),
      "colonneTable" : "raison_sociale",
      "table" : "fournisseur"
    },
    {
      "nomColonne" : this.__('facture.commande'),
      "colonneTable" : "reference",
      "table" : "commandeAchat"
    },
    {
      "nomColonne" : this.__('facture.date_facture'),
      "colonneTable" : "date_facture",
      "table" : "facture_fournisseur"
    },
 
    {
      "nomColonne" : this.__('facture.montant_ht'),
      "colonneTable" : "montant_ht",
      "table" : "facture_fournisseur"
    },
    {
      "nomColonne" : this.__('facture.montant_ttc'),
      "colonneTable" : "montant_ht",
      "table" : "facture_fournisseur"
    },
    {
      "nomColonne": this.__('facture.statut'),
      "colonneTable": "statut",
      "table": "facture_fournisseur"
    },
    
    {
      "nomColonne" : this.__('global.action')
    }
  
      
    
    ]
  
  objetBody = [
          {
            'name' : 'numero',
            'type' : 'text',
          },
          {
            'name' : 'fournisseur_nom',
            'type' : 'text',
          },
          {
            'name' : 'commande_reference',
            'type' : 'text',
          },
          {
            'name' : 'date_facture',
            'type' : 'text',
          },
         
          {
            'name' : 'montant_ht',
            'type' : 'montant',
          },
          {
            'name' : 'montant_ttc',
            'type' : 'montant',
          },
          {
            'name': 'statut',
            'type': 'statut',
          },
        
          {'name' :  'id'}
  ]


  listIcon = [
    {
      'icon' : 'info',
      'action' : 'detail',
      'tooltip' : this.__('global.tooltip_detail'),
      'autority' : 'GSF_3',
  
    },
  
  ]
  
    searchGlobal = [ 'facture_fournisseur.numero', 'facture_fournisseur.date_facture','facture_fournisseur.montant_ht','facture_fournisseur.montant_ttc', 'commandeAchat.reference', 'fournisseur.raison_sociale']

    /***************************************** */
  
  
  
    factureForm: FormGroup;
    facture: facture = new facture();
    listfactures:facture [] = [];

    filteredType: any[] = [];
    filteredDistrict: any[] = [];
    searchControl = new FormControl('');

    @ViewChild('addfacture') addfacture: TemplateRef<any> | undefined;
    @ViewChild('detailfacture') detailfacture: TemplateRef<any> | undefined;

    idfacture : number;
    titleModal: string = "";
  isDisabled: boolean;

  
    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private factureService: FactureFournisseurService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService
      ) {
      super();
    }
  
  
  
  
  subscription: Subscription;
  
    async ngOnInit() {
  
      this.authService.initAutority("GSF","GSB");
  
      this.titleModal = this.__('facture.title_add_modal');
  
          this.passageService.appelURL(null);
  
       /***************************************** */
          // Écouter les changements de modal à travers le service si il y a des actions
          this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if(event.data){
              this.idfacture = event.data.id;
  
              if(event.data.action == 'edit') this.openModalEditfacture();
              else if(event.data.action == 'detail') this.openModalDetailfacture();
      
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
           
      });
          this.endpoint = environment.baseUrl + '/' + environment.facture_fournisseur;
      /***************************************** */
      

      this.initForm();
       
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  

    initForm(){
      this.factureForm = this.fb.group({
        raison_sociale: ['', Validators.required],
        code: ['', [Validators.required]],
        email: ['', [Validators.required]],
        adresse: ['', [Validators.required]],
        ville : ['', [Validators.required]],
        pays : ['', [Validators.required]],
        telephone : ['', [Validators.required]],
        fax : ['', [Validators.required]],
        site_web : ['', [Validators.required]],
        registre_commerce : ['', [Validators.required]],
        ninea : ['', [Validators.required]]
    });
    }



    formatTelephone(phone){

      let telephoneForm = phone.number.replace('+', '');
      let dialCode = phone.dialCode.replace('+', '');
      let telephoneFinal = "";
    
      if (telephoneForm.startsWith(dialCode)) {
        telephoneFinal = '00' + telephoneForm;
      } else {
        if (telephoneForm.startsWith('0')) {
          telephoneFinal = '00' + dialCode + telephoneForm.replace(/^0/, '');
        } else {
          telephoneFinal = '00' + dialCode + telephoneForm;
        }
      }
    
      return telephoneFinal;
    
    }
    
    
  
    // Ouverture de modal pour modification
    openModalEditfacture() {
  
      this.titleModal = this.__('facture.title_edit_modal');
      
      if (this.addfacture) {
  
        this.recupererDonnee();

        // Ouverture de modal
        this.modalRef = this.modalService.show(this.addfacture, { class: 'modal-lg', backdrop: 'static',keyboard: false });
      }
    }

    getCommandeStatusDotClass(statut: any): string {
      return statut ? `co-dot-${statut}` : 'so-dot-soumise';
    }

    getHistoriqueUserLabel(h: any): string {
      const user = h?.nom_utilisateur;
      return user;
    }

    getDocuments(facture: any | null): any[] {
      return (facture?.piecesJointe ?? []) as any[];
    }

    getDocTypeClass(typeDocument: any): string {
      const t = String(typeDocument ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_');
  
      if (t.includes('tech')) return 'so-doc-type-technique';
      if (t.includes('fin')) return 'so-doc-type-financier';
      if (t.includes('admin')) return 'so-doc-type-administratif';
      return 'so-doc-type-neutral';
    }

    getDocIconClass(typeDocument: any): string {
      const t = String(typeDocument ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_');
  
      if (t.includes('tech')) return 'fa fa-book';
      if (t.includes('fin')) return 'fa fa-money';
      if (t.includes('admin')) return 'fa fa-paperclip';
      return 'fa fa-file';
    }
  
    // Detail d'un modal
    async openModalDetailfacture() {
  
  
      this.titleModal = this.__('facture.title_detail_modal');
  
      if (this.detailfacture) {

        this.isDisabled = false;
  
  
        let res = await this.authService.getSelectList(environment.facture_fournisseur + '/' + this.idfacture, ['titre']);
        if (res.length != 0) {
          this.facture = res;
        }
  
  
  
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.detailfacture, {
          class: 'modal-xl',backdrop:"static"
        });
      }
  
    }
   

 

 
    
  
  
    // Ouverture du modal pour l'ajout
    openModalAdd(template: TemplateRef<any>) {
      this.titleModal = this.__('facture.title_add_modal');
      this.facture = new facture();
      this.initForm();

      this.modalRef = this.modalService.show(template, {
        class: 'modal-lg',
        backdrop: 'static',
        keyboard: false
      });
    }
  
    // Récuperation des données via plocal
    recupererDonnee(){
      // Récupérer la liste affichée dans le tableau depuis le localStorage.
      const storedData = localStorage.getItem('data');
      let result : any;
      if (storedData) result = JSON.parse(storedData);
      this.listfactures = result.data;
      console.log(this.listfactures);
      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.listfactures.filter(_ => _.id == this.idfacture);
      this.facture = res[0];

    


    }
  
    // Actualisation des données
    actualisationTableau(){
      this.passageService.appelURL('');
   }
  
   // Fermeture du modal
    closeModal() {
      this.modalRef?.hide();
    }

    getStatusBadgeClass(statut: any): string {
      return statut ? `status-${statut}` : 'status-soumise';
    }

    getStatusLabel(statut: any): string {
      return statut ? this.__(`facture.status.${statut}`) : (statut ?? '-');
    }

    //Rejet virement
  valider(type) {

    let text = this.__("global.valider_facture_?");
    let btn = this.__("global.oui_valider");
    if (type === 'REJETEE') {
      text = this.__("global.rejeter_facture_?");
      btn = this.__("global.oui_rejeter")
    }

    const swalOptions: any = {
      title: this.__("global.confirmation"),
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: btn,
      cancelButtonText: this.__("global.cancel"),
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'swal-button--confirm-custom',
        cancelButton: 'swal-button--cancel-custom'
      },
    };

    if (type === 'REJETEE') {
      swalOptions.input = 'text';
      swalOptions.inputPlaceholder = this.__("global.motif_rejeter");
      swalOptions.inputValidator = (value: string) => {
        if (!value) {
          return this.__("global.champ_obligatoire");
        }
        return null;
      };
    }




    Swal.fire(swalOptions).then((result) => {
      

      if (result.isConfirmed) {

        let datamotif = {};

        if (type === 'REJETEE') datamotif = result.value !== true ? { motif: result.value } : {};
       
        this.isDisabled = true;
        this.factureService.validerFacture(this.idfacture, type, datamotif).subscribe({
          next: (res) => {
            if (res['code'] == 201) {
              this.toastr.success(res['msg'], this.__("global.success"));
              this.actualisationTableau();
              this.closeModal();
            }
            else {
              this.toastr.error(res['msg'], this.__("global.error"));
              this.isDisabled = false;
            }
          },
          error: (err) => { }
        });
      }
    });
  }
  

}
