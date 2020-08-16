import { AbstractDiagram } from "../model-abstract/diagram/abstract-diagram";

export class DiagramWrapper {
    constructor(public diagram: AbstractDiagram, public active: boolean = false) { }
}