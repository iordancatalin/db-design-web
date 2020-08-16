import {Subject} from 'rxjs/index';
import {CommonService} from '../../../../services/common.service';
import {ValidationUtil} from '../../../ui/validation-util';
import {CheckConstraint} from '../../db/check-constraint/check-constraint';
import {UniqueConstraint} from '../../db/unique-constraint/unique-constraint';
import {TableConstraint} from '../../db/table-constraint/table-constraint';
import {HtmlCheckConstraint} from '../check-constraint/html-check-constraint';
import {HtmlPrimaryKeyConstraint} from '../primary-key/html-primary-key-constraint';
import {HtmlUniqueConstraint} from '../unique-constraint/html-unique-constraint';

export class HtmlTableConstraint {
  private _id: string;
  private _primaryKeyConstraint: HtmlPrimaryKeyConstraint;
  private _checkConstraints: Array<HtmlCheckConstraint>;
  private _uniqueConstraints: Array<HtmlUniqueConstraint>;

  private _removeCheckConstraintSubject$: Subject<HtmlCheckConstraint> = new Subject();
  private _removeUniqueConstraintSubject$: Subject<HtmlUniqueConstraint> = new Subject();

  public constructor(private _tableId: string, private _diagramId: string) {
    this._primaryKeyConstraint = new HtmlPrimaryKeyConstraint(CommonService.createId(), _tableId, _diagramId);
  }

  public addEmptyCheckConstraint(): void {
    if (ValidationUtil.isNullOrUndefined(this._checkConstraints)) {
      this._checkConstraints = [];
    }

    if (this._checkConstraints.findIndex(val => val.extraConstraint) !== -1) {
      return;
    }

    const checkConstraint: HtmlCheckConstraint = new HtmlCheckConstraint(CommonService.createId(), this._tableId, this._diagramId);
    checkConstraint.extraConstraint = true;

    this.addHtmlCheckConstraint(checkConstraint);
  }

  public addEmptyUniqueConstraint(): void {
    if (ValidationUtil.isNullOrUndefined(this._uniqueConstraints)) {
      this._uniqueConstraints = [];
    }

    if (this._uniqueConstraints.findIndex(val => val.extraConstraint) !== -1) {
      return;
    }

    const uniqueConstraint: HtmlUniqueConstraint = new HtmlUniqueConstraint(CommonService.createId(), this._tableId, this._diagramId);
    uniqueConstraint.extraConstraint = true;

    this.addHtmlUniqueConstraint(uniqueConstraint);
  }

  public deleteCheckConstraint(checkConstraint: HtmlCheckConstraint): void {
    if (ValidationUtil.isNullOrUndefined(this._checkConstraints)) {
      return;
    }

    this.deleteCheckConstraintByPosition(this._checkConstraints.findIndex(val => val.equals(checkConstraint)));
  }

  private deleteCheckConstraintByPosition(position: number): void {
    if (!ValidationUtil.isNullOrUndefined(this._checkConstraints) && position >= 0 && position < this._checkConstraints.length) {
      const constraint = this._checkConstraints[position];
      this._checkConstraints.splice(position, 1);
      this._removeCheckConstraintSubject$.next(constraint);
    }
  }

  public deleteCheckConstraintWithoutEmit(checkConstraint: HtmlCheckConstraint): void {
    if (ValidationUtil.isNullOrUndefined(this._checkConstraints)) {
      return;
    }

    this.deleteCheckConstraintByPositionWithoutEmit(this._checkConstraints.findIndex(val => val.equals(checkConstraint)));
  }

  private deleteCheckConstraintByPositionWithoutEmit(position: number): void {
    if (!ValidationUtil.isNullOrUndefined(this._checkConstraints) && position >= 0 && position < this._checkConstraints.length) {
      const constraint = this._checkConstraints[position];
      this._checkConstraints.splice(position, 1);
    }
  }

  public deleteUniqueConstraint(uniqueConstraint: HtmlUniqueConstraint): void {
    if (ValidationUtil.isNullOrUndefined(this._uniqueConstraints)) {
      return;
    }

    this.deleteUniqueConstraintByPosition(this._uniqueConstraints.findIndex(val => val.equals(uniqueConstraint)));
  }

  private deleteUniqueConstraintByPosition(position: number): void {
    if (!ValidationUtil.isNullOrUndefined(this._uniqueConstraints) && position >= 0 && position < this._uniqueConstraints.length) {
      const constraint: HtmlUniqueConstraint = this._uniqueConstraints[position];
      this._uniqueConstraints.splice(position, 1);
      this._removeUniqueConstraintSubject$.next(constraint);
    }
  }

  public deleteUniqueConstraintWithoutEmit(uniqueConstraint: HtmlUniqueConstraint): void {
    if (ValidationUtil.isNullOrUndefined(this._uniqueConstraints)) {
      return;
    }

    this.deleteUniqueConstraintByPositionWithoutEmit(this._uniqueConstraints.findIndex(val => val.equals(uniqueConstraint)));
  }

  private deleteUniqueConstraintByPositionWithoutEmit(position: number): void {
    if (!ValidationUtil.isNullOrUndefined(this._uniqueConstraints) && position >= 0 && position < this._uniqueConstraints.length) {
      const constraint: HtmlUniqueConstraint = this._uniqueConstraints[position];
      this._uniqueConstraints.splice(position, 1);
    }
  }

  private deleteInvalidCheckConstraint(): void {
    if (ValidationUtil.isNullOrUndefined(this._checkConstraints)) {
      return;
    }

    this._checkConstraints.filter(val => val.extraConstraint || !val.isValid())
      .forEach(val => this.deleteCheckConstraintByPosition(this._checkConstraints.findIndex(check => check.equals(val))));
  }

  private deleteInvalidUniqueConstraint(): void {
    if (ValidationUtil.isNullOrUndefined(this._uniqueConstraints)) {
      return;
    }

    this._uniqueConstraints.filter(val => val.extraConstraint || !val.isValid())
      .forEach(val => this.deleteUniqueConstraintByPosition(this._uniqueConstraints.findIndex(unique => unique.equals(val))));
  }

  public validate(): void {
    this.deleteInvalidCheckConstraint();
    this.deleteInvalidUniqueConstraint();
  }

  public build(): TableConstraint {
    const tableConstraint: TableConstraint = new TableConstraint(this._id);

    tableConstraint.primaryKeyConstraint = this._primaryKeyConstraint.build();
    tableConstraint.checkConstraints = this.buildCheckConstraints();
    tableConstraint.uniqueConstraints = this.buildUniqueConstraints();

    return tableConstraint;
  }

  private buildUniqueConstraints(): Array<UniqueConstraint> {
    if (ValidationUtil.isNullOrUndefined(this._uniqueConstraints)) {
      return [];
    }

    return this._uniqueConstraints.filter(val => val.isValid()).map(val => val.build());
  }

  private buildCheckConstraints(): Array<CheckConstraint> {
    if (ValidationUtil.isNullOrUndefined(this._checkConstraints)) {
      return [];
    }

    return this._checkConstraints.filter(val => val.isValid()).map(val => val.build());
  }

  public addHtmlCheckConstraint(constraint: HtmlCheckConstraint): void {
    if (ValidationUtil.isNullOrUndefined(this._checkConstraints)) {
      this._checkConstraints = [];
    }

    if (this._checkConstraints.some(checkConstraint => checkConstraint.equals(constraint))) {
      return;
    }

    const position = this._checkConstraints.findIndex(value => value.extraConstraint);
    if (position !== -1) {
      this.deleteCheckConstraintByPositionWithoutEmit(position);
    }

    this._checkConstraints.push(constraint);
    constraint.tableId = this._tableId;

    if (position !== -1) {
      this.addEmptyCheckConstraint();
    }
  }

  public addHtmlUniqueConstraint(constraint: HtmlUniqueConstraint): void {
    if (ValidationUtil.isNullOrUndefined(this._uniqueConstraints)) {
      this._uniqueConstraints = [];
    }

    if (this._uniqueConstraints.some(uniqueConstraint => uniqueConstraint.equals(constraint))) {
      return;
    }

    const position = this._uniqueConstraints.findIndex(value => value.extraConstraint);
    if (position !== -1) {
      this.deleteUniqueConstraintByPositionWithoutEmit(position);
    }

    this._uniqueConstraints.push(constraint);
    constraint.tableId = this._tableId;

    if (position !== -1) {
      this.addEmptyUniqueConstraint();
    }
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get primaryKeyConstraint(): HtmlPrimaryKeyConstraint {
    return this._primaryKeyConstraint;
  }

  set primaryKeyConstraint(value: HtmlPrimaryKeyConstraint) {
    this._primaryKeyConstraint = value;
  }

  get checkConstraints(): Array<HtmlCheckConstraint> {
    return this._checkConstraints;
  }

  set checkConstraints(value: Array<HtmlCheckConstraint>) {
    this._checkConstraints = value;
  }

  get uniqueConstraints(): Array<HtmlUniqueConstraint> {
    return this._uniqueConstraints;
  }

  set uniqueConstraints(value: Array<HtmlUniqueConstraint>) {
    this._uniqueConstraints = value;
  }

  get removeCheckConstraintSubject$(): Subject<HtmlCheckConstraint> {
    return this._removeCheckConstraintSubject$;
  }

  set removeCheckConstraintSubject$(value: Subject<HtmlCheckConstraint>) {
    this._removeCheckConstraintSubject$ = value;
  }

  get removeUniqueConstraintSubject$(): Subject<HtmlUniqueConstraint> {
    return this._removeUniqueConstraintSubject$;
  }

  set removeUniqueConstraintSubject$(value: Subject<HtmlUniqueConstraint>) {
    this._removeUniqueConstraintSubject$ = value;
  }

  get tableId(): string {
    return this._tableId;
  }

  set tableId(value: string) {
    this._tableId = value;
  }
}
