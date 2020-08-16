import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {HtmlCheckConstraint} from '../../../class/model/html/check-constraint/html-check-constraint';
import {CheckConstraintResult} from '../../../class/resut/results';
import {FirestoreInterceptorService} from '../../../services/firestore/firestore-interceptor.service';

@Component({
  selector: 'app-check-constraint',
  templateUrl: './check-constraint.component.html',
  styleUrls: ['./check-constraint.component.scss']
})
export class CheckConstraintComponent implements OnInit, OnDestroy {

  @Input() private checkConstraint: HtmlCheckConstraint;

  @Output() private atDelete: EventEmitter<CheckConstraintResult> = new EventEmitter();
  @Output() private atFocus: EventEmitter<CheckConstraintResult> = new EventEmitter();

  private _subscription: Subscription;

  constructor(private _firestoreInterceptorService: FirestoreInterceptorService) {
  }

  ngOnInit() {
    this._subscription = this.checkConstraint.subject$
      .subscribe(constraint => this._firestoreInterceptorService.updateOrCreateHtmlCheckConstraint(constraint));
  }

  ngOnDestroy() {
    if (this._subscription && !this._subscription.closed) {
      this._subscription.unsubscribe();
    }
  }

  private delete(event: MouseEvent): void {
    this.atDelete.emit(new CheckConstraintResult(this.checkConstraint, event));
  }

  private focus(event: FocusEvent): void {
    this.atFocus.emit(new CheckConstraintResult(this.checkConstraint, event));
  }
}
