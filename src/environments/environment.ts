// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const BASE_URL = "https://backend-pna.numherit-preprod.com";

export const environment = {
  production: true,
  baseUrl: BASE_URL,
  userAuth: 'admin/auth/me',
  login: BASE_URL + '/admin/auth/login',
  logout: BASE_URL + '/admin/auth/logout',
  menuItemsStorage: 'menuItemsPNA',
  menuItemsSelectedStorage: 'menuItemsSelectedPNA',
  authItemName: '__token_api_gate_way_pna',
  userItemName: '__user_api_gate_way_pna',
  phcoTimeToken: '_pna_time_token',
  authorityModule: 'authority_module',
  authoritySousModule: 'authority_sousModule',
  exportPdf: BASE_URL + "/export_to/pdf",
  exportExcel: BASE_URL + "/export_to/excel",
 

  //** Parametrage */
  module: 'admin/parametrages/modules',
  sous_module: 'admin/parametrages/sous_modules',
  liste_module_active: 'admin/parametrages/modules/active',
  region: 'admin/parametrages/regions',
  liste_region_active: 'admin/parametrages/regions/active',

  type_structure: 'admin/parametrages/type_structures',
  district: 'admin/parametrages/district_sanitaires',
  liste_district_active : 'admin/parametrages/district_sanitaires/active',
  liste_structure_active : 'admin/parametrages/structure_sanitaires/active',
  liste_type_structure_active : 'admin/parametrages/type_structures/active',
  profilage: 'admin/parametrages/profilage',
  structure: 'admin/parametrages/structure_sanitaires',

  //** Gestion utilisateurs */
  utilisateur: 'admin/gestion_utilisateurs/utilisateurs',
  liste_profil_active: 'admin/gestion_utilisateurs/profils/active',
  profil: 'admin/gestion_utilisateurs/profils',


  type_profil: 'parametrage/type_profil',
  liste_type_profil_active: 'parametrage/consult/type_profil/liste_type_profil_active',
  liste_type_bureau_active: 'parametrage/consult/type_bureau/type_de_bureaux_active',
  regenerer_mdp: 'parametrage/user/regenerer_password',
  action: 'admin/parametrages/actions',
  appendroute: 'parametrage/settings/appendroute',
  generateroute: 'admin/parametrage/generateroute',
  service: 'parametrage/service',
  utilisateur_api_numherit: 'parametrage/user_api_numherit',
  liste_utilisateur_active: 'parametrage/consult/user/allActiveUser',
  regenerer_mdp_user_api: 'parametrage/user_api_numherit/regenerer_password',

  liste_bureau_active: 'gestion_bureau/agence/active',
  currentCodeCountry: 'sn',
  formatTelephone: '7X XXX XX XX',
  dialCode: '221',

  //** Gestion des produits */
  famille: 'admin/gestion_produits/familles',
  liste_famille_active: 'admin/gestion_produits/familles/active',
  categorie: 'admin/gestion_produits/categories',
  liste_categorie_active: 'admin/gestion_produits/categories/active',
  sous_categorie: 'admin/gestion_produits/sous_categories',
  liste_sous_categorie_active: 'admin/gestion_produits/sous_categories/active',
  forme: 'admin/gestion_produits/formes',
  liste_forme_active: 'admin/gestion_produits/formes/active',
  produit: 'admin/gestion_produits/produits',
  images_produits: 'admin/images_produits',
  fiche_techniques: 'admin/gestion_produits/fiche_techniques'
};
