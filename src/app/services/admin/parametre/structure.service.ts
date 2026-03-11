import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { valuesys } from 'app/shared/models/options';
import { Auth, structure } from 'app/shared/models/db';
import { Router } from '@angular/router';
import { MenuService } from 'app/shared/models/route-info';
import { HttpService } from '../../http.service';

@Injectable({
  providedIn: 'root'
})
export class StructureService {

    constructor(private http: HttpClient, private httpService: HttpService,private  router: Router,private menuService: MenuService) {}


    ajoutstructure(credentials: structure): Observable<any> {
        
        return this.httpService.post<any>(environment.structure, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    modifierstructure(credentials: structure): Observable<any> {
        
        return this.httpService.put<any>(environment.structure + '/' + credentials.id, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    supprimerstructure(id): Observable<any> {
        
        return this.httpService.delete<any>(environment.structure + '/' + id,).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    changementStatestructure(data, state): Observable<any> {
        
        return this.httpService.put<any>(environment.structure + '/' + data.id + '/state/' + state , '').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

   
}