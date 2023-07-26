import { createActionGroup, props } from '@ngrx/store';

export const EditorActions = createActionGroup({
  source: 'Editor',
  events: {
    'Set Sidebar Opened': props<{ opened?: boolean }>(),
  },
});
