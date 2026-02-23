import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './views/login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { DataTablesModule } from "angular-datatables";
import { DatePipe, registerLocaleData } from '@angular/common';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { MatIconModule } from '@angular/material/icon';
import { ToastrModule } from 'ngx-toastr';
import { WelcomeModuleComponent } from './views/welcome-module/welcome-module.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import localeFr from '@angular/common/locales/fr';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';


registerLocaleData(localeFr);
@NgModule({  
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatAutocompleteModule,
    OverlayModule,
    MatMenuModule,
    MatDialogModule,
    MatNativeDateModule,
    NgxIntlTelInputModule,
    DataTablesModule,
    Ng2TelInputModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot() // configuration globale
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    WelcomeModuleComponent,
    PageNotFoundComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
