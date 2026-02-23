import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfilService } from 'app/services/admin/parametre/profil.service';
import { PassageService } from 'app/services/table/passage.service';
import { module, profil, type_profil } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { map, startWith, Subscription, Subject, takeUntil } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import { valuesys } from 'app/shared/models/options';
import { HttpClient } from '@angular/common/http';
declare let bootstrap: any;

@Component({
  selector: 'app-profils',
  templateUrl: './profils.component.html',
  styleUrls: ['./profils.component.scss']
})
export class ProfilsComponent extends Translatable implements OnInit {

    /***************************************** */
    endpoint = "";
    header = [
      
      {
        "nomColonne" : this.__('profil.code'),
        "colonneTable" : "code",
        "table" : "profil"
      },
      {
        "nomColonne" : this.__('profil.name'),
        "colonneTable" : "name",
        "table" : "profil"
      },
      {
        "nomColonne" : this.__('profil.wallet_carte'),
        "colonneTable" : "wallet_carte",
        "table" : "profil"
      },
      {
        "nomColonne" : this.__('profil.type'),
        "colonneTable" : "name",
        "table" : "type_profil"
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
              'name' : 'name',
              'type' : 'text',
            },
            {
              'name' : 'wallet_carte_label',
              'type' : 'text',
            },
            
            {
              'name' : 'type_profil_name',
              'type' : 'text',
            },
          
            {'name' :  'state#id'}
    ]
    
    listIcon = [
      {
        'icon' : 'info',
        'action' : 'detail',
        'tooltip' : this.__('global.tooltip_detail'),
        'autority' : 'PRM_34',
    
      },
      {
        'icon' : 'handshake',
        'action' : 'affect',
        'tooltip' : this.__('profil.affect'),
    
      },
      {
        'icon' : 'edit',
        'action' : 'edit',
        'tooltip' : this.__('global.tooltip_edit'),
        'autority' : 'PRM_33',
    
      },
      {
        'icon' : 'delete',
        'action' : 'delete',
        'tooltip' : this.__('global.tooltip_delete'),
        'autority' : 'PRM_35',
  
    
      },
      {
        'icon' : 'state',
        'autority' : 'PRM_36',
      },
    ]
    
      searchGlobal = [ 'profil.code', 'profil.name', 'type_profil.name']
     
      /***************************************** */
    
    
      subscription: Subscription;
      profilForm: FormGroup;
      profil: profil = new profil();
      listProfils:profil [] = [];
      types:type_profil [] = [];
      wallet_carte: string;
  
      @ViewChild('addprofil') addProfil: TemplateRef<any> | undefined;
      @ViewChild('affectationprofil') affectationprofil: TemplateRef<any> | undefined;
      @ViewChild('detailProfil') detailProfil: TemplateRef<any> | undefined;

      idProfil : number;
      titleModal: string = "";
      modalRef?: BsModalRef;
      
      filteredTypes: type_profil[] = [];
      searchControl = new FormControl('');
      modules: any;
  
      constructor(private fb: FormBuilder,  
                  private toastr: ToastrService, 
                  private ProfilService: ProfilService,     
                  private passageService: PassageService,
                  private modalService: BsModalService,
                  private authService : AuthService,
                  private http: HttpClient
    
        ) {
        super();
  
      }
    
    
    
    
    
      async ngOnInit() {
        this.authService.initAutority("PRM","ADM");

        this.titleModal = this.__('profil.title_add_modal');
    
        this.passageService.appelURL(null);
  
         /***************************************** */
            // Écouter les changements de modal à travers le service si il y a des actions
            this.subscription = this.passageService.getObservable().subscribe(event => {
    

              if(event.data){
                this.idProfil = event.data.id;
    
                    const action = event.data.action;
                    const state = event.data.state;

                    switch (action) {
                      case 'edit':
                        this.openModalEditProfil();
                        break;
                      case 'delete':
                        this.openModalDeleteProfil();
                        break;
                      case 'affect':
                        this.openModalAffectProfil();
                        break;
                      case 'detail':
                        this.openModalDetailProfil();
                        break;
                      default:
                        if (state === 0 || state === 1) {
                          this.openModalToogleStateProfil();
                        }
                        break;
                    }

                
                // Nettoyage immédiat de l'event
                this.passageService.clear();  // ==> à implémenter dans ton service
              
              }
             
        });
            this.endpoint = environment.baseUrl + '/' + environment.profil;
        /***************************************** */
    
            this.profilForm = this.fb.group({
              name: ['', Validators.required],
              code: ['', [Validators.required]],
              wallet_carte: ['', [Validators.required]],
              type_profil_id: ['', [Validators.required]]
          });
  
  
          
  
  
      }
  
     
     
    
      ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
      }
    
      // Quand on faire l'ajout ou modification
      onSubmit() {
  
        if (this.profilForm.valid) {
    
            let msg = "";
            let msg_btn = "";
            
      
            if(!this.profil.id){
              msg = this.__("global.enregistrer_donnee_?");
              msg_btn = this.__("global.oui_enregistrer");
            }else{
              msg = this.__("global.modifier_donnee_?");
              msg_btn = this.__("global.oui_modifier");
            }

            if(this.wallet_carte == 'W') this.profil.wallet_carte = 0;
            else if(this.wallet_carte == 'C') this.profil.wallet_carte = 1;
            else if(this.wallet_carte == 'WC') this.profil.wallet_carte = 2;
      
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
              }
            }).then((result) => {
              if (!result.isConfirmed) return;
            
              const request$ = this.profil.id
                ? this.ProfilService.modifierProfil(this.profil)
                : this.ProfilService.ajoutProfil(this.profil);
            
              request$.subscribe({
                next: (res) => {
                  switch (res.code) {
                    case 201:
                      this.toastr.success(res.msg, this.__("global.success"));
                      this.actualisationTableau();
                      this.closeModal();
                      break;
            
                    case 400:
                      if (res.data?.code) {
                        this.toastr.error(res.data.code[0], this.__("global.error"));
                      } else {
                        this.toastr.error(res.data || res.msg, this.__("global.error"));
                      }
                      break;
            
                    default:
                      this.toastr.error(res.msg, this.__("global.error"));
                  }
                },
                error: (err) => {
                  this.toastr.error(this.__("global.error"), this.__("global.error"));
                  console.error('Erreur serveur :', err);
                }
              });
            });
            
    
        
          } else {
              alert("Veuillez remplir tous les champs correctement.");
          }
      }
    
      // Ouverture de modal pour modification
      openModalEditProfil() {
    
        this.titleModal = this.__('profil.title_edit_modal');
  
        if (this.addProfil) {
    
          this.recupererDonnee();

          if(this.profil.wallet_carte == 0) this.wallet_carte = 'W';
          else if(this.profil.wallet_carte == 1) this.wallet_carte = 'C' ;
          else if(this.profil.wallet_carte == 2) this.wallet_carte = 'WC' ;

          this.actualisationSelect();

          // Ouverture de modal
          this.modalRef = this.modalService.show(this.addProfil, { backdrop: 'static',keyboard: false });
        }
      }
    

        // Ouverture de modal pour modification
        async openModalAffectProfil() {
    
    
          if (this.affectationprofil) {

            this.recupererDonnee();
            this.titleModal = this.__('profil.title_affect_modal') + ' : ' + this.profil.name;

            this.modules = await this.authService.getSelectList(environment.profilage + "/" + this.idProfil,['name']);
            console.log(this.modules);
      
             //this.recupererProfilage();
  
            // Ouverture de modal
            this.modalRef = this.modalService.show(this.affectationprofil, {
              class: 'modal-xl',backdrop:"static"
            });
          }
        }
      
    
       // SUppression d'un modal
       openModalDeleteProfil() {
    
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
    
               this.ProfilService.supprimerProfil(this.idProfil).subscribe({
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
    
    
        // Ouverture de modal pour modification
        openModalToogleStateProfil() {
    
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
              if(this.profil.state == 1) state = 0;
              else state = 1;
    
      
                 this.ProfilService.changementStateProfil(this.profil, state).subscribe({
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
      
        
        async openModalDetailProfil() {
  
  
          this.titleModal = this.__('profil.title_detail_modal');
      
          if (this.detailProfil) {
      
           const result = await this.authService.getSelectList(environment.profil+ '/'+  this.idProfil);
           this.profil = result;
      
      
      
            // Ouverture de modal
            this.modalRef = this.modalService.show(this.detailProfil, {
              class: 'modal-xl',backdrop:"static"
            });
          }
      
        }
    
      // Ouverture du modal pour l'ajout
      async openModalAdd(template: TemplateRef<any>) {
        this.titleModal = this.__('profil.title_add_modal');
        this.profil = new profil();
        this.actualisationSelect();
        this.modalRef = this.modalService.show(template, {
          backdrop: 'static',
          keyboard: false
        });
      }
  
      async actualisationSelect(){
        this.types = await this.authService.getSelectList(environment.liste_type_profil_active,['name']);
        this.filteredTypes = this.types;
  
        this.searchControl.valueChanges.subscribe(value => {
          const lower = value?.toLowerCase() || '';
          this.filteredTypes = this.types.filter(type =>
            type.name.toLowerCase().includes(lower)
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
        this.listProfils = result.data;

        // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
        const res = this.listProfils.filter(_ => _.id == this.idProfil);
        if(res.length != 0){
          this.profil = res[0];
        }
     }
    
     // Fermeture du modal
      closeModal() {
        this.modalRef?.hide();
      }


      async updateActionAll(actions: any[], elm: HTMLInputElement, event: Event) {
        event.stopPropagation();
        elm.disabled = true;
      
        const isChecked = elm.checked;
        const state = isChecked ? 1 : 0;
        const ids = actions.map(item => item.id).join(',');
      
        const payload = {
          action_id: ids,
          profil_id: this.idProfil,
          state
        };
      
        try {
          const res = await this.http
            .post<any>(`${environment.baseUrl}/${environment.profilage}`, payload, valuesys.httpAuthOptions())
            .toPromise();
      
          if (res.code === 201) {
            this.toastr.success(res.msg, this.__("global.success"));
      
            // Mettre à jour les états localement
            actions.forEach(item => item.state = state);
          } else {
            // Réaction à l’échec : on inverse la case à cocher
            elm.checked = !isChecked;
            this.toastr.error(res.msg, this.__("global.error"));
          }
      
        } catch (error) {
          elm.checked = !isChecked;
          this.toastr.error(this.__("global.error"), this.__("global.error"));
        } finally {
          elm.disabled = false;
        }
      }
      
      
      async updateAction(action: any, elm: HTMLInputElement) {
        elm.disabled = true;
      
        const isChecked = elm.checked;
        const state = isChecked ? 1 : 0;
        const payload = {
          action_id: action.id,
          profil_id: this.idProfil,
          state
        };
      
        try {
          const res = await this.http
            .post<any>(`${environment.baseUrl}/${environment.profilage}`, payload, valuesys.httpAuthOptions())
            .toPromise();
      
          if (res.code === 201) {
            this.toastr.success(res.msg, this.__("global.success"));
            action.state = state;
          } else {
            // Revenir à l'état précédent si échec
            elm.checked = !isChecked;
            this.toastr.error(res.msg, this.__("global.error"));
          }
      
        } catch (error) {
          elm.checked = !isChecked;
          this.toastr.error(this.__("global.error"), this.__("global.error"));
        } finally {
          elm.disabled = false;
        }
      }
      

      isCheckedAll(s_module:any){
    
        return  s_module.actions.filter((item)=>item.state == 1).length ==  s_module.actions.length
      }
    
  
    
}
