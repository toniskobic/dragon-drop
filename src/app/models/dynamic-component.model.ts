import { Type } from '@angular/core';

export interface DynamicComponentType {
  style?: object;
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
