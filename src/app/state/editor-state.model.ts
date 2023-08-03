import { Viewport } from '../models/viewport.enum';

export interface AppState {
  editor: EditorState;
}

export interface EditorState {
  sidebarOpened: boolean;
  viewport: Viewport;
}
