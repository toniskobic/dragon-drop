import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs';

import { AppState } from '../app.reducer';
import { ThemeSettingsActions } from './theme-settings.actions';
import { selectThemeSettingsState } from './theme-settings.reducer';

@Injectable()
export class ThemeSettingsEffects {
  colorChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ThemeSettingsActions.setColor),
        withLatestFrom(this.store.select(selectThemeSettingsState)),
        tap(([action]) => {
          document.documentElement.style.setProperty(`--${action.key}-color`, action.color);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>
  ) {}
}
