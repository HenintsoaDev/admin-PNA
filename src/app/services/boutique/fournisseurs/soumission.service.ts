import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpService } from '../../http.service';
import { soumission } from 'shared/interfaces/soumission';

@Injectable({
  providedIn: 'root'
})
export class SoumissionService {
  constructor(private httpService: HttpService) {}

  getDetailsSoumission(id: number): Observable<{ data: soumission } | soumission> {
    return this.httpService.get<{ data: soumission } | soumission>(`${environment.soumission}/${id}`);
  }
}
