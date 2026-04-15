import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionComponent } from './action/action.component';
import { ModuleComponent } from './module/module.component';
import { ProfilsComponent } from '../gestion-comptes/profils/profils.component';
import { SousModuleComponent } from './sous-module/sous-module.component';
import { UtilisateurComponent } from '../gestion-comptes/utilisateur/utilisateur.component';
import { RegionComponent } from './region/region.component';
import { TypeStructureComponent } from './type-structure/type-structure.component';
import { DistrictSanitaireComponent } from './district-sanitaire/district-sanitaire.component';
import { StructureSanitaireComponent } from './structure-sanitaire/structure-sanitaire.component';
import { EntrepotComponent } from './entrepot/entrepot.component';


const routes: Routes = [
  { path: 'modules', component: ModuleComponent, data: { breadcrumb: 'module.title_breadcrumb' } },
  { path: 'sous_modules', component: SousModuleComponent, data: { breadcrumb: 'sous_module.title_breadcrumb' } },
  { path: 'profil', component: ProfilsComponent, data: { breadcrumb: 'profil.title_breadcrumb' } },
  { path: 'actions', component: ActionComponent, data: { breadcrumb: 'action.title_breadcrumb' } },
  { path: 'regions', component: RegionComponent, data: { breadcrumb: 'region.title_breadcrumb' } },
  { path: 'type_structures', component: TypeStructureComponent, data: { breadcrumb: 'type_structure.title_breadcrumb' } },
  { path: 'district_sanitaires', component: DistrictSanitaireComponent, data: { breadcrumb: 'district.title_breadcrumb' } },
  { path: 'structure_sanitaires', component: StructureSanitaireComponent, data: { breadcrumb: 'structure.title_breadcrumb' } },
  { path: 'entrepots', component: EntrepotComponent, data: { breadcrumb: 'entrepot.title_breadcrumb' } },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrageRoutingModule { }
