
export interface soumission{
    id: number,
    reference: string,
    montant: string,
    delai: string,
    statut: string,
    fournisseur: string,
    appel_offre: any,
    lignes: ligne_soumission[],
    date_soumission: string,
    nombre_lignes: number
}

export interface ligne_soumission{
    id: number,
    quantite_proposee: number,
    prix_unitaire_propose: string,
    montant_ligne: string,
    ligne_appel_offre: any
}