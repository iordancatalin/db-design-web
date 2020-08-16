import { Injectable } from '@angular/core';
import { HtmlTable } from '../class/model/html/table/html-table';
import { HtmlDiagram } from '../class/model/html/diagram/html-diagram';
import { Position } from '../class/graphics/position';
import { ValidationUtil } from '../class/ui/validation-util';
import { CloneFactory } from '../class/factory/clone-factory';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  private temporaryTable: HtmlTable;
  private temporaryDiagram: HtmlDiagram;

  constructor() {}

  public updateTemporaryTable(table: HtmlTable): void {
    this.temporaryTable = table;
  }

  public setTemporaryTableForCut(table: HtmlTable, diagram: HtmlDiagram): void {
    if (this.temporaryTable && !this.temporaryTable.equals(table)) {
      this.temporaryTable.cutActive = false;
    }
    this.temporaryDiagram = diagram;
    this.updateTemporaryTable(table);
  }

  public doPaste(to: HtmlDiagram, pastePosition: Position): void {
    this.temporaryTable.cutActive
      ? this.cut(to, pastePosition)
      : this.copy(to, pastePosition);
  }

  private copy(to: HtmlDiagram, pastePosition: Position): void {
    const table = CloneFactory.cloneHtmlTable(this.getTemporaryTable(), to.id);
    table.position = pastePosition;
    table.htmlColumns.forEach(column => column.foreignKey = false);
    to.addTable(table);
  }

  private cut(to: HtmlDiagram, pastePosition: Position): void {
    const table = CloneFactory.cloneHtmlTable(this.getTemporaryTable(), to.id);
    table.position = pastePosition;
    table.htmlColumns.forEach(column => column.foreignKey = false);
    this.temporaryDiagram.dropTable(this.getTemporaryTable());
    to.addTable(table);
    this.finishCut();
  }

  public finishCut(): void {
    this.temporaryTable.cutActive = false;
    this.cancelCut();
  }

  public cancelCut(): void {
    this.temporaryTable = null;
  }

  public getTemporaryTable(): HtmlTable {
    if (this.temporaryTable.cutActive) {
      return this.temporaryTable;
    }

    return this.temporaryTable;
  }

  public isTemporaryTable(): boolean {
    return !ValidationUtil.isNullOrUndefined(this.temporaryTable);
  }
}
