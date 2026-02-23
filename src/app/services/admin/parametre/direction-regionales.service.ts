import { HttpService } from 'app/services/http.service';
import { Injectable } from '@angular/core';
import { dr } from 'shared/interfaces/adm/dr';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DirectionRegionalesService {

  constructor(
    private HttpService: HttpService
  ) { }

  createDirection(dr: dr): Observable<any> {
    return this.HttpService.post<any>(environment.direction_regional, dr).pipe(
      tap(response => {
        if (response['code'] === 200) {
          console.log("DR créée avec succès", response);
          // Vous pouvez ajouter ici des notifications ou autres traitements
        }
      }),
      catchError(error => {
        console.error("Erreur lors de la création de la DR", error);
        throw error; // Pensez à gérer l'erreur globalement ou ici
      })
    );
  }

  /**
   * Met à jour une direction régionale existante
   * @param dr L'objet DR à mettre à jour
   * @returns Observable de la réponse
   */
  updateDirection(dr: dr): Observable<any> {
    console.log(dr);
    if (!dr.id) {
      throw new Error("L'ID de la DR est requis pour la mise à jour");
    }

    return this.HttpService.put<any>(`${environment.direction_regional}/${dr.id}`, dr).pipe(
      tap(response => {
        if (response['code'] === 200) {
          console.log("DR mise à jour avec succès", response);
          // Vous pouvez ajouter ici des notifications ou autres traitements
        }
      }),
      catchError(error => {
        console.error("Erreur lors de la mise à jour de la DR", error);
        throw error;
      })
    );
  }

  /**
   * Supprime une direction régionale
   * @param id L'ID de la DR à supprimer
   * @returns Observable de la réponse
   */
  deleteDirection(id: number, dr: dr): Observable<any> {
    if (!id) {
      throw new Error("L'ID de la DR est requis pour la suppression");
    }

    return this.HttpService.put<any>(`${environment.direction_regional}/delete/${id}`, dr).pipe(
      tap(response => {
        if (response['code'] === 200) {
          console.log("DR supprimée avec succès", response);
          // Vous pouvez ajouter ici des notifications ou autres traitements
        }
      }),
      catchError(error => {
        console.error("Erreur lors de la suppression de la DR", error);
        throw error;
      })
    );
  }

  updateState(dr: dr): Observable<any> {
    return this.HttpService.put<any>(`${environment.direction_regional}/ ${dr.id} /state/${dr.state}`, dr).pipe(
      tap(response => {
        if (response['code'] === 200) {
          console.log("DR mise à jour avec succès", response);
          // Vous pouvez ajouter ici des notifications ou autres traitements
        }
      }),
      catchError(error => {
        console.error("Erreur lors de la mise à jour de la DR", error);
        throw error;
      })
    );
  }

}
