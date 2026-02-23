import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionComptePrincipalRoutingModule } from './gestion-compte-principal-routing.module';
import { SuiviComptePrincipalComponent } from './suivi-compte-principal/suivi-compte-principal.component';
import { HistoriqueVirementsComponent } from './historique-virements/historique-virements.component';
import { SuiviCompteCommissionComponent } from './suivi-compte-commission/suivi-compte-commission.component';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    SuiviComptePrincipalComponent,
    HistoriqueVirementsComponent,
    SuiviCompteCommissionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    GestionComptePrincipalRoutingModule
  ]
})
export class GestionComptePrincipalModule { }
