import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { of, Subscription } from 'rxjs/index';
import { switchMap } from 'rxjs/internal/operators';
import { HtmlUniqueConstraint } from '../../../class/model/html/unique-constraint/html-unique-constraint';
import { UniqueConstraintResult } from '../../../class/resut/results';
import { FirestoreInterceptorService } from '../../../services/firestore/firestore-interceptor.service';

@Component({
  selector: 'app-unique-constraint',
  templateUrl: './unique-constraint.component.html',
  styleUrls: ['./unique-constraint.component.scss']
})
export class UniqueConstraintComponent implements OnInit, OnDestroy {
  @Input() private uniqueConstraint: HtmlUniqueConstraint;

  @Output() private atFocus: EventEmitter<
    UniqueConstraintResult
  > = new EventEmitter();
  @Output() private atDelete: EventEmitter<
    UniqueConstraintResult
  > = new EventEmitter();

  private _subscription: Subscription;

  constructor(
    private _firestoreInterceptorService: FirestoreInterceptorService
  ) {}

  ngOnInit() {
    this._subscription = this.uniqueConstraint.subject$
      .pipe(switchMap(val => of(val as HtmlUniqueConstraint)))
      .subscribe(constraint =>
        this._firestoreInterceptorService.updateOrCreateUniqueConstraint(
          constraint
        )
      );
  }

  ngOnDestroy() {
    if (this._subscription && !this._subscription.closed) {
      this._subscription.unsubscribe();
    }
  }

  private delete(event: MouseEvent): void {
    this.atDelete.emit(
      new UniqueConstraintResult(this.uniqueConstraint, event)
    );
  }

  private focus(event: MouseEvent): void {
    this.atFocus.emit(new UniqueConstraintResult(this.uniqueConstraint, event));
  }
}
