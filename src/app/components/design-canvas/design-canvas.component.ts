import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SectionComponent } from 'src/app/builder-components/sections/section/section.component';
import { DynamicContentAreaDirective } from 'src/app/directives/dynamic-content-area.directive';
import { DynamicComponent } from 'src/app/models/dynamic-component.model';
import { SectionItem } from 'src/app/models/section-item.model';
import { Viewport } from 'src/app/models/viewport.enum';
import { ExportWebsiteService } from 'src/app/services/export-website.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AppState } from 'src/app/state/app.reducer';
import { DesignCanvasActions, DesignCanvasSectionActions } from 'src/app/state/design-canvas/design-canvas.actions';
import { selectCurrentPageSections } from 'src/app/state/design-canvas/design-canvas.reducer';
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
export class DesignCanvasComponent implements OnInit, OnDestroy {
  readonly Viewport = Viewport;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLDivElement>;

  currentViewport$ = this.store.select(selectViewport);
  components$ = this.store.select(selectCurrentPageSections);

  private subscriptions: Subscription[] = [];
  private resizeObserver!: ResizeObserver;
  private previousWidth: number | null = null;

  constructor(
    private store: Store<AppState>,
    private utils: UtilsService,
    private exportWebsiteService: ExportWebsiteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const canvasDiv = this.canvas.nativeElement;
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === canvasDiv) {
          const newWidth = entry.contentRect.width;
          if (this.previousWidth !== newWidth) {
            this.store.dispatch(
              DesignCanvasActions.canvasWidthChanged({
                width: newWidth,
              })
            );
            this.previousWidth = newWidth;
          }
        }
      }
    });

    this.resizeObserver.observe(canvasDiv);

    this.subscriptions.push(
      this.exportWebsiteService.triggerChangeDetect$.subscribe(() => {
        this.cdr.detectChanges();
        setTimeout(() => {
          void this.exportWebsiteService.continueExport();
        }, 0);
      })
    );
  }

  ngOnDestroy() {
    this.resizeObserver.disconnect();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  drop(event: CdkDragDrop<DynamicComponent[], SectionItem[] | DynamicComponent[]>) {
    if (event.isPointerOverContainer) {
      if (event.previousContainer === event.container) {
        this.store.dispatch(
          DesignCanvasSectionActions.sortCurrentPageSections({
            previousIndex: event.previousIndex,
            currentIndex: event.currentIndex,
          })
        );
      } else {
        const sectionItem = event.item.data as SectionItem;
        this.store.dispatch(
          DesignCanvasSectionActions.addDroppedCurrentPageSection({
            sectionClass: sectionItem.class,
            currentIndex: event.currentIndex,
          })
        );
      }
    }
    if (event.previousContainer.data) {
      this.utils.filterInPlace(event.previousContainer.data as SectionItem[], item => !item.temp);
    }
  }
}
