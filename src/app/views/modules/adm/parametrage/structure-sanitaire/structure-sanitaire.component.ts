import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PassageService } from 'app/services/table/passage.service';
import { structure, region } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import { StructureService } from 'app/services/admin/parametre/structure.service';

@Component({
  selector: 'app-structure-sanitaire',
  templateUrl: './structure-sanitaire.component.html',
  styleUrls: ['./structure-sanitaire.component.scss']
})
export class StructureSanitaireComponent extends Translatable implements OnInit {

  modalRef?: BsModalRef;
  
  /***************************************** */
  endpoint = "";
  header = [
    
    {
      "nomColonne" : this.__('structure.code'),
      "colonneTable" : "code",
      "table" : "structure_sanitaire"
    },
    {
      "nomColonne" : this.__('structure.nom'),
      "colonneTable" : "nom",
      "table" : "structure_sanitaire"
    },
    {
      "nomColonne" : this.__('structure.email'),
      "colonneTable" : "email",
      "table" : "structure_sanitaire"
    },
    {
      "nomColonne" : this.__('structure.budget_alloue'),
      "colonneTable" : "budget_alloue",
      "table" : "structure_sanitaire"
    },
    {
      "nomColonne" : this.__('structure.district'),
      "colonneTable" : "nom",
      "table" : "district_sanitaire"
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
            'name' : 'nom',
            'type' : 'text',
          },
          {
            'name' : 'email',
            'type' : 'text',
          },
          {
            'name' : 'budget_alloue',
            'type' : 'montant',
          },
          {
            'name' : 'district_sanitaire_nom',
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
  
    searchGlobal = [ 'structure_sanitaire.code', 'structure_sanitaire.nom','structure_sanitaire.budget_alloue','structure_sanitaire.email', 'district_sanitaire.nom']
   
    /***************************************** */
  
  
  
    structureForm: FormGroup;
    structure: structure = new structure();
    liststructures:structure [] = [];

    filteredType: any[] = [];
    filteredDistrict: any[] = [];
    searchControl = new FormControl('');

    @ViewChild('addstructure') addstructure: TemplateRef<any> | undefined;
    @ViewChild('detailstructure') detailstructure: TemplateRef<any> | undefined;

    idstructure : number;
    titleModal: string = "";

  
    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private structureService: StructureService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService
      ) {
      super();
    }
  
  
  
  
  subscription: Subscription;
  
    async ngOnInit() {
  
      this.authService.initAutority("PAC","ADM");
  
      this.titleModal = this.__('structure.title_add_modal');
  
          this.passageService.appelURL(null);
  
       /***************************************** */
          // Écouter les changements de modal à travers le service si il y a des actions
          this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if(event.data){
              this.idstructure = event.data.id;
  
              if(event.data.action == 'edit') this.openModalEditstructure();
              else if(event.data.action == 'delete') this.openModalDeletestructure();
              else if(event.data.action == 'detail') this.openModalDetailstructure();
              else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStatestructure();
      
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
           
      });
          this.endpoint = environment.baseUrl + '/' + environment.structure;
      /***************************************** */
      

      this.initForm();
       
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  

    initForm(){
      this.structureForm = this.fb.group({
        nom: ['', Validators.required],
        code: ['', [Validators.required]],
        email: ['', [Validators.required]],
        adresse: ['', [Validators.required]],
        budget_alloue : ['', [Validators.required]],
        telephone : ['', [Validators.required]],
        type_structure_id : ['', [Validators.required]],
        district_sanitaire_id : ['', [Validators.required]]
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
      if (this.structureForm.valid) {
  
        let msg = "";
        let msg_btn = "";
  
        if(!this.structure.id){
           msg = this.__("global.enregistrer_donnee_?");
           msg_btn = this.__("global.oui_enregistrer");
        }else{
           msg = this.__("global.modifier_donnee_?");
           msg_btn = this.__("global.oui_modifier");
        }
        this.structure = {
          ...this.structure,
          ...this.structureForm.value
        };
        this.structure.telephone  = this.formatTelephone(this.structure.telephone )

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
  
              if(!this.structure.id){
                console.log("add")
  
                 this.structureService.ajoutstructure(this.structure).subscribe({
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
                 this.structureService.modifierstructure(this.structure).subscribe({
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
    openModalEditstructure() {
  
      this.titleModal = this.__('structure.title_edit_modal');
  
      if (this.addstructure) {
  
        this.recupererDonnee();
        this.actualisationSelectType();
        this.actualisationSelectDistrict();

        // Ouverture de modal
        this.modalRef = this.modalService.show(this.addstructure, { class: 'modal-lg', backdrop: 'static',keyboard: false });
      }
    }
  
    // Detail d'un modal
    async openModalDetailstructure() {
  
  
      this.titleModal = this.__('structure.title_detail_modal');
  
      if (this.detailstructure) {
  
  
        this.recupererDonnee();
  
  
  
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.detailstructure, {
          class: 'modal-xl',backdrop:"static"
        });
      }
  
    }
     // SUppression d'un modal
     openModalDeletestructure() {
  
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
  
             this.structureService.supprimerstructure(this.idstructure).subscribe({
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

    async actualisationSelectDistrict(){
      let districts = await this.authService.getSelectList(environment.liste_district_active,['name']);
      this.filteredDistrict = districts;

      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredDistrict = districts.filter(district =>
          district.nom.toLowerCase().includes(lower)
        );
      });

    }
    async actualisationSelectType(){
      let type_structure = await this.authService.getSelectList(environment.liste_type_structure_active,['nom']);
      this.filteredType = type_structure;

      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredType = type_structure.filter(type =>
          type.nom.toLowerCase().includes(lower)
        );
      });

    }

      // Ouverture de modal pour modification
      openModalToogleStatestructure() {
  
       
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
            if(this.structure.state == 1) state = 0;
            else state = 1;
  
    
               this.structureService.changementStatestructure(this.structure, state).subscribe({
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
      this.titleModal = this.__('structure.title_add_modal');
      this.structure = new structure();
      this.actualisationSelectType();
      this.actualisationSelectDistrict();

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
      this.liststructures = result.data;
      console.log(this.liststructures);
      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.liststructures.filter(_ => _.id == this.idstructure);
      this.structure = res[0];
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
