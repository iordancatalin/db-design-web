import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  OnDestroy
} from '@angular/core';
import { of, timer, Observer, Subject } from 'rxjs/index';
import { switchMap, takeUntil } from 'rxjs/internal/operators';
import { TIMER_DURATION } from '../../class/constants/constants';
import { DiagramsStorage } from '../../class/holder/diagrams-storage';
import { PickDiagramStorage } from '../../class/holder/pick-diagram-storage';
import { HtmlDiagram } from '../../class/model/html/diagram/html-diagram';
import { DiagramResult, DiagramTableResult, ForeignKeyResult, HolderResult, ToolResult } from '../../class/resut/results';
import { FunctionUtil } from '../../class/ui/function-util';
import { TableUtil } from '../../class/ui/table-util';
import { ValidationUtil } from '../../class/ui/validation-util';
import { getElementHeight, getElementPosition, getElementWidth } from '../../functions/jquery-funtions';
import { FirestoreInterceptorService } from '../../services/firestore/firestore-interceptor.service';
import { DiagramToolsComponent } from '../diagram-tools/diagram-tools.component';
import { DiagramComponent } from '../diagram/diagram.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NavService } from 'src/app/services/nav.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Diagram } from 'src/app/class/model/db/diagram/diagram';
import { AbstractDiagram } from 'src/app/class/model-abstract/diagram/abstract-diagram';
import { toHtmlDiagram } from 'src/app/class/adapter/diagram-adapter';

@Component({
  selector: 'app-dbuilder',
  templateUrl: './dbuilder.component.html',
  styleUrls: ['./dbuilder.component.scss']
})
export class DbuilderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('builder') private builder;
  @ViewChild('diagramsContainer') private diagramsContainer;

  @ViewChild('horizontalSeparator') private horizontalSeparator;
  @ViewChild('verticalSeparator') private verticalSeparator;

  @ViewChild('diagramTools') private diagramTools: DiagramToolsComponent;

  @ViewChildren('primaryDiagram') private primaryDiagramRef: QueryList<DiagramComponent>;
  @ViewChildren('additionalDiagram') private additionalDiagramRef: QueryList<DiagramComponent>;

  private primaryStorage: DiagramsStorage;
  private additionalStorage: DiagramsStorage;
  private pickStorage: PickDiagramStorage;

  private dBuilderSplit: DBuilderSplit = new DBuilderSplit(50, 50, 50, false, false, false);

  private createTableTip = false;

  private locatePrimaryDiagram: Function = null;
  private locateAdditionalDiagram: Function = null;

  private _unsubscribeNotifier$: Subject<void> = new Subject();

  private toGenerateDiagram: Diagram;

  private worksheetDefaultAction = (value: DiagramResult) => {
    if (value.event.target.id === value.diagram.id + '_container' || value.event.target.id === value.diagram.id + '_svg_container') {
      value.diagram.revertAllTables();
      timer(TIMER_DURATION).subscribe(val => value.emiter.updateAllForeignKeys());
    }
  }

  private worksheetAction = this.worksheetDefaultAction;

  private createTableAction = (value) => {
    if (value.event.target.id === value.diagram.id + '_container' || value.event.target.id === value.diagram.id + '_svg_container') {
      const table = TableUtil.generateDefaultTable(value.event, value.diagram.id);

      const length = value.diagram.htmlTables ? value.diagram.htmlTables.length : 0;

      table.nameWithoutEmit = value.diagram.getNameForTable(`table`);
      value.diagram.addTable(table);
      this.createTableTip = false;
      this.cursor(null);
      this.worksheetAction = this.worksheetDefaultAction;
    }
  }

  constructor(@Inject(DOCUMENT) private document: any,
    private firestoreInterceptorService: FirestoreInterceptorService,
    private cd: ChangeDetectorRef,
    private router: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private navService: NavService) {
  }

  ngOnInit() {
    this.navService.emit("/master/workshop");
    this.primaryStorage = new DiagramsStorage(this.firestoreInterceptorService, this.localStorageService);
    this.additionalStorage = new DiagramsStorage(this.firestoreInterceptorService, this.localStorageService);

    this.router.queryParamMap.subscribe(val => {
      const uid = val.get('uid');
      const diagrams = this.localStorageService.readDiagrams();
      if (diagrams && diagrams.length) { this.primaryStorage.diagrams = diagrams.map(payload => toHtmlDiagram(payload)); }

      if (uid) { this.primaryStorage.constructDiagramById(uid); }
      else {
        if (diagrams && diagrams.length) {
          this.primaryStorage.constructDiagramById(diagrams[diagrams.length - 1].uid)
        };
      }
    });
  }

  ngOnDestroy(): void {
    if (this.primaryStorage._diagramWatcher) {
      this.primaryStorage._diagramWatcher.unsubscribe();
    }
    if (this.additionalStorage && this.additionalStorage._diagramWatcher) {
      this.additionalStorage._diagramWatcher.unsubscribe();
    }
    this._unsubscribeNotifier$.next();
  }

  ngAfterViewInit() {
    this.primaryDiagramRef.changes.subscribe(val => {
      this.primaryStorage.notifyForForeignKeyUpdate$.pipe(switchMap(value => of(value)))
        .subscribe(value => {
          if (this.primaryDiagramRef.first && value && this.primaryStorage.openDiagram.hasForeignKey(value)) {
            this.primaryDiagramRef.first.updateForeignKey(value);
            this.cd.detectChanges();
          }
        });

      this.primaryStorage.notifyUpdateFksByTable$.pipe(switchMap(value => of(value)))
        .subscribe(value => {
          if (this.primaryDiagramRef.first && value) {
            this.primaryDiagramRef.first.updateForeignKeyForTable(value);
          }
        });

      this.locatePrimaryDiagram = () => { if (this.primaryDiagramRef.first) { this.primaryDiagramRef.first.locateDiagram(); } };
    });

    this.additionalDiagramRef.changes.subscribe(val => {
      this.additionalStorage.notifyForForeignKeyUpdate$.pipe(switchMap(value => of(value)))
        .subscribe(value => {
          if (this.additionalDiagramRef.first && value && this.additionalStorage.openDiagram.hasForeignKey(value)) {
            this.additionalDiagramRef.first.updateForeignKey(value);
          }
        });

      this.additionalStorage.notifyUpdateFksByTable$.pipe(switchMap(value => of(value)))
        .subscribe(value => {
          if (this.additionalDiagramRef.first && value) { this.additionalDiagramRef.first.updateForeignKeyForTable(value); }
        });

      this.locateAdditionalDiagram = () => {
        if (this.additionalDiagramRef.first) { this.additionalDiagramRef.first.locateDiagram(); }
      };
    });
  }

  public toggleTools(event): void {
    if (this.diagramTools) { this.diagramTools.toggleTools(); }
  }

  private fullScreen(value: ToolResult): void {
    FunctionUtil.toggleFullScreen(this.document, this.builder.nativeElement);
    this.cursor(null);
  }

  private location(value: ToolResult): void {
    if (this.locatePrimaryDiagram) { this.locatePrimaryDiagram(); }

    if (this.locateAdditionalDiagram) { this.locateAdditionalDiagram(); }

    this.cursor(null);
  }

  private cursor(value: ToolResult): void {
    this.createTableTip = false;
    this.diagramTools.selectCursor();
    this.worksheetAction = this.worksheetDefaultAction;
  }

  private createTable(value: ToolResult): void {
    this.createTableTip = true;
    this.worksheetAction = this.createTableAction;
  }

  private onSplitVertical(value: ToolResult): void {
    this.dBuilderSplit.activeVertical = !this.dBuilderSplit.activeVertical;

    if (!this.dBuilderSplit.activeVertical) { this.stopSplit(); }
    else { this.dBuilderSplit.resetToDefaultSidesAndPosition(); }

    if (!this.pickStorage) { this.initPickHolder(); }

    this.cursor(null);
  }

  private onSplitHorizontal(value: ToolResult): void {
    this.dBuilderSplit.activeHorizontal = !this.dBuilderSplit.activeHorizontal;

    if (!this.dBuilderSplit.activeHorizontal) { this.stopSplit(); }
    else { this.dBuilderSplit.resetToDefaultSidesAndPosition(); }

    if (!this.pickStorage) { this.initPickHolder(); }

    this.cursor(null);
  }

  private initPickHolder(): void {
    this.pickStorage = new PickDiagramStorage();
    this.pickStorage
      .setPickOptions(this.primaryStorage.diagrams.filter(value => !value.equals(this.primaryStorage.openDiagram)));
    this.pickStorage.pickActive = true;
  }

  private createSql(value: ToolResult): void {
  }

  private resizeVertical(event): void {
    const widthContainer = getElementWidth(this.diagramsContainer.nativeElement);
    const left = getElementPosition(this.verticalSeparator.element.nativeElement).left;

    this.dBuilderSplit.firstSide = (100 * left) / widthContainer;
    this.dBuilderSplit.secondSide = 100 - this.dBuilderSplit.firstSide;
  }

  private finishResizeVertical(event): void {
    const widthContainer = getElementWidth(this.diagramsContainer.nativeElement);
    let left = getElementPosition(this.verticalSeparator.element.nativeElement).left;

    left = this.checkVerticalSeparator(widthContainer, left);
    this.dBuilderSplit.position = (100 * left) / widthContainer;

    event.source.element.nativeElement.style.transform = 'none'; // visually reset element to its origin
    const source: any = event.source;
    source._passiveTransform = { x: 0, y: 0 }; // make it so new drag starts from same origin
  }

  private checkVerticalSeparator(widthContainer: number, left: number) {
    if (left < 200 || widthContainer - left < 200) {
      left = left < 200 ? 200 : widthContainer - 200;
      this.dBuilderSplit.firstSide = (100 * left) / widthContainer;
      this.dBuilderSplit.secondSide = 100 - this.dBuilderSplit.firstSide;
    }
    return left;
  }

  private resizeHorizontal(event): void {
    const heightContainer = getElementHeight(this.diagramsContainer.nativeElement);
    const top = getElementPosition(this.horizontalSeparator.element.nativeElement).top;

    this.dBuilderSplit.firstSide = (100 * top) / heightContainer;
    this.dBuilderSplit.secondSide = 100 - this.dBuilderSplit.firstSide;
  }

  private finishResizeHorizontal(event: CdkDragEnd): void {
    const heightContainer = getElementHeight(this.diagramsContainer.nativeElement);
    let top = getElementPosition(this.horizontalSeparator.element.nativeElement).top;

    top = this.checkHorizontalSeparator(heightContainer, top);
    this.dBuilderSplit.position = (100 * top) / heightContainer;

    event.source.element.nativeElement.style.transform = 'none'; // visually reset element to its origin
    const source: any = event.source;
    source._passiveTransform = { x: 0, y: 0 }; // make it so new drag starts from same origin
  }

  private checkHorizontalSeparator(heightContainer: number, top: number): number {
    if (top < 150 || heightContainer - top < 150) {
      top = top < 150 ? 150 : heightContainer - 150;
      this.dBuilderSplit.firstSide = (100 * top) / heightContainer;
      this.dBuilderSplit.secondSide = 100 - this.dBuilderSplit.firstSide;
    }
    return top;
  }

  public worksheetClick(value): void {
    this.worksheetAction(value);
  }

  public stopSplit(): void {
    this.dBuilderSplit.stopSplit();
    if (!this.pickStorage.pickActive) {
      this.additionalStorage.closeAllDiagrams();
      this.primaryStorage.addAll(this.additionalStorage.diagrams);
      this.primaryStorage.setWidth(100);
      this.additionalStorage.diagrams = [];
      this.additionalStorage.setWidth(0);
    }
    this.pickStorage = null;
  }

  public pickDiagram(value: HtmlDiagram): void {
    this.primaryStorage.removeDiagram(value);
    this.additionalStorage.constructDiagramById(value.id);
    this.pickStorage.pickActive = null;
    this.additionalStorage.setWidth(50);
    this.primaryStorage.setWidth(50);
  }

  public verticalSeparatorKeydown(event): void {
    if (event.which === 37 || event.which === 39) {
      let left = getElementPosition(this.verticalSeparator.element.nativeElement).left;
      const widthContainer = getElementWidth(this.diagramsContainer.nativeElement);
      left += event.which === 37 ? -10 : 10;

      left = this.checkVerticalSeparator(widthContainer, left);

      this.dBuilderSplit.firstSide = (100 * left) / widthContainer;
      this.dBuilderSplit.secondSide = 100 - this.dBuilderSplit.firstSide;
      this.dBuilderSplit.position = (100 * left) / widthContainer;
    }
    if (event.which === 27) {
      this.stopSplit();
    }
  }

  public horizontalSeparatorKeydown(event): void {
    if (event.which === 38 || event.which === 40) {
      const heightContainer = getElementHeight(this.diagramsContainer.nativeElement);
      let top = getElementPosition(this.horizontalSeparator.element.nativeElement).top;
      top += event.which === 38 ? -10 : 10;

      top = this.checkHorizontalSeparator(heightContainer, top);

      this.dBuilderSplit.firstSide = (100 * top) / heightContainer;
      this.dBuilderSplit.secondSide = 100 - this.dBuilderSplit.firstSide;
      this.dBuilderSplit.position = (100 * top) / heightContainer;
    }
    if (event.which === 27) { this.stopSplit(); }
  }

  public closeFromAdditionalDiagrams(value: DiagramResult): void {
    if (this.additionalStorage.diagrams.length === 0) {
      this.primaryStorage.setWidth(100);
      this.initPickHolder();
    }
  }

  public emptyHolder(value: HolderResult): void {
    if (this.primaryStorage.diagrams.length === 0) { this.primaryStorage = this.additionalStorage; }

    this.additionalStorage.setWidth(0);
    this.primaryStorage.setWidth(100);
    this.pickStorage = new PickDiagramStorage();
    this.initPickHolder();
    this.pickStorage.pickActive = true;
  }

  private abortCreateTable(event: MouseEvent): void {
    this.cursor(null);
    this.createTableTip = false;
  }

  private closeTableMore(value: DiagramTableResult): void { value.diagramComponent.updateForeignKeyForTable(value.table); }

  private onDuplicateDiagram(value: DiagramResult): void { this.primaryStorage.addDiagram(value.diagram); }

  private selectDiagram(value: AbstractDiagram): void { this.primaryStorage.constructDiagramById(value.id); }

  private doGenerateSQL(value: DiagramResult): void { this.toGenerateDiagram = value.diagram.build(); }

  private cancelGenerate(): void { this.toGenerateDiagram = null; }

}

class DBuilderSplit {
  public constructor(private _firstSide: number,
    private _secondSide: number,
    private _position: number,
    private _activeVertical: boolean,
    private _activeHorizontal: boolean,
    private _dragging: boolean) {
  }

  public resetToDefaultSidesAndPosition(): void { this.firstSide = this.secondSide = this.position = 50; }

  public stopSplit(): void { this._activeVertical = this._activeHorizontal = false; }

  get firstSide(): number { return this._firstSide; }

  set firstSide(value: number) { this._firstSide = value; }

  get secondSide(): number { return this._secondSide; }

  set secondSide(value: number) { this._secondSide = value; }

  get position(): number { return this._position; }

  set position(value: number) { this._position = value; }

  get activeVertical(): boolean { return this._activeVertical; }

  set activeVertical(value: boolean) {
    this._activeVertical = value;
    if (value) { this._activeHorizontal = false; }
  }

  get activeHorizontal(): boolean { return this._activeHorizontal; }

  set activeHorizontal(value: boolean) {
    this._activeHorizontal = value;
    if (value) { this._activeVertical = false; }
  }

  get dragging(): boolean { return this._dragging; }

  set dragging(value: boolean) { this._dragging = value; }
}
