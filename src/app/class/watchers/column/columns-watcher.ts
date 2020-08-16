import { from, of, Subject, Subscription } from 'rxjs/index';
import { switchMap } from 'rxjs/internal/operators';
import { FirestoreInterceptorService } from '../../../services/firestore/firestore-interceptor.service';
import { Column } from '../../model/db/column/column';
import { HtmlColumn } from '../../model/html/column/html-column';
import { ColumnWatcher } from './column-watcher';
export class ColumnsWatcher {
  private _columnWatchersMap: Map<string, ColumnWatcher> = new Map();
  private _subscription: Subscription;

  public constructor(private _firestoreInterceptorService: FirestoreInterceptorService,
    private _newColumnNotifier$: Subject<HtmlColumn>,
    private _deleteColumnNotifier$: Subject<HtmlColumn>,
    private _updateForeignKeyByColumnNotifier$: Subject<HtmlColumn>,
    private _tableId: string, private _diagramId: string) {
  }

  public start(): void {
    this._subscription = this._firestoreInterceptorService.watchColumns(this._diagramId, this._tableId)
      .pipe(switchMap(columns => of(columns as Array<Column>)))
      .subscribe(columns => {

        if (columns.length) {
          from(columns).subscribe(column => {
            if (!this._columnWatchersMap.has(column.id)) {
              const columnWatcher: ColumnWatcher = new ColumnWatcher(this._newColumnNotifier$,
                this._updateForeignKeyByColumnNotifier$,
                this._tableId,
                this._diagramId);
              this._columnWatchersMap.set(column.id, columnWatcher);
            }
            this._columnWatchersMap.get(column.id).start(column);
          });
        }

        of(columns).subscribe(columnsVal => {
          this._columnWatchersMap.forEach((value, key) => {
            if (!columnsVal.map(column => column.id).some(idColumn => idColumn === key)) {
              this._deleteColumnNotifier$.next(value.htmlColumn);
              this._columnWatchersMap.delete(key);
            }
          });
        });
      });
  }

  public unsubscribe(): void {
    if (this._subscription && !this._subscription.closed) {
      this._subscription.unsubscribe();
    }
  }
}
