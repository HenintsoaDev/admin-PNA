import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { Translatable } from 'shared/constants/Translatable';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SoldeService } from 'app/services/solde.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends Translatable implements OnInit {

    login = '';
    password = '';
    isResetPasswort: boolean = false;
    oldPassword = '';
    newPassword = '';
    confirmNewPassword = '';

    showPassword:boolean = false;
    showOldPassword:boolean = false;
    showNewPassword:boolean = false;
    showConfirmPassword:boolean = false;
    loginForm: FormGroup;
    submitted = false;
    loadingLogin = false;

    constructor(private authService: AuthService, private router: Router, private toastr: ToastrService,private fb: FormBuilder, private soldeService: SoldeService
        ) {
        super();

        this.loginForm = this.fb.group({
            login: ['', [Validators.required]],
            password: ['', [Validators.required]]
          });
    }

    ngOnInit(): void {}

    onLogin() {
        this.submitted = true;
        if (this.loginForm.valid) {
            this.loadingLogin = true;
            this.authService.login({ login: this.login, password: this.password }).subscribe({
                next: (res) => {
                    if(res['code'] == 200) {
                        this.authService.me().subscribe({
                            next: (res) => {
                                if(res['code'] == 200) {

                                    this.soldeService.getSoldeUser().subscribe({
                                        next: (res) => {
                                            if(res['code'] == 200) {
                                                this.loadingLogin = false;    
                                                this.router.navigate(['/home']);
                                                this.toastr.success(this.__("global.connecter"), this.__("global.success"));
                                            }
                                        }
                                    });

                                }
                            }
                        })
                    }else if(res['code'] == 403) {
                        if(res['data']['force_update']){
                            this.isResetPasswort = true;
                        }
                        this.toastr.error(res['msg'], this.__("global.error"));
                        this.loadingLogin = false;    
                    }
                    else{
                        this.toastr.error(res['msg'], this.__("global.error"));
                        this.loadingLogin = false;    
                    }    
                            
                },
                error: (err) => {
                    this.loadingLogin = false;
                }
                
            });
          } else {
            this.loginForm.markAllAsTouched();
          }



       
    }

    onResetPassword()
    {
        if(this.newPassword != this.confirmNewPassword) {
            this.toastr.error(this.__("global.mdp_non_identique"), 'Erreur');
            return;
        }
        this.authService.resetPassword({ old_password: this.oldPassword, new_password: this.newPassword }).subscribe({
            next: (res) => {
                
                if(res['code'] == 201) {
                    this.login = "";
                    this.password = "";
                    this.isResetPasswort = false;
                    this.toastr.success(res['msg'], this.__("global.success"));
                }else{
                    this.toastr.error(res['msg'], this.__("global.error"));
                }                
            },
            error: (err) => {
                this.toastr.error(this.__("global.connection_echec"), 'Erreur');
            }
        });
    }

    backToLogin(){
        this.isResetPasswort = false;
    }

}
