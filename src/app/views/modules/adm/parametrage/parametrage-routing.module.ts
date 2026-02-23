import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionComponent } from './action/action.component';
import { HeaderMessageComponent } from './header-message/header-message.component';
import { ModuleComponent } from './module/module.component';
import { ProfilsComponent } from './profils/profils.component';
import { ServiceComponent } from './service/service.component';
import { SousModuleComponent } from './sous-module/sous-module.component';
import { TypeBureauxComponent } from './type-bureaux/type-bureaux.component';
import { TypeProfilComponent } from './type-profil/type-profil.component';
import { UtilisateurApiNumheritComponent } from './utilisateur-api-numherit/utilisateur-api-numherit.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { DirectionRegionalComponent } from './direction-regional/direction-regional.component';
import { TypeCarteComponent } from './type-carte/type-carte.component';
import { DepartementComponent } from './departement/departement.component';
import { RegionComponent } from './region/region.component';
import { MotifsComponent } from './motifs/motifs.component';

const routes: Routes = [
  { path: 'module', component: ModuleComponent, data: { breadcrumb: 'module.title_breadcrumb' } },
  { path: 'sousmodule', component: SousModuleComponent, data: { breadcrumb: 'sous_module.title_breadcrumb' } },
  { path: 'profil', component: ProfilsComponent, data: { breadcrumb: 'profil.title_breadcrumb' } },
  { path: 'type_bureau', component: TypeBureauxComponent, data: { breadcrumb: 'type_bureau.title_breadcrumb' } },
  { path: 'type_profil', component: TypeProfilComponent, data: { breadcrumb: 'type_profil.title_breadcrumb' } },
  { path: 'user', component: UtilisateurComponent, data: { breadcrumb: 'utilisateur.title_breadcrumb' } },
  { path: 'action', component: ActionComponent, data: { breadcrumb: 'action.title_breadcrumb' } },
  { path: 'service', component: ServiceComponent, data: { breadcrumb: 'service.title_breadcrumb' } },
  { path: 'header_message', component: HeaderMessageComponent, data: { breadcrumb: 'header_message.title_breadcrumb' } },
  { path: 'user_api_numherit', component: UtilisateurApiNumheritComponent, data: { breadcrumb: 'utilisateur.title_breadcrumb_api_numherit' } },
  { path: 'dr', component: DirectionRegionalComponent, data: { breadcrumb: 'dr.title_breadcrumb_api_numherit' } },
  { path: 'type_carte', component: TypeCarteComponent, data: { breadcrumb: 'type_carte.title_breadcrumb' } },
  { path: 'departement', component: DepartementComponent, data: { breadcrumb: 'departement.title_breadcrumb' } },
  { path: 'region', component: RegionComponent, data: { breadcrumb: 'region.title_breadcrumb' } },
  { path: 'motif', component: MotifsComponent, data: { breadcrumb: 'motif.title_breadcrumb' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrageRoutingModule { }
