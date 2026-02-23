import { Injectable } from "@angular/core";
import { HttpService } from "app/services/http.service";
import { environment } from "environments/environment";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class PartenaireFinancierService {
  
    constructor(private httpService: HttpService) {}

    addPartenaire(data): Observable<any> {
        return this.httpService.post<any>(environment.partenaire_financier, data).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response);
                }
            })
        );
    }

    getDetailPartenaire(id): Observable<any> {
        return this.httpService.get<any>(environment.partenaire_financier + '/' + id).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response);
                }
            })
        );
    }

    updatePartenaire(id, data): Observable<any> {
        return this.httpService.put<any>(environment.partenaire_financier + '/' + id, data).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response);
                }
            })
        );
    }

    activerPartenaire(id,state): Observable<any> {
        return this.httpService.get<any>(environment.partenaire_financier + '/' + id + '/state/0?state=' + state).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response);
                }
            })
        );
    }

}