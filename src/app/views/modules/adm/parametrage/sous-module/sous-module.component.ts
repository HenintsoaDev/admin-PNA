import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SousModuleService } from 'app/services/admin/parametre/sous_module.service';
import { PassageService } from 'app/services/table/passage.service';
import { module, sous_module } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
declare let bootstrap: any;

@Component({
  selector: 'app-sous-module',
  templateUrl: './sous-module.component.html',
  styleUrls: ['./sous-module.component.scss']
})
export class SousModuleComponent extends Translatable implements OnInit {

  /***************************************** */
  endpoint = "";
  header = [

    {
      "nomColonne": this.__('sous_module.code'),
      "colonneTable": "code",
      "table": "sous_module"
    },
    {
      "nomColonne": this.__('sous_module.name'),
      "colonneTable": "name",
      "table": "sous_module"
    },
    {
      "nomColonne": this.__('sous_module.icon'),
      "colonneTable": "icon",
      "table": "sous_module"
    },
    {
      "nomColonne": this.__('sous_module.module'),
      "colonneTable": "name",
      "table": "module"
    },

    {
      "nomColonne": this.__('global.action')
    }
  ];

  objetBody = [
    {
      'name': 'code',
      'type': 'text',
    },
    {
      'name': 'name',
      'type': 'text',
    },

    {
      'name': 'icon',
      'type': 'text',
    },
    {
      'name': 'module',
      'type': 'text',
    },

    { 'name': 'state#id' }
  ]

  listIcon = [
    {
      'icon': 'edit',
      'action': 'edit',
      'tooltip': 'Modification',
      'autority': 'PRM_9',
    },
    {
      'icon': 'delete',
      'action': 'delete',
      'tooltip': 'Supression',
      'autority': 'PRM_11',
    },
  ]

  searchGlobal = ['sous_module.code', 'sous_module.name', 'sous_module.icon', 'module.name']

  /***************************************** */


  subscription: Subscription;
  sous_moduleForm: FormGroup;
  sous_module: sous_module = new sous_module();
  listSousModules: sous_module[] = [];
  modules: module[] = [];

  @ViewChild('addSous_module') addSousModule: TemplateRef<any> | undefined;
  idSousModule: number;
  titleModal: string = "";
  modalRef?: BsModalRef;

  filteredModules: module[] = [];
  searchControl = new FormControl('');

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private sousModuleService: SousModuleService,
    private passageService: PassageService,
    private modalService: BsModalService,
    private authService: AuthService

  ) {
    super();
    this.authService.initAutority("PRM", "ADM");
    //console.log(this.autority('PRM_20'));
  }





  async ngOnInit() {
    this.titleModal = this.__('sous_module.title_add_modal');

    this.passageService.appelURL(null);

    /***************************************** */
    // Écouter les changements de modal à travers le service si il y a des actions
    this.subscription = this.passageService.getObservable().subscribe(event => {

      if (event.data) {
        this.idSousModule = event.data.id;

        if (event.data.action == 'edit') this.openModalEditSousModule();
        else if (event.data.action == 'delete') this.openModalDeleteSousModule();
        else if (event.data.state == 0 || event.data.state == 1) this.openModalToogleStateSousModule();

        // Nettoyage immédiat de l'event
        this.passageService.clear();  // ==> à implémenter dans ton service

      }

    });
    this.endpoint = environment.baseUrl + '/' + environment.sous_module;
    /***************************************** */

    this.sous_moduleForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', [Validators.required]],
      icon: ['', [Validators.required]],
      module_id: ['', [Validators.required]]
    });





  }



  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Quand on faire l'ajout ou modification
  onSubmit() {

    console.log(this.sous_module);
    if (this.sous_moduleForm.valid) {

      let msg = "";
      let msg_btn = "";

      if (!this.sous_module.id) {
        msg = this.__("global.enregistrer_donnee_?");
        msg_btn = this.__("global.oui_enregistrer");
      } else {
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

          if (!this.sous_module.id) {
            console.log("add")

            this.sousModuleService.ajoutSousModule(this.sous_module).subscribe({
              next: (res) => {

                if (res['code'] == 201) {
                  this.toastr.success(res['msg'], this.__("global.success"));
                  this.actualisationTableau();
                  this.closeModal();
                }
                else if (res['code'] == 400) {
                  if (res['data'].code) this.toastr.error(res['data'].code[0], this.__("global.error"));
                  else this.toastr.error(res['data'], this.__("global.error"));
                } else {
                  this.toastr.error(res['msg'], this.__("global.error"));
                }

              },
              error: (err) => {
              }
            });

          } else {
            console.log("edit")
            this.sousModuleService.modifierSousModule(this.sous_module).subscribe({
              next: (res) => {
                if (res['code'] == 201) {
                  this.toastr.success(res['msg'], this.__("global.success"));
                  this.actualisationTableau();
                  this.closeModal();
                }
                else {
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
  openModalEditSousModule() {

    this.titleModal = this.__('sous_module.title_edit_modal');

    if (this.addSousModule) {


      this.recupererDonnee();

      this.actualisationSelect();

      // Ouverture de modal
      this.modalRef = this.modalService.show(this.addSousModule, { backdrop: 'static', keyboard: false });
    }
  }

  // Récuperation des donnée
  recupererDonnee() {

    // Récupérer la liste affichée dans le tableau depuis le localStorage.
    const storedData = localStorage.getItem('data');
    let result: any;
    if (storedData) result = JSON.parse(storedData);
    this.listSousModules = result.data;

    // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
    const res = this.listSousModules.filter(_ => _.id == this.idSousModule);
    this.sous_module = res[0];

  }


  // SUppression d'un modal
  openModalDeleteSousModule() {

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

        this.sousModuleService.supprimerSousModule(this.idSousModule).subscribe({
          next: (res) => {
            if (res['code'] == 204) {
              this.toastr.success(res['msg'], this.__("global.success"));
              this.actualisationTableau();
            }
            else {
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
  openModalToogleStateSousModule() {


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
        if (this.sous_module.state == 1) state = 0;
        else state = 1;


        this.sousModuleService.changementStateSousModule(this.sous_module, state).subscribe({
          next: (res) => {
            if (res['code'] == 201) {
              this.toastr.success(res['msg'], this.__("global.success"));
              this.actualisationTableau();
            }
            else {
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
  async openModalAdd(template: TemplateRef<any>) {
    this.titleModal = this.__('sous_module.title_add_modal');
    this.sous_module = new sous_module();
    this.actualisationSelect();
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false
    });
  }

  async actualisationSelect() {
    this.modules = await this.authService.getSelectList(environment.liste_module_active, ['name']);
    this.filteredModules = this.modules;

    this.searchControl.valueChanges.subscribe(value => {
      const lower = value?.toLowerCase() || '';
      this.filteredModules = this.modules.filter(mod =>
        mod.name.toLowerCase().includes(lower)
      );
    });
  }


  // Actualisation des données
  actualisationTableau() {
    this.passageService.appelURL('');
  }

  // Fermeture du modal
  closeModal() {
    this.modalRef?.hide();
  }



}


