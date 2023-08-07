import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { firstValueFrom } from 'rxjs';
import { Color } from 'src/app/models/color.model';
import { GoogleFontsService } from 'src/app/services/google-fonts.service';
import { AppState } from 'src/app/state/app.reducer';
import { ThemeSettingsActions } from 'src/app/state/theme-settings/theme-settings.actions';
import { selectColors } from 'src/app/state/theme-settings/theme-settings.reducer';
@Component({
  selector: 'drd-theme-settings-sidenav',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, TranslateModule, MatFormFieldModule, ColorPickerModule, MatInputModule],
  templateUrl: './theme-settings-sidenav.component.html',
  styleUrls: ['./theme-settings-sidenav.component.scss'],
})
export class ThemeSettingsSidenavComponent implements OnInit {
  colors$ = this.store.select(selectColors);

  constructor(
    public viewContainerRef: ViewContainerRef,
    private googleFontsService: GoogleFontsService,
    private store: Store<AppState>
  ) {}

  async ngOnInit() {
    const fonts = await firstValueFrom(this.googleFontsService.getAllFonts());
    console.log(fonts);
  }

  onColorChange(key: string, color: string) {
    this.store.dispatch(ThemeSettingsActions.setColor({ key: key, color: color as Color }));
  }

  identify(index: number) {
    return index;
  }
}
