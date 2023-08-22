import { createActionGroup, props } from '@ngrx/store';

export const GlobalSettingsActions = createActionGroup({
  source: 'Global Settings',
  events: {
    'Set Website Title': props<{ websiteTitle: string }>(),
    'Set Favicon': props<{ favicon: File | null }>(),
    'Set Logo': props<{ logo: File | null }>(),
  },
});
