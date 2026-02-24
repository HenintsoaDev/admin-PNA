import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FamilleComponent } from './famille/famille.component';

const routes: Routes = [
  { path: 'familles', component: FamilleComponent, data: { breadcrumb: 'famille.title_breadcrumb' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionProduitRoutingModule { }
