import { Injectable } from '@angular/core';
import { region } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { Observable, tap, catchError } from 'rxjs';
import { HttpService } from 'app/services/http.service';
@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor(private HttpService: HttpService) { }
  
  createRegion(region: region): Observable<any> {
    return this.HttpService.post<any>(environment.region, region).pipe(
      tap(response => {
        if (response['code'] === 200 || response['code'] === 201) {
          console.log("Région créée avec succès", response);
        }
      }),
      catchError(error => {
        console.error("Erreur lors de la création de la région", error);
        throw error;
      })
    );
  }

  /**
   * Met à jour une région existante
   * @param region L'objet région à mettre à jour
   * @returns Observable de la réponse
   */
  updateRegion(region: region): Observable<any> {
    if (!region.id) {
      throw new Error("L'ID de la région est requis pour la mise à jour");
    }

    return this.HttpService.put<any>(`${environment.region}/${region.id}`, region).pipe(
      tap(response => {
        if (response['code'] === 200 || response['code'] === 201) {
          console.log("Région mise à jour avec succès", response);
        }
      }),
      catchError(error => {
        console.error("Erreur lors de la mise à jour de la région", error);
        throw error;
      })
    );
  }

  /**
   * Supprime une région (soft delete)
   * @param id L'ID de la région à supprimer
   * @param region L'objet région avec les données à jour
   * @returns Observable de la réponse
   */
  deleteRegion(id: number, region: region): Observable<any> {
    if (!id) {
      throw new Error("L'ID de la région est requis pour la suppression");
    }

    return this.HttpService.delete<any>(`${environment.region}/delete/${id}`).pipe(
      tap(response => {
        if (response['code'] === 200 || response['code'] === 205) {
          console.log("Région supprimée avec succès", response);
        }
      }),
      catchError(error => {
        console.error("Erreur lors de la suppression de la région", error);
        throw error;
      })
    );
  }

  /**
   * Met à jour l'état d'une région (activation/désactivation)
   * @param region L'objet région avec le nouvel état
   * @returns Observable de la réponse
   */
  updateState(region: region): Observable<any> {
    if (!region.id) {
      throw new Error("L'ID de la région est requis pour changer l'état");
    }

    return this.HttpService.put<any>(`${environment.region}/${region.id}/state/${region.state}`, region).pipe(
      tap(response => {
        if (response['code'] === 200 || response['code'] === 201) {
          console.log("État de la région mis à jour avec succès", response);
        }
      }),
      catchError(error => {
        console.error("Erreur lors du changement d'état de la région", error);
        throw error;
      })
    );
  }

  /**
   * Récupère la liste des régions
   * @returns Observable de la liste des régions
   */
  getRegions(): Observable<region[]> {
    return this.HttpService.get<region[]>(environment.region).pipe(
      catchError(error => {
        console.error("Erreur lors de la récupération des régions", error);
        throw error;
      })
    );
  }

}
