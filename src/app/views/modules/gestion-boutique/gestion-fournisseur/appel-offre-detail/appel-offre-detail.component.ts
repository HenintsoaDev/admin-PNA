import { AppelOffreService } from 'app/services/boutique/fournisseurs/appel-offre.service';
import { Component, Input } from '@angular/core';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-appel-offre-detail',
  templateUrl: './appel-offre-detail.component.html',
  styleUrls: ['./appel-offre-detail.component.scss']
})
export class AppelOffreDetailComponent extends Translatable {

  @Input() appelOffre: any;

  constructor(
    private AppelOffreService: AppelOffreService
  ) {
    super();
  }

  getStatusLabel(statut: any): string {
    const key = this.AppelOffreService.normalizeStatusKey(statut);
    return key ? this.__(`appel_offres.status.${key}`) : (statut ?? '-');
  }

}
