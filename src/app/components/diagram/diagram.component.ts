import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { from, timer, Subject, interval } from 'rxjs/index';
import { DIAGRAM_PADDING, getSuperPosition, OPTIONS_PADDING, TIMER_DURATION } from '../../class/constants/constants';
import { DiagramOptions } from '../../class/data/data-util';
import { CloneFactory } from '../../class/factory/clone-factory';
import { Dimension } from '../../class/graphics/dimension';
import { Position } from '../../class/graphics/position';
import { HtmlRelation } from '../../class/model/html/accessory/html-relation';
import { PartRelation } from '../../class/model/html/accessory/part-relation';
import { HtmlDiagram } from '../../class/model/html/diagram/html-diagram';
import { HtmlForeignKeyBuilder } from '../../class/model/html/foreign-key/builder/html-foreign-key-builder';
import { HtmlForeignKey } from '../../class/model/html/foreign-key/html-foreign-key';
import { HtmlTable } from '../../class/model/html/table/html-table';
import {
  DiagramResult,
  DiagramTableResult,
  ForeignKeyResult,
  RelationResult,
  TableColumnResult,
  TableResult
} from '../../class/resut/results';
import { EventUtil } from '../../class/ui/event-util';
import { TableUtil } from '../../class/ui/table-util';
import { ValidationUtil } from '../../class/ui/validation-util';
import { updateHtmlForeignKeyLines } from '../../functions/graphics-util';
import {
  getElementHeight,
  getElementOffset,
  getElementOffsetById,
  getElementPosition,
  getElementWidth,
  getTableHeight,
  getTableOptionsDimension,
  getTableWidth,
  requestFocusOnTable
} from '../../functions/jquery-funtions';
import { ClipboardService } from '../../services/clipboard.service';
import { CommonService } from '../../services/common.service';
import { FirestoreInterceptorService } from '../../services/firestore/firestore-interceptor.service';
import { DiagramOptionsComponent } from '../diagram-options/diagram-options.component';
import { FindTableComponent } from '../find-table/find-table.component';
import { tap, takeUntil } from 'rxjs/internal/operators';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnInit, OnDestroy, OnChanges {
  @Input() private diagram: HtmlDiagram;
  @Output() private worksheetClick: EventEmitter<DiagramResult> = new EventEmitter();
  @Output() private atMoreOption: EventEmitter<DiagramTableResult> = new EventEmitter();
  @Output() private atRelationRequest: EventEmitter<ForeignKeyResult> = new EventEmitter();
  @Output() private atDuplicate: EventEmitter<DiagramResult> = new EventEmitter();
  @Output() private atGenerateSQL: EventEmitter<DiagramResult> = new EventEmitter();

  private diagramOptions: DiagramOptions = new DiagramOptions();
  private pastePosition: Position;
  @ViewChild('diagramElementRef') private diagramElementRef;
  @ViewChild('diagramContainerElementRef') private diagramContainerElementRef: ElementRef;
  @ViewChild(FindTableComponent) private findTableComponent: FindTableComponent;
  @ViewChild('appDiagramOptions') private appDiagramOptionsComponent: DiagramOptionsComponent;
  @ViewChild('diagramRef') private diagramRef: ElementRef;

  private tempRelationResult: RelationResult = null;
  private tempForeignKey: HtmlForeignKey;

  private createRelationTip = false;
  private activeFindPopup = false;

  private showRenamePopup = false;
  private showSharePopup = false;
  private showGenerateLinkPopup = false;
  private showGenerateLinkTip = false;

  private findTablePopupPosition: Position = new Position(40, 40);
  private _unsubscribeNotifier$: Subject<void> = new Subject();

  private _notifier$: Subject<void> = new Subject();

  private foreignKeyListener = (evt: KeyboardEvent) => {
    if (evt.which === 46 && this.tempForeignKey) {
      this.diagram.deleteForeignKey(this.tempForeignKey);
      this.tempForeignKey = null;
    }

    if (evt.which === 13 && this.tempForeignKey) {
      this.tempForeignKey.showMore = true;
      // this.atRelationRequest.emit(new ForeignKeyResult(this.tempForeignKey, evt));
      this.tempForeignKey = null;
    }
  };

  constructor(private clipboardService: ClipboardService,
    private _firestoreInterceptorService: FirestoreInterceptorService) {
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.unsubscribe();
    this.subscribe();
  }

  private subscribe() {
    this.diagram.subject$.pipe(takeUntil(this._unsubscribeNotifier$))
      .subscribe(value => this._firestoreInterceptorService.updateOrCreateDiagram(value));
    this.diagram.addTableSubject$.pipe(takeUntil(this._unsubscribeNotifier$))
      .subscribe(val => this._firestoreInterceptorService.updateOrCreateTable(val));
    this.diagram.addForeignKeySubject$.pipe(takeUntil(this._unsubscribeNotifier$))
      .subscribe(val => this._firestoreInterceptorService.updateOrCreateHtmlForeignKey(val));

    this.diagram.removeTableSubject$.pipe(takeUntil(this._unsubscribeNotifier$))
      .subscribe(val => {
        this._firestoreInterceptorService.deleteTableAndFks(val, this.diagram.getForeignKeysByTableId(val.id));
        this.diagram.deleteForeignKeysByTableWithoutEmit(val);
      });

    this.diagram.removeForeignKeySubject$.pipe(takeUntil(this._unsubscribeNotifier$))
      .subscribe(val => this._firestoreInterceptorService.deleteForeignKey(val));
    this.diagram.removeMultipleForeignKeySubject$.pipe(takeUntil(this._unsubscribeNotifier$))
      .subscribe(val => this._firestoreInterceptorService.removeMultipleForeignKeys(val));
    this.diagram.updateMultipleForeignKeySubject$.pipe(takeUntil(this._unsubscribeNotifier$))
      .subscribe(val => this._firestoreInterceptorService.updateMultipleForeignKeys(val));
  }

  ngOnDestroy() { }

  private unsubscribe() { this._unsubscribeNotifier$.next(); }

  private tableClicked(value: TableResult): void {
    if (this.tempRelationResult) {
      const relations: Array<HtmlRelation> = [];

      from(this.tempRelationResult.columns).subscribe(column => {
        const fkColumn = CloneFactory.cloneHtmlColumn(column, value.table.id, this.diagram.id);
        fkColumn.foreignKeyWithoutEmit = true;
        fkColumn.primaryKeyWithoutEmit = false;
        const columnName = `${fkColumn.name.toString()}_fk`;
        fkColumn.nameWithoutEmit = value.table.getNameForColumn(columnName);
        fkColumn.type = column.type;

        const relation = new HtmlRelation(new PartRelation(fkColumn), new PartRelation(column));
        relations.push(relation);

        value.table.addColumn(fkColumn);

        this._firestoreInterceptorService.updateOrCreateColumn(fkColumn);
      });

      const foreignKey = new HtmlForeignKeyBuilder(CommonService.createId(), this.diagram.id)
        .withRelations(relations)
        .withChildTable(value.table)
        .withParentTable(this.tempRelationResult.table)
        .build();

      foreignKey.lines = updateHtmlForeignKeyLines(foreignKey, false, this.diagram.zoom, this.diagram.dimension.width, true);

      this.diagram.addForeignKey(foreignKey);
      this.tempRelationResult = null;
      this.createRelationTip = false;
    }
  }

  private addRelation(value: RelationResult): void {
    this.createRelationTip = true;
    this.tempRelationResult = value;
  }

  private rightClick(event: MouseEvent): boolean {
    this.diagramOptions.updateZIndex();
    this.diagramOptions.enable = true;
    this.diagramOptions.calibrate = false;
    this.diagramOptions.updatePosition(event.offsetX, event.offsetY);
    this.diagram.revertAllTables();

    if (ValidationUtil.isNullOrUndefined(this.pastePosition)) {
      this.pastePosition = new Position(event.offsetX, event.offsetY);
    } else {
      this.pastePosition.left = event.offsetX;
      this.pastePosition.top = event.offsetY;
    }

    timer(TIMER_DURATION).subscribe(val => this.calibrateOptionsPosition());

    return false;
  }

  private calibrateOptionsPosition(): boolean {
    let calibrate = false;

    const elementRef = this.appDiagramOptionsComponent.getOptionsContainerElementRef().nativeElement;
    const elementRefDimension: Dimension = new Dimension(getElementWidth(elementRef), getElementHeight(elementRef));
    const elementRefOffset = getElementOffset(elementRef);
    const containerPositionAndDimension = this.getContainerPositionAndDimension();

    let left: number = this.diagramOptions.position.left;
    let top: number = this.diagramOptions.position.top;

    if (elementRefOffset.left + elementRefDimension.width > containerPositionAndDimension.dimension.width) {
      left -= elementRefDimension.width;
    }

    if (elementRefOffset.top + elementRefDimension.height >
      containerPositionAndDimension.position.top + containerPositionAndDimension.dimension.height) {
      top -= elementRefDimension.height;
    }

    if (calibrate = (left !== this.diagramOptions.position.left || top !== this.diagramOptions.position.top)) {
      this.diagramOptions.updatePosition(left, top);
    }

    this.diagramOptions.calibrate = true;
    return calibrate;
  }

  public tableDrag(value: TableResult): void {
    this.updateForeignKeyForTable(value.table);
  }

  public updateForeignKeyForTable(value: HtmlTable, calculatePositionFromTable: boolean = false): void {
    if (!ValidationUtil.isNullOrUndefined(this.diagram.htmlForeignKeys)) {
      this.diagram.htmlForeignKeys
        .filter((foreignKey, index, array) => value.equals(foreignKey.childTable) || value.equals(foreignKey.parentTable))
        .forEach((foreignKey, index, array) =>
          foreignKey.lines = updateHtmlForeignKeyLines(foreignKey, calculatePositionFromTable,
            this.diagram.zoom,
            this.diagram.dimension.width));
    }
  }

  public updateForeignKey(htmlForeignKey: HtmlForeignKey): void {
    if (!htmlForeignKey) { return; }

    if (!htmlForeignKey.valid()) {
      this._firestoreInterceptorService.deleteForeignKey(htmlForeignKey);
      return;
    }

    timer(TIMER_DURATION).subscribe(_ => {
      try {
        htmlForeignKey.lines = updateHtmlForeignKeyLines(htmlForeignKey,
          true,
          this.diagram.zoom,
          this.diagram.dimension.width);
      } catch (err) {
        console.error(err);
      }
    });
  }

  private stopEvent(event: Event): void { EventUtil.stopEvent(event); }

  public updateAllForeignKeys(): void {
    if (this.diagram.htmlForeignKeys && this.diagram.htmlForeignKeys.length !== 0) {
      this.diagram.htmlForeignKeys.forEach((foreignKey, index, array) =>
        foreignKey.lines = updateHtmlForeignKeyLines(foreignKey, true, this.diagram.zoom, this.diagram.dimension.width));
    }
  }

  public tableMoved(value: TableResult): void { this.updateForeignKeyForTable(value.table, true); }

  private click(event): void {
    this.diagramOptions.reset();
    this.worksheetClick.emit(new DiagramResult(this.diagram, event, this));
  }

  private dropTable(value: TableResult): void { this.diagram.dropTable(value.table); }

  private diagramKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey) {
      if (event.which === 189 || event.which === 109) {
        this.diagram.decreaseScaleFactor();
        this.updateAllForeignKeys();
        event.preventDefault();
        event.stopImmediatePropagation();
      } else if (event.which === 187 || event.which === 107) {
        this.diagram.increaseScaleFactor();
        this.updateAllForeignKeys();
        event.preventDefault();
        event.stopImmediatePropagation();
      } else if (event.which === 48 || event.which === 45) {
        this.diagram.resetScaleFactor();
        this.updateAllForeignKeys();
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }
  }

  private keyup(value: TableResult): void {
    if (value.event.which === 46) { this.dropTable(value); }
  }

  private duplicateTable(value: TableResult) {
    const table: HtmlTable = CloneFactory.cloneHtmlTable(value.table, this.diagram.id);
    table.position.left += 400;
    this.diagram.addTable(table);
  }

  private cut(value: TableResult): void {
    value.table.cutActive = true;
    value.table.enableOptions = false;
    this.clipboardService.setTemporaryTableForCut(value.table, this.diagram);
  }

  private paste(event: MouseEvent): void {
    this.clipboardService.doPaste(this.diagram, this.pastePosition);
  }

  private clearAll(value: MouseEvent): void {
    this._firestoreInterceptorService.clearAllDiagram(this.diagram);
    this.diagram.clearAll();
  }

  private foreignKeyFocusIn(foreignkey: HtmlForeignKey, event: FocusEvent): void {
    this.diagram.doRenderForeignKey(foreignkey);
    foreignkey.lines.forEach(value => value.doFocusIn());
    this.tempForeignKey = foreignkey;
    event.target.addEventListener('keyup', this.foreignKeyListener);
    EventUtil.stopEvent(event);
  }

  private foreignKeyFocusOut(foreignkey: HtmlForeignKey, event: FocusEvent): void {
    foreignkey.lines.forEach((value, index, array) => value.doFocusOut());
    event.target.removeEventListener('keyup', this.foreignKeyListener);
    EventUtil.stopEvent(event);
  }

  private toggleEditMode(value: TableResult): void {
    this.diagram.htmlTables.filter(val => !val.equals(value.table))
      .forEach(val => val.exitEditMode());
    timer(TIMER_DURATION).subscribe(val => this.updateForeignKeyForTable(value.table));
  }

  public dragEnd(event: CdkDragEnd): void {
    this.diagram.wasDrag = true;

    const position = getElementPosition(event.source.element.nativeElement);
    this.diagram.position = new Position(position.left, position.top);

    event.source.element.nativeElement.style.transform = 'none'; // visually reset element to its origin
    const source: any = event.source;
    source._passiveTransform = { x: 0, y: 0 }; // make it so new drag starts from same origin
  }

  public locateDiagram(): void {
    if (this.diagram.wasDrag) {
      this.diagram.transitionPosition = true;
      this.diagramElementRef.element.nativeElement.style.transform = 'none'; // visually reset element to its origin
      this.diagramElementRef._passiveTransform = { x: 0, y: 0 }; // make it so new drag starts from same origin
      this.diagram.position = getSuperPosition();

      this.diagram.wasDrag = false;
      timer(310).subscribe(val => this.diagram.transitionPosition = false);
    }
  }

  public pkChanged(value: TableResult): void {
    timer(TIMER_DURATION).subscribe(val => this.updateAllForeignKeys());
  }

  public tableWithNameAlreadyExists(table: HtmlTable): boolean {
    return this.diagram.htmlTables
      .filter((value, index, array) => !table.equals(value))
      .filter((value, index, array) => table.name === value.name).length > 0;
  }

  public columnsDrop(value: TableResult): void {
    this.diagram.deleteForeignKeysByTable(value.table);
  }

  public columnDrop(value: TableColumnResult): void {
    this.diagram.deleteFkRelationsByTableAndColumn(value.table, value.column);
    this.updateForeignKeyForTable(value.table, true);
  }

  private redrawForTable(value: TableResult): void {
    timer(TIMER_DURATION).subscribe(val => this.updateForeignKeyForTable(value.table, true));
  }

  private abortCreateRelation(event: MouseEvent): void {
    this.tempRelationResult = null;
    this.createRelationTip = false;
  }

  private diagramKeyup(event: KeyboardEvent): void {
    if (event.ctrlKey && event.shiftKey && event.which === 70) {
      if (!this.activeFindPopup) {
        this.activeFindPopup = true;
      } else {
        this.findTableComponent.resetPosition();
      }
    }

    if (event.which === 45 && !event.ctrlKey) {
      EventUtil.stopEvent(event);
      this.insertTableByKey();
    }
  }

  private onFindTablePopupClose(value: MouseEvent): void {
    this.activeFindPopup = false;
  }

  private findTable(value: TableResult): void {
    this.activeFindPopup = false;
    this.diagram.transitionPosition = true;

    this.locateTable(value.table);

    timer(310).subscribe(val => {
      this.diagram.transitionPosition = false;
      requestFocusOnTable(value.table.id);
    });
  }

  private insertTableByKey(): void {
    const generatedTable: HtmlTable = TableUtil.generateTableByKey(this.diagram.id);

    this.diagram.addTable(generatedTable);
    timer(TIMER_DURATION).subscribe(val => this.primitiveLocateTable(generatedTable));
  }

  private locateTable(table: HtmlTable): boolean {
    const containerPositionElement = getElementOffset(this.diagramContainerElementRef.nativeElement);
    const containerPosition = new Position(containerPositionElement.left, containerPositionElement.top);
    const containerDimension = new Dimension(getElementWidth(this.diagramContainerElementRef.nativeElement),
      getElementHeight(this.diagramContainerElementRef.nativeElement));

    const tablePositionElement = getElementOffsetById(table.id);
    const tablePosition = new Position(tablePositionElement.left, tablePositionElement.top);
    const tableDimension = new Dimension(getTableWidth(table.id), getTableHeight(table.id));

    const result: Position = new Position(0, 0);

    if ((tablePosition.top + tableDimension.height) > (containerPosition.top + containerDimension.height)) {
      result.top = (containerPosition.top + containerDimension.height) - tableDimension.height - tablePosition.top - 5;
    } else if (tablePosition.top < containerPosition.top) {
      result.top = Math.abs(containerPosition.top - tablePosition.top) + 5;
    }

    if ((tablePosition.left + tableDimension.width) > (containerPosition.left + containerDimension.width)) {
      result.left = (containerPosition.left + containerDimension.width) - tablePosition.left - tableDimension.width - 5;
    } else if (tablePosition.left < containerPosition.left) {
      result.left = Math.abs(containerPosition.left - tablePosition.left) + 5;
    }

    if (result.top !== 0 || result.left !== 0) {
      this.diagram.position.top += result.top;
      this.diagram.position.left += result.left;
      return true;
    }

    return false;
  }

  private primitiveLocateTable(table: HtmlTable): void {
    if (this.locateTable(table)) {
      this.diagram.transitionPosition = true;
      timer(310).subscribe(val => {
        this.diagram.transitionPosition = false;
        requestFocusOnTable(table.id);
      });
    } else {
      requestFocusOnTable(table.id);
    }
  }

  private orderArrayByTop(array: Array<HtmlTable>, asc: boolean = true): void {
    array.sort((a, b) => {
      if (a.position.top > b.position.top) {
        return asc ? 1 : -1;
      }
      if (a.position.top < b.position.top) {
        return asc ? -1 : 1;
      }
      return 0;
    });
  }

  private orderArrayByLeft(array: Array<HtmlTable>, asc: boolean = true): void {
    array.sort((a, b) => {
      if (a.position.left > b.position.left) {
        return asc ? 1 : -1;
      }
      if (a.position.left < b.position.left) {
        return asc ? -1 : 1;
      }
      return 0;
    });
  }

  private searchTop(value: TableResult): void {
    const array: Array<HtmlTable> = this.diagram.htmlTables
      .filter(val => !value.table.equals(val))
      .filter(table => table.position.top < value.table.position.top);

    if (array.length !== 0) {
      this.orderArrayByTop(array, false);
      this.primitiveLocateTable(array[0]);
    }
  }

  private searchLeft(value: TableResult): void {
    const array: Array<HtmlTable> = this.diagram.htmlTables
      .filter(val => !value.table.equals(val))
      .filter(table => table.position.left < value.table.position.left);

    if (array.length !== 0) {
      this.orderArrayByLeft(array, false);
      this.primitiveLocateTable(array[0]);
    }
  }

  private searchBottom(value: TableResult): void {
    const array: Array<HtmlTable> = this.diagram.htmlTables
      .filter(val => !value.table.equals(val))
      .filter(table => table.position.top > value.table.position.top);

    if (array.length !== 0) {
      this.orderArrayByTop(array);
      this.primitiveLocateTable(array[0]);
    }
  }

  private searchRight(value: TableResult): void {
    const array: Array<HtmlTable> = this.diagram.htmlTables
      .filter(val => !value.table.equals(val))
      .filter(table => table.position.left > value.table.position.left);

    if (array.length !== 0) {
      this.orderArrayByLeft(array);
      this.primitiveLocateTable(array[0]);
    }
  }

  private optionsPress(value: TableResult): void {
    value.table.optionsPosition.left = getTableWidth(value.table.id) + OPTIONS_PADDING;
    value.table.optionsPosition.top = 0;
    value.table.calibrateOptions = false;

    this.diagram.htmlTables.filter(val => !val.equals(value.table))
      .forEach(val => val.enableOptions = false);

    timer(TIMER_DURATION).subscribe(val => {
      if (!this.calibrateTableOptionsContainer(value)) {
        this.resizeByTableOptions(value);
      }
    });
  }

  private calibrateTableOptionsContainer(value: TableResult): boolean {
    let calibrate = false;
    const containerPositionAndDimension = this.getContainerPositionAndDimension();
    const optionsOffset = getElementOffsetById(value.table.id + '_options');
    const optionsDimension = getTableOptionsDimension(value.table.id);
    const tableDimension: Dimension = new Dimension(getTableWidth(value.table.id), getTableHeight(value.table.id));
    const tableOffset = getElementOffsetById(value.table.id);

    let left: number = value.table.optionsPosition.left;
    let top: number = value.table.optionsPosition.top;

    if (optionsOffset.left + optionsDimension.width > containerPositionAndDimension.dimension.width) {
      left -= optionsDimension.width + 40;
    }

    if (optionsOffset.top + optionsDimension.height >
      containerPositionAndDimension.position.top + containerPositionAndDimension.dimension.height) {
      top -= (optionsOffset.top + optionsDimension.height) - (tableOffset.top + tableDimension.height);
    } else if (optionsOffset.top < containerPositionAndDimension.position.top) {
      top = containerPositionAndDimension.position.top - optionsOffset.top + OPTIONS_PADDING;
    }

    if (calibrate = (left !== value.table.optionsPosition.left || top !== value.table.optionsPosition.top)) {
      value.table.optionsPosition.left = left;
      value.table.optionsPosition.top = top;
    }

    value.table.calibrateOptions = true;

    return calibrate;
  }

  private resizeByTableOptions(value: TableResult): void {
    const optionsDimension = getTableOptionsDimension(value.table.id);
    const bottom = value.table.position.top + optionsDimension.height;
    const right = value.table.position.left + getTableWidth(value.table.id) + optionsDimension.width;

    if (bottom > this.diagram.dimension.height) { this.diagram.dimension.height = bottom + DIAGRAM_PADDING; }

    if (right > this.diagram.dimension.width) { this.diagram.dimension.width = right + DIAGRAM_PADDING; }
  }

  private getContainerPositionAndDimension(): { position: Position, dimension: Dimension } {
    const containerPositionElement = getElementOffset(this.diagramContainerElementRef.nativeElement);
    const containerPosition = new Position(containerPositionElement.left, containerPositionElement.top);
    const containerDimension = new Dimension(getElementWidth(this.diagramContainerElementRef.nativeElement),
      getElementHeight(this.diagramContainerElementRef.nativeElement));

    return { position: containerPosition, dimension: containerDimension };
  }

  private onWidthModified(value: TableResult): void {
    timer(TIMER_DURATION).subscribe(val => this.updateForeignKeyForTable(value.table));
  }

  private onDuplicateDiagram(): void {
    const diagram: HtmlDiagram = CloneFactory.cloneHtmlDiagram(this.diagram);
    this._firestoreInterceptorService.updateOrCreateDiagram(diagram).subscribe();
    this.atDuplicate.emit(new DiagramResult(diagram));
  }

  private renameDiagram(): void { this.showRenamePopup = true; }

  private closeRenamePopup(): void { this.showRenamePopup = false; }

  private shareDiagram(): void { this.showSharePopup = true; }

  private closeSharePopup(): void { this.showSharePopup = false; }

  private generateLink(): void { this.showGenerateLinkPopup = true; }

  private closeGenerateLink(): void { this.showGenerateLinkPopup = false; }

  private closeGenerateLinkTip(): void {
    this.showGenerateLinkTip = false;
    this._notifier$.next();
  }

  private copyGenerateLink(): void {
    this.showGenerateLinkTip = true;
    this.closeGenerateLink();
    interval(5000).pipe(takeUntil(this._notifier$)).subscribe(_ => {
      this.showGenerateLinkTip = false;
      this._notifier$.next();
    });
  }

  private generateSQL(): void { this.atGenerateSQL.emit(new DiagramResult(this.diagram)); }
}