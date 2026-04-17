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
export class LivraisonClientService {

    constructor(private http: HttpClient, private httpService: HttpService,private  router: Router,private menuService: MenuService) {}


    ajoutlivraison(credentials: livraison): Observable<any> {
        
        return this.httpService.post<any>(environment.livraison_client, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    modifierlivraison(id, credentials: livraison): Observable<any> {
        
        return this.httpService.put<any>(environment.livraison_client + '/' + id, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    supprimerlivraison(id): Observable<any> {
        
        return this.httpService.delete<any>(environment.livraison_client + '/' + id,).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }


    changementStatelivraison(idCompte, type, body: any = ''): Observable<any> {
        return this.httpService.put<any>(environment.livraison_client + '/' + idCompte + '/state/' + type, body);
    }

   
}