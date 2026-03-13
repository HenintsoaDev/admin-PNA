import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PassageService } from 'app/services/table/passage.service';
import { categorie, famille } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import { CategorieService } from 'app/services/boutique/produits/categorie.service';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss']
})
export class CategorieComponent extends Translatable implements OnInit {

  modalRef?: BsModalRef;
  
  /***************************************** */
  endpoint = "";
  header = [
    
    {
      "nomColonne" : this.__('categorie.code'),
      "colonneTable" : "code",
      "table" : "categorie_produit"
    },
    {
      "nomColonne" : this.__('categorie.nom'),
      "colonneTable" : "nom",
      "table" : "categorie_produit"
    },
    {
      "nomColonne" : this.__('categorie.famille'),
      "colonneTable" : "nom",
      "table" : "famille_produit"
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
            'name' : 'famille_produit',
            'type' : 'text',
          },
        
          {'name' :  'state#id'}
  ]


  listIcon = [
    {
      'icon' : 'info',
      'action' : 'detail',
      'tooltip' : this.__('global.tooltip_detail'),
      'autority' : 'GSP_7',
  
    },
    {
      'icon' : 'edit',
      'action' : 'edit',
      'tooltip' : this.__('global.tooltip_edit'),
      'autority' : 'GSP_9'
    },
    {
      'icon' : 'delete',
      'action' : 'delete',
      'tooltip' : this.__('global.tooltip_delete'),
      'autority' : 'GSP_10'
    },
    {
      'icon' : 'state',
      'autority' : 'GSP_10',
    },
  ]
  
    searchGlobal = [ 'categorie_produit.code', 'categorie_produit.nom', 'famille_produit.nom']
   
    /***************************************** */
  
  
  
    categorieForm: FormGroup;
    categorie: categorie = new categorie();
    listcategories:categorie [] = [];
  
    @ViewChild('addcategorie') addcategorie: TemplateRef<any> | undefined;
    @ViewChild('detailcategorie') detailcategorie: TemplateRef<any> | undefined;

    idcategorie : number;
    titleModal: string = "";

    filteredFamilles: famille[] = [];
    searchControl = new FormControl('');
  
    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private categorieService: CategorieService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService
      ) {
      super();
    }
  
  
  
  
  subscription: Subscription;
  
    async ngOnInit() {
  
      this.authService.initAutority("GSP","GSB");
  
      this.titleModal = this.__('categorie.title_add_modal');
  
          this.passageService.appelURL(null);
  
       /***************************************** */
          // Écouter les changements de modal à travers le service si il y a des actions
          this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if(event.data){
              this.idcategorie = event.data.id;
  
              if(event.data.action == 'edit') this.openModalEditCategorie();
              else if(event.data.action == 'delete') this.openModalDeleteCategorie();
              else if(event.data.action == 'detail') this.openModalDetailCategorie();
              else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStateCategorie();
      
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
           
      });
          this.endpoint = environment.baseUrl + '/' + environment.categorie;
      /***************************************** */
  
          this.categorieForm = this.fb.group({
            nom: ['', Validators.required],
            code: ['', [Validators.required]],
            famille_produit_id : ['', [Validators.required]]
        });
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  
    // Quand on faire l'ajout ou modification
    onSubmit() {
      if (this.categorieForm.valid) {
  
        let msg = "";
        let msg_btn = "";
  
        if(!this.categorie.id){
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
  
              if(!this.categorie.id){
                console.log("add")
  
                 this.categorieService.ajoutCategorie(this.categorie).subscribe({
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
                 this.categorieService.modifierCategorie(this.categorie).subscribe({
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
    openModalEditCategorie() {
  
      this.titleModal = this.__('categorie.title_edit_modal');
  
      if (this.addcategorie) {
  
        this.recupererDonnee();
        this.actualisationSelect();

        // Ouverture de modal
        this.modalRef = this.modalService.show(this.addcategorie, { backdrop: 'static',keyboard: false });
      }
    }
  
    // Detail d'un modal
    async openModalDetailCategorie() {
  
  
      this.titleModal = this.__('categorie.title_detail_modal');
  
      if (this.detailcategorie) {
  
  
        this.recupererDonnee();
  
  
  
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.detailcategorie, {
          class: 'modal-xl',backdrop:"static"
        });
      }
  
    }
     // SUppression d'un modal
     openModalDeleteCategorie() {
  
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
  
             this.categorieService.supprimerCategorie(this.idcategorie).subscribe({
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
      let familles = await this.authService.getSelectList(environment.liste_famille_active, ['nom']);
      this.filteredFamilles = familles;
      console.log(this.filteredFamilles);
      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredFamilles = familles.filter(famille =>
          famille.nom.toLowerCase().includes(lower)
        );
      });
    }

      // Ouverture de modal pour modification
      openModalToogleStateCategorie() {
  
       
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
            if(this.categorie.state == 1) state = 0;
            else state = 1;
  
    
               this.categorieService.changementStateCategorie(this.categorie, state).subscribe({
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
      this.titleModal = this.__('categorie.title_add_modal');
      this.categorie = new categorie();
      this.actualisationSelect();

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
      this.listcategories = result.data;
      console.log(this.listcategories);
      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.listcategories.filter(_ => _.id == this.idcategorie);
      this.categorie = res[0];
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
