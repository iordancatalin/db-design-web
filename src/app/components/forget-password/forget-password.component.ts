import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FireModule } from 'src/app/modules/fire/fire.module';
import { AuthenticationService } from 'src/app/services/security/authentication.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  @Output()
  private close: EventEmitter<any> = new EventEmitter<any>();

  private email: string;

  constructor(private _authenticationService: AuthenticationService) { }

  public forgetPasswordInactive() { this.close.emit(); }

  ngOnInit() {
  }

  private submit() {
    this._authenticationService.sendPasswordResetEmail(this.email).subscribe(_ => this.close.emit());
  }
}
