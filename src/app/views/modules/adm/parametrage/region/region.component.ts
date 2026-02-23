import { DRService } from 'app/services/admin/parametre/dr.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegionService } from 'app/services/admin/parametre/region.service';
import { AuthService } from 'app/services/auth.service';
import { PassageService } from 'app/services/table/passage.service';
import { region } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import { dr } from 'shared/interfaces/adm/dr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent extends Translatable implements OnInit {


  @ViewChild('addRegionModal') addRegionModal: TemplateRef<any> | undefined;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private passageService: PassageService,
    private regionService: RegionService,
    private DRService: DRService
  ) {
    super();
  }
  listDr: dr[] = [];
  filteredDr: dr[] = [];
  region: region;
  endpoint: string;
  subscription: Subscription;
  bsModalRef: BsModalRef;
  titleModal: string;
  header = [
    {
      "nomColonne": this.__('region.code'),
      "colonneTable": "lib2",
      "table": "region",
    },
    {
      "nomColonne": this.__('region.region'),
      "colonneTable": "lib_region",
      "table": "region",
    },
    {
      "nomColonne": this.__('region.direction_regionale'),
      "colonneTable": "libelle",
      "table": "dr",
    },
    {
      "nomColonne": this.__('global.action')
    }
  ];

  objectBody = [
    {
      "name": "lib2",
      "type": "text",
    },
    {
      "name": "lib_region",
      "type": "text",
    },
    {
      "name": "libelle",
      "type": "text",
    },
    { "name": 'state#id' }
  ];

  listIcon = [
    {
      'icon': 'edit',
      'action': 'edit',
      'tooltip': this.__('global.tooltip_edit'),
      'autority': 'PRM_64', // Remplacez par le bon code d'autorité
    },
    {
      'icon': 'delete',
      'action': 'delete',
      'tooltip': this.__('global.tooltip_delete'),
      'autority': 'PRM_66', // Remplacez par le bon code d'autorité
    },
    {
      'icon': 'state',
      'autority': 'PRM_65', // Remplacez par le bon code d'autorité
    },
  ];

  searchGlobal = [
    'dr.libelle',
    'region.lib_region',
    'region.lib2',
  ];

  regionForm: FormGroup;
  idRegion: number;
  listRegions: region[] = [];

  async ngOnInit() {
    this.authService.initAutority("PRM", "ADM");
    this.passageService.appelURL(null);
    this.endpoint = environment.baseUrl + '/' + environment.region;
    this.getListDr();
  }

  initializeForm() {
    this.regionForm = this.fb.group({
      lib2: ['', [Validators.required, Validators.maxLength(4)]],
      lib_region: ['', Validators.required],
      dr_id: ['', Validators.required],
      searchDr: [''],
    });
    this.regionForm.get('searchDr').valueChanges.subscribe(value => {
      if (value == '') {
        this.filteredDr = this.listDr;
      } else {
        this.filteredDr = this.listDr.filter((item) => {
          return item.libelle.toLowerCase().includes(value.toLowerCase())
        });
      }
    });
  }

  patchValue() {
    this.regionForm.patchValue({
      lib2: this.region.lib2,
      lib_region: this.region.lib_region,
      dr_id: this.region.dr_id,
    });
  }

  EventListener(data: any) {
    if (data) {
      this.idRegion = data.id;
      console.log(data.id, data.action, data.state);

      if (data.action == 'edit') { this.openModal(); }
      else if (data.action == 'delete') { this.deleteRegion(); }
      else if (data.state == 0 || data.state == 1) { this.updateState(); }
    }
  }

  getData(): region {
    const storedData = localStorage.getItem('data');
    let result: any;
    if (storedData) result = JSON.parse(storedData);
    const res = result.data.find((item) => {
      return item.id == this.idRegion
    });
    return res;
  }

  onSubmit() {
    if (this.regionForm.valid) {
      if (this.idRegion != null) {
        this.region = this.getData();
        this.region = {
          ...this.region,
          ...this.regionForm.value
        }
        this.regionService.updateRegion(this.region).subscribe({
          next: (response) => {
            if (201 === response.code) {
              this.toastr.success(response.msg, this.__('global.success'), {
                timeOut: 3000,
                enableHtml: true,
              });
              this.refreshData();
              this.bsModalRef.hide();
            } else {
              this.toastr.error(response.msg, this.__('global.error'), {
                timeOut: 3000,
                enableHtml: true,
              });
            }
          }
        });
      } else {
        this.region = this.regionForm.value;
        this.regionService.createRegion(this.regionForm.value).subscribe({
          next: (response) => {
            if (201 === response.code) {
              this.toastr.success(response.msg, this.__('global.success'), {
                timeOut: 3000,
                enableHtml: true,
              });
              this.refreshData();
              this.bsModalRef.hide();
            } else {
              this.toastr.error(response.msg, this.__('global.error'), {
                timeOut: 3000,
                enableHtml: true,
              });
            }
          }
        });
      }
    }
  }

  updateState() {
    this.region = this.getData();

    Swal.fire({
      title: this.__("global.confirmation"),
      text: this.__("global.changer_state_?"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.__("global.oui_changer"),
      cancelButtonText: this.__("global.cancel"),
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'swal-button--confirm-custom',
        cancelButton: 'swal-button--cancel-custom'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.region.state = this.region.state == 0 ? 1 : 0;
        this.regionService.updateState(this.region).subscribe({
          next: (response) => {
            if (201 == response.code) {
              this.toastr.success(response.msg, this.__('global.success'), {
                timeOut: 3000,
                enableHtml: true,
              });
              this.refreshData();
              this.bsModalRef.hide();
            } else {
              this.toastr.error(response.msg, this.__('global.error'), {
                timeOut: 3000,
                enableHtml: true,
              });
            }
          }
        });
      }
    });
  }

  deleteRegion() {
    Swal.fire({
      title: this.__("global.confirmation"),
      text: this.__("global.supprimer_donnee_?"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.__("global.oui_supprimer"),
      cancelButtonText: this.__("global.cancel"),
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'swal-button--confirm-custom',
        cancelButton: 'swal-button--cancel-custom'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.regionService.deleteRegion(this.idRegion, this.region).subscribe({
          next: (response) => {
            if (response.code == 205) {
              this.toastr.success(response.msg, this.__('global.success'), {
                timeOut: 3000,
                enableHtml: true,
              });
              this.refreshData();
              this.bsModalRef.hide();
            } else {
              this.toastr.error(response.msg, this.__('global.error'), {
                timeOut: 3000,
                enableHtml: true,
              });
            }
          }
        });
      }
    });
  }

  refreshData() {
    this.passageService.appelURL('');
  }

  openModal() {
    this.initializeForm();
    this.titleModal = this.__('region.title_add_modal');
    if (this.idRegion) {
      this.region = this.getData();
      this.patchValue();
      this.titleModal = this.__('region.title_edit_modal');
    }
    this.bsModalRef = this.modalService.show(
      this.addRegionModal,
      { backdrop: "static" }
    );
  }

  getListDr() {
    this.DRService.getListDR().subscribe({
      next: (response) => {
        if (response.code == 200) {
          this.listDr = response.data;
          this.filteredDr = this.listDr;
        }
      }
    });
  }

  closeModal() {
    this.bsModalRef.hide();
    this.idRegion = null;
    this.regionForm.reset();
  }

}
