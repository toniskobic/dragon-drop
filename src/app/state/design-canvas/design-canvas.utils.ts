import { Page } from 'src/app/models/page.model';

import { DesignCanvasState } from './design-canvas.model';

export const currentPage = (state: DesignCanvasState) => {
  return state.pages.find(page => page.id === state.currentPageId);
};

export const updatePage = (state: DesignCanvasState, newPage: Page) => {
  return state.pages.map(page => (page.id === state.currentPageId ? newPage : page));
};

export function moveItemInArray<T>(arr: T[], previousIndex: number, currentIndex: number): T[] {
  // Create a copy of the array
  const newArray = [...arr];

  if (previousIndex === currentIndex) {
    return newArray;
  }

  const element = newArray[previousIndex];
  newArray.splice(previousIndex, 1);
  newArray.splice(currentIndex, 0, element);

  return newArray;
}
