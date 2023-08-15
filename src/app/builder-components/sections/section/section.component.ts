import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ResizableModule } from 'angular-resizable-element';
import { RichTextEditorComponent } from 'src/app/components/rich-text-editor/rich-text-editor.component';
import { DynamicComponentType, DynamicElement } from 'src/app/models/dynamic-component.model';

@Component({
  selector: 'drd-section',
  standalone: true,
  imports: [CommonModule, ResizableModule, RichTextEditorComponent],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements DynamicComponentType {
  @Input() style: object = {};

  @Input() elements: DynamicElement[] = [];

  get backgroundColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
  }
}
