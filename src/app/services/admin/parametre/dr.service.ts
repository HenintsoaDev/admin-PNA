import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { valuesys } from 'app/shared/models/options';
import { Auth, module } from 'app/shared/models/db';
import { Router } from '@angular/router';
import { MenuService } from 'app/shared/models/route-info';
import { HttpService } from '../../http.service';

@Injectable({
    providedIn: 'root'
})

export class DRService {

    constructor(private http: HttpClient, private httpService: HttpService, private router: Router, private menuService: MenuService) { }
    
    getListDR(): Observable<any> {
        
        return this.httpService.get<any>(environment.liste_direction_regional_active).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    getListRegion(idDirReg): Observable<any> {
        
        return this.httpService.get<any>(environment.liste_region_active + '?where=region.dr_id|e|'+idDirReg).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    getListDepartementRegion(idDirReg): Observable<any> {
        
        return this.httpService.get<any>(environment.liste_departement_region_active + '?where=departement.region_id|e|'+idDirReg).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

}
