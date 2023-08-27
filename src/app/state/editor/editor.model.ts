import { ResizeHandleDirection } from 'src/app/models/resize-handle-direction.enum';
import { Viewport } from 'src/app/models/viewport.enum';

export interface EditorState {
  sidebarOpened: boolean;
  viewport: Viewport;
  isExporting: boolean;
  resizeHandleDirection: ResizeHandleDirection;
  firstLoad: boolean;
}
