import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { ProfilsComponent } from './profils/profils.component';

const routes: Routes = [
  { path: 'utilisateurs', component: UtilisateurComponent, data: { breadcrumb: 'utilisateur.title_breadcrumb' } },
  { path: 'profils', component: ProfilsComponent, data: { breadcrumb: 'profil.title_breadcrumb' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionComptesRoutingModule { }
