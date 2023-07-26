import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'drd-editor',
  standalone: true,
  imports: [CommonModule, MatSidenavModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {

}
