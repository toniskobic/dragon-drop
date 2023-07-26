import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'drd-toolbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatRippleModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  constructor(private domSanitizer: DomSanitizer, private matIconRegistry: MatIconRegistry) { 
    this.initSvgIcons();
  }

  onClick() {
    //
  }

  private initSvgIcons() {
    const icons = ['dragon-drop-full-white', 'menu'];
    icons.forEach(icon => {
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/svgs/${icon}.svg`)
      );
    });
  }

}
