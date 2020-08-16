import { DiagramComponent } from "../../components/diagram/diagram.component";
import { DiagramTool } from "../data/data-util";
import { DiagramsStorage } from "../holder/diagrams-storage";
import { HtmlCheckConstraint } from "../model/html/check-constraint/html-check-constraint";
import { HtmlForeignKey } from "../model/html/foreign-key/html-foreign-key";
import { HtmlUniqueConstraint } from "../model/html/unique-constraint/html-unique-constraint";
import { HtmlColumn } from "../model/html/column/html-column";
import { HtmlDiagram } from "../model/html/diagram/html-diagram";
import { HtmlTable } from "../model/html/table/html-table";
import { AbstractDiagram } from "../model-abstract/diagram/abstract-diagram";

export class DiagramResult {
  constructor(
    public diagram: HtmlDiagram,
    public event?: any,
    public emiter?: DiagramComponent
  ) { }
}

export class TableResult {
  constructor(public table: HtmlTable, public event?: any) { }
}

export class ColumnResult {
  constructor(public column: HtmlColumn, public event?: any) { }
}

export class ToolResult {
  constructor(public tool: DiagramTool, public event?: any) { }
}

export class HolderResult {
  constructor(public holder: DiagramsStorage, public event?: any) { }
}

export class RelationResult {
  constructor(
    public table: HtmlTable,
    public columns: Array<HtmlColumn>,
    event?: any
  ) { }
}

export class TableColumnResult {
  constructor(
    public table: HtmlTable,
    public column: HtmlColumn,
    event?: any
  ) { }
}

export class DiagramTableResult {
  constructor(
    public diagram: HtmlDiagram,
    public table: HtmlTable,
    public diagramComponent: DiagramComponent,
    public event?: any
  ) { }
}

export class ForeignKeyResult {
  constructor(public foreignKey: HtmlForeignKey, public event?: any) { }
}

export class CheckConstraintResult {
  constructor(
    public checkConstraint: HtmlCheckConstraint,
    public event?: any
  ) { }
}

export class UniqueConstraintResult {
  constructor(
    public uniqueConstraint: HtmlUniqueConstraint,
    public event?: any
  ) { }
}

export class IntResult {
  constructor(public value: number) { }
}

export class AbstractDiagramResult {
  constructor(public diagram: AbstractDiagram) { }
}
