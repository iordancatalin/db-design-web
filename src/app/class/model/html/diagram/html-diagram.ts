import { Observable, of, Subject } from 'rxjs/index';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/internal/operators';
import { DEBOUNCE_TIME } from '../../../constants/constants';
import { Dimension } from '../../../graphics/dimension';
import { AbstractDiagram } from '../../../model-abstract/diagram/abstract-diagram';
import { AbstractTable } from '../../../model-abstract/table/abstract-table';
import { compareHtmlDiagrams } from '../../../ui/comparator-util';
import { DiagramBuilder } from '../../db/diagram/builder/diagram-builder';
import { Diagram } from '../../db/diagram/diagram';
import { ForeignKeyConstraint } from '../../db/foreign-key/foreign-key-constraint';
import { Table } from '../../db/table/table';
import { HtmlColumn } from '../column/html-column';
import { HtmlForeignKey } from '../foreign-key/html-foreign-key';
import { HtmlTable } from '../table/html-table';

export class HtmlDiagram extends AbstractDiagram {
  private _htmlTables: Array<HtmlTable>;
  private _open: boolean;
  private _enableOptions = false;
  private _htmlForeignKeys: Array<HtmlForeignKey>;
  private _transitionPosition = false;
  private _wasDrag = false;
  private _dimension: Dimension;

  private _addTableSubject$: Subject<HtmlTable> = new Subject();
  private _removeTableSubject$: Subject<HtmlTable> = new Subject();
  private _addForeignKeySubject$: Subject<HtmlForeignKey> = new Subject();
  private _removeForeignKeySubject$: Subject<HtmlForeignKey> = new Subject();
  private _removeMultipleForeignKeySubject$: Subject<Array<HtmlForeignKey>> = new Subject();
  private _updateMultipleForeignKeySubject$: Subject<Array<HtmlForeignKey>> = new Subject();

  constructor(id: string) { super(id); }

  public getNameForTable(name: string): string {
    return this.generateName(name, 0);
  }

  private generateName(name: string, index: number): string {
    if (this.existsTableWithName(`${name}_${index}`)) {
      return this.generateName(name, ++index);
    }
    return `${name}_${index}`;
  }

  private existsTableWithName(name: string): boolean {
    if (!this._htmlTables) { return false; }

    return this._htmlTables.some(val => val.name === name);
  }

  public increaseScaleFactor(): void {
    if (this.zoom < 2) { this.zoom += 0.1; }
  }

  public decreaseScaleFactor(): void {
    if (this.zoom > 0.5) { this.zoom -= 0.1; }
  }

  public resetScaleFactor(): void { this.zoom = 1; }

  public doRenderForeignKey(foreignKey: HtmlForeignKey): void {
    this.deleteForeignKeyWithoutEmit(foreignKey);
    this.addForeignKeyWithoutEmit(foreignKey);
  }

  public addForeignKey(foreignKey: HtmlForeignKey): void {
    if (!this._htmlForeignKeys) { this._htmlForeignKeys = []; }

    if (!foreignKey) { return; }

    if (this._htmlForeignKeys.map(constraint => constraint.id)
      .some(idConstraint => idConstraint === foreignKey.id)) { return; }

    this._htmlForeignKeys.push(foreignKey);
    this._addForeignKeySubject$.next(foreignKey);
  }

  public addForeignKeyWithoutEmit(foreignKey: HtmlForeignKey): void {
    if (!this._htmlForeignKeys) { this._htmlForeignKeys = []; }

    if (!foreignKey) { return; }

    if (this._htmlForeignKeys.map(constraint => constraint.id)
      .some(idConstraint => idConstraint === foreignKey.id)) {
      return;
    }

    foreignKey.relations.map(val => val.childPart.column).forEach(column => column.foreignKeyWithoutEmit = true)

    this._htmlForeignKeys.push(foreignKey);
  }

  public getForeignKeysByTableId(tableId: string): Array<HtmlForeignKey> {
    if (!this._htmlForeignKeys) { return []; }

    return this._htmlForeignKeys
      .filter(value => value.childTable.id === tableId || value.parentTable.id === tableId);
  }

  public revertAllTables(): void {
    if (!this._htmlTables) { return; }

    this._htmlTables.forEach(value => value.revertInitialState());
  }

  public addTableWithoutEmit(htmlTable: HtmlTable): void {
    if (!this._htmlTables) { this._htmlTables = []; }

    if (this._htmlTables.some(table => table.equals(htmlTable))) { return; }

    this._htmlTables.push(htmlTable);
    htmlTable.diagramId = this.id;
  }

  public addTable(htmlTable: HtmlTable): void {
    if (!this._htmlTables) { this._htmlTables = []; }

    if (this._htmlTables.some(table => table.equals(htmlTable))) { return; }

    this._htmlTables.push(htmlTable);
    htmlTable.diagramId = this.id;

    this._addTableSubject$.next(htmlTable);
  }

  public dropTableWithoutEmit(htmlTable: HtmlTable): void {
    if (htmlTable === null || typeof htmlTable === 'undefined') { return; }

    const position = this._htmlTables.findIndex((value, index, obj) => value.equals(htmlTable));

    if (position === -1) { return; }

    this._htmlTables.splice(position, 1);

    if (this._htmlForeignKeys) {
      const deleteFk = this._htmlForeignKeys
        .filter(value => value.childTable.equals(htmlTable) || value.parentTable.equals(htmlTable));
      deleteFk
        .forEach(value => {
          if (value.parentTable.equals(htmlTable)) {
            value.relations.forEach(part => part.childPart.column.foreignKey = false);
          }

          this._htmlForeignKeys.splice(this._htmlForeignKeys.findIndex(value2 => value2.equals(value)), 1);
        });
    }
  }

  public dropTable(htmlTable: HtmlTable): void {
    if (!htmlTable) { return; }

    const position = this._htmlTables.findIndex(value => value.equals(htmlTable));

    if (position === -1) { return; }

    this._htmlTables.splice(position, 1);

    this._removeTableSubject$.next(htmlTable);
  }

  public deleteForeignKeysByTableWithoutEmit(htmlTable): void {
    if (this._htmlForeignKeys) {
      const deleteFk = this._htmlForeignKeys
        .filter(value => value.childTable.equals(htmlTable) || value.parentTable.equals(htmlTable));
      deleteFk
        .forEach(value =>
          this._htmlForeignKeys.splice(this._htmlForeignKeys.findIndex(value2 => value2.equals(value)), 1));
    }
  }

  public dropTableByKey(event, htmlTable: HtmlTable): void {
    if (event.which === 46) { this.dropTable(htmlTable); }
  }

  public clearAll(): void {
    this._htmlTables = [];
    this._htmlForeignKeys = [];
  }

  public deleteForeignKeysByTable(table: HtmlTable): void {
    if (!this._htmlForeignKeys) { return; }

    const array = this.htmlForeignKeys.filter(value => value.childTable.equals(table) || value.parentTable.equals(table));

    array.forEach(value => {
      value.freeForeignKeyColumnsExceptTable(table);
      this.deleteForeignKeyWithoutEmit(value);
    });

    this._removeMultipleForeignKeySubject$.next(array);
  }

  public deleteFkRelationByColumnWithoutEmit(column: HtmlColumn): void {
    if (this._htmlForeignKeys) {
      this._htmlForeignKeys.filter(value =>
        value.relations.some(relation => relation.childPart.column.equals(column) || relation.parentPart.column.equals(column)))
        .forEach(value => this.deleteForeignKeyWithoutEmit(value));
    }
  }

  public deleteFkRelationsByTableAndColumn(table: HtmlTable, column: HtmlColumn): void {
    if (!this._htmlForeignKeys) { return; }

    const array = this._htmlForeignKeys
      .filter(value => value.childTable.equals(table) || value.parentTable.equals(table));

    array.forEach(value => value.deleteRelationsByColumn(column));

    this._updateMultipleForeignKeySubject$.next(array.filter(value => value.relations.length));

    const fks = this._htmlForeignKeys.filter(value => !value.relations.length);

    fks.forEach(val => this.deleteForeignKeyWithoutEmit(val));

    this._removeMultipleForeignKeySubject$.next(fks);
  }

  public deleteForeignKey(foreignKey: HtmlForeignKey): void {
    if (!this._htmlForeignKeys) { return; }

    foreignKey.freeForeignKeyColumns();
    this.deleteForeignKeyByPosition(this._htmlForeignKeys.findIndex(value => value.equals(foreignKey)));
  }

  public deleteForeignKeyWithoutEmit(foreignKey: HtmlForeignKey): void {
    if (!this._htmlForeignKeys) { return; }

    foreignKey.freeForeignKeyColumnsWithoutEmit();

    const position = this._htmlForeignKeys.findIndex(value => value.equals(foreignKey));

    if (position !== -1) { this.htmlForeignKeys.splice(position, 1); }
  }

  public deleteForeignKeyByPosition(position: number): void {
    if (position < 0 || position >= this._htmlForeignKeys.length) { return; }

    const constraint: HtmlForeignKey = this._htmlForeignKeys[position];
    this._htmlForeignKeys.splice(position, 1);

    this._removeForeignKeySubject$.next(constraint);
  }

  public findForeignKeyById(id: string): HtmlForeignKey {
    if (!this.htmlForeignKeys) { return null; }

    const position = this.htmlForeignKeys.map(val => val.id).findIndex(val => val === id);

    if (position !== -1) { return this.htmlForeignKeys[position]; }

    return null;
  }

  public validateTable(table: HtmlTable) {
    if (this._htmlTables) {
      table.htmlColumns.filter(val => val.extraColumn || !val.isValid()).forEach(val => {
        if (this._htmlForeignKeys) {
          this._htmlForeignKeys.forEach(valFk => {
            valFk.deleteRelationsByColumn(val);
            if (valFk.relations.length === 0) { this.deleteForeignKey(valFk); }
          });
        }
        table.deleteColumn(val);
      });
    }
  }

  public build(): Diagram {
    return new DiagramBuilder(this.id)
      .withName(this.name)
      .withTables(this.buildTables())
      .withForeignKeys(this.buildForeignKeys())
      .withCreationDate(this.creationDate)
      .withOwner(this.owner)
      .withPosition(this.position)
      .withZoom(this.zoom)
      .withShareList(this.share)
      .build();
  }

  private buildTables(): Array<Table> {
    if (!this._htmlTables) { return []; }

    return this._htmlTables.map(val => val.build());
  }

  private buildForeignKeys(): Array<ForeignKeyConstraint> {
    if (!this._htmlForeignKeys) { return []; }

    return this._htmlForeignKeys.map(val => val.build());
  }

  public findTableIndex(table: AbstractTable): number {
    if (!this._htmlTables) { return -1; }

    return this._htmlTables.findIndex(val => val.equals(table));
  }

  public findTableById(id: string): HtmlTable {
    if (!this._htmlTables) { return null; }

    const result = this._htmlTables.filter(val => val.id === id);

    if (result.length > 0) { return result[0]; }

    return null;
  }

  public isDiagramValid(): boolean {

    if (!this._htmlTables) { return true; }

    if (this.areTablesValid()) {
      for (let table of this._htmlTables) {
        if (!table.areColumnsValid()) { return false; }
      }
    } else {
      return false;
    }

    return true;
  }

  public areTablesValid(): boolean {
    const map: Map<string, number> = new Map();

    if (this.htmlTables) {
      this.htmlTables.forEach(table => {
        if (map.has(table.name)) { map.set(table.name, map.get(table.name) + 1); }
        else { map.set(table.name, 1); }
      })
    }

    for (let [key, value] of map) { if (value > 1) { return false; } }

    return true;
  }

  public hasForeignKey(foreignKey: HtmlForeignKey): boolean {
    if (!this.htmlForeignKeys || !this.htmlForeignKeys.length) { return false; }

    return this.htmlForeignKeys.some(fk => fk.id == foreignKey.id);
  }

  get htmlTables(): Array<HtmlTable> {
    return this._htmlTables;
  }

  set htmlTables(value: Array<HtmlTable>) {
    this._htmlTables = value;
  }

  get open(): boolean {
    return this._open;
  }

  set open(value: boolean) {
    this._open = value;
  }

  get enableOptions(): boolean {
    return this._enableOptions;
  }

  set enableOptions(value: boolean) {
    this._enableOptions = value;
  }

  get htmlForeignKeys(): Array<HtmlForeignKey> {
    return this._htmlForeignKeys;
  }

  set htmlForeignKeys(value: Array<HtmlForeignKey>) {
    this._htmlForeignKeys = value;
  }

  get transitionPosition(): boolean {
    return this._transitionPosition;
  }

  set transitionPosition(value: boolean) {
    this._transitionPosition = value;
  }

  get wasDrag(): boolean {
    return this._wasDrag;
  }

  set wasDrag(value: boolean) {
    this._wasDrag = value;
  }

  get addTableSubject$(): Subject<HtmlTable> {
    return this._addTableSubject$;
  }

  get removeTableSubject$(): Subject<HtmlTable> {
    return this._removeTableSubject$;
  }

  get addForeignKeySubject$(): Subject<HtmlForeignKey> {
    return this._addForeignKeySubject$;
  }

  get removeForeignKeySubject$(): Subject<HtmlForeignKey> {
    return this._removeForeignKeySubject$;
  }

  get removeMultipleForeignKeySubject$(): Subject<Array<HtmlForeignKey>> {
    return this._removeMultipleForeignKeySubject$;
  }

  get updateMultipleForeignKeySubject$(): Subject<Array<HtmlForeignKey>> {
    return this._updateMultipleForeignKeySubject$;
  }

  get dimension(): Dimension { return this._dimension; }

  set dimension(value: Dimension) { this._dimension = value; }

  get subject$(): Observable<HtmlDiagram> {
    return this._subject$.pipe
      (
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged(compareHtmlDiagrams),
        switchMap(value => of(value))
      );
  }
}
