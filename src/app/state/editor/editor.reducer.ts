import { createSelector } from '@ngrx/store';
import { produceOn } from 'ngrx-wieder';
import { Viewport } from 'src/app/models/viewport.enum';

import { DragonDropState } from '../app.reducer';
import { selectDragonDropState } from '../app.selectors';
import { EditorActions } from './editor.actions';
import { EditorState } from './editor.model';

export const initialEditorState: EditorState = {
  sidebarOpened: false,
  viewport: Viewport.Desktop,
  isExporting: false,
};

export const editorOnActions = [
  produceOn(EditorActions.setViewport, (state: DragonDropState, { viewport }) => {
    state.viewport = viewport;
  }),
  produceOn(EditorActions.setSidebarOpened, (state: DragonDropState, { opened }) => {
    state.sidebarOpened = opened ? opened : !state.sidebarOpened;
  }),
];

export const selectSidebarOpened = createSelector(selectDragonDropState, state => state.sidebarOpened);

export const selectViewport = createSelector(selectDragonDropState, state => state.viewport);

export const selectIsExporting = createSelector(selectDragonDropState, state => state.isExporting);
