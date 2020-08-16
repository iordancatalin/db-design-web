import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DiagramTool} from '../../class/data/data-util';
import {ToolResult} from '../../class/resut/results';

@Component({
  selector: 'app-diagram-tools',
  templateUrl: './diagram-tools.component.html',
  styleUrls: ['./diagram-tools.component.scss']
})
export class DiagramToolsComponent implements OnInit {

  enableTools = true;
  private diagramTools: Array<DiagramTool>;
  @Output() private onFullScreenClick: EventEmitter<ToolResult> = new EventEmitter<ToolResult>();
  @Output() private onLocateClick: EventEmitter<ToolResult> = new EventEmitter<ToolResult>();
  @Output() private onCursorClick: EventEmitter<ToolResult> = new EventEmitter<ToolResult>();
  @Output() private onTableClick: EventEmitter<ToolResult> = new EventEmitter<ToolResult>();
  @Output() private onSplitVerticalClick: EventEmitter<ToolResult> = new EventEmitter<ToolResult>();
  @Output() private onSplitHorizontalClick: EventEmitter<ToolResult> = new EventEmitter<ToolResult>();
  @Output() private onSqlClick: EventEmitter<ToolResult> = new EventEmitter<ToolResult>();

  // Actions
  private fullScreenClick = (tool: DiagramTool, event: Event) => {
    this.onFullScreenClick.emit(new ToolResult(tool, event));
  }
  private locateClick = (tool: DiagramTool, event: Event) => {
    this.onLocateClick.emit(new ToolResult(tool, event));
  }
  private cursorClick = (tool: DiagramTool, event: Event) => {
    this.selectCursor();
    this.onCursorClick.emit(new ToolResult(tool, event));
  }
  private tableClick = (tool: DiagramTool, event: Event) => {
    this.onTableClick.emit(new ToolResult(tool, event));
  }
  private splitVerticalClick = (tool: DiagramTool, event: Event) => {
    this.onSplitVerticalClick.emit(new ToolResult(tool, event));
  }
  private splitHorizontalClick = (tool: DiagramTool, event: Event) => {
    this.onSplitHorizontalClick.emit(new ToolResult(tool, event));
  }
  private sqlClick = (tool: DiagramTool, event: Event) => {
    this.onSqlClick.emit(new ToolResult(tool, event));
  }

  constructor() {
  }

  public toolClick(tool: DiagramTool, event: Event): void {
    this.diagramTools.forEach((value, index, array) => value.active = false);
    tool.active = true;
    tool.doClick(tool, event);
  }

  public selectCursor(): void {
    this.diagramTools.map(value => {
      value.active = false;
      return value;
    }).filter(value => value.defaultAction === true)[0].active = true;
  }

  public toggleTools(): void {
    this.enableTools = !this.enableTools;
  }

  ngOnInit() {
    this.diagramTools = [];
    this.diagramTools.push(new DiagramTool('full-screen.svg', false, false, 'Full screen', this.fullScreenClick, null));
    this.diagramTools.push(new DiagramTool('target.svg', false, false, 'Center', this.locateClick, null));
    this.diagramTools.push(new DiagramTool('cursor.svg', true, true, 'Cursor', this.cursorClick, 'cursor-active.svg'));
    this.diagramTools.push(new DiagramTool('table.svg', false, false, 'Table', this.tableClick, 'table-active.svg'));
    this.diagramTools.push(new DiagramTool('vertical-split.svg', false, false, 'Vertical split', this.splitVerticalClick, null));
    this.diagramTools.push(new DiagramTool('horizontal-split.svg', false, false, 'Horizontal split', this.splitHorizontalClick, null));
  }
}
