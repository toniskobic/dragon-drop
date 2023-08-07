import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { SectionComponent } from 'src/app/builder-components/section/section.component';
import { DynamicContentAreaDirective } from 'src/app/directives/dynamic-content-area.directive';
import { DynamicComponent } from 'src/app/models/dynamic-component.model';
import { Viewport } from 'src/app/models/viewport.enum';
import { AppState } from 'src/app/state/app.reducer';
import { DesignCanvasActions } from 'src/app/state/design-canvas/design-canvas.actions';
import { selectCurrentPageComponents } from 'src/app/state/design-canvas/design-canvas.reducer';
import { selectViewport } from 'src/app/state/editor/editor.reducer';

import { ResizableDraggableComponent } from '../resizable-draggable/resizable-draggable.component';

@Component({
  selector: 'drd-design-canvas',
  standalone: true,
  templateUrl: './design-canvas.component.html',
  styleUrls: ['./design-canvas.component.scss'],
  imports: [
    CommonModule,
    SectionComponent,
    ResizableDraggableComponent,
    DynamicContentAreaDirective,
    DragDropModule,
    ScrollingModule,
  ],
})
export class DesignCanvasComponent {
  // @ViewChild(DynamicContentAreaDirective, { static: true }) canvasContentArea!: DynamicContentAreaDirective;

  components$ = this.store.select(selectCurrentPageComponents);

  readonly Viewport = Viewport;

  currentViewport$ = this.store.select(selectViewport);

  constructor(
    // private designCanvasService: DesignCanvasService,
    private store: Store<AppState>
  ) {}

  drop(event: CdkDragDrop<DynamicComponent[]>) {
    this.store.dispatch(
      DesignCanvasActions.sortCurrentPageComponents({
        previousIndex: event.previousIndex,
        currentIndex: event.currentIndex,
      })
    );
    // moveItemInArray(this.components, event.previousIndex, event.currentIndex);
  }
}
