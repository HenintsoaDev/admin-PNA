import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionBureauRoutingModule } from './gestion-bureau-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { BureauComponent } from './bureau/bureau.component';
import { DemandeCreditComponent } from './demande-credit/demande-credit.component';
import { ReleveSoldeBureauComponent } from './releve-solde-bureau/releve-solde-bureau.component';
import { SoldeBureauComponent } from './solde-bureau/solde-bureau.component';
import { DemandeRapatriementComponent } from './demande-rapatriement/demande-rapatriement.component';
import { SoldeDistributeurComponent } from './solde-distributeur/solde-distributeur.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    BureauComponent,
    DemandeCreditComponent,
    ReleveSoldeBureauComponent,
    SoldeBureauComponent,
    DemandeRapatriementComponent,
    SoldeDistributeurComponent
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatTabsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    SharedModule,
    GestionBureauRoutingModule,
    Ng2TelInputModule,
    MatRadioModule
  ]
})
export class GestionBureauModule { }
