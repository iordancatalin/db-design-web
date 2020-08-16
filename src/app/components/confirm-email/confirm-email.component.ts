import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/security/authentication.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  constructor(private _authenticationService: AuthenticationService) {
  }

  ngOnInit() {
  }

  private resendEmail(): void {
    this._authenticationService.sendEmailVerification().subscribe();
  }
}
