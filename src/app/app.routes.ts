import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, Routes, TitleStrategy } from '@angular/router';
import { environment } from 'src/environments/environment';

import { EditorComponent } from './pages/editor/editor.component';

export const routes: Routes = [
  { path: 'editor', component: EditorComponent, title: 'Editor' },
  { path: '', redirectTo: '/editor', pathMatch: 'full' },
  { path: '**', redirectTo: '/editor' },
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
