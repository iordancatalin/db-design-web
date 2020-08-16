import { Subject } from 'rxjs/index';
import { ValidationUtil } from '../ui/validation-util';

export abstract class AbstractComponent {
  protected _subject$: Subject<AbstractComponent> = new Subject();

  protected constructor(protected _id: string, protected _name?: string) {}

  public equals(other: AbstractComponent): boolean {
    if (ValidationUtil.isNullOrUndefined(other)) {
      return false;
    }

    return this._id === other._id;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
    this.emit();
  }

  public emit(): void {
    this._subject$.next(this);
  }

  set nameWithoutEmit(value: string) {
    this._name = value;
  }
}
