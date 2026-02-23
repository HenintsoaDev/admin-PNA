import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoriqueVirementsComponent } from './historique-virements/historique-virements.component';
import { SuiviCompteCommissionComponent } from './suivi-compte-commission/suivi-compte-commission.component';
import { SuiviComptePrincipalComponent } from './suivi-compte-principal/suivi-compte-principal.component';

const routes: Routes = [
  { path: 'suivi_compte', component: SuiviComptePrincipalComponent, data: { breadcrumb: 'suivi_compte.title' } },
  { path: 'virement', component: HistoriqueVirementsComponent, data: { breadcrumb: 'virement.title' } },
  { path: 'suivi_compte_commission', component: SuiviCompteCommissionComponent, data: { breadcrumb: 'suivi_commission.title' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionComptePrincipalRoutingModule { }
