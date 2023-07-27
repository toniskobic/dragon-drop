import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { selectSidebarOpened } from 'src/app/state/editor.selectors';
import { AppState } from 'src/app/state/editor-state.model';

@Component({
  selector: 'drd-editor',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatRippleModule,
  ],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  rippleColor = getComputedStyle(document.documentElement).getPropertyValue(
    '--rich-black-lighter-ripple'
  );

  opened$ = this.store.select(selectSidebarOpened);

  listItems = [
    { title: 'Pages', icon: 'pages' },
    { title: 'Add Section', icon: 'add' },
    { title: 'Theme Settings', icon: 'theme-settings' },
  ];

  constructor(
    private store: Store<AppState>,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.initSvgIcons();
  }

  private initSvgIcons() {
    this.listItems.forEach(item => {
      this.matIconRegistry.addSvgIcon(
        item.icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          `assets/svgs/${item.icon}.svg`
        )
      );
    });
  }
}
