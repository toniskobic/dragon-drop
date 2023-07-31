import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { InitIconsComponent } from 'src/app/components/init-icons/init-icons.component';

@Component({
  selector: 'drd-not-found',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent extends InitIconsComponent {
  constructor(
    override matIconRegistry: MatIconRegistry,
    override domSanitizer: DomSanitizer
  ) {
    super(domSanitizer, matIconRegistry, ['dragon-drop-full-black']);
  }
}
