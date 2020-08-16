import {PositionStatus} from '../enum/position-status';
export class OccupationModel {
  public leftLastOccupied: PositionStatus;
  public rightLastOccupied: PositionStatus;
  public leftOccupation: Occupation = new Occupation();
  public rightOccupation: Occupation = new Occupation();
}

export class Occupation {
  constructor(public top: boolean = false,
              public middle: boolean = false,
              public bottom: boolean = false) {
  }
}
