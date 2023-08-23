import { Type } from '@angular/core';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DynamicComponentInputs, DynamicComponentType } from 'src/app/models/dynamic-component.model';
import { Page } from 'src/app/models/page.model';

export const DesignCanvasActions = createActionGroup({
  source: 'Design Canvas',
  events: {
    'Canvas Width Changed': props<{ width: number }>(),
  },
});

export const DesignCanvasPageActions = createActionGroup({
  source: 'Design Canvas Page',
  events: {
    'Add Page': emptyProps(),
    'Update Page': props<{ newPage: Page }>(),
    'Delete Page': props<{ pageId: string }>(),
    'Set Current Page': props<{ pageId: string }>(),
  },
});

export const DesignCanvasSectionActions = createActionGroup({
  source: 'Design Canvas Section',
  events: {
    'Select Current Page Section': props<{ sectionId: string }>(),
    'Unselect Current Page Section': emptyProps(),
    'Add Dropped Current Page Section': props<{
      sectionClass: Type<DynamicComponentType>;
      currentIndex: number;
    }>(),
    'Delete Section': props<{ pageId?: string; id: string }>(),
    'Sort Current Page Sections': props<{ previousIndex: number; currentIndex: number }>(),
    'Update Section': props<{ id: string; inputs: DynamicComponentInputs }>(),
  },
});

export const DesignCanvasElementActions = createActionGroup({
  source: 'Design Canvas Element',
  events: {
    'Add Element': props<{ sectionId: string }>(),
    'Update Element': props<{ id: string; data: string }>(),
    'Update Element Position': props<{ id: string; x: number; y: number; rows: number; cols: number }>(),
    'Delete Element': props<{ id: string }>(),
  },
});
