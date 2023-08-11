import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DynamicElement } from 'src/app/models/dynamic-component.model';

@Component({
  selector: 'drd-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements DynamicElement {
  @ViewChild('element') element: ElementRef<HTMLElement> | null = null;

  @Input() style: object = {};
}
