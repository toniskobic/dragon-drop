import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import {
  CompactType,
  GridsterComponent,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponent,
  GridType,
} from 'angular-gridster2';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { cloneDeep } from 'lodash-es';
import { map, Subscription } from 'rxjs';
import { RichTextEditorComponent } from 'src/app/components/rich-text-editor/rich-text-editor.component';
import { DynamicComponentType } from 'src/app/models/dynamic-component.model';
import { FontFamily } from 'src/app/models/font-family.enum';
import { ThemeColor } from 'src/app/models/theme-color.enum';
import { Viewport } from 'src/app/models/viewport.enum';
import { UtilsService } from 'src/app/services/utils.service';
import { AppState } from 'src/app/state/app.reducer';
import { DesignCanvasElementActions } from 'src/app/state/design-canvas/design-canvas.actions';
import { selectCanvasWidth } from 'src/app/state/design-canvas/design-canvas.reducer';
import { selectViewport } from 'src/app/state/editor/editor.reducer';

@Component({
  selector: 'drd-section',
  standalone: true,
  imports: [
    CommonModule,
    ResizableModule,
    RichTextEditorComponent,
    GridsterComponent,
    GridsterItemComponent,
    MatIconModule,
    LetDirective,
  ],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements DynamicComponentType, OnChanges, OnInit, OnDestroy {
  @Input() themeColor: ThemeColor = ThemeColor.Primary;
  @Input() fontThemeColor?: ThemeColor;
  @Input() themeFontFamily?: FontFamily;
  @Input() style: object = {};
  @Input() elements: GridsterItem[] = [];
  @Input() resized?: ResizeEvent;

  canvasWidth$ = this.store.select(selectCanvasWidth);
  isMobile$ = this.store.select(selectViewport).pipe(map(viewport => viewport === Viewport.Mobile));

  subscriptions: Subscription[] = [];

  gridItems: GridsterItem[] = [];
  gridOptions: GridsterConfig = {
    gridType: GridType.Fit,
    compactType: CompactType.None,
    disableScrollHorizontal: true,
    disableScrollVertical: true,
    useTransformPositioning: false,
    itemChangeCallback: this.itemChange.bind(this),
    itemResizeCallback: this.itemResize.bind(this),
    itemValidateCallback: this.itemValidate.bind(this),
    minRows: 4,
    maxRows: 4,
    minCols: 10,
    maxCols: 10,
    outerMargin: false,
    outerMarginBottom: 0,
    outerMarginLeft: 0,
    outerMarginRight: 0,
    outerMarginTop: 0,
    margin: 0,
    minItemCols: 1,
    minItemRows: 1,
    pushItems: true,
    draggable: {
      enabled: true,
      ignoreContent: true,
      dragHandleClass: 'drag-handle',
    },
    resizable: {
      enabled: true,
    },
  };

  get backgroundColor() {
    const background = this.style['background-color' as keyof typeof this.style];
    return background ? background : `var(--${this.themeColor}-color)`;
  }

  constructor(
    private utilsService: UtilsService,
    private store: Store<AppState>
  ) {
    this.utilsService.initSvgIcons(['drag']);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.canvasWidth$.subscribe(() => {
        if (this.gridOptions.api?.resize) {
          this.gridOptions.api.resize();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['elements']?.currentValue) {
      this.gridItems = cloneDeep(this.elements);
    }

    const style = changes['style']?.currentValue as object | undefined;
    if (style && style['min-height' as keyof typeof style]) {
      const minHeight = parseInt(style['min-height' as keyof typeof style], 10);
      this.adjustMaxRows(minHeight);
    }

    if (changes['resized']?.currentValue) {
      setTimeout(() => {
        if (this.gridOptions.api?.resize) this.gridOptions.api.resize();
      });
    }
  }

  itemChange(item: GridsterItem): void {
    this.store.dispatch(
      DesignCanvasElementActions.updateElementPosition({
        id: item['id'] as string,
        x: item.x,
        y: item.y,
        rows: item.rows,
        cols: item.cols,
      })
    );
  }

  itemResize(item: GridsterItem): void {
    this.store.dispatch(
      DesignCanvasElementActions.updateElementPosition({
        id: item['id'] as string,
        x: item.x,
        y: item.y,
        rows: item.rows,
        cols: item.cols,
      })
    );
  }

  itemValidate(item: GridsterItem): boolean {
    return item.cols > 0 && item.rows > 0;
  }

  private adjustMaxRows(sectionMinHeight: number): void {
    if (sectionMinHeight > 400) {
      this.gridOptions.maxRows = 10;
      this.gridOptions.minRows = 10;
    } else {
      this.gridOptions.maxRows = 4;
      this.gridOptions.minRows = 4;
    }
  }
}
