import {Position} from '../../../graphics/position';
import {Cloneable} from '../../../intf/intf-clonable';

export class HtmlLine implements Cloneable<HtmlLine> {
  constructor(public start: Position,
              public end: Position,
              public showMarker: boolean = false,
              public focus: boolean = false) {
  }

  public doFocusIn(): void {
    this.focus = true;
  }

  public doFocusOut(): void {
    this.focus = false;
  }

  public clone(): HtmlLine {
    return new HtmlLine(this.start.clone(), this.end.clone(), this.showMarker, false);
  }
}
