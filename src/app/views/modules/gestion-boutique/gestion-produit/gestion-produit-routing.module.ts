import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FamilleComponent } from './famille/famille.component';
import { CategorieComponent } from './categorie/categorie.component';

const routes: Routes = [
  { path: 'familles', component: FamilleComponent, data: { breadcrumb: 'famille.title_breadcrumb' } },
  //{ path: 'categories', component: CategorieComponent, data: { breadcrumb: 'categorie.title_breadcrumb' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionProduitRoutingModule { }
