import { Injectable } from '@angular/core';

import { from, EMPTY } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppState } from './editor-state.model';

@Injectable()
export class EditorEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
  ) { }
}
