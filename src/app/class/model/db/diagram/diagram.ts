import { AbstractDiagram } from '../../../model-abstract/diagram/abstract-diagram';
import { BasicDiagram } from '../../basic/diagram/basic-diagram';
import { ForeignKeyConstraint } from '../foreign-key/foreign-key-constraint';
import { Table } from '../table/table';

export class Diagram extends AbstractDiagram {
  public tables: Array<Table>;
  public foreignKeys: Array<ForeignKeyConstraint>;
  private _showStorageOptions = false;

  constructor(id: string) {
    super(id);
  }

  public toBasicObject(): BasicDiagram {
    return new BasicDiagram(this.name, this.owner, this.creationDate, this.share);
  }

  get showStorageOptions() {
    return this._showStorageOptions;
  }

  set showStorageOptions(value: boolean) {
    this._showStorageOptions = value;
  }
}
