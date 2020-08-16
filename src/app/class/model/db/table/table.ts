import { AbstractTable } from '../../../model-abstract/table/abstract-table';
import { ValidationUtil } from '../../../ui/validation-util';
import { BasicTable } from '../../basic/table/basic-table';
/**
 * Model class
 */
import { Column } from '../column/column';
import { CheckConstraint } from '../check-constraint/check-constraint';
import { UniqueConstraint } from '../unique-constraint/unique-constraint';

export class Table extends AbstractTable {
  private _primaryKeyName = '';
  private _columns: Array<Column>;
  private _checkConstraints: Array<CheckConstraint>;
  private _uniqueConstraints: Array<UniqueConstraint>;
  private _selected = true;
  private _active = false;

  constructor(id: string) { super(id); }

  public toBasicObject(): BasicTable {
    return new BasicTable(this.name,
      this.primaryKeyName,
      this.width,
      this.comment,
      // this.editableMode,
      this.position);
  }

  public findTableIndex(table: AbstractTable): number {
    if (!ValidationUtil.isNullOrUndefined(this.columns)) {
      return -1;
    }

    return this.columns.findIndex(val => val.equals(table));
  }

  get primaryKeyName(): string {
    return this._primaryKeyName;
  }

  set primaryKeyName(value: string) {
    this._primaryKeyName = value;
  }

  get columns(): Array<Column> {
    return this._columns;
  }

  set columns(value: Array<Column>) {
    this._columns = value;
  }

  get checkConstraints(): Array<CheckConstraint> {
    return this._checkConstraints;
  }

  set checkConstraints(value: Array<CheckConstraint>) {
    this._checkConstraints = value;
  }

  get uniqueConstraints(): Array<UniqueConstraint> {
    return this._uniqueConstraints;
  }

  set uniqueConstraints(value: Array<UniqueConstraint>) {
    this._uniqueConstraints = value;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }
}
