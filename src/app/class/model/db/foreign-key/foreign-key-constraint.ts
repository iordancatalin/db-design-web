import {AbstractForeignKeyConstraint} from '../../../model-abstract/foreign-key/abstract-foreign-key-constraint';
import {BasicForeignKeyConstraint} from '../../basic/foreign-key/basic-foreign-key-constraint';
import {Relation} from '../accessory/relation';

export class ForeignKeyConstraint extends AbstractForeignKeyConstraint {
  private _parentTableId: string;
  private _childTableId: string;
  private _relations: Array<Relation>;

  public constructor(id: string) {
    super(id);
  }

  public toBasicObject(): BasicForeignKeyConstraint {
    return new BasicForeignKeyConstraint(this.name,
      this.comment,
      this.childTableId,
      this.parentTableId,
      this.relations);
  }

  get parentTableId(): string {
    return this._parentTableId;
  }

  set parentTableId(value: string) {
    this._parentTableId = value;
  }

  get childTableId(): string {
    return this._childTableId;
  }

  set childTableId(value: string) {
    this._childTableId = value;
  }

  get relations(): Array<Relation> {
    return this._relations;
  }

  set relations(value: Array<Relation>) {
    this._relations = value;
  }
}
