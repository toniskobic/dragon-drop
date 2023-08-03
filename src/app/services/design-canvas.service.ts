import { Injectable } from '@angular/core';

import { ResizableDraggableComponent } from '../components/resizable-draggable/resizable-draggable.component';
import { DynamicContentAreaDirective } from '../directives/dynamic-content-area.directive';
import { DynamicComponent } from '../models/dynamic-component.model';

@Injectable({
  providedIn: 'root',
})
export class DesignCanvasService {
  private contentArea?: DynamicContentAreaDirective;

  setDynamicContentArea(host: DynamicContentAreaDirective) {
    this.contentArea = host;
  }

  addElement(component: DynamicComponent): void {
    const componentRef = this.contentArea?.viewContainerRef.createComponent(ResizableDraggableComponent);
    if (componentRef) {
      componentRef.setInput('component', component);
    }
  }
}
