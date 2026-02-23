import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpService } from './http.service';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SoldeService {
    
    private walletSoldeSubject = new BehaviorSubject<string>("0");
    private carteSoldeSubject = new BehaviorSubject<string>("0");

    walletSolde$ = this.walletSoldeSubject.asObservable();
    carteSolde$ = this.carteSoldeSubject.asObservable();

    constructor(private httpService: HttpService) {}

    getSoldeUser(){
        return this.httpService.get<any>(environment.getSoldeUser).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                    //this.walletSoldeSubject.next(response['data']['solde']);
                    //this.carteSoldeSubject.next(response['data']['solde_carte']);
                    localStorage.setItem(environment.soldeWelletStorage,response['data']['solde']);
                    localStorage.setItem(environment.soldeCarteStorage,response['data']['solde_carte']);

                    const localStorageValue = localStorage.getItem(environment.soldeWelletStorage);
                    if (localStorageValue) {
                        this.walletSoldeSubject.next(localStorageValue);
                    }

                    const localStorageValueCarte = localStorage.getItem(environment.soldeCarteStorage);
                    if (localStorageValueCarte) {
                        this.carteSoldeSubject.next(localStorageValueCarte);
                    }
                }
            })
        );
    }

    setWalletSolde(newValue: string) {
        this.walletSoldeSubject.next(newValue);
    }

    setCarteSolde(newValue: string) {
        this.carteSoldeSubject.next(newValue);
    }

    getWalletSolde(): string {
        // Check if the value is in localStorage
        const localStorageValue = localStorage.getItem(environment.soldeWelletStorage);
        if (localStorageValue) {
            this.walletSoldeSubject.next(localStorageValue);
        }
        return this.walletSoldeSubject.value;
    }

    getCarteSolde(): string {
        const localStorageValueCarte = localStorage.getItem(environment.soldeCarteStorage);
        if (localStorageValueCarte) {
            this.carteSoldeSubject.next(localStorageValueCarte);
        }
        return this.carteSoldeSubject.value;
    }
}
