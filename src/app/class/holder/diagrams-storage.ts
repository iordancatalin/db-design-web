import { BehaviorSubject, from, Subject, Subscription } from 'rxjs/index';
import { FirestoreInterceptorService } from '../../services/firestore/firestore-interceptor.service';
import { HtmlForeignKey } from '../model/html/foreign-key/html-foreign-key';
import { HtmlDiagram } from '../model/html/diagram/html-diagram';
import { HtmlTable } from '../model/html/table/html-table';
import { ValidationUtil } from '../ui/validation-util';
import { DiagramWatcher } from '../watchers/diagram/diagram-watcher';
import { tap } from 'rxjs/internal/operators/tap';
import { LocalStorageService } from 'src/app/services/local-storage.service';

export class DiagramsStorage {
  private _notifyForForeignKeyUpdate$: BehaviorSubject<HtmlForeignKey> = new BehaviorSubject(null);
  private _notifyUpdateFksByTable$: Subject<HtmlTable> = new Subject();
  public _diagramWatcher: DiagramWatcher;
  public _diagramsChanged$: Subject<HtmlDiagram> = new Subject();

  constructor(private _firestoreInterceptorService: FirestoreInterceptorService,
    private _localStorageService: LocalStorageService,
    private _diagrams?: Array<HtmlDiagram>,
    private _openDiagram?: HtmlDiagram,
    private _width: number = 100) {
  }

  public addDiagram(diagram: HtmlDiagram): void {
    if (!this._diagrams) { this._diagrams = []; }

    this._diagrams.push(diagram);
    this._localStorageService.writeDiagram(diagram);
    this._diagramsChanged$.next(diagram);
  }

  public removeDiagram(diagram: HtmlDiagram): void {
    if (!this._diagrams) { return; }

    const position = this._diagrams.findIndex(value => value.equals(diagram));
    if (position !== -1) {
      this._diagrams.splice(position, 1);
      this._localStorageService.removeDiagram(diagram);
      this._diagramsChanged$.next(diagram);
    }
  }

  public setOpenDiagram(diagram: HtmlDiagram): void {

    if (this._diagramWatcher) { this._diagramWatcher.unsubscribe(); }

    if (!diagram.open) { this.constructDiagramById(diagram.id); }
  }

  public doOpenDiagram(diagram: HtmlDiagram): void {
    if (!this._diagrams) { this.diagrams = []; }

    const position = this._diagrams.findIndex(value => value.equals(diagram));

    if (position === -1) { this.addDiagram(diagram); }
    else { this.diagrams[position] = diagram }

    const index = this._diagrams.findIndex(value => value.equals(diagram));

    this._diagrams.forEach(value => value.open = false);
    this._openDiagram = this.diagrams[index];
    this._openDiagram.open = true;

    if (this._openDiagram.htmlForeignKeys) {
      from(this._openDiagram.htmlForeignKeys).subscribe(constraint => this._notifyForForeignKeyUpdate$.next(constraint));
    }
  }

  public addAll(diagrams: Array<HtmlDiagram>): void {
    if (!this._diagrams) { this._diagrams = diagrams; }
    else { this._diagrams = this._diagrams.concat(diagrams); }
  }

  public setWidth(width: number): void {
    if (width < 0 || width > 100) {
      width = width < 0 ? 0 : 100;
      return;
    }
    this._width = width;
  }

  public closeDiagram(diagram: HtmlDiagram): void {
    if (!diagram) { return; }
    if (diagram.open) {
      const position = this._diagrams.findIndex(value => diagram.equals(value));

      if (this._diagrams.length - 1 > position) { this.setOpenDiagram(this._diagrams[position + 1]); }
      else if (position > 0) { this.setOpenDiagram(this._diagrams[position - 1]); }
      else { this._openDiagram = null; }
    }
    this.removeDiagram(diagram);
  }

  public closeAllDiagrams(): void { this._diagrams.forEach((value, index, array) => value.open = false); }

  public existsOpenDiagram(): boolean { return this._openDiagram ? true : false; }

  public constructDiagramById(diagramId: string) {
    const _newDiagramNotifier$: Subject<HtmlDiagram> = new Subject();

    const _updateFksByTableNotifier$: Subject<HtmlTable> = new Subject();
    _updateFksByTableNotifier$.subscribe(table => this._notifyUpdateFksByTable$.next(table));

    const _updateForeignKeyNotifier$: Subject<HtmlForeignKey> = new Subject();
    _updateForeignKeyNotifier$.subscribe(foreignKey => this._notifyForForeignKeyUpdate$.next(foreignKey));

    this._diagramWatcher = new DiagramWatcher(this._firestoreInterceptorService,
      _newDiagramNotifier$,
      _updateFksByTableNotifier$,
      _updateForeignKeyNotifier$,
      diagramId);

    _newDiagramNotifier$.subscribe(diagram => this.doOpenDiagram(diagram));

    this._diagramWatcher.start();
  }

  public findDiagramById(id: string): HtmlDiagram {
    if (!this.diagrams) { return null; }

    const position: number = this.diagrams.findIndex(value => value.id === id);
    if (position === -1) { return null; }

    return this.diagrams[position];
  }

  get diagrams(): Array<HtmlDiagram> {
    return this._diagrams;
  }

  set diagrams(value: Array<HtmlDiagram>) {
    this._diagrams = value;
  }

  get openDiagram(): HtmlDiagram {
    return this._openDiagram;
  }

  set openDiagram(value: HtmlDiagram) {
    this._openDiagram = value;
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }

  get notifyForForeignKeyUpdate$(): BehaviorSubject<HtmlForeignKey> {
    return this._notifyForForeignKeyUpdate$;
  }

  get notifyUpdateFksByTable$(): Subject<HtmlTable> {
    return this._notifyUpdateFksByTable$;
  }
}
