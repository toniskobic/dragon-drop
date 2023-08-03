import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SectionComponent } from 'src/app/builder-components/section/section.component';
import { DynamicContentAreaDirective } from 'src/app/directives/dynamic-content-area.directive';
import { DynamicComponent } from 'src/app/models/dynamic-component.model';
import { Viewport } from 'src/app/models/viewport.enum';
import { DesignCanvasService } from 'src/app/services/design-canvas.service';
import { selectViewport } from 'src/app/state/editor.selectors';
import { AppState } from 'src/app/state/editor-state.model';

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
export class DesignCanvasComponent implements OnInit {
  // @ViewChild(DynamicContentAreaDirective, { static: true }) canvasContentArea!: DynamicContentAreaDirective;

  components: DynamicComponent[] = [];

  readonly Viewport = Viewport;

  currentViewport$ = this.store.select(selectViewport);

  constructor(
    private designCanvasService: DesignCanvasService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    // this.designCanvasService.setDynamicContentArea(this.canvasContentArea);
    this.designCanvasService.setComponents(this.components);
  }

  drop(event: CdkDragDrop<DynamicComponent[]>) {
    moveItemInArray(this.components, event.previousIndex, event.currentIndex);
  }
}
