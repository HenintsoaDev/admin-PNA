import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandesComponent } from './commandes/commandes.component';

const routes: Routes = [
  { path: 'commandes', component: CommandesComponent, data: { breadcrumb: 'commande.title_breadcrumb' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionCommandeRoutingModule { }
