import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeFontsSelectComponent } from 'src/app/components/theme-fonts-select/theme-fonts-select.component';
import { AppState } from 'src/app/state/app.reducer';

import { ThemeColorsPickerComponent } from '../../components/theme-colors-picker/theme-colors-picker.component';

@Component({
  selector: 'drd-theme-settings-sidenav',
  standalone: true,
  templateUrl: './theme-settings-sidenav.component.html',
  styleUrls: ['./theme-settings-sidenav.component.scss'],
  imports: [CommonModule, MatExpansionModule, TranslateModule, ThemeColorsPickerComponent, ThemeFontsSelectComponent],
})
export class ThemeSettingsSidenavComponent {
  constructor(private store: Store<AppState>) {}
}
