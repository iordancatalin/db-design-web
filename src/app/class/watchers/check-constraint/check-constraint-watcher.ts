import {forkJoin, Observable, of, Subject} from 'rxjs/index';
import {map, tap} from 'rxjs/internal/operators';
import {BuilderFactory} from '../../factory/builder-factory';
import {CheckConstraint} from '../../model/db/check-constraint/check-constraint';
import {HtmlCheckConstraint} from '../../model/html/check-constraint/html-check-constraint';
import {ValidationUtil} from '../../ui/validation-util';

export class CheckConstraintWatcher {

  private _htmlCheckConstraint: HtmlCheckConstraint;

  public constructor(private _newCheckConstraintNotifier$: Subject<HtmlCheckConstraint>,
                     private _tableId: string,
                     private _diagramId: string) {
  }

  public start(checkConstraint: CheckConstraint): void {
    if (ValidationUtil.isNullOrUndefined(this._htmlCheckConstraint)) {
      this.build(checkConstraint).subscribe(constraint => {
        this._htmlCheckConstraint = constraint;
        this._newCheckConstraintNotifier$.next(this._htmlCheckConstraint);
      });
    } else {
      this.update(checkConstraint).subscribe();
    }
  }

  private build(checkConstraint: CheckConstraint): Observable<HtmlCheckConstraint> {
    return of(BuilderFactory.buildShallowHtmlCheckConstraint(checkConstraint, this._tableId, this._diagramId));
  }

  private update(checkConstraint: CheckConstraint): Observable<boolean> {
    return forkJoin
    (
      this.updateName(checkConstraint.name),
      this.updateExpression(checkConstraint.expression)
    ).pipe
    (
      map(values => values.some(value => value))
    );
  }

  private updateName(name: string): Observable<boolean> {
    return of(name).pipe
    (
      map(value => this._htmlCheckConstraint.name !== value),
      tap(value => {
        if (value) {
          this._htmlCheckConstraint.nameWithoutEmit = name;
        }
      })
    );
  }

  private updateExpression(expression: string): Observable<boolean> {
    return of(expression).pipe
    (
      map(value => this._htmlCheckConstraint.expression !== value),
      tap(value => {
        if (value) {
          this._htmlCheckConstraint.expressionWithoutEmit = expression;
        }
      })
    );
  }

  get htmlCheckConstraint(): HtmlCheckConstraint {
    return this._htmlCheckConstraint;
  }
}
