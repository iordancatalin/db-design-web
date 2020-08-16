import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy
} from '@angular/core';
import { HtmlDiagram } from '../../class/model/html/diagram/html-diagram';
import { HtmlDiagramBuilder } from '../../class/model/html/diagram/builder/html-diagram-builder';
import { CommonService } from '../../services/common.service';
import { FirestoreInterceptorService } from '../../services/firestore/firestore-interceptor.service';
import { AuthenticationService } from 'src/app/services/security/authentication.service';
import { Diagram } from 'src/app/class/model/db/diagram/diagram';
import { toHtmlDiagramFromDiagram } from 'src/app/class/adapter/diagram-adapter';

@Component({
  selector: 'app-pick-diagram',
  templateUrl: './pick-diagram.component.html',
  styleUrls: ['./pick-diagram.component.scss']
})
export class PickDiagramComponent implements OnInit {
  @Input() pickDiagrams: Array<HtmlDiagram>;
  @Input() private isVertical: boolean;
  @Input() private width: number;
  @Output() private onPick: EventEmitter<HtmlDiagram> = new EventEmitter();

  showPopup = false;

  constructor(
    private firestoreInterceptorService: FirestoreInterceptorService,
    private _authenticationService: AuthenticationService
  ) {}

  ngOnInit() {}

  private pick(diagram: HtmlDiagram): void {
    this.onPick.emit(diagram);
  }

  private diagramPicked(diagram: HtmlDiagram): void {
    this.pick(diagram);
  }

  private createDiagram(): void {
    const diagram: HtmlDiagram = new HtmlDiagramBuilder(
      CommonService.createId()
    )
      .withName('Untitled')
      .withOwner(this._authenticationService.getAuthenticatedAccount().email)
      .withIsOpen(true)
      .build();

    this.firestoreInterceptorService
      .updateOrCreateDiagram(diagram)
      .subscribe(_ => this.pick(diagram));
  }

  private loadFromStorage(): void {
    this.showPopup = true;
  }

  private closePopup(): void {
    this.showPopup = false;
  }

  private selectedDiagram(diagram: Diagram): void {
    this.pick(toHtmlDiagramFromDiagram(diagram));
    this.closePopup();
  }
}
