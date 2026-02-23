export interface IProfil {
    code: number;
    id: number;​​​
    name: string;
    state: number;
}

export interface ITokenInfo {
    id: number;
    l_name: string;
    f_name: string;
    email: string;
    address: string; 
    phone: string;
    last_connection: string | null;
    first_connection: string | null;
    avatar: string | null;
    state: number;
    admin: number;
    agence_id: number;
    profil_id: number;
    photo: string | null,
    recovery_at: string;
    profil?: IProfil;   
    nom: string;
    prenom: string;
    agence:string
} 