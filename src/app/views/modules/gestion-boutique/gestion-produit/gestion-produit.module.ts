import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionProduitRoutingModule } from './gestion-produit-routing.module';
import { FamilleComponent } from './famille/famille.component';
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
import { CategorieComponent } from './categorie/categorie.component';
import { SousCategorieComponent } from './sous-categorie/sous-categorie.component';
import { FormesComponent } from './formes/formes.component';
import { ProduitsComponent } from './produits/produits.component';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  declarations: [
    FamilleComponent,
    CategorieComponent,
    SousCategorieComponent,
    FormesComponent,
    ProduitsComponent
  ],
  imports: [
    CommonModule,
    GestionProduitRoutingModule,
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
    ToastrModule.forRoot(),
    MatStepperModule
  ]
})
export class GestionProduitModule { }
