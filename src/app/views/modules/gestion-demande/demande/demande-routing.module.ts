import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutreDemandeComponent } from './autre-demande/autre-demande.component';

const routes: Routes = [
  { path: 'autre_demande', component: AutreDemandeComponent, data: { breadcrumb: 'demande.title_autre_demande' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemandeRoutingModule { }
