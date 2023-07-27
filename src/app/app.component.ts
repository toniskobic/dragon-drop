import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

import ToolbarComponent from './components/toolbar/toolbar.component';
import { fadeAnimation } from './animations/routes.animation';

@Component({
  selector: 'drd-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterOutlet, ToolbarComponent, MatSidenavModule],
  animations: [fadeAnimation],
})
export class AppComponent {}
