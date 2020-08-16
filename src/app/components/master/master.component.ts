import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
  showMenu = true;

  // IMPORTANT
  constructor(private commonService: CommonService) {}

  ngOnInit() {}

  private onNavigatorToggle(value: boolean): void {
    this.showMenu = value;
  }
}
