import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandesComponent } from './commandes/commandes.component';
import { CommandeAchatComponent } from './commande-achat/commande-achat.component';
import { LivraisonClientComponent } from './livraison-client/livraison-client.component';
import { FactureClientComponent } from './facture-client/facture-client.component';

const routes: Routes = [
  { path: 'commandes', component: CommandesComponent, data: { breadcrumb: 'commande.title_breadcrumb' } },
  { path: 'commande_achats', component: CommandeAchatComponent, data: { breadcrumb: 'commande.title_breadcrumb_commande_achat' } },
  { path: 'livraison_client', component: LivraisonClientComponent, data: { breadcrumb: 'livraison.title_breadcrumb_client' } },
  { path: 'facture_clients', component: FactureClientComponent, data: { breadcrumb: 'facture.title_breadcrumb_client' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionCommandeRoutingModule { }
