import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  CompactType,
  DisplayGrid,
  GridsterComponent,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponent,
  GridType,
} from 'angular-gridster2';
import { ResizableModule } from 'angular-resizable-element';
import { RichTextEditorComponent } from 'src/app/components/rich-text-editor/rich-text-editor.component';
import { DynamicComponentType, DynamicElement } from 'src/app/models/dynamic-component.model';
import { ThemeColor } from 'src/app/models/theme-color.enum';

@Component({
  selector: 'drd-section',
  standalone: true,
  imports: [CommonModule, ResizableModule, RichTextEditorComponent, GridsterComponent, GridsterItemComponent],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements DynamicComponentType, OnChanges {
  @Input() themeColor: ThemeColor = ThemeColor.Primary;
  @Input() style: object = {};
  @Input() elements: DynamicElement[] = [];

  gridItems: GridsterItem[] = [];
  gridOptions: GridsterConfig = {
    gridType: GridType.Fit,
    compactType: CompactType.None,
    margin: 0,
    outerMargin: false,
    outerMarginTop: null,
    outerMarginRight: null,
    outerMarginBottom: null,
    outerMarginLeft: null,
    useTransformPositioning: false,
    mobileBreakpoint: 640,
    useBodyForBreakpoint: false,
    minCols: 1,
    maxCols: 100,
    minRows: 1,
    maxRows: 100,
    maxItemCols: 100,
    minItemCols: 1,
    maxItemRows: 100,
    minItemRows: 1,
    maxItemArea: 2500,
    minItemArea: 1,
    defaultItemCols: 1,
    defaultItemRows: 1,
    fixedColWidth: 105,
    fixedRowHeight: 105,
    keepFixedHeightInMobile: false,
    keepFixedWidthInMobile: false,
    scrollSensitivity: 10,
    scrollSpeed: 20,
    enableEmptyCellClick: false,
    enableEmptyCellContextMenu: false,
    enableEmptyCellDrop: false,
    enableEmptyCellDrag: false,
    enableOccupiedCellDrop: false,
    emptyCellDragMaxCols: 50,
    emptyCellDragMaxRows: 50,
    ignoreMarginInRow: false,
    draggable: {
      enabled: false,
    },
    resizable: {
      enabled: true,
    },
    swap: false,
    pushItems: true,
    disablePushOnDrag: false,
    disablePushOnResize: false,
    pushDirections: { north: true, east: true, south: true, west: true },
    pushResizeItems: false,
    displayGrid: DisplayGrid.Always,
    disableWindowResize: false,
    disableWarnings: false,
    scrollToNewItems: false,
  };

  get backgroundColor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    return (this.style as any)['background-color'] ? '' : `var(--${this.themeColor}-color)`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['elements']?.currentValue) {
      this.gridItems = this.elements.map(element => ({
        cols: this.gridOptions.defaultItemCols as number,
        rows: this.gridOptions.defaultItemRows as number,
        x: 0,
        y: 0,
        content: element,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }));
      console.log(this.gridItems);
    }
  }
}
