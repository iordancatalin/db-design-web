import {AbstractUniqueConstraint} from '../../../model-abstract/unique-constraint/abstract-uniques-constraint';
import {BasicUniqueConstraint} from '../../basic/unique-constraint/basic-unique-constraint';

export class UniqueConstraint extends AbstractUniqueConstraint {
  private _columns: Array<string>;

  public toBasicObject(): BasicUniqueConstraint {
    return new BasicUniqueConstraint(this.name, this.columns);
  }

  get columns(): Array<string> {
    return this._columns;
  }

  set columns(value: Array<string>) {
    this._columns = value;
  }
}
