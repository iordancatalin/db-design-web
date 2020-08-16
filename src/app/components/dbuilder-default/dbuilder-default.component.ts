import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HtmlDiagramBuilder } from '../../class/model/html/diagram/builder/html-diagram-builder';
import { HtmlDiagram } from '../../class/model/html/diagram/html-diagram';
import { DiagramResult } from '../../class/resut/results';
import { CommonService } from '../../services/common.service';
import { FirestoreInterceptorService } from '../../services/firestore/firestore-interceptor.service';
import { Diagram } from 'src/app/class/model/db/diagram/diagram';
import { AbstractDiagram } from 'src/app/class/model-abstract/diagram/abstract-diagram';

@Component({
  selector: 'app-dbuilder-default',
  templateUrl: './dbuilder-default.component.html',
  styleUrls: ['./dbuilder-default.component.scss']
})
export class DbuilderDefaultComponent implements OnInit {
  @Output() private onSelectDiagram: EventEmitter<AbstractDiagram> = new EventEmitter();

  private showLoadFromStorage = false;

  constructor(private firestoreInterceptorService: FirestoreInterceptorService) {
  }

  ngOnInit() {
  }

  private createDiagram(event: MouseEvent): void {
    const diagram: HtmlDiagram = new HtmlDiagramBuilder(CommonService.createId())
      .withName('Simple Diagram')
      .withIsOpen(false)
      .build();

    this.firestoreInterceptorService.updateOrCreateDiagram(diagram)
      .subscribe(_ => this.onSelectDiagram.emit(diagram))
  }

  private showLoadStorage() { this.showLoadFromStorage = true; }

  private closeLoadFromStorage() { this.showLoadFromStorage = false; }

  private diagramLoaded(value: Diagram) {
    this.onSelectDiagram.emit(value);
    this.showLoadFromStorage = false;
  }
}
