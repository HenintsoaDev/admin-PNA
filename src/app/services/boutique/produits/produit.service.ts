import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { produit } from 'app/shared/models/db';
import { HttpService } from '../../http.service';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

    constructor(private httpService: HttpService) {}

    getproduitActive() : Observable<any> {
        return this.httpService.get<any>(environment.liste_module_active);
    }

    ajoutproduit(credentials: produit): Observable<any> {
        
        return this.httpService.post<any>(environment.produit, credentials);
    }
    modifierproduit(credentials: produit): Observable<any> {
        
        return this.httpService.put<any>(environment.produit + '/' + credentials.id, credentials);
    }

    supprimerproduit(id): Observable<any> {
        
        return this.httpService.delete<any>(environment.produit + '/' + id,);
    }

    changementStateproduit(data, state): Observable<any> {
        
        return this.httpService.put<any>(environment.produit + '/' + data.id + '/state/' + state , '');
    }

    ajoutImageProduit(credentials: any): Observable<any> {
        
        return this.httpService.post<any>(environment.images_produits, credentials);
    }

    ajoutFicheTechniqueProduit(credentials: any): Observable<any> {
        
        return this.httpService.post<any>(environment.fiche_techniques, credentials);
    }


    supprimerImageproduit(id): Observable<any> {
        
        return this.httpService.delete<any>(environment.images_produits + '/' + id,);
    }

    supprimerFicheproduit(id): Observable<any> {
        
        return this.httpService.delete<any>(environment.fiche_techniques + '/' + id,);
    }



    findProductByName(name: string, page: number = 1, perPage: number = 10): Observable<any> {
        const safeName = encodeURIComponent(name ?? '');
        const where = `produit.nom_commercial|l|${safeName}`;
        return this.httpService.get<any>(`${environment.produit}?page=${page}&where=${where}&per_page=${perPage}`);
    }
   
}
