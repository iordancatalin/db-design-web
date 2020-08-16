import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {HtmlTable} from '../../class/model/html/table/html-table';
import {
  CheckConstraintResult,
  ColumnResult,
  DiagramTableResult,
  UniqueConstraintResult
} from '../../class/resut/results';
import {EventUtil} from '../../class/ui/event-util';
import {ValidationUtil} from '../../class/ui/validation-util';
import {TableMoreWatcher} from '../../class/watchers/table-more/table-more-watcher';
import {FirestoreInterceptorService} from '../../services/firestore/firestore-interceptor.service';

@Component({
  selector: 'app-table-more',
  templateUrl: './table-more.component.html',
  styleUrls: ['./table-more.component.scss']
})
export class TableMoreComponent implements OnInit, OnDestroy {

  @Output() private atClose: EventEmitter<DiagramTableResult> = new EventEmitter();
  @Output() private atColumnDelete: EventEmitter<ColumnResult> = new EventEmitter();

  @Input() private table: HtmlTable;

  private _viewColumns = false;
  private _viewCheckConstraints = false;
  private _viewUniqueConstraints = false;

  private _primaryKeySubscription: Subscription;

  private _removeCheckConstraintSubscription: Subscription;
  private _removeUniqueConstraintSubscription: Subscription;

  private _tableMoreWatcher: TableMoreWatcher;

  constructor(private _firestoreInterceptorService: FirestoreInterceptorService) {
  }

  ngOnInit() {
    this._tableMoreWatcher = new TableMoreWatcher(this._firestoreInterceptorService, this.table.tableConstraint, this.table.diagramId);
    this._tableMoreWatcher.start();

    if (this.table.tableConstraint) {
      this._primaryKeySubscription = this.table.tableConstraint.primaryKeyConstraint.subject$
        .subscribe(val => this._firestoreInterceptorService.updateTablePrimaryKeyName(val, this.table.id, this.table.diagramId));
    }
  }

  ngOnDestroy() {
    if (this._tableMoreWatcher) {
      this._tableMoreWatcher.unsubsribe();
    }

    if (this._primaryKeySubscription) {
      this._primaryKeySubscription.unsubscribe();
    }

    this.closeColumns();
    this.closeCheckConstraints();
    this.closeUniqueConstraints();
  }

  private closePopup(): void {
    this.atClose.emit();
  }

  private toggleColumns(): void {
    this._viewColumns = !this._viewColumns;
    this._viewColumns ? this.openColumns() : this.closeColumns();
  }

  private toggleCheckConstraints(): void {
    this._viewCheckConstraints = !this._viewCheckConstraints;
    this._viewCheckConstraints ? this.openCheckConstraints() : this.closeCheckConstraints();
  }

  private toggleUniqueConstraints(): void {
    this._viewUniqueConstraints = !this._viewUniqueConstraints;
    this._viewUniqueConstraints ? this.openUniqueConstraints() : this.closeUniqueConstraints();
  }

  private openColumns(): void {
    this.table.addEmptyExtraColumn();

    this._viewColumns = true;
  }

  private closeColumns(): void {
    this._viewColumns = false;
  }

  private openCheckConstraints(): void {
    this.table.addEmptyCheckConstraint();

    this._removeCheckConstraintSubscription = this.table.tableConstraint.removeCheckConstraintSubject$
      .subscribe(val => this._firestoreInterceptorService.deleteCheckConstraint(val));

    this._viewCheckConstraints = true;
  }

  private closeCheckConstraints(): void {
    if (this._removeCheckConstraintSubscription && !this._removeCheckConstraintSubscription.closed) {
      this._removeCheckConstraintSubscription.unsubscribe();
    }

    this._viewCheckConstraints = false;
  }

  private openUniqueConstraints(): void {
    this.table.addEmptyUniqueConstraint();

    this._removeUniqueConstraintSubscription = this.table.tableConstraint.removeUniqueConstraintSubject$
      .subscribe(val => this._firestoreInterceptorService.deleteUniqueConstraint(val));

    this._viewUniqueConstraints = true;
  }

  private closeUniqueConstraints(): void {
    if (this._removeUniqueConstraintSubscription && !this._removeUniqueConstraintSubscription.closed) {
      this._removeUniqueConstraintSubscription.unsubscribe();
    }

    this._viewUniqueConstraints = false;
  }

  private focusColumn(value: ColumnResult): void {
    this.table.addExtraColumn(value.column);
  }

  private deleteColumn(value: ColumnResult): void {
    if (!value.column.extraColumn) {
      this.table.deleteColumn(value.column);
      this.atColumnDelete.emit(value);
    }
  }

  private focusCheckConstraint(value: CheckConstraintResult): void {
    if (value.checkConstraint.extraConstraint) {
      value.checkConstraint.extraConstraint = false;
      this.table.addEmptyCheckConstraint();
    }
  }

  private focusUniqueConstraint(value: UniqueConstraintResult): void {
    if (value.uniqueConstraint.extraConstraint) {
      value.uniqueConstraint.extraConstraint = false;
      this.table.addEmptyUniqueConstraint();
    }
  }

  private deleteCheckConstraint(value: CheckConstraintResult): void {
    if (!value.checkConstraint.extraConstraint) {
      this.table.deleteCheckConstraint(value.checkConstraint);
    }
  }

  private deleteUniqueConstraint(value: UniqueConstraintResult): void {
    if (!value.uniqueConstraint.extraConstraint) {
      this.table.deleteUniqueConstraint(value.uniqueConstraint);
    }
  }

  private onDatatypeMoreAction(value: ColumnResult): void {
    if (ValidationUtil.isNullOrUndefined(this.table.htmlColumns)) {
      return;
    }

    this.table.htmlColumns.filter(val => val.equals(value.column)).forEach(val => val.showDatatypeDetails = false);
  }

  private onDataExpend(value: ColumnResult) {
    this.table.htmlColumns.filter(column => !column.equals(value.column))
      .forEach(column => column.showDatatypeDetailsTableMore = false);
  }

  private stopEvent(event: Event): void {
    EventUtil.stopEvent(event);
  }

  get viewColumns(): boolean {
    return this._viewColumns;
  }

  set viewColumns(value: boolean) {
    this._viewColumns = value;
  }

  get viewCheckConstraints(): boolean {
    return this._viewCheckConstraints;
  }

  set viewCheckConstraints(value: boolean) {
    this._viewCheckConstraints = value;
  }

  get viewUniqueConstraints(): boolean {
    return this._viewUniqueConstraints;
  }

  set viewUniqueConstraints(value: boolean) {
    this._viewUniqueConstraints = value;
  }
}
