import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
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
  NextStatus(id: number, status: string): Observable<any> {
    const key = this.normalizeStatusKey(status);

    // Si on reçoit une action "cloturer" on la mappe sur le statut final "clos"
    const actionOrStatus = key === 'clos' && this.isCloturerAction(status) ? 'cloturer' : key;

    // Mode "action directe"
    switch (actionOrStatus) {
      case 'publier':
        return this.publierAppelOffre(id);
      case 'en_attente':
        return this.mettreEnAttenteAppelOffre(id);
      case 'attribuer':
        return this.attribuerAppelOffre(id);
      case 'cloturer':
      case 'clos':
        return this.CloturerAppelOffre(id);
    }

    // Mode "transition depuis statut courant"
    switch (key) {
      case 'brouillon':
        return this.publierAppelOffre(id);
      case 'publier':
        return this.mettreEnAttenteAppelOffre(id);
      case 'en_attente':
        return this.attribuerAppelOffre(id);
      case 'attribuer':
        return this.CloturerAppelOffre(id);
      default:
        return throwError(() => new Error(`NextStatus: statut/action non supporté: ${status}`));
    }
  }

  publierAppelOffre(id: number): Observable<any> {
    return this.httpService.put<any>(`${environment.appel_offre}/${id}/publier`, {});
  }

  mettreEnAttenteAppelOffre(id: number): Observable<any> {
    return this.httpService.put<any>(`${environment.appel_offre}/${id}/en_attente`, {});
  }

  CloturerAppelOffre(id: number): Observable<any> {
    return this.httpService.put<any>(`${environment.appel_offre}/${id}/cloturer`, {});
  }

  attribuerAppelOffre(id: number): Observable<any> {
    return this.httpService.put<any>(`${environment.appel_offre}/${id}/attribuer`, {});
  }



  public normalizeStatusKey(statut: string | null | undefined): string {
    if (statut === null || statut === undefined) return '';

    const numeric = Number(statut);
    if (!Number.isNaN(numeric)) {
      const numericMap: Record<number, string> = {
        0: 'brouillon',
        1: 'publier',
        2: 'en_attente',
        3: 'attribuer',
        4: 'clos',
        5: 'annule',
      };
      return numericMap[numeric] ?? '';
    }

    const normalized = statut
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');

    const statusMap: Record<string, string> = {
      brouillon: 'brouillon',
      publier: 'publier',
      publie: 'publier',
      publiee: 'publier',
      en_attente: 'en_attente',
      attribuer: 'attribuer',
      attribue: 'attribuer',
      attribuee: 'attribuer',
      clos: 'clos',
      cloture: 'clos',
      cloturer: 'clos',
      annule: 'annule',
      annulee: 'annule',
      annuler: 'annule',
    };

    return statusMap[normalized] ?? '';
  }

  private isCloturerAction(status: string | null | undefined): boolean {
    if (!status) return false;
    return status
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .includes('clotur');
  }
}
