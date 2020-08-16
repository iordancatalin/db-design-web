import { Component, OnInit } from '@angular/core';
import { FirestoreInterceptorService } from 'src/app/services/firestore/firestore-interceptor.service';
import { Diagram } from 'src/app/class/model/db/diagram/diagram';
import { NavService } from 'src/app/services/nav.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {
  _showListView = false;
  _diagrams: Array<Diagram>;
  _showCreatePopup = false;
  private _initDiagrams: Array<Diagram>;

  constructor(
    private _firestoreInterceptorService: FirestoreInterceptorService,
    private _firestoreService: FirestoreService,
    private _navService: NavService
  ) {}

  ngOnInit() {
    this.setDiagrams();
    this._navService.emit('/master/storage');
  }

  private setDiagrams(): void {
    this._firestoreInterceptorService
      .getAllCurrentAccountDiagrams()
      .subscribe(val => (this._diagrams = this._initDiagrams = val));
  }

  private gridClick(): void {
    this._showListView = false;
  }

  private listClick(): void {
    this._showListView = true;
  }

  private search(value: string): void {
    this._diagrams = this._initDiagrams.filter(
      str => str.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  private onClose() {
    this._showCreatePopup = false;
  }

  private newDiagram(): void {
    this._showCreatePopup = true;
  }

  private onNewDiagram(diagram: Diagram) {
    this._firestoreService.createDiagram(diagram).then(val => {
      this.setDiagrams();
      this._showCreatePopup = false;
    });
  }
}
