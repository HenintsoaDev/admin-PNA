import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PassageService } from 'app/services/table/passage.service';
import { module, profil, utilisateurApiNumherit } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { map, startWith, Subscription, Subject, takeUntil } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { MatSelectChange } from '@angular/material/select';
import { UtilisateurApiNumheritService } from 'app/services/admin/parametre/utilisateur_api-numherit.service';

@Component({
  selector: 'app-utilisateur-api-numherit',
  templateUrl: './utilisateur-api-numherit.component.html',
  styleUrls: ['./utilisateur-api-numherit.component.scss']
})
export class UtilisateurApiNumheritComponent extends Translatable implements OnInit {

  /***************************************** */
  endpoint = "";
  header = [
    
    {
      "nomColonne" : this.__('utilisateur.nom'),
      "colonneTable" : "firstname",
      "table" : "user_api_numherit"
    },
    {
      "nomColonne" : this.__('utilisateur.prenom'),
      "colonneTable" : "lastname",
      "table" : "user_api_numherit"
    },
    {
      "nomColonne" : this.__('utilisateur.email'),
      "colonneTable" : "email",
      "table" : "user_api_numherit"
    },
    {
      "nomColonne" : this.__('utilisateur.telephone'),
      "colonneTable" : "phonenumber",
      "table" : "user_api_numherit"
    },
 

    
    {
      "nomColonne" : this.__('global.action')
    }
  
      
    
    ]
  
  objetBody = [
          {
            'name' : 'firstname',
            'type' : 'text',
          },
          {
            'name' : 'lastname',
            'type' : 'text',
          },
          {
            'name' : 'email',
            'type' : 'text',
          },
          {
            'name' : 'phonenumber',
            'type' : 'text',
          },
       
         
        
          {'name' :  'state#id'}
  ]
  
  listIcon = [
  
    {
      'icon' : 'info',
      'action' : 'detail',
      'tooltip' : this.__('global.tooltip_detail'),
      'autority' : 'PRM_60',
  
    },
    
    {
      'icon' : 'lock_reset',
      'action' : 'regenerer_mdp',
      'tooltip' : 'Régeneration de mot de passe',
      'autority' : 'PRM_62',
  
    },
    {
      'icon' : 'edit',
      'action' : 'edit',
      'tooltip' : this.__('global.tooltip_edit'),
      'autority' : 'PRM_59',
  
    },
   
    {
      'icon' : 'state',
      'autority' : 'PRM_61',
    },
  ]
    searchGlobal = [ 'user_api_numherit.firstname', 'user_api_numherit.lastname', 'user_api_numherit.email',  'user_api_numherit.phonenumber']
   
    /***************************************** */
  
  
    subscription: Subscription;
    utilisateurForm: FormGroup;
    utilisateur: utilisateurApiNumherit = new utilisateurApiNumherit();
    listutilisateurs:utilisateurApiNumherit [] = [];

    @ViewChild('addutilisateur') addutilisateur: TemplateRef<any> | undefined;
    @ViewChild('detailUtilisateur') detailUtilisateur: TemplateRef<any> | undefined;
    idUtilisateurApi : number;
    titleModal: string = "";
    modalRef?: BsModalRef;

   
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
                private utilisateurService: UtilisateurApiNumheritService,     
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
              this.idUtilisateurApi = event.data.id;
  
              if(event.data.action == 'edit') this.openModalEditutilisateur();
              else if(event.data.action == 'delete') this.openModalDeleteutilisateur();
              else if(event.data.action == 'detail') this.openModalDetailUtilisateur();
              else if(event.data.action == 'regenerer_mdp') this.openModalRegenererMotDePasse();
              else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStateutilisateur();
              
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
        
            }
           
          
      });
          this.endpoint = environment.baseUrl + '/' + environment.utilisateur_api_numherit;
      /***************************************** */
  
          this.utilisateurForm = this.fb.group({
            firstname: ['', Validators.required],
            lastname: [''],
            username: ['', [Validators.required]],
            email: ['', [Validators.required]],
            phonenumber: ['', [Validators.required,  Validators.minLength(9)]],
           
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

        if (this.utilisateur.phonenumber.startsWith(this.dialCode)) this.utilisateur.phonenumber = this.utilisateur.phonenumber
        else this.utilisateur.phonenumber = this.dialCode + this.utilisateur.phonenumber;
      

          let msg = "";
          let msg_btn = "";
          
    
          if(!this.utilisateur.id){
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
  
              if(!this.utilisateur.id){
  
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
  
             this.utilisateurService.supprimerUtilisateur(this.idUtilisateurApi).subscribe({
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
                'user_id' : this.idUtilisateurApi
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
  
  
    this.titleModal = this.__('utilisateur.title_detail_modal_api_numherit');

    if (this.detailUtilisateur) {

     this.recupererDonnee();



      // Ouverture de modal
      this.modalRef = this.modalService.show(this.detailUtilisateur, {
        class: 'modal-xl',backdrop:"static"
      });
    }

  }

  
    // Ouverture du modal pour l'ajout
    async openModalAdd(template: TemplateRef<any>) {
      this.titleModal = this.__('utilisateur.title_add_modal');
      this.utilisateur = new utilisateurApiNumherit();
      this.utilisateurForm = this.fb.group({
          firstname: ['', Validators.required],
          lastname: [''],
          username: ['', [Validators.required]],
          email: ['', [Validators.required]],
          phonenumber: ['', [Validators.required,  Validators.minLength(9)]],
      });

      this.modalRef = this.modalService.show(template, {
        class: 'modal-lg',backdrop:"static"
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
      const res = this.listutilisateurs.filter(_ => _.id == this.idUtilisateurApi);
      if(res.length != 0){
        this.utilisateur = res[0];

        this.utilisateurForm.patchValue({
          firstname: this.utilisateur.firstname,
          lastname: this.utilisateur.lastname,
          username: this.utilisateur.username,
          email: this.utilisateur.email,
          phonenumber: this.utilisateur.phonenumber,
        })

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
      this.telephone = obj;
    }



}
