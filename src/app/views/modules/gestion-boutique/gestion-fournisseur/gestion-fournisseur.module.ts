import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionFournisseurRoutingModule } from './gestion-fournisseur-routing.module';
import { FournisseursComponent } from './fournisseurs/fournisseurs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ToastrModule } from 'ngx-toastr';
import { ParametrageRoutingModule } from '../../adm/parametrage/parametrage-routing.module';
import { AppelOffreComponent } from './appel-offre/appel-offre.component';
import { SoumissionsComponent } from './soumissions/soumissions.component';
import { QuillModule } from 'ngx-quill';
import { AppelOffreDetailComponent } from './appel-offre-detail/appel-offre-detail.component';


@NgModule({
  declarations: [
    FournisseursComponent,
    AppelOffreComponent,
    SoumissionsComponent,
    AppelOffreDetailComponent
  ],
  imports: [
    CommonModule,
    GestionFournisseurRoutingModule,   
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
    QuillModule,
    ToastrModule.forRoot()  ]
})
export class GestionFournisseurModule { }
