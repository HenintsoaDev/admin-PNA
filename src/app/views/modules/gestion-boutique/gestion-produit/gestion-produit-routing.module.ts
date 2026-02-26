import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FamilleComponent } from './famille/famille.component';
import { CategorieComponent } from './categorie/categorie.component';
import { SousCategorieComponent } from './sous-categorie/sous-categorie.component';
import { FormesComponent } from './formes/formes.component';
import { ProduitsComponent } from './produits/produits.component';

const routes: Routes = [
  { path: 'familles', component: FamilleComponent, data: { breadcrumb: 'famille.title_breadcrumb' } },
  { path: 'categories', component: CategorieComponent, data: { breadcrumb: 'categorie.title_breadcrumb' } },
  { path: 'sous_categories', component: SousCategorieComponent, data: { breadcrumb: 'sous_categorie.title_breadcrumb' } },
  { path: 'formes', component: FormesComponent, data: { breadcrumb: 'forme.title_breadcrumb' } },
  { path: 'produits', component: ProduitsComponent, data: { breadcrumb: 'produit.title_breadcrumb' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionProduitRoutingModule { }
