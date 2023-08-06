import { createSelector } from '@ngrx/store';

import { AppState } from './editor-state.model';

export const selectEditorState = (state: AppState) => state.editor;

export const selectSidebarOpened = createSelector(selectEditorState, state => {
  return state.sidebarOpened;
});

export const selectViewport = createSelector(selectEditorState, state => {
  return state.viewport;
});

export const selectPages = createSelector(selectEditorState, state => {
  return state.pages;
});

export const selectCurrentPageId = createSelector(selectEditorState, state => {
  return state.currentPageId;
});

export const selectCurrentPage = createSelector(selectEditorState, state => {
  return state.pages.find(page => page.id === state.currentPageId);
});

export const selectCurrentPageComponents = createSelector(selectCurrentPage, page => {
  return page?.components;
});
