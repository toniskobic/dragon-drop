import { Viewport } from 'src/app/models/viewport.enum';

export interface EditorState {
  sidebarOpened: boolean;
  viewport: Viewport;
  isExporting: boolean;
}
