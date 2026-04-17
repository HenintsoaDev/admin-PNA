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
        return this.httpService.put<any>(environment.commande + '/' + idCompte + '/state/' + type, '').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    ajoutCommandeAchat(payload: any): Observable<any> {
        return this.httpService.post<any>(environment.commande_achat, payload);
    }
    
    modifierCommandeAchat(id: number, payload: any): Observable<any> {
        return this.httpService.put<any>(`${environment.commande_achat}/${id}`, payload);
    } 
    
    validerCommandeAchat(idCompte, type, body: any = ''): Observable<any> {
        return this.httpService.put<any>(environment.commande_achat + '/' + idCompte + '/state/' + type, body);
    }

    supprimerLigneCommande(id): Observable<any> {
        return this.httpService.delete<any>(environment.commande_achat + '/ligne/' + id,);
    }

   

}