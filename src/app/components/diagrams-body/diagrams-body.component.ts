import { Component, OnInit, Input } from "@angular/core";
import { Diagram } from "src/app/class/model/db/diagram/diagram";
import { EventUtil } from "src/app/class/ui/event-util";
import { AbstractDiagramResult } from "src/app/class/resut/results";
import { AbstractDiagram } from "src/app/class/model-abstract/diagram/abstract-diagram";
import { FirestoreService } from "src/app/services/firestore/firestore.service";
import { from, interval } from "rxjs";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/internal/operators";
import { Subject } from "rxjs/index";

@Component({
  selector: "app-diagrams-body",
  templateUrl: "./diagrams-body.component.html",
  styleUrls: ["./diagrams-body.component.scss"]
})
export class DiagramsBodyComponent implements OnInit {
  @Input() private showListMode = false;
  @Input() private diagrams: Array<Diagram>;

  private toRenameDiagram: AbstractDiagram = null;
  private toShareDiagram: AbstractDiagram = null;
  private uid: string = null;

  private showTip = false;

  private _cancelNotifier$: Subject<boolean> = new Subject();

  constructor(private _firestoreService: FirestoreService,
    private _router: Router) { }

  ngOnInit() { }

  private rightClick(event: Event, diagram: Diagram) {
    this.diagrams.filter(value => !diagram.equals(value))
      .forEach(val => val.showStorageOptions = false);
    diagram.showStorageOptions = true;
    event.preventDefault();
    EventUtil.stopEvent(event);
  }

  private closeRenamePopup() { this.toRenameDiagram = null; }

  private closeSharePopup() { this.toShareDiagram = null; }

  private closeStorageOptions() {
    if (this.diagrams) { this.diagrams.forEach(val => val.showStorageOptions = false); }
  }

  private closeGenerateLink() { this.uid = null; }

  private diagramRename(value: AbstractDiagramResult) { this.toRenameDiagram = value.diagram; }

  private diagramShare(value: AbstractDiagramResult) { this.toShareDiagram = value.diagram; }

  private openDiagram(value: AbstractDiagramResult) {
    this._router.navigate(['/master/workshop'], { queryParams: { uid: value.diagram.id } });
  }

  private diagramGenerateLink(value: AbstractDiagramResult) { this.uid = value.diagram.id; }

  private diagramDelete(value: Diagram) {
    from(this._firestoreService.deleteDiagram(value)).subscribe(_ => {
      const position = this.diagrams.findIndex(diagram => diagram.equals(value));

      if (position !== -1) { this.diagrams.splice(position, 1); }
    });
  }

  private shareDiagram(diagram: AbstractDiagram) { this.toShareDiagram = diagram; }

  private copyGenerateLink(): void {
    this.showTip = true;
    this.closeGenerateLink();
    interval(5000).pipe(takeUntil(this._cancelNotifier$)).subscribe(_ => this.showTip = false);
  }

  private closeTip(): void {
    this.showTip = false;
    this._cancelNotifier$.next();
  }
}