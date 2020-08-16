import { Observable, of, Subject, generate } from 'rxjs/index';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/internal/operators';
import { DEBOUNCE_TIME, TABLE_DEFAULT_WIDTH, TABLE_WIDTH_UNIT } from '../../../constants/constants';
import { Position } from '../../../graphics/position';
import { AbstractColumn } from '../../../model-abstract/column/abstract-column';
import { AbstractTable } from '../../../model-abstract/table/abstract-table';
import { ColumnUtil } from '../../../ui/column-util';
import { compareHtmlTables } from '../../../ui/comparator-util';
import { TableBuilder } from '../../db/table/builder/table-builder';
import { Column } from '../../db/column/column';
import { Table } from '../../db/table/table';
import { TableConstraint } from '../../db/table-constraint/table-constraint';
import { HtmlCheckConstraint } from '../check-constraint/html-check-constraint';
import { HtmlUniqueConstraint } from '../unique-constraint/html-unique-constraint';
import { HtmlColumn } from '../column/html-column';
import { HtmlTableConstraint } from '../table-constraint/html-table-constraint';

export class HtmlTable extends AbstractTable {
  private _tableConstraint: HtmlTableConstraint;

  private _enableOptions = false;
  private _htmlColumns: Array<HtmlColumn>;

  private _zIndex: number;
  private _cutActive = false;

  private _temporaryColumn: HtmlColumn = null;
  private _temporaryTable: HtmlTable = null;

  private _optionsPosition: Position = new Position(0, 0);
  private _calibrateOptions = false;

  private _positionTransition = false;
  private _showMoreTable = false;

  private _removeColumnSubject$: Subject<HtmlColumn> = new Subject();
  private _removeMultipleColumnsSubject$: Subject<Array<HtmlColumn>> = new Subject();

  constructor(id: string, private _diagramId: string) {
    super(id);
    this._tableConstraint = new HtmlTableConstraint(id, _diagramId);
  }

  addColumn(htmlColumn: HtmlColumn): void {
    if (!this._htmlColumns) { this._htmlColumns = []; }

    if (this._htmlColumns.some(column => column.equals(htmlColumn))) { return; }

    const array: Array<HtmlColumn> = this._htmlColumns.filter(val => val.extraColumn);
    const hadExtraColumn: boolean = array.length > 0;

    array.forEach(val => this.deleteColumn(val));

    this._htmlColumns.push(htmlColumn);
    htmlColumn.tableId = this.id;

    if (hadExtraColumn) { this.addEmptyExtraColumn(); }
  }

  public deleteColumn(htmlColumn: HtmlColumn): void {
    if (!this._htmlColumns) { return; }

    const position = this._htmlColumns.findIndex(value => value.equals(htmlColumn));
    this.deleteColumnByPosition(position);
  }

  public deleteColumnByPosition(position: number): void {
    if (!this._htmlColumns || this._htmlColumns.length < position) { return; }

    const column: HtmlColumn = this._htmlColumns[position];
    this._htmlColumns.splice(position, 1);

    this._removeColumnSubject$.next(column);
  }

  public deleteColumnWithoutEmit(htmlColumn: HtmlColumn): void {
    if (!this._htmlColumns) { return; }

    const position = this._htmlColumns.findIndex(value => value.equals(htmlColumn));
    if (position !== -1) { this.htmlColumns.splice(position, 1); }
  }

  public toggleExtraOptions(htmlColumn: HtmlColumn, table: HtmlTable): void {
    this._temporaryColumn = htmlColumn;
    this._temporaryTable = table;
    this._enableOptions = !this._enableOptions;
  }

  public dropColumns() {
    this.removeMultipleColumnsSubject$.next(this.htmlColumns);
    this._htmlColumns = [];
    this._enableOptions = false;
  }

  public dropColumn(): HtmlColumn {
    if (!this._temporaryColumn) { return; }

    this.deleteColumn(this._temporaryColumn);
    this._enableOptions = false;

    return this._temporaryColumn;
  }

  public toggleEditMode(): void {
    this.editableMode ? this.exitEditMode() : this.enterEditMode();
    this._enableOptions = false;
  }

  public revertInitialState(): void {
    if (this.editableMode) {
      this.exitEditMode();
    }
    this._enableOptions = false;
  }

  public exitEditMode(): void {
    this.editableMode = false;
    if (!this.htmlColumns) { return; }

    const columns: Array<HtmlColumn> = this.htmlColumns.filter(val => !val.isValid());
    columns.forEach(val => this.deleteColumnWithoutEmit(val));

    this._removeMultipleColumnsSubject$.next(columns);

    this._htmlColumns.forEach(val => val.showDatatypeDetails = false);
  }

  public enterEditMode(): void {
    this.editableMode = true;
    this.addEmptyExtraColumn();
  }

  public addEmptyExtraColumn(): void {
    if (!this.htmlColumns) { this.htmlColumns = []; }

    if (!this._htmlColumns.some(val => val.extraColumn)) { this.addColumn(ColumnUtil.createExtraColumn(this.id, this._diagramId)); }
  }

  public addExtraColumn(htmlColumn: HtmlColumn): void {
    if (htmlColumn.extraColumn) {
      htmlColumn.extraColumn = false;
      this.addEmptyExtraColumn();
    }
  }

  public hasForeignKeyColumn(): boolean {
    return this._htmlColumns.some(val => val.foreignKey);
  }

  public hasPkColumn(): boolean {
    return this._htmlColumns.findIndex(val => val.primaryKey) !== -1;
  }

  public hasColumnTwice(htmlColumn: HtmlColumn): boolean {
    return this._htmlColumns.filter(column => column.id !== htmlColumn.id)
      .some(column => column.name === htmlColumn.name);
  }

  public addEmptyCheckConstraint(): void {
    this._tableConstraint.addEmptyCheckConstraint();
  }

  public addEmptyUniqueConstraint(): void {
    this._tableConstraint.addEmptyUniqueConstraint();
  }

  public deleteCheckConstraint(checkConstraint: HtmlCheckConstraint): void {
    this._tableConstraint.deleteCheckConstraint(checkConstraint);
  }

  public deleteUniqueConstraint(uniqueConstraint: HtmlUniqueConstraint): void {
    this._tableConstraint.deleteUniqueConstraint(uniqueConstraint);
  }

  public validateConstraints(): void {
    this._tableConstraint.validate();
  }

  public increaseTableWidth(): void {
    this.width += TABLE_WIDTH_UNIT;
  }

  public decreaseTableWidth(): void {
    if (this.width > TABLE_DEFAULT_WIDTH) {
      this.width -= TABLE_WIDTH_UNIT;
    }
  }

  public build(): Table {
    const tableConstraint: TableConstraint = this.buildTableConstraint();

    return new TableBuilder(this.id)
      .withComment(this.comment)
      .withName(this.name)
      .withPosition(this.position)
      .withColumns(this.buildColumns())
      .withPrimaryKeyName(tableConstraint.primaryKeyConstraint.name)
      .withCheckConstraints(tableConstraint.checkConstraints)
      .withUniqueConstraints(tableConstraint.uniqueConstraints)
      .withWidth(this.width)
      .withEditableMode(this.editableMode)
      .build();
  }

  public findColumnById(id: string): HtmlColumn {
    if (!this.htmlColumns) { return null; }

    const position = this.htmlColumns.findIndex(val => val.id === id);

    if (position !== -1) { return this.htmlColumns[position]; }

    return null;
  }

  public areColumnsValid(): boolean {
    const map: Map<string, number> = new Map();

    if (this._htmlColumns) {
      this._htmlColumns.filter(column => column.isValid())
        .forEach(column => {
          if (map.has(column.name)) { map.set(column.name, map.get(column.name) + 1); }
          else { map.set(column.name, 1); }
        })
    }

    for (let [key, value] of map) { if (value > 1) { return false; } }

    return true;
  }

  private buildColumns(): Array<Column> {
    if (!this._htmlColumns) { return []; }

    return this._htmlColumns.filter(val => val.isValid()).map(val => val.build());
  }

  private buildTableConstraint(): TableConstraint {
    if (!this._tableConstraint) { return null; }

    return this._tableConstraint.build();
  }

  public getNameForColumn(name: string): string {
    if (!this.existsColumnByName(name)) { return name; }

    return this.generateName(name, 0);
  }

  private generateName(name: string, index: number): string {
    if (this.existsColumnByName(`${name}_${index}`)) {
      return this.generateName(name, ++index);
    }
    return `${name}_${index}`;
  }

  public exitMoreMode(): void {
    this.exitEditMode();
    this.validateConstraints();
    this.showMoreTable = false;
  }

  private existsColumnByName(name: string): boolean {
    if (!this._htmlColumns) { return false; }

    return this._htmlColumns.some(val => val.name === name);
  }

  get primaryKeyColumns(): Array<HtmlColumn> {
    if (!this.htmlColumns) { return []; }

    return this.htmlColumns.filter(value => value.primaryKey);
  }

  get nonPrimaryKeyColumns(): Array<HtmlColumn> {
    if (!this.htmlColumns) { return []; }

    return this.htmlColumns.filter(value => !value.primaryKey);
  }

  public findColumnIndex(column: AbstractColumn): number {
    if (!this._htmlColumns) { return -1; }

    return this._htmlColumns.findIndex(val => val.equals(column));
  }

  get tableConstraint(): HtmlTableConstraint {
    return this._tableConstraint;
  }

  set tableConstraint(value: HtmlTableConstraint) {
    this._tableConstraint = value;
  }

  get enableOptions(): boolean {
    return this._enableOptions;
  }

  set enableOptions(value: boolean) {
    this._enableOptions = value;
  }

  get htmlColumns(): Array<HtmlColumn> {
    return this._htmlColumns;
  }

  set htmlColumns(value: Array<HtmlColumn>) {
    this._htmlColumns = value;
  }

  get zIndex(): number {
    return this._zIndex;
  }

  set zIndex(value: number) {
    this._zIndex = value;
  }

  get cutActive(): boolean {
    return this._cutActive;
  }

  set cutActive(value: boolean) {
    this._cutActive = value;
  }

  get temporaryColumn(): HtmlColumn {
    return this._temporaryColumn;
  }

  set temporaryColumn(value: HtmlColumn) {
    this._temporaryColumn = value;
  }

  get temporaryTable(): HtmlTable {
    return this._temporaryTable;
  }

  set temporaryTable(value: HtmlTable) {
    this._temporaryTable = value;
  }

  get optionsPosition(): Position {
    return this._optionsPosition;
  }

  set optionsPosition(value: Position) {
    this._optionsPosition = value;
  }

  get calibrateOptions(): boolean {
    return this._calibrateOptions;
  }

  set calibrateOptions(value: boolean) {
    this._calibrateOptions = value;
  }

  get removeColumnSubject$(): Subject<HtmlColumn> {
    return this._removeColumnSubject$;
  }

  get positionTransition(): boolean {
    return this._positionTransition;
  }

  get removeMultipleColumnsSubject$(): Subject<Array<HtmlColumn>> {
    return this._removeMultipleColumnsSubject$;
  }

  get diagramId(): string {
    return this._diagramId;
  }

  set diagramId(value: string) {
    this._diagramId = value;
  }

  set positionTransition(value: boolean) {
    this._positionTransition = value;
  }

  get showMoreTable(): boolean {
    return this._showMoreTable;
  }

  set showMoreTable(value: boolean) {
    this._showMoreTable = value;
  }

  get subject$(): Observable<any> {
    return this._subject$.pipe
      (
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged(compareHtmlTables),
        switchMap(value => of(value))
      );
  }
}
