import { Type } from '@angular/core';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DynamicComponent, DynamicElement } from 'src/app/models/dynamic-component.model';
import { Page } from 'src/app/models/page.model';

export const DesignCanvasActions = createActionGroup({
  source: 'Design Canvas',
  events: {
    'Add Page': emptyProps(),
    'Remove Page': props<{ pageId: string }>(),
    'Set Current Page': props<{ pageId: string }>(),
    'Add Curent Page Component': props<{ component: DynamicComponent }>(),
    'Add Dropped Current Page Component': props<{
      componentClass: Type<DynamicElement>;
      currentIndex: number;
    }>(),
    'Sort Current Page Components': props<{ previousIndex: number; currentIndex: number }>(),
    'Update Component': props<{ id: string; inputs: { [key: string]: unknown } }>(),
    'Update Page': props<{ page: Page }>(),
  },
});
