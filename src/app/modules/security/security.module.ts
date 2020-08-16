import { NgModule } from '@angular/core';
import { SigninComponent } from '../../components/signin/signin.component';
import { ForgetPasswordComponent } from '../../components/forget-password/forget-password.component';
import { RegistrationComponent } from '../../components/registration/registration.component';
import { ConfirmEmailComponent } from '../../components/confirm-email/confirm-email.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FontAwesomeModule } from '../font-awesome/font-awesome.module';
import { FormularModule } from '../formular/formular.module';

@NgModule({
  declarations: [SigninComponent, ForgetPasswordComponent, RegistrationComponent, ConfirmEmailComponent],
  imports: [CommonModule, FontAwesomeModule, FormularModule, MaterialModule, AppRoutingModule,],
  exports: [SigninComponent, ForgetPasswordComponent, RegistrationComponent, ConfirmEmailComponent]
})
export class SecurityModule { }
