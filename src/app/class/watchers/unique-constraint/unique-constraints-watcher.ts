import {from, of, Subject, Subscription} from 'rxjs/index';
import {switchMap} from 'rxjs/internal/operators';
import {FirestoreInterceptorService} from '../../../services/firestore/firestore-interceptor.service';
import {UniqueConstraint} from '../../model/db/unique-constraint/unique-constraint';
import {HtmlUniqueConstraint} from '../../model/html/unique-constraint/html-unique-constraint';
import {ValidationUtil} from '../../ui/validation-util';
import {UniqueConstraintWatcher} from './unique-constraint-watcher';
export class UniqueConstraintsWatcher {

  private _uniqueConstraintsWatcherMap: Map<string, UniqueConstraintWatcher> = new Map();
  private _subscription: Subscription;

  public constructor(private _firestoreInterceptorService: FirestoreInterceptorService,
                     private _newUniqueConstraintNotifier$: Subject<HtmlUniqueConstraint>,
                     private _deleteUniqueConstraintNotifier$: Subject<HtmlUniqueConstraint>,
                     private _tableId: string,
                     private _diagramId: string) {
  }

  public start(): void {
    this._subscription = this._firestoreInterceptorService.watchUniqueConstraints(this._tableId, this._diagramId)
      .pipe(switchMap(val => of(val as Array<UniqueConstraint>)))
      .subscribe(constraints => {

        if (!ValidationUtil.isArrayEmpty(constraints)) {
          from(constraints).subscribe(constraint => {
            if (!this._uniqueConstraintsWatcherMap.has(constraint.id)) {
              const uniqueConstraintWatcher = new UniqueConstraintWatcher(this._newUniqueConstraintNotifier$,
                this._tableId, this._diagramId);

              this._uniqueConstraintsWatcherMap.set(constraint.id, uniqueConstraintWatcher);
            }

            this._uniqueConstraintsWatcherMap.get(constraint.id).start(constraint);
          });
        }

        of(this._uniqueConstraintsWatcherMap).subscribe(map => {
          map.forEach((value, key) => {
            if (!constraints.some(constraint => constraint.id === key)) {
              this._deleteUniqueConstraintNotifier$.next(value.htmlUniqueConstraint);
            }
          });
        });

      });
  }

  public unsubscribe(): void {
    if (!ValidationUtil.isNullOrUndefined(this._subscription) && !this._subscription.closed) {
      this._subscription.unsubscribe();
    }
  }
}
