import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { TypeStructureComponent } from './type-structure/type-structure.component';

const routes: Routes = [
  { path: 'utilisateurs', component: UtilisateurComponent, data: { breadcrumb: 'utilisateur.title_breadcrumb' } },
  { path: 'type_structures', component: TypeStructureComponent, data: { breadcrumb: 'type_structure.title_breadcrumb' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionComptesRoutingModule { }
