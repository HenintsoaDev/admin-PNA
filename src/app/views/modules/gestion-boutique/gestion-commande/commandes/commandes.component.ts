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
import { DatePipe } from '@angular/common';

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
      'type': 'text',
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
      'type': 'statut',
    },


    { 'name': 'id' }
  ]

  listIcon = [

    {
      'icon': 'info',
      'action': 'detail',
      'tooltip': this.__('global.tooltip_detail'),
      'autority': 'GSC_2',

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

  products = [
    {
      code: 'P001',
      name: 'Laptop',
      quantity: 2,
      price: 1200
    },
    {
      code: 'P002',
      name: 'Mouse',
      quantity: 5,
      price: 25
    }
  ];


  steps = [
    { icon : "view_in_ar", label: 'PREPARATION' },
    { icon : "send", label: 'EXPEDIEE' },
    { icon : "arrow_right_alt", label: 'EN_TRANSIT' },
    { icon : "local_shipping", label: 'LIVREE' },
    { icon : "check",label: 'RECEPTIONNEE' }
  ];
  indexStatutCurrent: number;

  constructor(
    private toastr: ToastrService,
    private passageService: PassageService,
    private modalService: BsModalService,
    private authService: AuthService,
    private commandeService: CommandeService,
    private datePipe: DatePipe, 

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
    this.isDisabled = false;
    if (this.detailcommande) {
      //this.recupererDonnee();
      this.commande = await this.authService.getSelectList(environment.commande + '/' + this.idcommande, ['titre']);

      this.indexStatutCurrent = this.steps.findIndex(
        step => step.label === this.commande.statut
      );

      // Ouverture de modal
      this.modalRef = this.modalService.show(this.detailcommande, {
        class: 'modal-xl', backdrop: "static"
      });
    }

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

    let text = this.__("global.valider_commande_?");
    let btn = this.__("global.oui_valider");
    if(type == "en_preparation"){
      text = this.__("global.preparer_commande_?");
      btn = this.__("global.oui_preparer");
    }
    if(type == "expediee"){
      text = this.__("global.expedier_commande_?");
      btn = this.__("global.oui_expedier");
    }
    if(type == "en_transit"){
      text = this.__("global.en_transit_commande_?");
      btn = this.__("global.oui_mettre_en_transition");
    }
    if(type == "livree"){
      text = this.__("global.livree_commande_?");
      btn = this.__("global.oui_livrer");
    }


    Swal.fire({
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

  getStatusLabel(statut: any): string {
    return statut ? this.__(`livraison.status.${statut}`) : (statut ?? '-');
  }

  getStepClass(index: number, label: string): string {
    if(label == this.commande.statut) return 'active'
    if (index < this.indexStatutCurrent) return 'done';
    return 'todo';
  }

  getStatusBadgeClass(statut: any): string {
    return statut ? `status-${statut}` : 'status-soumise';
  }


  async exportExcel() {
    const storedData = localStorage.getItem('data');
    let result: any;
    if (storedData) result = JSON.parse(storedData);

    const date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
    const date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');

    let title = this.__("commande.list_commande") + ' ';

    title += (date_debut != null ? " " + this.__("commande.from") + ' ' + date_debut + ' ' : '');       
    title += (date_fin != null ? " " + this.__("commande.to") + ' ' + date_fin + ' ' : '');  


    this.authService.exportExcel(this.print(result.data), title).then(
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

    const date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
    const date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');

    let title = this.__("commande.list_commande") + ' ';

    title += (date_debut != null ? " " + this.__("commande.from") + ' ' + date_debut + ' ' : '');       
    title += (date_fin != null ? " " + this.__("commande.to") + ' ' + date_fin + ' ' : '');  

    this.authService.exportPdf(this.print(result.data), title).then(
      (response: any) => { },
      (error: any) => { console.log(error) }
    );
  }

  print(commandes: any[]) {
    const tab = commandes.map((commande: any, index: number) => {
      const t: any = {};
      t[this.__('commande.date')] = commande.date_commande;
      t[this.__('commande.reference')] = commande.reference;
      t[this.__('commande.structure')] = commande.structure_sanitaire_name;
      t[this.__('commande.montant_total_ttc')] = commande.montant_total_ttc;
      t[this.__('commande.statut')] = this.__(`soumissions.status.${commande.statut}`) ;

      return t;
    });

    return tab;
  }


  getTotalMontant(): number {
    return this.commande.lignes_commande
      .reduce((total: number, ligne: any) => total + Number(ligne.montant), 0);
  }


}
