import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { SoumissionService } from 'app/services/boutique/fournisseurs/soumission.service';
import { AppelOffreService } from 'app/services/boutique/fournisseurs/appel-offre.service';
import { PassageService } from 'app/services/table/passage.service';
import { soumission, soumissionPj } from 'shared/interfaces/soumission';
import { environment } from 'environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

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
      nomColonne: this.__('soumissions.appel_offre'),
       colonneTable: 'reference',
      table: 'appel_offre'
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
    { name: 'appel_offre.reference', type: 'text' },
    { name: 'fournisseur', type: 'text' },
    { name: 'montant', type: 'montant' },
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
    },
  ];

  searchGlobal = [
    'soumission.reference',
    'appel_offre.titre',
    'appel_offre.reference',
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
      else if (event.data.action === 'validation') this.validateSoumission(this.idSoumission);
      else if (event.data.action === 'rejeter') this.rejectSoumission(this.idSoumission);

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

  getSoumissionStatusLabel(statut: any): string {
    const key = this.soumissionService.normalizeStatusKey(statut);
    return key ? this.__(`soumissions.status.${key}`) : (statut ?? '-');
  }

  getSoumissionStatusBadgeClass(statut: any): string {
    const key = this.soumissionService.normalizeStatusKey(statut);
    return key ? `so-status-${key}` : 'so-status-soumise';
  }

  getSoumissionStatusDotClass(statut: any): string {
    const key = this.soumissionService.normalizeStatusKey(statut);
    return key ? `so-dot-${key}` : 'so-dot-soumise';
  }

  getHistoriqueUserLabel(h: any): string {
    const user = h?.user_responsable;
    return user?.nom || user?.email || this.__('soumissions.systeme');
  }

  getDocuments(s: soumission | null): soumissionPj[] {
    return (s?.pieceJointe ?? []) as soumissionPj[];
  }

  getDocTypeClass(typeDocument: any): string {
    const t = String(typeDocument ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');

    if (t.includes('tech')) return 'so-doc-type-technique';
    if (t.includes('fin')) return 'so-doc-type-financier';
    if (t.includes('admin')) return 'so-doc-type-administratif';
    return 'so-doc-type-neutral';
  }

  getDocIconClass(typeDocument: any): string {
    const t = String(typeDocument ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');

    if (t.includes('tech')) return 'fa fa-book';
    if (t.includes('fin')) return 'fa fa-money';
    if (t.includes('admin')) return 'fa fa-paperclip';
    return 'fa fa-file';
  }

  canValidate(s: soumission | null): boolean {
    const key = this.soumissionService.normalizeStatusKey(s?.statut as any);
    return !!s?.id && key === 'en_evaluation';
  }

  canReject(s: soumission | null): boolean {
    const key = this.soumissionService.normalizeStatusKey(s?.statut as any);
    return !!s?.id && (key === 'soumise' || key === 'en_evaluation');
  }

  canPasserEnEvaluation(s: soumission | null): boolean {
    const key = this.soumissionService.normalizeStatusKey(s?.statut as any);
    return !!s?.id && key === 'soumise';
  }

  passerEnEvaluation(id: number): void {
    if (!id) return;

    Swal.fire({
      title: this.__('global.confirmation'),
      text: `${this.__('soumissions.passer_en_evaluation')} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.__('global.oui_changer'),
      cancelButtonText: this.__('global.cancel'),
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'swal-button--confirm-custom',
        cancelButton: 'swal-button--cancel-custom'
      }
    }).then(result => {
      if (!result.isConfirmed) return;

      this.soumissionService.mettreEnAttente(id).subscribe({
        next: (res) => {
          const data: any = (res as any)?.data ?? res;
          const code = (res as any)?.code;

          if (code === undefined || code === 200 || code === 201 || code === 205) {
            this.toastr.success((res as any)?.msg ?? this.__('global.success'), this.__('global.success'));
            if (this.soumission?.id === id && data) this.soumission = data as soumission;
            this.passageService.appelURL('');
          } else {
            this.toastr.error((res as any)?.msg ?? this.__('global.error'), this.__('global.error'));
          }
        },
        error: () => {
          this.toastr.error(this.__('global.error'), this.__('global.error'));
        }
      });
    });
  }

  validateSoumission(id: number): void {
    if (!id) return;

    Swal.fire({
      title: this.__('global.confirmation'),
      text: this.__('global.valider_?'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.__('global.oui_valider'),
      cancelButtonText: this.__('global.cancel'),
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'swal-button--confirm-custom',
        cancelButton: 'swal-button--cancel-custom'
      }
    }).then(result => {
      if (!result.isConfirmed) return;

      this.soumissionService.ValidateSoumission(id).subscribe({
        next: (res) => {
          const data: any = (res as any)?.data ?? res;
          const code = (res as any)?.code;

          if (code === undefined || code === 200 || code === 201 || code === 205) {
            this.toastr.success((res as any)?.msg ?? this.__('global.success'), this.__('global.success'));
            if (this.soumission?.id === id && data) this.soumission = data as soumission;
            this.passageService.appelURL('');
          } else {
            this.toastr.error((res as any)?.msg ?? this.__('global.error'), this.__('global.error'));
          }
        },
        error: () => {
          this.toastr.error(this.__('global.error'), this.__('global.error'));
        }
      });
    });
  }

  rejectSoumission(id: number): void {
    if (!id) return;

    Swal.fire({
      title: this.__('global.confirmation'),
      text: `${this.__('global.rejeter')} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.__('global.oui_supprimer'),
      cancelButtonText: this.__('global.cancel'),
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'swal-button--confirm-custom',
        cancelButton: 'swal-button--cancel-custom'
      }
    }).then(result => {
      if (!result.isConfirmed) return;

      this.soumissionService.RejeterSoumission(id).subscribe({
        next: (res) => {
          const code = (res as any)?.code;
          if (code === undefined || code === 200 || code === 201 || code === 205) {
            this.toastr.success((res as any)?.msg ?? this.__('global.success'), this.__('global.success'));
          } else {
            this.toastr.error((res as any)?.msg ?? this.__('global.error'), this.__('global.error'));
            return;
          }
          if (this.soumission?.id === id) this.closeModal();
          this.passageService.appelURL('');
        },
        error: () => {
          this.toastr.error(this.__('global.error'), this.__('global.error'));
        }
      });
    });
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
