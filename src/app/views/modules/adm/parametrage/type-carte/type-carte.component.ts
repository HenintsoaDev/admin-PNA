import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeCarteService } from 'app/services/admin/parametre/type_carte.service';
import { PassageService } from 'app/services/table/passage.service';
import { type_carte } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
declare let bootstrap: any;

@Component({
  selector: 'app-type-carte',
  templateUrl: './type-carte.component.html',
  styleUrls: ['./type-carte.component.scss']
})
export class TypeCarteComponent extends Translatable implements OnInit {

  modalRef?: BsModalRef;
  
  /***************************************** */
  endpoint = "";
  header = [
    
  
    {
      "nomColonne" : this.__('type_carte.name'),
      "colonneTable" : "name",
      "table" : "type_carte"
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
      'autority' : 'PRM_74'

  
    },
 /*    {
      'icon' : 'delete',
      'action' : 'delete',
      'tooltip' : this.__('global.tooltip_delete'),
      'autority' : 'PRM_29'

  
    }, */
    {
      'icon' : 'state',
      'autority' : 'PRM_75',
    },
  ]
  
    searchGlobal = [ 'type_carte.name']
   
    /***************************************** */
  
  
  
    typeProfilForm: FormGroup;
    type_carte: type_carte = new type_carte();
    listTypeBureau:type_carte [] = [];
  
    @ViewChild('addTypeCarte') addTypeCarte: TemplateRef<any> | undefined;
    idTypeBureau : number;
    titleModal: string = "";
  
  
    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private typeService: TypeCarteService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService
      ) {
      super();
      this.authService.initAutority("PRM","ADM");
    }
  
  
  
  
  subscription: Subscription;
  
    async ngOnInit() {
      this.titleModal = this.__('type_carte.title_add_modal');
  
      this.passageService.appelURL(null);

       /***************************************** */
          // Écouter les changements de modal à travers le service si il y a des actions
          this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if( event.data){
              this.idTypeBureau = event.data.id;
  
              if(event.data.action == 'edit') this.openModalEditTypeBureau();
              else if(event.data.action == 'delete') this.openModalDeleteTypeBureau();
              else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStateTypeBureau();

              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
      });
          this.endpoint = environment.baseUrl + '/' + environment.type_carte;
      /***************************************** */
  
          this.typeProfilForm = this.fb.group({
            code: ['', Validators.required],
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
      if (this.typeProfilForm.valid) {

        this.type_carte = {
          ...this.type_carte,
          ...this.typeProfilForm.value
        };


  
        let msg = "";
        let msg_btn = "";
  
        if(!this.type_carte.id){
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
  
              if(!this.type_carte.id){
                console.log("add")
  
                 this.typeService.ajoutTypeCarte(this.type_carte).subscribe({
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
                 this.typeService.modifierTypeCarte(this.type_carte).subscribe({
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
  
      this.titleModal = this.__('type_carte.title_edit_modal');
  
      console.log('xxxxx')
      if (this.addTypeCarte) {
        console.log('okoks')

        // Récupérer la liste affichée dans le tableau depuis le localStorage.
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
        this.listTypeBureau = result.data;
  
        // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
        const res = this.listTypeBureau.filter(_ => _.id == this.idTypeBureau);
        this.type_carte = res[0];

        console.log(this.type_carte);
        this.typeProfilForm.patchValue({
          name: this.type_carte.name,
        });

  
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.addTypeCarte, { backdrop: 'static',keyboard: false });
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
  
             this.typeService.supprimerTypeCarte(this.idTypeBureau).subscribe({
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
        this.type_carte = res[0];
  
        
        
  
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
            if(this.type_carte.state == 1) state = 0;
            else state = 1;
  
    
               this.typeService.changementStateTypeCarte(this.type_carte, state).subscribe({
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
      this.titleModal = this.__('type_carte.title_add_modal');
      this.type_carte = new type_carte();

      this.typeProfilForm = this.fb.group({
        name: ['', Validators.required]
    });

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
