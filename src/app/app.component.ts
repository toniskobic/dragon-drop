import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

import ToolbarComponent from './components/toolbar/toolbar.component';
import { fadeAnimation } from './animations/routes.animation';
import { AnimationEvent } from '@angular/animations';
import { Store } from '@ngrx/store';
import { AppState } from './state/editor-state.model';
import { EditorActions } from './state/editor.actions';
import { selectSidebarOpened } from './state/editor.selectors';

@Component({
  selector: 'drd-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterOutlet, ToolbarComponent, MatSidenavModule],
  animations: [fadeAnimation],
})
export class AppComponent {

  opened$ = this.store.select(selectSidebarOpened);

  constructor(
    private store: Store<AppState>,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  animationStarted(event: AnimationEvent) {
    this.renderer.addClass(this.document.body, 'overflow-hidden');
  }

  animationDone(event: AnimationEvent) {
    this.renderer.removeClass(this.document.body, 'overflow-hidden');
  }
}
