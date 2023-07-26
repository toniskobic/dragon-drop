import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { selectSidebarOpened } from 'src/app/state/editor.selectors';
import { AppState } from 'src/app/state/editor-state.model';

@Component({
  selector: 'drd-editor',
  standalone: true,
  imports: [CommonModule, MatSidenavModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  opened$ = this.store.select(selectSidebarOpened);

  constructor(private store: Store<AppState>) {}
}
