
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { environment } from 'environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Translatable } from 'shared/constants/Translatable';
import { Subscription } from 'rxjs';
import { AuthService } from 'app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { dr } from 'shared/interfaces/adm/dr';
import { PassageService } from 'app/services/table/passage.service';
import { DirectionRegionalesService } from 'app/services/admin/parametre/direction-regionales.service';

@Component({
  selector: 'app-direction-regional',
  templateUrl: './direction-regional.component.html',
  styleUrls: ['./direction-regional.component.scss']
})
export class DirectionRegionalComponent extends Translatable implements OnInit {


  @ViewChild('addDrModal') addDr: TemplateRef<any> | undefined;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private PassageService: PassageService,
    private DirectionRegionalesService: DirectionRegionalesService

  ) {
    super();
  }

  dr: dr;
  endpoint: string;
  subscription: Subscription;
  bsModalRef: BsModalRef;
  titleModal: string;
  header = [

    // code regional
    {
      "nomColonne": this.__('direction_regionales.code'),
      "colonneTable": "code",
      "table": "dr",
    },
    {
      "nomColonne": this.__('direction_regionales.name'),
      "colonneTable": "libelle",
      "table": "dr",

    },
    {
      "nomColonne": this.__('global.action')
    }

  ];

  objectBody = [

    {
      "name": "code",
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
      'autority': 'PRM_59',
    },
    {
      'icon': 'delete',
      'action': 'delete',
      'tooltip': this.__('global.tooltip_delete'),
      'autority': 'PRM_61',
    },
    {
      'icon': 'state',
      'autority': 'PRM_60',
    },

  ];

  searchGlobal = [
    'dr.libelle',
    'dr.code',
  ];

  drForm: FormGroup;
  idDirection: number;
  listDr: dr[] = [];

  async ngOnInit() {

    this.authService.initAutority("PRM", "ADM");
    // 
    this.PassageService.appelURL(null);
    this.endpoint = environment.baseUrl + '/' + environment.direction_regional;
  }


  // initialize form for dr
  initializeForm() {
    this.drForm = this.fb.group({
      libelle: ['', Validators.required],
      code: ['', [Validators.required]],
    });
  }

  patchValue() {
    this.drForm.patchValue({
      libelle: this.dr.libelle,
      code: this.dr.code,
    });
  }

  EventListener(data: any) {
    if (data) {
      this.idDirection = data.id;
      console.log(data.id, data.action, data.state);

      if (data.action == 'edit') { this.openModal(); }
      else if (data.action == 'delete') { this.deleteDr(); }
      else if (data.state == 0 || data.state == 1) { this.updateState(); }

      // Nettoyage immédiat de l'event
      // this.passageService.clear();  // ==> à implémenter dans ton service
    }
  }

  getData(): dr {
    const storedData = localStorage.getItem('data');
    let result: any;
    if (storedData) result = JSON.parse(storedData);
    const res = result.data.find((item) => {
      return item.id == this.idDirection
    });

    return res;
  }

  onSubmit() {
    if (this.drForm.valid) {
      if (this.idDirection != null) {
        this.dr = this.getData();
        // this.dr.id = this.idDirection;
        // patch dr value from form
        this.dr.libelle = this.drForm.value.libelle;
        this.dr.code = this.drForm.value.code;
        this.DirectionRegionalesService.updateDirection(this.dr).subscribe(
          {
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
                })
              }
            }
          }
        );
      } else {
        this.DirectionRegionalesService.createDirection(this.drForm.value).subscribe(
          {
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
          }
        )
      }
    }
  }

  updateState(){
    this.dr = this.getData();

    console.log("update state", this.dr);
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
           this.dr.state = this.dr.state == 0 ? 1 : 0;
           this.DirectionRegionalesService.updateState(this.dr).subscribe({
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
                })
              }
            }
          }) 
        }
    })
  }

  deleteDr() {
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
        this.DirectionRegionalesService.deleteDirection(this.idDirection, this.dr).subscribe(
          {
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
          }
        )
      }
    })
  }

  refreshData() {
    this.PassageService.appelURL('');
  }

  openModal() {
    this.initializeForm();
    this.titleModal = this.__('direction_regionales.title_add_modal');
    if (this.idDirection) {
      this.dr = this.getData();
      this.patchValue();
      this.titleModal = this.__('direction_regionales.title_edit_modal');
    }
    this.bsModalRef = this.modalService.show(
      this.addDr,
      { class: 'modal-lg', backdrop: "static" }
    );
  }

  closeModal() {
    this.bsModalRef.hide();
    this.idDirection = null;
    this.drForm.reset();
  }

}


