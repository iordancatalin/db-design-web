import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {HtmlColumn} from '../class/model/html/column/html-column';
import {ValidationUtil} from '../class/ui/validation-util';

@Directive({
  selector: '[appPk]'
})
export class PkDirective {

  @Input()
  private htmlColumn: HtmlColumn;

  constructor(private el: ElementRef) {
  }

  @HostListener('change', ['$event']) onChecked(event) {
    if (!ValidationUtil.isNullOrUndefined(this.htmlColumn) &&
      this.htmlColumn.primaryKey) {
      this.htmlColumn.nullable = false;
    }
  }
}
