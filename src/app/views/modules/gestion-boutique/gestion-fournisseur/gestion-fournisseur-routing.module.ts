import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FournisseursComponent } from './fournisseurs/fournisseurs.component';

const routes: Routes = [
  { path: 'fournisseurs', component: FournisseursComponent, data: { breadcrumb: 'fournisseur.title_breadcrumb' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionFournisseurRoutingModule { }
