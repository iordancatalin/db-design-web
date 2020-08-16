import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { AbstractDiagram } from 'src/app/class/model-abstract/diagram/abstract-diagram';
import { AbstractDiagramResult } from 'src/app/class/resut/results';
import { Diagram } from 'src/app/class/model/db/diagram/diagram';

@Component({
  selector: 'app-storage-options',
  templateUrl: './storage-options.component.html',
  styleUrls: ['./storage-options.component.scss', "../diagram-options/diagram-options.component.scss"]
})
export class StorageOptionsComponent implements OnInit {

  @Input() private diagram: AbstractDiagram;

  @Output() private rename: EventEmitter<AbstractDiagramResult> = new EventEmitter();
  @Output() private open: EventEmitter<AbstractDiagramResult> = new EventEmitter();
  @Output() private share: EventEmitter<AbstractDiagramResult> = new EventEmitter();
  @Output() private generateLink: EventEmitter<AbstractDiagramResult> = new EventEmitter();
  @Output() private delete: EventEmitter<Diagram> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  private onOpen(event: Event): void { this.open.emit(new AbstractDiagramResult(this.diagram)); }

  private onRename(event: Event) { this.rename.emit(new AbstractDiagramResult(this.diagram)); }

  private onShare(event: Event) { this.share.emit(new AbstractDiagramResult(this.diagram)); }

  private onGenerateLink(event: Event) { this.generateLink.emit(new AbstractDiagramResult(this.diagram)); }

  private onDelete(event: Event) { this.delete.emit(this.diagram as Diagram); }
}
