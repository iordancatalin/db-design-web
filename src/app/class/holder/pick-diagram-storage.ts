import {HtmlDiagram} from '../model/html/diagram/html-diagram';
import {ValidationUtil} from '../ui/validation-util';

export class PickDiagramStorage {
  constructor(public pickOptions?: Array<HtmlDiagram>, public pickActive: boolean = false) {
  }

  public addPickOption(diagram: HtmlDiagram): void {
    if (ValidationUtil.isNullOrUndefined(this.pickOptions)) {
      this.pickOptions = [];
    }

    this.pickOptions.push(diagram);
  }

  public setPickOptions(options: Array<HtmlDiagram>): void {
    this.pickOptions = options;
  }
}
