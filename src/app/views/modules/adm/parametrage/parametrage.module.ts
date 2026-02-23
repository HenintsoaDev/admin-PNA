import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrageRoutingModule } from './parametrage-routing.module';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { ModuleComponent } from './module/module.component';
import { ProfilsComponent } from './profils/profils.component';
import { SousModuleComponent } from './sous-module/sous-module.component';
import { TypeBureauxComponent } from './type-bureaux/type-bureaux.component';
import { TypeProfilComponent } from './type-profil/type-profil.component';
import { ActionComponent } from './action/action.component';
import { ServiceComponent } from './service/service.component';
import { HeaderMessageComponent } from './header-message/header-message.component';
import { UtilisateurApiNumheritComponent } from './utilisateur-api-numherit/utilisateur-api-numherit.component';
import { SharedModule } from 'app/shared/shared.module';
import { DirectionRegionalComponent } from './direction-regional/direction-regional.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { MatRadioModule } from '@angular/material/radio';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { TypeCarteComponent } from './type-carte/type-carte.component';
import { DepartementComponent } from './departement/departement.component';
import { RegionComponent } from './region/region.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MotifsComponent } from './motifs/motifs.component';


@NgModule({
  declarations: [
    UtilisateurComponent,
    ModuleComponent,
    SousModuleComponent,
    ProfilsComponent,
    TypeBureauxComponent,
    TypeProfilComponent,
    ServiceComponent,
    ActionComponent,
    UtilisateurApiNumheritComponent,
    HeaderMessageComponent,
    DirectionRegionalComponent,
    TypeCarteComponent,
    DepartementComponent,
    RegionComponent,
    MotifsComponent
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
    ParametrageRoutingModule,
    Ng2TelInputModule,
    MatRadioModule,
    MatExpansionModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot()
  ]
})
export class ParametrageModule { }
