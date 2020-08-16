import { Routes } from "@angular/router";
import { MasterComponent } from "../app/components/master/master.component";
import { RegistrationComponent } from "../app/components/registration/registration.component";
import { SigninComponent } from "../app/components/signin/signin.component";
import { VtxComponent } from "../app/components/vtx/vtx/vtx.component";
import { DbuilderComponent } from "../app/components/dbuilder/dbuilder.component";
import { ConfirmEmailComponent } from "../app/components/confirm-email/confirm-email.component";
import { StorageComponent } from "src/app/components/storage/storage.component";
import { SharedComponent } from "src/app/components/shared/shared.component";
import { ProfileComponent } from "src/app/components/profile/profile.component";
import { AuthGuardService } from "src/app/guards/auth-guard.service";
import { AuthChildGuardService } from "src/app/guards/auth-child-guard.service";
import { RecentComponent } from "src/app/components/recent/recent.component";

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    // <add here firebase configuration>
  }
};

export const API_URL = "http://localhost:8080/api";

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.