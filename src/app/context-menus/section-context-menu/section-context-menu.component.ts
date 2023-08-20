import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { Subscription } from 'rxjs';
import { ContextMenuType } from 'src/app/models/context-menu-type.enum';
import { DynamicComponent } from 'src/app/models/dynamic-component.model';
import { ThemeColor } from 'src/app/models/theme-color.enum';
import { UtilsService } from 'src/app/services/utils.service';
import { AppState } from 'src/app/state/app.reducer';
import { DesignCanvasActions } from 'src/app/state/design-canvas/design-canvas.actions';

@Component({
  selector: 'drd-section-context-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatRippleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ColorPickerModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './section-context-menu.component.html',
  styleUrls: ['./section-context-menu.component.scss'],
})
export class SectionContextMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  ThemeColor = ThemeColor;
  ContextMenuType = ContextMenuType;
  rippleColor = getComputedStyle(document.documentElement).getPropertyValue('--rich-black-light-ripple');

  @Input() section?: DynamicComponent;
  @Input() menuOpened?: EventEmitter<void>;
  @Input() menuClosed?: EventEmitter<void>;

  subscriptions: (Subscription | undefined)[] = [];
  contextMenuPosition = { x: '0px', y: '0px' };
  colorPickerToggle = false;
  sectionHeightControl = new FormControl(100, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(100)],
  });

  get sectionHeight() {
    const style = this.section?.inputs?.style as object;
    const number = parseInt(style['height' as keyof typeof style], 10);
    return number;
  }

  get color() {
    const style = this.section?.inputs?.style;
    return style && style['background-color' as keyof typeof style]
      ? style['background-color' as keyof typeof style]
      : '';
  }

  constructor(
    private store: Store<AppState>,
    private utilsService: UtilsService
  ) {
    this.utilsService.initSvgIcons(['add', 'close', 'delete']);
  }

  ngOnInit() {
    this.sectionHeightControl = new FormControl(this.sectionHeight, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(100)],
    });
  }

  ngAfterViewInit() {
    this.subscriptions.push(
      this.menuOpened?.subscribe(() => {
        this.sectionHeightControl.setValue(this.sectionHeight);
        this.colorPickerToggle = false;
      })
    );

    this.subscriptions.push(
      this.menuClosed?.subscribe(() => {
        this.submitInput();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s?.unsubscribe());
    this.subscriptions = [];
  }

  submitInput() {
    if (this.sectionHeightControl.valid) {
      const sectionHeight = this.sectionHeightControl.value;
      if (sectionHeight !== this.sectionHeight) {
        this.store.dispatch(
          DesignCanvasActions.updateComponent({
            id: this.section?.id || '',
            inputs: {
              ...this.section?.inputs,
              style: { ...this.section?.inputs.style, height: `${sectionHeight}px` },
            },
          })
        );
      }
    }
  }

  deleteSection() {
    this.store.dispatch(DesignCanvasActions.deleteComponent({ id: this.section?.id || '' }));
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
