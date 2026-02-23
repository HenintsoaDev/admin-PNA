import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import {delay, mergeMap, materialize, dematerialize, tap} from 'rxjs/operators';
import { Router } from '@angular/router';
import {ToastrService} from "ngx-toastr";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private toast:ToastrService,private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;


    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize())
      .pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        const uri = window.location.href.split('/').reverse()[0];
        if(event.body.code == 401  &&  uri !== 'login'&&  uri !== 'logout'){
          this.toast.warning(event.body.msg  || "Veuillez vous reconnecter votre session est exprirer","Erreur");
         return  this.router.navigate(['/login']);
        }else if(event.body.code == 503   ){
          this.toast.warning((event.body.msg ),"Erreur");
         // return  this.router.navigate(['/app']);
        }
        if(event.status !== 200){
          this.toast.warning("Une erreur interne s'est produite","Erreur");
        }

        /*if(uri.indexOf('auth/refresh') ==-1 && url.indexOf(environment.baseUrl) !== -1  &&  uri !== 'login'&&  uri !== 'logout'){
          //this.auth.refreshToken().then(r => console.log());
        }*/

      }
      return event
    }))

    function handleRoute() {
      return next.handle(request);
    }
  }
}
