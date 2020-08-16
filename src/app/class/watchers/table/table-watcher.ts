import { forkJoin, from, Observable, Observer, of, Subject, timer } from 'rxjs/index';
import { map, tap, takeUntil } from 'rxjs/internal/operators';
import { BuilderFactory } from '../../factory/builder-factory';
import { Position } from '../../graphics/position';
import { Table } from '../../model/db/table/table';
import { HtmlColumn } from '../../model/html/column/html-column';
import { HtmlTable } from '../../model/html/table/html-table';
import { ValidationUtil } from '../../ui/validation-util';
import { ColumnsWatcher } from '../column/columns-watcher';
export class TableWatcher {
  private _htmlTable: HtmlTable = null;
  private _columnsWatcher: ColumnsWatcher;
  private _temporaryColumns: Array<HtmlColumn> = [];
  private _newColumnNotifier$: Subject<HtmlColumn> = new Subject();
  private _tableCreatedNotifier$: Subject<HtmlTable> = new Subject();
  private _updateForeignKeyByColumnNotifier$: Subject<HtmlColumn> = new Subject();
  private _unsubscribeNotifier$: Subject<void> = new Subject();

  public constructor(private _firestoreInterceptorService,
    private _newTableNotifier$: Subject<HtmlTable>,
    private _newColumnDiagramNotifier$: Subject<HtmlColumn>,
    private _updateFksByTableNotifier$: Subject<HtmlTable>,
    private _deleteColumnNotifier$: Subject<HtmlColumn>,
    private _diagramId: string) {

    this._updateForeignKeyByColumnNotifier$.subscribe(_ => this._updateFksByTableNotifier$.next(this._htmlTable));

    this._newColumnNotifier$.pipe(takeUntil(this._unsubscribeNotifier$)).subscribe(column => {
      if (!ValidationUtil.isNullOrUndefined(this._htmlTable)) {
        this._htmlTable.addColumn(column);
        this._newColumnDiagramNotifier$.next(column);
      } else {
        this._temporaryColumns.push(column);
      }
    });

    _deleteColumnNotifier$.pipe(takeUntil(this._unsubscribeNotifier$)).subscribe(column => this._htmlTable.deleteColumnWithoutEmit(column));

    this._tableCreatedNotifier$.pipe(takeUntil(this._unsubscribeNotifier$)).subscribe(htmlTable => {
      this._htmlTable = htmlTable;
      this._newTableNotifier$.next(htmlTable);

      const columnObserver: Observer<HtmlColumn> = {
        next: column => {
          this._htmlTable.addColumn(column);
          this._newColumnDiagramNotifier$.next(column);
        },
        error: err => console.log(err),
        complete: () => this._temporaryColumns = []
      };

      from(this._temporaryColumns).subscribe(columnObserver);
    });
  }

  /**
   * Start method
   */
  public start(table: Table): void {
    if (!this._htmlTable) {
      this.build(table).subscribe(value => {
        this._htmlTable = value;
        this._newTableNotifier$.next(this._htmlTable);
      });

      this.createColumnsWatcher(table.id).subscribe(value => {
        this._columnsWatcher = value;
        this._columnsWatcher.start();
      });
    } else {
      this.update(table).subscribe();
    }
  }

  private createColumnsWatcher(tableId: string): Observable<ColumnsWatcher> {
    return of(new ColumnsWatcher(this._firestoreInterceptorService,
      this._newColumnNotifier$,
      this._deleteColumnNotifier$,
      this._updateForeignKeyByColumnNotifier$,
      tableId,
      this._diagramId));
  }

  /**
   * Build table
   */
  private build(table: Table): Observable<HtmlTable> {
    return of(BuilderFactory.buildShallowHtmlTable(table, this._diagramId));
  }

  /**
   * Update table
   */
  private update(table: Table): Observable<boolean> {
    return forkJoin
      (
        this.updateName(table.name),
        this.updateComment(table.comment),
        this.updateWidth(table.width),
        this.updatePosition(table.position)
      ).pipe
      (
        map(values => values.some(value => value))
      );
  }

  /**
   * Update table name
   */
  private updateName(name: string): Observable<boolean> {
    return of(name).pipe
      (
        map(value => this._htmlTable.name !== value),
        tap(value => {
          if (value) {
            this._htmlTable.nameWithoutEmit = name;
          }
        })
      );
  }

  /**
   * Update table comment
   */
  private updateComment(comment: string): Observable<boolean> {
    return of(comment).pipe
      (
        map(value => this._htmlTable.comment !== value),
        tap(value => {
          if (value) {
            this._htmlTable.commentWithoutEmit = comment;
          }
        })
      );
  }

  /**
   * Update table width
   */
  private updateWidth(width: number): Observable<boolean> {
    return of(width).pipe
      (
        map(value => this._htmlTable.width !== value),
        tap(value => {
          if (value) {
            this._htmlTable.width = width;
            this._updateFksByTableNotifier$.next(this._htmlTable);
          }
        })
      );
  }

  /**
   * Update table position
   */
  private updatePosition(position: Position): Observable<boolean> {
    return of(position).pipe
      (
        map(value => !this._htmlTable.position.equals(value)),
        tap(value => {
          if (value) {
            this._htmlTable.positionWithoutEmit = position;
            this._htmlTable.positionTransition = true;

            timer(310).subscribe(() => {
              this._htmlTable.positionTransition = false;
              this._updateFksByTableNotifier$.next(this._htmlTable);
            });
          }
        })
      );
  }

  public unsubscribe() {
    this._unsubscribeNotifier$.next();
    this._columnsWatcher.unsubscribe();
  }

  get htmlTable(): HtmlTable {
    return this._htmlTable;
  }
}
