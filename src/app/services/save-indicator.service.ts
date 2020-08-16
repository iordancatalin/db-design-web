import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveIndicatorService {
  private _subject: Subject<boolean> = new Subject();

  constructor() {}

  public emit(value: boolean): void {
    this._subject.next(value);
  }

  public get subject(): Subject<boolean> {
    return this._subject;
  }
}
