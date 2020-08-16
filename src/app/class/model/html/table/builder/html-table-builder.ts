import { getZIndex, TABLE_DEFAULT_WIDTH } from '../../../../constants/constants';
import { Position } from '../../../../graphics/position';
import { AbstractTableBuilder } from '../../../../model-abstract/table/builder/abstract-table-builder';
import { HtmlColumn } from '../../column/html-column';
import { HtmlTable } from '../html-table';

export class HtmlTableBuilder extends AbstractTableBuilder {
  private _columns: Array<HtmlColumn>;
  private _zIndex: number;
  private _primaryKeyName: string;

  public constructor(id: string, private _diagramId: string) {
    super(id);
  }

  public withColumns(htmlColumns: Array<HtmlColumn>): HtmlTableBuilder {
    this._columns = htmlColumns;
    return this;
  }

  public withZIndex(zIndex: number): HtmlTableBuilder {
    this._zIndex = zIndex;
    return this;
  }

  public withPrimaryKeyName(value: string): HtmlTableBuilder {
    this._primaryKeyName = value;
    return this;
  }

  public build(): HtmlTable {
    if (!this._name) { throw new Error('Table name cannot be null or undefined'); }

    if (!this._position) { this._position = new Position(0, 0); }

    if (this._zIndex) { this._zIndex = getZIndex(); }

    const table: HtmlTable = new HtmlTable(this._id, this._diagramId);

    table.nameWithoutEmit = this._name;
    table.htmlColumns = this._columns;
    table.zIndex = this._zIndex;
    table.positionWithoutEmit = this._position;
    table.widthWithoutEmit = !this._width ? TABLE_DEFAULT_WIDTH : this._width;
    table.commentWithoutEmit = this._comment;
    table.tableConstraint.primaryKeyConstraint.name = this._primaryKeyName;
    table.widthWithoutEmit = this._width;

    return table;
  }
}
