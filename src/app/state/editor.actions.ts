import { createActionGroup, props } from '@ngrx/store';

import { DynamicComponent } from '../models/dynamic-component.model';
import { Viewport } from '../models/viewport.enum';

export const EditorActions = createActionGroup({
  source: 'Editor',
  events: {
    'Set Sidebar Opened': props<{ opened?: boolean }>(),
    'Set Viewport': props<{ viewport: Viewport }>(),
    'Set Current Page': props<{ pageId: string }>(),
    'Sort Current Page Components': props<{ previousIndex: number; currentIndex: number }>(),
    'Add Curent Page Component': props<{ component: DynamicComponent }>(),
  },
});
