import { Cloneable } from "../intf/intf-clonable";

export class Color implements Cloneable<Color> {
  public constructor(private _red: number, private _green: number, private _blue: number) {
  }

  get red(): number {
    return this._red;
  }

  set red(value: number) {
    this._red = value;
  }

  get green(): number {
    return this._green;
  }

  set green(value: number) {
    this._green = value;
  }

  get blue(): number {
    return this._blue;
  }

  set blue(value: number) {
    this._blue = value;
  }

  clone(): Color {
    return new Color(this._red, this._green, this._blue);
  }
}
