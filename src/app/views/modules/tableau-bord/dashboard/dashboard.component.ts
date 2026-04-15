import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { Translatable } from 'shared/constants/Translatable';
import 'moment/locale/fr';
import { AuthService } from 'app/services/auth.service';
import { environment } from 'environments/environment';
import formatNumber from 'number-handler'
import { Auth } from 'app/shared/models/db';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends Translatable implements OnInit {
  formatNumber: any = formatNumber;

  displayed = ['ref','structure','montant','status'];
  stats = [
    {icon:'inventory_2', value:'nombre_produits_actifs', label:'produit_actif', color:'green'},
    {icon:'shopping_cart', value:'nombre_commande_client_du_mois', label:'commande_mois', color:'yellow'},
    {icon:'apartment', value:'nombre_fournisseurs_actifs', label:'fournisseur_actif', color:'blue'},
    {icon:'local_shipping', value:'nombre_livraison_en_cours', label:'livraison_encours', color:'blue'},
    {icon:'receipt_long', value:'nombre_facture_en_attente', label:'facture_en_attente', color:'yellow'},
    {icon:'groups', value:'nombre_structure_sanitaires', label:'structure', color:'green'}
  ];

  alerts = [
    {name:'Amoxicilline 500mg', level:'Critique', progress:20, qty:'120 unités / seuil 500'},
    {name:'Insuline NPH', level:'Bas', progress:55, qty:'330 unités / seuil 800'},
    {name:'Paracétamol 500mg', level:'Bas', progress:70, qty:'1 500 unités / seuil 2 000'}
  ];
  legends = [];
  barData = {};
  doughnutData = {}
  barOptions = { responsive:true, maintainAspectRatio:false };

  dateJ: string = moment().startOf('month').format('dddd DD MMMM YYYY');
  annee: string = moment().startOf('month').format('YYYY');
  dashboard: any = [];
  public user: Auth = new Auth();
  
  constructor(    
      private authService: AuthService,
      private router: Router, 
    ) {
    super();
   }

  async ngOnInit(){
    this.user = <Auth>await this.authService.getLoginUser();

    this.recupererDashboard();
  }


  async recupererDashboard(){

          this.dashboard = await this.authService.getSelectList(environment.dashboard , ['titre']);

          console.log(this.dashboard);

          const apiDataBar = this.dashboard.stats_commande_client_par_mois;

          this.barData = {
            labels: apiDataBar.map(item => item.mois),
            datasets: [
              {
                data: apiDataBar.map(item => Number(item.commandes)),
                label: 'Commandes',
                backgroundColor: '#4CAF50',
              },
              {
                data: apiDataBar.map(item => Number(item.livrees)),
                label: 'Livrées',
                backgroundColor: '#B1DAC1',
              }
            ]
          };


          const apiDataDoughnut = this.dashboard.data_par_statut;

          this.doughnutData = {
            labels: apiDataDoughnut.map(i => this.getStatusLabel(i.statut)),
            datasets: [
              {
                data: apiDataDoughnut.map(i => Number(i.nombre)),
                backgroundColor: apiDataDoughnut.map((_, index) => this.getColor(index)),
                borderWidth: 1
              }
            ]
          };

          const legendDoughnut = this.dashboard?.data_par_statut || [];

          this.legends = legendDoughnut.map((i, index) => ({
            label:  this.getStatusLabel(i.statut),
            value: i.pourcentage,
            color: this.getColor(index)
          }));


  }

  getColor(index: number): string {
    const colors = [
      '#6c757d', //Brouillon
      '#f0ad4e', //En attente de validation
      '#5cb85c', //Validée
      '#0B7238', //En preparation
      '#5cb85c', // Colisage
      '#B41D01', //Expedié
      '#000000', //En transit
      '#44BEDF', //Livrée
      '#0B57D0', //Réceptionné
      '#B41D01' //Annulée
    ];
  
    return colors[index % colors.length];
  }

  getCommandeAchatStatusLabel(statut: any): string {
    return statut ? this.__(`facture.status.${statut}`) : (statut ?? '-');
  }

  getStatusLabel(statut: any): string {
    return statut ? this.__(`global.${statut}`) : (statut ?? '-');
  }

  getCommandeAchatStatusBadgeClass(statut: any): string {
    return statut ? `status-${statut}` : '';
  }

  getLabel(label: any): string {
    return label ? this.__(`dashboard.${label}`) : (label ?? '-');
  }

  goToComande(){
    this.router.navigate(['/admin/gestion_commandes/commandes']);

  }





}
