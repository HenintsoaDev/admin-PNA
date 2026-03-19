import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';
import { AppelOffrePayload, AppelOffrePayloadLine, AppelOffreService } from 'app/services/boutique/fournisseurs/appel-offre.service';
import { ProduitService } from 'app/services/boutique/produits/produit.service';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import moment from 'moment';

type AppelOffreRow = Partial<AppelOffrePayload> & {
  id?: number;
  reference?: string;
  statut?: string;
  date_publication?: string;
  date_creation?: string;
  date_modification?: string;
  createur?: any;
  lignes?: any[];
};

type AppelOffreLineDraft = {
  produit: any;
  produit_id: number;
  quantite_demandee: number;
  designation: string;
  specifications: string;
};

@Component({
  selector: 'app-appel-offre',
  templateUrl: './appel-offre.component.html',
  styleUrls: ['./appel-offre.component.scss']
})
export class AppelOffreComponent extends Translatable implements OnInit, OnDestroy {
  modalRef?: BsModalRef;
  endpoint = '';
  isStatusChanging = false;

  header = [
    {
      nomColonne: this.__('appel_offres.reference'),
      colonneTable: 'reference',
      table: 'appel_offre'
    },
    {
      nomColonne: this.__('appel_offres.titre'),
      colonneTable: 'titre',
      table: 'appel_offre'
    },
    {
      nomColonne: this.__('appel_offres.date_publication'),
      colonneTable: 'date_publication',
      table: 'appel_offre'
    },
    {
      nomColonne: this.__('appel_offres.date_limite_soumission'),
      colonneTable: 'date_limite_soumission',
      table: 'appel_offre'
    },
    {
      nomColonne: this.__('appel_offres.nombre_lignes'),
      colonneTable: 'nombre_lignes',
      table: 'appel_offre'
    },
    {
      nomColonne: this.__('appel_offres.statut'),
      colonneTable: 'statut',
      table: 'appel_offre'
    },
    {
      nomColonne: this.__('global.action')
    }
  ];

  objetBody = [
    { name: 'reference', type: 'text' },
    { name: 'titre', type: 'text' },
    { name: 'date_publication', type: 'date' },
    { name: 'date_limite_soumission', type: 'date' },
    { name: 'nombre_lignes', type: 'text' },
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
    {
      icon: 'edit',
      action: 'edit',
      tooltip: this.__('global.tooltip_edit'),
      autority: 'PAC_9'
    },
    {
      icon: 'delete',
      action: 'delete',
      tooltip: this.__('global.tooltip_delete'),
      autority: 'PAC_10'
    }
  ];

  searchGlobal = [
    'appel_offre.reference',
    'appel_offre.titre',
    'appel_offre.statut'
  ];

  appelOffreForm!: FormGroup;
  appelOffre: AppelOffreRow = {};
  idAppelOffre!: number;
  titleModal = '';
  currentStep = 1;
  tableTypeFormatters: Record<string, (value: any) => string> = {};
  tableTypeStyleResolvers: Record<string, (value: any) => { [key: string]: string } | ''> = {};

  productQuery = '';
  productQty: number = 1;
  productDesignation = '';
  productSpecifications = '';
  foundProducts: any[] = [];
  selectedProduct: any = null;
  lignesDraft: AppelOffreLineDraft[] = [];
  private productSearchTimer?: any;

  @ViewChild('addappeloffre') addappeloffre!: TemplateRef<any>;
  @ViewChild('detailappeloffre') detailappeloffre!: TemplateRef<any>;

  private subscription?: Subscription;

  constructor(
    private passageService: PassageService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private appelOffreService: AppelOffreService,
    private produitService: ProduitService
  ) {
    super();
  }

  ngOnInit(): void {
    this.authService.initAutority('PAC', 'ADM');

    this.endpoint = `${environment.baseUrl}/${environment.appel_offre}`;

    // Force un chargement initial du tableau (et fixe l'endpoint côté table si nécessaire).
    this.passageService.appelURL(null, this.endpoint);

    this.titleModal = this.__('appel_offres.title_add_modal');
    this.initForm();
    this.initTableStatusRender();

    this.subscription = this.passageService.getObservable().subscribe(event => {
      if (!event?.data) return;

      this.idAppelOffre = event.data.id;

      if (event.data.action === 'edit') this.openModalEditAppelOffre();
      else if (event.data.action === 'delete') this.openModalDeleteAppelOffre();
      else if (event.data.action === 'detail') this.openModalDetailAppelOffre();

      this.passageService.clear();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  initForm(): void {
    this.appelOffreForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      date_publication: ['', Validators.required],
      date_limite_soumission: ['', Validators.required]
    });
  }

  openModalAdd(): void {
    this.titleModal = this.__('appel_offres.title_add_modal');
    this.appelOffre = {};
    this.currentStep = 1;
    this.initForm();
    this.appelOffreForm.patchValue({
      date_publication: this.getNowDatetimeLocal()
    });

    this.modalRef = this.modalService.show(this.addappeloffre, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    });
    this.resetStep2Draft();
  }

  openModalEditAppelOffre(): void {
    this.titleModal = this.__('appel_offres.title_edit_modal');

    this.loadDetailsAndSetState(this.idAppelOffre, (data) => {
      this.appelOffre = data;
      this.currentStep = 1;

      this.initForm();
      this.appelOffreForm.patchValue({
        titre: this.appelOffre.titre ?? '',
        description: this.appelOffre.description ?? '',
        date_publication: this.toDatetimeLocalValue(this.appelOffre.date_publication ?? ''),
        date_limite_soumission: this.toDatetimeLocalValue(this.appelOffre.date_limite_soumission ?? '')
      });
      this.lignesDraft = this.appelOffre.lignes ?? [];

      this.modalRef = this.modalService.show(this.addappeloffre, {
        class: 'modal-xl',
        backdrop: 'static',
        keyboard: false
      });
      this.resetStep2Draft();
      this.initDraftFromExistingLines();
    });
  }

  openModalDetailAppelOffre(): void {
    this.titleModal = this.__('appel_offres.title_detail_modal');

    this.loadDetailsAndSetState(this.idAppelOffre, (data) => {
      this.appelOffre = data;
      this.modalRef = this.modalService.show(this.detailappeloffre, {
        class: 'modal-xl',
        backdrop: 'static',
        keyboard: false
      });
    });
  }

  openModalDeleteAppelOffre(): void {
    Swal.fire({
      title: this.__('global.confirmation'),
      text: this.__('global.supprimer_donnee_?'),
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

      this.appelOffreService.supprimerAppelOffre(this.idAppelOffre).subscribe({
        next: res => {
          if (res?.code === 205 || res?.code === 200) {
            this.toastr.success(res?.msg, this.__('global.success'));
            this.actualisationTableau();
          } else {
            this.toastr.error(res?.msg, this.__('global.error'));
          }
        },
        error: () => {}
      });
    });
  }

  onSubmit(): void {
    if (this.appelOffreForm.invalid) return;

    const payload: AppelOffrePayload = {
      ...this.appelOffreForm.value,
      date_publication: this.toBackendDateTime(this.appelOffreForm.value.date_publication),
      date_limite_soumission: this.toBackendDateTime(this.appelOffreForm.value.date_limite_soumission),
      lignes: this.lignesDraft.map((l): AppelOffrePayloadLine => ({
        produit_id: l.produit_id,
        quantite_demandee: l.quantite_demandee,
        designation: l.designation,
        specifications: l.specifications
      }))
    };

    const isEdit = !!this.appelOffre?.id;
    const msg = isEdit ? this.__('global.modifier_donnee_?') : this.__('global.enregistrer_donnee_?');
    const msgBtn = isEdit ? this.__('global.oui_modifier') : this.__('global.oui_enregistrer');

    Swal.fire({
      title: this.__('global.confirmation'),
      text: msg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: msgBtn,
      cancelButtonText: this.__('global.cancel'),
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'swal-button--confirm-custom',
        cancelButton: 'swal-button--cancel-custom'
      }
    }).then(result => {
      if (!result.isConfirmed) return;

      const req$ = isEdit && this.appelOffre.id
        ? this.appelOffreService.modifierAppelOffre(this.appelOffre.id, payload)
        : this.appelOffreService.ajoutAppelOffre(payload);

      req$.subscribe({
        next: res => {
          if (res?.code === 201 || res?.code === 200) {
            this.toastr.success(res?.msg, this.__('global.success'));
            this.actualisationTableau();
            this.closeModal();
          } else if (res?.code === 400) {
            this.toastr.error(res?.data ?? res?.msg, this.__('global.error'));
          } else {
            this.toastr.error(res?.msg, this.__('global.error'));
          }
        },
        error: () => {}
      });
    });
  }

  private loadDetailsAndSetState(id: number, onLoaded: (data: AppelOffreRow) => void): void {
    if (!id) return;

    this.appelOffreService.getDetailsAppelOffre(id).subscribe({
      next: res => {
        const data: AppelOffreRow = res?.data ?? res;
        if (!data) {
          this.toastr.error(this.__('global.tableError'), this.__('global.error'));
          return;
        }
        onLoaded(data);
      },
      error: () => {
        this.toastr.error(this.__('global.tableError'), this.__('global.error'));
      }
    });
  }

  actualisationTableau(): void {
    this.passageService.appelURL('');
  }

  closeModal(): void {
    this.currentStep = 1;
    this.resetStep2Draft();
    this.modalRef?.hide();
  }

  nextStep(): void {
    this.appelOffreForm.markAllAsTouched();
    if (this.appelOffreForm.invalid) return;

    this.currentStep = 2;
  }

  prevStep(): void {
    this.currentStep = 1;
  }

  goToStep(step: number): void {
    if (step === 1) {
      this.prevStep();
      return;
    }
    if (step === 2) {
      this.nextStep();
    }
  }

  onProductQueryChange(value: string): void {
    this.productQuery = value;
    this.selectedProduct = null;

    if (this.productSearchTimer) clearTimeout(this.productSearchTimer);
    this.productSearchTimer = setTimeout(() => {
      const q = (this.productQuery ?? '').trim();
      if (q.length < 2) {
        this.foundProducts = [];
        return;
      }

      this.produitService.findProductByName(q, 1, 10).subscribe({
        next: (res) => {
          const data = res?.data ?? res;
          this.foundProducts = data?.data ?? data ?? [];
        },
        error: () => {
          this.foundProducts = [];
        }
      });
    }, 250);
  }

  selectProduct(p: any): void {
    this.selectedProduct = p;
    this.productQuery = p?.nom_commercial || p?.dci || p?.code || '';
    this.productDesignation = p?.nom_commercial || p?.dci || p?.code || '';
    this.productSpecifications = '';
    this.foundProducts = [];
  }

  addLineDraft(): void {
    if (!this.selectedProduct?.id) return;
    const qty = Number(this.productQty);
    if (!qty || qty <= 0) return;
    const designation = (this.productDesignation ?? '').trim();
    const specifications = (this.productSpecifications ?? '').trim();
    if (!designation) return;

    const existing = this.lignesDraft.find(l => l.produit_id === this.selectedProduct.id);
    if (existing) {
      existing.quantite_demandee += qty;
      existing.designation = designation;
      existing.specifications = specifications;
    } else {
      this.lignesDraft.push({
        produit: this.selectedProduct,
        produit_id: this.selectedProduct.id,
        quantite_demandee: qty,
        designation,
        specifications
      });
    }

    this.selectedProduct = null;
    this.productQuery = '';
    this.productQty = 1;
    this.productDesignation = '';
    this.productSpecifications = '';
  }

  removeLineDraft(index: number): void {
    this.lignesDraft.splice(index, 1);
  }

  updateQuantity(line: AppelOffreLineDraft, delta: number): void {
    if (!line) return;
    const next = Number(line.quantite_demandee ?? 0) + Number(delta ?? 0);
    line.quantite_demandee = Math.min(1000, Math.max(1, next));
  }

  onQuantityChange(line: AppelOffreLineDraft, value: any): void {
    if (!line) return;
    const parsed = Number(`${value}`.replace(/[^\d]/g, ''));
    if (!parsed || parsed < 1) {
      line.quantite_demandee = 1;
      return;
    }
    line.quantite_demandee = Math.min(1000, parsed);
  }

  private resetStep2Draft(): void {
    this.productQuery = '';
    this.productQty = 1;
    this.productDesignation = '';
    this.productSpecifications = '';
    this.foundProducts = [];
    this.selectedProduct = null;
    this.lignesDraft = [];
  }

  private initDraftFromExistingLines(): void {
    const lines = (this.appelOffre?.lignes ?? []) as any[];
    if (!lines?.length) return;

    this.lignesDraft = lines.map((l: any) => ({
      produit: l.produit ?? { id: l.produit_id, nom_commercial: l.designation, code: null },
      produit_id: l.produit_id,
      quantite_demandee: Number(l.quantite_demandee ?? 1),
      designation: l.designation ?? (l.produit?.nom_commercial || l.produit?.dci || l.produit?.code || ''),
      specifications: l.specifications ?? ''
    }));
  }

  private toBackendDateTime(value: string): string {
    if (!value) return '';

    // datetime-local (no seconds)
    if (value.includes('T') && value.length === 16) {
      const m = moment(value, 'YYYY-MM-DDTHH:mm', true);
      return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : value;
    }

    // datetime-local (with seconds)
    if (value.includes('T') && value.length === 19) {
      const m = moment(value, 'YYYY-MM-DDTHH:mm:ss', true);
      return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : value;
    }

    // backend formats
    const backend = moment(value, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm', moment.ISO_8601], true);
    return backend.isValid() ? backend.format('YYYY-MM-DD HH:mm:ss') : value;
  }

  private toDatetimeLocalValue(value: string): string {
    if (!value) return '';

    const m = moment(value, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm', moment.ISO_8601], true);
    return m.isValid() ? m.format('YYYY-MM-DDTHH:mm') : value;
  }

  private getNowDatetimeLocal(): string {
    return moment().format('YYYY-MM-DDTHH:mm');
  }

  private initTableStatusRender(): void {
    this.tableTypeFormatters = {
      statut: (value: any) => {
        const key = this.normalizeStatusKey(value);
        return key ? this.__(`appel_offres.status.${key}`) : (value ?? '');
      }
    };

    this.tableTypeStyleResolvers = {
      statut: (value: any) => {
        const key = this.normalizeStatusKey(value);
        if (!key) return '';

        const colorMap: Record<string, string> = {
          brouillon: '#6c757d',     // gris
          publier: '#0d6efd',       // bleu
          en_attente: '#f0ad4e',    // orange
          attribuer: '#6f42c1',     // violet
          clos: '#5cb85c',          // vert
          annule: '#d9534f'         // rouge
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

  get nextStatusLabel(): string {
    const key = this.getNextStatusKey(this.appelOffre?.statut);
    return key ? this.__(`appel_offres.status.${key}`) : '';
  }

  canGoNextStatus(): boolean {
    if (!this.appelOffre?.id) return false;
    return !!this.getNextStatusKey(this.appelOffre?.statut);
  }

  getStatusLabel(statut: any): string {
    const key = this.normalizeStatusKey(statut);
    return key ? this.__(`appel_offres.status.${key}`) : (statut ?? '-');
  }

  getStatusBadgeClass(statut: any): string {
    const key = this.normalizeStatusKey(statut);
    return key ? `ao-status-${key}` : 'ao-status-brouillon';
  }

  goNextStatus(): void {
    if (!this.appelOffre?.id) return;
    const current = this.appelOffre?.statut ?? '';
    const nextKey = this.getNextStatusKey(current);
    if (!nextKey) return;

    Swal.fire({
      title: this.__('global.confirmation'),
      text: `${this.__('appel_offres.next_status')} : ${this.__(`appel_offres.status.${nextKey}`)}`,
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

      this.isStatusChanging = true;
      this.appelOffreService.NextStatus(this.appelOffre!.id!, current).subscribe({
        next: (res) => {
          this.isStatusChanging = false;
          if (res?.code === 200 || res?.code === 201 || res?.code === 205) {
            this.toastr.success(res?.msg ?? this.__('global.success'), this.__('global.success'));
            this.appelOffre.statut = nextKey;
            this.actualisationTableau();
          } else {
            this.toastr.error(res?.msg ?? this.__('global.error'), this.__('global.error'));
          }
        },
        error: () => {
          this.isStatusChanging = false;
          this.toastr.error(this.__('global.error'), this.__('global.error'));
        }
      });
    });
  }

  private getNextStatusKey(statut: any): string {
    const key = this.normalizeStatusKey(statut);
    switch (key) {
      case 'brouillon':
        return 'publier';
      case 'publier':
        return 'en_attente';
      case 'en_attente':
        return 'attribuer';
      case 'attribuer':
        return 'clos';
      default:
        return '';
    }
  }

  private normalizeStatusKey(statut: string | null | undefined): string {
    if (statut === null || statut === undefined) return '';

    const numeric = Number(statut);
    if (!Number.isNaN(numeric)) {
      const numericMap: Record<number, string> = {
        0: 'brouillon',
        1: 'publier',
        2: 'en_attente',
        3: 'attribuer',
        4: 'clos',
        5: 'annule',
      };
      return numericMap[numeric] ?? '';
    }

    const normalized = statut
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');

    const statusMap: Record<string, string> = {
      brouillon: 'brouillon',
      publier: 'publier',
      publie: 'publier',
      publiee: 'publier',
      en_attente: 'en_attente',
      attribuer: 'attribuer',
      attribue: 'attribuer',
      attribuee: 'attribuer',
      clos: 'clos',
      close: 'clos',
      cloturer: 'clos',
      cloture: 'clos',
      annule: 'annule',
      annulee: 'annule',
    };

    return statusMap[normalized] ?? '';
  }

}
