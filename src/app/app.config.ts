import { HttpClientModule } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  MAT_RIPPLE_GLOBAL_OPTIONS,
  RippleGlobalOptions,
} from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { CustomTitleStrategy, routes } from './app.routes';
import { EditorEffects } from './state/editor.effects';
import { editorReducer } from './state/editor.reducer';

const globalRippleConfig: RippleGlobalOptions = {
  disabled: false,
  animation: {
    enterDuration: 300,
    exitDuration: 450,
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: TitleStrategy,
      useClass: CustomTitleStrategy,
    },
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
    provideStore({ editor: editorReducer }),
    provideStoreDevtools(),
    provideEffects([EditorEffects]),
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig },
  ],
};
