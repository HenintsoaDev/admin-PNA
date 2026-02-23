import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { valuesys } from 'app/shared/models/options';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {


    constructor(private http: HttpClient) {}

    /*private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('access_token');
        console.log('Token:', token);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }*/

    get<T>(endpoint: string): Observable<T> {
        return this.http.get<T>(`${environment.baseUrl}/${endpoint}`, valuesys.httpAuthOptions() );
    }

    post<T>(endpoint: string, data: any): Observable<T> {
        return this.http.post<T>(`${environment.baseUrl}/${endpoint}`, data, valuesys.httpAuthOptions() );
    }

    put<T>(endpoint: string, data: any): Observable<T> {
        return this.http.put<T>(`${environment.baseUrl}/${endpoint}`, data, valuesys.httpAuthOptions() );
    }

    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${environment.baseUrl}/${endpoint}`, valuesys.httpAuthOptions() );
    }
    
    patch<T>(endpoint: string, data : any): Observable<T> {
        return this.http.patch<T>(`${environment.baseUrl}/${endpoint}`, data, valuesys.httpAuthOptions() );
    }

  
}