import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { AbstractDiagram } from 'src/app/class/model-abstract/diagram/abstract-diagram';
import { AuthenticationService } from 'src/app/services/security/authentication.service';
import { FirestoreInterceptorService } from 'src/app/services/firestore/firestore-interceptor.service';
import { Notification } from 'src/app/class/data-model/notification';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-share-diagram',
  templateUrl: './share-diagram.component.html',
  styleUrls: ['./share-diagram.component.scss']
})
export class ShareDiagramComponent implements OnInit {
  @Input() private diagram: AbstractDiagram;
  @Output() private close: EventEmitter<void> = new EventEmitter();

  formControl: FormControl;

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _firestoreInterceptorService: FirestoreInterceptorService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.formControl = this._formBuilder.control('', [
      Validators.required,
      Validators.email
    ]);
  }

  private onClose() {
    this.close.emit();
  }

  private onShare() {
    const notification = new Notification(
      this._authenticationService.getAuthenticatedAccount().email,
      this.formControl.value,
      this.diagram.id,
      this.diagram.name,
      false
    );

    this._firestoreInterceptorService
      .updateDiagramShareList(this.diagram.id, this.formControl.value)
      .subscribe(
        val => {
          this._notificationService.createNotification(notification);
          this.close.emit();
        },
        error => {
          console.log(error);
          this.close.emit();
        }
      );
  }
}
