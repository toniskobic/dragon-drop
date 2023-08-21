import { Type } from '@angular/core';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DynamicComponentInputs, DynamicComponentType } from 'src/app/models/dynamic-component.model';
import { Page } from 'src/app/models/page.model';

export const DesignCanvasActions = createActionGroup({
  source: 'Design Canvas',
  events: {
    'Add Page': emptyProps(),
    'Delete Page': props<{ pageId: string }>(),
    'Set Current Page': props<{ pageId: string }>(),
    'Select Current Page Section': props<{ sectionId: string }>(),
    'Unselect Current Page Section': emptyProps(),
    'Add Dropped Current Page Component': props<{
      componentClass: Type<DynamicComponentType>;
      currentIndex: number;
    }>(),
    'Delete Component': props<{ pageId?: string; id: string }>(),
    'Sort Current Page Components': props<{ previousIndex: number; currentIndex: number }>(),
    'Update Component': props<{ id: string; inputs: DynamicComponentInputs }>(),
    'Update Page': props<{ newPage: Page }>(),
    'Add Element': props<{ sectionId: string }>(),
    'Update Element': props<{ id: string; data: string }>(),
    'Update Element Position': props<{ id: string; x: number; y: number; rows: number; cols: number }>(),
    'Delete Element': props<{ id: string }>(),
  },
});
