import { Type } from '@angular/core';

import { DynamicComponentType } from './dynamic-component.model';

export interface SectionItem {
  name: string;
  class: Type<DynamicComponentType>;
  temp?: boolean;
}

export interface SectionCard {
  id: string;
  name: string;
  selected: boolean;
}
