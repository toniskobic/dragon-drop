import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[drdDynamicContentArea]',
  standalone: true,
})
export class DynamicContentAreaDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
