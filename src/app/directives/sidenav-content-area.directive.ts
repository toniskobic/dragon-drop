import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[drdSidenavContentArea]',
  standalone: true,
})
export class SidenavContentAreaDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
