import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModuleService } from 'app/services/admin/parametre/module.service';
import { PassageService } from 'app/services/table/passage.service';
import { module } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
declare let bootstrap: any;

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent extends Translatable implements OnInit {

  modalRef?: BsModalRef;
  
/***************************************** */
endpoint = "";
header = [
  
  {
    "nomColonne" : this.__('module.code'),
    "colonneTable" : "code",
    "table" : "module"
  },
  {
    "nomColonne" : this.__('module.name'),
    "colonneTable" : "name",
    "table" : "module"
  },
  {
    "nomColonne" : this.__('module.icon'),
    "colonneTable" : "icon",
    "table" : "module"
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
          'name' : 'name',
          'type' : 'text',
        },
      
        {
          'name' : 'icon',
          'type' : 'text',
        },
      
        {'name' :  'state#id'}
]

listIcon = [
  {
    'icon' : 'edit',
    'action' : 'edit',
    'tooltip' : this.__('global.tooltip_edit'),
    'autority' : 'PRM_3'
  },
  {
    'icon' : 'delete',
    'action' : 'delete',
    'tooltip' : this.__('global.tooltip_delete'),
    'autority' : 'PRM_5'
  },
  {
    'icon' : 'state',
    'autority' : 'PRM_6',
  },
]

  searchGlobal = [ 'module.code', 'module.name', 'module.icon']
 
  /***************************************** */



  moduleForm: FormGroup;
  module: module = new module();
  listModules:module [] = [];

  @ViewChild('addModule') addModule: TemplateRef<any> | undefined;
  idModule : number;
  titleModal: string = "";


  constructor(private fb: FormBuilder,  
              private toastr: ToastrService, 
              private moduleService: ModuleService,     
              private passageService: PassageService,
              private modalService: BsModalService,
              private authService : AuthService
    ) {
    super();
  }




subscription: Subscription;

  async ngOnInit() {

    this.authService.initAutority("PRM","ADM");

    this.titleModal = this.__('module.title_add_modal');

        this.passageService.appelURL(null);

     /***************************************** */
        // Écouter les changements de modal à travers le service si il y a des actions
        this.subscription = this.passageService.getObservable().subscribe(event => {

          if(event.data){
            this.idModule = event.data.id;

            if(event.data.action == 'edit') this.openModalEditModule();
            else if(event.data.action == 'delete') this.openModalDeleteModule();
            else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStateModule();
    
            // Nettoyage immédiat de l'event
            this.passageService.clear();  // ==> à implémenter dans ton service
          
          }
         
    });
        this.endpoint = environment.baseUrl + '/' + environment.module;
    /***************************************** */

        this.moduleForm = this.fb.group({
          name: ['', Validators.required],
          code: ['', [Validators.required]],
          icon: ['', [Validators.required]]
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Quand on faire l'ajout ou modification
  onSubmit() {
    if (this.moduleForm.valid) {

      let msg = "";
      let msg_btn = "";

      if(!this.module.id){
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

            if(!this.module.id){
              console.log("add")

               this.moduleService.ajoutModule(this.module).subscribe({
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
               this.moduleService.modifierModule(this.module).subscribe({
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
  openModalEditModule() {

    this.titleModal = this.__('module.title_edit_modal');

    if (this.addModule) {

      this.recupererDonnee();

      // Ouverture de modal
      this.modalRef = this.modalService.show(this.addModule, { backdrop: 'static',keyboard: false });
    }
  }


   // SUppression d'un modal
   openModalDeleteModule() {

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

           this.moduleService.supprimerModule(this.idModule).subscribe({
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
    openModalToogleStateModule() {

      console.log("ssssssssssssxxxxxx");

     
      
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
          if(this.module.state == 1) state = 0;
          else state = 1;

  
             this.moduleService.changementStateModule(this.module, state).subscribe({
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
    this.titleModal = this.__('module.title_add_modal');
    this.module = new module();

    this.modalRef = this.modalService.show(template, {
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
    this.listModules = result.data;
    console.log(this.listModules);
    // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
    const res = this.listModules.filter(_ => _.id == this.idModule);
    this.module = res[0];
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
