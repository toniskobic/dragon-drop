import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';
import { Viewport } from 'src/app/models/viewport.enum';
import { UtilsService } from 'src/app/services/utils.service';
import { AppActions } from 'src/app/state/app.actions';
import { AppState, selectCanRedo, selectCanUndo } from 'src/app/state/app.reducer';
import { DesignCanvasPageActions } from 'src/app/state/design-canvas/design-canvas.actions';
import { selectCurrentPageId, selectPages } from 'src/app/state/design-canvas/design-canvas.reducer';
import { EditorActions } from 'src/app/state/editor/editor.actions';
import { selectViewport } from 'src/app/state/editor/editor.reducer';

@Component({
  selector: 'drd-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    RouterModule,
    TranslateModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export default class ToolbarComponent {
  readonly Viewport = Viewport;

  rippleColor = getComputedStyle(document.documentElement).getPropertyValue('--rich-black-light-ripple');

  canUndo$ = this.store.select(selectCanUndo());
  canRedo$ = this.store.select(selectCanRedo());

  currentViewport$ = this.store.select(selectViewport);
  currentPageId$ = this.store.select(selectCurrentPageId);
  pages$ = this.store.select(selectPages);

  isMobile$ = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(map(result => result.matches));

  constructor(
    private store: Store<AppState>,
    private utilsService: UtilsService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.utilsService.initSvgIcons([
      'dragon-drop-full-white',
      'dragon-drop-short',
      'menu',
      'mobile',
      'desktop',
      'undo',
      'redo',
    ]);
  }

  onPageSelect(event: MatSelectChange) {
    const pageId = event.value as string;
    this.store.dispatch(DesignCanvasPageActions.setCurrentPage({ pageId: pageId }));
    event.source.close();
  }

  onViewportChange($event: MatButtonToggleChange) {
    this.store.dispatch(EditorActions.setViewport({ viewport: $event.value as Viewport }));
  }

  onMenuClick() {
    this.store.dispatch(EditorActions.setSidebarOpened({}));
  }

  undo() {
    this.store.dispatch(AppActions.undo());
  }

  redo() {
    this.store.dispatch(AppActions.redo());
  }
}
