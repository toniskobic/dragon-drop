import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'ngx-color-picker';
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
    ColorPickerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  templateUrl: './pages-sidenav.component.html',
  styleUrls: ['./pages-sidenav.component.scss'],
})
export class PagesSidenavComponent {
  pages$ = this.store.select(selectPages);

  constructor(private store: Store<AppState>) {}
}
