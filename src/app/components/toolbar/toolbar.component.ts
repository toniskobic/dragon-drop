import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';
import { Viewport } from 'src/app/models/viewport.enum';
import { UtilsService } from 'src/app/services/utils.service';
import { EditorActions } from 'src/app/state/editor.actions';
import { selectCurrentPage, selectViewport } from 'src/app/state/editor.selectors';
import { AppState } from 'src/app/state/editor-state.model';
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
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export default class ToolbarComponent {
  readonly Viewport = Viewport;

  rippleColor = getComputedStyle(document.documentElement).getPropertyValue('--rich-black-lighter-ripple');

  currentViewport$ = this.store.select(selectViewport);
  currentPage$ = this.store.select(selectCurrentPage);
  isMobile$ = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(map(result => result.matches));

  constructor(
    private store: Store<AppState>,
    private utilsService: UtilsService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.utilsService.initSvgIcons(['dragon-drop-full-white', 'dragon-drop-short', 'menu', 'mobile', 'desktop']);
  }

  onViewportChange($event: MatButtonToggleChange) {
    this.store.dispatch(EditorActions.setViewport({ viewport: $event.value as Viewport }));
  }

  onMenuClick() {
    this.store.dispatch(EditorActions.setSidebarOpened({}));
  }
}
