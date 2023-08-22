import { createSelector } from '@ngrx/store';
import { produceOn } from 'ngrx-wieder';

import { DragonDropState } from '../app.reducer';
import { selectDragonDropState } from '../app.selectors';
import { GlobalSettingsActions } from './global-settings.actions';
import { GlobalSettingsState } from './global-settings.model';

export const initialGlobalSettingsState: GlobalSettingsState = {
  websiteTitle: '',
  favicon: null,
};

export const globalSettingsUndoRedoAllowedActions = [GlobalSettingsActions.setWebsiteTitle.type];

export const globalSettingsOnActions = [
  produceOn(GlobalSettingsActions.setWebsiteTitle, (state: DragonDropState, { websiteTitle }) => {
    state.websiteTitle = websiteTitle;
  }),
];

export const selectGlobalSettingsState = createSelector(selectDragonDropState, (state): GlobalSettingsState => {
  return { websiteTitle: state.websiteTitle, favicon: state.favicon };
});

export const selectWebsiteTitle = createSelector(selectDragonDropState, state => state.websiteTitle);

export const selectFavicon = createSelector(selectDragonDropState, state => state.favicon);
