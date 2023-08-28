import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import ToolbarComponent from 'src/app/components/toolbar/toolbar.component';
import { WebsiteSettingsDialogComponent } from 'src/app/components/website-settings-dialog/website-settings-dialog.component';
import { DynamicContentAreaDirective } from 'src/app/directives/dynamic-content-area.directive';
import { CanDeactivateComponent } from 'src/app/models/can-deactivate.model';
import { AppState } from 'src/app/state/app.reducer';
import { EditorActions } from 'src/app/state/editor/editor.actions';
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
    ToolbarComponent,
    DynamicContentAreaDirective,
    SidenavWrapperComponent,
    DesignCanvasComponent,
    MatDialogModule,
    SpinnerComponent,
  ],
})
export class EditorComponent implements CanDeactivateComponent, OnInit, OnDestroy {
  toolbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--toolbar-height'), 10);

  opened$ = this.store.select(selectSidebarOpened);
  firstLoad$ = this.store.select(selectFirstLoad);

  // isSaved = true;
  firstLoad = true;
  subscriptions: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.firstLoad$.subscribe(firstLoad => {
        this.firstLoad = firstLoad;
      })
    );

    if (this.firstLoad) {
      this.openDialog();
      this.store.dispatch(EditorActions.setFirstLoad({ firstLoad: false }));
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  openDialog(): void {
    this.dialog.open(WebsiteSettingsDialogComponent, { width: '640px' });
  }

  canDeactivate(): boolean {
    // return this.isSaved || confirm(this.translate.instant('EDITOR.ALERTS.UNSAVED_CHANGES') as string);
    return true;
  }
}
