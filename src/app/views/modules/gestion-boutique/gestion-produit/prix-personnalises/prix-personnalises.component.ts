import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PassageService } from 'app/services/table/passage.service';
import { prix } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import { PrixService } from 'app/services/boutique/produits/prix.service';
import { MatSelectChange } from '@angular/material/select';
import formatNumber from 'number-handler'
import moment from 'moment';

@Component({
  selector: 'app-prix-personnalises',
  templateUrl: './prix-personnalises.component.html',
  styleUrls: ['./prix-personnalises.component.scss']
})
export class PrixPersonnalisesComponent extends Translatable implements OnInit {

  
  modalRef?: BsModalRef;
  
  /***************************************** */
  endpoint = "";
  header = [
    
  
    {
      "nomColonne" : this.__('prix.structure'),
      "colonneTable" : "nom",
      "table" : "structure_sanitaire"
    },
    {
      "nomColonne" : this.__('prix.produit'),
      "colonneTable" : "nom",
      "table" : "produit"
    },
    {
      "nomColonne" : this.__('prix.prix_pna'),
      "colonneTable" : "prix_unitaire",
      "table" : "produit"
    },
    {
      "nomColonne" : this.__('prix.prix_perso'),
      "colonneTable" : "prix",
      "table" : "prix_personnalise"
    },
    {
      "nomColonne" : this.__('prix.date_debut'),
      "colonneTable" : "date_debut",
      "table" : "prix_personnalise"
    },
    {
      "nomColonne" : this.__('prix.date_fin'),
      "colonneTable" : "date_fin",
      "table" : "prix_personnalise"
    },
   
    {
      "nomColonne" : this.__('global.etat')
    },

    {
      "nomColonne" : this.__('global.action')
    }
  
      
    
    ]
  
  objetBody = [
   
          {
            'name' : 'nom_structure_sanitaire',
            'type' : 'text',
          },
          {
            'name' : 'nom_produit',
            'type' : 'text',
          },
          {
            'name' : 'prix_unitaire',
            'type' : 'montant',
          },
          {
            'name' : 'prix',
            'type' : 'montant',
          },
          {
            'name' : 'date_debut',
            'type' : 'text',
          },
          {
            'name' : 'date_fin',
            'type' : 'text',
          },
          {
            'name' : 'expire',
            'type' : 'expire',
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
  
    searchGlobal = [ 'prix_personnalise.prix','produit.dci', "structure_sanitaire.nom" ]
   
    /***************************************** */
  
  
  
    prixForm: FormGroup;
    prix: prix = new prix();
    listprixs:prix [] = [];
  
    @ViewChild('addprix') addprix: TemplateRef<any> | undefined;

    idprix : number;
    titleModal: string = "";

    filteredProduits: any[] = []; 
    filteredType: any[] = [];
    filteredStructure: any[] = [];
    searchControlType = new FormControl('');
    searchControlStructure = new FormControl('');
    searchControlProduit = new FormControl('');
    formatNumber: any = formatNumber;

  
    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private prixService: PrixService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService
      ) {
      super();
    }
  
  
  
  
  subscription: Subscription;
  
    async ngOnInit() {
  
      this.authService.initAutority("GSP","GSB");
  
      this.titleModal = this.__('prix.title_add_modal');
  
          this.passageService.appelURL(null);
  
       /***************************************** */
          // Écouter les changements de modal à travers le service si il y a des actions
          this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if(event.data){
              this.idprix = event.data.id;
  
              if(event.data.action == 'edit') this.openModalEditprix();
              else if(event.data.action == 'delete') this.openModalDeleteprix();
              else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStateprix();
      
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
           
      });
          this.endpoint = environment.baseUrl + '/' + environment.prix;
      /***************************************** */
      
      this.initForm();
       
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }

    initForm(){
      this.prixForm = this.fb.group({
        structure_sanitaire_id: ['', Validators.required],
        produit_id: ['', Validators.required],
        date_debut :['', Validators.required],
        date_fin :['', Validators.required],
        prix_unitaire :['', Validators.required],
        prix :['', Validators.required],
        search_structure :[''],
        search_produit :[''],
        check_prix: [false]
       });
    }
  
    // Quand on faire l'ajout ou modification
    onSubmit() {
      if (this.prixForm.valid) {
  
        let msg = "";
        let msg_btn = "";

        this.prix = {
          ...this.prix,
          ...this.prixForm.value
        };

        this.prix.date_debut = moment(this.prix.date_debut).format('yyyy-MM-DD');
        this.prix.date_fin = moment(this.prix.date_fin).format('yyyy-MM-DD');

       /*  if(this.prix.check_prix) this.prix.etat = 1;
        else this.prix.etat = 0; */

        if(!this.prix.id){
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
  
              if(!this.prix.id){
                console.log("add")
  
                 this.prixService.ajoutprix(this.prix).subscribe({
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
                 this.prixService.modifierprix(this.prix).subscribe({
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
    openModalEditprix() {
  
      this.titleModal = this.__('prix.title_edit_modal');
  
      if (this.addprix) {

        this.recupererDonnee();
        this.actualisationSelectStructure();
        this.actualisationSelectProduits();

        // Ouverture de modal
        this.modalRef = this.modalService.show(this.addprix, {
          class: 'modal-xl',
          backdrop: 'static',
          keyboard: false
        });
      }
    }


   
 

    recupererPrix(idProduit: any) {
      let produit = this.filteredProduits.find(_ => _.id == idProduit);
    
      console.log(produit);
    
      if (produit) {
        this.prixForm.patchValue({
          prix_unitaire: produit.prix_unitaire
        });
      }
    }

    rechercherStructure() {
      const value = this.prixForm.get('search_structure')?.value;
      console.log('Recherche:', value);
      this.actualisationSelectStructure(value);
      // ataovy eto ny traitement-nao
    }

    async actualisationSelectStructure(value = null){
      let endpointStructure = "";

      if(value != null) endpointStructure = environment.liste_structure_active + "?where_or=structure_sanitaire.nom|l|" + value + ",structure_sanitaire.code|l|" + value;
      else  endpointStructure = environment.liste_structure_active ;

      let structures = await this.authService.getSelectList(endpointStructure,['name']);
      this.filteredStructure = structures;

      this.searchControlStructure.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredStructure = structures.filter(structures =>
          structures.nom.toLowerCase().includes(lower)
        );
      });

    }

    rechercherProduit() {
      const value = this.prixForm.get('search_produit')?.value;
      console.log('Recherche:', value);
      this.actualisationSelectProduits(value);
      // ataovy eto ny traitement-nao
    }
    async actualisationSelectProduits(value = null) {
      let endpointProduit = "";


      if(value != null) endpointProduit = environment.liste_produit_active + "?where_or=produit.dci|l|" + value + ",produit.code|l|" + value + ",produit.conditionnement|l|" + value;
      else  endpointProduit = environment.liste_produit_active ;

      let produits = await this.authService.getSelectList(endpointProduit, ['nom']);
      this.filteredProduits = produits;

      if(this.prix.produit_id) this.recupererPrix(this.prix.produit_id);

      this.searchControlProduit.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredProduits = produits.filter(produit =>
          produit.nom.toLowerCase().includes(lower)
        );
      });
    }
  
  
     // SUppression d'un modal
     openModalDeleteprix() {
  
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
  
             this.prixService.supprimerprix(this.idprix).subscribe({
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
      openModalToogleStateprix() {
  
       
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
            if(this.prix.state == 1) state = 0;
            else state = 1;
  
    
               this.prixService.changementStateprix(this.prix, state).subscribe({
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
      this.titleModal = this.__('prix.title_add_modal');
      this.prix = new prix();
      this.initForm();
      this.actualisationSelectProduits();
      this.actualisationSelectStructure();
      this.modalRef = this.modalService.show(template, {
        class: 'modal-xl',
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
      this.listprixs = result.data;
      console.log(this.listprixs);
      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.listprixs.filter(_ => _.id == this.idprix);
      this.prix = res[0];
      console.log(this.prix.date_debut , "date debutttt");

      let date_debut = moment(this.prix.date_debut, 'DD/MM/YYYY').format('YYYY-MM-DD');
      let date_fin = moment(this.prix.date_fin, 'DD/MM/YYYY').format('YYYY-MM-DD');

      let checkActiver= false;
      if(this.prix.state == 1)  checkActiver = true;
      else checkActiver = false;

      console.log(date_debut , "date debutttt");
      this.prixForm.patchValue({
        structure_sanitaire_id: this.prix.structure_sanitaire_id,
        produit_id: this.prix.produit_id,
        date_debut:  date_debut,
        date_fin: date_fin ,
        prix: this.prix.prix
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
