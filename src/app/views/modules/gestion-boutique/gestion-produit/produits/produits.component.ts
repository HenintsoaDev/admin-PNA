import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PassageService } from 'app/services/table/passage.service';
import { produit, famille, categorie } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import { MatSelectChange } from '@angular/material/select';
import { ProduitService } from 'app/services/boutique/produits/produit.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.scss']
})
export class ProduitsComponent extends Translatable implements OnInit {

  modalRef?: BsModalRef;
  
  /***************************************** */
  endpoint = "";
  header = [
    
    {
      "nomColonne" : this.__('produit.code'),
      "colonneTable" : "code",
      "table" : "produit"
    },
    {
      "nomColonne" : this.__('produit.dci'),
      "colonneTable" : "dci",
      "table" : "produit"
    },
    {
      "nomColonne" : this.__('produit.nom_commercial'),
      "colonneTable" : "nom_commercial",
      "table" : "produit"
    },
    {
      "nomColonne" : this.__('produit.dosage'),
      "colonneTable" : "dosage",
      "table" : "produit"
    },
    {
      "nomColonne" : this.__('produit.conditionnement'),
      "colonneTable" : "conditionnement",
      "table" : "produit"
    },
    {
      "nomColonne" : this.__('produit.prix_unitaire'),
      "colonneTable" : "prix_unitaire",
      "table" : "produit"
    },
    {
      "nomColonne" : this.__('produit.sous_categorie'),
      "colonneTable" : "sous_categorie_produit_id",
      "table" : "produit"
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
            'name' : 'dci',
            'type' : 'text',
          },
          {
            'name' : 'nom_commercial',
            'type' : 'text',
          },
          {
            'name' : 'dosage',
            'type' : 'text',
          },
          {
            'name' : 'conditionnement',
            'type' : 'text',
          },
          {
            'name' : 'prix_unitaire',
            'type' : 'text',
          },
          {
            'name' : 'sous_categorie_produit_id',
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
  
    searchGlobal = [ 'produit.code', 'produit.dci', 'produit.nom_commercial', "produit.dosage", "produit.conditionnement"]
   
    /***************************************** */
  
  
  
    produitForm: FormGroup;
    produit: produit = new produit();
    listproduits:produit [] = [];
  
    @ViewChild('addproduit') addproduit: TemplateRef<any> | undefined;
    @ViewChild('detailproduit') detailproduit: TemplateRef<any> | undefined;

    idproduit : number;
    titleModal: string = "";

    filteredFamilles: any[] = [];
    filteredCategories: any[] = []; 
    searchControl = new FormControl('');
  
    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private produitService: ProduitService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService
      ) {
      super();
    }
  
  
  
  
  subscription: Subscription;
  
    async ngOnInit() {
  
      this.authService.initAutority("GSP","GSB");
  
      this.titleModal = this.__('produit.title_add_modal');
  
          this.passageService.appelURL(null);
  
       /***************************************** */
          // Écouter les changements de modal à travers le service si il y a des actions
          this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if(event.data){
              this.idproduit = event.data.id;
  
           /*  */
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
           
      });
          this.endpoint = environment.baseUrl + '/' + environment.produit;
      /***************************************** */
  
          this.produitForm = this.fb.group({
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
      if (this.produitForm.valid) {
  
        let msg = "";
        let msg_btn = "";
  
        if(!this.produit.id){
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
  
              if(!this.produit.id){
                console.log("add")
  
                 this.produitService.ajoutproduit(this.produit).subscribe({
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
                 this.produitService.modifierproduit(this.produit).subscribe({
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
    openModalEditproduit() {
  
      this.titleModal = this.__('produit.title_edit_modal');
  
      if (this.addproduit) {
  
        this.recupererDonnee();

        
        this.actualisationSelectFamille();
        this.recupererIdFamille(this.produit.categorie_produit_id)
        this.actualisationSelectCategorie()
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.addproduit, { backdrop: 'static',keyboard: false });
      }
    }


    async recupererIdFamille(idCat = null) {

      let whereId = "";
      if (idCat != null) whereId = "?where=categorie_produit.id|e|" + idCat;
  
      const resCat = await this.authService.getSelectList(environment.liste_categorie_active + whereId, ['nom']);

      this.produit.famille_produit_id = resCat[0].famille_produit_id;
      this.actualisationSelectCategorie(this.produit.famille_produit_id);
    }

    
    // Detail d'un modal
    async openModalDetailproduit() {
  
  
      this.titleModal = this.__('produit.title_detail_modal');
  
      if (this.detailproduit) {
  
  
        this.recupererDonnee();
  
  
  
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.detailproduit, {
          class: 'modal-xl',backdrop:"static"
        });
      }
  
    }
     // SUppression d'un modal
     openModalDeleteproduit() {
  
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
  
             this.produitService.supprimerproduit(this.idproduit).subscribe({
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
      openModalToogleStateproduit() {
  
       
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
            if(this.produit.state == 1) state = 0;
            else state = 1;
  
    
               this.produitService.changementStateproduit(this.produit, state).subscribe({
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
      this.titleModal = this.__('produit.title_add_modal');
      this.produit = new produit();
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
      this.listproduits = result.data;
      console.log(this.listproduits);
      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.listproduits.filter(_ => _.id == this.idproduit);
      this.produit = res[0];
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
