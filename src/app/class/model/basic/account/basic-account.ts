import { Color } from '../../../graphics/color';
import { Position } from 'src/app/class/graphics/position';
import { Cloneable } from 'src/app/class/intf/intf-clonable';
export class BasicAccount implements Cloneable<BasicAccount>{
  public constructor(public email: string,
    public color: Color,
    public position: Position,
    public zoom: number) {
  }

  clone(): BasicAccount {
    return new BasicAccount(this.email, this.color.clone(), this.position.clone(), this.zoom);
  }

  public equal(other: BasicAccount): boolean {
    if (!other) { return false; }

    return this.email === other.email;
  }
}
