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

  fontChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ThemeSettingsActions.setFont),
        withLatestFrom(this.store.select(selectThemeSettingsState)),
        tap(([action]) => {
          document.documentElement.style.setProperty(`--${action.key}-font-family`, action.font);
          if (action.key !== 'alternative') {
            let link = document.getElementById(`${action.key}-font`) as HTMLLinkElement | null;
            if (!link) {
              link = document.createElement('link');
              link.id = `${action.key}-font`;
              link.rel = 'stylesheet';
              link.href = `https://fonts.googleapis.com/css2?family=${action.font}:wght@300;400;500;600;700&display=swap`;
              document.head.appendChild(link);
            } else {
              link.href = `https://fonts.googleapis.com/css2?family=${action.font}:wght@300;400;500;600;700&display=swap`;
            }
          }
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
            const fonts = response.items.slice(0, 200);
            console.log(fonts);
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
