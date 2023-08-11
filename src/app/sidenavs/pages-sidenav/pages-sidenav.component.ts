import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { UtilsService } from 'src/app/services/utils.service';
import { AppState } from 'src/app/state/app.reducer';
import { selectPages } from 'src/app/state/design-canvas/design-canvas.reducer';

@Component({
  selector: 'drd-pages-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    TranslateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
  ],
  templateUrl: './pages-sidenav.component.html',
  styleUrls: ['./pages-sidenav.component.scss'],
})
export class PagesSidenavComponent {
  pages$ = this.store.select(selectPages);

  constructor(
    private store: Store<AppState>,
    private utilsService: UtilsService
  ) {
    this.utilsService.initSvgIcons(['check', 'close', 'remove']);
  }

  removePage(pageId: string) {
    console.log(pageId);
    // this.store.dispatch();
  }
}
