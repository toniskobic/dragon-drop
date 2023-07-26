import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import {MatSidenavModule} from '@angular/material/sidenav';

@Component({
    selector: 'drd-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [CommonModule, RouterOutlet, ToolbarComponent, MatSidenavModule],
})
export class AppComponent {
}
