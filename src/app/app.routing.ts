import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { ProfilComponent } from './views/profil/profil.component';
import { WelcomeModuleComponent } from './views/welcome-module/welcome-module.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';

const routes: Routes =[
  
  { path: 'login', component: LoginComponent }, 
  { path: '',redirectTo: 'login',pathMatch: 'full'}, 
  { path: 'home', component: HomeComponent ,pathMatch: 'full'}, 
  { path: 'my-profil', component: ProfilComponent,data: { breadcrumb: 'profil.my_profile' } }, 
  { path: 'app-module/:module', component: WelcomeModuleComponent},

  
  //Module Administration : ADM
  //Module Administration : ADM
  {
    path: 'parametrage', data: { breadcrumb: 'module.title_module_breadcrumb' },
    loadChildren: () => import('./views/modules/adm/parametrage/parametrage.module').then(m => m.ParametrageModule)
  },
  {
    path: 'gestion_bureau', data: { breadcrumb: 'bureau.title' },
    loadChildren: () => import('./views/modules/adm/gestion-bureau/gestion-bureau.module').then(m => m.GestionBureauModule)
  },
  {
    path: 'gestion_compte_principal', data: { breadcrumb: 'virement.title_sous_module' },
    loadChildren: () => import('./views/modules/adm/gestion-compte-principal/gestion-compte-principal.module').then(m => m.GestionComptePrincipalModule)
  },
  {
    path: 'gestion_commission_reseau_phco', data: { breadcrumb: 'partenaire.title_sous_module' },
    loadChildren: () => import('./views/modules/adm/gestion-commission-reseau-phco/gestion-commission-reseau-phco.module').then(m => m.GestionCommissionReseauPhcoModule)
  },


  {
    path: 'ouverture', data: { breadcrumb: 'ouverture.title_breadcrumb' },
  },
  {
    path: 'demande', data: { breadcrumb: 'demande.title_breadcrumb' },
    loadChildren: () => import('./views/modules/gestion-demande/demande/demande.module').then(m => m.DemandeModule)
  },
  {
    path: 'ordres_virement', data: { breadcrumb: 'ordre_virement.title_breadcrumb' },
  },

  { path: '**', component: PageNotFoundComponent, data: { is404: true } }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
