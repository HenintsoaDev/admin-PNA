import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FournisseursComponent } from './fournisseurs/fournisseurs.component';
import { AppelOffreComponent } from './appel-offre/appel-offre.component';
import { SoumissionsComponent } from './soumissions/soumissions.component';
import { LivraisonComponent } from './livraison/livraison.component';
import { FactureComponent } from './facture/facture.component';

const routes: Routes = [
  { path: 'fournisseurs', component: FournisseursComponent, data: { breadcrumb: 'fournisseur.title_breadcrumb' } }, 
  { path: 'appel-offres', component: AppelOffreComponent, data: { breadcrumb: 'appel_offres.title_breadcrumb' } },
  { path: 'soumissions', component: SoumissionsComponent, data: { breadcrumb: 'soumissions.title_breadcrumb' } },
  { path: 'soumissions/:id', component: SoumissionsComponent, data: { breadcrumb: 'soumissions.title_breadcrumb' } },
  { path: 'livraison_fournisseurs', component: LivraisonComponent, data: { breadcrumb: 'livraison.title_breadcrumb' } },
  { path: 'facture_fournisseurs', component: FactureComponent, data: { breadcrumb: 'facture.title_breadcrumb' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionFournisseurRoutingModule { }
