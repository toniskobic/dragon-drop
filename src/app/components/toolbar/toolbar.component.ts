import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/editor-state.model';
import { EditorActions } from 'src/app/state/editor.actions';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'drd-toolbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatRippleModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  constructor(
    private store: Store<AppState>,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {
    this.initSvgIcons();
  }

  onClick() {
    this.store.dispatch(EditorActions.setSidebarOpened({}));
  }

  private initSvgIcons() {
    const icons = ['dragon-drop-full-white', 'menu'];
    icons.forEach((icon) => {
      this.matIconRegistry.addSvgIcon(icon, this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/svgs/${icon}.svg`));
    });
  }
}
