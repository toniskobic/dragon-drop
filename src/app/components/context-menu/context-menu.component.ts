import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { ContextMenuType } from 'src/app/models/context-menu-type.enum';
import { DynamicComponent, DynamicElement } from 'src/app/models/dynamic-component.model';
import { ThemeColor } from 'src/app/models/theme-color.enum';
import { UtilsService } from 'src/app/services/utils.service';
import { AppState } from 'src/app/state/app.reducer';
import { DesignCanvasActions } from 'src/app/state/design-canvas/design-canvas.actions';

@Component({
  selector: 'drd-context-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatListModule,
    MatIconModule,
    MatRippleModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent {
  ThemeColor = ThemeColor;
  ContextMenuType = ContextMenuType;
  rippleColor = getComputedStyle(document.documentElement).getPropertyValue('--rich-black-light-ripple');

  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;

  @Input() type?: ContextMenuType;
  @Input() section?: DynamicComponent;
  @Input() element?: DynamicElement;

  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private store: Store<AppState>,
    private utilsService: UtilsService
  ) {
    this.utilsService.initSvgIcons(['add']);
  }

  addElement() {
    this.store.dispatch(DesignCanvasActions.addElement({ sectionId: this.section?.id || '' }));
  }

  setSectionThemeColor(event: MatSelectChange) {
    const themeColor = event.value as ThemeColor;
    this.store.dispatch(
      DesignCanvasActions.updateComponent({
        id: this.section?.id || '',
        inputs: { ...this.section?.inputs, themeColor: themeColor },
      })
    );
  }
}
