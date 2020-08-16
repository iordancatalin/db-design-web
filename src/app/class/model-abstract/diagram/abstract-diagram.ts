import { Position } from '../../graphics/position';
import { BasicAccount } from '../../model/basic/account/basic-account';
import { ValidationUtil } from '../../ui/validation-util';
import { AbstractComponent } from '../abstract-component';
import { getSuperPosition } from '../../constants/constants';

export abstract class AbstractDiagram extends AbstractComponent {
  private _creationDate: Date = new Date();
  private _position: Position = getSuperPosition();
  private _owner: string;
  private _zoom: number = 1;
  private _share: Array<string> = [];

  public constructor(id: string) { super(id); }

  public equals(other: any): boolean {
    if (!other) { return false; }

    return this.id === other.id;
  }

  get creationDate(): Date { return this._creationDate; }

  set creationDate(value: Date) { this._creationDate = value; }

  get position(): Position { return this._position; }

  set position(value: Position) { this._position = value; }

  get owner(): string { return this._owner; }

  set owner(value: string) { this._owner = value; }

  get share(): Array<string> { return this._share; }

  set share(value: Array<string>) { this._share = value; }

  set positionWithoutEmit(value: Position) { this._position = value; }

  get zoom() { return this._zoom; }

  set zoom(value: number) { this._zoom = value; }

  set zoomWhitoutEmit(value: number) { this._zoom = value; }
}
