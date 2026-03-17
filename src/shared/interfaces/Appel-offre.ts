
export interface AppelOffre {
    id: number;
    reference: string;
    titre: string;
    description: string;
    date_publication: string;
    date_limite_soumission: string;
    date_creation: string;
    date_modification: string;
    statut: string;
    createur: any;
    lignes: AppelOffreDetails[];
}

export interface AppelOffreDetails {
    id: number;
    quantite_demandee: number;
    specifications: string;
    designation: string;
    produit_id: number;
    produit: Produit;
}


export interface Produit {
    id: number;
    code: string;
    code_sage: string | null;
    dci: string;
    nom_commercial: string;
    dosage: string;
    conditionnement: string;
    composition: string | null;
    contre_indication: string | null;
    posologie: string | null;
    description: string;
    prix_unitaire: string;
    seuil_alerte_stock: number;
    est_disponible: number;
    etat: boolean;
    sous_categorie_produit_id: number;
    sous_categorie: string;
    forme: string;
    forme_id: number;
    date_creation: string;
    date_modification: string;
    images: productImage[]
}

export interface productImage {
    id: number;
    url: string;
    est_principal: number;
}