import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Color } from 'src/app/models/color.model';

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
};

export const reducer = createReducer(
  initialState,
  on(ThemeSettingsActions.setColor, (state, { key, color }) => {
    if (state.colors[key as keyof typeof state.colors] !== color) {
      return { ...state, colors: { ...state.colors, [key as keyof typeof state.colors]: color } };
    }
    return state;
  }),
  on(FontsApiActions.fontsLoadedSuccess, (state, { fontList }) => ({
    ...state,
    fontList: fontList,
  })),
  on(ThemeSettingsActions.setFont, (state, { key, font }) => {
    if (state.fonts[key as keyof typeof state.fonts] !== font) {
      return { ...state, fonts: { ...state.fonts, [key as keyof typeof state.fonts]: font } };
    }
    return state;
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
} = themeSettingsFeature;
