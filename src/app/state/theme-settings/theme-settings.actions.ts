import { createActionGroup, props } from '@ngrx/store';
import { Color } from 'src/app/models/color.model';

export const ThemeSettingsActions = createActionGroup({
  source: 'Theme Settings',
  events: { 'Set Color': props<{ key: string; color: Color }>() },
});
