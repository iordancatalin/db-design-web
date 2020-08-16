import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataTypeConst} from '../../class/constants/data-type-const';
import {HtmlDataType} from '../../class/model/html/accessory/html-data-type';
import {HtmlDataTypeGroup} from '../../class/model/html/accessory/html-data-type-group';
import {HtmlColumn} from '../../class/model/html/column/html-column';
import {ColumnResult} from '../../class/resut/results';
import {EventUtil} from '../../class/ui/event-util';
import {getSelectElementValue} from '../../functions/jquery-funtions';

@Component({
  selector: 'app-data-type',
  templateUrl: './data-type.component.html',
  styleUrls: ['./data-type.component.scss']
})
export class DataTypeComponent implements OnInit, AfterViewInit {
  @Input() private column: HtmlColumn;
  @Input() private isTableMore = false;

  @Output() private onDatatypeMore: EventEmitter<ColumnResult> = new EventEmitter();

  private dataTypeArray: Array<HtmlDataTypeGroup>;
  private datatype: HtmlDataType;

  constructor() {
  }

  ngOnInit() {
    this.dataTypeArray = DataTypeConst.getDataTypeArrayGroup();
  }

  ngAfterViewInit() {
    this.initDatatype();
  }

  private initDatatype() {
    this.datatype = DataTypeConst.findDataTypeByName(this.column.type.dataType);

    if (this.datatype === null) {
      this.datatype = new HtmlDataType('-1', false, false);
    }

    this.datatype.selected = true;
  }

  private stopEvent(event: Event): void {
    EventUtil.stopEvent(event);
  }

  private onDatatypeSelect(event) {
    const datatypeName: string = getSelectElementValue(event.target);

    this.datatype = DataTypeConst.findDataTypeByName(datatypeName);
    if (this.datatype !== null) {
      this.column.type.dataType = this.datatype.dataType;
      this.column.type.length = '';
      this.column.type.precision = '';
    }
  }

  private precisionInputKeyUp(event): void {
    this.updateDatatype();
    EventUtil.stopEvent(event);
  }

  private lengthInputKeyUp(event): void {
    this.updateDatatype();
    EventUtil.stopEvent(event);
  }

  private updateDatatype(): void {
    let type: string = this.datatype.dataType + ' ';

    if (!this.column.type.length) { this.column.type.precision = ''; }

    if (!this.column.type.length && !this.column.type.precision) {
      this.column.type.dataType = type;
      return;
    }

    if (!this.column.type.precision) {
      type += `(${this.column.type.length})`;
    } else {
      type += `(${this.column.type.length},${this.column.type.precision})`;
    }
    this.column.type.dataType = type;
  }

  public onDatatypeExpended(event: Event): void {
    this.column.showDatatypeDetails = !this.column.showDatatypeDetails;
    if (this.column.showDatatypeDetails) {
      this.initDatatype();
      this.onDatatypeMore.emit(new ColumnResult(this.column, event));
    }
    EventUtil.stopEvent(event);
  }
}
