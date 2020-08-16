import { Component, OnInit } from '@angular/core';
import { NavService } from 'src/app/services/nav.service';
import { FirestoreInterceptorService } from 'src/app/services/firestore/firestore-interceptor.service';
import { Diagram } from 'src/app/class/model/db/diagram/diagram';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.scss']
})
export class SharedComponent implements OnInit {
  _showListView = false;
  private _initDiagrams: Array<Diagram>;
  _diagrams: Array<Diagram>;

  constructor(
    private navService: NavService,
    private _firestoreInterceptorService: FirestoreInterceptorService
  ) {}

  ngOnInit() {
    this._firestoreInterceptorService
      .getAllSharedWithCurrentAccountDiagrams()
      .subscribe(val => (this._diagrams = this._initDiagrams = val));

    this.navService.emit('/master/shared');
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
}
