import { environment } from "environments/environment";

import { Observable, tap } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpService } from "../http.service";

@Injectable({
    providedIn: 'root',
})
    
export class OrdreVirementService {

    constructor(private httpService: HttpService) { }

   
    
    validerOrdreVirement(idCompte): Observable<any> {
        return this.httpService.put<any>(environment.valider_ordre_virement + '/' + idCompte, '').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

 
   

}