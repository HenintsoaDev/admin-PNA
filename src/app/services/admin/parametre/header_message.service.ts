import { Injectable } from "@angular/core";
import { HttpService } from "app/services/http.service";
import { environment } from "environments/environment";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class HeaderMessageService {

    constructor(private httpService: HttpService) {}

    sendNewHeaderMessage(data: any): Observable<any> {
        return this.httpService.post<any>(environment.header_message, data).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    sendUpdateHeaderMessage(data: any): Observable<any> {
        return this.httpService.put<any>(environment.header_message + '/' + data.id, data).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    deleteHeaderMessage(id: number): Observable<any> {
        return this.httpService.delete<any>(environment.header_message + '/' + id).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

    changeStateHeaderMessage(data: any, state: number): Observable<any> {
        return this.httpService.get<any>(environment.header_message + '/' + data.rowid + '/state/' + state + '?state=' + state).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }
}