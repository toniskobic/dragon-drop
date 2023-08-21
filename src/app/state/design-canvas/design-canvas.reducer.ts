import { moveItemInArray } from '@angular/cdk/drag-drop';
import { createSelector } from '@ngrx/store';
import { produceOn } from 'ngrx-wieder';
import { SectionComponent } from 'src/app/builder-components/sections/section/section.component';
import { MIN_SECTION_DIMENSIONS_PX } from 'src/app/constants/constants';
import { DynamicComponent } from 'src/app/models/dynamic-component.model';
import { ThemeColor } from 'src/app/models/theme-color.enum';
import { v4 as uuidv4 } from 'uuid';

import { DragonDropState } from '../app.reducer';
import { selectDragonDropState } from '../app.selectors';
import { DesignCanvasActions } from './design-canvas.actions';
import { DesignCanvasState } from './design-canvas.model';
import { currentPage, updateElementPosition, updatePage } from './design-canvas.utils';

const pageId = uuidv4();

export const initialDesignCanvasState: DesignCanvasState = {
  pages: [
    {
      id: pageId,
      title: 'Home',
      sections: [
        {
          id: uuidv4(),
          component: SectionComponent,
          selected: false,
          inputs: {
            elements: [{ x: 0, y: 0, rows: 2, cols: 2, id: uuidv4(), data: '<p>Hello World!</p>' }],
            themeColor: ThemeColor.Primary,
            style: { height: `${MIN_SECTION_DIMENSIONS_PX}px` },
          },
        },
        {
          id: uuidv4(),
          component: SectionComponent,
          inputs: { elements: [], themeColor: ThemeColor.Primary, style: { height: `${MIN_SECTION_DIMENSIONS_PX}px` } },
        },
      ],
    },
    {
      id: uuidv4(),
      title: 'About',
      sections: [
        {
          id: uuidv4(),
          component: SectionComponent,
          inputs: { elements: [], themeColor: ThemeColor.Primary, style: { height: `${MIN_SECTION_DIMENSIONS_PX}px` } },
        },
      ],
    },
  ],
  currentPageId: pageId,
};

export const designCanvasUndoRedoAllowedActions = [
  DesignCanvasActions.addPage.type,
  DesignCanvasActions.deletePage.type,
  DesignCanvasActions.addDroppedCurrentPageComponent.type,
  DesignCanvasActions.deleteComponent.type,
  DesignCanvasActions.sortCurrentPageComponents.type,
  DesignCanvasActions.updateComponent.type,
  DesignCanvasActions.updatePage.type,
  DesignCanvasActions.addElement.type,
  DesignCanvasActions.updateElement.type,
  DesignCanvasActions.updateElementPosition.type,
  DesignCanvasActions.deleteElement.type,
];

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
  produceOn(DesignCanvasActions.selectCurrentPageSection, (state: DragonDropState, { sectionId }) => {
    const page = currentPage(state);
    if (page) {
      page.sections.forEach(section => {
        section.selected = section.id === sectionId;
      });
    }
  }),
  produceOn(DesignCanvasActions.unselectCurrentPageSection, (state: DragonDropState) => {
    const page = currentPage(state);
    if (page) {
      page.sections.forEach(section => {
        section.selected = false;
      });
    }
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
        const newSection: DynamicComponent = {
          id: uuidv4(),
          component: componentClass,
          inputs: { themeColor: ThemeColor.Primary, elements: [], style: { height: `${MIN_SECTION_DIMENSIONS_PX}px` } },
        };
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
  produceOn(DesignCanvasActions.addElement, (state: DragonDropState, { sectionId }) => {
    const page = currentPage(state);
    if (page) {
      const section = page.sections.find(component => component.id === sectionId);
      if (section) {
        const element = { x: 0, y: 0, rows: 2, cols: 2, id: uuidv4(), data: '<p>Hello World!</p>' };
        const elements = section.inputs.elements;
        if (elements) {
          elements.push(element);
        } else {
          section.inputs.elements = [element];
        }
      }
    }
  }),
  produceOn(DesignCanvasActions.updateElement, (state: DragonDropState, { id, data }) => {
    const page = currentPage(state);
    if (page) {
      for (const section of page.sections) {
        if (section.inputs) {
          const element = section.inputs.elements?.find(element => element['id'] === id);
          if (element) {
            element['data'] = data;
            break;
          }
        }
      }
    }
  }),
  produceOn(DesignCanvasActions.updateElementPosition, (state: DragonDropState, { id, x, y, rows, cols }) => {
    const page = currentPage(state);
    if (page) {
      for (const section of page.sections) {
        if (section.inputs) {
          const element = section.inputs.elements?.find(element => element['id'] === id);
          if (element) {
            updateElementPosition(element, { x, y, rows, cols });
            break;
          }
        }
      }
    }
  }),
  produceOn(DesignCanvasActions.deleteElement, (state: DragonDropState, { id }) => {
    const page = currentPage(state);
    if (page) {
      for (const section of page.sections) {
        if (section.inputs) {
          const elements = section.inputs.elements;
          if (elements) {
            section.inputs.elements = elements.filter(element => element['id'] !== id);
            break;
          }
        }
      }
    }
  }),
];

export const selectPages = createSelector(selectDragonDropState, state => state.pages);

export const selectCurrentPageId = createSelector(selectDragonDropState, state => state.currentPageId);

export const selectCurrentPage = createSelector(selectPages, selectCurrentPageId, (pages, currentPageId) =>
  pages.find(page => page.id === currentPageId)
);

export const selectCurrentPageSections = createSelector(selectCurrentPage, page => page?.sections);
