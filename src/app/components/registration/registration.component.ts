import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observer } from 'rxjs/index';
import { AuthenticationService } from '../../services/security/authentication.service';
import { User } from 'src/app/class/intf/user-interface';
import { UserAdditionalInfoService } from 'src/app/services/user-additional-info.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  private formGroup: FormGroup;
  private _errorMessage: string;

  private showResetPasswordPopup = false;

  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  public forgetPasswordActive(): void {
    this.showResetPasswordPopup = true;
  }

  public forgetPasswordInactive(): void {
    this.showResetPasswordPopup = false;
  }

  private submit(): void {
    if (this.password.value !== this.confirmPassword.value) {
      this._errorMessage = 'Password and confirm password doesn\'t match';
      return;
    }

    const observer: Observer<User> = {
      next: () => {
        this._authenticationService
          .updateProfile(this.username.value)
          .subscribe();
        this._authenticationService
          .sendEmailVerification()
          .subscribe(() => this._router.navigateByUrl('/confirm-email'));
      },
      error: err => (this._errorMessage = err.message),
      complete: () => {}
    };

    this._authenticationService
      .createUserWithEmailAndPassword(this.email.value, this.password.value)
      .subscribe(observer);
  }

  signInWithGoogle(): void {
    this._authenticationService
      .signInWithGoogle()
      .subscribe(this.successObserver);
  }

  signInWithFacebook(): void {
    this._authenticationService
      .signInWithFacebook()
      .subscribe(this.successObserver);
  }

  get successObserver(): Observer<any> {
    return {
      next: val => {
        this._router.navigateByUrl('/master/storage');
      },
      error: err => {
        if (
          err.code === 'auth/wrong-password' ||
          err.code === 'auth/user-not-found'
        ) {
          this._errorMessage = 'Invalid credentials';
        } else {
          this._errorMessage = err.message;
        }
      },
      complete: () => {}
    };
  }

  public get email() {
    return this.formGroup.get('email');
  }

  public get username() {
    return this.formGroup.get('username');
  }

  public get password() {
    return this.formGroup.get('password');
  }

  public get confirmPassword() {
    return this.formGroup.get('confirmPassword');
  }
}
