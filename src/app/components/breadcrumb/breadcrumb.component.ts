import { Component, Input, OnInit } from '@angular/core';
import { BreadcrumbService } from 'app/services/breadcrumb.service';
import { WalletService } from 'app/services/changementSolde.service';
import { Translatable } from 'shared/constants/Translatable';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent extends Translatable implements OnInit {

    walletSolde: string = "0";
    carteSolde: string = "0";

    constructor(public breadcrumbService: BreadcrumbService, private walletService: WalletService) { 
        super();
    }

    ngOnInit(): void {

        this.walletService.walletCarte$.subscribe(value => {

            this.walletSolde = value.walletSolde;
            this.carteSolde = value.carteSolde;
          });


    
        
        /*this.soldeService.walletSolde$.subscribe(value => {
            this.walletSolde = value;
        });
      
        this.soldeService.carteSolde$.subscribe(value => {
            this.carteSolde = value;
        });*/
    }

    goTo(){
      
    }

}
