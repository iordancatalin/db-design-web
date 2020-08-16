import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { NotificationWrapper } from 'src/app/class/wrappers/notification-wrapper';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  @Output() private close: EventEmitter<void> = new EventEmitter();
  @Input() private notifications: Array<NotificationWrapper>;

  constructor(
    private _notificationService: NotificationService,
    private _router: Router
  ) {}

  ngOnInit() {}

  private onClose(): void {
    this.close.emit();
  }

  private closeNotification(wrapper: NotificationWrapper): void {
    this._notificationService.markNotificationAsViewed(wrapper.id);
  }

  private openNotification(wrapper: NotificationWrapper): void {
    this._notificationService.markNotificationAsViewed(wrapper.id);
    this._router.navigate(['/master/workshop'], {
      queryParams: { uid: wrapper.notification.diagramId }
    });
    this.close.emit();
  }
}
