import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionCommissionReseauPhcoRoutingModule } from './gestion-commission-reseau-phco-routing.module';
import { PartenaireFinancierComponent } from './partenaire-financier/partenaire-financier.component';
import { TransfertCommissionComponent } from './transfert-commission/transfert-commission.component';
import { AchatCommissionComponent } from './achat-commission/achat-commission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from 'app/shared/shared.module';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    PartenaireFinancierComponent,
    TransfertCommissionComponent,
    AchatCommissionComponent,
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
        Ng2TelInputModule,
        MatRadioModule,
        GestionCommissionReseauPhcoRoutingModule
  ]
})
export class GestionCommissionReseauPhcoModule { }
