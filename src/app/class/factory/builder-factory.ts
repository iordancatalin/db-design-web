import {DIAGRAM_MIN_HEIGHT, DIAGRAM_MIN_WIDTH} from '../constants/constants';
import {Column} from '../model/db/column/column';
import {CheckConstraint} from '../model/db/check-constraint/check-constraint';
import {ForeignKeyConstraint} from '../model/db/foreign-key/foreign-key-constraint';
import {UniqueConstraint} from '../model/db/unique-constraint/unique-constraint';
import {Diagram} from '../model/db/diagram/diagram';
import {Table} from '../model/db/table/table';
import {HtmlDataType} from '../model/html/accessory/html-data-type';
import {HtmlRelation} from '../model/html/accessory/html-relation';
import {PartRelation} from '../model/html/accessory/part-relation';
import {HtmlCheckConstraintBuilder} from '../model/html/check-constraint/builder/html-check-constraint-builder';
import {HtmlUniqueConstraintBuilder} from '../model/html/unique-constraint/builder/html-unique-constraint-builder';
import {HtmlColumnBuilder} from '../model/html/column/builder/html-column-builder';
import {HtmlDiagramBuilder} from '../model/html/diagram/builder/html-diagram-builder';
import {HtmlTableBuilder} from '../model/html/table/builder/html-table-builder';
import {HtmlForeignKey} from '../model/html/foreign-key/html-foreign-key';
import {HtmlColumn} from '../model/html/column/html-column';
import {HtmlDiagram} from '../model/html/diagram/html-diagram';
import {HtmlTable} from '../model/html/table/html-table';
import {ValidationUtil} from '../ui/validation-util';

export class BuilderFactory {
  public static buildShallowHtmlDiagram(diagram: Diagram): HtmlDiagram {
    return new HtmlDiagramBuilder(diagram.id)
      .withName(diagram.name)
      .withCreationDate(diagram.creationDate)
      .withOwner(diagram.owner)
      .withPosition(diagram.position)
      .withShareList(diagram.share)
      .build();
  }

  public static buildShallowHtmlTable(table: Table, diagramId: string): HtmlTable {
    return new HtmlTableBuilder(table.id, diagramId)
      .withName(table.name)
      .withPosition(table.position)
      .withEditableMode(false)
      .withWidth(table.width)
      .withComment(table.comment)
      .withPrimaryKeyName(table.primaryKeyName)
      .build();

  }

  public static buildShallowHtmlColumn(column: Column, tableId: string, diagramId: string): HtmlColumn {
    return new HtmlColumnBuilder(column.id, tableId, diagramId)
      .withType(new HtmlDataType(column.type, null, null))
      .withName(column.name)
      .withComment(column.comment)
      .withNullable(column.nullable)
      .withExtraColumn(false)
      .withUnique(column.unique)
      .withAutoincrement(column.autoincrement)
      .withPrimaryKey(column.primaryKey)
      .withForeignKey(column.foreignKey)
      .withDefaultValue(column.defaultValue)
      .build();
  }

  public static buildShallowHtmlForeignKey(foreignKey: ForeignKeyConstraint, diagram: HtmlDiagram): HtmlForeignKey {
    const childTable: HtmlTable = diagram.findTableById(foreignKey.childTableId);
    const parentTable: HtmlTable = diagram.findTableById(foreignKey.parentTableId);

    let relations = [];

    if (!ValidationUtil.isNullOrUndefined(foreignKey.relations)) {
      relations = foreignKey.relations.map(val => {
        const childColumn: HtmlColumn = childTable.findColumnById(val.childColumnId);
        const parentColumn: HtmlColumn = parentTable.findColumnById(val.parentColumnId);

        childColumn.type = parentColumn.type;

        return new HtmlRelation(new PartRelation(childColumn), new PartRelation(parentColumn));
      });
    }
    const constraint: HtmlForeignKey = new HtmlForeignKey(foreignKey.id, diagram.id);
    constraint.childTable = childTable;
    constraint.parentTable = parentTable;
    constraint.relations = relations;
    constraint.nameWithoutEmit = foreignKey.name;
    constraint.commentWithoutEmit = foreignKey.comment;

    return constraint;
  }

  public static buildShallowHtmlCheckConstraint(checkConstraint: CheckConstraint, tableId: string, diagramId: string) {
    return new HtmlCheckConstraintBuilder(checkConstraint.id, tableId, diagramId)
      .withName(checkConstraint.name)
      .withExpression(checkConstraint.expression)
      .build();
  }

  public static buildShallowHtmlUniqueConstraint(uniqueConstraint: UniqueConstraint, tableId: string, diagramId: string) {
    return new HtmlUniqueConstraintBuilder(uniqueConstraint.id, tableId, diagramId)
      .withName(uniqueConstraint.name)
      .withTextColumns(ValidationUtil.isNullOrUndefined(uniqueConstraint.columns) ? '' : uniqueConstraint.columns.join(','))
      .build();
  }

}
