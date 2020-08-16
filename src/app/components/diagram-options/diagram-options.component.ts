import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { DiagramOptions } from "../../class/data/data-util";
import { ClipboardService } from "../../services/clipboard.service";
import { HtmlDiagram } from "src/app/class/model/html/diagram/html-diagram";

@Component({
  selector: 'app-diagram-options',
  templateUrl: './diagram-options.component.html',
  styleUrls: ['./diagram-options.component.scss']
})
export class DiagramOptionsComponent implements OnInit {

  @Input() private options: DiagramOptions;
  @Input() private disableGenerateSQL = false;
  @Output() private onRename: EventEmitter<any> = new EventEmitter();
  @Output() private onClearAll: EventEmitter<any> = new EventEmitter();
  @Output() private onDuplicate: EventEmitter<any> = new EventEmitter();
  @Output() private onPaste: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() private onShare: EventEmitter<any> = new EventEmitter();
  @Output() private onGenerateLink: EventEmitter<any> = new EventEmitter();
  @Output() private onGenerateSQL: EventEmitter<any> = new EventEmitter();
  
  @ViewChild('optionsContainerElementRef') private optionsContainerElementRef: ElementRef;

  constructor(private clipboardService: ClipboardService) { }

  ngOnInit() { }

  private rename(): void { this.onRename.emit(); }

  private duplicate(event: MouseEvent): void { this.onDuplicate.emit(); }

  private clearAll(event: MouseEvent): void { this.onClearAll.emit(event); }

  private paste(event: MouseEvent): void { this.onPaste.emit(event); }

  private share(): void { this.onShare.emit(); }

  public getOptionsContainerElementRef(): ElementRef<any> { return this.optionsContainerElementRef; }

  public generateLink(): void { this.onGenerateLink.emit(); }

  private generateSQL(): void { this.onGenerateSQL.emit(); }
}