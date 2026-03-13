import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { valuesys } from 'app/shared/models/options';
import { Auth, categorie } from 'app/shared/models/db';
import { Router } from '@angular/router';
import { MenuService } from 'app/shared/models/route-info';
import { HttpService } from '../../http.service';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

    constructor(private http: HttpClient, private httpService: HttpService,private  router: Router,private menuService: MenuService) {}

    getCategorieActive() : Observable<any> {
        return this.httpService.get<any>(environment.liste_module_active).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            }
        ));
    }

    ajoutCategorie(credentials: categorie): Observable<any> {
        
        return this.httpService.post<any>(environment.categorie, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    modifierCategorie(credentials: categorie): Observable<any> {
        
        return this.httpService.put<any>(environment.categorie + '/' + credentials.id, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    supprimerCategorie(id): Observable<any> {
        
        return this.httpService.delete<any>(environment.categorie + '/' + id,).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    changementStateCategorie(data, state): Observable<any> {
        
        return this.httpService.put<any>(environment.categorie + '/' + data.id + '/state/' + state , '').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

   
}