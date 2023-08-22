import { createHistorySelectors, initialUndoRedoState, undoRedo, UndoRedoState } from 'ngrx-wieder';

import { AppActions } from './app.actions';
import { DesignCanvasState } from './design-canvas/design-canvas.model';
import {
  designCanvasOnActions,
  designCanvasUndoRedoAllowedActions,
  initialDesignCanvasState,
} from './design-canvas/design-canvas.reducer';
import { EditorState } from './editor/editor.model';
import { editorOnActions, initialEditorState } from './editor/editor.reducer';
import { GlobalSettingsState } from './global-settings/global-settings.model';
import {
  globalSettingsOnActions,
  globalSettingsUndoRedoAllowedActions,
  initialGlobalSettingsState,
} from './global-settings/global-settings.reducer';
import { ThemeSettingsActions } from './theme-settings/theme-settings.actions';
import { ThemeSettingsState } from './theme-settings/theme-settings.model';
import {
  initialThemeSettingsState,
  themeSettingsOnActions,
  themeSettingsUndoRedoAllowedActions,
} from './theme-settings/theme-settings.reducer';

export interface AppState {
  dragonDrop: DragonDropState;
}

export interface DragonDropState
  extends EditorState,
    DesignCanvasState,
    GlobalSettingsState,
    ThemeSettingsState,
    UndoRedoState {}

export const initialState: DragonDropState = {
  ...initialEditorState,
  ...initialGlobalSettingsState,
  ...initialThemeSettingsState,
  ...initialDesignCanvasState,
  ...initialUndoRedoState,
};

// initialize ngrx-wieder with custom config
const { createUndoRedoReducer } = undoRedo({
  allowedActionTypes: [
    ...globalSettingsUndoRedoAllowedActions,
    ...themeSettingsUndoRedoAllowedActions,
    ...designCanvasUndoRedoAllowedActions,
  ],
  mergeActionTypes: [ThemeSettingsActions.setColor.type],
  breakMergeActionType: AppActions.breakMerge.type,
  undoActionType: AppActions.undo.type,
  redoActionType: AppActions.redo.type,
  trackActionPayload: true,
});

export const reducer = createUndoRedoReducer(
  initialState,
  ...designCanvasOnActions,
  ...globalSettingsOnActions,
  ...themeSettingsOnActions,
  ...editorOnActions
);

export const { selectCanUndo, selectCanRedo, selectHistory } = createHistorySelectors<AppState, DragonDropState>(
  state => state.dragonDrop
);
