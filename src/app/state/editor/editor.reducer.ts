import { createFeature, createReducer, on } from '@ngrx/store';
import { Viewport } from 'src/app/models/viewport.enum';

import { EditorActions } from './editor.actions';
import { EditorState } from './editor.model';

export const editorFeatureKey = 'editor';

export const initialState: EditorState = {
  sidebarOpened: false,
  viewport: Viewport.Desktop,
};

export const reducer = createReducer(
  initialState,
  on(EditorActions.setViewport, (state, { viewport }) => ({
    ...state,
    viewport: viewport,
  })),
  on(EditorActions.setSidebarOpened, (state, { opened }) => ({
    ...state,
    sidebarOpened: opened ? opened : !state.sidebarOpened,
  }))
);

export const editorFeature = createFeature({
  name: editorFeatureKey,
  reducer,
});

export const { selectEditorState, selectSidebarOpened, selectViewport } = editorFeature;
