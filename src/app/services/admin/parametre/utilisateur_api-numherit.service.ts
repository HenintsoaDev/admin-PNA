import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { valuesys } from 'app/shared/models/options';
import { Auth, utilisateurApiNumherit } from 'app/shared/models/db';
import { Router } from '@angular/router';
import { MenuService } from 'app/shared/models/route-info';
import { HttpService } from '../../http.service';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurApiNumheritService {

    constructor(private http: HttpClient, private httpService: HttpService,private  router: Router,private menuService: MenuService) {}

  

   


   

    ajoutUtilisateur(credentials: utilisateurApiNumherit): Observable<any> {
        
        return this.httpService.post<any>(environment.utilisateur_api_numherit, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    modifierUtilisateur(credentials: utilisateurApiNumherit): Observable<any> {
        
        return this.httpService.put<any>(environment.utilisateur_api_numherit + '/' + credentials.id, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    supprimerUtilisateur(id): Observable<any> {
        
        return this.httpService.delete<any>(environment.utilisateur_api_numherit + '/' + id,).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    changementStateUtilisateur(data, state): Observable<any> {
        
        return this.httpService.get<any>(environment.utilisateur_api_numherit + '/' + data.id + '/state/' + state + '?state=' + state).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    regenererMotDePasse(credentials: any): Observable<any> {
        
        return this.httpService.post<any>(environment.regenerer_mdp_user_api, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

   
}