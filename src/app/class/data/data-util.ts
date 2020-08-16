import {getZIndex} from '../constants/constants';
import {Position} from '../graphics/position';
export class DiagramTool {
  constructor(public icon: string,
              public active: boolean,
              public defaultAction: boolean,
              public description: string,
              public doClick?: Function,
              public activeIcon?: string) {
  }
}

export class SplitModel {
  constructor(public sideOne: number,
              public sideSecond: number,
              public separator: number,
              public active: boolean,
              public dragging: boolean) {
  }

  public initialize(value: number): void {
    this.sideOne = this.sideSecond = this.separator = value;
  }
}

export class DiagramOptions {
  constructor(public enable: boolean = false,
              public position: Position = new Position(0, 0),
              public zIndex: number = getZIndex(),
              public calibrate: boolean = false) {
  }

  public updatePosition(left: number, top: number) {
    this.position.left = left;
    this.position.top = top;
  }

  public updateZIndex(): void {
    this.zIndex = getZIndex();
  }

  public reset(): void {
    this.enable = this.calibrate = false;
  }

  public isVisible(): boolean {
    return this.enable && this.calibrate;
  }
}
