import { moveItemInArray } from '@angular/cdk/drag-drop';
import { createSelector } from '@ngrx/store';
import { produceOn } from 'ngrx-wieder';
import { HeaderComponent } from 'src/app/builder-components/headers/header/header.component';
import { SectionComponent } from 'src/app/builder-components/sections/section/section.component';
import { MIN_SECTION_DIMENSIONS_PX } from 'src/app/constants/constants';
import { DynamicComponent } from 'src/app/models/dynamic-component.model';
import { FontFamily } from 'src/app/models/font-family.enum';
import { ThemeColor } from 'src/app/models/theme-color.enum';
import { v4 as uuidv4 } from 'uuid';

import { DragonDropState } from '../app.reducer';
import { selectDragonDropState } from '../app.selectors';
import {
  DesignCanvasActions,
  DesignCanvasElementActions,
  DesignCanvasPageActions,
  DesignCanvasSectionActions,
} from './design-canvas.actions';
import { DesignCanvasState } from './design-canvas.model';
import { currentPage, updateElementPosition, updatePage } from './design-canvas.utils';

const pageId = uuidv4();

export const initialDesignCanvasState: DesignCanvasState = {
  canvasWidth: null,
  pages: [
    {
      id: pageId,
      title: 'Home',
      sections: [
        {
          id: uuidv4(),
          component: HeaderComponent,
          selected: false,
          inputs: {
            themeColor: ThemeColor.Primary,
            themeFontFamily: FontFamily.Primary,
            style: { ['min-height']: `${MIN_SECTION_DIMENSIONS_PX}px` },
          },
        },
        {
          id: uuidv4(),
          component: SectionComponent,
          selected: false,
          inputs: {
            elements: [
              { x: 0, y: 0, rows: 3, cols: 10, id: uuidv4(), data: '<h2 style="text-align:center;">Lorem ipsum!</h2>' },
            ],
            themeColor: ThemeColor.Primary,
            themeFontFamily: FontFamily.Primary,
            style: { ['min-height']: `${MIN_SECTION_DIMENSIONS_PX * 2}px` },
          },
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
          inputs: {
            elements: [],
            themeColor: ThemeColor.Secondary,
            themeFontFamily: FontFamily.Primary,
            style: { ['min-height']: `${MIN_SECTION_DIMENSIONS_PX}px` },
          },
        },
      ],
    },
  ],
  currentPageId: pageId,
};

export const designCanvasUndoRedoAllowedActions = [
  DesignCanvasPageActions.addPage.type,
  DesignCanvasPageActions.updatePage.type,
  DesignCanvasPageActions.deletePage.type,
  DesignCanvasSectionActions.addDroppedCurrentPageSection.type,
  DesignCanvasSectionActions.updateSection.type,
  DesignCanvasSectionActions.sortCurrentPageSections.type,
  DesignCanvasSectionActions.deleteSection.type,
  DesignCanvasElementActions.addElement.type,
  DesignCanvasElementActions.updateElement.type,
  DesignCanvasElementActions.updateElementPosition.type,
  DesignCanvasElementActions.deleteElement.type,
];

export const designCanvasOnActions = [
  produceOn(DesignCanvasActions.canvasWidthChanged, (state: DragonDropState, { width }) => {
    state.canvasWidth = width;
  }),
  produceOn(DesignCanvasPageActions.addPage, (state: DragonDropState) => {
    state.pages.push({ id: uuidv4(), title: 'New Page', sections: [] });
  }),
  produceOn(DesignCanvasPageActions.setCurrentPage, (state: DragonDropState, { pageId }) => {
    state.currentPageId = pageId;
  }),
  produceOn(DesignCanvasPageActions.deletePage, (state: DragonDropState, { pageId }) => {
    const pages = state.pages.filter(page => page.id !== pageId);
    state.pages = pages;
    state.currentPageId = state.currentPageId === pageId ? (pages.length ? pages[0]?.id : '') : state.currentPageId;
  }),
  produceOn(DesignCanvasSectionActions.selectCurrentPageSection, (state: DragonDropState, { sectionId }) => {
    const page = currentPage(state);
    if (page) {
      page.sections.forEach(section => {
        section.selected = section.id === sectionId;
      });
    }
  }),
  produceOn(DesignCanvasSectionActions.unselectCurrentPageSection, (state: DragonDropState) => {
    const page = currentPage(state);
    if (page) {
      page.sections.forEach(section => {
        section.selected = false;
      });
    }
  }),
  produceOn(
    DesignCanvasSectionActions.sortCurrentPageSections,
    (state: DragonDropState, { previousIndex, currentIndex }) => {
      const page = currentPage(state);
      if (page) {
        moveItemInArray(page.sections, previousIndex, currentIndex);
      }
    }
  ),
  produceOn(
    DesignCanvasSectionActions.addDroppedCurrentPageSection,
    (state: DragonDropState, { sectionClass, currentIndex }) => {
      const page = currentPage(state);
      if (page) {
        const newSection: DynamicComponent = {
          id: uuidv4(),
          component: sectionClass,
          inputs: {
            themeColor: ThemeColor.Primary,
            themeFontFamily: FontFamily.Primary,
            elements: [],
            style: { ['min-height']: `${MIN_SECTION_DIMENSIONS_PX}px` },
          },
        };
        page.sections.splice(currentIndex, 0, newSection);
      }
    }
  ),
  produceOn(DesignCanvasSectionActions.deleteSection, (state: DragonDropState, { pageId, id }) => {
    const componentsPageId = pageId ? pageId : state.currentPageId;
    const page = state.pages.find(page => page.id === componentsPageId);
    if (page) {
      page.sections = page.sections.filter(component => component.id !== id);
    }
  }),
  produceOn(DesignCanvasSectionActions.updateSection, (state: DragonDropState, { id, inputs }) => {
    const page = currentPage(state);
    if (page) {
      const section = page.sections.find(component => component.id === id);
      if (section) section.inputs = inputs;
    }
  }),
  produceOn(DesignCanvasPageActions.updatePage, (state: DragonDropState, { newPage }) => {
    const page = state.pages.find(page => page.id === newPage.id);
    if (page) {
      updatePage(page, newPage);
    }
  }),
  produceOn(DesignCanvasElementActions.addElement, (state: DragonDropState, { sectionId }) => {
    const page = currentPage(state);
    if (page) {
      const section = page.sections.find(component => component.id === sectionId);
      if (section) {
        const element = { x: 0, y: 0, rows: 1, cols: 1, id: uuidv4(), data: '<p>Hello World!</p>' };
        const elements = section.inputs.elements;
        if (elements) {
          elements.push(element);
        } else {
          section.inputs.elements = [element];
        }
      }
    }
  }),
  produceOn(DesignCanvasElementActions.updateElement, (state: DragonDropState, { id, data }) => {
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
  produceOn(DesignCanvasElementActions.updateElementPosition, (state: DragonDropState, { id, x, y, rows, cols }) => {
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
  produceOn(DesignCanvasElementActions.deleteElement, (state: DragonDropState, { id }) => {
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

export const selectCanvasWidth = createSelector(selectDragonDropState, state => state.canvasWidth);

export const selectPages = createSelector(selectDragonDropState, state => state.pages);

export const selectCurrentPageId = createSelector(selectDragonDropState, state => state.currentPageId);

export const selectCurrentPage = createSelector(selectPages, selectCurrentPageId, (pages, currentPageId) =>
  pages.find(page => page.id === currentPageId)
);

export const selectCurrentPageSections = createSelector(selectCurrentPage, page => page?.sections);
