import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';
import { Auth } from 'app/shared/models/db';
import { ToastrService } from 'ngx-toastr';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent extends Translatable implements OnInit {
  passwordForm: FormGroup;

  showPassword: boolean = false;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  public user: Auth = new Auth();

  constructor(private authService: AuthService, private toastr: ToastrService) {
    super()
  }

  async ngOnInit() {
    this.user = <Auth>await this.authService.getLoginUser();
    this.initializeForm();
  }

  initializeForm(): void {
    this.passwordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.strongPasswordValidator()
      ]),
      confirmNewPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator });
  }

  // Custom strong password validator
  strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

      return !passwordValid ? { strongPassword: true } : null;
    };
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmNewPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }


  onResetPassword() {

    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.invalid) {
      this.toastr.error(this.__("global.form_error"), this.__("global.error"));
      return;
    } else {
      Swal.fire({
        title: this.__("global.confirmation"),
        text: this.__("global.modifier_mdp_?"),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.__("global.oui_modifier"),
        cancelButtonText: this.__("global.cancel"),
        allowOutsideClick: false,
        customClass: {
          confirmButton: 'swal-button--confirm-custom',
          cancelButton: 'swal-button--cancel-custom'
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.authService.resetPassword({ old_password: this.passwordForm.value.oldPassword, new_password: this.passwordForm.value.newPassword }).subscribe({
            next: (res) => {

              if (res['code'] == 200) {
                this.toastr.success(res['msg'], this.__("global.success"));
                this.authService.logout();
              } else {
                this.toastr.error(res['msg'], this.__("global.error"));
              }
            },
            error: (err) => {
              this.toastr.error(this.__("global.connection_echec"), 'Erreur');
            }
          });
        }
      });
    }
  }

}
