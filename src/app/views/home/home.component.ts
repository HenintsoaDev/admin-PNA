import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { Auth, module_user } from 'app/shared/models/db';
import { MenuService, RouteInfo, ROUTES } from 'app/shared/models/route-info';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { HttpService } from '../../services/http.service';
import { environment } from 'environments/environment.prod';
import { tap } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent extends Translatable implements OnInit {

    routes: RouteInfo[] = ROUTES;
    public user    : Auth = new Auth();
    public modules : module_user [] = [];
    loading : boolean = false;

    constructor(
        private auth: AuthService, 
        private router: Router, 
        private menuService: MenuService,
        private httpService: HttpService
    ) {
        super();
    }

    async ngOnInit() {
        this.user = <Auth> await  this.auth.getLoginUser();
        this.modules = this.user.modules;
        this.modules =this.modules.filter(_=>( _.hasOneSubModuleAction && _.state == 1)  || (this.user.info.admin === 1 && _.state == 1) );
        this.routes = this.menuService.getCurrentMenuItems();
        this.routes =this.routes.filter(_=>( _.hasOneSubModuleAction && _.state == 1)  || (this.user.info.admin === 1 && _.state == 1) );


    }

    getMenuChildrenByPath(parentPath: string): any[] {
        const parent = ROUTES.find(route => route.path === parentPath);
        return parent?.children || [];
    }
 
    goTo(module : string, pathSelected)
    {
        this.loading = true;
        sessionStorage.removeItem('message-header');
        this.httpService.get(environment.header_message + module + "/display_message").pipe(
            tap(response => {
                //console.log("response XHR", response);
                if (response['code'] === 200) {
                    if(response['data'].length > 0){
                        let message = "";
                        for(let i = 0; i < response['data'].length; i++) {
                            message += '<b>' + response['data'][i]['expediteur'] + '</b>' + ': ' + response['data'][i]['txt_messenger'];
                            message += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;****&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                        }
                        sessionStorage.setItem('message-header', message);
                    }
                }else if (response['code'] === 401 && response['msg'].includes("reconnecter")) {
                    return this.router.navigate(['/login']);
                }else{
                    console.log("xxx", response['msg'].includes("reconnecter"));
                }
                this.menuService.updateMenuItems(module);
                this.menuService.setMenuItemsModule(module);
                this.router.navigate(['/app-module', module.replace('/','')]);
            })
        ).subscribe();
        
    }

    goToLogin()
    {
        Swal.fire({
            title: 'Déconnexion',
            text: 'Voulez-vous vraiment vous déconnecter ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, déconnexion',
            cancelButtonText: 'Annuler',
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal-button--confirm-custom',
                cancelButton: 'swal-button--cancel-custom'
            },
            }).then((result) => {
            if (result.isConfirmed) {
                this.auth.logout();
            }
        });
    }

    

}
