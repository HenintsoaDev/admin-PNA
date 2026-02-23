import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MAT_DATE_LOCALE, MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MAT_SELECT_SCROLL_STRATEGY_PROVIDER, MatSelectModule} from '@angular/material/select';
import {MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER, MatAutocompleteModule} from '@angular/material/autocomplete';
import { OverlayModule } from '@angular/cdk/overlay';
import {MatDialogModule} from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { HomeComponent } from 'app/views/home/home.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import {NgxMatIntlTelInputComponent} from 'ngx-mat-intl-tel-input';
import { HttpClientModule } from '@angular/common/http';
import { ProfilComponent } from 'app/views/profil/profil.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatAutocompleteModule,
    OverlayModule,
    MatMenuModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxIntlTelInputModule,
    BrowserAnimationsModule,
    NgxMatIntlTelInputComponent,
    HttpClientModule,
    Ng2TelInputModule
  ],
  declarations: [
    HomeComponent,
    ProfilComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
  MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, 
],
})

export class AdminLayoutModule {}
