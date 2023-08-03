import { ElementRef, Type } from '@angular/core';

export interface DynamicElement {
  element: ElementRef<HTMLElement> | null;
  style?: object;
}

export interface DynamicComponent {
  component: Type<DynamicElement>;
  inputs?: { [key: string]: string };
}
