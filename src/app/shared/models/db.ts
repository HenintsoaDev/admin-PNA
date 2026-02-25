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

export class famille {
    id: number ;
    nom: string ;
    code: string ;
    state: number | null ;
    categories: action [] | null | [];
}


export class categorie {
    id: number ;
    nom: string ;
    code: string ;
    state: number | null ;
    categories: action [] | null | [];
}
