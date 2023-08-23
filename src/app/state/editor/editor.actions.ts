import { createActionGroup, props } from '@ngrx/store';
import { ResizeHandleDirection } from 'src/app/models/resize-handle-direction.enum';
import { Viewport } from 'src/app/models/viewport.enum';

export const EditorActions = createActionGroup({
  source: 'Editor',
  events: {
    'Set Sidebar Opened': props<{ opened?: boolean }>(),
    'Set Viewport': props<{ viewport: Viewport }>(),
    'Set Resize Handle Direction': props<{ direction: ResizeHandleDirection }>(),
  },
});
