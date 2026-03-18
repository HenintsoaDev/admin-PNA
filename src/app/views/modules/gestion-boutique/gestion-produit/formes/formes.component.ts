import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PassageService } from 'app/services/table/passage.service';
import { forme } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import { FormeService } from 'app/services/boutique/produits/forme.service';

@Component({
  selector: 'app-formes',
  templateUrl: './formes.component.html',
  styleUrls: ['./formes.component.scss']
})
export class FormesComponent extends Translatable implements OnInit {

  
  modalRef?: BsModalRef;
  
  /***************************************** */
  endpoint = "";
  header = [
    
  
    {
      "nomColonne" : this.__('forme.nom'),
      "colonneTable" : "nom",
      "table" : "forme_pharmaceutique"
    },
   
    {
      "nomColonne" : this.__('global.action')
    }
  
      
    
    ]
  
  objetBody = [
   
          {
            'name' : 'nom',
            'type' : 'text',
          },
        
         
        
          {'name' :  'state#id'}
  ]
  
  listIcon = [
  
    {
      'icon' : 'edit',
      'action' : 'edit',
      'tooltip' : this.__('global.tooltip_edit'),
      'autority' : 'GSP_22'
    },
    {
      'icon' : 'delete',
      'action' : 'delete',
      'tooltip' : this.__('global.tooltip_delete'),
      'autority' : 'GSP_23'
    },
    {
      'icon' : 'state',
      'autority' : 'GSP_24',
    },
  ]
  
    searchGlobal = [ 'forme_pharmaceutique.nom']
   
    /***************************************** */
  
  
  
    formeForm: FormGroup;
    forme: forme = new forme();
    listformes:forme [] = [];
  
    @ViewChild('addforme') addforme: TemplateRef<any> | undefined;

    idforme : number;
    titleModal: string = "";
  
  
    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private formeService: FormeService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService
      ) {
      super();
    }
  
  
  
  
  subscription: Subscription;
  
    async ngOnInit() {
  
      this.authService.initAutority("GSP","GSB");
  
      this.titleModal = this.__('forme.title_add_modal');
  
          this.passageService.appelURL(null);
  
       /***************************************** */
          // Écouter les changements de modal à travers le service si il y a des actions
          this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if(event.data){
              this.idforme = event.data.id;
  
              if(event.data.action == 'edit') this.openModalEditforme();
              else if(event.data.action == 'delete') this.openModalDeleteforme();
              else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStateforme();
      
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
           
      });
          this.endpoint = environment.baseUrl + '/' + environment.forme;
      /***************************************** */
  
          this.formeForm = this.fb.group({
            nom: ['', Validators.required],
        });
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  
    // Quand on faire l'ajout ou modification
    onSubmit() {
      if (this.formeForm.valid) {
  
        let msg = "";
        let msg_btn = "";
  
        if(!this.forme.id){
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
  
              if(!this.forme.id){
                console.log("add")
  
                 this.formeService.ajoutforme(this.forme).subscribe({
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
                 this.formeService.modifierforme(this.forme).subscribe({
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
    openModalEditforme() {
  
      this.titleModal = this.__('forme.title_edit_modal');
  
      if (this.addforme) {
  
        this.recupererDonnee();
  
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.addforme, { backdrop: 'static',keyboard: false });
      }
    }

    
  
  
     // SUppression d'un modal
     openModalDeleteforme() {
  
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
  
             this.formeService.supprimerforme(this.idforme).subscribe({
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
      openModalToogleStateforme() {
  
       
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
            if(this.forme.state == 1) state = 0;
            else state = 1;
  
    
               this.formeService.changementStateforme(this.forme, state).subscribe({
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
      this.titleModal = this.__('forme.title_add_modal');
      this.forme = new forme();
  
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
      this.listformes = result.data;
      console.log(this.listformes);
      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.listformes.filter(_ => _.id == this.idforme);
      this.forme = res[0];
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
