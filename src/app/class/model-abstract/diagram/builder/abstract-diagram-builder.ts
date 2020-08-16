import { Position } from '../../../graphics/position';

export abstract class AbstractDiagramBuilder {
  protected _name: string;
  protected _creationDate: Date;
  protected _position: Position;
  protected _owner: string;
  protected _zoom: number;
  protected _shareList: Array<string> = [];

  public constructor(protected _id: string) {
  }

  public withCreationDate(creationDate: Date): any {
    this._creationDate = creationDate;
    return this;
  }

  public withName(name: string): any {
    this._name = name;
    return this;
  }

  public withPosition(postion: Position): any {
    this._position = postion;
    return this;
  }

  public withOwner(owner: string): any {
    this._owner = owner;
    return this;
  }

  public withZoom(zoom: number): any {
    this._zoom = zoom;
    return this;
  }

  public withShareList(value: Array<string>): any {
    this._shareList = value;
    return this;
  }
}
