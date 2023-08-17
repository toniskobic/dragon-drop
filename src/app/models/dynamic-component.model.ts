import { Type } from '@angular/core';

import { ThemeColor } from './theme-color.enum';

export interface DynamicComponentType {
  style?: object;
  themeColor: ThemeColor;
  elements: DynamicElement[];
}

export interface DynamicComponent {
  id: string;
  component: Type<DynamicComponentType>;
  inputs?: { [key: string]: unknown };
  selected?: boolean;
}

export interface DynamicElement {
  id: string;
  data: string;
}
