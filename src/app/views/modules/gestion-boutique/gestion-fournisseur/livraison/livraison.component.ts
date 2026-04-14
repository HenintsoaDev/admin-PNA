import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PassageService } from 'app/services/table/passage.service';
import { livraison, region } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import { LivraisonService } from 'app/services/boutique/fournisseurs/livraison.service';
import formatNumber from 'number-handler'

@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.scss']
})
export class LivraisonComponent extends Translatable implements OnInit {

  formatNumber: any = formatNumber;

  modalRef?: BsModalRef;
  
  /***************************************** */
  endpoint = "";
  header = [
    
    {
      "nomColonne" : this.__('livraison.reference'),
      "colonneTable" : "reference",
      "table" : "livraison"
    },
    {
      "nomColonne" : this.__('livraison.commande'),
      "colonneTable" : "reference",
      "table" : "commande_achat"
    },
    {
      "nomColonne" : this.__('livraison.fournisseur'),
      "colonneTable" : "raison_sociale",
      "table" : "fournisseur"
    },
    {
      "nomColonne" : this.__('livraison.entrepot'),
      "colonneTable" : "nom",
      "table" : "entrepot"
    },
 
    {
      "nomColonne" : this.__('livraison.date_expedition'),
      "colonneTable" : "date_expedition",
      "table" : "livraison"
    },
    {
      "nomColonne" : this.__('livraison.date_livraison_prevue'),
      "colonneTable" : "date_livraison_prevue",
      "table" : "livraison"
    },
    {
      "nomColonne" : this.__('livraison.numero_suivi'),
      "colonneTable" : "numero_suivi",
      "table" : "livraison"
    },
    {
      "nomColonne": this.__('commande.statut'),
      "colonneTable": "statut",
      "table": "livraison"
    },
    
    {
      "nomColonne" : this.__('global.action')
    }
    
  
      
    
    ]
  
  objetBody = [
          {
            'name' : 'reference',
            'type' : 'text',
          },
          {
            'name' : 'commande_achat_reference',
            'type' : 'text',
          },
          {
            'name' : 'fournisseur_nom',
            'type' : 'text',
          },
          {
            'name' : 'entrepot_name',
            'type' : 'text',
          },
         
          {
            'name' : 'date_expedition',
            'type' : 'text',
          },
          {
            'name' : 'date_livraison_prevue',
            'type' : 'text',
          },
          {
            'name' : 'numero_suivi',
            'type' : 'text',
          },
          {
            'name' : 'statut',
            'type' : 'statut',
          },
          
        
          {'name' :  'id'}
  ]


  listIcon = [
    {
      'icon' : 'info',
      'action' : 'detail',
      'tooltip' : this.__('global.tooltip_detail'),
      'autority' : 'GSF_1',
  
    },

  ]
  
    searchGlobal = [ 'livraison.reference', 'livraison.date_expedition','livraison.date_livraison_prevue','livraison.numero_suivi', 'commandeAchat.reference', 'commandeAchat.fournisseur.raison_sociale']
   
    /***************************************** */
  
  
  
    livraisonForm: FormGroup;
    livraison: livraison = new livraison();
    listlivraisons:livraison [] = [];

    filteredType: any[] = [];
    filteredDistrict: any[] = [];
    searchControl = new FormControl('');

    @ViewChild('addlivraison') addlivraison: TemplateRef<any> | undefined;
    @ViewChild('detaillivraison') detaillivraison: TemplateRef<any> | undefined;

    idlivraison : number;
    titleModal: string = "";

    filteredCommandes: any[] = [];
    filteredEntrepots: any[] = [];

    searchControlCommandes = new FormControl('');
    searchControlEntrepots = new FormControl('');
    indexStatutCurrent: number;

    steps = [
      { icon : "view_in_ar", label: 'PREPARATION' },
      { icon : "inventory", label: 'COLISAGE' },
      { icon : "send", label: 'EXPEDIEE' },
      { icon : "arrow_right_alt", label: 'EN_TRANSIT' },
      { icon : "local_shipping", label: 'LIVREE' },
      { icon : "check",label: 'RECEPTIONNEE' }
    ];
  isDisabled: boolean = false;

    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private livraisonService: LivraisonService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService
      ) {
      super();
    }
  
  
  
  
  subscription: Subscription;
  
    async ngOnInit() {
  
      this.authService.initAutority("GSF","GSB");
  
      this.titleModal = this.__('livraison.title_add_modal');
  
          this.passageService.appelURL(null);
  
       /***************************************** */
          // Écouter les changements de modal à travers le service si il y a des actions
          this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if(event.data){
              this.idlivraison = event.data.id;
  
              if(event.data.action == 'edit') this.openModalEditlivraison();
              else if(event.data.action == 'delete') this.openModalDeletelivraison();
              else if(event.data.action == 'detail') this.openModalDetaillivraison();
              else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStatelivraison();
      
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
           
      });
          this.endpoint = environment.baseUrl + '/' + environment.livraison;
      /***************************************** */
      

      this.initForm();
       
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  

    initForm(){
      this.livraisonForm = this.fb.group({
        date_expedition: ['', Validators.required],
        date_livraison_prevue: ['', [Validators.required]],
        transporteur: ['', [Validators.required]],
        numero_suivi: ['', [Validators.required]],
        commande_achat_id : ['', [Validators.required]],
        entrepot_id : ['', [Validators.required]],
    });
    }



    // Quand on faire l'ajout ou modification
    onSubmit() {
      if (this.livraisonForm.valid) {
  
        let msg = "";
        let msg_btn = "";
  
        if(!this.livraison.id){
           msg = this.__("global.enregistrer_donnee_?");
           msg_btn = this.__("global.oui_enregistrer");
        }else{
           msg = this.__("global.modifier_donnee_?");
           msg_btn = this.__("global.oui_modifier");
        }
        this.livraison = {
          ...this.livraison,
          ...this.livraisonForm.value
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
  
              if(!this.livraison.id){
                console.log("add")
  
                 this.livraisonService.ajoutlivraison(this.livraison).subscribe({
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
                 this.livraisonService.modifierlivraison(this.livraison).subscribe({
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
    openModalEditlivraison() {
  
      this.titleModal = this.__('livraison.title_edit_modal');
      
      if (this.addlivraison) {
  
        this.recupererDonnee();

        // Ouverture de modal
        this.modalRef = this.modalService.show(this.addlivraison, { class: 'modal-lg', backdrop: 'static',keyboard: false });
      }
    }
  
    // Detail d'un modal
    async openModalDetaillivraison() {
  
  
      this.titleModal = this.__('livraison.title_detail_modal');
  
      if (this.detaillivraison) {
  
  
        let res = await this.authService.getSelectList(environment.livraison + '/' + this.idlivraison, ['titre']);
        if (res.length != 0) {
          this.livraison = res;
        }

        this.indexStatutCurrent = this.steps.findIndex(
          step => step.label === this.livraison.statut
        );
  
  
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.detaillivraison, {
          class: 'modal-xl',backdrop:"static"
        });
      }
  
    }


    async actualisationSelectCommande() {


      let endpointCommande = environment.liste_commande_achat_active;

      let commandes = await this.authService.getSelectList(endpointCommande, ['nom']);
      this.filteredCommandes = commandes;

      this.searchControlCommandes.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredCommandes = commandes.filter(commande =>
          commande.reference.toLowerCase().includes(lower)
        );
      });

    }

    async actualisationSelectEntrepot() {


      let endpointEntrepot = environment.liste_entrepot_active;

      let entrepots = await this.authService.getSelectList(endpointEntrepot, ['nom']);
      this.filteredEntrepots = entrepots;

      this.searchControlEntrepots.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredEntrepots = entrepots.filter(entrepot =>
          entrepot.nom.toLowerCase().includes(lower)
        );
      });

    }





     // SUppression d'un modal
     openModalDeletelivraison() {
  
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
  
             this.livraisonService.supprimerlivraison(this.idlivraison).subscribe({
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
      openModalToogleStatelivraison() {
  
       
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
            if(this.livraison.state == 1) state = 0;
            else state = 1;
  
    
               this.livraisonService.changementStatelivraison(this.livraison, state).subscribe({
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
      this.titleModal = this.__('livraison.title_add_modal');
      this.livraison = new livraison();
      this.initForm();
      this.actualisationSelectCommande();
      this.actualisationSelectEntrepot();
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
      this.listlivraisons = result.data;
      console.log(this.listlivraisons);
      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.listlivraisons.filter(_ => _.id == this.idlivraison);
      this.livraison = res[0];


      /* this.livraisonForm.patchValue({
        raison_sociale: this.livraison.raison_sociale,
        code: this.livraison.code,
        email: this.livraison.email,
        adresse: this.livraison.adresse,
        ville: this.livraison.ville,
        pays: this.livraison.pays,
        telephone: tel,
        fax: this.livraison.fax,
        site_web: this.livraison.site_web,
        registre_commerce: this.livraison.registre_commerce,
        ninea: this.livraison.ninea,
      }); */


    }
  
    // Actualisation des données
    actualisationTableau(){
      this.passageService.appelURL('');
   }
  
   // Fermeture du modal
    closeModal() {
      this.modalRef?.hide();
    }


    getStatusLabel(statut: any): string {
    return statut ? this.__(`livraison.status.${statut}`) : (statut ?? '-');
  }

  getStepClass(index: number, label: string): string {
    if(label == this.livraison.statut) return 'active'
    if (index < this.indexStatutCurrent) return 'done';
    return 'todo';
  }

  getStatusBadgeClass(statut: any): string {
    return statut ? `status-${statut}` : 'status-soumise';
  }



  //Rejet virement
  valider(type) {

    let text = this.__("global.passer_commande_?");


    const swalOptions: any = {
      title: this.__("global.confirmation"),
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.__("global.oui_valider"),
      cancelButtonText: this.__("global.cancel"),
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'swal-button--confirm-custom',
        cancelButton: 'swal-button--cancel-custom'
      },
    };

    




    Swal.fire(swalOptions).then((result) => {
      

      if (result.isConfirmed) {


        
        this.isDisabled = true;
        this.livraisonService.receptionnerCommande(this.idlivraison, type).subscribe({
          next: (res) => {
            if (res['code'] == 201) {
              this.toastr.success(res['msg'], this.__("global.success"));
              this.actualisationTableau();
              this.closeModal();
            }
            else {
              this.toastr.error(res['msg'], this.__("global.error"));
              this.isDisabled = false;
            }
          },
          error: (err) => { }
        });
      }
    });
  }



}
