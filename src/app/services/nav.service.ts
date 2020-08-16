import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private _subject: Subject<string> = new Subject();

  constructor() {}

  public emit(value: string) {
    this._subject.next(value);
  }

  public get subject(): Subject<string> {
    return this._subject;
  }
}
