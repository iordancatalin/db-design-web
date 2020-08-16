import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Diagram } from 'src/app/class/model/db/diagram/diagram';
import { FirestoreInterceptorService } from 'src/app/services/firestore/firestore-interceptor.service';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-rename-diagram',
  templateUrl: './rename-diagram.component.html',
  styleUrls: ['./rename-diagram.component.scss']
})
export class RenameDiagramComponent implements OnInit {
  @Input() private diagram: Diagram;

  @Output() private close: EventEmitter<void> = new EventEmitter();

  formControl: FormControl;

  constructor(
    private _firestoreInterceptorService: FirestoreInterceptorService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.formControl = this._formBuilder.control(
      this.diagram.name,
      Validators.required
    );
  }

  private onClose() {
    this.close.emit();
  }

  private onSave() {
    this._firestoreInterceptorService
      .updateDiagramName(this.diagram.id, this.formControl.value)
      .subscribe(_ => {
        this.diagram.nameWithoutEmit = this.formControl.value;
        this.close.emit();
      });
  }
}
