import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs/index';
import { getZIndex } from '../../class/constants/constants';
import { Position } from '../../class/graphics/position';
import { HtmlColumn } from '../../class/model/html/column/html-column';
import { HtmlTable } from '../../class/model/html/table/html-table';
import { ColumnResult, RelationResult, TableColumnResult, TableResult } from '../../class/resut/results';
import { EventUtil } from '../../class/ui/event-util';
import { ValidationUtil } from '../../class/ui/validation-util';
import { getElementPosition } from '../../functions/jquery-funtions';
import { ClipboardService } from '../../services/clipboard.service';
import { FirestoreInterceptorService } from '../../services/firestore/firestore-interceptor.service';

@Component({
  selector: 'app-db-table',
  templateUrl: './db-table.component.html',
  styleUrls: ['./db-table.component.scss']
})
export class DbTableComponent implements OnInit, OnDestroy {
  @Input() private table: HtmlTable;
  @Input() private scaleFactor: number;
  @Input() private alreadyExists: boolean;

  @Output() private atToggleEdit: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atDrop: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atDuplicate: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atKeyup: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atCut: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atTableMoved: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atAddRelation: EventEmitter<RelationResult> = new EventEmitter();
  @Output() private atTableClicked: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atTableDrag: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atPkChange: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atDropColumns: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atDropColumn: EventEmitter<TableColumnResult> = new EventEmitter();
  @Output() private atRedrawForTable: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atSearchTop: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atSearchBottom: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atSearchLeft: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atSearchRight: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atOptionsPress: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atMoreOption: EventEmitter<TableResult> = new EventEmitter();
  @Output() private atWidthModified: EventEmitter<TableResult> = new EventEmitter();

  private keydownFunctions: Map<string, Function> = new Map();
  private keyMap: Map<string, EventEmitter<TableResult>> = new Map();

  private tableSubscription: Subscription;
  private removeSubscription: Subscription;
  private removeMultipleSubscription: Subscription;

  private moveToTop = event => {
    this.table.position.top -= 10;
    this.table.enableOptions = false;
    this.atTableMoved.emit(new TableResult(this.table, event));
  }

  private moveToBottom = event => {
    this.table.position.top += 10;
    this.table.enableOptions = false;
    this.atTableMoved.emit(new TableResult(this.table, event));
  }

  private moveToRight = event => {
    this.table.position.left += 10;
    this.table.enableOptions = false;
    this.atTableMoved.emit(new TableResult(this.table, event));
  }

  private moveToLeft = event => {
    this.table.position.left -= 10;
    this.table.enableOptions = false;
    this.atTableMoved.emit(new TableResult(this.table, event));
  }

  constructor(private clipboardService: ClipboardService,
    private firestoreInterceptorService: FirestoreInterceptorService) {
  }

  ngOnInit() {
    this.tableSubscription = this.table.subject$
      .subscribe(val => this.firestoreInterceptorService.updateOrCreateTable(val));
    this.removeSubscription = this.table.removeColumnSubject$
      .subscribe(val => this.firestoreInterceptorService.deleteColumn(val));
    this.removeMultipleSubscription = this.table.removeMultipleColumnsSubject$
      .subscribe(val => this.firestoreInterceptorService.removeMultipleColumns(val));
    this.initKeyFunctions();
    this.initKeyMoveFunctions();
  }

  ngOnDestroy() {
    if (this.tableSubscription) {
      this.tableSubscription.unsubscribe();
    }
    if (this.removeSubscription) {
      this.removeSubscription.unsubscribe();
    }
    if (this.removeMultipleSubscription) {
      this.removeMultipleSubscription.unsubscribe();
    }
  }

  private initKeyMoveFunctions(): void {
    this.keyMap.set('ArrowUp', this.atSearchTop);
    this.keyMap.set('ArrowDown', this.atSearchBottom);
    this.keyMap.set('ArrowRight', this.atSearchRight);
    this.keyMap.set('ArrowLeft', this.atSearchLeft);
  }

  private initKeyFunctions(): void {
    this.keydownFunctions.set('ArrowUp', this.moveToTop);
    this.keydownFunctions.set('ArrowDown', this.moveToBottom);
    this.keydownFunctions.set('ArrowRight', this.moveToRight);
    this.keydownFunctions.set('ArrowLeft', this.moveToLeft);
  }

  private addRelation(event: MouseEvent): void {
    event.stopImmediatePropagation();
    let array: Array<HtmlColumn>;

    if (this.table.temporaryTable) {
      array = this.table.htmlColumns.filter(value => value.primaryKey);
    } else { array = Array.of(this.table.temporaryColumn); }

    this.table.enableOptions = false;
    this.atAddRelation.emit(new RelationResult(this.table, array, event));
  }

  private cut(event: MouseEvent): void {
    this.atCut.emit(new TableResult(this.table, event));
  }

  private copy(event: MouseEvent): void {
    this.clipboardService.updateTemporaryTable(this.table);
    this.table.enableOptions = false;
  }

  private tableClicked(event: MouseEvent): void {
    if (this.table.htmlColumns) {
      this.table.htmlColumns.forEach(val => val.showDatatypeDetails = false);
      this.atTableClicked.emit(new TableResult(this.table, event));
    }
  }

  private increaseZIndex(): void {
    this.table.zIndex = getZIndex();
  }

  private toggleExtraOptionsHeader(): void {
    this.table.toggleExtraOptions(null, this.table);
    this.table.htmlColumns.forEach(val => val.showDatatypeDetails = false);
    if (this.table.enableOptions) {
      this.emitOptionPress();
    }
  }

  private toggleOptions(value: ColumnResult): void {
    this.table.toggleExtraOptions(value.column, null);
    this.table.htmlColumns.forEach(val => val.showDatatypeDetails = false);
    if (this.table.enableOptions) {
      this.emitOptionPress();
    }
  }

  private rightClick(event: MouseEvent): void {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.toggleExtraOptionsHeader();
  }

  private emitOptionPress() {
    timer(10).subscribe(val => this.atOptionsPress.emit(new TableResult(this.table)));
  }

  private extraColumnFocus(value: ColumnResult): void {
    this.table.addExtraColumn(value.column);
  }

  private drop(event): void {
    this.atDrop.emit(new TableResult(this.table, event));
  }

  private duplicate(event): void {
    this.atDuplicate.emit(new TableResult(this.table, event));
    this.table.enableOptions = false;
  }

  private keyup(event): void {
    if (event.which === 13) {
      this.toggleEditMode();
    } else if (event.which === 27) {
      this.table.cutActive = false;
      this.clipboardService.cancelCut();
    } else {
      this.atKeyup.emit(new TableResult(this.table, event));
    }

    if (this.keydownFunctions.has(event.key)) {
      this.firestoreInterceptorService.updateOrCreateTable(this.table);
    }
  }

  public keydown(event: KeyboardEvent): void {
    EventUtil.stopEvent(event);
    if (event.altKey) {
      event.preventDefault();
      if (this.keyMap.has(event.key)) {
        this.keyMap.get(event.key).emit(new TableResult(this.table, event));
      }
    } else if (this.keydownFunctions.has(event.key)) {
      this.keydownFunctions.get(event.key)(event);
    }
  }

  private pkChanged(value: ColumnResult): void {
    this.atPkChange.emit(new TableResult(this.table, value.event));
  }

  private updateLocation(event: CdkDragEnd): void {
    const position = getElementPosition(event.source.element.nativeElement);
    this.table.position = new Position(position.left, position.top);

    event.source.element.nativeElement.style.transform = 'none'; // visually reset element to its origin
    const source: any = event.source;
    source._passiveTransform = { x: 0, y: 0 }; // make it so new drag starts from same origin

    this.atTableMoved.emit(new TableResult(this.table, event));
  }

  private dragTable(event: CdkDrag): void {
    this.table.enableOptions = false;
    this.atTableDrag.emit(new TableResult(this.table, event));
  }

  private toggleEditMode(event?: MouseEvent): void {
    this.table.toggleEditMode();
    this.atToggleEdit.emit(new TableResult(this.table, event));
  }

  private stopEvent(event: Event): void {
    EventUtil.stopEvent(event);
  }

  private requireSeparator(): boolean {
    if (ValidationUtil.isNullOrUndefined(this.table.htmlColumns)) {
      return false;
    }

    return this.table.htmlColumns.filter((value, index, array) => !value.primaryKey).length > 0 &&
      this.table.htmlColumns.filter((value, index, array) => value.primaryKey).length > 0;
  }

  private requestExitEditMode(value: ColumnResult): void {
    this.table.exitEditMode();
    this.atRedrawForTable.emit(new TableResult(this.table, value.event));
  }

  private keyupTableName(event): void {
    EventUtil.stopEvent(event);
    if (event.which === 27 || event.which === 13) {
      this.table.exitEditMode();
      this.atRedrawForTable.emit(new TableResult(this.table, event));
    }
  }

  private dropColumns(event: MouseEvent): void {
    this.table.dropColumns();
    this.atDropColumns.emit(new TableResult(this.table, event));
  }

  private dropColumn(event: MouseEvent): void {
    const column: HtmlColumn = this.table.dropColumn();
    this.atDropColumn.emit(new TableColumnResult(this.table, column, event));
  }

  private moreOption(event: MouseEvent): void {
    this.table.showMoreTable = true;
    this.table.enableOptions = false;
    this.atMoreOption.emit(new TableResult(this.table, event));
  }

  private increaseWidth(event: MouseEvent): void {
    this.table.increaseTableWidth();
    this.atWidthModified.emit(new TableResult(this.table, event));
  }

  private decreaseWidth(event: MouseEvent): void {
    this.table.decreaseTableWidth();
    this.atWidthModified.emit(new TableResult(this.table, event));
  }

  private onDatatypeExpend(value: ColumnResult): void {
    this.table.htmlColumns.filter(val => !val.equals(value.column)).forEach(val => val.showDatatypeDetails = false);
  }

  private atMoreClose(): void {
    console.log('ceva');
    this.table.exitMoreMode();
  }

  private atColumnDelete(value: ColumnResult): void {
    this.atDropColumn.emit(new TableColumnResult(this.table, value.column, value.event));
  }

}
