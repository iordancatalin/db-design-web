import { getDummyPosition } from '../../../../constants/constants';
import { AbstractTableBuilder } from '../../../../model-abstract/table/builder/abstract-table-builder';
import { ValidationUtil } from '../../../../ui/validation-util';
import { Column } from '../../column/column';
import { CheckConstraint } from '../../check-constraint/check-constraint';
import { UniqueConstraint } from '../../unique-constraint/unique-constraint';
import { Table } from '../table';

export class TableBuilder extends AbstractTableBuilder {
  private _columns: Array<Column>;
  private _primaryKeyName: string;
  private _checkConstraints: Array<CheckConstraint>;
  private _uniqueConstraints: Array<UniqueConstraint>;

  public constructor(id: string) {
    super(id);
  }

  public withColumns(columns: Column[]): TableBuilder {
    this._columns = columns;
    return this;
  }

  public withPrimaryKeyName(constraint: string): TableBuilder {
    this._primaryKeyName = constraint;
    return this;
  }

  public withCheckConstraints(checkConstraints: Array<CheckConstraint>): TableBuilder {
    this._checkConstraints = checkConstraints;
    return this;
  }

  public withUniqueConstraints(uniqueConstraints: Array<UniqueConstraint>): TableBuilder {
    this._uniqueConstraints = uniqueConstraints;
    return this;
  }

  public build(): Table {
    if (!this._name) { this._name = 'table_1'; }

    if (!this._position) { this._position = getDummyPosition(); }

    const table: Table = new Table(this._id);

    table.nameWithoutEmit = this._name;
    table.primaryKeyName = this._primaryKeyName;
    table.checkConstraints = this._checkConstraints;
    table.uniqueConstraints = this._uniqueConstraints;
    table.columns = this._columns;
    table.positionWithoutEmit = this._position;
    table.widthWithoutEmit = this._width;
    table.editableModeWithoutEmit = this._editableMode;
    table.commentWithoutEmit = this._comment;

    return table;
  }
}
