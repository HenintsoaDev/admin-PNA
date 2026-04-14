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
import { FactureService } from 'app/services/boutique/fournisseurs/facture.service';
import formatNumber from 'number-handler'

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

  
    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private factureService: FactureService,     
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
              else if(event.data.action == 'delete') this.openModalDeletefacture();
              else if(event.data.action == 'detail') this.openModalDetailfacture();
              else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStatefacture();
      
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
           
      });
          this.endpoint = environment.baseUrl + '/' + environment.facture;
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
    
    // Quand on faire l'ajout ou modification
    onSubmit() {
      if (this.factureForm.valid) {
  
        let msg = "";
        let msg_btn = "";
  
        if(!this.facture.id){
           msg = this.__("global.enregistrer_donnee_?");
           msg_btn = this.__("global.oui_enregistrer");
        }else{
           msg = this.__("global.modifier_donnee_?");
           msg_btn = this.__("global.oui_modifier");
        }
        this.facture = {
          ...this.facture,
          ...this.factureForm.value
        };

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
  
              if(!this.facture.id){
                console.log("add")
  
                 this.factureService.ajoutfacture(this.facture).subscribe({
                  next: (res) => {
                      if(res['code'] == 201) {
                        this.toastr.success(res['msg'], this.__("global.success"));
                        this.actualisationTableau();
                        this.closeModal();
                      }
                      else if(res['code'] == 400){
                        if(res['data'].code) this.toastr.error(res['data'].code[0], this.__("global.error"));
                        else this.toastr.error(res['data'], this.__("global.error"));
                      }else{
                          this.toastr.error(res['msg'], this.__("global.error"));
                      }                
                    },
                    error: (err) => {
                    }
                }); 
  
              }else{
                console.log("edit")
                 this.factureService.modifierfacture(this.facture).subscribe({
                  next: (res) => {
                      if(res['code'] == 201) {
                        this.toastr.success(res['msg'], this.__("global.success"));
                        this.actualisationTableau();
                        this.closeModal();
                      }
                      else{
                          this.toastr.error(res['msg'], this.__("global.error"));
                      }                
                    },
                    error: (err) => {
                    }
                }); 
              }
  
             
  
  
              
              }
          });
  
      
        } else {
            alert("Veuillez remplir tous les champs correctement.");
        }
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
  
    // Detail d'un modal
    async openModalDetailfacture() {
  
  
      this.titleModal = this.__('facture.title_detail_modal');
  
      if (this.detailfacture) {
  
  
        this.recupererDonnee();
  
  
  
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.detailfacture, {
          class: 'modal-xl',backdrop:"static"
        });
      }
  
    }
     // SUppression d'un modal
     openModalDeletefacture() {
  
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
  
             this.factureService.supprimerfacture(this.idfacture).subscribe({
              next: (res) => {
                  if(res['code'] == 205) {
                    this.toastr.success(res['msg'], this.__("global.success"));
                    this.actualisationTableau();
                  }
                  else{
                      this.toastr.error(res['msg'], this.__("global.error"));
                  }                
                },
                error: (err) => {
                }
            }); 
  
        
  
  
          
          }
      });
  
    }

 

      // Ouverture de modal pour modification
      openModalToogleStatefacture() {
  
       
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
            if(this.facture.state == 1) state = 0;
            else state = 1;
  
    
               this.factureService.changementStatefacture(this.facture, state).subscribe({
                next: (res) => {
                    if(res['code'] == 200) {
                      this.toastr.success(res['msg'], this.__("global.success"));
                      this.actualisationTableau();
                    }
                    else{
                        this.toastr.error(res['msg'], this.__("global.error"));
                    }                
                  },
                  error: (err) => {
                  }
              }); 
    
          
    
    
            
            }
        });
    
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
  

}
