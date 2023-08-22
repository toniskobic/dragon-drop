import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class GlobalSettingsEffects {
  constructor(private actions$: Actions) {}
}
