import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { WindowService } from 'src/app/services/ui/window.service';

@Component({
  selector: 'app-generate-link',
  templateUrl: './generate-link.component.html',
  styleUrls: ['./generate-link.component.scss']
})
export class GenerateLinkComponent implements OnInit {

  @Output() private close: EventEmitter<void> = new EventEmitter;
  @Output() private copy: EventEmitter<void> = new EventEmitter;
  @Input() private uid: string;

  @ViewChild('generatedLink') private input: ElementRef;

  private link: string;
  constructor(private _windowService: WindowService) { }

  ngOnInit() { this.link = `${this._windowService.nativeWindow.location.origin}/master/workshop?uid=${this.uid}` }

  private onClose(): void { this.close.emit(); }

  private onCopy() {
    this.input.nativeElement.select();
    document.execCommand('copy');
    this.copy.emit();
  }
}
