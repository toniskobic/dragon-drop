import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import ToolbarComponent from '../../components/toolbar/toolbar.component';

@Component({
  selector: 'drd-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    ToolbarComponent,
    MatButtonModule,
    RouterModule,
  ],
})
export class HomeComponent {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.initSvgIcons();
  }

  private initSvgIcons() {
    const icons = ['dragon-drop-short'];
    icons.forEach(icon => {
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          `assets/svgs/${icon}.svg`
        )
      );
    });
  }
}
