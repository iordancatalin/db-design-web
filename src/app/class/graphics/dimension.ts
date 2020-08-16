import {Cloneable} from '../intf/intf-clonable';
import {ValidationUtil} from '../ui/validation-util';

export class Dimension implements Cloneable<Dimension> {
  constructor(public width: number, public height: number) {
  }

  public clone(): Dimension {
    return new Dimension(this.width, this.height);
  }

  public equals(other: Dimension): boolean {
    if (ValidationUtil.isNullOrUndefined(other)) {
      return false;
    }

    return this.width === other.width && this.height === other.height;
  }
}
