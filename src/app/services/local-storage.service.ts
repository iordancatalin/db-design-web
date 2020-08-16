import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/index';
import { User } from '../class/intf/user-interface';
import { HtmlDiagram } from '../class/model/html/diagram/html-diagram';
import { DiagramPayload } from '../class/payload/diagram-payload';
import { toDiagramPayload } from '../class/adapter/diagram-adapter';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private _watchCurrentNavOption: Subject<number> = new Subject();

  constructor() {}

  public writeAccountSynchronously(user: User): void {
    localStorage.setItem('currentAccount', JSON.stringify(user));
  }

  public readCurrentAccount(): User {
    const currentUser = localStorage.getItem('currentAccount');

    if (currentUser) {
      return JSON.parse(localStorage.getItem('currentAccount'));
    }

    return null;
  }

  public existsCurrentAccount(): boolean {
    return localStorage.getItem('currentAccount') ? true : false;
  }

  public removeCurrentAccount(): void {
    localStorage.removeItem('currentAccount');
  }

  public writeDiagram(diagram: HtmlDiagram) {
    let diagrams: Array<DiagramPayload> = this.readDiagrams();

    if (!diagrams) {
      diagrams = [];
    }

    if (!diagrams.some(payload => payload.uid === diagram.id)) {
      diagrams.push(toDiagramPayload(diagram));
    }

    localStorage.setItem('diagrams', JSON.stringify(diagrams));
  }

  public removeDiagram(diagram: HtmlDiagram) {
    let diagrams: Array<DiagramPayload> = this.readDiagrams();

    if (!diagrams) {
      diagrams = [];
    }

    const index = diagrams.findIndex(payload => payload.uid === diagram.id);

    if (index !== -1) {
      diagrams.splice(index, 1);
    }

    localStorage.setItem('diagrams', JSON.stringify(diagrams));
  }

  public readDiagrams(): Array<DiagramPayload> {
    return JSON.parse(localStorage.getItem('diagrams'));
  }

  public deleteDiagrams(): void {
    localStorage.removeItem('diagrams');
  }
}
