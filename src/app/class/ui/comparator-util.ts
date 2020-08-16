import {HtmlCheckConstraint} from '../model/html/check-constraint/html-check-constraint';
import {HtmlColumn} from '../model/html/column/html-column';
import {HtmlDiagram} from '../model/html/diagram/html-diagram';
import {HtmlTable} from '../model/html/table/html-table';
import {HtmlUniqueConstraint} from '../model/html/unique-constraint/html-unique-constraint';

export function compareHtmlColumns(column1: HtmlColumn, column2: HtmlColumn): boolean {
  if (column1 !== column2 && (column1 || column2)) {
    return true;
  }

  if (column1.id !== column2.id) {
    return true;
  }

  if (column1.name !== column2.name) {
    return true;
  }

  if (column1.type.dataType !== column2.type.dataType) {
    return true;
  }

  if (column1.defaultValue !== column2.defaultValue) {
    return true;
  }

  if (column1.primaryKey !== column2.primaryKey) {
    return true;
  }

  if (column1.foreignKey !== column2.foreignKey) {
    return true;
  }

  if (column1.nullable !== column2.nullable) {
    return true;
  }

  if (column1.autoincrement !== column2.autoincrement) {
    return true;
  }

  return column1.unique !== column2.unique;
}

export function compareHtmlTables(table1: HtmlTable, table2: HtmlTable): boolean {
  if (table1 !== table2 && (table1 || table2)) {
    return true;
  }

  if (table1.name !== table2.name) {
    return true;
  }

  return table1.comment !== table2.comment;
}

export function compareHtmlDiagrams(diagram1: HtmlDiagram, diagram2: HtmlDiagram): boolean {
  if (diagram1 !== diagram2 && (diagram1 || diagram2)) {
    return true;
  }

  return diagram1.name !== diagram2.name;
}

export function compareHtmlCheckConstraints(constraint1: HtmlCheckConstraint, constraint2: HtmlCheckConstraint): boolean {
  if (constraint1 !== constraint2 && (constraint1 || constraint2)) {
    return true;
  }

  if (constraint1.name !== constraint2.name) {
    return true;
  }

  return constraint1.expression !== constraint2.expression;
}

export function compareHtmlUniqueConstraint(constraint1: HtmlUniqueConstraint, constraint2: HtmlUniqueConstraint): boolean {
  if (constraint1 !== constraint2 && (constraint1 || constraint2)) {
    return true;
  }

  if (constraint1.name !== constraint2.name) {
    return true;
  }

  return constraint1.textColumns !== constraint2.textColumns;
}
