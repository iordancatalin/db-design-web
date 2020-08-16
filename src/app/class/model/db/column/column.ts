import { AbstractColumn } from '../../../model-abstract/column/abstract-column';
import { BasicColumn } from '../../basic/column/basic-column';

export class Column extends AbstractColumn {
  private _type: string;
  private _selected = true;

  public constructor(id: string) {
    super(id);
  }

  public toBasicObject(): BasicColumn {
    return new BasicColumn(this.name,
      this._type,
      this.defaultValue,
      this.primaryKey,
      this.foreignKey,
      this.nullable,
      this.autoincrement,
      this.unique,
      this.comment);
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

}
