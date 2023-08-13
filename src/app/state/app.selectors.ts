import { createSelector } from '@ngrx/store';

import { AppState } from './app.reducer';

export const selectDragonDropState = (state: AppState) => state.dragonDrop;

export const selectState = createSelector(selectDragonDropState, state => state);
