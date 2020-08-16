import { from, of, Subject, Subscription } from 'rxjs/index';
import { switchMap } from 'rxjs/internal/operators';
import { FirestoreInterceptorService } from '../../../services/firestore/firestore-interceptor.service';
import { Table } from '../../model/db/table/table';
import { HtmlColumn } from '../../model/html/column/html-column';
import { HtmlTable } from '../../model/html/table/html-table';
import { ValidationUtil } from '../../ui/validation-util';
import { TableWatcher } from './table-watcher';
export class TablesWatcher {
  private _tableWatchersMap: Map<string, TableWatcher> = new Map();

  private _subscription: Subscription;

  public constructor(private _firestoreInterceptoService: FirestoreInterceptorService,
    private _newTableNotifier$: Subject<HtmlTable>,
    private _newColumnDiagramNotifier$: Subject<HtmlColumn>,
    private _deleteTableNotifier$: Subject<HtmlTable>,
    private _updateFksByTableNotifier$: Subject<HtmlTable>,
    private _deleteColumnNotifier$: Subject<HtmlColumn>,
    private _diagramId: string) {
  }

  public start(): void {
    this._subscription = this._firestoreInterceptoService.watchTables(this._diagramId)
      .pipe(switchMap(tables => of(tables as Array<Table>)))
      .subscribe(tables => {

        if (tables.length) {
          from(tables).subscribe(table => {
            if (!this._tableWatchersMap.has(table.id)) {
              const tableWatcher: TableWatcher = new TableWatcher(this._firestoreInterceptoService,
                this._newTableNotifier$,
                this._newColumnDiagramNotifier$,
                this._updateFksByTableNotifier$,
                this._deleteColumnNotifier$,
                this._diagramId);

              this._tableWatchersMap.set(table.id, tableWatcher);
            }
            this._tableWatchersMap.get(table.id).start(table);
          });
        }

        of(tables).subscribe(tablesVal => {
          this._tableWatchersMap.forEach((value, key) => {

            if (!tablesVal.map(table => table.id).some(idTable => idTable === key)) {
              this._deleteTableNotifier$.next(value.htmlTable);
              this._tableWatchersMap.delete(key);
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
