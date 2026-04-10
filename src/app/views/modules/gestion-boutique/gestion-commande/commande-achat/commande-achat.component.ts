import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import formatNumber from 'number-handler'
import moment from 'moment';
import { CommandeService } from 'app/services/boutique/commandes/commande.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProduitService } from 'app/services/boutique/produits/produit.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-commande-achat',
  templateUrl: './commande-achat.component.html',
  styleUrls: ['./commande-achat.component.scss']
})
export class CommandeAchatComponent extends Translatable implements OnInit {

  
  /***************************************** */
  dateDebut: string = moment().startOf('month').format('YYYY-MM-DD');

  dateFin: string = moment().endOf('month').format('YYYY-MM-DD');
  endpoint = "";
  header = [


    
    {
      "nomColonne": this.__('commande.reference'),
      "colonneTable": "reference",
      "table": "commande_achat"
    },

    {
      "nomColonne": this.__('commande.ref_sage'),
      "colonneTable": "reference",
      "table": "commande_achat"
    },
  

    {
      "nomColonne": this.__('commande.fournisseur'),
      "colonneTable": "raison_sociale",
      "table": "fournisseur"
    },

    {
      "nomColonne": this.__('commande.date'),
      "colonneTable": "date_commande",
      "table": "commande_achat"
    },
    {
      "nomColonne": this.__('commande.montant_total_ttc'),
      "colonneTable": "montant_total_ht",
      "table": "commande_achat"
    },
    {
      "nomColonne": this.__('commande.delais'),
      "colonneTable": "delai_livraison_jours",
      "table": "commande_achat"
    },

    {
      "nomColonne": this.__('commande.statut'),
      "colonneTable": "statut",
      "table": "commande_achat"
    },


    {
      "nomColonne": this.__('global.action')
    }



  ]

  objetBody = [
   
    {
      'name': 'reference',
      'type': 'text',
    },
    {
      'name': 'reference_sage',
      'type': 'text',
    },
 


    {
      'name': 'fournisseur_nom',
      'type': 'text',
    },
    {
      'name': 'date_commande',
      'type': 'text',
    },
    {
      'name': 'montant_total_ht',
      'type': 'montant',
    },

    {
      'name': 'delai_livraison_jours',
      'type': 'number',
    },


    {
      'name': 'statut',
      'type': 'statut',
    },


    { 'name': 'id' }
  ]

  listIcon = [

    {
      'icon': 'info',
      'action': 'detail',
      'tooltip': this.__('global.tooltip_detail'),
      'autority': 'GSC_2',

    },
    {
      'icon' : 'edit',
      'action' : 'edit_commande_achat',
      'tooltip' : this.__('global.tooltip_edit'),
      'autority' : 'GSC_2'
    },


  ]
  searchGlobal = ['commande_achat.date_commande', 'fournisseur.raison_sociale','commande_achat.reference']

  /***************************************** */

  formatNumber: any = formatNumber;

  subscription: Subscription;

  @ViewChild('detailcommande') detailcommande: TemplateRef<any> | undefined;
  @ViewChild('addcommande') addcommande: TemplateRef<any> | undefined;

  idcommande: number;
  titleModal: string = "";
  modalRef?: BsModalRef;
  listAttestations: any;
  commande: any = [];
  isDisabled: boolean = false;

  index: any = 0;
  etatSelect: number = 0;

  products = [
    {
      code: 'P001',
      name: 'Laptop',
      quantity: 2,
      price: 1200
    },
    {
      code: 'P002',
      name: 'Mouse',
      quantity: 5,
      price: 25
    }
  ];

  commandeAchatForm!: FormGroup;
  currentStep = 1;

  filteredFournisseurs: any[] = [];
  searchControl = new FormControl('');
  filteredProduits: any[] = [];
  searchControlProduit = new FormControl('');

  productQuery = '';
  productQty: number = 1;
  productPrice: string = '';
  productDesignation = '';
  productSpecifications = '';
  foundProducts: any[] = [];
  selectedProduct: any = null;
  lignesDraft: any[] = [];

  produit_id: any;
  listCommande: any;

  steps = [
    { label: 'BROUILLON' },
    { label: 'EMISE' },
    { label: 'ACCUSEE' },
    { label: 'EN_PREPARATION' },
    { label: 'EXPEDIEE' },
    { label: 'RECEPTIONNEE' }
  ];
  indexStatutCurrent: number;


  private productSearchTimer?: any;
  constructor(
    private toastr: ToastrService,
    private passageService: PassageService,
    private modalService: BsModalService,
    private authService: AuthService,
    private commandeService: CommandeService,
    private datePipe: DatePipe, 
    private fb: FormBuilder,
    private produitService: ProduitService,



  ) {
    super();

  }





  async ngOnInit() {
    this.authService.initAutority("GSC", "GSB");

    this.titleModal = this.__('commande.title_add_modal');

    this.passageService.appelURL(null);

    /***************************************** */
    // Écouter les changements de modal à travers le service si il y a des actions
    this.subscription = this.passageService.getObservable().subscribe(event => {

      if (event.data) {
        this.idcommande = event.data.id;

        if(event.data.action == 'edit_commande_achat') this.openModalEditCommande();
        else if (event.data.action == 'detail') this.openModalcommande();

        // Nettoyage immédiat de l'event

      }


    });
    this.endpoint = environment.baseUrl + '/' + environment.commande_achat;
    /***************************************** */
    this.initForm();
    this.filtreTableau();

    

  }







  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }



  initForm(): void {
    this.commandeAchatForm = this.fb.group({
      fournisseur_id: ['', Validators.required],
      commentaire: [''],
      delai_livraison_jours: [''],
      date_commande: [null, Validators.required]
    });
  }
  

  filtreTableau() {

    console.log("filterDate");
    const date_debut = moment(this.dateDebut).format('yyyy-MM-DD');
    const date_fin = moment(this.dateFin).format('yyyy-MM-DD');

    let filtreDate = "";
    if (moment(new Date(date_debut)).isAfter(moment(new Date(date_fin)))) {
      this.toastr.warning(this.__('msg.dateDebut_dateFin_error'), this.__("msg.warning"));
      return;
    } else {
      filtreDate = "&where=commande_achat.date_commande|se|" + date_debut + ",commande_achat.date_commande|ie|" + date_fin;
    }
    console.log(filtreDate);
    console.log(this.endpoint);
    this.passageService.appelURL(filtreDate, this.endpoint);
  }

 

  // Detail d'un modal
  async openModalcommande() {


    this.titleModal = this.__('global.tooltip_detail');

    if (this.detailcommande) {

      this.commande = await this.authService.getSelectList(environment.commande_achat + '/' + this.idcommande, ['titre']);


    this.indexStatutCurrent = this.steps.findIndex(
      step => step.label === this.commande.statut
    );

    console.log(this.indexStatutCurrent, "index recherche");


      // Ouverture de modal
      this.modalRef = this.modalService.show(this.detailcommande, {
        class: 'modal-xl', backdrop: "static"
      });
    }

  }


   // Ouverture du modal pour l'ajout
   async openModalAdd(template: TemplateRef<any>) {
    this.titleModal = this.__('commande.title_add_achat_modal');
    this.initForm();
    this.lignesDraft = [];
    this.currentStep = 1;
    this.productPrice = '',
    this.productQty = 1,
    this.produit_id = null;
    this.actualisationSelectFournisseur();
    this.actualisationSelectProduit();

    this.modalRef = this.modalService.show(template, {
      class: 'modal-xl',backdrop:"static"
    });
  }

  downloadDirect(url: string) {
    const encodedUrl = encodeURI(url);
    const a = document.createElement('a');
    a.href = encodedUrl;
    a.target = '_blank';
    a.download = ''; // facultatif
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  getCommandeAchatStatusLabel(statut: any): string {
    console.log(statut);
    return statut ? this.__(`commande.status.${statut}`) : (statut ?? '-');
  }

  getCommandeAchatStatusBadgeClass(statut: any): string {
    return statut ? `co-status-${statut}` : 'co-status-soumise';
  }
  

  goToStep(step: number): void {
    if (step === 1) {
      this.prevStep();
      return;
    }
    if (step === 2) {
      this.nextStep();
    }
  }

  nextStep(): void {
     this.commandeAchatForm.markAllAsTouched();
    if (this.commandeAchatForm.invalid) return;

    this.currentStep = 2;
  }

  prevStep(): void {
    this.currentStep = 1;
  }


  getCommandeStatusDotClass(statut: any): string {
    return statut ? `co-dot-${statut}` : 'so-dot-soumise';
  }

  getHistoriqueUserLabel(h: any): string {
    const user = h?.nom_utilisateur;
    return user;
  }

  // Récuperation des données
  async recupererDonnee() {

    let res = await this.authService.getSelectList(environment.commande_achat + '/' + this.idcommande, ['titre']);


    if (res.length != 0) {
      this.commande = res;

      this.commandeAchatForm.patchValue({
        fournisseur_id: this.commande.fournisseur_id,
        commentaire: this.commande.commentaire,
        delai_livraison_jours: this.commande.delai_livraison_jours,
        date_commande: this.commande.date_commande 
          ? new Date(this.commande.date_commande)
          : null,
      });


    


    if (this.commande?.lignes_commande_achat?.length) {

      this.lignesDraft = []; // reset si besoin
    
      this.commande.lignes_commande_achat.forEach((ligne: any) => {

    
        this.lignesDraft.push({
          id: ligne.id,
          produit_id: ligne.produit.id,
          quantite: ligne.quantite,
          produit: ligne.produit, // ou à adapter selon ton API
          montant: ligne.montant
        });
    console.log(this.lignesDraft);
      });
    
    }


    

    }
  }

  // Ouverture de modal pour modification
openModalEditCommande() {
  
  this.titleModal = this.__('commande.title_edit_achat_modal');
  
  if (this.addcommande) {

    this.recupererDonnee();
    this.actualisationSelectFournisseur();
    this.actualisationSelectProduit();
    this.currentStep = 1;
    this.productPrice = '',
    this.productQty = 1,
    this.produit_id = null;
    // Ouverture de modal
    this.modalRef = this.modalService.show(this.addcommande, { class: 'modal-lg', backdrop: 'static',keyboard: false });
  }
}

  async actualisationSelectFournisseur() {
    let fournisseur = await this.authService.getSelectList(environment.liste_fournisseur_active, ['raison_social']);
    this.filteredFournisseurs = fournisseur;

    this.searchControl.valueChanges.subscribe(value => {
      const lower = value?.toLowerCase() || '';
      this.filteredFournisseurs = fournisseur.filter(fournisseur =>
        fournisseur.raison_social.toLowerCase().includes(lower)
      );
    });
  }

  async actualisationSelectProduit() {
    let produit = await this.authService.getSelectList(environment.liste_produit_active, ['dci']);
    this.filteredProduits = produit;

    this.searchControlProduit.valueChanges.subscribe(value => {
      const lower = value?.toLowerCase() || '';
      this.filteredProduits = produit.filter(produit =>
        produit.dci.toLowerCase().includes(lower)
      );
    });
  }


  // Fermeture du modal
  closeModal() {
    this.modalRef?.hide();
  }

  recupererPrix(idProduit) {
    let produit = this.filteredProduits.find(_ => _.id == idProduit);
    
    console.log(produit);
  
    if (produit) {
      this.productPrice = produit.prix_unitaire;
      this.produit_id = produit.id;
    }

  }

  //Rejet virement
  valider(type) {
    Swal.fire({
      title: this.__("global.confirmation"),
      text: this.__("global.passer_commande_?"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.__("global.oui_valider"),
      cancelButtonText: this.__("global.cancel"),
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'swal-button--confirm-custom',
        cancelButton: 'swal-button--cancel-custom'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.isDisabled = true;
        this.commandeService.validerCommandeAchat(this.idcommande, type).subscribe({
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

  // Actualisation des données
  actualisationTableau() {
    this.passageService.appelURL('');
  }


  async exportExcel() {
    const storedData = localStorage.getItem('data');
    let result: any;
    if (storedData) result = JSON.parse(storedData);

    const date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
    const date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');

    let title = this.__("commande.list_commande") + ' ';

    title += (date_debut != null ? " " + this.__("commande.from") + ' ' + date_debut + ' ' : '');       
    title += (date_fin != null ? " " + this.__("commande.to") + ' ' + date_fin + ' ' : '');  


    this.authService.exportExcel(this.print(result.data), title).then(
      (response: any) => {
        const a = document.createElement("a");
        a.href = response.data;
        a.download = `${this.__("commande.list_commande")}.xlsx`;
        a.click();
      },
      (error: any) => { console.log(error) }
    );
  }

  async exportPdf() {
    const storedData = localStorage.getItem('data');
    let result: any;
    if (storedData) result = JSON.parse(storedData);

    const date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
    const date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');

    let title = this.__("commande.list_commande") + ' ';

    title += (date_debut != null ? " " + this.__("commande.from") + ' ' + date_debut + ' ' : '');       
    title += (date_fin != null ? " " + this.__("commande.to") + ' ' + date_fin + ' ' : '');  

    this.authService.exportPdf(this.print(result.data), title).then(
      (response: any) => { },
      (error: any) => { console.log(error) }
    );
  }

  print(commandes: any[]) {
    const tab = commandes.map((commande: any, index: number) => {
      const t: any = {};
      t[this.__('commande.date')] = commande.date_commande;
      t[this.__('commande.reference')] = commande.reference;
      t[this.__('commande.structure')] = commande.structure_sanitaire_name;
      t[this.__('commande.montant_total_ttc')] = commande.montant_total_ttc;
      t[this.__('commande.statut')] = this.__(`soumissions.status.${commande.statut}`) ;

      return t;
    });

    return tab;
  }


  getTotalMontant(): number {
    return this.commande.lignes_commande_achat
      .reduce((total: number, ligne: any) => total + Number(ligne.montant), 0);
  }

  addLineDraft(): void {

    if (!this.produit_id) return;
    const qty = Number(this.productQty);
    if (!qty || qty <= 0) return;
    const prix = Number(this.productPrice);
    if (!prix || prix <= 0) return;

    const montant = qty * prix;
    
    
    

    const existing = this.lignesDraft.find(l => l.produit_id === this.produit_id);
    console.log(existing);
    if (existing) {
      this.toastr.error(this.__("commande.existe_commande"), this.__("global.error"));
      return;
    } else {

      let produit = this.filteredProduits.find(_ => _.id == this.produit_id);
    
    console.log(produit);
  
    if (produit) {
      this.lignesDraft.push({
        produit_id: this.produit_id,
        quantite: qty,
        produit: produit,
        montant: montant,
      });
    }


    
    }

    this.productQty = 1;
    this.productPrice = "";
    this.produit_id = null;
    console.log(this.lignesDraft)

  }

  removeLineDraft(index: number, ligne: any): void {

    if(ligne.id){
      this.commandeService.supprimerLigneCommande(ligne.id).subscribe({
        next: (res) => {
          if (res['code'] == 205){
            this.toastr.success(res['msg'], this.__("global.success"));
            this.lignesDraft.splice(index, 1);
          }
          else  this.toastr.error(res['msg'], this.__("global.error"));
        },
        error: (err) => { }
      });
    }else{
      this.lignesDraft.splice(index, 1);
    }
  }

  getTotalMontantDraft(): number {
    return this.lignesDraft.reduce((total, ligne) => {
      return  total + Number(ligne.montant);
    }, 0);
  }


  onSubmit(): void {

    const formValue = this.commandeAchatForm.value;

    const payload: any = {
      ...formValue,
      date_commande: formValue.date_commande 
        ? moment(formValue.date_commande).format('YYYY-MM-DD')
        : null,
      lignes: this.lignesDraft.map((l): any => ({
        produit_id: l.produit_id,
        quantite: l.quantite,
      }))
    };
  

    const isEdit = !!this.commande?.id;
    const msg = isEdit ? this.__('global.modifier_donnee_?') : this.__('global.enregistrer_donnee_?');
    const msgBtn = isEdit ? this.__('global.oui_modifier') : this.__('global.oui_enregistrer');

    console.log(payload);
     Swal.fire({
      title: this.__('global.confirmation'),
      text: msg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: msgBtn,
      cancelButtonText: this.__('global.cancel'),
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'swal-button--confirm-custom',
        cancelButton: 'swal-button--cancel-custom'
      }
    }).then(result => {
      if (!result.isConfirmed) return;

      const req$ = isEdit && this.commande.id
        ? this.commandeService.modifierCommandeAchat(this.commande.id, payload)
        : this.commandeService.ajoutCommandeAchat(payload);

      req$.subscribe({
        next: res => {
          if (res?.code === 201 || res?.code === 200) {
            this.toastr.success(res?.msg, this.__('global.success'));
            this.actualisationTableau();
            this.closeModal();
          } else if (res?.code === 400) {
            this.toastr.error(res?.data ?? res?.msg, this.__('global.error'));
          } else {
            this.toastr.error(res?.msg, this.__('global.error'));
          }
        },
        error: () => {}
      });
    }); 
  }




  currentDetailStep = 2; // étape active (index)

  getStepClass(index: number, label: string): string {
    console.log(this.commande.statut, "statut");
    console.log(this.indexStatutCurrent,"index stttut");
    console.log(index, "index");
    console.log(label, "label");
    if(label == this.commande.statut) return 'active'
    if (index < this.indexStatutCurrent) return 'done';
    return 'todo';
  }


}
