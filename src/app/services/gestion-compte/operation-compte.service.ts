import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { valuesys } from 'app/shared/models/options';
import { Auth, bureau } from 'app/shared/models/db';
import { Router } from '@angular/router';
import { MenuService } from 'app/shared/models/route-info';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class OperationCompteService {

    constructor(private http: HttpClient, private httpService: HttpService,private  router: Router,private menuService: MenuService) {}
  
    chercheCompte(credentials: any): Observable<any> {
        return this.httpService.post<any>(environment.cherche_compte, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    find_compte_by_numcompte(credentials: any): Observable<any> {
        return this.httpService.post<any>(environment.find_compte_by_numcompte, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    recupererHistoriqueCompte(credentials: any): Observable<any> {
        return this.httpService.post<any>(environment.historique_compte, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }


    infoCompte(credentials: any): Observable<any> {
        return this.httpService.post<any>(environment.infos_compte, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }


    activerCompte(credentials: any): Observable<any> {
        return this.httpService.post<any>(environment.activer_compte, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    desactiverCompte(credentials: any): Observable<any> {
        return this.httpService.post<any>(environment.desactiver_compte, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    soldeCompte(credentials: any): Observable<any> {
        return this.httpService.post<any>(environment.solde_compte, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }


    calculeRecharge(credentials: any): Observable<any> {
        return this.httpService.post<any>(environment.calcul_recharge, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    envoieCodeRecharge(credentials: any): Observable<any> {
        return this.httpService.post<any>(environment.init_rechargement_espece, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

  
    rechargeCompte(credentials: any): Observable<any> {

        return this.httpService.post<any>(environment.cashin, credentials).pipe(
            tap(response => {
              if (response.code === 200) {
                console.log("response XHR", response);
              }
            }),
            catchError(error => {
              console.error("Erreur lors de la requête :", error);
              return throwError(() => error);
            })
          );
    }


    retraitCompte(credentials: any): Observable<any> {

        return this.httpService.post<any>(environment.executeCashOUT, credentials).pipe(
            tap(response => {
              if (response.code === 200) {
                console.log("response XHR", response);
              }
            }),
            catchError(error => {
              console.error("Erreur lors de la requête :", error);
              return throwError(() => error);
            })
          );
    }

    envoieCodeRetrait(credentials: any): Observable<any> {
        return this.httpService.post<any>(environment.init_cashout, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }


    calculeRetrait(credentials: any): Observable<any> {
        return this.httpService.post<any>(environment.calcul_retrait, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    verifieCIN(credentials: any): Observable<any> {
        return this.httpService.post<any>(environment.verifie_cin, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
    verifieCode(credentials: any): Observable<any> {
       

        return this.httpService.post<any>(environment.verifie_code, credentials).pipe(
            tap(response => {
              if (response.code === 200) {
                console.log("response XHR", response);
              }
            }),
            catchError(error => {
              console.error("Erreur lors de la requête :", error);
              return throwError(() => error);
            })
          );
    }

    rechargeEspece(credentials: any): Observable<any> {
        return this.httpService.post<any>(environment.recharge_espece, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    retraiteEspece(credentials: any): Observable<any> {
        return this.httpService.post<any>(environment.retrait_espece, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }


    genererDeclaration(credentials: any): Observable<any> {
        return this.httpService.post<any>(environment.generer_declaration, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }


    
    

 

   
}