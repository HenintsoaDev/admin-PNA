import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InscriptionDigitaleService {

  constructor(private httpService: HttpService) { }


  validateInscription(idInscription: number) {
    return this.httpService.put(environment.valider_inscription + idInscription, '').pipe(
      tap(response => {
        if (response['code'] === 200) {
          console.log("response XHR", response)
        }
      })
    );
  }

  rejectInscription(idInscription: number) {
    return this.httpService.put(environment.annuler_inscription + idInscription, '').pipe(
      tap(response => {
        if (response['code'] === 200) {
          console.log("response XHR", response)
        }
      })
    );
  }

}
