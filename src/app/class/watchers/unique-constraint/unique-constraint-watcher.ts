import {forkJoin, Observable, of, Subject} from 'rxjs/index';
import {map, tap} from 'rxjs/internal/operators';
import {BuilderFactory} from '../../factory/builder-factory';
import {UniqueConstraint} from '../../model/db/unique-constraint/unique-constraint';
import {HtmlUniqueConstraint} from '../../model/html/unique-constraint/html-unique-constraint';
export class UniqueConstraintWatcher {

  private _htmlUniqueConstraint: HtmlUniqueConstraint;

  public constructor(private _newUniqueConstraintNotifier$: Subject<HtmlUniqueConstraint>,
                     private _tableId: string,
                     private _diagramId: string) {

  }

  public start(uniqueConstraint: UniqueConstraint): void {

    if (!this._htmlUniqueConstraint) {
      this.build(uniqueConstraint).subscribe(constraint => {
        this._htmlUniqueConstraint = constraint;
        this._newUniqueConstraintNotifier$.next(constraint);
      });
    } else {
      this.update(uniqueConstraint).subscribe();
    }
  }

  private build(uniqueConstraint: UniqueConstraint): Observable<HtmlUniqueConstraint> {
    return of(BuilderFactory.buildShallowHtmlUniqueConstraint(uniqueConstraint, this._tableId, this._diagramId));
  }

  private update(uniqueConstraint: UniqueConstraint): Observable<boolean> {
    return forkJoin
    (
      this.updateName(uniqueConstraint.name),
      this.updateTextColumns(uniqueConstraint.columns.join(','))
    ).pipe
    (
      map(values => values.some(value => value))
    );
  }

  private updateName(name: string): Observable<boolean> {
    return of(name).pipe
    (
      map(value => this._htmlUniqueConstraint.name !== value),
      tap(value => {
        if (value) {
          this._htmlUniqueConstraint.nameWithoutEmit = name;
        }
      })
    );
  }

  private updateTextColumns(textColumns: string): Observable<boolean> {
    return of(textColumns).pipe
    (
      map(value => this._htmlUniqueConstraint.textColumns !== value),
      tap(value => {
        if (value) {
          this._htmlUniqueConstraint.textColumnsWithoutEmit = textColumns;
        }
      })
    );
  }

  get htmlUniqueConstraint(): HtmlUniqueConstraint {
    return this._htmlUniqueConstraint;
  }
}
