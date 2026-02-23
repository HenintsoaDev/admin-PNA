import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BureauService } from 'app/services/admin/gestion-bureau/bureau.service';
import { PassageService } from 'app/services/table/passage.service';
import { direction, bureau } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-bureau',
  templateUrl: './bureau.component.html',
  styleUrls: ['./bureau.component.scss']
})
export class BureauComponent extends Translatable implements OnInit {


  /***************************************** */
  endpoint = "";
  header = [
    {
      "nomColonne": this.__('bureau.code'),
      "colonneTable": "code",
      "table": "agence"
    },

    {
      "nomColonne": this.__('bureau.name'),
      "colonneTable": "name",
      "table": "agence"
    },
    /*   {
        "nomColonne" : this.__('bureau.telephone'),
        "colonneTable" : "tel",
        "table" : "agence"
      },
      {
        "nomColonne" : this.__('bureau.email'),
        "colonneTable" : "email",
        "table" : "agence"
      },     */
    {
      "nomColonne": this.__('bureau.responsable'),
      "colonneTable": "responsable",
      "table": "agence"
    },
    {
      "nomColonne": this.__('bureau.adresse'),
      "colonneTable": "adresse",
      "table": "agence"
    },
    {
      "nomColonne": this.__('bureau.departement'),
      "colonneTable": "name",
      "table": "departement"
    },



    {
      "nomColonne": this.__('global.action')
    }



  ]

  objetBody = [
    {
      'name': 'code',
      'type': 'text',
    },
    {
      'name': 'name',
      'type': 'text',
    },
    /*   {
        'name' : 'tel',
        'type' : 'text',
      },
      {
        'name' : 'email',
        'type' : 'text',
      }, */
    {
      'name': 'responsable',
      'type': 'text',
    },
    {
      'name': 'adresse',
      'type': 'text',
    },
    {
      'name': 'departement',
      'type': 'text',
    },


    { 'name': 'state#rowid' }
  ]

  listIcon = [

    {
      'icon': 'info',
      'action': 'detail',
      'tooltip': 'Détail',
      'autority': 'GBU_4',

    },

    {
      'icon': 'edit',
      'action': 'edit',
      'tooltip': 'Modification',
      'autority': 'GBU_3',

    },
    {
      'icon': 'delete',
      'action': 'delete',
      'tooltip': 'Supression',
      'autority': 'GBU_5',


    },
    {
      'icon': 'state',
      'autority': 'GBU_6',
    },
  ]
  searchGlobal = ['agence.code', 'agence.name', 'departement.name', 'agence.responsable', 'agence.adresse']

  /***************************************** */


  subscription: Subscription;
  bureauForm: FormGroup;
  bureau: bureau = new bureau();
  listbureaux: bureau[] = [];

  @ViewChild('addbureau') addbureau: TemplateRef<any> | undefined;
  @ViewChild('detailBureau') detailBureau: TemplateRef<any> | undefined;
  idbureau: number;
  titleModal: string = "";
  modalRef?: BsModalRef;

  directions: direction[] = [];
  filteredDirectionGenerals: direction[] = [];
  type_bureaux: any[] = [];
  filteredTypeBureau: any[] = [];
  departements: any[] = [];
  filteredDepartement: any[] = [];
  regions: any[] = [];
  filteredRegion: any[] = [];

  searchControl = new FormControl('');

  /**INPUT PHONE */
  telephone: any;
  objetPhone: any;
  element: any;
  currenCode: string = environment.currentCodeCountry;
  formatTelephone: string = environment.formatTelephone;
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
  dialCodeDr: any = environment.dialCode;
  objetPhoneDr: any;
  telephoneDr: any;

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private bureauService: BureauService,
    private passageService: PassageService,
    private modalService: BsModalService,
    private authService: AuthService

  ) {
    super();

  }





  async ngOnInit() {
    this.authService.initAutority("GBU", "ADM");

    this.titleModal = this.__('bureau.title_add_modal');

    this.passageService.appelURL(null);

    /***************************************** */
    // Écouter les changements de modal à travers le service si il y a des actions
    this.subscription = this.passageService.getObservable().subscribe(event => {

      if (event.data) {
        this.idbureau = event.data.id;

        if (event.data.action == 'edit') this.openModalEditbureau();
        else if (event.data.action == 'delete') this.openModalDeletebureau();
        else if (event.data.action == 'detail') this.openModalDetailBureau();
        else if (event.data.state == 0 || event.data.state == 1) this.openModalToogleStatebureau();

        // Nettoyage immédiat de l'event
        this.passageService.clear();  // ==> à implémenter dans ton service

      }


    });
    this.endpoint = environment.baseUrl + '/' + environment.bureau;
    /***************************************** */

    this.initForm();



  }




  initForm(){
    this.bureauForm = this.fb.group({
      name: ['', Validators.required],
      responsable: ['', [Validators.required]],
      code: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      direction_id: ['', [Validators.required]],
      region_id: ['', [Validators.required]],
      departement_id: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      tel: ['', [Validators.required, Validators.minLength(9)]],
      idtype_agence: ['', [Validators.required]],
      telephone_dr: [''],
      email_dr: ['', [Validators.email]],
      latitude: [''],
      longitude: [''],

    });
  }




  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }




  // Quand on faire l'ajout ou modification
  onSubmit() {


    if (this.bureauForm.valid) {

      this.bureau = {
        ...this.bureau,
        ...this.bureauForm.value
      };



      if (this.bureau.tel.startsWith(this.dialCode)) this.bureau.tel = this.bureau.tel
      else this.bureau.tel = this.dialCode + this.bureau.tel;

      if (this.bureau.telephone_dr.startsWith(this.dialCodeDr)) this.bureau.telephone_dr = this.bureau.telephone_dr
      else this.bureau.telephone_dr = this.dialCodeDr + this.bureau.telephone_dr;







      let msg = "";
      let msg_btn = "";


      if (!this.bureau.rowid) {
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

          if (!this.bureau.rowid) {

            this.bureauService.ajoutBureau(this.bureau).subscribe({
              next: (res) => {

                if (res['code'] == 201) {
                  this.toastr.success(res['msg'], this.__("global.success"));
                  this.actualisationTableau();
                  this.closeModal();
                }
                else if (res['code'] == 400) {
                  if (res['data'].tel) this.toastr.error(res['data'].tel[0], this.__("global.error"));
                  if (res['data'].email) this.toastr.error(res['data'].email[0], this.__("global.error"));
                  else this.toastr.error(res['data'], this.__("global.error"));
                } else {
                  this.toastr.error(res['msg'], this.__("global.error"));
                }

              },
              error: (err) => {
              }
            });

          } else {

            this.bureauService.modifierBureau(this.bureau).subscribe({
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
  openModalEditbureau() {

    this.titleModal = this.__('bureau.title_edit_modal');

    if (this.addbureau) {

      this.recupererDonnee();

      this.actualisationSelectDirection();
      this.actualisationSelectTypeBureau();
      this.recupererIdDirection(this.bureau.region_id);
      this.actualisationSelectDepartement(this.bureau.region_id);

      // Ouverture de modal
      this.modalRef = this.modalService.show(this.addbureau, {
        class: 'modal-lg', backdrop: "static"
      });
    }
  }




  // SUppression d'un modal
  openModalDeletebureau() {

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

        this.bureauService.supprimerBureau(this.idbureau).subscribe({
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


  // Detail d'un modal
  async openModalDetailBureau() {


    this.titleModal = this.__('bureau.title_detail_modal');

    if (this.detailBureau) {

      const result = await this.authService.getSelectList(environment.bureau + '/' + this.idbureau, ['lib_region']);
      this.bureau = result;



      // Ouverture de modal
      this.modalRef = this.modalService.show(this.detailBureau, {
        class: 'modal-xl', backdrop: "static"
      });
    }

  }


  // Ouverture de modal pour modification
  openModalToogleStatebureau() {

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
        if (this.bureau.state == 1) state = 0;
        else state = 1;


        this.bureauService.changementStateBureau(this.bureau, state).subscribe({
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
    this.titleModal = this.__('bureau.title_add_modal');
     this.initForm();
    this.actualisationSelectDirection();
    this.actualisationSelectTypeBureau();
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg', backdrop: "static"
    });
  }

  async actualisationSelectDirection() {
    this.directions = await this.authService.getSelectList(environment.liste_direction_regional_active, ['libelle']);
    this.filteredDirectionGenerals = this.directions;

    this.searchControl.valueChanges.subscribe(value => {
      const lower = value?.toLowerCase() || '';
      this.filteredDirectionGenerals = this.directions.filter(direction =>
        direction.libelle.toLowerCase().includes(lower)
      );
    });

  }

  async recupererIdDirection(idRegion = null) {

    let whereId = "";
    if (idRegion != null) whereId = "?where=region.id|e|" + idRegion;

    const resRegion = await this.authService.getSelectList(environment.liste_region_active + whereId, ['libelle']);

    this.bureau.direction_id = resRegion[0].dr_id;
    console.log(this.bureau.direction_id)

    this.bureauForm.patchValue({ direction_id: this.bureau.direction_id, });


    this.actualisationSelectRegion(this.bureau.direction_id);
  }

  async actualisationSelectTypeBureau() {
    this.type_bureaux = await this.authService.getSelectList(environment.liste_type_bureau_active, ['name']);
    this.filteredTypeBureau = this.type_bureaux;

    this.searchControl.valueChanges.subscribe(value => {
      const lower = value?.toLowerCase() || '';
      this.filteredTypeBureau = this.type_bureaux.filter(type =>
        type.name.toLowerCase().includes(lower)
      );
    });

  }

  recupererRegion(event: MatSelectChange) {
    const idDirection = event.value;
    console.log("direction?", idDirection)
    this.actualisationSelectRegion(idDirection);

  }

  async actualisationSelectRegion(idDirection = null) {
    let endpointRegion = "";

    if (idDirection != null) endpointRegion = environment.liste_region_active + "?where=region.dr_id|e|" + idDirection;
    else endpointRegion = environment.liste_region_active;


    this.regions = await this.authService.getSelectList(endpointRegion, ['name']);
    this.filteredRegion = this.regions;

    this.searchControl.valueChanges.subscribe(value => {
      const lower = value?.toLowerCase() || '';
      this.filteredRegion = this.regions.filter(region =>
        region.lib_region.toLowerCase().includes(lower)
      );
    });

  }

  recupererDepartement(event: MatSelectChange) {
    const idRegion = event.value;
    this.actualisationSelectDepartement(idRegion);

  }
  async actualisationSelectDepartement(idRegion = null) {
    let endpointDepartement = "";

    if (idRegion != null) endpointDepartement = environment.liste_departement_region_active + "?where=departement.region_id|e|" + idRegion;
    else endpointDepartement = environment.liste_departement_region_active;


    this.departements = await this.authService.getSelectList(endpointDepartement, ['name']);
    this.filteredDepartement = this.departements;

    this.searchControl.valueChanges.subscribe(value => {
      const lower = value?.toLowerCase() || '';
      this.filteredDepartement = this.departements.filter(depart =>
        depart.name.toLowerCase().includes(lower)
      );
    });

  }


  // Actualisation des données
  actualisationTableau() {
    this.passageService.appelURL('');
  }

  // Récuperation des données
  recupererDonnee() {

    // Récupérer la liste affichée dans le tableau depuis le localStorage.
    const storedData = localStorage.getItem('data');
    let result: any;
    if (storedData) result = JSON.parse(storedData);
    this.listbureaux = result.data;


    // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
    const res = this.listbureaux.filter(_ => _.rowid == this.idbureau);
    if (res.length != 0) {
      this.bureau = res[0];



      console.log("bureaux", this.bureau)
      this.bureauForm.patchValue({
        name: this.bureau.name,
        responsable: this.bureau.responsable,
        code: this.bureau.code,
        email: this.bureau.email,
        adresse: this.bureau.adresse,
        tel: this.bureau.tel,
        idtype_agence: this.bureau.idtype_agence,
        telephone_dr: this.bureau.telephone_dr,
        email_dr: this.bureau.email_dr,
        region_id: this.bureau.region_id,
        direction_id: this.bureau.direction_id,
        departement_id: this.bureau.departement_id,


      });
      console.log("bureaux", this.bureauForm)

    }
  }

  // Fermeture du modal
  closeModal() {
    this.modalRef?.hide();
  }



  //** Telephone  */
  telInputObject(m: any) { this.objetPhone = m.s }

  onCountryChange(event: any) { this.dialCode = event.dialCode; }

  hasError: boolean = false;
  onError(obj: any) { this.hasError = obj; }

  getNumber(obj: any) { this.telephone = obj; }
  //** ----  */

  //** Telephone Dr */
  telInputObjectDr(m: any) { this.objetPhoneDr = m.s }

  onCountryChangeDr(event: any) {
    this.dialCodeDr = event.dialCode;
  }
  getNumberDr(obj: any) { this.telephone = obj; }

  hasErrorDr: boolean = false;
  onErrorDr(obj: any) { this.hasErrorDr = obj; }
  //** ----  */

}
