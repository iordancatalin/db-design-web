import {from, of, Subject, Subscription} from 'rxjs/index';
import {switchMap} from 'rxjs/internal/operators';
import {FirestoreInterceptorService} from '../../../services/firestore/firestore-interceptor.service';
import {CheckConstraint} from '../../model/db/check-constraint/check-constraint';
import {HtmlCheckConstraint} from '../../model/html/check-constraint/html-check-constraint';
import {ValidationUtil} from '../../ui/validation-util';
import {CheckConstraintWatcher} from './check-constraint-watcher';

export class CheckConstraintsWatcher {

  private _checkConstraintsWatcherMap: Map<string, CheckConstraintWatcher> = new Map();
  private _subscription: Subscription;

  public constructor(private _firestoreInterceptorService: FirestoreInterceptorService,
                     private _newCheckConstraintNotifier$: Subject<HtmlCheckConstraint>,
                     private _deleteCheckConstraintNotifier$: Subject<HtmlCheckConstraint>,
                     private _tableId: string,
                     private _diagramId: string) {
  }

  public start(): void {
    this._subscription = this._firestoreInterceptorService.watchCheckConstraints(this._tableId, this._diagramId)
      .pipe(switchMap(val => of(val as Array<CheckConstraint>)))
      .subscribe(constraints => {

        if (!ValidationUtil.isArrayEmpty(constraints)) {
          from(constraints).subscribe(constraint => {
            if (!this._checkConstraintsWatcherMap.has(constraint.id)) {
              const checkConstraintWatcher = new CheckConstraintWatcher(this._newCheckConstraintNotifier$, this._tableId, this._diagramId);
              this._checkConstraintsWatcherMap.set(constraint.id, checkConstraintWatcher);
            }

            this._checkConstraintsWatcherMap.get(constraint.id).start(constraint);
          });
        }

        of(this._checkConstraintsWatcherMap).subscribe(map => {
          map.forEach((constraint, key) => {
            if (!constraints.some(value => value.id === key)) {
              this._checkConstraintsWatcherMap.delete(key);
              this._deleteCheckConstraintNotifier$.next(constraint.htmlCheckConstraint);
            }
          });
        });
      });
  }

  public unsubscribe(): void {
    if (ValidationUtil.isNullOrUndefined(this._subscription) && !this._subscription.closed) {
      this._subscription.unsubscribe();
    }
  }
}
