import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/index';
import { HtmlColumn } from '../../class/model/html/column/html-column';
import { ColumnResult } from '../../class/resut/results';
import { EventUtil } from '../../class/ui/event-util';
import { FirestoreInterceptorService } from '../../services/firestore/firestore-interceptor.service';
import { DataTypeComponent } from '../data-type/data-type.component';

@Component({
  selector: 'app-db-column',
  templateUrl: './db-column.component.html',
  styleUrls: ['./db-column.component.scss']
})
export class DbColumnComponent implements OnInit, OnDestroy {
  @Input() private column: HtmlColumn;
  @Input() private editableMode: boolean;
  @Input() private dangerColumn = true;
  @Output() private atExtraColumnFocus: EventEmitter<ColumnResult> = new EventEmitter();
  @Output() private atToggleOptions: EventEmitter<ColumnResult> = new EventEmitter();
  @Output() private atPkChanged: EventEmitter<ColumnResult> = new EventEmitter();
  @Output() private atRequestExitEditMode: EventEmitter<ColumnResult> = new EventEmitter();
  @Output() private atDatatypeMore: EventEmitter<ColumnResult> = new EventEmitter();

  @ViewChild('datatypeRef') private datatypeRef: DataTypeComponent;

  constructor(private firestoreInterceptorService: FirestoreInterceptorService) {
  }

  private _actionSubscription: Subscription;
  private _subscription: Subscription;

  ngOnInit() {
    this._subscription = this.column.subject$
      .subscribe(val => this.firestoreInterceptorService.updateOrCreateColumn(val));

    this._actionSubscription = this.column.actionSubject$
      .subscribe(val => this.firestoreInterceptorService.updateOrCreateColumn(val));
  }

  ngOnDestroy() {
    if (this._subscription) { this._subscription.unsubscribe(); }

    if (this._actionSubscription) { this._actionSubscription.unsubscribe(); }
  }

  public keyup(event): void {
    EventUtil.stopEvent(event);
    if (event.which === 27) {
      this.atRequestExitEditMode.emit(new ColumnResult(this.column, event));
    }
  }

  private stopEvent(event: Event): void {
    EventUtil.stopEvent(event);
  }

  public pkChange(event): void {
    this.atPkChanged.emit(new ColumnResult(this.column, event));
  }

  public toggleOptions(event): void {
    this.atToggleOptions.emit(new ColumnResult(this.column, event));
  }

  public extraColumnFocus(event): void {
    this.atExtraColumnFocus.emit(new ColumnResult(this.column, event));
  }

  private onDatatypeExpend(event: MouseEvent): void {
    this.datatypeRef.onDatatypeExpended(event);
  }

  private onDatatypeMoreAction(value: ColumnResult): void {
    this.atDatatypeMore.emit(value);
  }
}
