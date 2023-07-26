import { createReducer, on } from '@ngrx/store';

import { EditorActions } from './editor.actions';
import { EditorState } from './editor-state.model';

export const initialState: EditorState = {
  sidebarOpened: false,
};

export const editorReducer = createReducer(
  initialState,
  on(EditorActions.setSidebarOpened, (state, { opened }) => ({
    ...state,
    sidebarOpened: opened ? opened : !state.sidebarOpened,
  }))
);
