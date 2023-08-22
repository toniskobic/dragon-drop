import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridsterItem } from 'angular-gridster2';
import { Subscription } from 'rxjs';
import { DynamicComponentType } from 'src/app/models/dynamic-component.model';
import { FontFamily } from 'src/app/models/font-family.enum';
import { ThemeColor } from 'src/app/models/theme-color.enum';
import { AppState } from 'src/app/state/app.reducer';
import { selectPages } from 'src/app/state/design-canvas/design-canvas.reducer';
import { selectLogo } from 'src/app/state/global-settings/global-settings.reducer';

@Component({
  selector: 'drd-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements DynamicComponentType, OnInit, OnDestroy {
  @Input() themeColor: ThemeColor = ThemeColor.Secondary;
  @Input() fontThemeColor?: ThemeColor;
  @Input() themeFontFamily?: FontFamily = FontFamily.Primary;
  @Input() style: object = {};
  @Input() elements: GridsterItem[] = [];

  pages$ = this.store.select(selectPages);
  logo$ = this.store.select(selectLogo);

  logoSrc: string | null = null;
  subscriptions: Subscription[] = [];

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.subscriptions.push(
      this.logo$.subscribe(logo => {
        if (logo) {
          const reader = new FileReader();

          reader.addEventListener('load', () => {
            this.logoSrc = reader.result as string;
          });

          reader.readAsDataURL(logo);
        } else {
          this.logoSrc = null;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

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
