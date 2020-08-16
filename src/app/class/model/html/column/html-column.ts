import {Observable, of} from 'rxjs/index';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/internal/operators';
import {OccupationModel} from '../../../graphics/occupation-model';
import {AbstractColumn} from '../../../model-abstract/column/abstract-column';
import {compareHtmlColumns} from '../../../ui/comparator-util';
import {ColumnBuilder} from '../../db/column/builder/column-builder';
import {Column} from '../../db/column/column';
import {HtmlDataType} from '../accessory/html-data-type';

export class HtmlColumn extends AbstractColumn {
  private _type: HtmlDataType = new HtmlDataType(null, false, false, false, null, null, this);
  private _extraColumn = false;
  private _viewOptions = false;
  private _occupationModel: OccupationModel = new OccupationModel();
  private _showDatatypeDetails = false;
  private _showDatatypeDetailsTableMore = false;

  public constructor(id: string, private _tableId: string, private _diagramId: string) {
    super(id);
  }

  public isValid(): boolean {
    return this.name !== '' && this._type.dataType !== '';
  }

  public build(): Column {
    return new ColumnBuilder(this.id)
      .withName(this.name)
      .withType(this._type.dataType)
      .withPrimaryKey(this.primaryKey)
      .withForeignKey(this.foreignKey)
      .withUnique(this.unique)
      .withNullable(this.nullable)
      .withDefaultValue(this.defaultValue)
      .withAutoincrement(this.autoincrement)
      .withComment(this.comment)
      .build();
  }

  get type(): HtmlDataType {
    return this._type;
  }

  set type(value: HtmlDataType) {
    this._type = value;
    this._type.column = this;
  }

  get extraColumn(): boolean {
    return this._extraColumn;
  }

  set extraColumn(value: boolean) {
    this._extraColumn = value;
    this.emit();
  }

  get viewOptions(): boolean {
    return this._viewOptions;
  }

  set viewOptions(value: boolean) {
    this._viewOptions = value;
  }

  get occupationModel(): OccupationModel {
    return this._occupationModel;
  }

  set occupationModel(value: OccupationModel) {
    this._occupationModel = value;
  }

  get showDatatypeDetails(): boolean {
    return this._showDatatypeDetails;
  }

  set showDatatypeDetails(value: boolean) {
    this._showDatatypeDetails = value;
  }

  get showDatatypeDetailsTableMore(): boolean {
    return this._showDatatypeDetailsTableMore;
  }

  set showDatatypeDetailsTableMore(value: boolean) {
    this._showDatatypeDetailsTableMore = value;
  }

  get tableId(): string {
    return this._tableId;
  }

  set tableId(value: string) {
    this._tableId = value;
  }

  get diagramId(): string {
    return this._diagramId;
  }

  set diagramId(value: string) {
    this._diagramId = value;
  }

  set extraColumnWithoutEmit(value: boolean) {
    this._extraColumn = value;
  }

  get subject$(): Observable<HtmlColumn> {
    return this._subject$.pipe
    (
      debounceTime(500),
      distinctUntilChanged(compareHtmlColumns),
      switchMap(value => of(value))
    );
  }

  get actionSubject$(): Observable<HtmlColumn> {
    return this._actionSubject$.pipe
    (
      distinctUntilChanged(compareHtmlColumns),
      switchMap(value => of(value))
    );
  }
}
