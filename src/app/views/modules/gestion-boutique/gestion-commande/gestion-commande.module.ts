import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionCommandeRoutingModule } from './gestion-commande-routing.module';
import { CommandesComponent } from './commandes/commandes.component';
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
import { CommandeAchatComponent } from './commande-achat/commande-achat.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    CommandesComponent,
    CommandeAchatComponent
  ],
  imports: [
    CommonModule,
    GestionCommandeRoutingModule,
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
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot() 
  ]
})
export class GestionCommandeModule { }
