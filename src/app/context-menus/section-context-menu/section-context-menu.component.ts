import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
import { map, Subscription } from 'rxjs';
import { MIN_SECTION_DIMENSIONS_PX } from 'src/app/constants/constants';
import { ContextMenuType } from 'src/app/models/context-menu-type.enum';
import { DynamicComponent } from 'src/app/models/dynamic-component.model';
import { FontFamily } from 'src/app/models/font-family.enum';
import { ThemeColor } from 'src/app/models/theme-color.enum';
import { Viewport } from 'src/app/models/viewport.enum';
import { SectionsService } from 'src/app/services/sections.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AppState } from 'src/app/state/app.reducer';
import {
  DesignCanvasElementActions,
  DesignCanvasSectionActions,
} from 'src/app/state/design-canvas/design-canvas.actions';
import { selectViewport } from 'src/app/state/editor/editor.reducer';

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
export class SectionContextMenuComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  ThemeColor = ThemeColor;
  FontFamily = FontFamily;
  ContextMenuType = ContextMenuType;
  rippleColor = getComputedStyle(document.documentElement).getPropertyValue('--rich-black-light-ripple');

  @Input() section?: DynamicComponent;
  @Input() menuOpened?: EventEmitter<void>;
  @Input() menuClosed?: EventEmitter<void>;

  isCurrentViewportMobile$ = this.store.select(selectViewport).pipe(map(viewport => viewport === Viewport.Mobile));
  isMobile$ = this.breakpointObserver.observe('(max-width: 640px)').pipe(map(result => result.matches));
  elementsCount = 0;

  subscriptions: (Subscription | undefined)[] = [];
  contextMenuPosition = { x: '0px', y: '0px' };
  colorPickerToggle = false;
  fontColorPickerToggle = false;
  isHeaderOrFooter = false;
  sectionHeightControl = new FormControl(MIN_SECTION_DIMENSIONS_PX, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(MIN_SECTION_DIMENSIONS_PX)],
  });
  fontSizes = ['8px', '12px', '16px', '18px', '24px', '30px', '36px', '42px'];

  get sectionHeight() {
    const style = this.section?.inputs?.style as object;
    const number = parseInt(style['min-height' as keyof typeof style], 10);
    return number;
  }

  get backgroundColor() {
    const style = this.section?.inputs?.style;
    return style && style['background-color' as keyof typeof style]
      ? style['background-color' as keyof typeof style]
      : '';
  }

  get color() {
    const style = this.section?.inputs?.style;
    return style && style['color' as keyof typeof style] ? style['color' as keyof typeof style] : '';
  }

  get fontSize() {
    const style = this.section?.inputs?.style;
    return style && style['font-size' as keyof typeof style] ? style['font-size' as keyof typeof style] : '';
  }

  constructor(
    private store: Store<AppState>,
    private utilsService: UtilsService,
    private sectionsService: SectionsService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.utilsService.initSvgIcons(['add', 'close', 'delete']);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['section'].currentValue) {
      const section = changes['section'].currentValue as DynamicComponent;
      this.isHeaderOrFooter = !this.sectionsService.sections.get(section.component);
      this.elementsCount = section.inputs.elements?.length || 0;
    }
  }

  ngOnInit() {
    this.sectionHeightControl = new FormControl(this.sectionHeight, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(MIN_SECTION_DIMENSIONS_PX)],
    });
  }

  ngAfterViewInit() {
    this.subscriptions.push(
      this.menuOpened?.subscribe(() => {
        this.sectionHeightControl.setValue(this.sectionHeight);
        this.fontColorPickerToggle = false;
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
          DesignCanvasSectionActions.updateSection({
            id: this.section?.id || '',
            inputs: {
              ...this.section?.inputs,
              style: { ...this.section?.inputs.style, ['min-height']: `${sectionHeight}px` },
            },
          })
        );
      }
    }
  }

  deleteSection() {
    this.store.dispatch(DesignCanvasSectionActions.deleteSection({ id: this.section?.id || '' }));
  }

  addElement() {
    this.store.dispatch(DesignCanvasElementActions.addElement({ sectionId: this.section?.id || '' }));
  }

  onColorChange(color: string, isFont: boolean = false) {
    isFont ? (this.fontColorPickerToggle = false) : (this.colorPickerToggle = false);
    const property = isFont ? 'color' : 'background-color';
    this.store.dispatch(
      DesignCanvasSectionActions.updateSection({
        id: this.section?.id || '',
        inputs: {
          ...this.section?.inputs,
          style: { ...this.section?.inputs.style, [property]: color },
        },
      })
    );
  }

  removeCustomColor(isFont: boolean = false) {
    const property = isFont ? 'color' : 'background-color';
    const style = this.section?.inputs?.style;
    if (style) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [property as keyof typeof style]: _background, ...removedBackgroundStyle } = style;
      this.store.dispatch(
        DesignCanvasSectionActions.updateSection({
          id: this.section?.id || '',
          inputs: {
            ...this.section?.inputs,
            style: removedBackgroundStyle,
          },
        })
      );
    }
  }

  openColorPicker(event: MouseEvent, isFont = false) {
    event.stopPropagation();
    isFont ? (this.fontColorPickerToggle = true) : (this.colorPickerToggle = true);
    setTimeout(() => {
      document.getElementsByClassName('color-picker open')[0]?.classList.add('no-arrow');
    }, 0);
  }

  setThemeColor(event: MatSelectChange, isFont: boolean = false) {
    const property = isFont ? 'fontThemeColor' : 'themeColor';
    const themeColor = event.value as ThemeColor;
    this.store.dispatch(
      DesignCanvasSectionActions.updateSection({
        id: this.section?.id || '',
        inputs: { ...this.section?.inputs, [property]: themeColor },
      })
    );
  }

  setFontFamily(event: MatSelectChange) {
    const fontFamily = event.value as FontFamily;
    this.store.dispatch(
      DesignCanvasSectionActions.updateSection({
        id: this.section?.id || '',
        inputs: { ...this.section?.inputs, themeFontFamily: fontFamily },
      })
    );
  }

  setFontSize(event: MatSelectChange) {
    const fontSize = event.value as string;
    this.store.dispatch(
      DesignCanvasSectionActions.updateSection({
        id: this.section?.id || '',
        inputs: { ...this.section?.inputs, style: { ...this.section?.inputs.style, 'font-size': fontSize } },
      })
    );
  }
}
