import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ComponentRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ResizableDirective, ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { MIN_SECTION_DIMENSIONS_PX } from 'src/app/constants/constants';
import { DynamicContentAreaDirective } from 'src/app/directives/dynamic-content-area.directive';
import { DynamicComponent, DynamicElement } from 'src/app/models/dynamic-component.model';

@Component({
  selector: 'drd-resizable-draggable',
  standalone: true,
  imports: [CommonModule, ResizableModule, DynamicContentAreaDirective, DragDropModule, ScrollingModule],
  templateUrl: './resizable-draggable.component.html',
  styleUrls: ['./resizable-draggable.component.scss'],
})
export class ResizableDraggableComponent implements AfterViewInit, OnChanges {
  @ViewChild(DynamicContentAreaDirective, { static: true }) dynamicContentArea?: DynamicContentAreaDirective;
  @ViewChild('resizableElement', { read: ResizableDirective }) resizable?: ResizableDirective;

  @Input() component?: DynamicComponent;

  componentRef?: ComponentRef<DynamicElement>;
  style = {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['component'].currentValue) {
      const component = changes['component'].currentValue as DynamicComponent;
      this.renderComponent(component);
    }
  }

  ngAfterViewInit() {
    const resizable$ = this.resizable?.resizing;
    resizable$?.subscribe(event => {
      if (event.rectangle.height) {
        const style = {
          height: `${event.rectangle.height}px`,
        };
        this.componentRef?.setInput('style', style);
      }
    });
  }

  validate = (event: ResizeEvent): boolean => {
    if (
      event.rectangle.width &&
      event.rectangle.height &&
      (event.rectangle.width < MIN_SECTION_DIMENSIONS_PX || event.rectangle.height < MIN_SECTION_DIMENSIONS_PX)
    ) {
      return false;
    }
    return true;
  };

  private renderComponent(component: DynamicComponent) {
    this.dynamicContentArea?.viewContainerRef.clear();
    this.componentRef = this.dynamicContentArea?.viewContainerRef.createComponent(component.component);

    if (component.inputs) {
      for (const [key, value] of Object.entries(component.inputs)) {
        this.componentRef?.setInput(key, value);
      }
    }
  }
}
