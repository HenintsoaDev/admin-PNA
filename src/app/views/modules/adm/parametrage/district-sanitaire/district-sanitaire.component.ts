import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PassageService } from 'app/services/table/passage.service';
import { district, region } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import { DistrictService } from 'app/services/admin/parametre/district.service';

@Component({
  selector: 'app-district-sanitaire',
  templateUrl: './district-sanitaire.component.html',
  styleUrls: ['./district-sanitaire.component.scss']
})
export class DistrictSanitaireComponent extends Translatable implements OnInit {

  modalRef?: BsModalRef;
  
  /***************************************** */
  endpoint = "";
  header = [
    
    {
      "nomColonne" : this.__('district.code'),
      "colonneTable" : "code",
      "table" : "district_sanitaire"
    },
    {
      "nomColonne" : this.__('district.nom'),
      "colonneTable" : "nom",
      "table" : "district_sanitaire"
    },
    {
      "nomColonne" : this.__('district.email'),
      "colonneTable" : "email",
      "table" : "district_sanitaire"
    },
    {
      "nomColonne" : this.__('district.responsable'),
      "colonneTable" : "responsable",
      "table" : "district_sanitaire"
    },
    {
      "nomColonne" : this.__('district.region'),
      "colonneTable" : "nom",
      "table" : "region"
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
            'name' : 'responsable',
            'type' : 'text',
          },
          {
            'name' : 'region',
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
  
    searchGlobal = [ 'district_sanitaire.code', 'district_sanitaire.nom','district_sanitaire.responsable','district_sanitaire.email', 'region.nom']
   
    /***************************************** */
  
  
  
    districtForm: FormGroup;
    district: district = new district();
    listdistricts:district [] = [];
  
    @ViewChild('adddistricte') adddistrict: TemplateRef<any> | undefined;
    @ViewChild('detaildistrict') detaildistrict: TemplateRef<any> | undefined;

    idDistrict : number;
    titleModal: string = "";

    filteredRegions: region[] = [];
    searchControl = new FormControl('');
  
    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private districtService: DistrictService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService
      ) {
      super();
    }
  
  
  
  
  subscription: Subscription;
  
    async ngOnInit() {
  
      this.authService.initAutority("PAC","ADM");
  
      this.titleModal = this.__('district.title_add_modal');
  
          this.passageService.appelURL(null);
  
       /***************************************** */
          // Écouter les changements de modal à travers le service si il y a des actions
          this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if(event.data){
              this.idDistrict = event.data.id;
  
              if(event.data.action == 'edit') this.openModalEditDistrict();
              else if(event.data.action == 'delete') this.openModalDeleteDistrict();
              else if(event.data.action == 'detail') this.openModalDetailDistrict();
              else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStateDistrict();
      
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
           
      });
          this.endpoint = environment.baseUrl + '/' + environment.district;
      /***************************************** */
      

      this.initForm();
       
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  

    initForm(){
      this.districtForm = this.fb.group({
        nom: ['', Validators.required],
        code: ['', [Validators.required]],
        email: ['', [Validators.required]],
        responsable: ['', [Validators.required]],
        fax : ['', [Validators.required]],
        telephone : ['', [Validators.required]],
        region_id : ['', [Validators.required]]
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
      if (this.districtForm.valid) {
  
        let msg = "";
        let msg_btn = "";
  
        if(!this.district.id){
           msg = this.__("global.enregistrer_donnee_?");
           msg_btn = this.__("global.oui_enregistrer");
        }else{
           msg = this.__("global.modifier_donnee_?");
           msg_btn = this.__("global.oui_modifier");
        }
        this.district = {
          ...this.district,
          ...this.districtForm.value
        };
        this.district.telephone  = this.formatTelephone(this.district.telephone )

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
  
              if(!this.district.id){
                console.log("add")
  
                 this.districtService.ajoutDistrict(this.district).subscribe({
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
                 this.districtService.modifierDistrict(this.district).subscribe({
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
    openModalEditDistrict() {
  
      this.titleModal = this.__('district.title_edit_modal');
  
      if (this.adddistrict) {
  
        this.recupererDonnee();
        this.actualisationSelect();

        // Ouverture de modal
        this.modalRef = this.modalService.show(this.adddistrict, { class: 'modal-lg', backdrop: 'static',keyboard: false });
      }
    }
  
    // Detail d'un modal
    async openModalDetailDistrict() {
  
  
      this.titleModal = this.__('district.title_detail_modal');
  
      if (this.detaildistrict) {
  
  
        this.recupererDonnee();
  
  
  
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.detaildistrict, {
          class: 'modal-xl',backdrop:"static"
        });
      }
  
    }
     // SUppression d'un modal
     openModalDeleteDistrict() {
  
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
  
             this.districtService.supprimerDistrict(this.idDistrict).subscribe({
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
  
    async actualisationSelect() {
      let regions = await this.authService.getSelectList(environment.liste_region_active, ['nom']);
      this.filteredRegions = regions;
      console.log(this.filteredRegions);
      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredRegions = regions.filter(reg =>
          reg.nom.toLowerCase().includes(lower)
        );
      });
    }

      // Ouverture de modal pour modification
      openModalToogleStateDistrict() {
  
       
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
            if(this.district.state == 1) state = 0;
            else state = 1;
  
    
               this.districtService.changementStateDistrict(this.district, state).subscribe({
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
      this.titleModal = this.__('district.title_add_modal');
      this.district = new district();
      this.actualisationSelect();
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
      this.listdistricts = result.data;
      console.log(this.listdistricts);
      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.listdistricts.filter(_ => _.id == this.idDistrict);
      this.district = res[0];
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
