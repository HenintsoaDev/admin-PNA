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
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface UploadedFile {
  file: File;
  preview?: SafeUrl;
}

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
      "nomColonne" : '',
      "colonneTable" : "",
      "table" : ""
    },

    {
      "nomColonne" : this.__('produit.code'),
      "colonneTable" : "code",
      "table" : "produit"
    },
/*     {
      "nomColonne" : this.__('produit.dci'),
      "colonneTable" : "dci",
      "table" : "produit"
    }, */
    {
      "nomColonne" : this.__('produit.dci'),
      "colonneTable" : "dci",
      "table" : "produit"
    },
/*     {
      "nomColonne" : this.__('produit.dosage'),
      "colonneTable" : "dosage",
      "table" : "produit"
    }, 
    {
      "nomColonne" : this.__('produit.conditionnement'),
      "colonneTable" : "conditionnement",
      "table" : "produit"
    },*/
    {
      "nomColonne" : this.__('produit.prix_unitaire'),
      "colonneTable" : "prix_unitaire",
      "table" : "produit"
    },
    {
      "nomColonne" : this.__('produit.sous_categorie'),
      "colonneTable" : "nom",
      "table" : "sous_categorie_produit"
    },
    
    {
      "nomColonne" : this.__('global.action')
    }
  
      
    
    ]
  
  objetBody = [
          {
            'name' : 'images',
            'type' : 'image',
          },
          {
            'name' : 'code',
            'type' : 'text',
          },
     
          {
            'name' : 'dci',
            'type' : 'text',
          },
      
          {
            'name' : 'prix_unitaire',
            'type' : 'montant',
          },
          {
            'name' : 'sous_categorie',
            'type' : 'text',
          },
        
          {'name' :  'state#id'}
  ]


  listIcon = [
    {
      'icon' : 'info',
      'action' : 'detail',
      'tooltip' : this.__('global.tooltip_detail'),
      'autority' : 'GSP_26',
  
    },
    {
      'icon' : 'edit',
      'action' : 'edit',
      'tooltip' : this.__('global.tooltip_edit'),
      'autority' : 'GSP_28'
    },
    {
      'icon' : 'delete',
      'action' : 'delete',
      'tooltip' : this.__('global.tooltip_delete'),
      'autority' : 'GSP_29'
    },
    {
      'icon' : 'state',
      'autority' : 'GSP_30',
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
    filteredSousCategories: any[] = []; 
    filteredFormes: any[] = []; 
    searchControl = new FormControl('');
    uploadedFiles: any[] = [];
    uploadedFilesPdf: any[] = [];
    titre_fiche: string | Blob;
    isAdd: boolean = true;
    uploadedOneFiles: UploadedFile[];
    uploadedOneFilesPdf:any[] = [];

    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private produitService: ProduitService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService,
                private sanitizer: DomSanitizer,
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
  
              if(event.data.action == 'edit') this.openModalEditproduit();
              else if(event.data.action == 'delete') this.openModalDeleteproduit();
              else if(event.data.action == 'detail') this.openModalDetailproduit();
              else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStateproduit();
      
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
           
      });
          this.endpoint = environment.baseUrl + '/' + environment.produit;
      /***************************************** */
  
          this.produitForm = this.fb.group({
            dci: ['', Validators.required],
            code: ['', [Validators.required]],
            nom_commercial: ['', [Validators.required]],
            dosage: ['', [Validators.required]],
            conditionnement: ['', [Validators.required]],
            prix_unitaire: ['', [Validators.required]],
            description: ['', [Validators.required]],
            famille_produit_id : ['', [Validators.required]],
            categorie_produit_id : ['', [Validators.required]],
            sous_categorie_produit_id : ['', [Validators.required]],
            forme_pharmaceutique_id : ['', [Validators.required]]

        });
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  
    // Quand on faire l'ajout ou modification
    onSubmit() {

      console.log(this.produit, "FORM");
      console.log(this.uploadedFiles, "IMAGE")
      console.log(this.uploadedFilesPdf, "PDF")

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

                        this.addImage(res['data'].id);
                        this.addFicheTechnique(res['data'].id);
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


    addImage(idProduit, addOne = 1){

      const formData = new FormData();

      formData.append('produit_id', idProduit);

      if(addOne == 1){
        this.uploadedFiles.forEach(f => {
          formData.append('images[]', f.file, f.file.name);
        });
      }else{
        this.uploadedOneFiles.forEach(f => {
          formData.append('images[]', f.file, f.file.name);
        });
      }
    


      this.produitService.ajoutImageProduit(formData).subscribe({
        next: (res) => {
            if(res['code'] == 201) {
              this.toastr.success(res['msg'], this.__("global.success"));
              if(addOne == 2) {
                this.actualisationTableau();
                this.closeModal();
              }
            }else{
                this.toastr.error(res['msg'], this.__("global.error"));
            }                
          },
          error: (err) => {
          }
      }); 
    }

    annulerImage(){
      this.uploadedOneFiles = [];
    }
    annulerFiche(){
      this.uploadedFilesPdf = [];
    }
    addFicheTechnique(idProduit, addOne = 1){

      const formData = new FormData();

      formData.append('produit_id', idProduit);
      formData.append('titre', this.titre_fiche);
      this.uploadedFilesPdf.forEach(f => {
        formData.append('fiche', f.file, f.file.name);
      });


      this.produitService.ajoutFicheTechniqueProduit(formData).subscribe({
        next: (res) => {
            if(res['code'] == 201) {
              this.toastr.success(res['msg'], this.__("global.success"));
              if(addOne == 2) {
                this.actualisationTableau();
                this.closeModal();
              }
            }else{
                this.toastr.error(res['msg'], this.__("global.error"));
            }                
          },
          error: (err) => {
          }
      }); 
    }
  
    // Ouverture de modal pour modification
    openModalEditproduit() {
  
      this.titleModal = this.__('produit.title_edit_modal');

      this.isAdd = false;
  
      if (this.addproduit) {
        
        this.recupererDonnee();
        
        this.actualisationSelectFamille();
        this.actualisationSelectFormes();
        this.recupererIdCategorie(this.produit.sous_categorie_produit_id);


        // Ouverture de modal
        this.modalRef = this.modalService.show(this.addproduit, {
          class: 'modal-xl',
          backdrop: 'static',
          keyboard: false
        });
      }
    }



    async recupererIdCategorie(idSousCat = null) {

      let whereId = "";
      if (idSousCat != null) whereId = "?where=sous_categorie_produit.id|e|" + idSousCat;
  
      const resSousCat = await this.authService.getSelectList(environment.liste_sous_categorie_active + whereId, ['nom']);

      this.produit.categorie_produit_id = resSousCat[0].categorie_produit_id;
      this.actualisationSelectSousCategorie(this.produit.categorie_produit_id);
      this.recupererIdFamille(this.produit.categorie_produit_id);
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
        this.uploadedOneFiles = [];
        this.uploadedFilesPdf = [];
     
  
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
                    this.closeModal();
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

     // SUppression d'un modal
     openModalDeleteImageproduit(idImage) {
  
      Swal.fire({
        title: this.__("global.confirmation"),
        text: this.__("global.supprimer_image_?"),
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
  
             this.produitService.supprimerImageproduit(idImage).subscribe({
              next: (res) => {
                  if(res['code'] == 205) {
                    this.toastr.success(res['msg'], this.__("global.success"));
                    this.produit.images = this.produit.images?.filter(_=>_.id != idImage);
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

     // SUppression d'un modal
     openModalDeleteFicheproduit(idImage) {
  
      Swal.fire({
        title: this.__("global.confirmation"),
        text: this.__("global.supprimer_fiche_?"),
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
  
             this.produitService.supprimerFicheproduit(idImage).subscribe({
              next: (res) => {
                  if(res['code'] == 205) {
                    this.toastr.success(res['msg'], this.__("global.success"));
                    this.closeModal();
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

    async actualisationSelectFormes() {
      let formes = await this.authService.getSelectList(environment.liste_forme_active, ['nom']);
      this.filteredFormes = formes;

      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredFormes = formes.filter(forme =>
          forme.nom.toLowerCase().includes(lower)
        );
      });
    }

    recupererCategorie(event: MatSelectChange) {
      const idFamille = event.value;
      this.actualisationSelectCategorie(idFamille);
    }


    recupererSousCategorie(event: MatSelectChange) {
      const idCategorie = event.value;
      this.actualisationSelectSousCategorie(idCategorie);
    }

    async actualisationSelectCategorie(idFamille = null) {


      let endpointCategorie = "";

      if (idFamille != null) endpointCategorie = environment.liste_categorie_active + "?where=famille_produit_id|e|" + idFamille;
      else endpointCategorie = environment.liste_categorie_active;

      let categories = await this.authService.getSelectList(endpointCategorie, ['nom']);
      this.filteredCategories = categories;

      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredCategories = categories.filter(cat =>
          cat.nom.toLowerCase().includes(lower)
        );
      });

    }



    async actualisationSelectSousCategorie(idCategorie = null) {


      let endpointSousCategorie = "";

      if (idCategorie != null) endpointSousCategorie = environment.liste_sous_categorie_active + "?where=categorie_produit_id|e|" + idCategorie;
      else endpointSousCategorie = environment.liste_sous_categorie_active;

      let sous_categories = await this.authService.getSelectList(endpointSousCategorie, ['nom']);
      this.filteredSousCategories = sous_categories;

      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredSousCategories = sous_categories.filter(sous_cat =>
          sous_cat.nom.toLowerCase().includes(lower)
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
      this.titleModal = this.__('produit.title_add_modal');
      this.produit = new produit();
      this.isAdd = true;

      this.actualisationSelectFamille();
      this.actualisationSelectFormes();
      this.uploadedFiles = [];
      this.uploadedFilesPdf = [];
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
      this.listproduits = result.data;
      
      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.listproduits.filter(_ => _.id == this.idproduit);
      this.produit = res[0];
      this.produit.forme_pharmaceutique_id = this.produit.forme_id;

    }
  
    // Actualisation des données
    actualisationTableau(){
      this.passageService.appelURL('');
   }
  
   // Fermeture du modal
    closeModal() {
      this.modalRef?.hide();
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
    
          if (![ 'image/jpeg','image/webp', 'image/png'].includes(file.type)) {
            this.toastr.error(
              `Format non supporté : ${file.name}`,
              this.__('global.error')
            );
            return;
          }
    
          const uploadedFile: UploadedFile = { file };
    
          if (file.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file);
            uploadedFile.preview =
              this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          }
    
          this.uploadedFiles.push(uploadedFile);
        });
    
        this.produitForm.patchValue({
          documents: this.uploadedFiles.map(f => f.file)
        });
    
        // 🔥 reset input (important)
        input.value = '';
      }
    }


    removeFile(file: UploadedFile): void {
      if (file.preview) {
/*         URL.revokeObjectURL(file.preview);
 */      }

      this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);

     /*  this.produitForm.patchValue({
        documents: this.uploadedFiles.map(f => f.file)
      }); */
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
      if (file.preview) {
/*         URL.revokeObjectURL(file.preview);
 */      }

      this.uploadedFilesPdf = this.uploadedFilesPdf.filter(f => f !== file);

     
    }


    onFilesSelectedAdd(event: Event): void {
      const input = event.target as HTMLInputElement;
    
      if (input.files && input.files.length > 0) {
        const file = input.files[0]; // seulement 1 fichier
    
        if (file.size > 5 * 1024 * 1024) {
          this.toastr.error(
            `Le fichier ${file.name} dépasse 5Mo`,
            this.__('global.error')
          );
          return;
        }
    
        if (!file.type.startsWith('image/')) {
          this.toastr.error(
            `Seulement les images sont autorisées`,
            this.__('global.error')
          );
          return;
        }
    
        const uploadedFile: UploadedFile = { file };
    
        const objectUrl = URL.createObjectURL(file);
        uploadedFile.preview =
          this.sanitizer.bypassSecurityTrustUrl(objectUrl);
    
        // 🔥 garder seulement une image
        this.uploadedOneFiles = [uploadedFile];
    
        input.value = '';
      }
    }
    

}
