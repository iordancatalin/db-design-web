import { TABLE_DEFAULT_WIDTH } from '../../constants/constants';
import { Position } from '../../graphics/position';
import { AbstractComponent } from '../abstract-component';

export abstract class AbstractTable extends AbstractComponent {
  private _comment: string;
  private _width: number = TABLE_DEFAULT_WIDTH;
  private _editableMode = false;
  private _position: Position;

  public constructor(id: string) {
    super(id);
  }

  public equals(other: any): boolean {
    if (!other) { return false; }

    return this.id === other.id;
  }

  get comment(): string {
    return this._comment;
  }

  set comment(value: string) {
    this._comment = value;
    this.emit();
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
    this.emit();
  }

  get editableMode(): boolean {
    return this._editableMode;
  }

  set editableMode(value: boolean) {
    this._editableMode = value;
    //    this.subject$.next ( this );
  }

  get position(): Position {
    return this._position;
  }

  set position(value: Position) {
    this._position = value;
    this.emit();
  }

  set commentWithoutEmit(value: string) {
    this._comment = value;
  }

  set widthWithoutEmit(value: number) {
    this._width = value;
  }

  set editableModeWithoutEmit(value: boolean) {
    this._editableMode = value;
  }

  set positionWithoutEmit(value: Position) {
    this._position = value;
  }
}
