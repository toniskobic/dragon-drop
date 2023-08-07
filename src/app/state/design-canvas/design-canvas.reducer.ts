import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { SectionComponent } from 'src/app/builder-components/section/section.component';
import { v4 as uuidv4 } from 'uuid';

import { DesignCanvasActions } from './design-canvas.actions';
import { DesignCanvasState } from './design-canvas.model';
import { currentPage, moveItemInArray, updatePage } from './design-canvas.utils';

export const designCanvasFeatureKey = 'designCanvas';

const pageId = uuidv4();

export const initialState: DesignCanvasState = {
  pages: [
    { id: pageId, title: 'Home', components: [{ component: SectionComponent }, { component: SectionComponent }] },
  ],
  currentPageId: pageId,
};

export const reducer = createReducer(
  initialState,
  on(DesignCanvasActions.setCurrentPage, (state, { pageId }) => ({
    ...state,
    currentPageId: pageId,
  })),
  on(DesignCanvasActions.sortCurrentPageComponents, (state, { previousIndex, currentIndex }) => {
    const page = currentPage(state);
    if (page) {
      const components = moveItemInArray(page.components, previousIndex, currentIndex);
      const modifiedPage = { ...page, components: components };
      const pages = updatePage(state, modifiedPage);
      return { ...state, pages: pages };
    }
    return state;
  }),
  on(DesignCanvasActions.addCurentPageComponent, (state, { component }) => {
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

export const designCanvasFeature = createFeature({
  name: designCanvasFeatureKey,
  reducer,
  extraSelectors: ({ selectCurrentPageId, selectPages }) => ({
    selectCurrentPage: createSelector(selectCurrentPageId, selectPages, (id, pages) =>
      pages.find(page => page.id === id)
    ),
    selectCurrentPageComponents: createSelector(
      selectCurrentPageId,
      selectPages,
      (id, pages) => pages.find(page => page.id === id)?.components
    ),
  }),
});

export const {
  selectDesignCanvasState,
  selectPages,
  selectCurrentPageId,
  selectCurrentPage,
  selectCurrentPageComponents,
} = designCanvasFeature;
