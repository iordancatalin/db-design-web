import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { DiagramBuilder } from 'src/app/class/model/db/diagram/builder/diagram-builder';
import { CommonService } from 'src/app/services/common.service';
import { AuthenticationService } from 'src/app/services/security/authentication.service';
import { Diagram } from 'src/app/class/model/db/diagram/diagram';

@Component({
  selector: 'app-create-diagram-popup',
  templateUrl: './create-diagram-popup.component.html',
  styleUrls: ['./create-diagram-popup.component.scss']
})
export class CreateDiagramPopupComponent implements OnInit {

  @Output() private close: EventEmitter<void> = new EventEmitter();
  @Output() private newDiagram: EventEmitter<Diagram> = new EventEmitter();

  private formControl: FormControl;

  constructor(private _fb: FormBuilder,
    private _authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.formControl = this._fb.control('', [Validators.required]);
  }

  private submit() {
    this.newDiagram.emit(new DiagramBuilder(CommonService.createId())
      .withName(this.formControl.value)
      .withOwner(this._authenticationService.getAuthenticatedAccount().email)
      .build());
  }

  private onClose(): void { this.close.emit() }
}
