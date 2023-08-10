import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Color } from 'src/app/models/color.model';
import { WebFontItem } from 'src/app/models/web-font.model';

export const ThemeSettingsActions = createActionGroup({
  source: 'Theme Settings',
  events: {
    'Set Color': props<{ key: string; color: Color }>(),
    'Set Font': props<{ key: string; font: string }>(),
    'Load Fonts': emptyProps(),
  },
});

export const FontsApiActions = createActionGroup({
  source: 'Fonts API',
  events: {
    'Fonts Loaded Success': props<{ fontList: WebFontItem[] }>(),
  },
});
