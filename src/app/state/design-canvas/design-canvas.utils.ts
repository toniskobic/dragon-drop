import { Page } from 'src/app/models/page.model';

import { DesignCanvasState } from './design-canvas.model';

export const currentPage = (state: DesignCanvasState) => {
  return state.pages.find(page => page.id === state.currentPageId);
};

export const updatePage = (page: Page, newPage: Page) => {
  page.title = newPage.title;
  page.sections = newPage.sections;
};
