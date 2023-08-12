import { Type } from '@angular/core';

import { DynamicElement } from './dynamic-component.model';

export interface SectionItem {
  name: string;
  class: Type<DynamicElement>;
  temp?: boolean;
}

export interface SectionCard {
  id: string;
  name: string;
  selected: boolean;
}
