import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'drd-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {}
