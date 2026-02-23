import { environment } from "environments/environment";
import { HttpService } from "./http.service";
import { tap } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
    
export class RessourceService {

    constructor(private httpService: HttpService) { }
    
    getListType() {
        return this.httpService.get<any>(environment.listetype).pipe(
            tap(response => {
                if (response['code'] !== 200) {
                    console.error("Error fetching resource:", response);
                }
            })
        );
    }

    getServiceProduct() {
        return this.httpService.get<any>(environment.service_product).pipe(
            tap(response => {
                if (response['code'] !== 200) {
                    console.error("Error fetching resource:", response);
                }
            })
        );
    }

    getListAgent(idAgent) {
        return this.httpService.get<any>(environment.liste_utilisateur_active + "?where=user.fk_agence|e|" + idAgent).pipe(
            tap(response => {
                if (response['code'] !== 200) {
                    console.error("Error fetching resource:", response);
                }
            })
        );
    }

    getListPartenaire() {
        return this.httpService.get<any>(environment.liste_partenaire).pipe(
            tap(response => {
                if (response['code'] !== 200) {
                    console.error("Error fetching resource:", response);
                }
            })
        );
    }

}