import { from, Observable, Observer, of, Subject, Subscription } from 'rxjs/index';
import { map, switchMap, tap, takeUntil } from 'rxjs/internal/operators';
import { FirestoreInterceptorService } from '../../../services/firestore/firestore-interceptor.service';
import { BuilderFactory } from '../../factory/builder-factory';
import { Diagram } from '../../model/db/diagram/diagram';
import { HtmlColumn } from '../../model/html/column/html-column';
import { HtmlDiagram } from '../../model/html/diagram/html-diagram';
import { HtmlForeignKey } from '../../model/html/foreign-key/html-foreign-key';
import { HtmlTable } from '../../model/html/table/html-table';
import { ForeignKeysWatcher } from '../foreign-key/foreign-keys-watcher';
import { TablesWatcher } from '../table/tables-wathcer';
export class DiagramWatcher {

  private _htmlDiagram: HtmlDiagram = null;
  private _newTableNotifier$: Subject<HtmlTable> = new Subject();
  private _deleteTableNotifier$: Subject<HtmlTable> = new Subject();
  private _newColumnDiagramNotifier$: Subject<HtmlColumn> = new Subject();
  private _newForeignKeyNotifier$: Subject<HtmlForeignKey> = new Subject();
  private _deleteForeignKeyNotifier$: Subject<HtmlForeignKey> = new Subject();

  private _diagramCreatedNotifier$: Subject<HtmlDiagram> = new Subject();
  private _deleteColumnNotifier$: Subject<HtmlColumn> = new Subject();

  private _temporaryTables: Array<HtmlTable> = [];
  private _temporaryForeignKeys: Array<HtmlForeignKey> = [];

  private _tablesWatcher: TablesWatcher;
  private _foreignKeysWatcher: ForeignKeysWatcher;

  private _subscription: Subscription;
  private _unsubsribeNotifier$: Subject<void> = new Subject();

  public constructor(private _firestoreInterceptorService$: FirestoreInterceptorService,
    private _newDiagramNotifier$: Subject<HtmlDiagram>,
    private _updateFksByTableNotifier$: Subject<HtmlTable>,
    private _updateForeignKeyNotifier$: Subject<HtmlForeignKey>,
    private _diagramId: string) {

    this._deleteColumnNotifier$.pipe(takeUntil(this._unsubsribeNotifier$)).subscribe(column => {

      if (this._htmlDiagram.htmlForeignKeys) {
        this._htmlDiagram.htmlForeignKeys.forEach(constraint => {
          constraint.deleteRelationsByColumn(column);

          if (!constraint.relations.length) {
            this._htmlDiagram.deleteForeignKeyWithoutEmit(constraint);
          } else {
            this._updateForeignKeyNotifier$.next(constraint);
          }
        });
      }
    });

    this._newTableNotifier$.pipe(takeUntil(this._unsubsribeNotifier$)).subscribe(table => {
      if (this._htmlDiagram) {
        this._htmlDiagram.addTableWithoutEmit(table);
      } else {
        this._temporaryTables.push(table);
      }
    });

    this._deleteTableNotifier$.subscribe(table => this._htmlDiagram.dropTableWithoutEmit(table));

    this._newForeignKeyNotifier$.pipe(takeUntil(this._unsubsribeNotifier$)).subscribe(foreignKey => {
      if (this._htmlDiagram) {
        this._htmlDiagram.addForeignKeyWithoutEmit(foreignKey);
        this._updateForeignKeyNotifier$.next(foreignKey);
      } else {
        this._temporaryForeignKeys.push(foreignKey);
      }
    });

    this._deleteForeignKeyNotifier$
      .pipe(takeUntil(this._unsubsribeNotifier$))
      .subscribe(foreignKey => this._htmlDiagram.deleteForeignKeyWithoutEmit(foreignKey));

    this._diagramCreatedNotifier$.pipe(takeUntil(this._unsubsribeNotifier$)).subscribe(htmlDiagram => {
      this._htmlDiagram = htmlDiagram;
      this._newDiagramNotifier$.next(htmlDiagram);

      const tableObserver: Observer<HtmlTable> = {
        next: table => this._htmlDiagram.addTableWithoutEmit(table),
        error: err => console.error(err),
        complete: () => this._temporaryTables = []
      };

      from(this._temporaryTables).subscribe(tableObserver);

      const foreignKeyObserver: Observer<HtmlForeignKey> = {
        next: foreignKey => {
          this._htmlDiagram.addForeignKeyWithoutEmit(foreignKey);
          this._updateForeignKeyNotifier$.next(foreignKey);
        },
        error: err => console.error(err),
        complete: () => this._temporaryForeignKeys = []
      };

      from(this._temporaryForeignKeys).subscribe(foreignKeyObserver);
    });
  }

  private static build(diagram: Diagram): Observable<HtmlDiagram> {
    return of(BuilderFactory.buildShallowHtmlDiagram(diagram));
  }

  public start(): void {
    this._subscription = this._firestoreInterceptorService$.watchDiagram(this._diagramId)
      .pipe(switchMap(diagram => of(diagram as Diagram)))
      .subscribe(diagram => {
        if (!this._htmlDiagram) {
          DiagramWatcher.build(diagram).subscribe(value => this._diagramCreatedNotifier$.next(value));

          this.createForeignKeysWatcher().subscribe(value => {
            this._foreignKeysWatcher = value;
            this._foreignKeysWatcher.start();
          });

          this.createTablesWatcher().subscribe(value => {
            this._tablesWatcher = value;
            this._tablesWatcher.start();
          });

        } else {
          this.update(diagram).subscribe();
        }
      });
  }

  private createForeignKeysWatcher(): Observable<ForeignKeysWatcher> {
    return of(new ForeignKeysWatcher(this._firestoreInterceptorService$,
      this._newForeignKeyNotifier$,
      this._deleteForeignKeyNotifier$,
      this._newColumnDiagramNotifier$,
      this._newTableNotifier$,
      this._updateForeignKeyNotifier$,
      this._htmlDiagram,
      this._diagramId));
  }

  private createTablesWatcher(): Observable<TablesWatcher> {
    return of(new TablesWatcher(this._firestoreInterceptorService$,
      this._newTableNotifier$,
      this._newColumnDiagramNotifier$,
      this._deleteTableNotifier$,
      this._updateFksByTableNotifier$,
      this._deleteColumnNotifier$,
      this._diagramId));
  }

  private update(value: Diagram): Observable<boolean> {
    return of(value).pipe
      (
        map(diagram => this._htmlDiagram.name !== diagram.name),
        tap(result => {
          if (result) {
            this._htmlDiagram.nameWithoutEmit = value.name;
          }
        })
      );
  }

  public unsubscribe(): void {
    this._unsubsribeNotifier$.next();
    if (this._tablesWatcher) { this._tablesWatcher.unsubscribe(); }
    if (this._foreignKeysWatcher) { this._foreignKeysWatcher.unsubscribe(); }
    if (this._subscription && !this._subscription.closed) { this._subscription.unsubscribe(); }
  }
}
