import { DepartementService } from './../../../../../services/admin/parametre/departement.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PassageService } from 'app/services/table/passage.service';
import { departement } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { map, startWith, Subscription, Subject, takeUntil } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
declare let bootstrap: any;
@Component({
  selector: 'app-departement',
  templateUrl: './departement.component.html',
  styleUrls: ['./departement.component.scss']
})
export class DepartementComponent extends Translatable implements OnInit {

   /***************************************** */
   endpoint = "";
   header = [
     
  
     {
       "nomColonne" : this.__('departement.name'),
       "colonneTable" : "name",
       "table" : "departement"
     },
   
     {
       "nomColonne" : this.__('departement.region'),
       "colonneTable" : "lib_region",
       "table" : "region"
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
         
           {
             'name' : 'lib_region',
             'type' : 'text',
           },
         
           {'name' :  'state#id'}
   ]
   
   listIcon = [
     {
       'icon' : 'edit',
       'action' : 'edit',
       'tooltip' : 'Modification',
       'autority' : 'PRM_69',
     },
 /*     {
       'icon' : 'delete',
       'action' : 'delete',
       'tooltip' : 'Supression',
       'autority' : 'PRM_77',  
     }, */
     {
      'icon' : 'state',
      'autority' : 'PRM_70',
    },
     
   ]
   
     searchGlobal = [ 'departement.name',  'region.lib_region']
    
     /***************************************** */
   
   
     subscription: Subscription;
     departementForm: FormGroup;
     departement: departement = new departement();
     listDepartements:departement [] = [];
 
     @ViewChild('addDepartement') addDepartement: TemplateRef<any> | undefined;
     idDepartement : number;
     titleModal: string = "";
     modalRef?: BsModalRef;
     
     filteredRegion: any[] = [];
     searchControl = new FormControl('');
     regions: any = [];
 
     constructor(private fb: FormBuilder,  
                 private toastr: ToastrService, 
                 private departementService: DepartementService,     
                 private passageService: PassageService,
                 private modalService: BsModalService,
                 private authService : AuthService
   
       ) {
       super();
       this.authService.initAutority("PRM","ADM");
         //console.log(this.autority('PRM_20'));
     }
   
   
   
   
   
     async ngOnInit() {
       this.titleModal = this.__('departement.title_add_modal');
   
       this.passageService.appelURL(null);
 
        /***************************************** */
           // Écouter les changements de modal à travers le service si il y a des actions
           this.subscription = this.passageService.getObservable().subscribe(event => {
   
             if(event.data){
               this.idDepartement = event.data.id;
   
               if(event.data.action == 'edit') this.openModalEditDepartement();
               else if(event.data.action == 'delete') this.openModalDeleteDepartement();
               else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStateDepartement();
               
               // Nettoyage immédiat de l'event
               this.passageService.clear();  // ==> à implémenter dans ton service
             
             }
             
       });
           this.endpoint = environment.baseUrl + '/' + environment.departement_region;
       /***************************************** */
   
           this.departementForm = this.fb.group({
             name: ['', Validators.required],
             region_id: ['', [Validators.required]]
         });
 
 
         
 
 
     }
 
    
    
     ngOnDestroy() {
       if (this.subscription) {
         this.subscription.unsubscribe();
       }
     }
   
     // Quand on faire l'ajout ou modification
     onSubmit() {
 
       console.log(this.departement);
       if (this.departementForm.valid) {
   
         let msg = "";
         let msg_btn = "";
   
         if(!this.departement.id){
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
   
               if(!this.departement.id){
                 console.log("add")
   
                  this.departementService.ajoutDepartement(this.departement).subscribe({
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
                  this.departementService.modifierDepartement(this.departement).subscribe({
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
     openModalEditDepartement() {
   
       this.titleModal = this.__('departement.title_edit_modal');
 
       if (this.addDepartement) {
   
        
         this.recupererDonnee();
 
         this.actualisationSelect();
 
         // Ouverture de modal
         this.modalRef = this.modalService.show(this.addDepartement, { backdrop: 'static',keyboard: false });
       }
     }
 
     // Récuperation des donnée
     recupererDonnee(){
 
         // Récupérer la liste affichée dans le tableau depuis le localStorage.
         const storedData = localStorage.getItem('data');
         let result : any;
         if (storedData) result = JSON.parse(storedData);
         this.listDepartements = result.data;
 
         // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
         const res = this.listDepartements.filter(_ => _.id == this.idDepartement);
         this.departement = res[0];
 
     }
   
   
      // SUppression d'un modal
      openModalDeleteDepartement() {
   
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
   
              this.departementService.supprimerDepartement(this.idDepartement).subscribe({
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
       openModalToogleStateDepartement() {
   
   
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
             if(this.departement.state == 1) state = 0;
             else state = 1;
   
     
                this.departementService.changementStateDepartement(this.departement, state).subscribe({
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
     async openModalAdd(template: TemplateRef<any>) {
       this.titleModal = this.__('departement.title_add_modal');
       this.departement = new departement();
       this.actualisationSelect();
       this.modalRef = this.modalService.show(template, {
         backdrop: 'static',
         keyboard: false
       });
     }
 
     async actualisationSelect(){
       this.regions = await this.authService.getSelectList(environment.liste_region_active,['lib_region']);
       this.filteredRegion = this.regions;
 
       this.searchControl.valueChanges.subscribe(value => {
         const lower = value?.toLowerCase() || '';
         this.filteredRegion = this.regions.filter(region =>
           region.lib_region.toLowerCase().includes(lower)
         );
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
