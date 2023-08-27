import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import ToolbarComponent from 'src/app/components/toolbar/toolbar.component';
import { WebsiteSettingsDialogComponent } from 'src/app/components/website-settings-dialog/website-settings-dialog.component';
import { DynamicContentAreaDirective } from 'src/app/directives/dynamic-content-area.directive';
import { CanDeactivateComponent } from 'src/app/models/can-deactivate.model';
import { AppState } from 'src/app/state/app.reducer';
import { selectFirstLoad, selectSidebarOpened } from 'src/app/state/editor/editor.reducer';

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
    ToolbarComponent,
    DynamicContentAreaDirective,
    MatButtonModule,
    TranslateModule,
    SidenavWrapperComponent,
    DesignCanvasComponent,
    MatDialogModule,
  ],
})
export class EditorComponent implements CanDeactivateComponent, OnInit {
  toolbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--toolbar-height'), 10);

  // isSaved = true;s
  opened$ = this.store.select(selectSidebarOpened);
  firstLoad$ = this.store.select(selectFirstLoad);

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.openDialog();
  }

  openDialog(): void {
    this.dialog.open(WebsiteSettingsDialogComponent, { width: '640px' });
  }

  canDeactivate(): boolean {
    // return this.isSaved || confirm(this.translate.instant('EDITOR.ALERTS.UNSAVED_CHANGES') as string);
    return true;
  }
}
