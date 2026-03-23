
export interface soumission{
    id: number,
    reference: string,
    montant: string,
    delai: string,
    statut: string,
    fournisseur: string,
    fournisseur_pays: string,
    appel_offre: any,
    lignes: ligne_soumission[],
    date_soumission: string,
    historiques: soumissionHistorique[],
    pieceJointe: soumissionPj[],
    nombre_lignes: number
}

export interface soumissionPj{
    id: number,
    nom_fichier: string,
    url: string,
    type_document: string,
    date_creation: string
}

export interface ligne_soumission{
    id: number,
    quantite_proposee: number,
    prix_unitaire_propose: string,
    montant_ligne: string,
    ligne_appel_offre: any
}

export interface soumissionHistorique{
    id: number;
    action: string;
    ancien_statut: string;
    nouveau_statut: string;
    user_responsable: {
        id: number,
        nom: string,
        email: string
    };
    created_at: string
}

export enum statut_soumission{
    "Soumise",
    "En_Evaluation",
    "Accepteee",
    "Rejetee"
}