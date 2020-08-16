import { AbstractDiagramBuilder } from '../../../../model-abstract/diagram/builder/abstract-diagram-builder';
import { ValidationUtil } from '../../../../ui/validation-util';
import { ForeignKeyConstraint } from '../../foreign-key/foreign-key-constraint';
import { Diagram } from '../diagram';
import { Table } from '../../table/table';

export class DiagramBuilder extends AbstractDiagramBuilder {
  private _tables: Array<Table> = [];
  private _foreignKeys: Array<ForeignKeyConstraint> = [];

  public constructor(id: string) {
    super(id);
  }

  public withTables(tables: Array<Table>): DiagramBuilder {
    this._tables = tables;
    return this;
  }

  public withForeignKeys(foreignKeys: Array<ForeignKeyConstraint>): DiagramBuilder {
    this._foreignKeys = foreignKeys;
    return this;
  }

  public build(): Diagram {
    if (!this._name) {
      throw new Error('Diagram name cannot be null or undefined');
    }

    const diagram: Diagram = new Diagram(this._id);

    diagram.nameWithoutEmit = this._name;
    diagram.tables = this._tables;
    diagram.foreignKeys = this._foreignKeys;
    diagram.positionWithoutEmit = this._position;
    diagram.owner = this._owner;
    diagram.creationDate = this._creationDate;
    diagram.share = this._shareList;

    return diagram;
  }
}
