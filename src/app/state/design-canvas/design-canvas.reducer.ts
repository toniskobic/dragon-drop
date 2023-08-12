import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { SectionComponent } from 'src/app/builder-components/sections/section/section.component';
import { v4 as uuidv4 } from 'uuid';

import { DesignCanvasActions } from './design-canvas.actions';
import { DesignCanvasState } from './design-canvas.model';
import { copyArrayItem, currentPage, moveItemInArray, updatePage } from './design-canvas.utils';

export const designCanvasFeatureKey = 'designCanvas';

const pageId = uuidv4();

export const initialState: DesignCanvasState = {
  pages: [
    {
      id: pageId,
      title: 'Home',
      sections: [
        { id: uuidv4(), component: SectionComponent },
        { id: uuidv4(), component: SectionComponent },
      ],
    },
    { id: uuidv4(), title: 'About', sections: [{ id: uuidv4(), component: SectionComponent }] },
  ],
  currentPageId: pageId,
};

export const reducer = createReducer(
  initialState,
  on(DesignCanvasActions.addPage, state => {
    const pages = [
      ...state.pages,
      {
        id: uuidv4(),
        title: 'New Page',
        sections: [],
      },
    ];
    return { ...state, pages: pages };
  }),
  on(DesignCanvasActions.setCurrentPage, (state, { pageId }) => ({
    ...state,
    currentPageId: pageId,
  })),
  on(DesignCanvasActions.removePage, (state, { pageId }) => {
    const pages = state.pages.filter(page => page.id !== pageId);
    return {
      ...state,
      pages: pages,
      currentPageId: state.currentPageId === pageId ? pages[0].id : state.currentPageId,
    };
  }),
  on(DesignCanvasActions.sortCurrentPageComponents, (state, { previousIndex, currentIndex }) => {
    const page = currentPage(state);
    if (page) {
      const components = moveItemInArray(page.sections, previousIndex, currentIndex);
      const modifiedPage = { ...page, components: components };
      const pages = updatePage(state, modifiedPage);
      return { ...state, pages: pages };
    }
    return state;
  }),
  on(DesignCanvasActions.addCurentPageComponent, (state, { component }) => {
    const page = currentPage(state);
    if (page) {
      const components = [...page.sections, component];
      const modifiedPage = { ...page, components: components };
      const pages = updatePage(state, modifiedPage);
      return { ...state, pages: pages };
    }
    return state;
  }),
  on(DesignCanvasActions.addDroppedCurrentPageComponent, (state, { componentClass, currentIndex }) => {
    const page = currentPage(state);
    if (page) {
      const newComponent = { id: uuidv4(), component: componentClass };
      const components = copyArrayItem(newComponent, page.sections, currentIndex);
      const modifiedPage = { ...page, components: components };
      const pages = updatePage(state, modifiedPage);
      return { ...state, pages: pages };
    }
    return state;
  }),
  on(DesignCanvasActions.updateComponent, (state, { id, inputs }) => {
    const page = currentPage(state);
    if (page) {
      const components = page.sections.map(component => {
        if (component.id === id) {
          return { ...component, inputs: inputs };
        }
        return component;
      });
      const modifiedPage = { ...page, components: components };
      const pages = updatePage(state, modifiedPage);
      return { ...state, pages: pages };
    }
    return state;
  }),
  on(DesignCanvasActions.updatePage, (state, { page }) => {
    const pages = updatePage(state, page);
    return { ...state, pages: pages };
  })
);

export const designCanvasFeature = createFeature({
  name: designCanvasFeatureKey,
  reducer,
  extraSelectors: ({ selectCurrentPageId, selectPages }) => ({
    selectCurrentPage: createSelector(selectCurrentPageId, selectPages, (id, pages) =>
      pages.find(page => page.id === id)
    ),
    selectCurrentPageSections: createSelector(
      selectCurrentPageId,
      selectPages,
      (id, pages) => pages.find(page => page.id === id)?.sections
    ),
  }),
});

export const {
  selectDesignCanvasState,
  selectPages,
  selectCurrentPageId,
  selectCurrentPage,
  selectCurrentPageSections,
} = designCanvasFeature;
