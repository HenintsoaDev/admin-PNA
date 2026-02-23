import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { valuesys } from 'app/shared/models/options';
import { Auth, type_bureau } from 'app/shared/models/db';
import { Router } from '@angular/router';
import { MenuService } from 'app/shared/models/route-info';
import { HttpService } from '../../http.service';

@Injectable({
  providedIn: 'root'
})
export class TypeBureauService {

    constructor(private http: HttpClient, private httpService: HttpService,private  router: Router,private menuService: MenuService) {}

  

   


   

    ajoutTypeBureau(credentials: type_bureau): Observable<any> {
        
        return this.httpService.post<any>(environment.type_bureau, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    modifierTypeBureau(credentials: type_bureau): Observable<any> {

        const data  = {
            'id' : credentials.id,
            'name' : credentials.name
        }
        
        return this.httpService.put<any>(environment.type_bureau + '/' + credentials.id, data).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    supprimerTypeBureau(id): Observable<any> {
        
        return this.httpService.delete<any>(environment.type_bureau + '/' + id,).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    changementStateTypeBureau(data, state): Observable<any> {
        
        return this.httpService.get<any>(environment.type_bureau + '/' + data.id + '/state/' + state + '?state=' + state).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

   
}