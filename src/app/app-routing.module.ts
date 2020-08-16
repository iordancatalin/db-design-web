import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VtxComponent } from './components/vtx/vtx/vtx.component';
import { SigninComponent } from './components/signin/signin.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { MasterComponent } from './components/master/master.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { AuthChildGuardService } from './guards/auth-child-guard.service';
import { DbuilderComponent } from './components/dbuilder/dbuilder.component';
import { StorageComponent } from './components/storage/storage.component';
import { SharedComponent } from './components/shared/shared.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RecentComponent } from './components/recent/recent.component';

const routes: Routes = [
  { path: "", component: VtxComponent },
  { path: "sign-in", component: SigninComponent },
  { path: "confirm-email", component: ConfirmEmailComponent },
  { path: "registration", component: RegistrationComponent },
  {
    path: "master",
    component: MasterComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthChildGuardService],
    children: [
      {
        path: "",
        redirectTo: "storage",
        pathMatch: "full"
      },
      {
        path: "workshop",
        component: DbuilderComponent
      },
      {
        path: "storage",
        component: StorageComponent
      },
      {
        path: "shared",
        component: SharedComponent
      },
      {
        path: "profile",
        component: ProfileComponent
      },
      {
        path: "recent",
        component: RecentComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
