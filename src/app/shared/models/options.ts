import {HttpHeaders} from "@angular/common/http";
import { environment } from "environments/environment.prod";

export const valuesys = {
    httpOptions : {
        headers: new HttpHeaders({
            'Content-Type':  'application/json; charset=utf-8',
            'lang':  localStorage.getItem('lang') || "fr",
            'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        })
    },
    httpAuthOptions : () => {
        return {
            headers: new HttpHeaders({
                'Authorization' :"Bearer " + localStorage.getItem(environment.authItemName) || '',
                'lang':  localStorage.getItem('lang') || "fr",
                'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
                'Pragma': 'no-cache',
                'Expires': '0'
            }),
        }
    },
    httpAuthOptionsNoJson : () => {
        return {
            headers: new HttpHeaders({
                'Authorization' :"Bearer " + localStorage.getItem(environment.authItemName) || '',
                'lang':  localStorage.getItem('lang') || "fr",
                'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
                'Pragma': 'no-cache',
                'Expires': '0'
            }),
        }
    },
    httpAuthOptionsProcess : (prodess = '') => {
        return {
            headers: new HttpHeaders({
                'Content-Type':  'application/json; charset=utf-8',
                'Authorization' :"Bearer " + localStorage.getItem(environment.authItemName) || '',
                'lang':  localStorage.getItem('lang') || "fr",
                'process': "1",
                'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
                'Pragma': 'no-cache',
                'Expires': '0'
            }),
        }
    },
    authRefreshInterval: (5 * 60 * 1000 ),//5 mm,
    timeTokenName: "_phco_time_token"

};