import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ComponentRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { ResizableDirective, ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { Subscription } from 'rxjs';
import { MIN_SECTION_DIMENSIONS_PX } from 'src/app/constants/constants';
import { DragCursorDirective } from 'src/app/directives/drag-cursor.directive';
import { DynamicContentAreaDirective } from 'src/app/directives/dynamic-content-area.directive';
import { DynamicComponent, DynamicComponentType } from 'src/app/models/dynamic-component.model';
import { UtilsService } from 'src/app/services/utils.service';
import { AppState } from 'src/app/state/app.reducer';
import { DesignCanvasActions } from 'src/app/state/design-canvas/design-canvas.actions';

@Component({
  selector: 'drd-resizable-draggable',
  standalone: true,
  imports: [
    CommonModule,
    ResizableModule,
    DynamicContentAreaDirective,
    DragDropModule,
    ScrollingModule,
    DragCursorDirective,
    MatIconModule,
  ],
  templateUrl: './resizable-draggable.component.html',
  styleUrls: ['./resizable-draggable.component.scss'],
})
export class ResizableDraggableComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild(DynamicContentAreaDirective, { static: true }) dynamicContentArea?: DynamicContentAreaDirective;
  @ViewChild('resizableElement', { read: ResizableDirective }) resizable!: ResizableDirective;

  @Input() component?: DynamicComponent;

  componentRef?: ComponentRef<DynamicComponentType>;
  style = {};

  subscriptions: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    private utilsService: UtilsService
  ) {
    this.utilsService.initSvgIcons(['drag']);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['component'].currentValue) {
      const component = changes['component'].currentValue as DynamicComponent;
      this.renderComponent(component);
    }
  }

  ngAfterViewInit() {
    const resizeStart$ = this.resizable.resizeStart;
    const resizable$ = this.resizable.resizing;
    const resizeEnd$ = this.resizable.resizeEnd;

    this.subscriptions.push(
      resizeStart$.subscribe(() => {
        const element = document.getElementsByClassName('ck ck-button ck-block-toolbar-button')[0] as HTMLDivElement;
        if (element) {
          element.style.display = 'none';
        }
      })
    );

    this.subscriptions.push(
      resizable$.subscribe(event => {
        if (event.rectangle.height) {
          const style = {
            height: `${event.rectangle.height}px`,
          };
          this.componentRef?.setInput('style', style);
        }
      })
    );

    this.subscriptions.push(
      resizeEnd$?.subscribe(event => {
        if (event.rectangle.height) {
          const style = {
            height: `${event.rectangle.height}px`,
          };
          this.componentRef?.setInput('style', style);
          this.store.dispatch(
            DesignCanvasActions.updateComponent({
              id: this.component?.id as string,
              inputs: { ...this.component?.inputs, style: style },
            })
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
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
