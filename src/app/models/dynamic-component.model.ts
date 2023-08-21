import { Type } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';

import { ThemeColor } from './theme-color.enum';

export interface DynamicComponentType {
  style?: object;
  themeColor: ThemeColor;
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
