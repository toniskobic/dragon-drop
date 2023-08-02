import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ResizableModule } from 'angular-resizable-element';

@Component({
  selector: 'drd-section',
  standalone: true,
  imports: [CommonModule, ResizableModule],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent {}
