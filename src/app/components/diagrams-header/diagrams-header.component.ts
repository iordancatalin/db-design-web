import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { auditTime } from "rxjs/internal/operators";
import { Subject } from "rxjs";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";

@Component({
  selector: "app-diagrams-header",
  templateUrl: "./diagrams-header.component.html",
  styleUrls: ["./diagrams-header.component.scss"]
})
export class DiagramsHeaderComponent implements OnInit {
  @Output() private onGridClick: EventEmitter<Event> = new EventEmitter();
  @Output() private onListClick: EventEmitter<Event> = new EventEmitter();
  @Output() private onSearch: EventEmitter<string> = new EventEmitter();
  @Output() private onNewDiagram: EventEmitter<void> = new EventEmitter();
  @Input() private showNewDiagram = true;

  private searchControl: FormControl;
  private _subject$: Subject<string> = new Subject();

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.searchControl = this._formBuilder.control("");

    this._subject$.pipe(auditTime(200)).subscribe(value => this.onSearch.emit(value));
  }

  private gridClick(event: MouseEvent): void { this.onGridClick.emit(event); }

  private listClick(event: MouseEvent): void { this.onListClick.emit(event); }

  private keyup(event: KeyboardEvent) { this._subject$.next(this.searchControl.value); }

  private newDiagram(): void { this.onNewDiagram.emit();   }
}
