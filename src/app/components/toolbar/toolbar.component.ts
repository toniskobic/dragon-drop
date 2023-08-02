import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { UtilsService } from 'src/app/services/utils.service';
import { EditorActions } from 'src/app/state/editor.actions';
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
  rippleColor = getComputedStyle(document.documentElement).getPropertyValue('--rich-black-lighter-ripple');

  viewportModes = { desktop: 'desktop', mobile: 'mobile' };

  constructor(
    private store: Store<AppState>,
    private utilsService: UtilsService
  ) {
    this.utilsService.initSvgIcons(['dragon-drop-full-white', 'menu', 'mobile', 'desktop']);
  }

  onClick() {
    this.store.dispatch(EditorActions.setSidebarOpened({}));
  }
}
