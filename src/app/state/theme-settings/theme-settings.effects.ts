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
            return FontsApiActions.fontsLoadedSuccess({ fontList: fonts });
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  // undoRedo$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(AppActions.undo, AppActions.redo),
  //       withLatestFrom(this.store.select(selectHistories)),
  //       tap(([action, histories]) => {
  //         if (!histories['DEFAULT']) return;
  //         const historyProp = action.type === AppActions.undo.type ? 'undone' : 'undoable';
  //         const actionType = histories['DEFAULT'][historyProp][0].actions[0].type;
  //         if (actionType === ThemeSettingsActions.setColor.type || actionType === ThemeSettingsActions.setFont.type) {
  //           const patch = action.type === AppActions.undo.type ? 'inversePatches' : 'patches';

  //           const key = histories['DEFAULT'][historyProp][0].actions[0]['key' as keyof Action];
  //           const value = histories['DEFAULT'][historyProp][0].patches[patch][0].value as string;

  //           switch (actionType) {
  //             case ThemeSettingsActions.setColor.type: {
  //               document.documentElement.style.setProperty(`--${key}-color`, value);
  //               break;
  //             }
  //             case ThemeSettingsActions.setFont.type: {
  //               document.documentElement.style.setProperty(`--${key}-font-family`, value);
  //               if (key !== 'alternative') {
  //                 const link = document.getElementById(`${key}-font`) as HTMLLinkElement | null;
  //                 if (link) {
  //                   link.href = `https://fonts.googleapis.com/css2?family=${value}:wght@300;400;500;600;700&display=swap`;
  //                 }
  //                 break;
  //               }
  //             }
  //           }
  //         }
  //       })
  //     ),
  //   { dispatch: false }
  // );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private googleFontsService: GoogleFontsService
  ) {}
}
