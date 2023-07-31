import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

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
export class AppComponent {}
