import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpService } from '../../http.service';
import { soumission, statut_soumission } from 'shared/interfaces/soumission';

@Injectable({
  providedIn: 'root'
})
export class SoumissionService {
  constructor(private httpService: HttpService) {}

  getDetailsSoumission(id: number): Observable<{ data: soumission } | soumission> {
    return this.httpService.get<{ data: soumission } | soumission>(`${environment.soumission}/${id}`);
  }

  mettreEnAttente(id: number): Observable<{ data: soumission } | soumission> {
    return this.httpService.put<{ data: soumission } | soumission>(`${environment.soumission}/${id}/en_attente`, '');
  }

  ValidateSoumission(id: number): Observable<{ data: soumission } | soumission> {
    return this.httpService.put<{ data: soumission } | soumission>(`${environment.soumission}/${id}/valider`, '');
  }

  RejeterSoumission(id: number): Observable<{ data: soumission } | soumission> {
    return this.httpService.delete<{ data: soumission } | soumission>(`${environment.soumission}/${id}`);
  }

  public normalizeStatusKey(statut: string | null | undefined): string {
    if (statut === null || statut === undefined) return '';

    const numeric = Number(statut);
    if (!Number.isNaN(numeric)) {
      const numericMap: Record<number, string> = {
        0: 'soumise',
        1: 'en_evaluation',
        2: 'acceptee',
        3: 'rejetee',
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
      soumise: 'soumise',
      en_evaluation: 'en_evaluation',
      en_evaluation_: 'en_evaluation',
      accepte: 'acceptee',
      acceptee: 'acceptee',
      accepteee: 'acceptee', // tolère la faute dans l'enum
      rejete: 'rejetee',
      rejetee: 'rejetee',
    };

    // Support des valeurs de l'enum si on reçoit "Soumise" / "En_Evaluation" / ...
    const enumValues = Object.values(statut_soumission).map(v => String(v).toLowerCase());
    if (enumValues.includes(normalized)) {
      return statusMap[normalized] ?? '';
    }

    return statusMap[normalized] ?? '';
  }
}
