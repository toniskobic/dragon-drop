import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import {
  CompactType,
  GridsterComponent,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponent,
  GridsterItemComponentInterface,
  GridType,
} from 'angular-gridster2';
import { ResizableModule } from 'angular-resizable-element';
import { cloneDeep } from 'lodash-es';
import { RichTextEditorComponent } from 'src/app/components/rich-text-editor/rich-text-editor.component';
import { DynamicComponentType } from 'src/app/models/dynamic-component.model';
import { FontFamily } from 'src/app/models/font-family.enum';
import { ThemeColor } from 'src/app/models/theme-color.enum';
import { UtilsService } from 'src/app/services/utils.service';
import { AppState } from 'src/app/state/app.reducer';
import { DesignCanvasElementActions } from 'src/app/state/design-canvas/design-canvas.actions';

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
  ],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements DynamicComponentType, OnChanges {
  @Input() themeColor: ThemeColor = ThemeColor.Primary;
  @Input() fontThemeColor?: ThemeColor;
  @Input() themeFontFamily?: FontFamily;
  @Input() style: object = {};
  @Input() elements: GridsterItem[] = [];

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
    itemInitCallback: this.itemInit.bind(this),
    itemRemovedCallback: this.itemInit.bind(this),
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
    private store: Store<AppState>,
    private renderer: Renderer2
  ) {
    this.utilsService.initSvgIcons(['drag']);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['elements']?.currentValue) {
      this.gridItems = cloneDeep(this.elements);
    }
    const style = changes['style']?.currentValue as object | undefined;
    if (style && style['height' as keyof typeof style]) {
      const height = parseInt(style['height' as keyof typeof style], 10);
      this.adjustMaxRows(height);
    }
  }

  itemInit(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    itemComponent.renderer = this.renderer;
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

  private adjustMaxRows(sectionHeight: number): void {
    if (sectionHeight > 400) {
      this.gridOptions.maxRows = 10;
      this.gridOptions.minRows = 10;
    } else {
      this.gridOptions.maxRows = 4;
      this.gridOptions.minRows = 4;
    }
  }
}
