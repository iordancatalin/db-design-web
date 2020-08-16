import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/index';
import { HtmlForeignKey } from '../../class/model/html/foreign-key/html-foreign-key';
import { FirestoreInterceptorService } from '../../services/firestore/firestore-interceptor.service';

@Component({
  selector: 'app-relation-popup',
  templateUrl: './relation-popup.component.html',
  styleUrls: ['./relation-popup.component.scss']
})
export class RelationPopupComponent implements OnInit, OnDestroy {
  @Input() foreignKey: HtmlForeignKey;

  private _subscription: Subscription;

  constructor(
    private firestoreInterceptorService: FirestoreInterceptorService
  ) {}

  ngOnInit() {
    this._subscription = this.foreignKey.subject$.subscribe(val =>
      this.firestoreInterceptorService.updateOrCreateHtmlForeignKey(val)
    );
  }

  ngOnDestroy() {
    if (this._subscription && !this._subscription.closed) {
      this._subscription.unsubscribe();
    }
  }

  private closePopup(): void {
    this.foreignKey.showMore = false;
  }
}
