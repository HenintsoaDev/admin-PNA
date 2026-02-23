import { ActionService } from '../../../../../services/admin/parametre/action.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PassageService } from 'app/services/table/passage.service';
import { action } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent extends Translatable implements OnInit {

  modalRef?: BsModalRef;
  
  /***************************************** */
  endpoint = "";
  header = [
    
    {
      "nomColonne" : this.__('action.code'),
      "colonneTable" : "code",
      "table" : "action"
    },
    {
      "nomColonne" : this.__('action.name'),
      "colonneTable" : "name",
      "table" : "action"
    },
    {
      "nomColonne" : this.__('action.url'),
      "colonneTable" : "url",
      "table" : "action"
    },
    {
      "nomColonne" : this.__('action.method'),
      "colonneTable" : "method",
      "table" : "action"
    },
    {
      "nomColonne" : this.__('action.type'),
      "colonneTable" : "type",
      "table" : "action"
    },
    {
      "nomColonne" : this.__('action.sous_module'),
      "colonneTable" : "name",
      "table" : "sous_module"
    },
   
  
      
    
    ]
  
  objetBody = [
          {
            'name' : 'code',
            'type' : 'text',
          },
          {
            'name' : 'name',
            'type' : 'text',
          },
          {
            'name' : 'url',
            'type' : 'text',
          },
          {
            'name' : 'method',
            'type' : 'text',
          },
          {
            'name' : 'code_type_action',
            'type' : 'text',
          },
          {
            'name' : 'sous_module_name',
            'type' : 'text',
          },

        
  ]
  
  listIcon = [
    {
      'icon' : 'edit',
      'action' : 'edit',
      'tooltip' : 'Modification',
  
    },
    {
      'icon' : 'delete',
      'action' : 'delete',
      'tooltip' : 'Supression',
  
    },
  ]
  
    searchGlobal = [ 'action.code', 'action.name', 'action.url', 'action.method', 'action.type', 'sous_module.name']
   
    /***************************************** */
  
  
  
    actionForm: FormGroup;
    action: action = new action();
    listactions:action [] = [];
  
    @ViewChild('addaction') addaction: TemplateRef<any> | undefined;
    idaction : number;
    titleModal: string = "";
  
  
    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private actionService: ActionService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService
      ) {
      super();
      this.authService.initAutority("PRM");
    }
  
  
  
  
  subscription: Subscription;
  
    async ngOnInit() {
      this.titleModal = this.__('action.title_add_modal');
  
          this.passageService.appelURL(null);
  
       /***************************************** */
          // Écouter les changements de modal à travers le service si il y a des actions
          this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if(event.data){
              this.idaction = event.data.id;
  
      
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
           
      });
          this.endpoint = environment.baseUrl + '/' + environment.action;
      /***************************************** */
  
       
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }

    openAdd() {
      Swal.fire({
        title: this.__("global.confirmation"),
        text: this.__("global.add_action_?"),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.__("global.oui_ajouter"),
        cancelButtonText: this.__("global.cancel"),
        allowOutsideClick: false,
        customClass: {
            confirmButton: 'swal-button--confirm-custom',
            cancelButton: 'swal-button--cancel-custom'
        },
        }).then((result) => {
        if (result.isConfirmed) {
  
             this.actionService.ajoutAction().subscribe({
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


    openGenerate() {
      Swal.fire({
        title: this.__("global.confirmation"),
        text: this.__("global.generer_action_?"),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.__("global.oui_generer"),
        cancelButtonText: this.__("global.cancel"),
        allowOutsideClick: false,
        customClass: {
            confirmButton: 'swal-button--confirm-custom',
            cancelButton: 'swal-button--cancel-custom'
        },
        }).then((result) => {
        if (result.isConfirmed) {
  
             this.actionService.genererRoute().subscribe({
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

  
   
  // Actualisation des données
  actualisationTableau(){
    this.passageService.appelURL('');
 }
  
   // Fermeture du modal
    closeModal() {
      this.modalRef?.hide();
    }
  
}
