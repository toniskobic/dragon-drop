import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { InitIconsComponent } from 'src/app/components/init-icons/init-icons.component';

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
export class HomeComponent extends InitIconsComponent {
  constructor(
    override matIconRegistry: MatIconRegistry,
    override domSanitizer: DomSanitizer
  ) {
    super(domSanitizer, matIconRegistry, ['dragon-drop-short']);
  }
}
