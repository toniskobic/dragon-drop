import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { EditorState } from "./editor-state.model";

export const EditorActions = createActionGroup({
  source: 'Editor',
  events: {
    'Set Sidebar Opened': props<{ opened?: boolean }>(),
  }
});