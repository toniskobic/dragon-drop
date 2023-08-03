import { createSelector } from '@ngrx/store';

import { AppState } from './editor-state.model';

export const selectEditorState = (state: AppState) => state.editor;

export const selectSidebarOpened = createSelector(selectEditorState, state => {
  return state.sidebarOpened;
});

export const selectViewport = createSelector(selectEditorState, state => {
  return state.viewport;
});
