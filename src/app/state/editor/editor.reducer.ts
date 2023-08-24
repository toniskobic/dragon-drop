import { createSelector } from '@ngrx/store';
import { produceOn } from 'ngrx-wieder';
import { ResizeHandleDirection } from 'src/app/models/resize-handle-direction.enum';
import { Viewport } from 'src/app/models/viewport.enum';

import { DragonDropState } from '../app.reducer';
import { selectDragonDropState } from '../app.selectors';
import { EditorActions } from './editor.actions';
import { EditorState } from './editor.model';

export const initialEditorState: EditorState = {
  sidebarOpened: false,
  viewport: Viewport.Desktop,
  isExporting: false,
  resizeHandleDirection: ResizeHandleDirection.Normal,
};

export const editorOnActions = [
  produceOn(EditorActions.setViewport, (state: DragonDropState, { viewport }) => {
    state.viewport = viewport;
  }),
  produceOn(EditorActions.setSidebarOpened, (state: DragonDropState, { opened }) => {
    state.sidebarOpened = opened ? opened : !state.sidebarOpened;
  }),
  produceOn(EditorActions.setIsExporting, (state: DragonDropState, { isExporting }) => {
    state.isExporting = isExporting;
  }),
  produceOn(EditorActions.setResizeHandleDirection, (state: DragonDropState, { direction }) => {
    state.resizeHandleDirection = direction;
  }),
];

export const selectSidebarOpened = createSelector(selectDragonDropState, state => state.sidebarOpened);

export const selectViewport = createSelector(selectDragonDropState, state => state.viewport);

export const selectIsExporting = createSelector(selectDragonDropState, state => state.isExporting);

export const selectResizeHandleDirection = createSelector(selectDragonDropState, state => state.resizeHandleDirection);
