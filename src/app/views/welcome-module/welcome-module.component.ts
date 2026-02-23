import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-welcome-module',
  templateUrl: './welcome-module.component.html',
  styleUrls: ['./welcome-module.component.scss']
})
export class WelcomeModuleComponent extends Translatable implements OnInit{

    nameModule = '';

    constructor(private router: Router,private route: ActivatedRoute) {
        super();
    }

    ngOnInit(): void {
        const module: string = this.route.snapshot.paramMap.get('module');
        window['moduleSelected'] = module;
        const storedMenuItems = localStorage.getItem(environment.menuItemsStorage);
        this.nameModule = storedMenuItems ? JSON.parse(storedMenuItems).find((item: any) => item.path === "/" + module)?.title : '';
    }

}
