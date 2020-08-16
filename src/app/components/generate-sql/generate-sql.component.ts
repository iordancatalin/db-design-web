import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Diagram } from 'src/app/class/model/db/diagram/diagram';
import { Table } from 'src/app/class/model/db/table/table';
import { GenerateService } from 'src/app/services/generate.service';
import { tap, take } from 'rxjs/internal/operators';
import { FirestoreInterceptorService } from 'src/app/services/firestore/firestore-interceptor.service';
import { forkJoin, Observable } from 'rxjs';
import { CheckConstraint } from 'src/app/class/model/db/check-constraint/check-constraint';
import { UniqueConstraint } from 'src/app/class/model/db/unique-constraint/unique-constraint';

@Component({
  selector: 'app-generate-sql',
  templateUrl: './generate-sql.component.html',
  styleUrls: ['./generate-sql.component.scss']
})
export class GenerateSqlComponent implements OnInit {
  @Input() private diagram: Diagram;
  @Output() private onCancel: EventEmitter<void> = new EventEmitter();

  @ViewChild('main') private main: ElementRef;
  @ViewChild('scriptRef') private scriptRef: ElementRef;

  private script: String;
  private copyActive = false;

  private showLoader = false;

  constructor(
    private _generateService: GenerateService,
    private _firestoreInterceptorService: FirestoreInterceptorService
  ) {}

  ngOnInit() {
    this.showLoader = true;

    const arrayPrimary = this.diagram.tables.map(table =>
      this._firestoreInterceptorService.getCheckConstraints(
        this.diagram.id,
        table.id
      )
    );

    const arraySecondary = this.diagram.tables.map(table =>
      this._firestoreInterceptorService.getUniqueConstraints(
        this.diagram.id,
        table.id
      )
    );

    forkJoin(
      forkJoin(arrayPrimary).pipe(
        tap(val =>
          val.forEach(
            (value, index) =>
              (this.diagram.tables[index].checkConstraints = value)
          )
        )
      ),
      forkJoin(arraySecondary).pipe(
        tap(val =>
          val.forEach(
            (value, index) =>
              (this.diagram.tables[index].uniqueConstraints = value)
          )
        )
      )
    ).subscribe(_ => {
      this._generateService.doGenerate(this.diagram).subscribe(value => {
        this.main.nativeElement.innerHTML = value.htmlScript;
        this.script = value.textScript;
        this.showLoader = false;
      });
    });
  }

  private cancel(): void {
    this.onCancel.emit();
  }

  private copyAction() {
    this.scriptRef.nativeElement.select();
    document.execCommand('copy');
    this.copyActive = true;
  }

  private closeCopyActive() {
    this.copyActive = false;
  }
}
