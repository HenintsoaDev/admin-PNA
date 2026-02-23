import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import { GestionDemandeService } from 'app/services/gestion-demande/gestion-demande.service';
import moment from 'moment';

@Component({
  selector: 'app-autre-demande',
  templateUrl: './autre-demande.component.html',
  styleUrls: ['./autre-demande.component.scss']
})
export class AutreDemandeComponent extends Translatable implements OnInit {

  /***************************************** */
  endpoint = "";
  header = [


    {
      "nomColonne": this.__('demande.date_demande'),
      "colonneTable": "date_creation",
      "table": "autre_demande"
    },

    {
      "nomColonne": this.__('ouverture.nom'),
      "colonneTable": "nom",
      "table": "beneficiaire"
    },
    {
      "nomColonne": this.__('ouverture.prenom'),
      "colonneTable": "prenom",
      "table": "beneficiaire"
    },
    {
      "nomColonne": this.__('demande.telephone'),
      "colonneTable": "telephone",
      "table": "beneficiaire"
    },

    {
      "nomColonne": this.__('demande.email'),
      "colonneTable": "email",
      "table": "beneficiaire"
    },

   {
     "nomColonne": this.__('demande.num_compte'),
     "colonneTable": "num_compte",
     "table": "autre_demande"
   },
   {
    "nomColonne": this.__('demande.motif'),
    "colonneTable": "titre",
    "table": "motif"
  },
   {
     "nomColonne": this.__('demande.state'),
     "colonneTable": "state",
     "table": "autre_demande"
   },
    {
      "nomColonne": this.__('demande.num_compte'),
      "colonneTable": "num_compte",
      "table": "autre_demande"
    },
    {
      "nomColonne": this.__('demande.state'),
      "colonneTable": "state",
      "table": "autre_demande"
    },


    {
      "nomColonne": this.__('global.action')
    }



  ]

  objetBody = [
    {
      'name': 'date_creation',
      'type': 'date',
    },
    {
      'name': 'nom_beneficiaire',
      'type': 'text',
    },
    {
      'name': 'prenom_beneficiaire',
      'type': 'text',
    },

    {
      'name': 'telephone',
      'type': 'text',
    },
    {
      'name': 'email',
      'type': 'text',
    },

   {
     'name': 'numcompte',
     'type': 'text',
   },
   {
    'name': 'motif_titre',
    'type': 'text',
  },
   {
     'name': 'etat',
     'type': 'etat',
   },
    {
      'name': 'numcompte',
      'type': 'text',
    },
    {
      'name': 'etat',
      'type': 'etat',
    },


    { 'name': 'id' }
  ]

  listIcon = [

    {
      'icon': 'info',
      'action': 'detail',
      'tooltip': this.__('global.tooltip_detail'),
      'autority': 'PRM_40',

    },


  ]
  searchGlobal = ['autre_demande.date_creation', 'beneficiaire.nom', 'beneficiaire.prenom', 'beneficiaire.email', 'beneficiaire.telephone']

  /***************************************** */


  subscription: Subscription;

  @ViewChild('detailCompte') detailCompte: TemplateRef<any> | undefined;
  idAutre_demande: number;
  titleModal: string = "";
  modalRef?: BsModalRef;
  listAutredemandes: any;
  demande: any;
  isDisabled: boolean = false;
  documents: any = [];
  dateDebut: string = moment().startOf('month').format('YYYY-MM-DD');;
  dateFin: string = moment().endOf('month').format('YYYY-MM-DD');

  index: any = 0;
  etatSelect: number = 0;

  constructor(
    private toastr: ToastrService,
    private passageService: PassageService,
    private modalService: BsModalService,
    private authService: AuthService,
    private gestionDemandeService: GestionDemandeService

  ) {
    super();

  }





  async ngOnInit() {
    this.authService.initAutority("DEM", "GSD");

    this.titleModal = this.__('demande.title_add_modal');

    this.passageService.appelURL(null);

    /***************************************** */
    // Écouter les changements de modal à travers le service si il y a des actions
    this.subscription = this.passageService.getObservable().subscribe(event => {

      if (event.data) {
        this.idAutre_demande = event.data.id;

        if (event.data.action == 'detail') this.openModalDetailPreOuvertureCompte();

        // Nettoyage immédiat de l'event
        // this.passageService.clear();  // ==> à implémenter dans ton service

      }


    });
    this.endpoint = environment.baseUrl + '/' + environment.autre_demande;
    /***************************************** */
    this.filtreTableau(0);
  }

  onTabChanged(event: any): void {
    this.index = event.index;
    this.filtreTableau(this.index);
  }




  mettreAJourColonnes(etat: number) {


    this.header = [


      {
        "nomColonne": this.__('demande.date_demande'),
        "colonneTable": "date_creation",
        "table": "autre_demande"
      },
    
      {
        "nomColonne": this.__('ouverture.nom'),
        "colonneTable": "nom",
        "table": "beneficiaire"
      },


      ...(etat === 0 ? [{
        nomColonne: this.__('ouverture.prenom'),
        colonneTable: 'prenom',
        table: 'beneficiaire'
      }] : []),
      {
        "nomColonne": this.__('demande.telephone'),
        "colonneTable": "telephone",
        "table": "beneficiaire"
      },

      {
        "nomColonne": this.__('demande.email'),
        "colonneTable": "email",
        "table": "beneficiaire"
      },

     
      {
        "nomColonne": this.__('demande.num_compte'),
        "colonneTable": "num_compte",
        "table": "autre_demande"
      },
      {
        "nomColonne": this.__('demande.motif'),
        "colonneTable": "email",
        "table": "beneficiaire"
      },
 {
        "nomColonne": this.__('demande.state'),
        "colonneTable": "state",
        "table": "autre_demande"
      },


      {
        "nomColonne": this.__('global.action')
      }



    ]

    this.objetBody = [
      {
        'name': 'date_creation',
        'type': 'date',
      },
  
      {
        'name': 'nom_beneficiaire',
        'type': 'text',
      },

      ...(etat === 0 ? [{ name: 'prenom_beneficiaire', type: 'text' }] : []),

      {
        'name': 'telephone',
        'type': 'text',
      },
      {
        'name': 'email',
        'type': 'text',
      },

      {
        'name': 'numcompte',
        'type': 'text',
      },
      {
        'name': 'motif_titre',
        'type': 'text',
      },
      {
        'name': 'etat',
        'type': 'etat',
      },


      { 'name': 'id' }
    ]








  }






  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  // Detail d'un modal
  async openModalDetailPreOuvertureCompte() {


    this.titleModal = this.__('demande.title_detail_autre_demande');

    if (this.detailCompte) {


      this.recupererDonnee();



      // Ouverture de modal
      this.modalRef = this.modalService.show(this.detailCompte, {
        class: 'modal-xl', backdrop: "static"
      });
    }

  }




  // Récuperation des données
  recupererDonnee() {

    // Récupérer la liste affichée dans le tableau depuis le localStorage.
    const storedData = localStorage.getItem('data');
    let result: any;
    if (storedData) result = JSON.parse(storedData);
    this.listAutredemandes = result.data;


    // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
    const res = this.listAutredemandes.filter(_ => _.id == this.idAutre_demande);
    if (res.length != 0) {
      this.demande = res[0];

      this.documents = JSON.parse(this.demande.documents);
    }
   // this.filtreTableau(this.etatSelect);
  }

  filtreTableau(etat) {
    console.log("filterTableau");
    this.etatSelect = etat;
    if (etat == 0) {
      this.endpoint = environment.baseUrl + '/' + environment.autre_demande;
    } else if (etat == 1) {
      this.endpoint = environment.baseUrl + '/' + environment.autre_demande + '/societe';
    }
    
    this.mettreAJourColonnes(etat);

    console.log("filterDate");
    const date_debut = moment(this.dateDebut).format('yyyy-MM-DD');
    const date_fin = moment(this.dateFin).format('yyyy-MM-DD');

    let filtreDate = "";
    if (moment(new Date(date_debut)).isAfter(moment(new Date(date_fin)))) {
      this.toastr.warning(this.__('msg.dateDebut_dateFin_error'), this.__("msg.warning"));
      return;
    } else {
      filtreDate = "&where=autre_demande.date_creation|se|" + date_debut + "&autre_demande.date_creation|ie|" + date_fin;
    }
    console.log(filtreDate);
    console.log(this.endpoint);
    this.passageService.appelURL(filtreDate, this.endpoint);
  }

  filtreDate() {

    console.log("filterDate");
    const date_debut = moment(this.dateDebut).format('yyyy-MM-DD');
    const date_fin = moment(this.dateFin).format('yyyy-MM-DD');

    let filtreDate = "";
    if (moment(new Date(date_debut)).isAfter(moment(new Date(date_fin)))) {
      this.toastr.warning(this.__('msg.dateDebut_dateFin_error'), this.__("msg.warning"));
      return;
    } else {
      filtreDate = "&where=autre_demande.date_creation|se|" + date_debut + "&autre_demande.date_creation|ie|" + date_fin;
    }
    console.log(filtreDate);
    console.log(this.endpoint);
    this.passageService.appelURL(filtreDate, this.endpoint);
  }
  // Fermeture du modal
  closeModal() {
    this.modalRef?.hide();
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


  //Rejet virement
  traiterDemande(etat) {


    const messages = {
      1: {
        text: this.__("global.encours_traitement_?"),
        button: this.__("global.oui_mettre_encours")
      },
      2: {
        text: this.__("global.mettre_attente_?"),
        button: this.__("global.oui_mettre_attente")
      },
      3: {
        text: this.__("global.rejeter_demande_?"),
        button: this.__("global.oui_rejeter")
      },
      default: {
        text: this.__("global.traiter_autre_demande_?"),
        button: this.__("global.oui_traiter")
      }
    };

    const { text, button: text_button } = messages[etat] || messages.default;

    const swalOptions: any = {
      title: this.__("global.confirmation"),
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: text_button,
      cancelButtonText: this.__("global.cancel"),
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'swal-button--confirm-custom',
        cancelButton: 'swal-button--cancel-custom'
      }
    };

    if (etat === 2 || etat === 3) {
      swalOptions.input = 'text';
      swalOptions.inputPlaceholder = this.__("global.motif");
      swalOptions.inputValidator = (value: string) => {
        if (!value) {
          return this.__("global.champ_obligatoire");
        }
        return null;
      };
    }

    Swal.fire(swalOptions).then((result) => {
      if (result.isConfirmed) {

        const datamotif = result.value !== true ? { motif_traitement: result.value } : null;

        this.isDisabled = true;
        this.gestionDemandeService.traiterAutreDemande(this.idAutre_demande, etat, datamotif).subscribe({
          next: (res) => {
            if (res['code'] == 201) {
              this.isDisabled = false;
              this.toastr.success(res['msg'], this.__("global.success"));
              this.filtreTableau(this.etatSelect);
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

    this.authService.exportExcel(this.print(result.data), "Liste des autres demandes").then(
      (response: any) => {
        const a = document.createElement("a");
        a.href = response.data;
        a.download = `${this.__("demande.list_autre_demande")}.xlsx`;
        a.click();
      },
      (error: any) => { console.log(error) }
    );
  }

  async exportPdf() {
    const storedData = localStorage.getItem('data');
    let result: any;
    if (storedData) result = JSON.parse(storedData);


    this.authService.exportPdf(this.print(result.data), "Liste des autres demandes").then(
      (response: any) => { },
      (error: any) => { console.log(error) }
    );
  }

  print(demandes: any[]) {
    const tab = demandes.map((demande: any, index: number) => {
      const t: any = {};
      t[this.__('demande.date_demande')] = demande.date_creation;
      t[this.__('demande.reference')] = demande.reference;
      t[this.__('demande.nom')] = demande.nom_beneficiaire;
      t[this.__('demande.prenom')] = demande.prenom_beneficiaire;
      t[this.__('demande.telephone')] = demande.telephone;
      t[this.__('demande.email')] = demande.email;
      t[this.__('demande.num_compte')] = demande.numcompte;
      t[this.__('demande.motif')] = demande.motif_titre;
      t[this.__('demande.state')] = demande.etat_name;

      return t;
    });

    return tab;
  }


}
