import { environment } from "environments/environment";

import { Observable, tap } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpService } from "../http.service";

@Injectable({
    providedIn: 'root',
})
    
export class BeneficiaireService {

    constructor(private httpService: HttpService) { }

    addNewBeneficiaire(credentials): Observable<any> {
        return this.httpService.post<any>(environment.add_beneficiaire, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    getInfosBeneficiaire(rowid): Observable<any> {
        return this.httpService.get<any>(environment.beneficiaire + '/' + rowid).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    
    updateBeneficiaire(credentials): Observable<any> {
        return this.httpService.put<any>(environment.beneficiaire + '/' + credentials.rowid, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    lierCarte(credentials): Observable<any> {
        return this.httpService.post<any>(environment.carte, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }


    getAgenceActive(): Observable<any> {
        return this.httpService.get<any>(environment.agence_active).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    verifyAccount(credentials): Observable<any> {
        return this.httpService.post<any>(environment.verification_compte, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }


    ajoutDocument(credentials): Observable<any> {
        return this.httpService.post<any>(environment.beneficiaire + '/document', credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

}