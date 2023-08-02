import { Injectable, Type } from '@angular/core';

import { DynamicContentAreaDirective } from '../directives/dynamic-content-area.directive';

@Injectable({
  providedIn: 'root',
})
export class DesignCanvasService {
  private contentArea?: DynamicContentAreaDirective;

  setDynamicContentArea(host: DynamicContentAreaDirective) {
    this.contentArea = host;
  }

  addElement(component: Type<unknown>, inputs?: { [key: string]: string }): void {
    const componentRef = this.contentArea?.viewContainerRef.createComponent(component);
    if (inputs) {
      for (const [key, value] of Object.entries(inputs)) {
        componentRef?.setInput(key, value);
      }
    }
  }
}
