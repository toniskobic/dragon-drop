import { createActionGroup, emptyProps } from '@ngrx/store';

export const AppActions = createActionGroup({
  source: 'App',
  events: {
    Undo: emptyProps(),
    Redo: emptyProps(),
    'Break Merge': emptyProps(),
  },
});
