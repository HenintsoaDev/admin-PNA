import { GestionProduitModule } from './views/modules/gestion-boutique/gestion-produit/gestion-produit.module';
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
    path: 'admin/parametrages', data: { breadcrumb: 'module.title_module_breadcrumb' },
    loadChildren: () => import('./views/modules/adm/parametrage/parametrage.module').then(m => m.ParametrageModule)
  },

  {
    path: 'admin/gestion_produits', data: { breadcrumb: 'famille.title_gestion_produit_breadcrumb' },
    loadChildren: () => import('./views/modules/gestion-boutique/gestion-produit/gestion-produit.module').then(m => m.GestionProduitModule)
  },
  {
    path: 'admin/gestion_utilisateurs', data: { breadcrumb: 'famille.title_gestion_produit_breadcrumb' },
    loadChildren: () => import('./views/modules/adm/gestion-comptes/gestion-comptes.module').then(m => m.GestionComptesModule)
  },
  {
    path: 'admin/gestion_fournisseurs', data: { breadcrumb: 'famille.title_gestion_produit_breadcrumb' },
    loadChildren: () => import('./views/modules/gestion-boutique/gestion-fournisseur/gestion-fournisseur.module').then(m => m.GestionFournisseurModule)
  },
  {
    path: 'admin/gestion_commandes', data: { breadcrumb: 'famille.title_gestion_produit_breadcrumb' },
    loadChildren: () => import('./views/modules/gestion-boutique/gestion-commande/gestion-commande.module').then(m => m.GestionCommandeModule)
  },



  {
    path: 'ouverture', data: { breadcrumb: 'ouverture.title_breadcrumb' },
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
