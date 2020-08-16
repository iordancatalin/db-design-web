import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DiagramWrapper } from 'src/app/class/wrappers/diagram-wrapper';
import { Diagram } from 'src/app/class/model/db/diagram/diagram';
import { AbstractDiagram } from 'src/app/class/model-abstract/diagram/abstract-diagram';

@Component({
  selector: 'app-load-storage-diagrams',
  templateUrl: './load-storage-diagrams.component.html',
  styleUrls: ['./load-storage-diagrams.component.scss']
})
export class LoadStorageDiagramsComponent implements OnInit {

  @Input() private wrappers: Array<DiagramWrapper>;
  @Output() private selected: EventEmitter<AbstractDiagram> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  private markWrapper(wrapper: DiagramWrapper) {
    this.wrappers.filter(wrap => !wrap.diagram.equals(wrapper.diagram))
      .forEach(wrap => wrap.active = false);
    wrapper.active = true;
  }

  private selectWrapper(wrapper: DiagramWrapper) { this.selected.emit(wrapper.diagram); }
}
