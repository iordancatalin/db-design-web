import { Component, OnInit } from '@angular/core';
import { NavService } from 'src/app/services/nav.service';
import { AuthenticationService } from 'src/app/services/security/authentication.service';
import { CloudStorageService } from 'src/app/services/cloud-storage.service';
import { tap } from 'rxjs/internal/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private showLoader = false;

  constructor(
    private _navService: NavService,
    private _authenticationService: AuthenticationService,
    private _cloudStorageService: CloudStorageService
  ) {}

  ngOnInit() {
    this._navService.emit('/master/profile');
  }

  private uploadFile(event: Event): void {
    this.showLoader = true;

    this._cloudStorageService
      .uploadFile(
        (event.target as any).files[0],
        this._authenticationService.getAuthenticatedAccount().email
      )
      .then(snapshot =>
        this._cloudStorageService
          .downloadFile(snapshot.metadata.fullPath)
          .pipe(
            tap(val => this._authenticationService.updateAccountProfile(val)),
            tap(() => (this.showLoader = false))
          )
          .subscribe(val =>
            this._authenticationService
              .updateProfile(
                this._authenticationService.getAuthenticatedAccount()
                  .displayName,
                val
              )
              .subscribe()
          )
      );
  }
}
