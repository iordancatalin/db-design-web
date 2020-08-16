import * as $ from 'jquery';
import {DirectionEnum} from '../class/enum/direction-enum';
import {ForeignKeyZone} from '../class/enum/foreign-key-zone';
import {PositionStatus} from '../class/enum/position-status';
import {Occupation, OccupationModel} from '../class/graphics/occupation-model';
import {Position} from '../class/graphics/position';
import {HtmlLine} from '../class/model/html/accessory/html-line';
import {PartRelation} from '../class/model/html/accessory/part-relation';
import {HtmlForeignKey} from '../class/model/html/foreign-key/html-foreign-key';
import {HtmlColumn} from '../class/model/html/column/html-column';
import {HtmlTable} from '../class/model/html/table/html-table';
import {getElementOffsetById} from './jquery-funtions';

const EXTENSION_SIZE = 20;
const TABLE_BORDER = 2;

export function updateHtmlForeignKeyLines(foreignKey: HtmlForeignKey,
                                          calculatePositionFromTable: boolean = false,
                                          scaleFactor: number = 1,
                                          containerWidth: number,
                                          first: boolean = false): Array<HtmlLine> {
  const parentTablePosition: Position = calculatePositionFromTable ? foreignKey.parentTable.position.clone()
    : getTablePosition(foreignKey.parentTable);
  const childTablePosition: Position = calculatePositionFromTable ? foreignKey.childTable.position.clone()
    : getTablePosition(foreignKey.childTable);

  const parentWidth = foreignKey.parentTable.editableMode ? getElementWidth(foreignKey.parentTable.id) : foreignKey.parentTable.width;
  const childWidth = foreignKey.childTable.editableMode ? getElementWidth(foreignKey.childTable.id) : foreignKey.childTable.width;

  const parentTableWidth: number = parentWidth * scaleFactor;
  const childTableWidth: number = childWidth * scaleFactor;

  return first ? firstCreateRelations(foreignKey,
    calculatePositionFromTable,
    scaleFactor,
    parentTablePosition,
    childTablePosition,
    parentTableWidth,
    childTableWidth,
    foreignKey.childTable.id,
    foreignKey.parentTable.id) : updateRelations(foreignKey,
    calculatePositionFromTable,
    scaleFactor,
    containerWidth,
    parentTablePosition,
    childTablePosition,
    parentTableWidth,
    childTableWidth,
    foreignKey.childTable.id,
    foreignKey.parentTable.id);
}

function updateRelations(foreignKey: HtmlForeignKey,
                         calculatePositionFromTable: boolean,
                         scaleFactor: number = 1,
                         containerWidth: number,
                         parentTablePosition: Position,
                         childTablePosition: Position,
                         parentTableWidth: number,
                         childTableWidth: number,
                         childTableId: string,
                         parentTableId: string) {

  let lines: Array<HtmlLine> = [];

  const zone: ForeignKeyZone = findForeignKeyZone(foreignKey,
    parentTablePosition,
    childTablePosition,
    parentTableWidth,
    childTableWidth,
    childTableId,
    parentTableId);

  if (zone !== foreignKey.foreignKeyZone) {
    foreignKey.relations.forEach(value => {
      resetOccupation(value.parentPart);
      resetOccupation(value.childPart);
    });

    updateHtmlForeignKeyLines(foreignKey, calculatePositionFromTable, scaleFactor, containerWidth, true);
  }

  const childLines: Array<HtmlLine> = [];
  const parentLines: Array<HtmlLine> = [];

  if (zone === ForeignKeyZone.ZONE_ONE) {
    foreignKey.relations.forEach((value) => {
      let columnPosition = getColumnPosition(foreignKey.childTable, value.childPart.column, calculatePositionFromTable, scaleFactor);
      childLines.push(addExtensionToLeft(getColumnPositionByStatus(columnPosition,
        value.childPart.status,
        foreignKey.childTable.id), false));
      columnPosition = getColumnPosition(foreignKey.parentTable, value.parentPart.column, calculatePositionFromTable, scaleFactor);
      parentLines.push(addExtensionToLeft(getColumnPositionByStatus(columnPosition,
        value.parentPart.status,
        foreignKey.parentTable.id), true));
    });

    const extensionSize = 20;
    const startPosition = connectLeftExtensions(childLines, extensionSize);
    const endPosition = connectLeftExtensions(parentLines, extensionSize);

    lines = lines.concat(childLines);
    lines = lines.concat(parentLines);
    lines = lines.concat(findCloseLineLeft(startPosition, endPosition));
  }

  if (zone === ForeignKeyZone.ZONE_TWO) {
    foreignKey.relations.forEach(value => {
      const childColumnPosition = getColumnPosition(foreignKey.childTable, value.childPart.column, calculatePositionFromTable, scaleFactor);
      childColumnPosition.left += childTableWidth;
      childLines.push(addExtensionToRight(getColumnPositionByStatus(childColumnPosition,
        value.childPart.status,
        foreignKey.childTable.id), false));
      const parentColumnPosition = getColumnPosition(foreignKey.parentTable,
        value.parentPart.column,
        calculatePositionFromTable, scaleFactor);
      parentColumnPosition.left += parentTableWidth;
      parentLines.push(addExtensionToRight(getColumnPositionByStatus(parentColumnPosition,
        value.parentPart.status,
        foreignKey.parentTable.id), true));
    });

    const extensionSize = 20;
    const startPosition = connectRightExtensions(childLines, extensionSize);
    const endPosition = connectRightExtensions(parentLines, extensionSize);

    lines = lines.concat(childLines);
    lines = lines.concat(parentLines);
    lines = lines.concat(findCloseLineRight(startPosition, endPosition));
  }

  if (zone === ForeignKeyZone.ZONE_THREE) {
    const extensionSize: number = (childTablePosition.left - parentTablePosition.left - parentTableWidth) < 5 * EXTENSION_SIZE
      ? (childTablePosition.left - parentTablePosition.left - parentTableWidth) / 5 : EXTENSION_SIZE;
    const arrowHead: boolean = (childTablePosition.left - parentTablePosition.left - parentTableWidth) > 45;

    foreignKey.relations.forEach(value => {
      let columnPosition = getColumnPosition(foreignKey.childTable, value.childPart.column, calculatePositionFromTable, scaleFactor);
      childLines.push(addExtensionToLeft(getColumnPositionByStatus(columnPosition,
        value.childPart.status,
        foreignKey.childTable.id), false, extensionSize));
      columnPosition = getColumnPosition(foreignKey.parentTable, value.parentPart.column, calculatePositionFromTable, scaleFactor);
      columnPosition.left += parentTableWidth;
      parentLines.push(addExtensionToRight(getColumnPositionByStatus(columnPosition,
        value.parentPart.status,
        foreignKey.parentTable.id), arrowHead, extensionSize));
    });

    const startPosition = connectLeftExtensions(childLines, extensionSize);
    const endPosition = connectRightExtensions(parentLines, extensionSize);

    lines = lines.concat(childLines);
    lines = lines.concat(parentLines);
    lines = lines.concat(findNormalLines(startPosition, endPosition));
  }

  if (zone === ForeignKeyZone.ZONE_FOUR) {
    const extensionSize: number = (parentTablePosition.left - childTablePosition.left - childTableWidth) < 5 * EXTENSION_SIZE
      ? (parentTablePosition.left - childTablePosition.left - childTableWidth) / 5 : EXTENSION_SIZE;
    const arrowHead: boolean = (parentTablePosition.left - childTablePosition.left - childTableWidth) > 45;

    foreignKey.relations.forEach(value => {
      let columnPosition = getColumnPosition(foreignKey.childTable, value.childPart.column, calculatePositionFromTable, scaleFactor);
      columnPosition.left += childTableWidth;
      childLines.push(addExtensionToRight(getColumnPositionByStatus(columnPosition,
        value.childPart.status,
        foreignKey.childTable.id), false, extensionSize));
      columnPosition = getColumnPosition(foreignKey.parentTable, value.parentPart.column, calculatePositionFromTable, scaleFactor);
      parentLines.push(addExtensionToLeft(getColumnPositionByStatus(columnPosition,
        value.parentPart.status,
        foreignKey.parentTable.id), arrowHead, extensionSize));
    });

    const startPosition = connectRightExtensions(childLines, extensionSize);
    const endPosition = connectLeftExtensions(parentLines, extensionSize);

    lines = lines.concat(childLines);
    lines = lines.concat(parentLines);
    lines = lines.concat(findNormalLines(startPosition, endPosition));
  }

  return lines;
}

function resetOccupation(part: PartRelation): void {
  if (part.direction === DirectionEnum.LEFT) {
    resetOccupationGen(part.column.occupationModel.leftOccupation, part.status);
  } else if (part.direction === DirectionEnum.RIGHT) {
    resetOccupationGen(part.column.occupationModel.rightOccupation, part.status);
  }
}

function resetOccupationGen(occupation: Occupation, status: PositionStatus) {
  if (status === PositionStatus.MIDDLE) {
    occupation.middle = false;
  } else if (status === PositionStatus.TOP) {
    occupation.top = false;
  } else if (status === PositionStatus.BOTTOM) {
    occupation.bottom = false;
  }
}

function getColumnPositionByStatus(currentPosition: Position, status: PositionStatus, tableId: string): Position {
  if (status === PositionStatus.MIDDLE) {
    return currentPosition;
  }

  const height = getColumnHeight(tableId) / 4;

  if (status === PositionStatus.TOP) {
    currentPosition.top -= height;
  }

  if (status === PositionStatus.BOTTOM) {
    currentPosition.top += height;
  }

  return currentPosition;
}

function firstCreateRelations(foreignKey: HtmlForeignKey,
                              calculatePositionFromTable: boolean,
                              scaleFactor: number = 1,
                              parentTablePosition: Position,
                              childTablePosition: Position,
                              parentTableWidth: number,
                              childTableWidth: number,
                              childTableId: string,
                              parentTableId: string) {
  let lines: Array<HtmlLine> = [];

  const zone: ForeignKeyZone = findForeignKeyZone(foreignKey, parentTablePosition,
    childTablePosition,
    parentTableWidth,
    childTableWidth,
    childTableId,
    parentTableId);

  foreignKey.foreignKeyZone = zone;

  const childLines: Array<HtmlLine> = [];
  const parentLines: Array<HtmlLine> = [];

  if (zone === ForeignKeyZone.ZONE_ONE) {
    foreignKey.relations.forEach(value => {
      let fixedColumn = fixColumnPosition(value.childPart.column.occupationModel,
        getColumnPosition(foreignKey.childTable,
          value.childPart.column,
          calculatePositionFromTable,
          scaleFactor), false, foreignKey.childTable.id);

      value.childPart.updateDirectionAndStatus(DirectionEnum.LEFT, fixedColumn.occupied);
      childLines.push(addExtensionToLeft(fixedColumn.position, false));

      fixedColumn = fixColumnPosition(value.parentPart.column.occupationModel,
        getColumnPosition(foreignKey.parentTable,
          value.parentPart.column,
          calculatePositionFromTable,
          scaleFactor), false, foreignKey.parentTable.id);

      value.parentPart.updateDirectionAndStatus(DirectionEnum.LEFT, fixedColumn.occupied);
      parentLines.push(addExtensionToLeft(fixedColumn.position, true));
    });

    const extensionSize = 20;
    const startPosition = connectLeftExtensions(childLines, extensionSize);
    const endPosition = connectLeftExtensions(parentLines, extensionSize);

    lines = lines.concat(childLines);
    lines = lines.concat(parentLines);
    lines = lines.concat(findCloseLineLeft(startPosition, endPosition));
  }

  if (zone === ForeignKeyZone.ZONE_TWO) {
    foreignKey.relations.forEach(value => {
      const childColumnPosition = getColumnPosition(foreignKey.childTable, value.childPart.column, calculatePositionFromTable, scaleFactor);
      childColumnPosition.left += childTableWidth;

      let fixedColumn = fixColumnPosition(value.childPart.column.occupationModel, childColumnPosition, true, foreignKey.childTable.id);

      value.childPart.updateDirectionAndStatus(DirectionEnum.RIGHT, fixedColumn.occupied);
      childLines.push(addExtensionToRight(fixedColumn.position, false));

      const parentColumnPosition = getColumnPosition(foreignKey.parentTable,
        value.parentPart.column,
        calculatePositionFromTable,
        scaleFactor);

      parentColumnPosition.left += parentTableWidth;
      fixedColumn = fixColumnPosition(value.parentPart.column.occupationModel, parentColumnPosition, true, foreignKey.parentTable.id);

      value.parentPart.updateDirectionAndStatus(DirectionEnum.RIGHT, fixedColumn.occupied);
      parentLines.push(addExtensionToRight(fixedColumn.position, true));
    });

    const extensionSize: number = EXTENSION_SIZE;
    const startPosition = connectRightExtensions(childLines, extensionSize);
    const endPosition = connectRightExtensions(parentLines, extensionSize);

    lines = lines.concat(childLines);
    lines = lines.concat(parentLines);
    lines = lines.concat(findCloseLineRight(startPosition, endPosition));
  }

  if (zone === ForeignKeyZone.ZONE_THREE) {
    const extensionSize: number = (childTablePosition.left - parentTablePosition.left - parentTableWidth) < 5 * EXTENSION_SIZE
      ? (childTablePosition.left - parentTablePosition.left - parentTableWidth) / 5 : EXTENSION_SIZE;
    const arrowHead: boolean = (childTablePosition.left - parentTablePosition.left - parentTableWidth) > 45;

    foreignKey.relations.forEach(value => {
      let fixedColumn = fixColumnPosition(value.childPart.column.occupationModel,
        getColumnPosition(foreignKey.childTable,
          value.childPart.column,
          calculatePositionFromTable,
          scaleFactor), false, foreignKey.childTable.id);

      value.childPart.updateDirectionAndStatus(DirectionEnum.LEFT, fixedColumn.occupied);
      childLines.push(addExtensionToLeft(fixedColumn.position, false, extensionSize));

      const columnPosition = getColumnPosition(foreignKey.parentTable, value.parentPart.column, calculatePositionFromTable, scaleFactor);
      columnPosition.left += parentTableWidth;
      fixedColumn = fixColumnPosition(value.parentPart.column.occupationModel, columnPosition, true, foreignKey.parentTable.id);

      value.parentPart.updateDirectionAndStatus(DirectionEnum.RIGHT, fixedColumn.occupied);
      parentLines.push(addExtensionToRight(fixedColumn.position, arrowHead, extensionSize));
    });

    const startPosition = connectLeftExtensions(childLines, extensionSize);
    const endPosition = connectRightExtensions(parentLines, extensionSize);

    lines = lines.concat(childLines);
    lines = lines.concat(parentLines);
    lines = lines.concat(findNormalLines(startPosition, endPosition));
  }

  if (zone === ForeignKeyZone.ZONE_FOUR) {
    const extensionSize: number = (parentTablePosition.left - childTablePosition.left - childTableWidth) < 5 * EXTENSION_SIZE
      ? (parentTablePosition.left - childTablePosition.left - childTableWidth) / 5 : EXTENSION_SIZE;
    const arrowHead: boolean = (parentTablePosition.left - childTablePosition.left - childTableWidth) > 45;

    foreignKey.relations.forEach(value => {
      let columnPosition = getColumnPosition(foreignKey.childTable, value.childPart.column, calculatePositionFromTable, scaleFactor);
      columnPosition.left += childTableWidth;
      let fixedColumn = fixColumnPosition(value.childPart.column.occupationModel, columnPosition, true, foreignKey.childTable.id);

      value.childPart.updateDirectionAndStatus(DirectionEnum.RIGHT, fixedColumn.occupied);
      childLines.push(addExtensionToRight(fixedColumn.position, false, extensionSize));

      columnPosition = getColumnPosition(foreignKey.parentTable, value.parentPart.column, calculatePositionFromTable, scaleFactor);
      fixedColumn = fixColumnPosition(value.parentPart.column.occupationModel, columnPosition, false, foreignKey.parentTable.id);

      value.parentPart.updateDirectionAndStatus(DirectionEnum.LEFT, fixedColumn.occupied);
      parentLines.push(addExtensionToLeft(fixedColumn.position, arrowHead, extensionSize));
    });

    const startPosition = connectRightExtensions(childLines, extensionSize);
    const endPosition = connectLeftExtensions(parentLines, extensionSize);

    lines = lines.concat(childLines);
    lines = lines.concat(parentLines);
    lines = lines.concat(findNormalLines(startPosition, endPosition));
  }

  return lines;
}

function findForeignKeyZone(foreignKey: HtmlForeignKey,
                            parentTablePosition: Position,
                            childTablePosition: Position,
                            parentTableWidth: number,
                            childTableWidth: number,
                            childTableId: string,
                            parentTableId: string) {
  if ((parentTablePosition.left < childTablePosition.left
    && (parentTablePosition.left + parentTableWidth) > childTablePosition.left)
    || (parentTablePosition.left < (childTablePosition.left + childTableWidth)
    && (parentTablePosition.left + parentTableWidth) > (childTablePosition.left + childTableWidth)
    || foreignKey.childTable.equals(foreignKey.parentTable))
    || (parentTablePosition.left < childTablePosition.left &&
    parentTablePosition.left + parentTableWidth > childTablePosition.left + childTableWidth)
    || (parentTablePosition.left > childTablePosition.left &&
    parentTablePosition.left + parentTableWidth < childTablePosition.left + childTableWidth)) {
    const childTableOffset = getElementOffsetById(childTableId);
    const parentTableOffset = getElementOffsetById(parentTableId);

    if ((parentTableOffset.left > childTableOffset.left ? parentTableOffset.left
        : childTableOffset.left) < window.outerWidth / 2) {
      return ForeignKeyZone.ZONE_ONE;
    }

    return ForeignKeyZone.ZONE_TWO;
  }

  if (childTablePosition.left > parentTablePosition.left) {
    return ForeignKeyZone.ZONE_THREE;
  }

  if (childTablePosition.left === parentTablePosition.left) {
    const childTableOffset = getElementOffsetById(childTableId);
    const parentTableOffset = getElementOffsetById(parentTableId);

    if ((parentTableOffset.left > childTableOffset.left ? parentTableOffset.left
        : childTableOffset.left) < window.outerWidth / 2) {
      return ForeignKeyZone.ZONE_ONE;
    }

    return ForeignKeyZone.ZONE_TWO;
  }

  return ForeignKeyZone.ZONE_FOUR;
}

function fixColumnPosition(occupationModel: OccupationModel,
                           currentPosition: Position,
                           right: boolean = false,
                           tableId: string): { position: Position, occupied: PositionStatus } {
  let result;

  if (right) {
    result = fixColumnGeneric(occupationModel.rightOccupation, occupationModel.rightLastOccupied, currentPosition, tableId);
    occupationModel.rightLastOccupied = result.occupied;
  } else {
    result = fixColumnGeneric(occupationModel.leftOccupation, occupationModel.leftLastOccupied, currentPosition, tableId);
    occupationModel.leftLastOccupied = result.occupied;
  }

  return result;
}

function fixColumnGeneric(occupation: Occupation,
                          status: PositionStatus,
                          currentPosition: Position,
                          tableId: string): { position: Position, occupied: PositionStatus } {
  if (!occupation.middle) {
    occupation.middle = true;
    return {position: currentPosition, occupied: PositionStatus.MIDDLE};
  }

  const height = getColumnHeight(tableId) / 4;

  if (!occupation.top) {
    currentPosition.top -= height;
    occupation.top = true;
    return {position: currentPosition, occupied: PositionStatus.TOP};
  }

  if (!occupation.bottom) {
    currentPosition.top += height;
    occupation.bottom = true;
    return {position: currentPosition, occupied: PositionStatus.BOTTOM};
  }

  if (status === PositionStatus.MIDDLE) {
    currentPosition.top -= height;
    return {position: currentPosition, occupied: PositionStatus.TOP};
  }

  if (status === PositionStatus.TOP) {
    currentPosition.top += height;
    return {position: currentPosition, occupied: PositionStatus.BOTTOM};
  }

  if (status === PositionStatus.BOTTOM) {
    return {position: currentPosition, occupied: PositionStatus.MIDDLE};
  }
}

function findCloseLineRight(startPosition: Position, endPosition: Position): Array<HtmlLine> {
  const lines: Array<HtmlLine> = [];
  const keyPosition = new Position(0, 0);
  if (startPosition.left < endPosition.left) {
    keyPosition.left = endPosition.left;
    keyPosition.top = startPosition.top;
  } else {
    keyPosition.left = startPosition.left;
    keyPosition.top = endPosition.top;
  }

  lines.push(new HtmlLine(startPosition, keyPosition, false));
  lines.push(new HtmlLine(keyPosition, endPosition, false));

  return lines;
}

function findCloseLineLeft(startPosition: Position, endPosition: Position): Array<HtmlLine> {
  const lines: Array<HtmlLine> = [];
  const keyPosition = new Position(0, 0);
  if (startPosition.left < endPosition.left) {
    keyPosition.left = startPosition.left;
    keyPosition.top = endPosition.top;
  } else {
    keyPosition.left = endPosition.left;
    keyPosition.top = startPosition.top;
  }

  lines.push(new HtmlLine(startPosition, keyPosition, false));
  lines.push(new HtmlLine(keyPosition, endPosition, false));

  return lines;
}

function connectLeftExtensions(lines: Array<HtmlLine>, extensionSize: number = EXTENSION_SIZE): Position {
  if (lines.length <= 0) {
    return null;
  }
  if (lines.length === 1) {
    return lines[0].end;
  }

  let topLine = lines[0], bottomLine = lines[0];

  lines.forEach(value => {
    if (value.end.top > bottomLine.end.top) {
      bottomLine = value;
    }
    if (value.end.top < topLine.end.top) {
      topLine = value;
    }
  });

  lines.push(new HtmlLine(topLine.end, bottomLine.end, false));
  const middle = (bottomLine.end.top - topLine.end.top) / 2;
  const startPosition = new Position(topLine.end.left, topLine.end.top + middle);
  const endPosition = new Position(topLine.end.left - extensionSize, topLine.end.top + middle);
  lines.push(new HtmlLine(startPosition, endPosition, false));

  return endPosition;
}

function connectRightExtensions(lines: Array<HtmlLine>, extensionSize: number = EXTENSION_SIZE): Position {
  if (lines.length <= 0) {
    return null;
  }
  if (lines.length === 1) {
    return lines[0].end;
  }

  let topLine = lines[0], bottomLine = lines[0];

  lines.forEach(value => {
    if (value.end.top > bottomLine.end.top) {
      bottomLine = value;
    }
    if (value.end.top < topLine.end.top) {
      topLine = value;
    }
  });

  lines.push(new HtmlLine(topLine.end, bottomLine.end, false));
  const middle = (bottomLine.end.top - topLine.end.top) / 2;
  const startPosition = new Position(topLine.end.left, topLine.end.top + middle);
  const endPosition = new Position(topLine.end.left + extensionSize, topLine.end.top + middle);
  lines.push(new HtmlLine(startPosition, endPosition, false));

  return endPosition;
}

function findNormalLines(startPosition: Position, endPosition: Position): Array<HtmlLine> {
  const lines: Array<HtmlLine> = [];

  const nextPosition = new Position(0, 0);
  nextPosition.top = startPosition.top;
  const middle = Math.abs(startPosition.left - endPosition.left) / 2;
  const minLeft = startPosition.left < endPosition.left ? startPosition.left : endPosition.left;
  nextPosition.left = middle + minLeft;

  lines.push(new HtmlLine(startPosition, nextPosition, false));

  const position = new Position(0, 0);
  position.left = nextPosition.left;
  position.top = endPosition.top;

  lines.push(new HtmlLine(nextPosition, position, false));
  lines.push(new HtmlLine(position, endPosition, false));

  return lines;
}

function getColumnPosition(table: HtmlTable, column: HtmlColumn, calculatePositionFromTable: boolean, scaleFactor: number = 1) {
  const position = calculatePositionFromTable ? table.position.clone() : getTablePosition(table);
  const primaryKeyArray = table.htmlColumns.filter(value => value.primaryKey);
  const array: Array<HtmlColumn> = column.primaryKey ? primaryKeyArray : table.htmlColumns;

  let columnIndex: number = array.findIndex(value => column.equals(value));
  let count = 0;

  for (let i = columnIndex; i < array.length; i++) {
    if (array[i].primaryKey) {
      count++;
    }
  }

  if (!column.primaryKey) {
    columnIndex += count;
  }

  const headerHeight = $('#' + table.id).find('.db-header').first().outerHeight() * scaleFactor;
  const columnHeight = getColumnHeight(table.id) * scaleFactor;
  position.top += headerHeight;
  position.top += columnHeight / 2;
  position.top += columnHeight * columnIndex;

  return position;
}

function addExtensionToLeft(columnPosition: Position, finalLine: boolean = false, extensionSize: number = EXTENSION_SIZE): HtmlLine {
  return new HtmlLine(columnPosition.clone(), new Position(columnPosition.left - extensionSize, columnPosition.top), finalLine);
}

function addExtensionToRight(columnPosition: Position, finalLine: boolean, extensionSize: number = EXTENSION_SIZE): HtmlLine {
  return new HtmlLine(columnPosition.clone(), new Position(columnPosition.left + extensionSize, columnPosition.top), finalLine);
}

function getTablePosition(table: HtmlTable): Position {
  const elementPosition = $('#' + table.id).position();
  return new Position(elementPosition.left, elementPosition.top);
}

function getElementWidth(id): number {
  return $('#' + id).outerWidth();
}

function getColumnHeight(tableId: string): number {
  return $('#' + tableId).first().find('.db-column').first().outerHeight() + TABLE_BORDER;
}
