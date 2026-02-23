import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class WalletService {
  private walletCarteSubject = new BehaviorSubject<any>(0);
  walletCarte$ = this.walletCarteSubject.asObservable();

  setWalletCarte(value: any) {
    this.walletCarteSubject.next(value);
  }
}
