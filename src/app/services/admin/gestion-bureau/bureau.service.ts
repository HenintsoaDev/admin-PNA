import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { valuesys } from 'app/shared/models/options';
import { Auth, bureau } from 'app/shared/models/db';
import { Router } from '@angular/router';
import { MenuService } from 'app/shared/models/route-info';
import { HttpService } from '../../http.service';

@Injectable({
  providedIn: 'root'
})
export class BureauService {

    constructor(private http: HttpClient, private httpService: HttpService,private  router: Router,private menuService: MenuService) {}

    ajoutBureau(credentials: bureau): Observable<any> {
        
        return this.httpService.post<any>(environment.bureau, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    modifierBureau(credentials: bureau): Observable<any> {
        
        return this.httpService.put<any>(environment.bureau + '/' + credentials.rowid, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    supprimerBureau(id): Observable<any> {
        
        return this.httpService.delete<any>(environment.bureau + '/' + id,).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    changementStateBureau(data, state): Observable<any> {
        
        return this.httpService.get<any>(environment.bureau + '/' + data.rowid + '/state/' + state + '?state=' + state).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    regenererMotDePasse(credentials: any): Observable<any> {
        
        return this.httpService.post<any>(environment.regenerer_mdp, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    getAgenceBureauActive()
    {
        return this.httpService.get<any>(environment.liste_bureau_active + '?where=agence.idtype_agence|e|1' ).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

   
}