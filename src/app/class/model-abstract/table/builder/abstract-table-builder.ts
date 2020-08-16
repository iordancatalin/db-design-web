import {Position} from '../../../graphics/position';
import { TABLE_DEFAULT_WIDTH } from 'src/app/class/constants/constants';

export abstract class AbstractTableBuilder {
  protected _name: string;
  protected _position: Position;
  protected _comment: string;
  protected _width: number = TABLE_DEFAULT_WIDTH;
  protected _editableMode: boolean;

  public constructor(protected _id: string) {
  }

  public withName(name: string): any {
    this._name = name;
    return this;
  }

  public withPosition(position: Position): any {
    this._position = position;
    return this;
  }

  public withComment(comment: string): any {
    this._comment = comment;
    return this;
  }

  public withEditableMode(editableMode: boolean): any {
    this._editableMode = editableMode;
    return this;
  }

  public withWidth(width: number): any {
    this._width = width;
    return this;
  }
}
