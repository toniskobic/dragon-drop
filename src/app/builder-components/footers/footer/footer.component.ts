import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridsterItem } from 'angular-gridster2';
import { DynamicComponentType } from 'src/app/models/dynamic-component.model';
import { FontFamily } from 'src/app/models/font-family.enum';
import { ThemeColor } from 'src/app/models/theme-color.enum';
import { AppState } from 'src/app/state/app.reducer';
import { selectPages } from 'src/app/state/design-canvas/design-canvas.reducer';

@Component({
  selector: 'drd-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements DynamicComponentType {
  @Input() themeColor: ThemeColor = ThemeColor.Secondary;
  @Input() fontThemeColor?: ThemeColor;
  @Input() themeFontFamily?: FontFamily = FontFamily.Primary;
  @Input() style: object = {};
  @Input() elements: GridsterItem[] = [];

  pages$ = this.store.select(selectPages);
  constructor(private store: Store<AppState>) {}

  get backgroundColor() {
    const background = this.style['background-color' as keyof typeof this.style];
    return background ? background : `var(--${this.themeColor}-color)`;
  }

  get color() {
    const color = this.style['color' as keyof typeof this.style];
    return color ? color : this.fontThemeColor ? `var(--${this.fontThemeColor}-color)` : '';
  }

  get fontFamily() {
    return `var(--${this.themeFontFamily?.toLowerCase()}-font-family), var(--alternative-font-family)`;
  }

  get fontSize() {
    const fontSize = this.style['font-size' as keyof typeof this.style];
    return fontSize || '';
  }
}
