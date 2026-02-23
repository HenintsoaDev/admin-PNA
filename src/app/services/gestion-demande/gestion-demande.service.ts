import { environment } from "environments/environment";

import { Observable, tap } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpService } from "../http.service";

@Injectable({
    providedIn: 'root',
})
    
export class GestionDemandeService {

    constructor(private httpService: HttpService) { }

   
    
    traiterDemandeCompte(idCompte): Observable<any> {
        return this.httpService.put<any>(environment.traiter_demande_compte + '/' + idCompte, '').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    traiterDemandeAttestation(idAttestation, etat, datamotif): Observable<any> {
        return this.httpService.put<any>(environment.attestation + '/' + idAttestation + '/statut/' + etat, datamotif).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    traiterAutreDemande(idAutre, etat, datamotif): Observable<any> {
        return this.httpService.put<any>(environment.autre_demande + '/' + idAutre + '/statut/' + etat, datamotif).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    /* traiterDemandeChequiers(idChequiers): Observable<any> {
        return this.httpService.put<any>(environment.traiter_demande_chequiers + '/' + idChequiers, '').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    

    traiterDemandeAvanceSalaire(idAvanceSalaire): Observable<any> {
        return this.httpService.put<any>(environment.traiter_demande_avance_salaire + '/' + idAvanceSalaire, '').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    } */

    traiterDemandeAvanceSalaire(idAvanceSalaire, etat, datamotif): Observable<any> {
        return this.httpService.put<any>(environment.avances_salaire + '/' + idAvanceSalaire + '/statut/' + etat, datamotif).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    

    traiterDemandeChequiers(idAvanceSalaire, etat, datamotif): Observable<any> {
        return this.httpService.put<any>(environment.chequiers + '/' + idAvanceSalaire + '/statut/' + etat, datamotif).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    
   

}