import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from 'app/services/admin/parametre/utilisateur.service';
import { PassageService } from 'app/services/table/passage.service';
import { module, profil, utilisateur } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { map, startWith, Subscription, Subject, takeUntil } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.scss']
})
export class UtilisateurComponent extends Translatable implements OnInit {

  /***************************************** */
  endpoint = "";
  header = [
    
    {
      "nomColonne" : this.__('utilisateur.nom'),
      "colonneTable" : "nom",
      "table" : "user"
    },
    {
      "nomColonne" : this.__('utilisateur.prenom'),
      "colonneTable" : "prenom",
      "table" : "user"
    },
    {
      "nomColonne" : this.__('utilisateur.email'),
      "colonneTable" : "email",
      "table" : "user"
    },
    {
      "nomColonne" : this.__('utilisateur.telephone'),
      "colonneTable" : "telephone",
      "table" : "user"
    },
    {
      "nomColonne" : this.__('utilisateur.profil'),
      "colonneTable" : "name",
      "table" : "profil"
    },
    {
      "nomColonne" : this.__('utilisateur.bureau'),
      "colonneTable" : "name",
      "table" : "agence"
    },

    
    {
      "nomColonne" : this.__('global.action')
    }
  
      
    
    ]
  
  objetBody = [
          {
            'name' : 'nom',
            'type' : 'text',
          },
          {
            'name' : 'prenom',
            'type' : 'text',
          },
          {
            'name' : 'email',
            'type' : 'text',
          },
          
          {
            'name' : 'telephone',
            'type' : 'text',
          },
          {
            'name' : 'profil',
            'type' : 'text',
          },
          {
            'name' : 'agence',
            'type' : 'text',
          },
         
        
          {'name' :  'state#rowid'}
  ]
  
  listIcon = [
  
    {
      'icon' : 'info',
      'action' : 'detail',
      'tooltip' : this.__('global.tooltip_detail'),
      'autority' : 'PRM_40',
  
    },
    
    {
      'icon' : 'lock_reset',
      'action' : 'regenerer_mdp',
      'tooltip' : 'Régeneration de mot de passe',
      'autority' : 'PRM_43',
  
    },
    {
      'icon' : 'edit',
      'action' : 'edit',
      'tooltip' : this.__('global.tooltip_edit'),
      'autority' : 'PRM_39',
  
    },
    {
      'icon' : 'delete',
      'action' : 'delete',
      'tooltip' : this.__('global.tooltip_delete'),
      'autority' : 'PRM_41',

  
    },
    {
      'icon' : 'state',
      'autority' : 'PRM_42',
    },
  ]
    searchGlobal = [ 'user.nom', 'user.prenom', 'user.email',  'user.telephone', 'profil.name', 'agence.name']
   
    /***************************************** */
  
  
    subscription: Subscription;
    utilisateurForm: FormGroup;
    utilisateur: utilisateur = new utilisateur();
    listutilisateurs:utilisateur [] = [];

    @ViewChild('addutilisateur') addutilisateur: TemplateRef<any> | undefined;
    @ViewChild('detailUtilisateur') detailUtilisateur: TemplateRef<any> | undefined;
    idUtilisateur : number;
    titleModal: string = "";
    modalRef?: BsModalRef;

    profils:profil [] = [];
    filteredProfils: profil[] = [];
    type_bureaux:any [] = [];
    filteredTypeBureau: any[] = [];
    bureaux:any [] = [];
    filteredBureau: any[] = [];

    searchControl = new FormControl('');

    /**INPUT PHONE */
    telephone: any;
    objetPhone : any;
    element : any;

    currenCode :string =environment.currentCodeCountry;
    formatTelephone :string = environment.formatTelephone;


    tel!: string;
    /**INPUT PHONE */

    separateDialCode = false;
	  SearchCountryField = SearchCountryField;
	  CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
	  preferredCountries: CountryISO[] = [CountryISO.Madagascar];
    //selectedCountryISO = CountryISO.Madagascar;
    phoneForm = new FormGroup({
        phone: new FormControl(undefined, [Validators.required])
    });
    selectSearch = new FormControl();

    selectedCountryISO = environment.currentCodeCountry;
    phoneNumber = '';
    dialCode: any = environment.dialCode;

    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private utilisateurService: UtilisateurService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService
  
      ) {
      super();

    }
  
  
  
  
  
    async ngOnInit() {
      this.authService.initAutority("PRM","ADM");

      this.titleModal = this.__('utilisateur.title_add_modal');
  
      this.passageService.appelURL(null);

       /***************************************** */
          // Écouter les changements de modal à travers le service si il y a des actions
          this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if( event.data){
              this.idUtilisateur = event.data.id;
  
              if(event.data.action == 'edit') this.openModalEditutilisateur();
              else if(event.data.action == 'delete') this.openModalDeleteutilisateur();
              else if(event.data.action == 'detail') this.openModalDetailUtilisateur();
              else if(event.data.action == 'regenerer_mdp') this.openModalRegenererMotDePasse();
              else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStateutilisateur();
              
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
        
            }
           
          
      });
          this.endpoint = environment.baseUrl + '/' + environment.utilisateur;
      /***************************************** */
  
          this.utilisateurForm = this.fb.group({
            nom: ['', Validators.required],
            prenom: [''],
            login: ['', [Validators.required]],
            email: ['', [Validators.required]],
            telephone: ['', [Validators.required,  Validators.minLength(9)]],
            fk_agence: ['', [Validators.required]],
            fk_profil: ['', [Validators.required]], 
            id_type_agence: ['', [Validators.required]] 
        });


        


    }

   
   
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  
    // Quand on faire l'ajout ou modification
    onSubmit() {

      if (this.utilisateurForm.valid) {

        this.utilisateur = {
          ...this.utilisateur,
          ...this.utilisateurForm.value
        };



          let msg = "";
          let msg_btn = "";
          
    
          if(!this.utilisateur.rowid){
            msg = this.__("global.enregistrer_donnee_?");
            msg_btn = this.__("global.oui_enregistrer");
          }else{
            msg = this.__("global.modifier_donnee_?");
            msg_btn = this.__("global.oui_modifier");
          }

          if (this.utilisateur.telephone.startsWith(this.dialCode))this.utilisateur.telephone = this.utilisateur.telephone
          else this.utilisateur.telephone = this.dialCode + this.utilisateur.telephone;
        
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
  
              if(!this.utilisateur.rowid){

                 this.utilisateurService.ajoutUtilisateur(this.utilisateur).subscribe({
                  next: (res) => {
                      
                        if(res['code'] == 201) {
                          this.toastr.success(res['msg'], this.__("global.success"));
                          this.actualisationTableau();
                          this.closeModal();
                        }
                        else if(res['code'] == 400){
                          if(res['data'].login) this.toastr.error(res['data'].login[0], this.__("global.error"));
                          if(res['data'].telephone) this.toastr.error(res['data'].telephone[0], this.__("global.error"));
                          if(res['data'].email) this.toastr.error(res['data'].email[0], this.__("global.error"));
                          else this.toastr.error(res['data'], this.__("global.error"));
                        }else{
                            this.toastr.error(res['msg'], this.__("global.error"));
                        }            
                              
                    },
                    error: (err) => {
                    }
                }); 
  
              }else{

                this.utilisateurService.modifierUtilisateur(this.utilisateur).subscribe({
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
    openModalEditutilisateur() {
  
      this.titleModal = this.__('utilisateur.title_edit_modal');

      if (this.addutilisateur) {
  
        this.recupererDonnee();

        this.actualisationSelectProfil();
        this.actualisationSelectTypeBureau();
        this.actualisationSelectBureau(this.utilisateur.id_type_agence);

        // Ouverture de modal
        this.modalRef = this.modalService.show(this.addutilisateur, {
          class: 'modal-lg',backdrop:"static"
        });
      }
    }
  

      
  
     // SUppression d'un modal
     openModalDeleteutilisateur() {
  
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
  
             this.utilisateurService.supprimerUtilisateur(this.idUtilisateur).subscribe({
              next: (res) => {
                  if(res['code'] == 204) {
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


     // SUppression d'un modal
     openModalRegenererMotDePasse() {
  
      Swal.fire({
        title: this.__("global.confirmation"),
        text: this.__("global.regenerer_mdp?"),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.__("global.oui_generer"),
        cancelButtonText: this.__("global.cancel"),
        allowOutsideClick: false,
        customClass: {
            confirmButton: 'swal-button--confirm-custom',
            cancelButton: 'swal-button--cancel-custom'
        },
        }).then((result) => {
        if (result.isConfirmed) {

              const data = {
                'user_id' : this.idUtilisateur
              }
  
             this.utilisateurService.regenererMotDePasse(data).subscribe({
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
  
  
      // Ouverture de modal pour modification
      openModalToogleStateutilisateur() {
  
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
            if(this.utilisateur.state == 1) state = 0;
            else state = 1;
  
    
               this.utilisateurService.changementStateUtilisateur(this.utilisateur, state).subscribe({
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
    
      
   // Detail d'un modal
   async openModalDetailUtilisateur() {
  
  
    this.titleModal = this.__('utilisateur.title_detail_modal');

    if (this.detailUtilisateur) {

     const result = await this.authService.getSelectList(environment.utilisateur+ '/'+  this.idUtilisateur);
     this.utilisateur = result;



      // Ouverture de modal
      this.modalRef = this.modalService.show(this.detailUtilisateur, {
        class: 'modal-xl',backdrop:"static"
      });
    }

  }

  
    // Ouverture du modal pour l'ajout
    async openModalAdd(template: TemplateRef<any>) {
      this.titleModal = this.__('utilisateur.title_add_modal');
      this.utilisateurForm = this.fb.group({
          nom: ['', Validators.required],
          prenom: [''],
          login: ['', [Validators.required]],
          email: ['', [Validators.required]],
          telephone: ['', [Validators.required,  Validators.minLength(9)]],
          fk_agence: ['', [Validators.required]],
          fk_profil: ['', [Validators.required]], 
          id_type_agence: ['', [Validators.required]] 
      });

      this.actualisationSelectProfil();
      this.actualisationSelectTypeBureau();
      //this.actualisationSelectBureau();
      this.modalRef = this.modalService.show(template, {
        class: 'modal-lg',backdrop:"static"
      });
    }

    async actualisationSelectProfil(){
      this.profils = await this.authService.getSelectList(environment.liste_profil_active,['name']);
      this.filteredProfils = this.profils;

      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredProfils = this.profils.filter(profil =>
          profil.name.toLowerCase().includes(lower)
        );
      });

    }

    async actualisationSelectTypeBureau(){
      this.type_bureaux = await this.authService.getSelectList(environment.liste_type_bureau_active,['name']);
      this.filteredTypeBureau = this.type_bureaux;

      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredTypeBureau = this.type_bureaux.filter(type =>
          type.name.toLowerCase().includes(lower)
        );
      });

    }

    recupererBureau(event: MatSelectChange) {
      const idTypeAgence = event.value;
      this.actualisationSelectBureau(idTypeAgence);
      
    }

    async actualisationSelectBureau(idTypeAgence = null){
      let endpointBureau = "";

      if(idTypeAgence != null) endpointBureau = environment.liste_bureau_active + "?where=agence.idtype_agence|e|" + idTypeAgence;
      else  endpointBureau = environment.liste_bureau_active ;

      this.bureaux = await this.authService.getSelectList(endpointBureau,['name']);
      this.filteredBureau = this.bureaux;

      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredBureau = this.bureaux.filter(bureau =>
          bureau.name.toLowerCase().includes(lower)
        );
      });

    }

   
    // Actualisation des données
    actualisationTableau(){
      this.passageService.appelURL('');
   }

   // Récuperation des données
   recupererDonnee(){

      // Récupérer la liste affichée dans le tableau depuis le localStorage.
      const storedData = localStorage.getItem('data');
      let result : any;
      if (storedData) result = JSON.parse(storedData);
      this.listutilisateurs = result.data;


      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.listutilisateurs.filter(_ => _.rowid == this.idUtilisateur);
      if(res.length != 0){
        this.utilisateur = res[0];

        this.utilisateurForm.patchValue({
          nom: this.utilisateur.nom,
          prenom: this.utilisateur.prenom,
          login: this.utilisateur.login,
          email: this.utilisateur.email,
          telephone: this.utilisateur.telephone,
          fk_agence: this.utilisateur.fk_agence,
          fk_profil: this.utilisateur.fk_profil,
          id_type_agence: this.utilisateur.id_type_agence
        });
      }
   }
  
   // Fermeture du modal
    closeModal() {
      this.modalRef?.hide();
    }



    changePreferredCountries() {
      this.preferredCountries = [CountryISO.India, CountryISO.Canada];
    }


    telInputObject(m:any){
      this.objetPhone = m.s
      
    }

    onCountryChange(event: any) {
      this.dialCode = event.dialCode; // ← ici tu obtiens '261' ou '221'
      
    }
    

    controle(element:any){}

    hasError: boolean = false;
    onError(obj : any) {
        this.hasError = obj;
    }

    getNumber(obj : any) {
      console.log(this.dialCode, "dialcode");
      console.log(this.dialCode);

      this.telephone = obj;
    }
    


}
