import { Component, OnInit, OnDestroy } from '@angular/core';
import { SaveIndicatorService } from 'src/app/services/save-indicator.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-save-indicator',
  templateUrl: './save-indicator.component.html',
  styleUrls: ['./save-indicator.component.scss']
})
export class SaveIndicatorComponent implements OnInit, OnDestroy {
  show = false;
  private _subscription: Subscription;

  constructor(private _saveIndicatorService: SaveIndicatorService) {}

  ngOnInit() {
    this._subscription = this._saveIndicatorService.subject.subscribe(
      value => (this.show = value)
    );
  }

  ngOnDestroy() {
    if (this._subscription && !this._subscription.closed) {
      this._subscription.unsubscribe();
    }
  }
}
