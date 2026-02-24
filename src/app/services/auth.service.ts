import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { environment } from 'environments/environment';
import { valuesys } from 'app/shared/models/options';
import { Auth } from 'app/shared/models/db';
import { Router } from '@angular/router';
import { MenuService } from 'app/shared/models/route-info';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private httpService: HttpService,private  router: Router,private menuService: MenuService) {}

    login(credentials: { identifiant: string, password: string }): Observable<any> {
        return this.http.post<any>(`${environment.login}`, $.param(credentials),{
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Accept', 'application/json').set('X-Client-ID', 'app_pf'),
            withCredentials: true
        }).pipe(
            tap(response => {
                console.log('Login response:', response['data']['access_token']);
                if (response['code'] === 200 || response['code'] === 403) {
                    localStorage.setItem(environment.authItemName, response['data']['access_token']);
                    this.setToken(response['data']['access_token'], response['data']['expires_in']);
                }
            })
        );
    }

    me() {

        return this.httpService.get<any>(environment.userAuth).pipe(
            tap(async response => {
                console.log('User info response:', response);
                if (response['code'] === 200) {
                    this.menuService.setRoutes(response['data']['modules']);
                    //this.initAutority(response['data']['sous_module'],response['data']['module']);
                    await this.setLoginUser(response['data']);
                    //await this.setToken(response['data']['access_token'], response['data']['expires_in']);
                }
            })
        );
    }

    public async  getLoginUser(reload:boolean = false){
        try {
            let user ={};
            if(reload || !localStorage.getItem(environment.userItemName)){
                const res = await this.http.get<any>(environment.baseUrl + environment.userAuth, valuesys.httpAuthOptions()).toPromise() ;
                if(res.code === 200){
                    user = res.data ;
                    this.setLoginUser(user) ;
                }else {
                    await  this.router.navigate(["/login"])
                }
            }
            user = <Auth> JSON.parse(localStorage.getItem(environment.userItemName) || null);
            return user;
        } catch (e) {
            await  this.router.navigate(["/login"]) ;
            return null ;
        } 
    }

    /*
    * Code sous module un tableau ou un string | le premier element du tableau on ne renseigne pas son code de module
    * Mais le reste du table on doit renseignez leur code de module dans modules
    * */
    public initAutority(codeSousModule:string|Array<string>,modules:string|Array<string> = []){
        if(typeof codeSousModule === 'string'){
            codeSousModule = [codeSousModule]
        }

        if(typeof modules === 'string'){
            modules = [modules]
        }
        
        //modules.push(window['moduleSelected'])
        window['authority'] =[];
        window['actions'] = null;
        /*window['authority']['module'] = modules;
        
        window['authority']['sous_module'] = codeSousModule;*/
        localStorage.setItem(environment.authorityModule, JSON.stringify(modules));
        localStorage.setItem(environment.authoritySousModule, JSON.stringify(codeSousModule));
        let user:Auth ;
        user = <Auth> JSON.parse(localStorage.getItem(environment.userItemName) || null);
        window['authority']['user'] = user;
    }

    public setToken(token:string,expires_in:number){

        localStorage.setItem(environment.authItemName, token);
        const t = new Date();
        t.setSeconds(t.getSeconds() + (expires_in));
        localStorage.setItem(valuesys.timeTokenName, t.getTime() + "");
    }

    /*async refreshToken(){
        setTimeout(async ()=>{
            if(AuthService.refresh()){
            let {data,code} = await this.http.get(environment.baseUrl+environment.refresh,valuesys.httpAuthOptions()).toPromise();
            if(code === 200){
                this.setToken(data.access_token,data.expires_in)
            }
            }
        },70) 
    }*/

    private static refresh(){
        const timeToken_ =  +window.localStorage.getItem(valuesys.timeTokenName) || 0;
            const now = (new Date()).getTime();
            console.log((timeToken_ - now) / 1000 );
        return timeToken_ - now   <= valuesys.authRefreshInterval;
    }

    private async setLoginUser(user:any){
        try {
            if(user){
                localStorage.setItem(environment.userItemName, JSON.stringify(user));
                return  true  
            }
            return false ;
        } catch (e) {
            return  false ;
        } 
    } 

    resetPassword(credentials: { old_password: string, new_password: string }): Observable<any> {
        return this.httpService.post<any>(`parametrage/user/updateUserPassword`, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    localStorage.setItem(environment.authItemName, response['data']['access_token']);
                }
            })
        );
    }

    async logout() {
        const res = await this.http.get<any>(environment.logout, valuesys.httpAuthOptions()).toPromise() ;
        if(res['code'] === 200){
            localStorage.removeItem(environment.menuItemsSelectedStorage);
            localStorage.removeItem(environment.menuItemsStorage);
            localStorage.removeItem(environment.userAuth);
            localStorage.removeItem(environment.authItemName);
            localStorage.removeItem(environment.userItemName);
            localStorage.removeItem(environment.phcoTimeToken);
            this.router.navigate(['/login']);
        }
        
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    public async getSelectList(endpoint:string,text: any = "",id:string="id"){
        const res:any = await this.http.get<any>(`${environment.baseUrl}/${endpoint}`,valuesys.httpAuthOptions()).toPromise();
        const data  = res.data ;
        
        return data ; 
      }

      downloadPdf(source, fileName) {
        const link = document.createElement("a");
        link.href = source;
        link.download = `${fileName}.pdf`
        link.click();
      }


      async exportPdf(entities: Array<object>,title:string,url='') {
    
        try {
            console.log("----");
            title = title  ||  "Liste";
            const res = await this.http.post(url || environment.exportPdf , {data: entities,'title' : title}, valuesys.httpAuthOptions()).toPromise();
          
            this.downloadPdf(res['data'],title);
      
            //window['download'](res['data'], title+ '.pdf', 'application/pdf');
      
            
      
            return res
            console.log('respdf')
          } catch (e) {
            console.log(e)
          }
        }
      
        async exportExcel(entities: Array<object>,title:string,url='') {
          try {
            title = title  ||  "Liste";
            const res:any = await this.http.post(url || environment.exportExcel , {data: entities,'title' : title}, valuesys.httpAuthOptions()).toPromise();
            return res;
          } catch (e) {
            console.log(e)
          }
        }
  
        
}