import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionComponent } from './action/action.component';
import { ModuleComponent } from './module/module.component';
import { ProfilsComponent } from './profils/profils.component';
import { SousModuleComponent } from './sous-module/sous-module.component';
import { TypeProfilComponent } from './type-profil/type-profil.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';


const routes: Routes = [
  { path: 'modules', component: ModuleComponent, data: { breadcrumb: 'module.title_breadcrumb' } },
  { path: 'sous_modules', component: SousModuleComponent, data: { breadcrumb: 'sous_module.title_breadcrumb' } },
  { path: 'profil', component: ProfilsComponent, data: { breadcrumb: 'profil.title_breadcrumb' } },
  { path: 'type_profil', component: TypeProfilComponent, data: { breadcrumb: 'type_profil.title_breadcrumb' } },
  { path: 'user', component: UtilisateurComponent, data: { breadcrumb: 'utilisateur.title_breadcrumb' } },
  { path: 'actions', component: ActionComponent, data: { breadcrumb: 'action.title_breadcrumb' } },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrageRoutingModule { }
