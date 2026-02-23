import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeBureauService } from 'app/services/admin/parametre/type_bureau.service';
import { PassageService } from 'app/services/table/passage.service';
import { type_bureau } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
declare let bootstrap: any;

@Component({
  selector: 'app-type-bureaux',
  templateUrl: './type-bureaux.component.html',
  styleUrls: ['./type-bureaux.component.scss']
})
export class TypeBureauxComponent extends Translatable implements OnInit {

  modalRef?: BsModalRef;
  
/***************************************** */
endpoint = "";
header = [
  
 
  {
    "nomColonne" : this.__('type_bureau.name'),
    "colonneTable" : "name",
    "table" : "type_agence"
  },
 
 
  {
    "nomColonne" : this.__('global.action')
  }

    
  
  ]

objetBody = [
        {
          'name' : 'name',
          'type' : 'text',
        },
      
        {'name' :  'state#id'}
]

listIcon = [
  {
    'icon' : 'edit',
    'action' : 'edit',
    'tooltip' : this.__('global.tooltip_edit'),
    'autority' : 'PRM_21'

  },
  {
    'icon' : 'delete',
    'action' : 'delete',
    'tooltip' : this.__('global.tooltip_delete'),
    'autority' : 'PRM_23'

  },
  {
    'icon' : 'state',
    'autority' : 'PRM_24',
  },
]

  searchGlobal = [ 'type_agence.name']
 
  /***************************************** */



  typeBureauForm: FormGroup;
  type_bureau: type_bureau = new type_bureau();
  listTypeBureau:type_bureau [] = [];

  @ViewChild('addTypeBureau') addTypeBureau: TemplateRef<any> | undefined;
  idTypeBureau : number;
  titleModal: string = "";


  constructor(private fb: FormBuilder,  
              private toastr: ToastrService, 
              private typeService: TypeBureauService,     
              private passageService: PassageService,
              private modalService: BsModalService,
              private authService : AuthService
    ) {
    super();
  }




subscription: Subscription;

  async ngOnInit() {
    this.authService.initAutority("PRM","ADM");

      this.titleModal = this.__('type_bureau.title_add_modal');

      this.passageService.appelURL(null);
      
     /***************************************** */
        // Écouter les changements de modal à travers le service si il y a des actions
        this.subscription = this.passageService.getObservable().subscribe(event => {

          if(event.data){
            this.idTypeBureau = event.data.id;

            if(event.data.action == 'edit') this.openModalEditTypeBureau();
            else if(event.data.action == 'delete') this.openModalDeleteTypeBureau();
            else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStateTypeBureau();
    
            // // Nettoyage immédiat de l'event
            this.passageService.clear();  // ==> à implémenter dans ton service
          
          }
          
         
    });
        this.endpoint = environment.baseUrl + '/' + environment.type_bureau;
    /***************************************** */

        this.typeBureauForm = this.fb.group({
          name: ['', Validators.required]
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Quand on faire l'ajout ou modification
  onSubmit() {
    if (this.typeBureauForm.valid) {

      let msg = "";
      let msg_btn = "";

      if(!this.type_bureau.id){
         msg = this.__("global.enregistrer_donnee_?");
         msg_btn = this.__("global.oui_enregistrer");
      }else{
         msg = this.__("global.modifier_donnee_?");
         msg_btn = this.__("global.oui_modifier");
      }

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

            if(!this.type_bureau.id){
              console.log("add")

               this.typeService.ajoutTypeBureau(this.type_bureau).subscribe({
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
               this.typeService.modifierTypeBureau(this.type_bureau).subscribe({
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
  openModalEditTypeBureau() {

    this.titleModal = this.__('type_bureau.title_edit_modal');

    if (this.addTypeBureau) {

      // Récupérer la liste affichée dans le tableau depuis le localStorage.
      const storedData = localStorage.getItem('data');
      let result : any;
      if (storedData) result = JSON.parse(storedData);
      this.listTypeBureau = result.data;

      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.listTypeBureau.filter(_ => _.id == this.idTypeBureau);
      this.type_bureau = res[0];

      // Ouverture de modal
      this.modalRef = this.modalService.show(this.addTypeBureau, { backdrop: 'static',keyboard: false });
    }
  }


   // SUppression d'un modal
   openModalDeleteTypeBureau() {

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

           this.typeService.supprimerTypeBureau(this.idTypeBureau).subscribe({
            next: (res) => {
                if(res['code'] == 204) {
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
    openModalToogleStateTypeBureau() {

      console.log("ssssssssssssxxxxxx");

      // Récupérer la liste affichée dans le tableau depuis le localStorage.
      const storedData = localStorage.getItem('data');
      let result : any;
      if (storedData) result = JSON.parse(storedData);
      this.listTypeBureau = result.data;
      console.log(this.listTypeBureau);
      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.listTypeBureau.filter(_ => _.id == this.idTypeBureau);
      this.type_bureau = res[0];

      
      

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
          if(this.type_bureau.state == 1) state = 0;
          else state = 1;

  
             this.typeService.changementStateTypeBureau(this.type_bureau, state).subscribe({
              next: (res) => {
                  if(res['code'] == 201) {
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
    this.titleModal = this.__('type_bureau.title_add_modal');
    this.type_bureau = new type_bureau();
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false
    });
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
