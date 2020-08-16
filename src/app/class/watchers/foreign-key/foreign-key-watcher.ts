import { from, of, Subject, timer } from 'rxjs/index';
import { Relation } from '../../model/db/accessory/relation';
import { ForeignKeyConstraint } from '../../model/db/foreign-key/foreign-key-constraint';
import { HtmlRelation } from '../../model/html/accessory/html-relation';
import { PartRelation } from '../../model/html/accessory/part-relation';
import { HtmlColumn } from '../../model/html/column/html-column';
import { HtmlDiagram } from '../../model/html/diagram/html-diagram';
import { HtmlForeignKey } from '../../model/html/foreign-key/html-foreign-key';
import { HtmlTable } from '../../model/html/table/html-table';
import { ValidationUtil } from '../../ui/validation-util';
export class ForeignKeyWatcher {
  private _htmlForeignKey: HtmlForeignKey = null;

  public constructor(private _newForeignKeyNotifier$: Subject<HtmlForeignKey>,
    private _newTableNotifier$: Subject<HtmlTable>,
    private _newColumnDiagramNotifier$: Subject<HtmlColumn>,
    private _updateForeignKeyNotifier$: Subject<HtmlForeignKey>,
    private _diagram: HtmlDiagram,
    private _diagaramId) {
  }

  private static tryConstructRelation(childColumn: HtmlColumn, parentColumn: HtmlColumn): HtmlRelation {
    if (childColumn && parentColumn) { return new HtmlRelation(new PartRelation(childColumn), new PartRelation(parentColumn)); }

    return null;
  }

  public start(foreignKey: ForeignKeyConstraint): void {
    if (!this._htmlForeignKey) { of(foreignKey).subscribe(value => this.build(value)); }
    else { of(foreignKey).subscribe(value => this.update(value)); }
  }

  private build(foreignKey: ForeignKeyConstraint): void {
    this._htmlForeignKey = new HtmlForeignKey(foreignKey.id, this._diagaramId);
    this._htmlForeignKey.nameWithoutEmit = foreignKey.name;
    this._htmlForeignKey.commentWithoutEmit = foreignKey.comment;
    this._htmlForeignKey.relations = [];

    this.buildChildTable(foreignKey);
    this.buildParentTable(foreignKey);
    this.buildRelations(foreignKey);
  }

  private buildChildTable(foreignKey: ForeignKeyConstraint): void {
    let index;
    if (this._diagram && this.diagram.htmlTables &&
      (index = this._diagram.htmlTables.findIndex(table => table.id === foreignKey.childTableId)) !== -1) {
      this._htmlForeignKey.childTable = this._diagram.htmlTables[index];
    } else {
      const subscription = this._newTableNotifier$.subscribe(table => {
        if (table.id === foreignKey.childTableId) {
          this._htmlForeignKey.childTable = table;
          if (this.checkForFinish(foreignKey) && this._htmlForeignKey) {
            this._newForeignKeyNotifier$.next(this._htmlForeignKey);
          }
          timer(1000).subscribe(_ => subscription.unsubscribe());
        }
      });
    }
  }

  private buildParentTable(foreignKey: ForeignKeyConstraint): void {
    let index;
    if (this._diagram && this.diagram.htmlTables &&
      (index = this._diagram.htmlTables.findIndex(table => table.id === foreignKey.parentTableId)) !== -1) {
      this._htmlForeignKey.parentTable = this._diagram.htmlTables[index];
    } else {
      const subscription = this._newTableNotifier$.subscribe(table => {
        if (table.id === foreignKey.parentTableId) {
          this._htmlForeignKey.parentTable = table;
          if (this.checkForFinish(foreignKey) && !ValidationUtil.isNullOrUndefined(this._htmlForeignKey)) {
            this._newForeignKeyNotifier$.next(this._htmlForeignKey);
          }
          timer(1000).subscribe(_ => subscription.unsubscribe());
        }
      });
    }
  }

  private buildRelations(foreignKey: ForeignKeyConstraint): void {
    const _newRelationNotifier$: Subject<HtmlRelation> = new Subject();

    const subscription = _newRelationNotifier$.subscribe(relation => {
      this._htmlForeignKey.addRelation(relation);

      if (this._htmlForeignKey.relations.length === foreignKey.relations.length) {
        if (this.checkForFinish(foreignKey) && !ValidationUtil.isNullOrUndefined(this._htmlForeignKey)) {
          this._newForeignKeyNotifier$.next(this._htmlForeignKey);
        }
        timer(1000).subscribe(_ => subscription.unsubscribe());
      }
    });

    from(foreignKey.relations).subscribe(relation => of(relation).subscribe(rel => this.buildRelation(rel, _newRelationNotifier$)));
  }

  private checkForFinish(foreignKey: ForeignKeyConstraint): boolean {
    if (!this._htmlForeignKey.childTable || !this._htmlForeignKey.parentTable) { return false; }

    return this._htmlForeignKey.relations.length === foreignKey.relations.length;
  }

  private buildRelation(relation: Relation, _newRelationNotifier$: Subject<HtmlRelation>): void {
    let childColumn: HtmlColumn, parentColumn: HtmlColumn;

    if (this._htmlForeignKey.childTable && this._htmlForeignKey.parentTable &&
      (childColumn = this._htmlForeignKey.childTable.findColumnById(relation.childColumnId)) !== null &&
      (parentColumn = this._htmlForeignKey.parentTable.findColumnById(relation.parentColumnId)) !== null) {
      const htmlRelation = ForeignKeyWatcher.tryConstructRelation(childColumn, parentColumn);

      if (htmlRelation) {
        _newRelationNotifier$.next(htmlRelation);
        return;
      }
    }

    if (!this._htmlForeignKey.childTable ||
      (childColumn = this._htmlForeignKey.childTable.findColumnById(relation.childColumnId)) === null) {
      const subscription = this._newColumnDiagramNotifier$.subscribe(column => {
        if (column.id === relation.childColumnId) {
          childColumn = column;
          const htmlRelation = ForeignKeyWatcher.tryConstructRelation(childColumn, parentColumn);

          if (htmlRelation) {
            _newRelationNotifier$.next(htmlRelation);
            timer(1000).subscribe(_ => subscription.unsubscribe());
          }
        }
      });
    }

    if (!this._htmlForeignKey.parentTable ||
      (parentColumn = this._htmlForeignKey.parentTable.findColumnById(relation.parentColumnId)) === null) {
      const subscription = this._newColumnDiagramNotifier$.subscribe(column => {
        if (column.id === relation.parentColumnId) {
          parentColumn = column;
          const htmlRelation: HtmlRelation = ForeignKeyWatcher.tryConstructRelation(childColumn, parentColumn);

          if (htmlRelation) {
            _newRelationNotifier$.next(htmlRelation);
            timer(1000).subscribe(_ => subscription.unsubscribe());
          }
        }
      });
    }
  }

  private update(foreignKey: ForeignKeyConstraint): boolean {
    let result = false;

    result = this.updateName(foreignKey.name) || result;
    result = this.updateComment(foreignKey.comment) || result;
    result = this.updateRelations(foreignKey.relations) || result;

    return result;
  }

  private updateName(name: string): boolean {
    if (this._htmlForeignKey.name !== name) {
      this._htmlForeignKey.nameWithoutEmit = name;
      return true;
    }

    return false;
  }

  private updateComment(commnet: string): boolean {
    if (this._htmlForeignKey.comment !== commnet) {
      this._htmlForeignKey.commentWithoutEmit = commnet;
      return true;
    }

    return false;
  }

  private updateRelations(relations: Array<Relation>): boolean {
    return this._htmlForeignKey.relations.length !== relations.length;
  }

  get htmlForeignKey(): HtmlForeignKey {
    return this._htmlForeignKey;
  }

  get diagram(): HtmlDiagram {
    return this._diagram;
  }

  set diagram(value: HtmlDiagram) {
    this._diagram = value;
  }
}
