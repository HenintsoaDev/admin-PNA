import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { valuesys } from 'app/shared/models/options';
import { Auth, famille, type_structure } from 'app/shared/models/db';
import { Router } from '@angular/router';
import { MenuService } from 'app/shared/models/route-info';
import { HttpService } from '../../http.service';

@Injectable({
  providedIn: 'root'
})
export class TypeStructureService {

    constructor(private http: HttpClient, private httpService: HttpService,private  router: Router,private menuService: MenuService) {}


    ajoutTypeStructure(credentials: type_structure): Observable<any> {
        
        return this.httpService.post<any>(environment.type_structure, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    modifierTypeStructure(credentials: type_structure): Observable<any> {
        
        return this.httpService.put<any>(environment.type_structure + '/' + credentials.id, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    supprimerTypeStructure(id): Observable<any> {
        
        return this.httpService.delete<any>(environment.type_structure + '/' + id,).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    changementStateTypeStructure(data, state): Observable<any> {
        
        return this.httpService.put<any>(environment.type_structure + '/' + data.id + '/state/' + state , '').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

   
}