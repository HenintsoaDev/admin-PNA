import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PassageService } from 'app/services/table/passage.service';
import { fournisseur, region } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import { FournisseurService } from 'app/services/boutique/fournisseurs/fournisseur.service';

@Component({
  selector: 'app-fournisseurs',
  templateUrl: './fournisseurs.component.html',
  styleUrls: ['./fournisseurs.component.scss']
})
export class FournisseursComponent  extends Translatable implements OnInit {

  modalRef?: BsModalRef;
  
  /***************************************** */
  endpoint = "";
  header = [
    
    {
      "nomColonne" : this.__('fournisseur.code'),
      "colonneTable" : "code",
      "table" : "fournisseur"
    },
    {
      "nomColonne" : this.__('fournisseur.raison_sociale'),
      "colonneTable" : "raison_sociale",
      "table" : "fournisseur"
    },
    {
      "nomColonne" : this.__('fournisseur.telephone'),
      "colonneTable" : "telephone",
      "table" : "fournisseur"
    },
    {
      "nomColonne" : this.__('fournisseur.email'),
      "colonneTable" : "email",
      "table" : "fournisseur"
    },
 
    {
      "nomColonne" : this.__('fournisseur.ville'),
      "colonneTable" : "ville",
      "table" : "fournisseur"
    },
    
    {
      "nomColonne" : this.__('global.action')
    }
  
      
    
    ]
  
  objetBody = [
          {
            'name' : 'code',
            'type' : 'text',
          },
          {
            'name' : 'raison_sociale',
            'type' : 'text',
          },
          {
            'name' : 'telephone',
            'type' : 'text',
          },
          {
            'name' : 'email',
            'type' : 'text',
          },
         
          {
            'name' : 'ville',
            'type' : 'text',
          },
        
          {'name' :  'state#id'}
  ]


  listIcon = [
    {
      'icon' : 'info',
      'action' : 'detail',
      'tooltip' : this.__('global.tooltip_detail'),
      'autority' : 'PAC_7',
  
    },
    {
      'icon' : 'edit',
      'action' : 'edit',
      'tooltip' : this.__('global.tooltip_edit'),
      'autority' : 'PAC_9'
    },
    {
      'icon' : 'delete',
      'action' : 'delete',
      'tooltip' : this.__('global.tooltip_delete'),
      'autority' : 'PAC_10'
    },
    {
      'icon' : 'state',
      'autority' : 'PAC_1',
    },
  ]
  
    searchGlobal = [ 'fournisseur.code', 'fournisseur.raison_sociale','fournisseur.telephone','fournisseur.email', 'fournisseur.ville']
   
    /***************************************** */
  
  
  
    fournisseurForm: FormGroup;
    fournisseur: fournisseur = new fournisseur();
    listfournisseurs:fournisseur [] = [];

    filteredType: any[] = [];
    filteredDistrict: any[] = [];
    searchControl = new FormControl('');

    @ViewChild('addfournisseur') addfournisseur: TemplateRef<any> | undefined;
    @ViewChild('detailfournisseur') detailfournisseur: TemplateRef<any> | undefined;

    idfournisseur : number;
    titleModal: string = "";

  
    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private fournisseurService: FournisseurService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService
      ) {
      super();
    }
  
  
  
  
  subscription: Subscription;
  
    async ngOnInit() {
  
      this.authService.initAutority("PAC","ADM");
  
      this.titleModal = this.__('fournisseur.title_add_modal');
  
          this.passageService.appelURL(null);
  
       /***************************************** */
          // Écouter les changements de modal à travers le service si il y a des actions
          this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if(event.data){
              this.idfournisseur = event.data.id;
  
              if(event.data.action == 'edit') this.openModalEditfournisseur();
              else if(event.data.action == 'delete') this.openModalDeletefournisseur();
              else if(event.data.action == 'detail') this.openModalDetailfournisseur();
              else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStatefournisseur();
      
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
           
      });
          this.endpoint = environment.baseUrl + '/' + environment.fournisseur;
      /***************************************** */
      

      this.initForm();
       
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  

    initForm(){
      this.fournisseurForm = this.fb.group({
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
      if (this.fournisseurForm.valid) {
  
        let msg = "";
        let msg_btn = "";
  
        if(!this.fournisseur.id){
           msg = this.__("global.enregistrer_donnee_?");
           msg_btn = this.__("global.oui_enregistrer");
        }else{
           msg = this.__("global.modifier_donnee_?");
           msg_btn = this.__("global.oui_modifier");
        }
        this.fournisseur = {
          ...this.fournisseur,
          ...this.fournisseurForm.value
        };
        this.fournisseur.telephone  = this.formatTelephone(this.fournisseur.telephone )

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
  
              if(!this.fournisseur.id){
                console.log("add")
  
                 this.fournisseurService.ajoutfournisseur(this.fournisseur).subscribe({
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
                 this.fournisseurService.modifierfournisseur(this.fournisseur).subscribe({
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
    openModalEditfournisseur() {
  
      this.titleModal = this.__('fournisseur.title_edit_modal');
  
      if (this.addfournisseur) {
  
        this.recupererDonnee();

        // Ouverture de modal
        this.modalRef = this.modalService.show(this.addfournisseur, { class: 'modal-lg', backdrop: 'static',keyboard: false });
      }
    }
  
    // Detail d'un modal
    async openModalDetailfournisseur() {
  
  
      this.titleModal = this.__('fournisseur.title_detail_modal');
  
      if (this.detailfournisseur) {
  
  
        this.recupererDonnee();
  
  
  
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.detailfournisseur, {
          class: 'modal-xl',backdrop:"static"
        });
      }
  
    }
     // SUppression d'un modal
     openModalDeletefournisseur() {
  
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
  
             this.fournisseurService.supprimerfournisseur(this.idfournisseur).subscribe({
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
      openModalToogleStatefournisseur() {
  
       
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
            if(this.fournisseur.state == 1) state = 0;
            else state = 1;
  
    
               this.fournisseurService.changementStatefournisseur(this.fournisseur, state).subscribe({
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
      this.titleModal = this.__('fournisseur.title_add_modal');
      this.fournisseur = new fournisseur();
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
      this.listfournisseurs = result.data;
      console.log(this.listfournisseurs);
      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.listfournisseurs.filter(_ => _.id == this.idfournisseur);
      this.fournisseur = res[0];
    }
  
    // Actualisation des données
    actualisationTableau(){
      this.passageService.appelURL('');
   }
  
   // Fermeture du modal
    closeModal() {
      this.modalRef?.hide();
    }


}
