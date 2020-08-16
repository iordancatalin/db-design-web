import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
  DocumentChange
} from '@angular/fire/firestore';
import { NOTIFICATIONS_COLLETION } from '../class/constants/firestore-constrants';
import { AuthenticationService } from './security/authentication.service';
import { Observable, from } from 'rxjs';
import { Notification } from '../class/data-model/notification';
import { Util } from '../class/common/util';
import { map, tap, filter, mergeMap } from 'rxjs/internal/operators';
import { NotificationWrapper } from '../class/wrappers/notification-wrapper';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(
    private _firestore: AngularFirestore,
    private _authenticationService: AuthenticationService
  ) {}

  public createNotification(notification: Notification): void {
    this._firestore
      .collection(NOTIFICATIONS_COLLETION)
      .add(Util.toJSObject(notification));
  }

  public getCurrentAccountNotifications(): Observable<
    Array<NotificationWrapper>
  > {
    return from(
      this._firestore
        .collection(NOTIFICATIONS_COLLETION)
        .snapshotChanges()
        .pipe(
          map((values: DocumentChangeAction<{}>[]) =>
            values.map(
              value =>
                new NotificationWrapper(
                  value.payload.doc.id,
                  value.payload.doc.data() as Notification
                )
            )
          )
        )
    );
  }

  public markNotificationAsViewed(notificationId: string): Observable<void> {
    return from(
      this._firestore
        .collection(NOTIFICATIONS_COLLETION)
        .doc(notificationId)
        .update({ viewed: true })
    );
  }
}
