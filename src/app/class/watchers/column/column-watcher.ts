import {forkJoin, Observable, of, Subject} from 'rxjs/index';
import {map, tap} from 'rxjs/internal/operators';
import {BuilderFactory} from '../../factory/builder-factory';
import {Column} from '../../model/db/column/column';
import {HtmlColumn} from '../../model/html/column/html-column';
import {ValidationUtil} from '../../ui/validation-util';
export class ColumnWatcher {
  private _htmlColumn: HtmlColumn = null;

  public constructor(private _newColumnNotifier$: Subject<HtmlColumn>,
                     private _updateForeignKeyByColumnNotifier$: Subject<HtmlColumn>,
                     private _tableId: string,
                     private _diagramId: string) {
  }

  /**
   * Start Method
   */
  public start(column: Column) {
    if (!this._htmlColumn) {
      this.build(column).subscribe(value => {
        this._htmlColumn = value;
        this._newColumnNotifier$.next(this._htmlColumn);
      });
    } else {
      this.update(column).subscribe();
    }
  }

  /**
   * Build column
   */
  private build(column: Column): Observable<HtmlColumn> {
    return of(BuilderFactory.buildShallowHtmlColumn(column, this._tableId, this._diagramId));
  }

  /**
   * Update column if changed
   */
  private update(column: Column): Observable<boolean> {
    return forkJoin
    (
      this.updateName(column.name),
      this.updateType(column.type),
      this.updatePrimaryKey(column.primaryKey),
      this.updateForeignKey(column.foreignKey),
      this.updateNullable(column.nullable),
      this.updateComment(column.comment),
      this.updateAutoincrement(column.autoincrement),
      this.updateUnique(column.unique),
      this.updateDefaultValue(column.defaultValue)
    ).pipe
    (
      map(values => values.some(value => value))
    );
  }

  private updateDefaultValue(defaultValue: string): Observable<boolean>{
    return of(defaultValue).pipe
    (
      map(value => this._htmlColumn.defaultValue !== defaultValue),
      tap(value => {
        if (value) {
          this._htmlColumn.defaultValueWithoutEmit = defaultValue;
        }
      })
    );
  }

  /**
   * Update name property if changed
   */
  private updateName(name: string): Observable<boolean> {
    return of(name).pipe
    (
      map(value => this._htmlColumn.name !== name),
      tap(value => {
        if (value) {
          this._htmlColumn.nameWithoutEmit = name;
        }
      })
    );
  }

  /**
   * Update type property if changed
   */
  private updateType(type: string): Observable<boolean> {
    return of(type).pipe
    (
      map(value => this._htmlColumn.type.dataType !== value),
      tap(value => {
        if (value) {
          this._htmlColumn.type.setDatatypeWithoutEmit(type);
        }
      })
    );
  }

  /**
   * Update primaryKey property if changed
   */
  private updatePrimaryKey(primaryKey: boolean): Observable<boolean> {
    return of(primaryKey).pipe
    (
      map(value => this._htmlColumn.primaryKey !== value),
      tap(value => {
        if (value) {
          this._htmlColumn.primaryKeyWithoutEmit = primaryKey;
          this._updateForeignKeyByColumnNotifier$.next(this._htmlColumn);
        }
      })
    );
  }

  /**
   * Update foreignKey property if changed
   */
  private updateForeignKey(foreignKey: boolean): Observable<boolean> {
    return of(foreignKey).pipe
    (
      map(value => this._htmlColumn.foreignKey !== value),
      tap(value => {
        if (value) {
          this._htmlColumn.foreignKeyWithoutEmit = foreignKey;
        }
      })
    );
  }

  /**
   * Update nullable property if changed
   */
  private updateNullable(nullable: boolean): Observable<boolean> {
    return of(nullable).pipe
    (
      map(value => this._htmlColumn.nullable !== value),
      tap(value => {
        if (value) {
          this._htmlColumn.nullableWithoutEmit = nullable;
        }
      })
    );
  }

  /**
   * Update comment property if changed
   */
  private updateComment(comment: string): Observable<boolean> {
    return of(comment).pipe
    (
      map(value => this._htmlColumn.comment !== value),
      tap(value => {
        if (value) {
          this._htmlColumn.commentWithoutEmit = comment;
        }
      })
    );
  }

  /**
   * Update autoincrement property if changed
   *
   */
  private updateAutoincrement(autoincrement: boolean): Observable<boolean> {
    return of(autoincrement).pipe
    (
      map(value => this._htmlColumn.autoincrement !== value),
      tap(value => {
        if (value) {
          this._htmlColumn.autoincrementWithoutEmit = autoincrement;
        }
      })
    );
  }

  /**
   * Update unique property if changed
   */
  private updateUnique(unique: boolean): Observable<boolean> {
    return of(unique).pipe
    (
      map(value => this._htmlColumn.unique !== value),
      tap(value => {
        if (value) {
          this._htmlColumn.uniqueWithoutEmit = unique;
        }
      })
    );
  }

  get htmlColumn(): HtmlColumn {
    return this._htmlColumn;
  }
}
