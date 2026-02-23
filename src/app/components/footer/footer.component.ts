import { Component, OnInit } from '@angular/core';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent  extends Translatable implements OnInit {
    test : Date = new Date();
    
    constructor() {
      super();
    }

    ngOnInit() {
    }

}
