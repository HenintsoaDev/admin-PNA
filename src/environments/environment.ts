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
  module: 'parametrage/module',
  sous_module: 'parametrage/sousmodule',
  liste_module_active: 'parametrage/consult/module/liste_module_active',
  type_bureau: 'parametrage/type_bureau',
  type_profil: 'parametrage/type_profil',
  profil: 'parametrage/profil',
  liste_profil_active: 'parametrage/consult/profil/allActivatedProfil',
  liste_type_profil_active: 'parametrage/consult/type_profil/liste_type_profil_active',
  utilisateur: 'parametrage/user',
  liste_type_bureau_active: 'parametrage/consult/type_bureau/type_de_bureaux_active',
  regenerer_mdp: 'parametrage/user/regenerer_password',
  profilage: 'parametrage/profilage',
  action: 'parametrage/action',
  appendroute: 'parametrage/settings/appendroute',
  generateroute: 'parametrage/settings/generateroute',
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


};
