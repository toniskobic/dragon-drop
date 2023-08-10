import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { DynamicElement } from 'src/app/models/dynamic-component.model';
import { AppState } from 'src/app/state/app.reducer';
import { selectPages } from 'src/app/state/design-canvas/design-canvas.reducer';

@Component({
  selector: 'drd-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements DynamicElement {
  @ViewChild('element') element: ElementRef<HTMLElement> | null = null;

  @Input() style: object = {};

  pages$ = this.store.select(selectPages);
  constructor(private store: Store<AppState>) {}
}
