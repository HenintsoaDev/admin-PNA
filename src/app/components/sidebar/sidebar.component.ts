import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import Swal from 'sweetalert2';
import { MenuService, RouteInfo, ROUTES } from 'app/shared/models/route-info';
import { AuthService } from 'app/services/auth.service';
import { Auth, utilisateur } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { Translatable } from 'shared/constants/Translatable';
import { RouteService } from '../route.service';

declare const $: any;


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    animations: [
        trigger('toggleSubMenu', [
            state('open', style({ height: '*' })),
            transition('void => *', [
                style({ height: 0, opacity: 0 }),
                animate('75ms ease-out', 
                style({ height: '*', opacity: 1 }))
            ]),
            transition('* => void', [
                style({ height: '*', opacity: 1 }),
                animate('75ms ease-in', 
                style({ height: 0, opacity: 0 }))
            ])
        ])
    ]
})
export class SidebarComponent extends Translatable implements OnInit {
    activeMenu: string | null = null;
    currentRoute: string = '';
    userMenuUserActive: boolean = false;
    isSidebarOpen : boolean = true;
    sidebar: HTMLElement | null = null
    @ViewChild('sidebarAppMenu') menuSideBar!: ElementRef<HTMLElement>;
    isMenuSidebarOpen = false;
    showLayout = true;
    routes: RouteInfo[] = ROUTES;
    //isModule:boolean = false;

    public user  : Auth = new Auth();

    // Gère les clics partout sur le document
    @HostListener('document:click', ['$event.target'])
    onClick(target: HTMLElement): void {

        if ($(window).width() > 991) {return;}
        if (!this.isMenuSidebarOpen) return;

        const clickedInside = this.menuSideBar.nativeElement.contains(target);
        
        if (!clickedInside) {
            this.sidebar.classList.add("hidden");
            this.isMenuSidebarOpen = false;
        }
    }

    constructor(private authService: AuthService, private router: Router,private cdr: ChangeDetectorRef, private menuService: MenuService, private routeService: RouteService) {
        super();
        this.router.events.subscribe(() => {
            this.currentRoute = this.router.url;
            this.userMenuUserActive = (this.currentRoute === '/my-profil' );
        });
    }

    async ngOnInit() {

        this.user = <Auth> await  this.authService.getLoginUser();
        this.sidebar = document.getElementsByClassName("sidebar")[0] as HTMLElement;
        this.toggleSidebarEvent(); 
      
        this.routeService.activeRoute$.subscribe(path => {
            const menuSelectedModule = localStorage.getItem(environment.menuItemsSelectedStorage);
            if(menuSelectedModule)
            {
                const parsedMenuItems = JSON.parse(menuSelectedModule);
                this.routes = parsedMenuItems;
            }
    
            console.log("passer ici?", path);
            this.updateActiveRoutes(path);
          });
          
    }

    goToPage(url,module){
        this.menuService.updateMenuItems(module);
        this.routes = this.menuService.getCurrentMenuItems();
        this.router.navigate([url]);
        this.cdr.detectChanges();
    }

    getMenuChildrenByPath(parentPath: string): any[] {
        const parent = ROUTES.find(route => route.path === parentPath);
        return parent?.children || [];
    }

    @HostListener('window:resize', [])
    onResize() {
        this.toggleSidebarEvent();
    }

    updateActiveRoutes(pathFromNavbar?: string) {
        const currentUrl = pathFromNavbar || this.router.url;
        console.log("currentUrl", currentUrl);
        console.log("currentUrl", currentUrl);

        this.routes = this.routes.map(route => {
          const isParentInUrl = currentUrl.startsWith(route.path);
          route.class = isParentInUrl ? 'activeModule' : '';
          route.showChildrenClass = isParentInUrl ? 'show' : '';
          if (route.children) {
            route.children = route.children.map(child => ({
              ...child,
              class: currentUrl === `${route.path}${child.path}` ? 'active' : ''
            }));
          }
          return route;
        });

        console.log("route?" , this.routes);
      }

    toggleSidebarEvent() {
        if (this.sidebar) {
            if (window.innerWidth < 991) this.sidebar.classList.add("hidden"); else this.sidebar.classList.remove("hidden");
        }
    }

    isMobileMenu() {
        if ($(window).width() > 991) {return false;}
        return true;
    };

    toggleMenu(title: string) {
        this.activeMenu = this.activeMenu === title ? null : title;
    }

    isMenuOpen(title: string): boolean {
        return this.activeMenu === title;
    }

    toggleSidebar(){
        const sidebar = document.getElementsByClassName("sidebar")[0] as HTMLElement;
        const mainPanel = document.getElementsByClassName("main-panel")[0] as HTMLElement;
        
        if (sidebar) {
            if (!sidebar.classList.contains("hidden")) {
                sidebar.classList.add("hidden");
                mainPanel.classList.add("full-main-panel")
            } else {
                sidebar.classList.remove("hidden");
                mainPanel.classList.remove("full-main-panel");
            }
        }
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    goTo(module : string, pathSelected)
    {
        this.router.navigate(['/'+module],{
            state: { modules : module,selectedRoute: pathSelected }
        });
    }

    goToProfil()
    {
        this.router.navigate(['/my-profil']);
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
            customClass: {
                confirmButton: 'swal-button--confirm-custom',
                cancelButton: 'swal-button--cancel-custom'
            },
            allowOutsideClick: false,
            }).then((result) => {
            if (result.isConfirmed) {

                this.authService.logout();
            }
        });
    }
}
