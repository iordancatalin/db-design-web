import {AbstractColumnBuilder} from '../../../../model-abstract/column/builder/abstract-column-builder';
import {Column} from '../column';

export class ColumnBuilder extends AbstractColumnBuilder {
  private _type: string;

  public constructor(id: string) {
    super(id);
  }

  public withType(type: string): any {
    this._type = type;
    return this;
  }

  public build(): Column {
    const column: Column = new Column(this._id);

    column.nameWithoutEmit = this._name;
    column.type = this._type;
    column.defaultValueWithoutEmit = this._defaultValue;
    column.primaryKeyWithoutEmit = this._primaryKey;
    column.foreignKeyWithoutEmit = this._foreignKey;
    column.nullableWithoutEmit = this._nullable;
    column.autoincrementWithoutEmit = this._autoincrement;
    column.uniqueWithoutEmit = this._unique;
    column.commentWithoutEmit = this._comment;

    return column;
  }
}
