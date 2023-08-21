import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
import { cloneDeep } from 'lodash';
import { RichTextEditorComponent } from 'src/app/components/rich-text-editor/rich-text-editor.component';
import { DynamicComponentType } from 'src/app/models/dynamic-component.model';
import { ThemeColor } from 'src/app/models/theme-color.enum';
import { UtilsService } from 'src/app/services/utils.service';
import { AppState } from 'src/app/state/app.reducer';
import { DesignCanvasActions } from 'src/app/state/design-canvas/design-canvas.actions';

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
    minRows: 10,
    minCols: 10,
    outerMargin: false,
    outerMarginBottom: 0,
    outerMarginLeft: 0,
    outerMarginRight: 0,
    outerMarginTop: 0,
    margin: 0,
    maxCols: 10,
    maxRows: 10,
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    const background = (this.style as any)['background-color'];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return background ? background : `var(--${this.themeColor}-color)`;
  }

  constructor(
    private utilsService: UtilsService,
    private store: Store<AppState>
  ) {
    this.utilsService.initSvgIcons(['drag']);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['elements']?.currentValue) {
      this.gridItems = cloneDeep(this.elements);
    }
  }

  itemChange(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    console.info('itemChanged', item, itemComponent);
    this.store.dispatch(
      DesignCanvasActions.updateElementPosition({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: item['id'],
        x: item.x,
        y: item.y,
        rows: item.rows,
        cols: item.cols,
      })
    );
  }

  itemResize(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    console.info('itemResized', item, itemComponent);
    console.info('itemChanged', item, itemComponent);
    this.store.dispatch(
      DesignCanvasActions.updateElementPosition({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: item['id'],
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
}
