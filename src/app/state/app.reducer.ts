import { UndoRedoState } from 'ngrx-wieder';

import { DesignCanvasState } from './design-canvas/design-canvas.model';
import { designCanvasFeatureKey, reducer as desigCanvasReducer } from './design-canvas/design-canvas.reducer';
import { EditorState } from './editor/editor.model';
import { editorFeatureKey, reducer as editorReducer } from './editor/editor.reducer';
import { ThemeSettingsState } from './theme-settings/theme-settings.model';
import { reducer as themeSettingsReducer, themeSettingsFeatureKey } from './theme-settings/theme-settings.reducer';

export interface AppState extends UndoRedoState {
  [editorFeatureKey]: EditorState;
  [designCanvasFeatureKey]: DesignCanvasState;
  [themeSettingsFeatureKey]: ThemeSettingsState;
}

export const reducers = {
  [editorFeatureKey]: editorReducer,
  [designCanvasFeatureKey]: desigCanvasReducer,
  [themeSettingsFeatureKey]: themeSettingsReducer,
};
