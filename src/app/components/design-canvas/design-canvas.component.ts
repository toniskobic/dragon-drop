import { CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { DynamicContentAreaDirective } from 'src/app/directives/dynamic-content-area.directive';
import { Viewport } from 'src/app/models/viewport.enum';
import { DesignCanvasService } from 'src/app/services/design-canvas.service';
import { selectViewport } from 'src/app/state/editor.selectors';
import { AppState } from 'src/app/state/editor-state.model';

import { SectionComponent } from '../builder-components/section/section.component';
import { ResizableDraggableComponent } from '../resizable-draggable/resizable-draggable.component';

@Component({
  selector: 'drd-design-canvas',
  standalone: true,
  templateUrl: './design-canvas.component.html',
  styleUrls: ['./design-canvas.component.scss'],
  imports: [CommonModule, SectionComponent, ResizableDraggableComponent, DynamicContentAreaDirective, CdkDropList],
})
export class DesignCanvasComponent implements OnInit {
  @ViewChild(DynamicContentAreaDirective, { static: true }) canvasContentArea!: DynamicContentAreaDirective;

  readonly Viewport = Viewport;

  currentViewport$ = this.store.select(selectViewport);

  constructor(
    private designCanvasService: DesignCanvasService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.designCanvasService.setDynamicContentArea(this.canvasContentArea);
  }
}
