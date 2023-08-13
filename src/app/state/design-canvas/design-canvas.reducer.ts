import { moveItemInArray } from '@angular/cdk/drag-drop';
import { createSelector } from '@ngrx/store';
import { produceOn } from 'ngrx-wieder';
import { SectionComponent } from 'src/app/builder-components/sections/section/section.component';
import { v4 as uuidv4 } from 'uuid';

import { DragonDropState } from '../app.reducer';
import { selectDragonDropState } from '../app.selectors';
import { DesignCanvasActions } from './design-canvas.actions';
import { DesignCanvasState } from './design-canvas.model';
import { currentPage, updatePage } from './design-canvas.utils';

const pageId = uuidv4();

export const initialDesignCanvasState: DesignCanvasState = {
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

export const designCanvasOnActions = [
  produceOn(DesignCanvasActions.addPage, (state: DragonDropState) => {
    state.pages.push({ id: uuidv4(), title: 'New Page', sections: [] });
  }),
  produceOn(DesignCanvasActions.setCurrentPage, (state: DragonDropState, { pageId }) => {
    state.currentPageId = pageId;
  }),
  produceOn(DesignCanvasActions.deletePage, (state: DragonDropState, { pageId }) => {
    const pages = state.pages.filter(page => page.id !== pageId);
    state.pages = pages;
    state.currentPageId = state.currentPageId === pageId ? pages[0].id : state.currentPageId;
  }),
  produceOn(
    DesignCanvasActions.sortCurrentPageComponents,
    (state: DragonDropState, { previousIndex, currentIndex }) => {
      const page = currentPage(state);
      if (page) {
        moveItemInArray(page.sections, previousIndex, currentIndex);
      }
    }
  ),
  produceOn(
    DesignCanvasActions.addDroppedCurrentPageComponent,
    (state: DragonDropState, { componentClass, currentIndex }) => {
      const page = currentPage(state);
      if (page) {
        const newSection = { id: uuidv4(), component: componentClass };
        page.sections.splice(currentIndex, 0, newSection);
      }
    }
  ),
  produceOn(DesignCanvasActions.deleteComponent, (state: DragonDropState, { pageId, id }) => {
    const componentsPageId = pageId ? pageId : state.currentPageId;
    const page = state.pages.find(page => page.id === componentsPageId);
    if (page) {
      page.sections = page.sections.filter(component => component.id !== id);
    }
  }),
  produceOn(DesignCanvasActions.updateComponent, (state: DragonDropState, { id, inputs }) => {
    const page = currentPage(state);
    if (page) {
      const section = page.sections.find(component => component.id === id);
      if (section) section.inputs = inputs;
    }
  }),
  produceOn(DesignCanvasActions.updatePage, (state: DragonDropState, { newPage }) => {
    const page = state.pages.find(page => page.id === newPage.id);
    if (page) {
      updatePage(page, newPage);
    }
  }),
];

export const selectPages = createSelector(selectDragonDropState, state => state.pages);

export const selectCurrentPageId = createSelector(selectDragonDropState, state => state.currentPageId);

export const selectCurrentPage = createSelector(selectPages, selectCurrentPageId, (pages, currentPageId) =>
  pages.find(page => page.id === currentPageId)
);

export const selectCurrentPageSections = createSelector(selectCurrentPage, page => page?.sections);
