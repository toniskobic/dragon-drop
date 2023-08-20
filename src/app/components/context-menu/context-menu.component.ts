import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'ngx-color-picker';
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
    ColorPickerModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent implements AfterViewInit {
  ThemeColor = ThemeColor;
  ContextMenuType = ContextMenuType;
  rippleColor = getComputedStyle(document.documentElement).getPropertyValue('--rich-black-light-ripple');

  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;

  @Input() type?: ContextMenuType;
  @Input() section?: DynamicComponent;
  @Input() element?: DynamicElement;

  colorPickerToggle = false;

  get color() {
    const style = this.section?.inputs?.style;
    return style && style['background-color' as keyof typeof style]
      ? style['background-color' as keyof typeof style]
      : '';
  }

  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private store: Store<AppState>,
    private utilsService: UtilsService
  ) {
    this.utilsService.initSvgIcons(['add', 'close']);
  }

  ngAfterViewInit() {
    this.contextMenu.menuOpened.subscribe(() => {
      this.colorPickerToggle = false;
    });
  }

  addElement() {
    this.store.dispatch(DesignCanvasActions.addElement({ sectionId: this.section?.id || '' }));
  }

  onColorChange(color: string) {
    this.colorPickerToggle = false;
    this.store.dispatch(
      DesignCanvasActions.updateComponent({
        id: this.section?.id || '',
        inputs: {
          ...this.section?.inputs,
          style: { ...this.section?.inputs.style, ['background-color']: color },
        },
      })
    );
  }

  removeCustomColor() {
    const style = this.section?.inputs?.style;
    if (style) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ['background-color' as keyof typeof style]: _background, ...removedBackgroundStyle } = style;
      this.store.dispatch(
        DesignCanvasActions.updateComponent({
          id: this.section?.id || '',
          inputs: {
            ...this.section?.inputs,
            style: removedBackgroundStyle,
          },
        })
      );
    }
  }

  openColorPicker(event: MouseEvent) {
    event.stopPropagation();
    this.colorPickerToggle = true;
    setTimeout(() => {
      document.getElementsByClassName('color-picker open')[0]?.classList.add('no-arrow');
    }, 0);
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
