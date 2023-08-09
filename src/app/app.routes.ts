import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, Routes, TitleStrategy } from '@angular/router';
import { environment } from 'src/environments/environment';

import { canActivateGuard } from './guards/can-activate.guard';
import { canDeactivateGuard } from './guards/can-deactivate.guard';
import { EditorComponent } from './pages/editor/editor.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'editor',
    component: EditorComponent,
    title: 'Editor',
    canActivate: [canActivateGuard],
    canDeactivate: [canDeactivateGuard],
  },
  { path: '**', component: NotFoundComponent, title: 'Page Not Found' },
];

@Injectable()
export class CustomTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`${title} | ${environment.appName}`);
    } else {
      this.title.setTitle(`${environment.appName}`);
    }
  }
}
