import { getDiagramDefaultDimension, getDiagramDefaultPosition, getSuperPosition } from '../../../../constants/constants';
import { Dimension } from '../../../../graphics/dimension';
import { AbstractDiagramBuilder } from '../../../../model-abstract/diagram/builder/abstract-diagram-builder';
import { ValidationUtil } from '../../../../ui/validation-util';
import { HtmlForeignKey } from '../../foreign-key/html-foreign-key';
import { HtmlDiagram } from '../html-diagram';
import { HtmlTable } from '../../table/html-table';
import { BasicAccount } from '../../../basic/account/basic-account';

export class HtmlDiagramBuilder extends AbstractDiagramBuilder {
  private _htmlTables: Array<HtmlTable>;
  private _open: boolean;
  private _foreignKeys: Array<HtmlForeignKey>;
  private _dimension: Dimension;

  public constructor(id: string) {
    super(id);
  }

  public withHtmlTables(htmlTables: Array<HtmlTable>): HtmlDiagramBuilder {
    this._htmlTables = htmlTables;
    return this;
  }

  public withIsOpen(isOpen: boolean): HtmlDiagramBuilder {
    this._open = isOpen;
    return this;
  }

  public withForeignKeys(constraints: Array<HtmlForeignKey>): HtmlDiagramBuilder {
    this._foreignKeys = constraints;
    return this;
  }

  public withDimension(dimension: Dimension): HtmlDiagramBuilder {
    this._dimension = dimension;
    return this;
  }

  public build(): HtmlDiagram {
    if (!this._name) { throw new Error('Diagram name cannot be null or undefined'); }

    if (!this._open) { this._open = false; }

    if (!this._dimension) { this._dimension = getDiagramDefaultDimension(); }

    if (!this._position) { this._position = getSuperPosition(); }

    if (!this._zoom) { this._zoom = 1; }

    const diagram: HtmlDiagram = new HtmlDiagram(this._id);

    diagram.nameWithoutEmit = this._name;
    diagram.htmlTables = this._htmlTables;
    diagram.dimension = this._dimension;
    diagram.open = this._open;
    diagram.positionWithoutEmit = this._position;
    diagram.htmlForeignKeys = this._foreignKeys;
    diagram.creationDate = this._creationDate;
    diagram.owner = this._owner;
    diagram.zoomWhitoutEmit = this._zoom;
    diagram.share = this._shareList;

    return diagram;
  }

}
