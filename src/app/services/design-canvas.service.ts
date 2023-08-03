import { Injectable } from '@angular/core';

import { DynamicContentAreaDirective } from '../directives/dynamic-content-area.directive';
import { DynamicComponent } from '../models/dynamic-component.model';

@Injectable({
  providedIn: 'root',
})
export class DesignCanvasService {
  private contentArea?: DynamicContentAreaDirective;

  private components: DynamicComponent[] = [];

  setDynamicContentArea(host: DynamicContentAreaDirective) {
    this.contentArea = host;
  }

  setComponents(components: DynamicComponent[]) {
    this.components = components;
  }

  addElement(component: DynamicComponent): void {
    // const componentRef = this.contentArea?.viewContainerRef.createComponent(ResizableDraggableComponent);
    // if (componentRef) {
    //   componentRef.setInput('component', component);
    // }
    this.components.push(component);
  }
}
