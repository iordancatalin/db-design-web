import {CdkDragEnd} from '@angular/cdk/drag-drop';
import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {timer} from 'rxjs/index';
import {Position} from '../../class/graphics/position';
import {HtmlTable} from '../../class/model/html/table/html-table';
import {TableResult} from '../../class/resut/results';
import {EventUtil} from '../../class/ui/event-util';
import {ValidationUtil} from '../../class/ui/validation-util';
import {requestFocusOnElement} from '../../functions/jquery-funtions';

@Component({
  selector: 'app-find-table',
  templateUrl: './find-table.component.html',
  styleUrls: ['./find-table.component.scss']
})
export class FindTableComponent implements OnInit {
  @Input() private tables: Array<HtmlTable> = null;
  @Input() private position: Position = new Position(50, 50);
  @Output() private close: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() private tableSelect: EventEmitter<TableResult> = new EventEmitter<TableResult>();

  @ViewChild('optionsElementRef') private optionsElementRef: ElementRef;
  @ViewChild('popupElementRef') private popupElementRef;
  @ViewChild('searchElementRef') private searchElementRef;

  private currentTables: Array<HtmlTable>;
  private tableName: string;

  private keyPressed = false;
  private moved = false;
  private transitionPosition = false;

  constructor() {
  }

  ngOnInit() {
    requestFocusOnElement(this.searchElementRef.nativeElement);

    if (ValidationUtil.isNullOrUndefined(this.tables)) {
      this.currentTables = null;
    } else {
      this.currentTables = this.tables;
    }
  }

  private onClose(event: Event): void {
    this.close.emit(event);
  }

  private keyup(event: KeyboardEvent): void {
    this.keyPressed = true;

    if (event.which === 27) {
      this.onClose(event);
      return;
    }

    if (this.tableName === '' || ValidationUtil.isNullOrUndefined(this.tables)) {
      this.currentTables = null;
    } else if (this.tableName === '*') {
      this.currentTables = this.tables;
    } else {
      this.currentTables = this.tables.filter((value, index, array) => value.name.indexOf(this.tableName) !== -1);
    }
  }

  private keyupContainer(event: KeyboardEvent): void {
    if (event.which === 27) {
      this.close.emit(event);
    }
  }

  private stopEvent(event: Event): void {
    EventUtil.stopEvent(event);
  }

  private onTableSelect(table: HtmlTable, event: Event): void {
    this.tableSelect.emit(new TableResult(table, event));
  }

  public resetPosition(): void {
    if (this.moved) {
      this.popupElementRef.element.nativeElement.style.transform = 'none'; // visually reset element to its origin
      this.popupElementRef._passiveTransform = {x: 0, y: 0}; // make it so new drag starts from same origin
      this.transitionPosition = true;

      timer(302).subscribe(val => this.transitionPosition = false);
    }
  }

  private dragEnded(event: CdkDragEnd): void {
    this.moved = true;
  }
}
