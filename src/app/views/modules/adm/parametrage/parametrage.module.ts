import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrageRoutingModule } from './parametrage-routing.module';
import { UtilisateurComponent } from '../gestion-comptes/utilisateur/utilisateur.component';
import { ModuleComponent } from './module/module.component';
import { ProfilsComponent } from '../gestion-comptes/profils/profils.component';
import { SousModuleComponent } from './sous-module/sous-module.component';
import { TypeProfilComponent } from './type-profil/type-profil.component';
import { ActionComponent } from './action/action.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { RegionComponent } from './region/region.component';
import { DistrictSanitaireComponent } from './district-sanitaire/district-sanitaire.component';
import { TypeStructureComponent } from './type-structure/type-structure.component';
import { StructureSanitaireComponent } from './structure-sanitaire/structure-sanitaire.component';
import { EntrepotComponent } from './entrepot/entrepot.component';


@NgModule({
  declarations: [
    ModuleComponent,
    SousModuleComponent,
    TypeProfilComponent,
    ActionComponent,
    RegionComponent,
    TypeStructureComponent,
    DistrictSanitaireComponent,
    StructureSanitaireComponent,
    EntrepotComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    SharedModule,
    NgxIntlTelInputModule,
    ParametrageRoutingModule,
    MatRadioModule,
    MatExpansionModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot()
  ]
})
export class ParametrageModule { }
