import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { UtilsService } from 'src/app/services/utils.service';
import { AppState } from 'src/app/state/app.reducer';
import { DesignCanvasElementActions } from 'src/app/state/design-canvas/design-canvas.actions';

@Component({
  selector: 'drd-element-context-menu',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatRippleModule, TranslateModule],
  templateUrl: './element-context-menu.component.html',
  styleUrls: ['./element-context-menu.component.scss'],
})
export class ElementContextMenuComponent {
  rippleColor = getComputedStyle(document.documentElement).getPropertyValue('--rich-black-light-ripple');

  @Input() id?: string;

  constructor(
    private utilsService: UtilsService,
    private store: Store<AppState>
  ) {
    this.utilsService.initSvgIcons(['delete']);
  }

  deleteElement() {
    this.store.dispatch(DesignCanvasElementActions.deleteElement({ id: this.id || '' }));
  }
}
