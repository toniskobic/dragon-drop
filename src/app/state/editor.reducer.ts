import { createReducer, on } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid';

import { Color } from '../models/color.model';
import { Page } from '../models/page.model';
import { Viewport } from '../models/viewport.enum';
import { EditorActions } from './editor.actions';
import { EditorState } from './editor-state.model';

const pageId = uuidv4();

const primaryFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--primary-font-family');
const secondaryFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--secondary-font-family');
const alternativeFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--alternative-font-family');

const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') as Color;
const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color') as Color;
const tertiaryColor = getComputedStyle(document.documentElement).getPropertyValue('--tertiary-color') as Color;

export const initialState: EditorState = {
  sidebarOpened: false,
  viewport: Viewport.Desktop,
  pages: [{ id: pageId, title: 'Home', components: [] }],
  currentPageId: pageId,
  themeSettings: {
    colors: { primary: primaryColor, secondary: secondaryColor, tertiary: tertiaryColor },
    fonts: { primary: primaryFontFamily, secondary: secondaryFontFamily, alternative: alternativeFontFamily },
  },
};

export const editorReducer = createReducer(
  initialState,
  on(EditorActions.setSidebarOpened, (state, { opened }) => ({
    ...state,
    sidebarOpened: opened ? opened : !state.sidebarOpened,
  })),
  on(EditorActions.setViewport, (state, { viewport }) => ({
    ...state,
    viewport: viewport,
  })),
  on(EditorActions.setCurrentPage, (state, { pageId }) => ({
    ...state,
    currentPageId: pageId,
  })),
  on(EditorActions.sortCurrentPageComponents, (state, { previousIndex, currentIndex }) => {
    const page = currentPage(state);
    if (page) {
      const components = moveItemInArray(page.components, previousIndex, currentIndex);
      const modifiedPage = { ...page, components: components };
      const pages = updatePage(state, modifiedPage);
      return { ...state, pages: pages };
    }
    return state;
  }),
  on(EditorActions.addCurentPageComponent, (state, { component }) => {
    const page = currentPage(state);
    if (page) {
      const components = [...page.components, component];
      const modifiedPage = { ...page, components: components };
      const pages = updatePage(state, modifiedPage);
      return { ...state, pages: pages };
    }
    return state;
  })
);

const currentPage = (state: EditorState) => {
  return state.pages.find(page => page.id === state.currentPageId);
};

const updatePage = (state: EditorState, newPage: Page) => {
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
