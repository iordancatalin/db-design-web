import {AbstractColumnBuilder} from '../../../../model-abstract/column/builder/abstract-column-builder';
import {HtmlDataType} from '../../accessory/html-data-type';
import {HtmlColumn} from '../html-column';

/**
 * Builder class for HtmlColumn
 */
export class HtmlColumnBuilder extends AbstractColumnBuilder {
  private _type: HtmlDataType;
  private _extraColumn: boolean;

  public constructor(id: string,
                     private _tableId: string,
                     private _diagramId: string) {
    super(id);
  }

  public withType(type: HtmlDataType): HtmlColumnBuilder {
    this._type = type;
    return this;
  }

  public withExtraColumn(extraColumn: boolean): HtmlColumnBuilder {
    this._extraColumn = extraColumn;
    return this;
  }

  public build(): HtmlColumn {
    const column: HtmlColumn = new HtmlColumn(this._id, this._tableId, this._diagramId);

    column.nameWithoutEmit = this._name;
    column.type = this._type;
    column.primaryKeyWithoutEmit = this._primaryKey;
    column.foreignKeyWithoutEmit = this._foreignKey;
    column.nullableWithoutEmit = this._nullable;
    column.autoincrementWithoutEmit = this._autoincrement;
    column.uniqueWithoutEmit = this._unique;
    column.defaultValueWithoutEmit = this._defaultValue;
    column.commentWithoutEmit = this._comment;
    column.extraColumnWithoutEmit = this._extraColumn;

    return column;
  }
}
