import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { EditorActions } from 'src/app/state/editor.actions';
import { AppState } from 'src/app/state/editor-state.model';

import { InitIconsComponent } from '../init-icons/init-icons.component';

@Component({
  selector: 'drd-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    RouterModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export default class ToolbarComponent extends InitIconsComponent {
  rippleColor = getComputedStyle(document.documentElement).getPropertyValue(
    '--rich-black-lighter-ripple'
  );

  constructor(
    private store: Store<AppState>,
    override domSanitizer: DomSanitizer,
    override matIconRegistry: MatIconRegistry
  ) {
    super(domSanitizer, matIconRegistry, [
      'dragon-drop-full-white',
      'menu',
      'mobile',
      'desktop',
    ]);
  }

  onClick() {
    this.store.dispatch(EditorActions.setSidebarOpened({}));
  }
}
