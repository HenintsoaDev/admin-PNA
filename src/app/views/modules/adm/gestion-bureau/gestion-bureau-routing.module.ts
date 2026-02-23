import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BureauComponent } from './bureau/bureau.component';
import { DemandeCreditComponent } from './demande-credit/demande-credit.component';
import { DemandeRapatriementComponent } from './demande-rapatriement/demande-rapatriement.component';
import { ReleveSoldeBureauComponent } from './releve-solde-bureau/releve-solde-bureau.component';
import { SoldeBureauComponent } from './solde-bureau/solde-bureau.component';
import { SoldeDistributeurComponent } from './solde-distributeur/solde-distributeur.component';

const routes: Routes = [
    { path: 'bureaux', component: BureauComponent, data: { breadcrumb: 'bureau.lister_bureau' } },
        { path: 'demande_credit', component: DemandeCreditComponent, data: { breadcrumb: 'demande_credit.historique_rechargement_bureau' } },
        { path: 'releve_solde_bureau', component: ReleveSoldeBureauComponent, data: { breadcrumb: 'releve_solde_bureau.title' } },
        { path: 'solde_bureau', component: SoldeBureauComponent, data: { breadcrumb: 'solde_bureau.title' } },
        { path: 'demande_rapatriement', component: DemandeRapatriementComponent, data: { breadcrumb: 'demande_rapatriement.title' } },
        { path: 'solde_des_distributeur', component: SoldeDistributeurComponent, data: { breadcrumb: 'solde_distributeur.title' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionBureauRoutingModule { }
