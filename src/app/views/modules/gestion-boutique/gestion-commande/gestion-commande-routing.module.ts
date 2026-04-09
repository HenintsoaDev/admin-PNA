import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandesComponent } from './commandes/commandes.component';
import { CommandeAchatComponent } from './commande-achat/commande-achat.component';

const routes: Routes = [
  { path: 'commandes', component: CommandesComponent, data: { breadcrumb: 'commande.title_breadcrumb' } },
  { path: 'commande_achats', component: CommandeAchatComponent, data: { breadcrumb: 'commande.title_breadcrumb_commande_achat' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionCommandeRoutingModule { }
