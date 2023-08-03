import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import ToolbarComponent from 'src/app/components/toolbar/toolbar.component';
import { DynamicContentAreaDirective } from 'src/app/directives/dynamic-content-area.directive';
import { CanDeactivateComponent } from 'src/app/models/can-deactivate.model';
import { selectSidebarOpened } from 'src/app/state/editor.selectors';
import { AppState } from 'src/app/state/editor-state.model';

import { DesignCanvasComponent } from '../../components/design-canvas/design-canvas.component';
import { SidenavWrapperComponent } from '../../sidenavs/sidenav-wrapper/sidenav-wrapper.component';

@Component({
  selector: 'drd-editor',
  standalone: true,
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatRippleModule,
    ToolbarComponent,
    DynamicContentAreaDirective,
    MatButtonModule,
    TranslateModule,
    SidenavWrapperComponent,
    DesignCanvasComponent,
  ],
})
export class EditorComponent implements CanDeactivateComponent {
  toolbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--toolbar-height'), 10);

  isSaved = true;
  opened$ = this.store.select(selectSidebarOpened);

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService
  ) {}

  canDeactivate(): boolean {
    return this.isSaved || confirm(this.translate.instant('EDITOR.ALERTS.UNSAVED_CHANGES') as string);
  }

  @HostListener('window:beforeunload', ['$event'])
  confirmExit(event: BeforeUnloadEvent) {
    if (this.isSaved) return true;

    event.preventDefault();
    return (event.returnValue = '');
  }
}
