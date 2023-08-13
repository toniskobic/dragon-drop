import { moveItemInArray } from '@angular/cdk/drag-drop';
import { createFeature, createSelector } from '@ngrx/store';
import { createHistorySelectors, initialUndoRedoState, produceOn, undoRedo } from 'ngrx-wieder';
import { SectionComponent } from 'src/app/builder-components/sections/section/section.component';
import { v4 as uuidv4 } from 'uuid';

import { AppState } from '../app.reducer';
import { DesignCanvasActions } from './design-canvas.actions';
import { DesignCanvasState } from './design-canvas.model';
import { currentPage, updatePage } from './design-canvas.utils';

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
  ...initialUndoRedoState,
};

// initialize ngrx-wieder with custom config
const { createUndoRedoReducer } = undoRedo({
  allowedActionTypes: [
    DesignCanvasActions.addPage.type,
    DesignCanvasActions.deletePage.type,
    DesignCanvasActions.addDroppedCurrentPageComponent.type,
    DesignCanvasActions.deleteComponent.type,
    DesignCanvasActions.sortCurrentPageComponents.type,
    DesignCanvasActions.updateComponent.type,
    DesignCanvasActions.updatePage.type,
  ],
  trackActionPayload: true,
});

export const reducer = createUndoRedoReducer(
  initialState,
  produceOn(DesignCanvasActions.addPage, state => {
    state.pages.push({ id: uuidv4(), title: 'New Page', sections: [] });
  }),
  produceOn(DesignCanvasActions.setCurrentPage, (state, { pageId }) => {
    state.currentPageId = pageId;
  }),
  produceOn(DesignCanvasActions.deletePage, (state, { pageId }) => {
    const pages = state.pages.filter(page => page.id !== pageId);
    state.pages = pages;
    state.currentPageId = state.currentPageId === pageId ? pages[0].id : state.currentPageId;
  }),
  produceOn(DesignCanvasActions.sortCurrentPageComponents, (state, { previousIndex, currentIndex }) => {
    const page = currentPage(state);
    if (page) {
      moveItemInArray(page.sections, previousIndex, currentIndex);
    }
  }),
  produceOn(DesignCanvasActions.addDroppedCurrentPageComponent, (state, { componentClass, currentIndex }) => {
    const page = currentPage(state);
    if (page) {
      const newSection = { id: uuidv4(), component: componentClass };
      page.sections.splice(currentIndex, 0, newSection);
    }
  }),
  produceOn(DesignCanvasActions.deleteComponent, (state, { pageId, id }) => {
    const componentsPageId = pageId ? pageId : state.currentPageId;
    const page = state.pages.find(page => page.id === componentsPageId);
    if (page) {
      page.sections = page.sections.filter(component => component.id !== id);
    }
  }),
  produceOn(DesignCanvasActions.updateComponent, (state, { id, inputs }) => {
    const page = currentPage(state);
    if (page) {
      const section = page.sections.find(component => component.id === id);
      if (section) section.inputs = inputs;
    }
  }),
  produceOn(DesignCanvasActions.updatePage, (state, { newPage }) => {
    const page = state.pages.find(page => page.id === newPage.id);
    if (page) {
      updatePage(page, newPage);
    }
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

export const { selectCanUndo: canUndoDesignCanvas, selectCanRedo: canRedoDesignCanvas } = createHistorySelectors<
  AppState,
  DesignCanvasState
>(state => state[designCanvasFeatureKey]);
