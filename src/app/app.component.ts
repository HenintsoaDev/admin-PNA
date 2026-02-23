import { Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as e from 'express';
import { filter } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from './services/auth.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    showLayout: boolean = true;
    showBreadcrumb = true;
    showSidebar = true;

    sidebar: HTMLElement | null = null
    @ViewChild('sidebarAppMenu') menuSideBar!: ElementRef<HTMLElement>;
    @ViewChild('navBarAppMenu') menuNavBar!: ElementRef<HTMLElement>;
    isMenuSidebarOpen = false;
  
    // Gère les clics partout sur le document
    @HostListener('document:click', ['$event.target'])
    async onClick(target: HTMLElement): Promise<void> {
        
        const sidebar = document.getElementsByClassName("sidebar")[0] as HTMLElement;
        if ($(window).width() > 991) {return;}
        if (!sidebar.classList.contains("hidden")) this.isMenuSidebarOpen = true; else this.isMenuSidebarOpen = false;      

        const clickedInside = this.menuSideBar.nativeElement.contains(target);
        const clickedNavBar = this.menuNavBar.nativeElement.contains(target);

        if(clickedNavBar)
        {return}

        if(!clickedInside){
            sidebar.classList.add("hidden");
            this.isMenuSidebarOpen = false;
        }
    }

    
    constructor(private router: Router,private activatedRoute: ActivatedRoute, private auth: AuthService) {
        this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
            const currentRoute = this.router.url;
           
            // Get the current activated route
            // and traverse to the deepest child route
            let currentRoutes =  this.activatedRoute;
            while (currentRoutes.firstChild) {
                currentRoutes = currentRoutes.firstChild;
            }

            // Check if the current route has a data property : is404
            const is404 = currentRoutes.snapshot.data['is404'] === true;
            this.showLayout = !(currentRoute === '/login');
            this.showSidebar = !(currentRoute === '/home' || is404);
            this.showBreadcrumb = !(currentRoute === '/login' || currentRoute === '/home' || is404);
        });
    }

    ngOnInit(): void{
        //console.log=function (){};
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
