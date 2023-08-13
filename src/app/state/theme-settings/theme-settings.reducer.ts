import { createFeature, createSelector } from '@ngrx/store';
import { createHistorySelectors, initialUndoRedoState, produceOn, undoRedo } from 'ngrx-wieder';
import { Color } from 'src/app/models/color.model';

import { AppActions } from '../app.actions';
import { AppState } from '../app.reducer';
import { FontsApiActions, ThemeSettingsActions } from './theme-settings.actions';
import { ThemeSettingsState } from './theme-settings.model';

const primaryFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--primary-font-family');
const secondaryFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--secondary-font-family');
const alternativeFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--alternative-font-family');

const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') as Color;
const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color') as Color;
const tertiaryColor = getComputedStyle(document.documentElement).getPropertyValue('--tertiary-color') as Color;

export const themeSettingsFeatureKey = 'themeSettings';

export const initialState: ThemeSettingsState = {
  colors: {
    primary: primaryColor,
    secondary: secondaryColor,
    tertiary: tertiaryColor,
  },
  fonts: {
    primary: primaryFontFamily,
    secondary: secondaryFontFamily,
    alternative: alternativeFontFamily,
  },
  fontList: undefined,
  ...initialUndoRedoState,
};

// initialize ngrx-wieder with custom config
const { createUndoRedoReducer } = undoRedo({
  allowedActionTypes: [ThemeSettingsActions.setFont.type, ThemeSettingsActions.setColor.type],
  mergeActionTypes: [ThemeSettingsActions.setColor.type],
  breakMergeActionType: AppActions.breakMerge.type,
  trackActionPayload: true,
});

export const reducer = createUndoRedoReducer(
  initialState,
  produceOn(ThemeSettingsActions.setColor, (state, { key, color }) => {
    if (state.colors[key as keyof typeof state.colors] !== color) {
      state.colors[key as keyof typeof state.colors] = color;
    }
  }),
  produceOn(FontsApiActions.fontsLoadedSuccess, (state, { fontList }) => {
    state.fontList = fontList;
  }),
  produceOn(ThemeSettingsActions.setFont, (state, { key, font }) => {
    if (state.fonts[key as keyof typeof state.fonts] !== font) {
      state.fonts[key as keyof typeof state.fonts] = font;
    }
  })
);

export const themeSettingsFeature = createFeature({
  name: themeSettingsFeatureKey,
  reducer,
  extraSelectors: ({ selectThemeSettingsState, selectFonts }) => ({
    selectPrimarySecondaryFonts: createSelector(selectFonts, fonts => {
      return { primary: fonts.primary, secondary: fonts.secondary };
    }),
    selectAlternativeFont: createSelector(selectFonts, fonts => fonts.alternative),
    selectFontList: createSelector(selectThemeSettingsState, fonts => fonts.fontList?.map(font => font.family)),
  }),
});

export const {
  selectThemeSettingsState,
  selectColors,
  selectFonts,
  selectFontList,
  selectPrimarySecondaryFonts,
  selectAlternativeFont,
  selectHistories,
} = themeSettingsFeature;

export const { selectCanUndo: canUndoThemeSettings, selectCanRedo: canRedoThemeSettings } = createHistorySelectors<
  AppState,
  ThemeSettingsState
>(state => state[themeSettingsFeatureKey]);
