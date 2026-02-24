export class utilisateur {
    rowid: number;
    nom: string;
    prenom: string;
    telephone: string;
    login: string;
    fk_profil: number;
    fk_agence: number;
    admin: number;
    connect: number;
    state: number;
    superviseur: number;
    email: string;
    name: string;
    id_type_agence: any;
    wallet_carte: number;
    profil: any;
}

export class VerifiedAccount {
    numcompte: string;
    type_compte: number;
    code_agence: string;
    nom_compte: string;
    adress: string;
}

export class Agence {
    rowid: number
    code: string;
    name: string
}

export class utilisateurApiNumherit {
    id: number;
    firstname: string;
    lastname: string;
    phonenumber: string;
    username: string;
    state: number;
    email: string;
}

export class Auth {
    info: utilisateur|null;
    modules: module_user[] | []
}

export class module_user {
    id: number ;
    name: string ;
    code: string ;
    icon: string | null ;
    state: number | null ;
    hasOneSousModuleAction: boolean;
    sousModules: sous_module [] | null ;
}

export class sous_module {
    id: number ;
    name: string ;
    code: string ;
    icon: string | null ;
    module_id: string | null ;
    state: number | null ;
    actions: action [] | null | [];
}

export class module {
    id: number ;
    name: string ;
    code: string ;
    icon: string | null ;
    state: number | null ;
    actions: action [] | null | [];
}

export class action {
    id: number ;
    name: string ;
    code: string ;
    url: string ;
    state: number | null ;
    type_action_id: number ;
}
export class type_bureau {
    id: number ;
    name: string ;
    state: number | null ;
}

export class type_carte {
    id: number ;
    name: string ;
    state: number | null ;
}

export class type_profil {
    id: number ;
    name: string ;
    code: string ;
    state: number | null ;
}

export class profil {
    id: number ;
    name: string ;
    code: string ;
    wallet_carte: number | null ;
    type_profil_id: string | null ;
    state: number | null ;
    actions: action [] | null | [];
}

export class bureau {
    rowid: number ;
    name: string ;
    code: string ;
    responsable: string | null ;
    fk_quartier: number | null ;
    direction_id: number | null ;
    region_id: number | null ;
    departement_id: number | null ;
    adresse: string | null ;
    tel: string | null ;
    email: string | null ;
    idtype_agence: number | null ;
    email_dr: string | null ;
    telephone_dr: string | null ;
    rapatrie_auto: any | null ;
    solde_max_rapatrie: number | null ;
    state: number | null ;
    actions: action [] | null | [];
    latitude!: string;
    longitude!: string; 
   
}

export class province {
    id: number;
    lib_region: string ;
   
}

export class direction {
    id: number;
    libelle: string ;
    code: string ;
    lib_region: string ;

   
}

export class service {
    rowid: number;
    code: string ;
    label: string ;
    frais: string ;
    state: number ;
    user_creation: number ;
    date_creation: string ;
    created_by: string ;
    date_modification: string ;
    distributeur: number ;
    taux_distributeur: number ;

    taux_sous_distributeur: number ;
    solde: number ;
    solde_carte: number ;
    type_frais: number;
    montant: string;
    paliers: any;
   
   
}

export class departement {
    id: number ;
    name: string ;
    region_id: string | null ;
    state: number | null ;
}

export class region {
    id: number;
    lib2: string ;
    lib_region: string ;
    libelle!: string ;
    state!: number ;
    dr_id!: number;
}

export class ouverture {
 
    id!: number;
    date_creation!: string;
    civilite!: string;
    nom!: string;
    prenom!: string;
    sexe!: string;
    typecni!:string;
    situation_matrimoniale!:string;
    date_naissance!: string;
    lieu_naissance!: string;
    telephone!: string;
    state!: number;
    email!: string;
    cni!: string;
    adresse!: string;
    pays!: string;
    nationalite!: string;
    nom_mere!: string;
    prenom_mere!: string;
    agence!:string;
    type_compte!: string;
    documents!: any;
}

export interface InscriptionBanqueDigitale {
  id?: number; // Optional since it appears last in objetBody without type
  nom: string;
  prenom: string;
  cni: string;
  date_delivrance: string | Date; // Can be string (ISO format) or Date object
  adresse: string;
  typecni: string | null; // Nullable as per your data
  telephone: string;
  email: string;
  date_nais: string | Date;
  sexe: string; // Assuming 'M'/'F' but kept open for other values
  statut: number; // Using number since it's marked as "state" type
  fk_typecni: number;
  departement_id: number;
  fk_agence: number;
}

export class motifs {
    id?: number;
    titre: string = '';
    description: string = '';
    state: number;
    operation: number;
  }