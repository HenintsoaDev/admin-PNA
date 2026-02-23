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
export class DemandeCreditService {

    constructor(private http: HttpClient, private httpService: HttpService,private  router: Router,private menuService: MenuService) {}

 
    autoriseDemande(idDemande: any): Observable<any> {
        
        return this.httpService.put<any>(environment.autorise_demande + '/' + idDemande, '').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    valideDemande(idDemande: any, data): Observable<any> {
        
        return this.httpService.put<any>(environment.valide_demande + '/' + idDemande, data).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    initierDemande(idDemande: any): Observable<any> {
        
        return this.httpService.put<any>(environment.initierValidation + '/' + idDemande, '').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

   

    ajoutDemande(data: any): Observable<any> {
        
        return this.httpService.post<any>(environment.demande_credit, data).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

   
}