import { Page } from 'src/app/models/page.model';

export interface DesignCanvasState {
  pages: Page[];
  currentPageId: string;
}
