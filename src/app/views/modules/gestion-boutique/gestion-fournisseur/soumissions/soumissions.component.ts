import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { SoumissionService } from 'app/services/boutique/fournisseurs/soumission.service';
import { AppelOffreService } from 'app/services/boutique/fournisseurs/appel-offre.service';
import { PassageService } from 'app/services/table/passage.service';
import { soumission } from 'shared/interfaces/soumission';
import { environment } from 'environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-soumissions',
  templateUrl: './soumissions.component.html',
  styleUrls: ['./soumissions.component.scss']
})
export class SoumissionsComponent extends Translatable implements OnInit, OnDestroy {
  modalRef?: BsModalRef;
  endpoint = '';

  header = [
    {
      nomColonne: this.__('soumissions.reference'),
      colonneTable: 'reference',
      table: 'soumission'
    },
    {
      nomColonne: this.__('soumissions.fournisseur'),
      colonneTable: 'fournisseur',
      table: 'soumission'
    },
    {
      nomColonne: this.__('soumissions.montant'),
      colonneTable: 'montant',
      table: 'soumission'
    },
    {
      nomColonne: this.__('soumissions.delai'),
      colonneTable: 'delai',
      table: 'soumission'
    },
    {
      nomColonne: this.__('soumissions.date_soumission'),
      colonneTable: 'date_soumission',
      table: 'soumission'
    },
    {
      nomColonne: this.__('soumissions.statut'),
      colonneTable: 'statut',
      table: 'soumission'
    },
    {
      nomColonne: this.__('global.action')
    }
  ];

  objetBody = [
    { name: 'reference', type: 'text' },
    { name: 'fournisseur', type: 'text' },
    { name: 'montant', type: 'montant' },
    { name: 'delai', type: 'text' },
    { name: 'date_soumission', type: 'date' },
    { name: 'statut', type: 'statut' },
    { name: 'id' }
  ];

  listIcon = [
    {
      icon: 'info',
      action: 'detail',
      tooltip: this.__('global.tooltip_detail'),
      autority: 'PAC_7'
    }
  ];

  searchGlobal = [
    'soumission.reference',
    'soumission.fournisseur',
    'soumission.statut'
  ];

  soumission: soumission | null = null;
  idSoumission!: number;
  titleModal = '';
  appelOffreDetail: any = null;
  appelOffreTitleModal = '';
  appelOffreModalRef?: BsModalRef;
  tableTypeFormatters: Record<string, (value: any) => string> = {};
  tableTypeStyleResolvers: Record<string, (value: any) => { [key: string]: string } | ''> = {};

  @ViewChild('detailsoumission') detailsoumission!: TemplateRef<any>;
  @ViewChild('detailappeloffreModal') detailappeloffreModal!: TemplateRef<any>;

  private subscription?: Subscription;

  constructor(
    private passageService: PassageService,
    private authService: AuthService,
    private modalService: BsModalService,
    private soumissionService: SoumissionService,
    private appelOffreService: AppelOffreService,
    private toastr: ToastrService
  ) {
    super();
  }

  ngOnInit(): void {
    this.authService.initAutority('PAC', 'ADM');
    this.titleModal = this.__('soumissions.title_detail_modal');
    this.initTableStatusRender();

    this.endpoint = `${environment.baseUrl}/${environment.soumission}`;
    this.passageService.appelURL(null, this.endpoint);

    this.subscription = this.passageService.getObservable().subscribe(event => {
      if (!event?.data) return;
      this.idSoumission = event.data.id;

      if (event.data.action === 'detail') this.openModalDetailSoumission();

      this.passageService.clear();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  openModalDetailSoumission(): void {
    this.titleModal = this.__('soumissions.title_detail_modal');

    this.soumissionService.getDetailsSoumission(this.idSoumission).subscribe({
      next: (res) => {
        const data = (res as any)?.data ?? res;
        this.soumission = data as soumission;
        this.modalRef = this.modalService.show(this.detailsoumission, {
          class: 'modal-xl',
          backdrop: 'static',
          keyboard: false
        });
      },
      error: () => {}
    });
  }

  closeModal(): void {
    this.modalRef?.hide();
  }

  openAppelOffre(id: number): void {
    if (!id) return;

    this.appelOffreTitleModal = this.__('appel_offres.title_detail_modal');
    this.appelOffreService.getDetailsAppelOffre(id).subscribe({
      next: (res) => {
        const data = (res as any)?.data ?? res;
        this.appelOffreDetail = data;
        this.appelOffreModalRef = this.modalService.show(this.detailappeloffreModal, {
          class: 'modal-xl',
          backdrop: 'static',
          keyboard: false
        });
      },
      error: () => {
        this.toastr.error(this.__('global.tableError'), this.__('global.error'));
      }
    });
  }

  closeAppelOffreModal(): void {
    this.appelOffreModalRef?.hide();
  }

  private initTableStatusRender(): void {
    this.tableTypeFormatters = {
      statut: (value: any) => {
        const key = this.soumissionService.normalizeStatusKey(value);
        return key ? this.__(`soumissions.status.${key}`) : (value ?? '');
      }
    };

    this.tableTypeStyleResolvers = {
      statut: (value: any) => {
        const key = this.soumissionService.normalizeStatusKey(value);
        if (!key) return '';

        const colorMap: Record<string, string> = {
          soumise: '#0d6efd',        // bleu
          en_evaluation: '#f0ad4e',  // orange
          acceptee: '#5cb85c',       // vert
          rejetee: '#d9534f'         // rouge
        };
        const bg = colorMap[key] ?? '#6c757d';

        return {
          'color': 'white',
          'background-color': bg,
          'font-weight': 'bold',
          'padding': '5px',
          'border-radius': '5px',
        };
      }
    };
  }

}
