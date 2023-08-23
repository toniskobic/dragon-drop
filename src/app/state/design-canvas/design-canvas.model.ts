import { Page } from 'src/app/models/page.model';

export interface DesignCanvasState {
  canvasWidth: number | null;
  pages: Page[];
  currentPageId: string;
}
