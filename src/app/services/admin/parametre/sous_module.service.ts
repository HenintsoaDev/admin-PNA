import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { sous_module } from 'app/shared/models/db';
import { Router } from '@angular/router';
import { MenuService } from 'app/shared/models/route-info';
import { HttpService } from '../../http.service';

@Injectable({
    providedIn: 'root'
})
export class SousModuleService {

    constructor(private http: HttpClient, private httpService: HttpService, private router: Router, private menuService: MenuService) { }








    ajoutSousModule(credentials: sous_module): Observable<any> {

        return this.httpService.post<any>(environment.sous_module, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    modifierSousModule(credentials: sous_module): Observable<any> {

        return this.httpService.put<any>(environment.sous_module + '/' + credentials.id, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    supprimerSousModule(id): Observable<any> {

        return this.httpService.delete<any>(environment.sous_module + '/' + id,).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    changementStateSousModule(data, state): Observable<any> {

        return this.httpService.get<any>(environment.sous_module + '/' + data.id + '/state/' + state + '?state=' + state).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }


}