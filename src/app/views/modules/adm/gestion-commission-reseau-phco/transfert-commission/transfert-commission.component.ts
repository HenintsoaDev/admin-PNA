import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-transfert-commission',
  templateUrl: './transfert-commission.component.html',
  styleUrls: ['./transfert-commission.component.scss']
})
export class TransfertCommissionComponent extends Translatable implements OnInit {

  listServiceActive = [];
  searchControlService = new FormControl('');
  serviceId: number = -1;
  serviceLabel: string = "";
  filteredService = [];

  loadingData = false;
  typeCompte: string;
  mois_name: any;
  mois_code: any;
  typeCommission: any;
  commission: any = [];
  moisFr = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  title: any;

  constructor() { 
    super();
  }

  async ngOnInit() {


    
    const d = new Date(); d.setMonth(d.getMonth() - 1);
    
    this.mois_code = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    this.mois_name = `${this.moisFr[d.getMonth()]} ${d.getFullYear()}`;
    



  }

  valider() {
    const commissionMap = { 0: this.__('suivi_commission.hors_paiement_masse'), 1: this.__('suivi_commission.paiement_masse') };
    const compteMap = { 'W': this.__('global.wallet'), 'C': this.__('global.carte') };
    this.title = `${commissionMap[this.typeCommission] || ''} | ${compteMap[this.typeCompte] || ''}`;
  }

}
