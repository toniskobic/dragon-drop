import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { DynamicContentAreaDirective } from '../directives/dynamic-content-area.directive';
import { DynamicComponent } from '../models/dynamic-component.model';
import { AppState } from '../state/app.reducer';
import { DesignCanvasActions } from '../state/design-canvas/design-canvas.actions';

@Injectable({
  providedIn: 'root',
})
export class DesignCanvasService {
  private contentArea?: DynamicContentAreaDirective;

  private components: DynamicComponent[] = [];

  constructor(private store: Store<AppState>) {}

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
    // this.components.push(component);
    this.store.dispatch(DesignCanvasActions.addCurentPageComponent({ component: component }));
  }
}
