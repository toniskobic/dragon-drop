import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, from, map, switchMap, tap, withLatestFrom } from 'rxjs';
import { GoogleFontsService } from 'src/app/services/google-fonts.service';

import { AppState } from '../app.reducer';
import { FontsApiActions, ThemeSettingsActions } from './theme-settings.actions';
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

  loadFonts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThemeSettingsActions.loadFonts),
      switchMap(() =>
        from(this.googleFontsService.getAllFonts()).pipe(
          map(response => {
            const fonts = response.items;
            return FontsApiActions.fontsLoadedSuccess({ fontList: fonts });
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private googleFontsService: GoogleFontsService
  ) {}
}
