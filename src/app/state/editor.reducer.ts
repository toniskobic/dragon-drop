import { createReducer, on } from "@ngrx/store";
import { EditorState } from "./editor-state.model";
import { EditorActions } from "./editor.actions";
import { state } from "@angular/animations";

export const initialState: EditorState = {
  sidebarOpened: false,
}

export const editorReducer = createReducer(
  initialState,
  on(EditorActions.setSidebarOpened, (state, { opened }) => ({ ...state, sidebarOpened: opened ? opened : !state.sidebarOpened })),
)
