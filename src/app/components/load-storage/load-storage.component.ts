import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FirestoreInterceptorService } from 'src/app/services/firestore/firestore-interceptor.service';
import { Diagram } from 'src/app/class/model/db/diagram/diagram';
import { take } from 'rxjs/internal/operators';
import { DiagramWrapper } from 'src/app/class/wrappers/diagram-wrapper';
import { DiagramBuilder } from 'src/app/class/model/db/diagram/builder/diagram-builder';
import { CommonService } from 'src/app/services/common.service';
import { AuthenticationService } from 'src/app/services/security/authentication.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-load-storage',
  templateUrl: './load-storage.component.html',
  styleUrls: ['./load-storage.component.scss']
})
export class LoadStorageComponent implements OnInit {

  @Output() private close: EventEmitter<void> = new EventEmitter();
  @Output() private select: EventEmitter<Diagram> = new EventEmitter();

  private myStorage: Array<DiagramWrapper>;
  private sharedWithMe: Array<DiagramWrapper>;

  constructor(private _firestoreServiceInterceptor: FirestoreInterceptorService,
    private _authenticationService: AuthenticationService,
    private _firestoreService: FirestoreService) { }

  ngOnInit() {

    this.setStorage();

    this._firestoreServiceInterceptor.getAllSharedWithCurrentAccountDiagrams()
      .pipe(take(1)).subscribe(value => {
        this.sharedWithMe = value.map(val => new DiagramWrapper(val));
        if (this.sharedWithMe && this.sharedWithMe.length) { this.sharedWithMe[0].active = true; }
      });
  }

  private setStorage() {
    this._firestoreServiceInterceptor.getAllCurrentAccountDiagrams()
      .pipe(take(1)).subscribe(value => {
        this.myStorage = value.map(val => new DiagramWrapper(val));
        if (this.myStorage && this.myStorage.length) { this.myStorage[0].active = true; }
      });
  }

  private onClose() { this.close.emit(); }

  private onDiagramSelect(value: Diagram) { this.select.emit(value); }

  private createDiagram() {
    const diagram = new DiagramBuilder(CommonService.createId())
      .withName('Untitled_' + this.myStorage.length)
      .withOwner(this._authenticationService.getAuthenticatedAccount().email)
      .build();

    from(this._firestoreService.createDiagram(diagram)).subscribe(_ => this.setStorage());
  }
}