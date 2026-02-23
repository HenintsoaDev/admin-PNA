import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AchatCommissionComponent } from './achat-commission/achat-commission.component';
import { PartenaireFinancierComponent } from './partenaire-financier/partenaire-financier.component';
import { TransfertCommissionComponent } from './transfert-commission/transfert-commission.component';

const routes: Routes = [
  { path: 'partenaire_financier', component: PartenaireFinancierComponent, data: { breadcrumb: 'partenaire.title' } },
  { path: 'transferer_commission', component: TransfertCommissionComponent, data: { breadcrumb: 'transfert_commission.title' } },
  { path: 'achat_commission', component: AchatCommissionComponent, data: { breadcrumb: 'achat_commission.title' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionCommissionReseauPhcoRoutingModule { }
