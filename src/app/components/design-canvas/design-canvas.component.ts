import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicContentAreaDirective } from 'src/app/directives/dynamic-content-area.directive';
import { DesignCanvasService } from 'src/app/services/design-canvas.service';

import { ResizableDraggableComponent } from '../resizable-draggable/resizable-draggable.component';
import { SectionComponent } from '../section/section.component';

@Component({
  selector: 'drd-design-canvas',
  standalone: true,
  templateUrl: './design-canvas.component.html',
  styleUrls: ['./design-canvas.component.scss'],
  imports: [CommonModule, SectionComponent, ResizableDraggableComponent, DynamicContentAreaDirective],
})
export class DesignCanvasComponent implements OnInit {
  @ViewChild(DynamicContentAreaDirective, { static: true }) canvasContentArea!: DynamicContentAreaDirective;

  constructor(private designCanvasService: DesignCanvasService) {}

  ngOnInit(): void {
    this.designCanvasService.setDynamicContentArea(this.canvasContentArea);
  }
}
