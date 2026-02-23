import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { valuesys } from 'app/shared/models/options';
import { Auth, service } from 'app/shared/models/db';
import { Router } from '@angular/router';
import { MenuService } from 'app/shared/models/route-info';
import { HttpService } from '../../http.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

    constructor(private http: HttpClient, private httpService: HttpService,private  router: Router,private menuService: MenuService) {}

    ajoutService(credentials: service): Observable<any> {
        
        return this.httpService.post<any>(environment.service, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    modifierService(credentials: any): Observable<any> {
        
        return this.httpService.put<any>(environment.service + '/' + credentials.rowid, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    supprimerService(id): Observable<any> {
        
        return this.httpService.delete<any>(environment.service + '/' + id,).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    changementStateService(data, state): Observable<any> {
        
        return this.httpService.get<any>(environment.service + '/' + data.rowid + '/state/' + state + '?state=' + state).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    ajoutPalier(idService, credentials: any): Observable<any> {
        
        return this.httpService.patch<any>(environment.service + "/" +idService + "/addPallier", credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    supprimerPalier(idService, idPalier): Observable<any> {

        return this.httpService.delete<any>(environment.service + '/' +idService + "/pallier/" + idPalier + "/deletePalier",).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

   
}