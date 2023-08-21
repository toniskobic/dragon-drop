import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { DynamicComponentType } from 'src/app/models/dynamic-component.model';
import { ThemeColor } from 'src/app/models/theme-color.enum';

@Component({
  selector: 'drd-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements DynamicComponentType {
  @Input() themeColor: ThemeColor = ThemeColor.Primary;
  @Input() elements: GridsterItem[] = [];
  @Input() style: object = {};

  get backgroundColor() {
    return getComputedStyle(document.documentElement).getPropertyValue(`--${this.themeColor}-color`);
  }
}
