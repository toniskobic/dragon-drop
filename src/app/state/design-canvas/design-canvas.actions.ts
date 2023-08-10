import { createActionGroup, props } from '@ngrx/store';
import { DynamicComponent } from 'src/app/models/dynamic-component.model';

export const DesignCanvasActions = createActionGroup({
  source: 'Design Canvas',
  events: {
    'Set Current Page': props<{ pageId: string }>(),
    'Sort Current Page Components': props<{ previousIndex: number; currentIndex: number }>(),
    'Add Curent Page Component': props<{ component: DynamicComponent }>(),
    'Add Dropped Current Page Component': props<{
      component: DynamicComponent;
      previousIndex: number;
      currentIndex: number;
    }>(),
  },
});
