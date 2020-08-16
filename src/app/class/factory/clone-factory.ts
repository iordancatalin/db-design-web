import { CommonService } from '../../services/common.service';
import { getSuperPosition } from '../constants/constants';
import { HtmlRelation } from '../model/html/accessory/html-relation';
import { PartRelation } from '../model/html/accessory/part-relation';
import { HtmlCheckConstraintBuilder } from '../model/html/check-constraint/builder/html-check-constraint-builder';
import { HtmlPrimaryKeyBuilder } from '../model/html/primary-key/builder/html-primary-key-builder';
import { HtmlUniqueConstraintBuilder } from '../model/html/unique-constraint/builder/html-unique-constraint-builder';
import { HtmlColumnBuilder } from '../model/html/column/builder/html-column-builder';
import { HtmlTableBuilder } from '../model/html/table/builder/html-table-builder';
import { HtmlCheckConstraint } from '../model/html/check-constraint/html-check-constraint';
import { HtmlForeignKey } from '../model/html/foreign-key/html-foreign-key';
import { HtmlPrimaryKeyConstraint } from '../model/html/primary-key/html-primary-key-constraint';
import { HtmlUniqueConstraint } from '../model/html/unique-constraint/html-unique-constraint';
import { HtmlColumn } from '../model/html/column/html-column';
import { HtmlDiagram } from '../model/html/diagram/html-diagram';
import { HtmlTable } from '../model/html/table/html-table';
import { HtmlTableConstraint } from '../model/html/table-constraint/html-table-constraint';

export class CloneFactory {
  public static cloneHtmlDiagram(fromDiagram: HtmlDiagram): HtmlDiagram {
    const clone: HtmlDiagram = new HtmlDiagram(CommonService.createId());

    clone.name = `${fromDiagram.name}_clone`;

    clone.htmlTables = !fromDiagram.htmlTables ? [] : fromDiagram.htmlTables.map(val => CloneFactory.cloneHtmlTable(val, clone.id));

    clone.htmlForeignKeys = !fromDiagram.htmlForeignKeys ? [] : fromDiagram.htmlForeignKeys.map(val => {
      const childTableIndex: number = fromDiagram.findTableIndex(val.childTable);
      const parentTableIndex: number = fromDiagram.findTableIndex(val.parentTable);

      if (childTableIndex !== -1 && parentTableIndex !== -1) {
        const childTable: HtmlTable = clone.htmlTables[childTableIndex];
        const parentTable: HtmlTable = clone.htmlTables[parentTableIndex];

        return CloneFactory.cloneHtmlForeignKey(val, childTable, parentTable, clone.id);
      }

      return null;
    }).filter(val => val !== null);

    clone.dimension = fromDiagram.dimension.clone();
    clone.position = fromDiagram.position.clone();
    clone.open = false;
    clone.enableOptions = false;
    clone.zoom = 1;
    clone.transitionPosition = false;
    clone.wasDrag = false;
    clone.position = getSuperPosition();

    return clone;
  }

  public static cloneHtmlForeignKey(fromConstraint: HtmlForeignKey,
    childTable: HtmlTable,
    parentTable: HtmlTable,
    diagramId: string): HtmlForeignKey {
    const constraint: HtmlForeignKey = new HtmlForeignKey(CommonService.createId(), diagramId);

    constraint.lines = !fromConstraint.lines ? [] : fromConstraint.lines.map(val => val.clone());
    constraint.childTable = childTable;
    constraint.parentTable = parentTable;
    constraint.foreignKeyZone = null;
    constraint.nameWithoutEmit = fromConstraint.name;
    constraint.commentWithoutEmit = fromConstraint.comment;

    constraint.relations = fromConstraint.relations.map(val => {
      const childColumnIndex: number = fromConstraint.childTable.findColumnIndex(val.childPart.column);
      const parentColumnIndex: number = fromConstraint.parentTable.findColumnIndex(val.parentPart.column);

      if (childColumnIndex !== -1 && parentColumnIndex !== -1) {
        const childPart: PartRelation = new PartRelation(childTable.htmlColumns[childColumnIndex],
          val.childPart.direction,
          val.childPart.status);
        const parentPart: PartRelation = new PartRelation(parentTable.htmlColumns[parentColumnIndex],
          val.parentPart.direction,
          val.parentPart.status);

        return new HtmlRelation(childPart, parentPart);
      }

      return null;
    }).filter(val => val !== null);

    return constraint;
  }

  public static cloneHtmlTable(fromTable: HtmlTable, diagramId: string): HtmlTable {
    const clone: HtmlTable = new HtmlTableBuilder(CommonService.createId(), diagramId)
      .withName(fromTable.name)
      .withComment(fromTable.comment)
      .withPosition(fromTable.position.clone())
      .withWidth(fromTable.width)
      .build();

    clone.tableConstraint = CloneFactory.cloneHtmlTableConstraint(fromTable.tableConstraint, clone.id, diagramId);

    fromTable.htmlColumns.forEach(column => clone.addColumn(CloneFactory.cloneHtmlColumn(column, clone.id, diagramId)));

    return clone;
  }

  public static cloneHtmlColumn(fromColumn: HtmlColumn, tableId: string, diagramId: string): HtmlColumn {
    return new HtmlColumnBuilder(CommonService.createId(), tableId, diagramId)
      .withName(fromColumn.name)
      .withType(fromColumn.type.clone())
      .withDefaultValue(fromColumn.defaultValue)
      .withPrimaryKey(fromColumn.primaryKey)
      .withForeignKey(fromColumn.foreignKey)
      .withNullable(fromColumn.nullable)
      .withAutoincrement(fromColumn.autoincrement)
      .withComment(fromColumn.comment)
      .withUnique(fromColumn.unique)
      .withExtraColumn(false)
      .build();
  }

  public static cloneHtmlTableConstraint(fromTableConstraint: HtmlTableConstraint,
    tableId: string,
    diagramId: string): HtmlTableConstraint {
    const clone: HtmlTableConstraint = new HtmlTableConstraint(tableId, diagramId);
    clone.primaryKeyConstraint = CloneFactory.cloneHtmlPrimaryKeyConstraint(fromTableConstraint.primaryKeyConstraint, tableId, diagramId);
    if (fromTableConstraint.checkConstraints) {
      fromTableConstraint.checkConstraints
        .forEach(constraint => clone.addHtmlCheckConstraint(CloneFactory.cloneHtmlCheckConstraint(constraint, tableId, diagramId)));
    }

    if (fromTableConstraint.uniqueConstraints) {
      fromTableConstraint.uniqueConstraints
        .forEach(constraint => clone.addHtmlUniqueConstraint(CloneFactory.cloneHtmlUniqueConstraint(constraint, tableId, diagramId)));
    }

    return clone;
  }

  public static cloneHtmlPrimaryKeyConstraint(fromConstraint: HtmlPrimaryKeyConstraint,
    tableId: string,
    diagramId: string): HtmlPrimaryKeyConstraint {
    return new HtmlPrimaryKeyBuilder(CommonService.createId(), tableId, diagramId)
      .withName(fromConstraint.name)
      .build();
  }

  public static cloneHtmlUniqueConstraint(fromConstraint: HtmlUniqueConstraint, tableId: string, diagramId: string): HtmlUniqueConstraint {
    return new HtmlUniqueConstraintBuilder(CommonService.createId(), tableId, diagramId)
      .withTextColumns(fromConstraint.textColumns)
      .withName(fromConstraint.name)
      .build();
  }

  public static cloneHtmlCheckConstraint(fromConstraint: HtmlCheckConstraint, tableId: string, diagramId: string): HtmlCheckConstraint {
    return new HtmlCheckConstraintBuilder(CommonService.createId(), tableId, diagramId)
      .withName(fromConstraint.name)
      .withExpression(fromConstraint.expression)
      .build();
  }
}
