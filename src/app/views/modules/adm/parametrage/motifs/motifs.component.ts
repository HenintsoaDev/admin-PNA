import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MotifService } from 'app/services/admin/parametre/motif.service';
import { PassageService } from 'app/services/table/passage.service';
import { motifs } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
declare let bootstrap: any;

@Component({
  selector: 'app-motifs',
  templateUrl: './motifs.component.html',
  styleUrls: ['./motifs.component.scss']
})
export class MotifsComponent extends Translatable implements OnInit {

 
  modalRef?: BsModalRef;
  
  /***************************************** */
  endpoint = "";
  header = [
    
   
    {
      "nomColonne" : this.__('motif.titre'),
      "colonneTable" : "titre",
      "table" : "motif"
    },
    {
      "nomColonne" : this.__('motif.description'),
      "colonneTable" : "description",
      "table" : "motif"
    },
    {
      "nomColonne" : this.__('motif.operation'),
      "colonneTable" : "operation",
      "table" : "motif"
    },
   
   
    {
      "nomColonne" : this.__('global.action')
    }
  
      
    
    ]
  
  objetBody = [
          {
            'name' : 'titre',
            'type' : 'text',
          },
          {
            'name' : 'description',
            'type' : 'text',
          },
          {
            'name' : 'operation_name',
            'type' : 'text',
          },
        
          {'name' :  'state#id'}
  ]
  
  listIcon = [
    {
      'icon' : 'edit',
      'action' : 'edit',
      'tooltip' : this.__('global.tooltip_edit'),
      'autority' : 'PRM_79'

  
    },
    {
      'icon' : 'delete',
      'action' : 'delete',
      'tooltip' : this.__('global.tooltip_delete'),
      'autority' : 'PRM_81'

  
    },
    {
      'icon' : 'state',
      'autority' : 'PRM_80',
    },
  ]
  
    searchGlobal = [ 'motif.titre', 'motif.description']
   
    /***************************************** */
  
  
  
    motifForm: FormGroup;
    motif: motifs = new motifs();
    listMotif:motifs [] = [];
  
    @ViewChild('addMotif') addMotif: TemplateRef<any> | undefined;
    idMotif : number;
    titleModal: string = "";
  
  
    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private motifService: MotifService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService
      ) {
      super();
      this.authService.initAutority("PRM","ADM");
    }
  
  
  
  
  subscription: Subscription;
  
    async ngOnInit() {
      this.titleModal = this.__('motif.title_add_modal');
  
      this.passageService.appelURL(null);

       /***************************************** */
          // Écouter les changements de modal à travers le service si il y a des actions
          this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if( event.data){
              this.idMotif = event.data.id;
  
              if(event.data.action == 'edit') this.openModalEditMotif();
              else if(event.data.action == 'delete') this.openModalDeleteMotif();
              else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStateMotif();

              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
      });
          this.endpoint = environment.baseUrl + '/' + environment.motif;
      /***************************************** */
  
          this.motifForm = this.fb.group({
            titre: ['', Validators.required],
            description: ['', Validators.required],
            operation: [null, Validators.required]

        });
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  
    // Quand on faire l'ajout ou modification
    onSubmit() {
      if (this.motifForm.valid) {

        this.motif = {
          ...this.motif,
          ...this.motifForm.value
        };


  
        let msg = "";
        let msg_btn = "";
  
        if(!this.motif.id){
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
  
              if(!this.motif.id){
                console.log("add")
  
                 this.motifService.ajoutMotif(this.motif).subscribe({
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
                 this.motifService.modifierMotif(this.motif).subscribe({
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
    openModalEditMotif() {
  
      this.titleModal = this.__('motif.title_edit_modal');
  
      if (this.addMotif) {
  
        // Récupérer la liste affichée dans le tableau depuis le localStorage.
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
        this.listMotif = result.data;
  
        // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
        const res = this.listMotif.filter(_ => _.id == this.idMotif);
        this.motif = res[0];

        console.log(this.motif);
        this.motifForm.patchValue({
          titre: this.motif.titre,
          description: this.motif.description,
          operation: this.motif.operation.toString(),
        });

  
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.addMotif, { backdrop: 'static',keyboard: false });
      }
    }
  
  
     // SUppression d'un modal
     openModalDeleteMotif() {
  
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
  
             this.motifService.supprimerMotif(this.idMotif).subscribe({
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
      openModalToogleStateMotif() {
  
        console.log("ssssssssssssxxxxxx");
  
        // Récupérer la liste affichée dans le tableau depuis le localStorage.
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
        this.listMotif = result.data;
        console.log(this.listMotif);
        // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
        const res = this.listMotif.filter(_ => _.id == this.idMotif);
        this.motif = res[0];
  
        
        
  
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
            if(this.motif.state == 1) state = 0;
            else state = 1;
  
    
               this.motifService.changementStateMotif(this.motif, state).subscribe({
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
      this.titleModal = this.__('motif.title_add_modal');
      this.motif = new motifs();

      this.motifForm = this.fb.group({
        titre: ['', Validators.required],
        description: ['', Validators.required],
        operation: ['', Validators.required]
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
