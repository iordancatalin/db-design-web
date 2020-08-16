import { Observable, of, Subject, Subscription } from 'rxjs/index';
import { FirestoreInterceptorService } from '../../../services/firestore/firestore-interceptor.service';
import { HtmlCheckConstraint } from '../../model/html/check-constraint/html-check-constraint';
import { HtmlTableConstraint } from '../../model/html/table-constraint/html-table-constraint';
import { HtmlUniqueConstraint } from '../../model/html/unique-constraint/html-unique-constraint';
import { CheckConstraintsWatcher } from '../check-constraint/check-constraints-watcher';
import { UniqueConstraintsWatcher } from '../unique-constraint/unique-constraints-watcher';
import { takeUntil } from 'rxjs/internal/operators';
export class TableMoreWatcher {

  private _newCheckConstraintNotifier$: Subject<HtmlCheckConstraint> = new Subject();
  private _deleteCheckConstraintNotifier$: Subject<HtmlCheckConstraint> = new Subject();

  private _newUniqueConstraintNotifier$: Subject<HtmlUniqueConstraint> = new Subject();
  private _deleteUniqueConstraintNotifier$: Subject<HtmlUniqueConstraint> = new Subject();

  private _unsubscribeNotifier$: Subject<void> = new Subject()

  private _checkConstraintsWatcher: CheckConstraintsWatcher;
  private _uniqueConstraintsWatcher: UniqueConstraintsWatcher;

  public constructor(private _firestoreInterceptorService: FirestoreInterceptorService,
    private _tableConstraint: HtmlTableConstraint,
    private _diagramId: string) {

    this._newCheckConstraintNotifier$.pipe(takeUntil(this._unsubscribeNotifier$))
      .subscribe(constraint => this._tableConstraint.addHtmlCheckConstraint(constraint));

    this._deleteCheckConstraintNotifier$.pipe(takeUntil(this._unsubscribeNotifier$))
      .subscribe(constraint => this._tableConstraint.deleteCheckConstraint(constraint));

    this._newUniqueConstraintNotifier$.pipe(takeUntil(this._unsubscribeNotifier$))
      .subscribe(constraint => this._tableConstraint.addHtmlUniqueConstraint(constraint));

    this._deleteUniqueConstraintNotifier$.pipe(takeUntil(this._unsubscribeNotifier$))
      .subscribe(constraint => this._tableConstraint.deleteUniqueConstraint(constraint));
  }

  public start(): void {
    if (!this._checkConstraintsWatcher) {
      this.createCheckConstraintsWatcher().subscribe(value => {
        this._checkConstraintsWatcher = value;
        this._checkConstraintsWatcher.start();
      });
    }

    if (!this._uniqueConstraintsWatcher) {
      this.createUniqueConstraintsWatcher().subscribe(value => {
        this._uniqueConstraintsWatcher = value;
        this._uniqueConstraintsWatcher.start();
      });
    }
  }

  private createUniqueConstraintsWatcher(): Observable<UniqueConstraintsWatcher> {
    return of(new UniqueConstraintsWatcher(this._firestoreInterceptorService,
      this._newUniqueConstraintNotifier$, this._deleteUniqueConstraintNotifier$, this._tableConstraint.tableId, this._diagramId));
  }

  private createCheckConstraintsWatcher(): Observable<CheckConstraintsWatcher> {
    return of(new CheckConstraintsWatcher(this._firestoreInterceptorService,
      this._newCheckConstraintNotifier$, this._deleteCheckConstraintNotifier$, this._tableConstraint.tableId, this._diagramId));
  }

  public unsubsribe(): void {

    this._unsubscribeNotifier$.next();

    if (this._checkConstraintsWatcher) { this._checkConstraintsWatcher.unsubscribe(); }

    if (this._uniqueConstraintsWatcher) { this._uniqueConstraintsWatcher.unsubscribe(); }
  }
}
