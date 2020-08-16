import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DiagramsStorage } from '../../class/holder/diagrams-storage';
import { HtmlDiagram } from '../../class/model/html/diagram/html-diagram';
import { DiagramResult, HolderResult } from '../../class/resut/results';
import { AbstractDiagram } from 'src/app/class/model-abstract/diagram/abstract-diagram';

@Component({
  selector: 'app-dheader',
  templateUrl: './dheader.component.html',
  styleUrls: ['./dheader.component.scss']
})
export class DheaderComponent implements OnInit {
  @Input() primaryStorage: DiagramsStorage;
  @Input() additionalStorage: DiagramsStorage;
  @Output() private onAdditionalDiagramClose: EventEmitter<DiagramResult> = new EventEmitter();
  @Output() private onPrimaryDiagramClose: EventEmitter<DiagramResult> = new EventEmitter();
  @Output() private onToolsClick: EventEmitter<any> = new EventEmitter();
  @Output() private onEmptyHolder: EventEmitter<HolderResult> = new EventEmitter();
  @Output() private onNewDiagramAction: EventEmitter<DiagramResult> = new EventEmitter();

  private loadForPrimaryStorage = false;
  private loadForAdditionalStorage = false;

  constructor() {
  }

  ngOnInit() {
  }

  public doEnableOptions(holder: DiagramsStorage, diagram: HtmlDiagram): void {
    diagram.enableOptions = !diagram.enableOptions;
    holder.diagrams.filter((value, index, array) => !diagram.equals(value))
      .forEach((value, index, array) => value.enableOptions = false);
  }

  public toolsClick(event: Event): void {
    this.onToolsClick.emit(event);
  }

  public openDiagram(holder: DiagramsStorage, diagram: HtmlDiagram): void {
    holder.setOpenDiagram(diagram);
  }

  public closeFromPrimaryDiagrams(diagram: HtmlDiagram, event: Event): void {
    this.primaryStorage.closeDiagram(diagram);
    this.onPrimaryDiagramClose.emit(new DiagramResult(diagram, event));
  }

  public closeFromAdditionalDiagrams(diagram: HtmlDiagram, event: Event): void {
    this.additionalStorage.closeDiagram(diagram);
    this.onAdditionalDiagramClose.emit(new DiagramResult(diagram, event));
  }

  drop(event: CdkDragDrop<any>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      if (event.container.id === 'primary-list') {
        this.headerMoved(event, this.additionalStorage);
      } else {
        this.headerMoved(event, this.primaryStorage);
      }
    }
  }

  private headerMoved(event: CdkDragDrop<any>, holder: DiagramsStorage): void {
    const movedDiagram = (event.container.data as Array<HtmlDiagram>)[event.currentIndex];

    movedDiagram.open = false;
    if (event.previousContainer.data.length > 0) {
      movedDiagram.open = false;
      holder.setOpenDiagram((event.previousContainer.data as Array<HtmlDiagram>)[0]);
    }

    if (event.previousContainer.data.length === 0) {
      this.onEmptyHolder.emit(new HolderResult(holder, event));
    }
  }

  private showLoadForPrimaryStorage() { this.loadForPrimaryStorage = true; }

  private showLoadForAdditionalStorage() { this.loadForAdditionalStorage = true; }

  private closeLoadForPrimarySotrage() { this.loadForPrimaryStorage = false; }

  private closeLoadForAdditionalStorage() { this.loadForAdditionalStorage = false; }

  private doLoadForPrimaryStorage(value: AbstractDiagram) {
    this.primaryStorage.constructDiagramById(value.id);
    this.closeLoadForPrimarySotrage();
  }

  private doLoadForAdditionalStorage(value: AbstractDiagram) {
    this.additionalStorage.constructDiagramById(value.id);
    this.closeLoadForAdditionalStorage();
  }
}
