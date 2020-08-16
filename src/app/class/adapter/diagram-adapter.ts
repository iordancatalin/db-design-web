import { DiagramPayload } from "../payload/diagram-payload";
import { HtmlDiagramBuilder } from "../model/html/diagram/builder/html-diagram-builder";
import { HtmlDiagram } from "../model/html/diagram/html-diagram";
import { Diagram } from "../model/db/diagram/diagram";

export function toHtmlDiagram(payload: DiagramPayload): HtmlDiagram {
    return new HtmlDiagramBuilder(payload.uid)
        .withName(payload.name)
        .withIsOpen(payload.open)
        .build();
}

export function toDiagramPayload(diagram: HtmlDiagram): DiagramPayload {
    return new DiagramPayload(diagram.id, diagram.name, diagram.open);
}

export function toHtmlDiagramFromDiagram(diagram: Diagram): HtmlDiagram {
    return new HtmlDiagramBuilder(diagram.id)
        .withName(diagram.name)
        .withOwner(diagram.owner)
        .build();
}