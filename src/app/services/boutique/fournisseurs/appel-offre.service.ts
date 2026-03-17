import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpService } from '../../http.service';

export interface AppelOffrePayload {
  titre: string;
  description?: string;
  date_publication: string;
  date_limite_soumission: string;
  lignes: AppelOffrePayloadLine[];
}

export interface AppelOffrePayloadLine {
  specifications: string;
  produit_id: number;
  quantite_demandee: number;
  designation: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppelOffreService {
  constructor(private httpService: HttpService) {}

  getDetailsAppelOffre(id: number): Observable<any> {
    return this.httpService.get<any>(`${environment.appel_offre}/${id}`);
  }

  ajoutAppelOffre(payload: AppelOffrePayload): Observable<any> {
    return this.httpService.post<any>(environment.appel_offre, payload);
  }

  modifierAppelOffre(id: number, payload: AppelOffrePayload): Observable<any> {
    return this.httpService.put<any>(`${environment.appel_offre}/${id}`, payload);
  }

  supprimerAppelOffre(id: number): Observable<any> {
    return this.httpService.delete<any>(`${environment.appel_offre}/${id}`);
  }
}
