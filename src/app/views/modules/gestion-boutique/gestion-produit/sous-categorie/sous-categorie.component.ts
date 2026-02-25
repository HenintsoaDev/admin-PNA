import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PassageService } from 'app/services/table/passage.service';
import { sous_categorie, famille, categorie } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import { SousCategorieService } from 'app/services/boutique/produits/sous_categorie.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-sous-categorie',
  templateUrl: './sous-categorie.component.html',
  styleUrls: ['./sous-categorie.component.scss']
})
export class SousCategorieComponent extends Translatable implements OnInit {

  modalRef?: BsModalRef;
  
  /***************************************** */
  endpoint = "";
  header = [
    
    {
      "nomColonne" : this.__('sous_categorie.code'),
      "colonneTable" : "code",
      "table" : "sous_categorie_produit"
    },
    {
      "nomColonne" : this.__('sous_categorie.nom'),
      "colonneTable" : "nom",
      "table" : "sous_categorie_produit"
    },
    {
      "nomColonne" : this.__('sous_categorie.categorie'),
      "colonneTable" : "nom",
      "table" : "categorie_produit"
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
            'name' : 'categorie_produit',
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
      'autority' : 'PRM_6',
    },
  ]
  
    searchGlobal = [ 'sous_categorie_produit.code', 'sous_categorie_produit.nom', 'categorie_produit.nom']
   
    /***************************************** */
  
  
  
    sous_categorieForm: FormGroup;
    sous_categorie: sous_categorie = new sous_categorie();
    listsous_categories:sous_categorie [] = [];
  
    @ViewChild('addsous_categorie') addsous_categorie: TemplateRef<any> | undefined;
    @ViewChild('detailsous_categorie') detailsous_categorie: TemplateRef<any> | undefined;

    idsous_categorie : number;
    titleModal: string = "";

    filteredFamilles: any[] = [];
    filteredCategories: any[] = []; 
    searchControl = new FormControl('');
  
    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private sous_categorieService: SousCategorieService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService
      ) {
      super();
    }
  
  
  
  
  subscription: Subscription;
  
    async ngOnInit() {
  
      this.authService.initAutority("GSP","GSB");
  
      this.titleModal = this.__('sous_categorie.title_add_modal');
  
          this.passageService.appelURL(null);
  
       /***************************************** */
          // Écouter les changements de modal à travers le service si il y a des actions
          this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if(event.data){
              this.idsous_categorie = event.data.id;
  
              if(event.data.action == 'edit') this.openModalEditsous_categorie();
              else if(event.data.action == 'delete') this.openModalDeletesous_categorie();
              else if(event.data.action == 'detail') this.openModalDetailsous_categorie();
              else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStatesous_categorie();
      
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
           
      });
          this.endpoint = environment.baseUrl + '/' + environment.sous_categorie;
      /***************************************** */
  
          this.sous_categorieForm = this.fb.group({
            nom: ['', Validators.required],
            code: ['', [Validators.required]],
            famille_produit_id : ['', [Validators.required]],
            categorie_produit_id : ['', [Validators.required]]
        });
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  
    // Quand on faire l'ajout ou modification
    onSubmit() {
      if (this.sous_categorieForm.valid) {
  
        let msg = "";
        let msg_btn = "";
  
        if(!this.sous_categorie.id){
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
  
              if(!this.sous_categorie.id){
                console.log("add")
  
                 this.sous_categorieService.ajoutsous_categorie(this.sous_categorie).subscribe({
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
                 this.sous_categorieService.modifiersous_categorie(this.sous_categorie).subscribe({
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
    openModalEditsous_categorie() {
  
      this.titleModal = this.__('sous_categorie.title_edit_modal');
  
      if (this.addsous_categorie) {
  
        this.recupererDonnee();

        
        this.actualisationSelectFamille();
        this.recupererIdFamille(this.sous_categorie.categorie_produit_id)
        this.actualisationSelectCategorie()
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.addsous_categorie, { backdrop: 'static',keyboard: false });
      }
    }


    async recupererIdFamille(idCat = null) {

      let whereId = "";
      if (idCat != null) whereId = "?where=categorie_produit.id|e|" + idCat;
  
      const resCat = await this.authService.getSelectList(environment.liste_categorie_active + whereId, ['nom']);

      this.sous_categorie.famille_produit_id = resCat[0].famille_produit_id;
      this.actualisationSelectCategorie(this.sous_categorie.famille_produit_id);
    }

    
    // Detail d'un modal
    async openModalDetailsous_categorie() {
  
  
      this.titleModal = this.__('sous_categorie.title_detail_modal');
  
      if (this.detailsous_categorie) {
  
  
        this.recupererDonnee();
  
  
  
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.detailsous_categorie, {
          class: 'modal-xl',backdrop:"static"
        });
      }
  
    }
     // SUppression d'un modal
     openModalDeletesous_categorie() {
  
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
  
             this.sous_categorieService.supprimersous_categorie(this.idsous_categorie).subscribe({
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
  
    async actualisationSelectFamille() {
      let familles = await this.authService.getSelectList(environment.liste_famille_active, ['nom']);
      this.filteredFamilles = familles;

      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredFamilles = familles.filter(famille =>
          famille.nom.toLowerCase().includes(lower)
        );
      });
    }
    recupererCategorie(event: MatSelectChange) {
      const idFamille = event.value;

      this.actualisationSelectCategorie(idFamille);
  
    }

    async actualisationSelectCategorie(idCategorie = null) {


      let endpointCategorie = "";
      console.log("xcvb")

      if (idCategorie != null) endpointCategorie = environment.liste_categorie_active + "?where=famille_produit_id|e|" + idCategorie;
      else endpointCategorie = environment.liste_categorie_active;


      let categories = await this.authService.getSelectList(endpointCategorie, ['nom']);
      this.filteredCategories = categories;
      console.log("aaaaaaa",  this.filteredCategories)

      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredCategories = categories.filter(cat =>
          cat.nom.toLowerCase().includes(lower)
        );
      });

    }

      // Ouverture de modal pour modification
      openModalToogleStatesous_categorie() {
  
       
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
            if(this.sous_categorie.state == 1) state = 0;
            else state = 1;
  
    
               this.sous_categorieService.changementStatesous_categorie(this.sous_categorie, state).subscribe({
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
      this.titleModal = this.__('sous_categorie.title_add_modal');
      this.sous_categorie = new sous_categorie();
      this.actualisationSelectFamille();

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
      this.listsous_categories = result.data;
      console.log(this.listsous_categories);
      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.listsous_categories.filter(_ => _.id == this.idsous_categorie);
      this.sous_categorie = res[0];
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
