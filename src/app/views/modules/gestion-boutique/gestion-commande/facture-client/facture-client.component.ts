import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PassageService } from 'app/services/table/passage.service';
import { facture, region } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import formatNumber from 'number-handler'
import { FactureClientService } from 'app/services/boutique/commandes/facture_client.service';
import moment from 'moment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-facture-client',
  templateUrl: './facture-client.component.html',
  styleUrls: ['./facture-client.component.scss']
})
export class FactureClientComponent extends Translatable implements OnInit {

  modalRef?: BsModalRef;
  formatNumber: any = formatNumber;

/***************************************** */
endpoint = "";
header = [
  
  {
    "nomColonne" : this.__('facture.numero'),
    "colonneTable" : "numero",
    "table" : "facture_client"
  },
  {
    "nomColonne" : this.__('facture.client'),
    "colonneTable" : "noms",
    "table" : "utilisateur"
  },
  {
    "nomColonne" : this.__('facture.commande'),
    "colonneTable" : "reference",
    "table" : "commandeAchat"
  },
  {
    "nomColonne" : this.__('facture.date_facture'),
    "colonneTable" : "date_facture",
    "table" : "facture_client"
  },

  {
    "nomColonne" : this.__('facture.montant_ht'),
    "colonneTable" : "montant_ht",
    "table" : "facture_client"
  },
  {
    "nomColonne" : this.__('facture.montant_ttc'),
    "colonneTable" : "montant_ht",
    "table" : "facture_client"
  },
  {
    "nomColonne": this.__('facture.statut'),
    "colonneTable": "statut",
    "table": "facture_client"
  },
  
  {
    "nomColonne" : this.__('global.action')
  }

    
  
  ]

objetBody = [
        {
          'name' : 'numero',
          'type' : 'text',
        },
        {
          'name' : 'client_nom_complet',
          'type' : 'text',
        },
        {
          'name' : 'commande_reference',
          'type' : 'text',
        },
        {
          'name' : 'date_facture',
          'type' : 'text',
        },
       
        {
          'name' : 'montant_ht',
          'type' : 'montant',
        },
        {
          'name' : 'montant_ttc',
          'type' : 'montant',
        },
        {
          'name': 'statut',
          'type': 'statut',
        },
      
        {'name' :  'id'}
]


listIcon = [
  {
    'icon' : 'info',
    'action' : 'detail',
    'tooltip' : this.__('global.tooltip_detail'),
    'autority' : 'GSF_3',

  },


]

  searchGlobal = [ 'facture_client.numero', 'facture_client.date_facture','facture_client.montant_ht','facture_client.montant_ttc', 'commandeAchat.reference', 'fournisseur.raison_sociale']

  /***************************************** */



  factureForm: FormGroup;
  facture: facture = new facture();
  listfactures:facture [] = [];



  @ViewChild('addfacture') addfacture: TemplateRef<any> | undefined;
  @ViewChild('detailfacture') detailfacture: TemplateRef<any> | undefined;

  idfacture : number;
  titleModal: string = "";
  isDisabled: boolean;

  filteredCommandes: any[] = []; 
  searchControlCommande = new FormControl('');
  filteredStructures: any[] = []; 
  searchControlStructure = new FormControl('');
  filteredTypes: any[] = [];
  searchControlType = new FormControl('');

  dateJ: string = moment().format('YYYY-MM-DD');
  uploadedFilesPdf: any[] = [];
  uploadedFiles: any[] = [];

  constructor(private fb: FormBuilder,  
              private toastr: ToastrService, 
              private factureService: FactureClientService,     
              private passageService: PassageService,
              private modalService: BsModalService,
              private authService : AuthService,
              private sanitizer: DomSanitizer,

    ) {
    super();
  }




subscription: Subscription;

  async ngOnInit() {

    this.authService.initAutority("GSF","GSB");

    this.titleModal = this.__('facture.title_add_modal');

        this.passageService.appelURL(null);

     /***************************************** */
        // Écouter les changements de modal à travers le service si il y a des actions
        this.subscription = this.passageService.getObservable().subscribe(event => {

          if(event.data){
            this.idfacture = event.data.id;

            if(event.data.action == 'detail') this.openModalDetailfacture();
    
            // Nettoyage immédiat de l'event
            this.passageService.clear();  // ==> à implémenter dans ton service
          
          }
         
    });
        this.endpoint = environment.baseUrl + '/' + environment.facture_client;
    /***************************************** */
    

    this.initForm();
     
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  initForm(){
    this.factureForm = this.fb.group({
      commande_client_id: ['', Validators.required],
      date_facture: [this.dateJ, [Validators.required]],
      montant_ht: [0, [Validators.required]],
      montant_tva: [0, [Validators.required]],
      montant_ttc: [0, [Validators.required]],
      type_sanitaire_id: ['', [Validators.required]],
      structure_id: ['', [Validators.required]],

      
  });

  this.autoCalcul();
  }



  autoCalcul() {

    this.factureForm.get('montant_ht')?.valueChanges.subscribe(() => {
      this.calculTTC();
    });
  
    this.factureForm.get('montant_tva')?.valueChanges.subscribe(() => {
      this.calculTTC();
    });
  
  }


  calculTTC() {

    let ht = Number(this.factureForm.get('montant_ht')?.value) || 0;
    let taux = Number(this.factureForm.get('montant_tva')?.value) || 0;
  
    let ttc = ht + (ht * taux / 100);
  
    this.factureForm.patchValue({
      montant_ttc: ttc
    }, { emitEvent: false });
  
  }

  augmenterTaux() {

    let taux = Number(this.factureForm.get('montant_tva')?.value) || 0;
  
    taux++;
  
    this.factureForm.patchValue({
      montant_tva: taux
    });
  
    this.calculTTC();
  }

  diminuerTaux() {

    let taux = Number(this.factureForm.get('montant_tva')?.value) || 0;
  
    if (taux > 0) {
      taux--;
    }
  
    this.factureForm.patchValue({
      montant_tva: taux
    });
  
    this.calculTTC();
  }

  
 


  getCommandeStatusDotClass(statut: any): string {
    return statut ? `co-dot-${statut}` : 'so-dot-soumise';
  }

  getHistoriqueUserLabel(h: any): string {
    const user = h?.nom_utilisateur;
    return user;
  }

  getDocuments(facture: any | null): any[] {
    return (facture?.piecesJointe ?? []) as any[];
  }

  getDocTypeClass(typeDocument: any): string {
    const t = String(typeDocument ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');

    if (t.includes('tech')) return 'so-doc-type-technique';
    if (t.includes('fin')) return 'so-doc-type-financier';
    if (t.includes('admin')) return 'so-doc-type-administratif';
    return 'so-doc-type-neutral';
  }

  getDocIconClass(typeDocument: any): string {
    const t = String(typeDocument ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');

    if (t.includes('tech')) return 'fa fa-book';
    if (t.includes('fin')) return 'fa fa-money';
    if (t.includes('admin')) return 'fa fa-paperclip';
    return 'fa fa-file';
  }




  addFactureClient(){


    const formData = new FormData();

    formData.append('produit_id', "");
    this.uploadedFilesPdf.forEach(f => {
      formData.append('file1', f.file, f.file.name);
    });
    this.uploadedFiles.forEach(f => {
      formData.append('file2', f.file, f.file.name);
    });

    Object.keys(this.factureForm.value).forEach(key => {
        formData.append(key, this.factureForm.value[key]);
    });

    console.log(formData);

    Swal.fire({
      title: this.__("global.confirmation"),
      text: this.__("global.enregistrer_donnee_?"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.__("global.oui_enregistrer"),
      cancelButtonText: this.__("global.cancel"),
      allowOutsideClick: false,
      customClass: {
          confirmButton: 'swal-button--confirm-custom',
          cancelButton: 'swal-button--cancel-custom'
      },
      }).then((result) => {
      if (result.isConfirmed) {

        this.factureService.ajoutFactureClient(formData).subscribe({
            next: (res) => {
                if(res['code'] == 201) {
                  this.toastr.success(res['msg'], this.__("global.success"));
                    this.actualisationTableau();
                    this.closeModal();
                }else{
                    this.toastr.error(res['msg'], this.__("global.error"));
                }                
              },
              error: (err) => {
              }
          });  
      };
    
    })
   
  
  }


  onFilesPdfSelected(event: any) {
    const file: File = event.target.files[0];
  
    if (!file) {
      return;
    }
  
    // Limite à 1 fichier
    if (this.uploadedFilesPdf.length >= 1) {
      alert('Un seul fichier PDF est autorisé');
      event.target.value = '';
      return;
    }
  
    // Autoriser uniquement PDF
    if (file.type !== 'application/pdf') {
      alert('Seuls les fichiers PDF sont autorisés');
      event.target.value = '';
      return;
    }
  
    this.uploadedFilesPdf = [{
      file,
      url_documentname: file.name
    }];
  
    event.target.value = ''; // reset input
  }

  removeFilePdf(file: any): void {
    this.uploadedFilesPdf = this.uploadedFilesPdf.filter(f => f !== file);
  }


  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach(file => {
  
        if (file.size > 5 * 1024 * 1024) {
          this.toastr.error(
            `Le fichier ${file.name} dépasse 5Mo`,
            this.__('global.error')
          );
          return;
        }
  
        if (![ 'image/jpeg','image/webp', 'image/png','application/pdf' ].includes(file.type)) {
          this.toastr.error(
            `Format non supporté : ${file.name}`,
            this.__('global.error')
          );
          return;
        }
  
        const uploadedFile: any = { file };
  
        if (file.type.startsWith('image/')) {
          const objectUrl = URL.createObjectURL(file);
          uploadedFile.preview =
            this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        }
  
        this.uploadedFiles.push(uploadedFile);
      });
  
      // 🔥 reset input (important)
      input.value = '';
    }
  }


  removeFile(file: any): void {
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);
  }




  // Detail d'un modal
  async openModalDetailfacture() {


    this.titleModal = this.__('facture.title_detail_modal');

    if (this.detailfacture) {

      this.isDisabled = false;


      let res = await this.authService.getSelectList(environment.facture_client + '/' + this.idfacture, ['titre']);
      if (res.length != 0) {
        this.facture = res;
      }



      // Ouverture de modal
      this.modalRef = this.modalService.show(this.detailfacture, {
        class: 'modal-xl',backdrop:"static"
      });
    }

  }


  // Ouverture du modal pour l'ajout
  openModalAdd(template: TemplateRef<any>) {
    this.titleModal = this.__('facture.title_add_modal');
    this.facture = new facture();
    this.initForm();
    this.actualisationSelectType();
    this.uploadedFiles = [];
    this.uploadedFilesPdf = [];
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    });
  }
  

  async actualisationSelectType(){
    let type_structure = await this.authService.getSelectList(environment.liste_type_structure_active,['nom']);
    this.filteredTypes = type_structure;

    this.searchControlType.valueChanges.subscribe(value => {
      const lower = value?.toLowerCase() || '';
      this.filteredTypes = type_structure.filter(type =>
        type.nom.toLowerCase().includes(lower)
      );
    });

  }

  async actualisationSelectCommande(idStructure = null) {


    let endpointCommande = "";

    if (idStructure != null) endpointCommande = environment.liste_commande_active + "?where=commande_client.structure_sanitaire_id|e|" + idStructure;
    else endpointCommande = environment.liste_commande_active;

    
    let commandes = await this.authService.getSelectList(endpointCommande, ['reference']);
    this.filteredCommandes = commandes;

    this.searchControlCommande.valueChanges.subscribe(value => {
      const lower = value?.toLowerCase() || '';
      this.filteredCommandes = commandes.filter(com =>
        com.reference.toLowerCase().includes(lower)
      );
    });
  }
  
  recupererSanitaire(event: MatSelectChange) {
    const idType = event.value;
    this.actualisationSelectStructure(idType);
  }


  recupererCommande(event: MatSelectChange) {
    const idStructure = event.value;
    this.actualisationSelectCommande(idStructure);
  }



  async actualisationSelectStructure(idType = null) {

    let endpointStructure = "";

    if (idType != null) endpointStructure = environment.liste_structure_active + "?where=type_structure_id|e|" + idType;
    else endpointStructure = environment.liste_structure_active;

    let structures = await this.authService.getSelectList(endpointStructure, ['nom']);
    this.filteredStructures = structures;

    this.searchControlStructure.valueChanges.subscribe(value => {
      const lower = value?.toLowerCase() || '';
      this.filteredStructures = structures.filter(structure =>
        structure.nom.toLowerCase().includes(lower)
      );
    });

  }


  // Récuperation des données via plocal
  recupererDonnee(){
    // Récupérer la liste affichée dans le tableau depuis le localStorage.
    const storedData = localStorage.getItem('data');
    let result : any;
    if (storedData) result = JSON.parse(storedData);
    this.listfactures = result.data;
    console.log(this.listfactures);
    // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
    const res = this.listfactures.filter(_ => _.id == this.idfacture);
    this.facture = res[0];

  


  }

  // Actualisation des données
  actualisationTableau(){
    this.passageService.appelURL('');
 }

 // Fermeture du modal
  closeModal() {
    this.modalRef?.hide();
  }

  getStatusBadgeClass(statut: any): string {
    return statut ? `status-${statut}` : 'status-soumise';
  }

  getStatusLabel(statut: any): string {
    return statut ? this.__(`facture.status.${statut}`) : (statut ?? '-');
  }

  //Rejet virement
valider(type) {

  let text = this.__("global.valider_facture_?");
  let btn = this.__("global.oui_valider");
  if (type === 'REJETEE') {
    text = this.__("global.rejeter_facture_?");
    btn = this.__("global.oui_rejeter")
  }

  const swalOptions: any = {
    title: this.__("global.confirmation"),
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: btn,
    cancelButtonText: this.__("global.cancel"),
    allowOutsideClick: false,
    customClass: {
      confirmButton: 'swal-button--confirm-custom',
      cancelButton: 'swal-button--cancel-custom'
    },
  };

  if (type === 'REJETEE') {
    swalOptions.input = 'text';
    swalOptions.inputPlaceholder = this.__("global.motif_rejeter");
    swalOptions.inputValidator = (value: string) => {
      if (!value) {
        return this.__("global.champ_obligatoire");
      }
      return null;
    };
  }




  Swal.fire(swalOptions).then((result) => {
    

    if (result.isConfirmed) {

      let datamotif = {};

      if (type === 'REJETEE') datamotif = result.value !== true ? { motif: result.value } : {};
     
      this.isDisabled = true;
      this.factureService.validerFacture(this.idfacture, type, datamotif).subscribe({
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



  async exportExcel() {
    const storedData = localStorage.getItem('data');
    let result: any;
    if (storedData) result = JSON.parse(storedData);

    let title = this.__("facture.list_facture") ;

    this.authService.exportExcel(this.print(result.data), title).then(
      (response: any) => {
        const a = document.createElement("a");
        a.href = response.data;
        a.download = `${this.__("facture.list_facture")}.xlsx`;
        a.click();
      },
      (error: any) => { console.log(error) }
    );
  }

  async exportPdf() {
    const storedData = localStorage.getItem('data');
    let result: any;
    if (storedData) result = JSON.parse(storedData);



    let title = this.__("facture.list_facture") ;

    this.authService.exportPdf(this.print(result.data), title).then(
      (response: any) => { },
      (error: any) => { console.log(error) }
    );
  }

  print(factures: any[]) {
    const tab = factures.map((facture: any, index: number) => {
      const t: any = {};
      t[this.__('facture.numero')] = facture.numero;
      t[this.__('facture.client')] = facture.client_nom_complet;
      t[this.__('facture.commande')] = facture.commande_reference;
      t[this.__('facture.date_facture')] = facture.date_facture;
      t[this.__('facture.montant_ht')] = facture.montant_ht;
      t[this.__('facture.montant_ttc')] = facture.montant_ttc;
      t[this.__('facture.statut')] = this.getStatusLabel(facture.statut);

      return t;
    });

    return tab;
  }

}
