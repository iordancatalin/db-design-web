import {Observable} from 'rxjs/index';
import {DirectionEnum} from '../../../enum/direction-enum';
import {ForeignKeyZone} from '../../../enum/foreign-key-zone';
import {PositionStatus} from '../../../enum/position-status';
import {Occupation} from '../../../graphics/occupation-model';
import {AbstractForeignKeyConstraint} from '../../../model-abstract/foreign-key/abstract-foreign-key-constraint';
import {ValidationUtil} from '../../../ui/validation-util';
import {Relation} from '../../db/accessory/relation';
import {ForeignKeyConstraint} from '../../db/foreign-key/foreign-key-constraint';
import {HtmlLine} from '../accessory/html-line';
import {HtmlRelation} from '../accessory/html-relation';
import {PartRelation} from '../accessory/part-relation';
import {HtmlColumn} from '../column/html-column';
import {HtmlTable} from '../table/html-table';

export class HtmlForeignKey extends AbstractForeignKeyConstraint {
  private _lines: Array<HtmlLine>;
  private _relations: Array<HtmlRelation>;
  private _childTable: HtmlTable;
  private _parentTable: HtmlTable;
  private _foreignKeyZone: ForeignKeyZone = null;
  private _showMore = false;

  public constructor(id: string, private _diagramId: string) {
    super(id);
  }

  private static freePartRelation(part: PartRelation): void {
    if (part.direction === DirectionEnum.LEFT) {
      HtmlForeignKey.freeOccupation(part.column.occupationModel.leftOccupation, part.status);
    } else if (part.direction === DirectionEnum.RIGHT) {
      HtmlForeignKey.freeOccupation(part.column.occupationModel.rightOccupation, part.status);
    }
  }

  private static freeOccupation(occupation: Occupation, status: PositionStatus): void {
    if (status === PositionStatus.TOP && occupation.top) {
      occupation.top = false;
    } else if (status === PositionStatus.MIDDLE && occupation.middle) {
      occupation.middle = false;
    } else if (status === PositionStatus.BOTTOM && occupation.bottom) {
      occupation.bottom = false;
    }
  }

  public valid(): boolean {
    if (ValidationUtil.isNullOrUndefined(this._childTable)) {
      return false;
    }

    if (ValidationUtil.isNullOrUndefined(this._parentTable)) {
      return false;
    }

    if (ValidationUtil.isNullOrUndefined(this._relations) || ValidationUtil.isArrayEmpty(this._relations)) {
      return false;
    }

    return !this._relations.some(value => ValidationUtil.isNullOrUndefined(value.childPart.column) ||
    ValidationUtil.isNullOrUndefined(value.parentPart.column));

  }

  public removeRelation(htmlRelation: HtmlRelation): void {
    if (ValidationUtil.isNullOrUndefined(this._relations)) {
      return;
    }

    const position = this._relations.findIndex(value => value.childPart.column.equals(htmlRelation.childPart.column) &&
    value.parentPart.column.equals(htmlRelation.parentPart.column));

    if (position !== -1) {
      this._relations.splice(position, 1);
    }
  }

  public addLine(line: HtmlLine): void {
    if (ValidationUtil.isNullOrUndefined(this._lines)) {
      this._lines = [];
    }

    this._lines.push(line);
  }

  public freeForeignKeyColumnsExceptTable(table: HtmlTable): void {
    if (this._childTable.equals(table)) {
      this._relations.map(value => value.parentPart).forEach(value => HtmlForeignKey.freePartRelation(value));
    }

    if (this._parentTable.equals(table)) {
      this._relations.map(value => value.childPart).forEach(value => HtmlForeignKey.freePartRelation(value));
    }
  }

  public addRelation(relation: HtmlRelation): void {
    if (ValidationUtil.isNullOrUndefined(this._relations)) {
      this._relations = [];
    }

    this._relations.push(relation);
  }

  public freeForeignKeyColumns() {
    this._relations.forEach(value => {
      HtmlForeignKey.freePartRelation(value.childPart);
      HtmlForeignKey.freePartRelation(value.parentPart);
      value.childPart.column.foreignKey = false;
      value.childPart.column.type = value.childPart.column.type.clone();
    });
  }

  public freeForeignKeyColumnsWithoutEmit(){
    this._relations.forEach(value => {
      HtmlForeignKey.freePartRelation(value.childPart);
      HtmlForeignKey.freePartRelation(value.parentPart);
      value.childPart.column.foreignKeyWithoutEmit = false;
      value.childPart.column.type = value.childPart.column.type.clone();
    });
  }

  public deleteRelationsByColumn(column: HtmlColumn): void {
    for (let i = 0; i < this._relations.length; i++) {
      const value = this._relations[i];

      if (!value.childPart.column.equals(column) && !value.parentPart.column.equals(column)) {
        continue;
      }

      if (value.parentPart.column.equals(column)) {
        if (value.childPart.direction === DirectionEnum.LEFT) {
          HtmlForeignKey.freeOccupation(value.childPart.column.occupationModel.leftOccupation, value.childPart.status);
        } else if (value.childPart.direction === DirectionEnum.RIGHT) {
          HtmlForeignKey.freeOccupation(value.childPart.column.occupationModel.rightOccupation, value.childPart.status);
        }
      } else if (value.childPart.column.equals(column)) {
        if (value.parentPart.direction === DirectionEnum.LEFT) {
          HtmlForeignKey.freeOccupation(value.parentPart.column.occupationModel.leftOccupation, value.parentPart.status);
        } else if (value.parentPart.direction === DirectionEnum.RIGHT) {
          HtmlForeignKey.freeOccupation(value.parentPart.column.occupationModel.rightOccupation, value.parentPart.status);
        }
      }

      value.childPart.column.foreignKeyWithoutEmit = false;

      this._relations.splice(i, 1);
      i--;
    }
  }

  public build(): ForeignKeyConstraint {
    const constraint: ForeignKeyConstraint = new ForeignKeyConstraint(this.id);

    constraint.name = this._name;
    constraint.comment = this._comment;
    constraint.childTableId = this._childTable.id;
    constraint.parentTableId = this._parentTable.id;
    constraint.relations = this.buildRelations();

    return constraint;
  }

  private buildRelations(): Array<Relation> {
    if (ValidationUtil.isNullOrUndefined(this._relations)) {
      return [];
    }

    const relations: Array<Relation> = [];

    this._relations.forEach(val => relations.push(new Relation(val.childPart.column.id, val.parentPart.column.id)));

    return relations;
  }

  get lines(): Array<HtmlLine> {
    return this._lines;
  }

  set lines(value: Array<HtmlLine>) {
    this._lines = value;
  }

  get relations(): Array<HtmlRelation> {
    return this._relations;
  }

  set relations(value: Array<HtmlRelation>) {
    this._relations = value;
  }

  get childTable(): HtmlTable {
    return this._childTable;
  }

  set childTable(value: HtmlTable) {
    this._childTable = value;
  }

  get parentTable(): HtmlTable {
    return this._parentTable;
  }

  set parentTable(value: HtmlTable) {
    this._parentTable = value;
  }

  get foreignKeyZone(): ForeignKeyZone {
    return this._foreignKeyZone;
  }

  set foreignKeyZone(value: ForeignKeyZone) {
    this._foreignKeyZone = value;
  }

  get diagramId(): string {
    return this._diagramId;
  }

  set diagramId(value: string) {
    this._diagramId = value;
  }

  get subject$(): Observable<any> {
    return this._subject$;
  }

  get showMore(): boolean {
    return this._showMore;
  }

  set showMore(value: boolean) {
    this._showMore = value;
  }
}
