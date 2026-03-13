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

@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.scss']
})
export class CommandesComponent extends Translatable implements OnInit {

  /***************************************** */
  dateDebut: string = moment().startOf('month').format('YYYY-MM-DD');;
  dateFin: string = moment().endOf('month').format('YYYY-MM-DD');
  endpoint = "";
  header = [


    {
      "nomColonne": this.__('commande.date'),
      "colonneTable": "date_commande",
      "table": "commande_client"
    },

    {
      "nomColonne": this.__('commande.reference'),
      "colonneTable": "reference",
      "table": "commande_client"
    },

    {
      "nomColonne": this.__('commande.structure'),
      "colonneTable": "nom",
      "table": "structure_sanitaire"
    },


    {
      "nomColonne": this.__('commande.montant_total_ttc'),
      "colonneTable": "montant_total_ttc",
      "table": "commande_client"
    },

    {
      "nomColonne": this.__('commande.statut'),
      "colonneTable": "statut",
      "table": "commande_client"
    },


    {
      "nomColonne": this.__('global.action')
    }



  ]

  objetBody = [
    {
      'name': 'date_commande',
      'type': 'date',
    },
    {
      'name': 'reference',
      'type': 'text',
    },


    {
      'name': 'structure_sanitaire_name',
      'type': 'text',
    },
    {
      'name': 'montant_total_ttc',
      'type': 'montant',
    },


    {
      'name': 'statut',
      'type': 'text',
    },


    { 'name': 'id' }
  ]

  listIcon = [

    {
      'icon': 'info',
      'action': 'detail',
      'tooltip': this.__('global.tooltip_detail'),
      'autority': 'GSC_1',

    },


  ]
  searchGlobal = ['commande_client.date_commande', 'structure_sanitaire.nom','commande_client.reference']

  /***************************************** */

  formatNumber: any = formatNumber;

  subscription: Subscription;

  @ViewChild('detailcommande') detailcommande: TemplateRef<any> | undefined;
  idcommande: number;
  titleModal: string = "";
  modalRef?: BsModalRef;
  listAttestations: any;
  commande: any;
  isDisabled: boolean = false;

  index: any = 0;
  etatSelect: number = 0;

  constructor(
    private toastr: ToastrService,
    private passageService: PassageService,
    private modalService: BsModalService,
    private authService: AuthService,
    private commandeService: CommandeService

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

        if (event.data.action == 'detail') this.openModalcommande();

        // Nettoyage immédiat de l'event

      }


    });
    this.endpoint = environment.baseUrl + '/' + environment.commande;
    /***************************************** */

    this.filtreTableau();
  }







  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
      filtreDate = "&where=commande_client.date_commande|se|" + date_debut + ",commande_client.date_commande|ie|" + date_fin;
    }
    console.log(filtreDate);
    console.log(this.endpoint);
    this.passageService.appelURL(filtreDate, this.endpoint);
  }

 

  // Detail d'un modal
  async openModalcommande() {


    this.titleModal = this.__('global.tooltip_detail');

    if (this.detailcommande) {
      //this.recupererDonnee();
      this.commande = await this.authService.getSelectList(environment.commande + '/' + this.idcommande, ['titre']);

      // Ouverture de modal
      this.modalRef = this.modalService.show(this.detailcommande, {
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
    this.listAttestations = result.data;


    // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
    const res = this.listAttestations.filter(_ => _.id == this.idcommande);
    if (res.length != 0) {
      this.commande = res[0];

    }
  }

  // Fermeture du modal
  closeModal() {
    this.modalRef?.hide();
  }


  //Rejet virement
  valider(type) {
    Swal.fire({
      title: this.__("global.confirmation"),
      text: this.__("global.valider_commande_?"),
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
        this.commandeService.validerCommande(this.idcommande, type).subscribe({
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

    this.authService.exportExcel(this.print(result.data), this.__("commande.list_commande")).then(
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


    this.authService.exportPdf(this.print(result.data), this.__("commande.list_commande")).then(
      (response: any) => { },
      (error: any) => { console.log(error) }
    );
  }

  print(commandes: any[]) {
    const tab = commandes.map((commande: any, index: number) => {
      const t: any = {};
      t[this.__('commande.date')] = commande.date;
      t[this.__('commande.numcompte_expediteur')] = commande.numcompte_expediteur;
      t[this.__('commande.nom_expediteur')] = commande.nom_expediteur;
      t[this.__('commande.prenom_expediteur')] = commande.prenom_expediteur;
      t[this.__('commande.motif')] = commande.motif;
      t[this.__('commande.montant')] = commande.montant;
      t[this.__('commande.type_virement')] = commande.type_virement;
      t[this.__('commande.state')] = commande.state_name;

      return t;
    });

    return tab;
  }


}
