// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const BASE_URL = "https://gateway-pf.sunuphco.com";

export const environment = {
  production: true,
  baseUrl: BASE_URL,
  userAuth: 'auth/me',
  menuItemsStorage: 'menuItemsPHCO',
  menuItemsSelectedStorage: 'menuItemsSelectedPHCO',
  authItemName: '__token_api_gate_way_phco',
  userItemName: '__user_api_gate_way_phco',
  phcoTimeToken: '_phco_time_token',
  soldeWelletStorage: 'soldeWallet',
  soldeCarteStorage: 'soldeCarte',
  authorityModule: 'authority_module',
  authoritySousModule: 'authority_sousModule',
  soldeSuiviCompte: 'soldeSuiviCompte',
  soldeCarteSuiviCompte: 'soldeCarteSuiviCompte',
  exportPdf: BASE_URL + "/export_to/pdf",
  exportExcel: BASE_URL + "/export_to/excel",
  soldeVirementCp: 'soldeVirementCp',
  soldeVirementCarteCp: 'soldeVirementCarteCp',
  soldeGlobalTotalSolde: 'soldeGlobalTotalSolde',
  soldeGlobalTotalSoldeCarte: 'soldeGlobalTotalSoldeCarte',
  soldeCarteParametrable: 'soldeCarteParametrable',
  soldeWalletCarteParametrable: 'soldeWalletCarteParametrable',

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
  header_message: 'parametrage/header_message',
  type_carte: 'parametrage/type_carte',
  motif: 'parametrage/motif',

  //** Gestion bureau */
  getSoldeUser: 'gestion_bureau/consult/bureaux/get_solde',
  liste_bureau_active: 'gestion_bureau/agence/active',
  bureau: 'gestion_bureau/bureaux',
  demande_credit: 'gestion_bureau/demande_credit',
  autorise_demande: 'gestion_bureau/demande_credit/autoriserDemande',
  valide_demande: 'gestion_bureau/demande_credit/validerDemande',
  initierValidation: 'gestion_bureau/demande_credit/initierValidation',
  demande_rapatriement: 'gestion_bureau/demande_rapatriement',
  autorise_demande_rapatriement: 'gestion_bureau/demande_rapatriement/autoriserDemande',
  valide_demande_rapatriement: 'gestion_bureau/demande_rapatriement/validerDemande',
  initierValidation_rapatriement: 'gestion_bureau/demande_rapatriement/initierValidation',

  //** Ressource */
  province: 'resource/province/liste_province',
  departement: 'resource/departement/liste_departement',

  //** Gestion compte principal */
  suivi_compte: "gestion_compte_principal/suivi_compte",
  suivi_compte_commission: "gestion_compte_principal/suivi_compte_commission",
  historique_virement: "gestion_compte_principal/virement",
  valide_virement: "gestion_compte_principal/virement/validerVirement",
  rejet_virement: "gestion_compte_principal/virement/rejeterVirement",

  //** Relevé solde bureau */
  releve_solde_bureau: "gestion_bureau/releve_solde_bureau",

  //** Solde bureau */
  solde_bureau: "gestion_bureau/solde_bureau",

  //** Solde distributeur */
  solde_distributeur: "gestion_bureau/solde_des_distributeur",

  //** Partenaire financier */
  partenaire_financier: "gestion_commission_reseau_phco/partenaire_financier",
  suivi_mouvement_partenaire_financier: "gestion_commission_reseau_phco/partenaire_financier/1/suivi_compte_partenaire",
  liste_partenaire: "gestion_commission_reseau_phco/liste_partenaire_achat_commission",

  //** Beneficiaire */
  beneficiaire: "gestion_compte/beneficiaire",
  add_beneficiaire: "gestion_compte/creer_compte",
  carte: "gestion_compte/carte",
  agence_active: 'gestion_bureau/agence/active',
  verification_compte: 'gestion_compte/verification_compte',

  //** Ressource */
  listetype: "resource/typepiece/listetype",
  //** Operation compte */
  cherche_compte: "operation_compte/find_compte",
  infos_compte: "operation_compte/infos_compte",
  activer_compte: "operation_compte/activer_compte",
  desactiver_compte: "operation_compte/desactiver_compte",
  solde_compte: "operation_compte/solde_compte",
  releve_compte: "operation_compte/releve_compte",
  calcul_recharge: "operation_compte/details_recharge",
  init_rechargement_espece: "operation_compte/init_rechargement_espece",
  cashin: "operation_compte/cashin",
  init_cashout: "operation_compte/init_cashout",
  executeCashOUT: "operation_compte/executeCashOUT",
  calcul_retrait: "operation_compte/calculFraisForCashOut",
  verifie_cin: "operation_compte/verifCNI",
  verifie_code: "operation_compte/verifCodeRetrait",
  recharge_espece: "operation_compte/rechargement_espece",
  retrait_espece: "operation_compte/retrait_espece",
  find_compte_by_numcompte: "operation_compte/find_compte_by_numcompte",

  //** Reporting TRANSACTION JOUR */
  reporting_transaction: "reporting/transaction_du_jour",
  reporting_historique_transaction: "reporting/historique_transaction",
  service_product: "parametrage/consult/service/liste_service_active",
  reporting_transaction_service: "reporting/transaction_par_service",
  reporting_transaction_agent: "reporting/transaction_par_agent",

  //** Dashboard */
  facturation: "dashboard/facturation",
  details_rechargement: "dashboard/details_rechargement",
  details_retrait: "dashboard/details_retrait_titulaire",
  etatCommissionPM: "dashboard/etatCommissionPM",

  //** Direction Regional */
  liste_direction_regional_active: "parametrage/dr/actives",
  liste_region_active: "parametrage/region/actives",
  liste_departement_region_active: "parametrage/departement/actives",
  liste_type_carte_active: "parametrage/type_carte/actives",

  region: 'parametrage/region',
  departement_region: 'parametrage/departement',
  direction_regional: "parametrage/dr",

  currentCodeCountry: 'sn',
  formatTelephone: '7X XXX XX XX',
  dialCode: '221',


  //** Ouverture */
  comptes: "ouverture/comptes",
  traiter_demande_compte: "ouverture/traiter",

  //** Demande */
  attestation: "demande/attestations",
  traiter_demande_attestation: "demande/attestations/traiter",
  chequiers: "demande/chequiers",
  traiter_demande_chequiers: "demande/chequiers/traiter",
  avances_salaire: "demande/avances_salaire",
  traiter_demande_avance_salaire: "demande/avances_salaire/traiter",
  autre_demande: "demande/autre_demande",

  //** Ordre Virement */ordres_virement
  ordre_virement: "ordres_virement/ordres_virement",
  valider_ordre_virement: "ordres_virement/valider",

  // inscription ----
  inscription: "ouverture/inscription",
  valider_inscription: "ouverture/inscription/valider/",
  annuler_inscription: "ouverture/inscription/annuler/",

  // Transfert ----
  transfet_cash: "transfert/cash",
  cherche_transaction:  "transfert/cash/detail",
  paiement_cash : "transfert/cash/payment"


};
