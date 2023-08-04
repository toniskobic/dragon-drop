import { createReducer, on } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid';

import { Viewport } from '../models/viewport.enum';
import { EditorActions } from './editor.actions';
import { EditorState } from './editor-state.model';

const id = uuidv4();

export const initialState: EditorState = {
  sidebarOpened: false,
  viewport: Viewport.Desktop,
  pages: [
    { id: id, title: 'Homepage', components: [] },
    { id: uuidv4(), title: 'About', components: [] },
  ],
  currentPageId: id,
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
  })),
  on(EditorActions.setCurrentPage, (state, { pageId }) => ({
    ...state,
    currentPageId: pageId,
  }))
);
