import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'drd-element-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './element-context-menu.component.html',
  styleUrls: ['./element-context-menu.component.scss'],
})
export class ElementContextMenuComponent {
  @Input() id?: string;
}
