import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DynamicComponentType, DynamicElement } from 'src/app/models/dynamic-component.model';
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
  @Input() elements: DynamicElement[] = [];
  @Input() style: object = {};

  get backgroundColor() {
    return getComputedStyle(document.documentElement).getPropertyValue(`--${this.themeColor}-color`);
  }
}
