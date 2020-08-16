import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { HtmlColumn } from '../../../class/model/html/column/html-column';
import { ColumnResult } from '../../../class/resut/results';
import { FirestoreInterceptorService } from '../../../services/firestore/firestore-interceptor.service';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements OnInit, OnDestroy {
  @Input() private column: HtmlColumn;
  @Input() private hasTableForeignKeyColumn: boolean;

  @Output() private atDelete: EventEmitter<ColumnResult> = new EventEmitter();
  @Output() private atFocus: EventEmitter<ColumnResult> = new EventEmitter();

  @Output() private atDataExpend: EventEmitter<
    ColumnResult
  > = new EventEmitter();

  constructor(
    private _firestoreInterceptorService: FirestoreInterceptorService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  private onDatatypeExpend(event: Event): void {
    this.column.showDatatypeDetailsTableMore = !this.column
      .showDatatypeDetailsTableMore;

    if (this.column.showDatatypeDetailsTableMore) {
      this.atDataExpend.emit(new ColumnResult(this.column, event));
    }
  }

  private delete(event: MouseEvent): void {
    this.atDelete.emit(new ColumnResult(this.column, event));
  }

  private focus(event: FocusEvent): void {
    this.atFocus.emit(new ColumnResult(this.column, event));
  }
}
