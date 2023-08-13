import { createHistorySelectors, initialUndoRedoState, undoRedo, UndoRedoState } from 'ngrx-wieder';

import { AppActions } from './app.actions';
import { DesignCanvasActions } from './design-canvas/design-canvas.actions';
import { DesignCanvasState } from './design-canvas/design-canvas.model';
import { designCanvasOnActions, initialDesignCanvasState } from './design-canvas/design-canvas.reducer';
import { EditorState } from './editor/editor.model';
import { editorOnActions, initialEditorState } from './editor/editor.reducer';
import { ThemeSettingsActions } from './theme-settings/theme-settings.actions';
import { ThemeSettingsState } from './theme-settings/theme-settings.model';
import { initialThemeSettingsState, themeSettingsOnActions } from './theme-settings/theme-settings.reducer';

export interface AppState {
  dragonDrop: DragonDropState;
}

export interface DragonDropState extends EditorState, DesignCanvasState, ThemeSettingsState, UndoRedoState {}

export const initialState: DragonDropState = {
  ...initialEditorState,
  ...initialThemeSettingsState,
  ...initialDesignCanvasState,
  ...initialUndoRedoState,
};

// initialize ngrx-wieder with custom config
const { createUndoRedoReducer } = undoRedo({
  allowedActionTypes: [
    ThemeSettingsActions.setFont.type,
    ThemeSettingsActions.setColor.type,
    DesignCanvasActions.addPage.type,
    DesignCanvasActions.deletePage.type,
    DesignCanvasActions.addDroppedCurrentPageComponent.type,
    DesignCanvasActions.deleteComponent.type,
    DesignCanvasActions.sortCurrentPageComponents.type,
    DesignCanvasActions.updateComponent.type,
    DesignCanvasActions.updatePage.type,
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
  ...themeSettingsOnActions,
  ...editorOnActions
);

export const { selectCanUndo, selectCanRedo, selectHistory } = createHistorySelectors<AppState, DragonDropState>(
  state => state.dragonDrop
);
