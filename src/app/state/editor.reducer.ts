import { createReducer, on } from '@ngrx/store';

import { Viewport } from '../models/viewport.enum';
import { EditorActions } from './editor.actions';
import { EditorState } from './editor-state.model';

export const initialState: EditorState = {
  sidebarOpened: false,
  viewport: Viewport.Desktop,
};

export const editorReducer = createReducer(
  initialState,
  on(EditorActions.setSidebarOpened, (state, { opened }) => ({
    ...state,
    sidebarOpened: opened ? opened : !state.sidebarOpened,
  })),
  on(EditorActions.setViewport, (state, { viewport }) => ({
    ...state,
    viewport: viewport,
  }))
);
