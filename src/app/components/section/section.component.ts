import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ResizableModule } from 'angular-resizable-element';
import { DynamicElement } from 'src/app/models/dynamic-component.model';

@Component({
  selector: 'drd-section',
  standalone: true,
  imports: [CommonModule, ResizableModule],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements DynamicElement {
  @ViewChild('element') element: ElementRef<HTMLElement> | null = null;

  @Input() title = 'Default title';

  @Input() text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

  @Input() style: object = {};
}
