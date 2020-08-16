import {
  Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnInit, Type, ViewChild,
  ViewContainerRef
} from '@angular/core';
import {LeftFrameComponent} from '../left-frame/left-frame.component';
import {CenterFrameComponent} from '../center-frame/center-frame.component';
import {RightFrameComponent} from '../right-frame/right-frame.component';

@Component({
  selector: 'app-vtx',
  templateUrl: './vtx.component.html',
  styleUrls: ['./vtx.component.scss']
})
export class VtxComponent implements OnInit {

  private frames: Array<Frame>;
  @ViewChild('framePlaceholder', {read: ViewContainerRef})
  private container;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.frames = [
      new Frame(false, LeftFrameComponent),
      new Frame(true, CenterFrameComponent),
      new Frame(false, RightFrameComponent)
    ];
    this.checkFrames();
  }

  private checkFrames(): void { this.loadComponent(this.findFocusFrame().frame); }

  private findFocusFrame(): Frame {return this.frames.filter((value, index, array) => value.focus)[0]; }

  private loadComponent(component: Type<any>): void {
    this.container.clear();

    if (component == null) {
      console.error('Componentul este null. Este posibil sa nu existe!!!');
      return;
    }
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(component);
    this.container.createComponent(factory);
  }

  private doNavOptionClick(frame: Frame) {
    this.frames.forEach((value, index, array) => value.focus = false);
    frame.focus = true;
    this.checkFrames();
  }
}

class Frame {constructor(public focus: boolean, public frame: Type<any>) {} }
