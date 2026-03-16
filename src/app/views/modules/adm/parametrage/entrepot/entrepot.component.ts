import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PassageService } from 'app/services/table/passage.service';
import { entrepot, region } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import formatNumber from 'number-handler'
import { EntrepotService } from 'app/services/admin/parametre/entrepot.service';
@Component({
  selector: 'app-entrepot',
  templateUrl: './entrepot.component.html',
  styleUrls: ['./entrepot.component.scss']
})
export class EntrepotComponent extends Translatable implements OnInit {

  modalRef?: BsModalRef;
  
  /***************************************** */
  endpoint = "";
  header = [
    
    {
      "nomColonne" : this.__('entrepot.code'),
      "colonneTable" : "code",
      "table" : "entrepot"
    },
    {
      "nomColonne" : this.__('entrepot.nom'),
      "colonneTable" : "nom",
      "table" : "entrepot"
    },
    {
      "nomColonne" : this.__('entrepot.adresse'),
      "colonneTable" : "adresse",
      "table" : "entrepot"
    },
    {
      "nomColonne" : this.__('entrepot.emplacement'),
      "colonneTable" : "emplacement",
      "table" : "entrepot"
    },
    {
      "nomColonne" : this.__('entrepot.region'),
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
            'name' : 'adresse',
            'type' : 'text',
          },
          {
            'name' : 'emplacement',
            'type' : 'text',
          },
          {
            'name' : 'nom_region',
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
  
    searchGlobal = [ 'entrepot.code', 'entrepot.nom','entrepot.adresse','entrepot.emplacement', 'region.nom']
   
    /***************************************** */
  
    formatNumber: any = formatNumber;

  
    entrepotForm: FormGroup;
    entrepot: entrepot = new entrepot();
    listentrepots:entrepot [] = [];

    filteredRegions: region[] = [];
    searchControl = new FormControl('');

    @ViewChild('addentrepot') addentrepot: TemplateRef<any> | undefined;
    @ViewChild('detailentrepot') detailentrepot: TemplateRef<any> | undefined;

    identrepot : number;
    titleModal: string = "";

  
    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private entrepotService: EntrepotService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService
      ) {
      super();
    }
  
  
  
  
  subscription: Subscription;
  
    async ngOnInit() {
  
      this.authService.initAutority("PAC","ADM");
  
      this.titleModal = this.__('entrepot.title_add_modal');
  
          this.passageService.appelURL(null);
  
       /***************************************** */
          // Écouter les changements de modal à travers le service si il y a des actions
          this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if(event.data){
              this.identrepot = event.data.id;
  
              if(event.data.action == 'edit') this.openModalEditentrepot();
              else if(event.data.action == 'delete') this.openModalDeleteentrepot();
              else if(event.data.action == 'detail') this.openModalDetailentrepot();
              else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStateentrepot();
      
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
           
      });
          this.endpoint = environment.baseUrl + '/' + environment.entrepot;
      /***************************************** */
      

      this.initForm();
       
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  

    initForm(){
      this.entrepotForm = this.fb.group({
        nom: ['', Validators.required],
        code: ['', [Validators.required]],
        emplacement: ['', [Validators.required]],
        adresse: ['', [Validators.required]],
        region_id : ['', [Validators.required]],
    });
    }



    
    // Quand on faire l'ajout ou modification
    onSubmit() {
      if (this.entrepotForm.valid) {
  
        let msg = "";
        let msg_btn = "";
  
        if(!this.entrepot.id){
           msg = this.__("global.enregistrer_donnee_?");
           msg_btn = this.__("global.oui_enregistrer");
        }else{
           msg = this.__("global.modifier_donnee_?");
           msg_btn = this.__("global.oui_modifier");
        }
        this.entrepot = {
          ...this.entrepot,
          ...this.entrepotForm.value
        };

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
  
              if(!this.entrepot.id){
                console.log("add")
  
                 this.entrepotService.ajoutentrepot(this.entrepot).subscribe({
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
                 this.entrepotService.modifierentrepot(this.entrepot).subscribe({
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
    openModalEditentrepot() {
  
      this.titleModal = this.__('entrepot.title_edit_modal');
  
      if (this.addentrepot) {
  
        this.recupererDonnee();
        this.actualisationSelect();

        // Ouverture de modal
        this.modalRef = this.modalService.show(this.addentrepot, { class: 'modal-lg', backdrop: 'static',keyboard: false });
      }
    }
  
    // Detail d'un modal
    async openModalDetailentrepot() {
  
  
      this.titleModal = this.__('entrepot.title_detail_modal');
  
      if (this.detailentrepot) {
  
  
        this.recupererDonnee();
  
  
  
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.detailentrepot, {
          class: 'modal-xl',backdrop:"static"
        });
      }
  
    }
     // SUppression d'un modal
     openModalDeleteentrepot() {
  
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
  
             this.entrepotService.supprimerentrepot(this.identrepot).subscribe({
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
      openModalToogleStateentrepot() {
  
       
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
            if(this.entrepot.state == 1) state = 0;
            else state = 1;
  
    
               this.entrepotService.changementStateentrepot(this.entrepot, state).subscribe({
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
      this.titleModal = this.__('entrepot.title_add_modal');
      this.entrepot = new entrepot();
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
      this.listentrepots = result.data;
      console.log(this.listentrepots, "LiSTE entrepot");
      console.log(this.identrepot);
      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.listentrepots.filter(_ => _.id == this.identrepot);
      this.entrepot = res[0];


      this.entrepotForm.patchValue({
        nom: this.entrepot.nom,
        code: this.entrepot.code,
        emplacement: this.entrepot.emplacement,
        adresse: this.entrepot.adresse,
        region_id : this.entrepot.region_id,
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
