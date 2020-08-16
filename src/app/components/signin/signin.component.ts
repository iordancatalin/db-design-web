import { Component, OnInit } from '@angular/core';
import { Observer } from 'rxjs/index';
import { AuthenticationService } from '../../services/security/authentication.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  _errorMessage: string;
  showResetPasswordPopup = false;
  formGroup: FormGroup;

  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
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

  public forgetPasswordActive(): void {
    this.showResetPasswordPopup = true;
  }

  public forgetPasswordInactive(): void {
    this.showResetPasswordPopup = false;
  }

  public submit(event: Event): void {
    this._authenticationService
      .signInUserWithEmailAndPassword(this.email.value, this.password.value)
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

  get email() {
    return this.formGroup.get('email');
  }

  get password() {
    return this.formGroup.get('password');
  }
}
