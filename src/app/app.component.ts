import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { fadeAnimation } from './animations/routes.animation';
import ToolbarComponent from './components/toolbar/toolbar.component';

@Component({
  selector: 'drd-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterOutlet, ToolbarComponent, MatSidenavModule],
  animations: [fadeAnimation],
})
export class AppComponent {
  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }
}
