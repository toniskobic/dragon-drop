import { createSelector } from '@ngrx/store';
import { produceOn } from 'ngrx-wieder';
import { Color } from 'src/app/models/color.model';

import { DragonDropState } from '../app.reducer';
import { selectDragonDropState } from '../app.selectors';
import { FontsApiActions, ThemeSettingsActions } from './theme-settings.actions';
import { ThemeSettingsState } from './theme-settings.model';

const primaryFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--primary-font-family');
const secondaryFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--secondary-font-family');
const alternativeFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--alternative-font-family');

const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') as Color;
const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color') as Color;
const tertiaryColor = getComputedStyle(document.documentElement).getPropertyValue('--tertiary-color') as Color;

export const initialThemeSettingsState: ThemeSettingsState = {
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
};

export const themeSettingsUndoRedoAllowedActions = [
  ThemeSettingsActions.setFont.type,
  ThemeSettingsActions.setColor.type,
];

export const themeSettingsOnActions = [
  produceOn(ThemeSettingsActions.setColor, (state: DragonDropState, { key, color }) => {
    if (state.colors[key as keyof typeof state.colors] !== color) {
      state.colors[key as keyof typeof state.colors] = color;
    }
  }),
  produceOn(FontsApiActions.fontsLoadedSuccess, (state: DragonDropState, { fontList }) => {
    state.fontList = fontList;
  }),
  produceOn(ThemeSettingsActions.setFont, (state: DragonDropState, { key, font }) => {
    if (state.fonts[key as keyof typeof state.fonts] !== font) {
      state.fonts[key as keyof typeof state.fonts] = font;
    }
  }),
];

export const selectThemeSettingsState = createSelector(selectDragonDropState, state => {
  state.colors, state.fonts, state.fontList;
});

export const selectFonts = createSelector(selectDragonDropState, state => state.fonts);

export const selectAlternativeFont = createSelector(selectFonts, fonts => fonts.alternative);

export const selectFontList = createSelector(selectDragonDropState, state => state.fontList?.map(font => font.family));

export const selectColors = createSelector(selectDragonDropState, state => state.colors);
