import { UndoRedoState } from 'ngrx-wieder';
import { Page } from 'src/app/models/page.model';

export interface DesignCanvasState extends UndoRedoState {
  pages: Page[];
  currentPageId: string;
}
