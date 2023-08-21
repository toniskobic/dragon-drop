import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridsterItem } from 'angular-gridster2';
import { DynamicComponentType } from 'src/app/models/dynamic-component.model';
import { ThemeColor } from 'src/app/models/theme-color.enum';
import { AppState } from 'src/app/state/app.reducer';
import { selectPages } from 'src/app/state/design-canvas/design-canvas.reducer';

@Component({
  selector: 'drd-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements DynamicComponentType {
  @Input() themeColor: ThemeColor = ThemeColor.Secondary;
  @Input() style: object = {};
  @Input() elements: GridsterItem[] = [];

  pages$ = this.store.select(selectPages);
  constructor(private store: Store<AppState>) {}

  get backgroundColor() {
    return getComputedStyle(document.documentElement).getPropertyValue(`--${this.themeColor}-color`);
  }
}
