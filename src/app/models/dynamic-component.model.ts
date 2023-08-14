import { ElementRef, Type } from '@angular/core';

export interface DynamicElement {
  element: ElementRef<HTMLElement> | null;
  style?: object;
}

export interface DynamicComponent {
  id: string;
  component: Type<DynamicElement>;
  inputs?: { [key: string]: unknown };
  selected?: boolean;
}
