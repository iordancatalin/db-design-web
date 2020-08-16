import {Cloneable} from '../intf/intf-clonable';
import {ValidationUtil} from '../ui/validation-util';

export class Position implements Cloneable<Position> {
  constructor(public left: number, public top: number) {
  }

  public equals(other: Position): boolean {
    if (ValidationUtil.isNullOrUndefined(other)) {
      return false;
    }

    return this.left === other.left && this.top === other.top;
  }

  public clone(): Position {
    return new Position(this.left, this.top);
  }
}
