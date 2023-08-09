import { inject } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

import { AppState } from '../state/app.reducer';
import { ThemeSettingsActions } from '../state/theme-settings/theme-settings.actions';
import { selectFontList } from '../state/theme-settings/theme-settings.reducer';

export function canActivateGuard(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  const store = inject(Store<AppState>);
  const fontList$ = store.select(selectFontList);

  return fontList$.pipe(
    map(fontList => {
      if (!fontList) {
        store.dispatch(ThemeSettingsActions.loadFonts());
      }

      return true;
    })
  );
}
