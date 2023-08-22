import { Type } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';

import { FontFamily } from './font-family.enum';
import { ThemeColor } from './theme-color.enum';

export interface DynamicComponentType {
  style?: object;
  themeColor: ThemeColor;
  fontThemeColor?: ThemeColor;
  themeFontFamily?: FontFamily;
  elements: GridsterItem[];
}

export interface DynamicComponent {
  id: string;
  component: Type<DynamicComponentType>;
  inputs: DynamicComponentInputs;
  selected?: boolean;
}

export interface DynamicElement {
  id: string;
  data: string;
}

export type DynamicComponentInputs = { [K in keyof DynamicComponentType]?: DynamicComponentType[K] };
