import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { valuesys } from 'app/shared/models/options';
import { Auth, livraison } from 'app/shared/models/db';
import { Router } from '@angular/router';
import { MenuService } from 'app/shared/models/route-info';
import { HttpService } from '../../http.service';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {

    constructor(private http: HttpClient, private httpService: HttpService,private  router: Router,private menuService: MenuService) {}


    ajoutlivraison(credentials: livraison): Observable<any> {
        
        return this.httpService.post<any>(environment.livraison, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    modifierlivraison(credentials: livraison): Observable<any> {
        
        return this.httpService.put<any>(environment.livraison + '/' + credentials.id, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    supprimerlivraison(id): Observable<any> {
        
        return this.httpService.delete<any>(environment.livraison + '/' + id,).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    changementStatelivraison(data, state): Observable<any> {
        
        return this.httpService.put<any>(environment.livraison + '/' + data.id + '/state/' + state , '').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    receptionnerCommande(idCompte, type, body: any = ''): Observable<any> {
        return this.httpService.put<any>(environment.livraison + '/' + idCompte + '/' + type, body);
    }

   
}