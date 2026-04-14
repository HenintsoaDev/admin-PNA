import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { valuesys } from 'app/shared/models/options';
import { Auth, facture } from 'app/shared/models/db';
import { Router } from '@angular/router';
import { MenuService } from 'app/shared/models/route-info';
import { HttpService } from '../../http.service';

@Injectable({
  providedIn: 'root'
})
export class FactureService {

    constructor(private http: HttpClient, private httpService: HttpService,private  router: Router,private menuService: MenuService) {}


    ajoutfacture(credentials: facture): Observable<any> {
        
        return this.httpService.post<any>(environment.facture, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    modifierfacture(credentials: facture): Observable<any> {
        
        return this.httpService.put<any>(environment.facture + '/' + credentials.id, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    supprimerfacture(id): Observable<any> {
        
        return this.httpService.delete<any>(environment.facture + '/' + id,).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    changementStatefacture(data, state): Observable<any> {
        
        return this.httpService.put<any>(environment.facture + '/' + data.id + '/state/' + state , '').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    validerFacture(idCompte, type, body: any = ''): Observable<any> {
        return this.httpService.put<any>(environment.facture + '/' + idCompte + '/state/' + type, body);
    }

   
}