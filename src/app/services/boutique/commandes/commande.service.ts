import { environment } from "environments/environment";

import { Observable, tap } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpService } from '../../http.service';

@Injectable({
    providedIn: 'root',
})
    
export class CommandeService {

    constructor(private httpService: HttpService) { }

   
    
    validerCommande(idCompte, type): Observable<any> {
        return this.httpService.put<any>(environment.commande + '/' + idCompte + '/' + type, '').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

 
   

}