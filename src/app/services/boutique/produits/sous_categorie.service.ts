import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { valuesys } from 'app/shared/models/options';
import { Auth, sous_categorie } from 'app/shared/models/db';
import { Router } from '@angular/router';
import { MenuService } from 'app/shared/models/route-info';
import { HttpService } from '../../http.service';

@Injectable({
  providedIn: 'root'
})
export class SousCategorieService {

    constructor(private http: HttpClient, private httpService: HttpService,private  router: Router,private menuService: MenuService) {}

    getsous_categorieActive() : Observable<any> {
        return this.httpService.get<any>(environment.liste_module_active).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            }
        ));
    }

    ajoutsous_categorie(credentials: sous_categorie): Observable<any> {
        
        return this.httpService.post<any>(environment.sous_categorie, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    modifiersous_categorie(credentials: sous_categorie): Observable<any> {
        
        return this.httpService.put<any>(environment.sous_categorie + '/' + credentials.id, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    supprimersous_categorie(id): Observable<any> {
        
        return this.httpService.delete<any>(environment.sous_categorie + '/' + id,).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    changementStatesous_categorie(data, state): Observable<any> {
        
        return this.httpService.put<any>(environment.sous_categorie + '/' + data.id + '/state/' + state, '').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

   
}