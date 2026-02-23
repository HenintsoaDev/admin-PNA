import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "app/services/http.service";
import { environment } from "environments/environment";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class HistoriqueVirementsService {

    constructor(private http: HttpClient, private httpService: HttpService,private  router: Router) {}

    validerVirement(id): Observable<any>
    {
        return this.httpService.put<any>(environment.valide_virement+'/'+id,'').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    rejeterVirement(id): Observable<any>
    {
        return this.httpService.put<any>(environment.rejet_virement+'/'+id,'').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    deleteVirement(id): Observable<any>
    {
        return this.httpService.delete<any>(environment.historique_virement+'/'+id).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    addVirement(monant,wallet_cart): Observable<any>
    {
        return this.httpService.post<any>(environment.historique_virement,{
            'montant' : monant,
            'wallet_carte' : wallet_cart
        }).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    updateVirement(id,monant,wallet_cart): Observable<any>
    {
        return this.httpService.put<any>(environment.historique_virement+'/'+id,{
            'montant' : monant,
            'wallet_carte' : wallet_cart
        }).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

}

