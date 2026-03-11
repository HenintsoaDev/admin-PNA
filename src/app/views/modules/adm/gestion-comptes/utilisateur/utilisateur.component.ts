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
      "table" : "utilisateur"
    },
    {
      "nomColonne" : this.__('utilisateur.prenom'),
      "colonneTable" : "prenoms",
      "table" : "utilisateur"
    },
    {
      "nomColonne" : this.__('utilisateur.email'),
      "colonneTable" : "email",
      "table" : "utilisateur"
    },
    {
      "nomColonne" : this.__('utilisateur.telephone'),
      "colonneTable" : "telephone",
      "table" : "utilisateur"
    },
    {
      "nomColonne" : this.__('utilisateur.profil'),
      "colonneTable" : "name",
      "table" : "profil"
    },

    {
      "nomColonne" : this.__('utilisateur.district'),
      "colonneTable" : "name",
      "table" : "district_sabitaire"
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
            'name' : 'prenoms',
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
            'name' : 'profil_name',
            'type' : 'text',
          },
         
          {
            'name' : 'district_sanitaire_nom',
            'type' : 'text',
          },
         
        
          {'name' :  'state#id'}
  ]
  
  listIcon = [
  
    {
      'icon' : 'info',
      'action' : 'detail',
      'tooltip' : this.__('global.tooltip_detail'),
      'autority' : 'GSU_1',
  
    },
    
    {
      'icon' : 'lock_reset',
      'action' : 'regenerer_mdp',
      'tooltip' : 'Régeneration de mot de passe',
      'autority' : 'GSU_1',
  
    },
    {
      'icon' : 'edit',
      'action' : 'edit',
      'tooltip' : this.__('global.tooltip_edit'),
      'autority' : 'GSU_1',
  
    },
    {
      'icon' : 'delete',
      'action' : 'delete',
      'tooltip' : this.__('global.tooltip_delete'),
      'autority' : 'GSU_1',

  
    },
    {
      'icon' : 'state',
      'autority' : 'GSU_1',
    },
  ]
    searchGlobal = [ 'utilisateur.nom', 'utilisateur.prenom', 'utilisateur.email',  'utilisateur.telephone', 'profil.nom_profil', 'structure_sanitaire.nom', 'district_sanitaire.nom']
   
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
    filteredType: any[] = [];
    filteredStructure: any[] = [];
    filteredDistrict: any[] = [];

    searchControl = new FormControl('');

    /**INPUT PHONE */
    telephone: any;
    objetPhone : any;
    element : any;




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
      this.authService.initAutority("GSU","ADM");

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
  
        this.initForm();


        


    }

    formatTelephone(phone){

      let telephoneForm = phone.number.replace('+', '');
      let dialCode = phone.dialCode.replace('+', '');
      let telephoneFinal = "";
    
      if (telephoneForm.startsWith(dialCode)) {
        telephoneFinal = '00' + telephoneForm;
      } else {
        if (telephoneForm.startsWith('0')) {
          telephoneFinal = '00' + dialCode + telephoneForm.replace(/^0/, '');
        } else {
          telephoneFinal = '00' + dialCode + telephoneForm;
        }
      }
    
      return telephoneFinal;
    
    }


    initForm(){
      this.utilisateurForm = this.fb.group({
        nom: ['', Validators.required],
        prenoms: [''],
        email: ['', [Validators.required]],
        telephone: ['', [Validators.required]],
        district_sanitaire_id: ['', [Validators.required]],
        profil_id: ['', [Validators.required]], 
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
          
          this.utilisateur.telephone  = this.formatTelephone(this.utilisateur.telephone )

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

        this.actualisationSelectProfil();
        this.actualisationSelectDistrict();
      /*   this.recupererIdType(this.utilisateur.structure_sanitaire_id)
        this.actualisationSelectType(); */

        // Ouverture de modal
        this.modalRef = this.modalService.show(this.addutilisateur, {
          class: 'modal-lg',backdrop:"static"
        });
      }
    }
  
    async recupererIdType(idStructure = null) {

      let whereId = "";
      if (idStructure != null) whereId = "?where=structure_sanitaire.id|e|" + idStructure;
  
      const resStructure = await this.authService.getSelectList(environment.liste_structure_active + whereId, ['nom']);

      let idType = resStructure[0].type_structure_id
      this.utilisateurForm.patchValue({
        type_structure_id : idType
      });

      this.actualisationSelectStructure(idType);
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

        console.log(this.utilisateur);
  
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
  
            console.log(this.utilisateur);
               this.utilisateurService.changementStateUtilisateur(this.utilisateur, state).subscribe({
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
      this.initForm();

      this.actualisationSelectProfil();
      this.actualisationSelectDistrict();
      // this.actualisationSelectType();
      //this.actualisationSelectBureau();
      this.modalRef = this.modalService.show(template, {
        class: 'modal-lg',backdrop:"static"
      });
    }

    async actualisationSelectProfil(){
      let profils = await this.authService.getSelectList(environment.liste_profil_active,['name']);
      this.filteredProfils = profils;

      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredProfils = profils.filter(profil =>
          profil.name.toLowerCase().includes(lower)
        );
      });

    }

    async actualisationSelectDistrict(){
      let districts = await this.authService.getSelectList(environment.liste_district_active,['name']);
      this.filteredDistrict = districts;

      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredDistrict = districts.filter(district =>
          district.nom.toLowerCase().includes(lower)
        );
      });

    }

    async actualisationSelectType(){
      let type_structure = await this.authService.getSelectList(environment.liste_type_structure_active,['nom']);
      this.filteredType = type_structure;

      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredType = type_structure.filter(type =>
          type.nom.toLowerCase().includes(lower)
        );
      });

    }

    recupererStructure(event: MatSelectChange) {
      const idType = event.value;
      this.actualisationSelectStructure(idType);
      
    }

    async actualisationSelectStructure(idType = null){
      let endpointStructure = "";

      if(idType != null) endpointStructure = environment.liste_structure_active + "?where=structure_sanitaire.type_structure_id|e|" + idType;
      else  endpointStructure = environment.liste_structure_active ;

      let structures = await this.authService.getSelectList(endpointStructure,['name']);
      this.filteredStructure = structures;

      this.searchControl.valueChanges.subscribe(value => {
        const lower = value?.toLowerCase() || '';
        this.filteredStructure = structures.filter(structures =>
          structures.nom.toLowerCase().includes(lower)
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

      console.log(this.listutilisateurs);
      console.log(this.idUtilisateur);
      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      const res = this.listutilisateurs.filter(_ => _.id == this.idUtilisateur);
      if(res.length != 0){
        this.utilisateur = res[0];

        let tel = this.utilisateur.telephone?.startsWith('00')
        ? this.utilisateur.telephone.replace('00', '+')
        : this.utilisateur.telephone;


        this.utilisateurForm.patchValue({
          nom: this.utilisateur.nom,
          prenoms: this.utilisateur.prenoms,
          email: this.utilisateur.email,
          telephone: tel,
          district_sanitaire_id: this.utilisateur.district_sanitaire_id,
          profil_id: this.utilisateur.profil_id,
          structure_sanitaire_id : this.utilisateur.structure_sanitaire_id
        });
      }
   }
  
   // Fermeture du modal
    closeModal() {
      this.modalRef?.hide();
    }



 
    


}
