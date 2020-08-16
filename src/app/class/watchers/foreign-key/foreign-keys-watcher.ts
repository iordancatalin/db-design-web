import { from, of, Subject, Subscription } from 'rxjs/index';
import { switchMap } from 'rxjs/internal/operators';
import { FirestoreInterceptorService } from '../../../services/firestore/firestore-interceptor.service';
import { ForeignKeyConstraint } from '../../model/db/foreign-key/foreign-key-constraint';
import { HtmlForeignKey } from '../../model/html/foreign-key/html-foreign-key';
import { HtmlColumn } from '../../model/html/column/html-column';
import { HtmlDiagram } from '../../model/html/diagram/html-diagram';
import { HtmlTable } from '../../model/html/table/html-table';
import { ValidationUtil } from '../../ui/validation-util';
import { ForeignKeyWatcher } from './foreign-key-watcher';

export class ForeignKeysWatcher {
  private _foreignKeyWatchersMap: Map<string, ForeignKeyWatcher> = new Map();
  private _subscription: Subscription;

  public constructor(private _firestoreInterceptorService: FirestoreInterceptorService,
    private _newForeignKeyNotifier$: Subject<HtmlForeignKey>,
    private _deleteForeignKeyNotifier$: Subject<HtmlForeignKey>,
    private _newColumnDiagramNotifier$: Subject<HtmlColumn>,
    private _newTableNotifier$: Subject<HtmlTable>,
    private _updateForeignKeyNotifier$: Subject<HtmlForeignKey>,
    private _diagram: HtmlDiagram,
    private _diagramId: string) {
  }

  public start(): void {
    this._subscription = this._firestoreInterceptorService.watchForeignKeys(this._diagramId)
      .pipe(switchMap(foreignKeys => of(foreignKeys as Array<ForeignKeyConstraint>)))
      .subscribe(foreignKeys => {

        if (!ValidationUtil.isArrayEmpty(foreignKeys)) {
          from(foreignKeys).subscribe(foreignKey => {
            if (!this._foreignKeyWatchersMap.has(foreignKey.id)) {
              this._foreignKeyWatchersMap.set(foreignKey.id, new ForeignKeyWatcher(this._newForeignKeyNotifier$,
                this._newTableNotifier$,
                this._newColumnDiagramNotifier$,
                this._updateForeignKeyNotifier$,
                this._diagram,
                this._diagramId
              ));
            }

            this._foreignKeyWatchersMap.get(foreignKey.id).start(foreignKey);
          });
        }

        of(foreignKeys).subscribe(foreignKeysVal => {
          this._foreignKeyWatchersMap.forEach((value, key) => {
            if (!foreignKeysVal.some(foreignKey => foreignKey.id === key)) {
              this._deleteForeignKeyNotifier$.next(value.htmlForeignKey);
            }
          });
        });
      });
  }

  public unsubscribe() {
    if (this._subscription && !this._subscription.closed) { this._subscription.unsubscribe(); }
  }

  get diagram(): HtmlDiagram {
    return this._diagram;
  }

  set diagram(value: HtmlDiagram) {
    this._diagram = value;
    this._foreignKeyWatchersMap.forEach(val => val.diagram = value);
  }
}
