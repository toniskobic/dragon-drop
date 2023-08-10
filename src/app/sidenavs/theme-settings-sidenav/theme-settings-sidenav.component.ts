import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { debounceTime, map, Observable, of, startWith, Subscription, switchMap, take } from 'rxjs';
import { ALTERNATIVE_FONT_FAMILIES } from 'src/app/constants/constants';
import { Color } from 'src/app/models/color.model';
import { AppState } from 'src/app/state/app.reducer';
import { ThemeSettingsActions } from 'src/app/state/theme-settings/theme-settings.actions';
import { selectColors, selectFontList, selectFonts } from 'src/app/state/theme-settings/theme-settings.reducer';

@Component({
  selector: 'drd-theme-settings-sidenav',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatExpansionModule,
    TranslateModule,
    MatFormFieldModule,
    ColorPickerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    ScrollingModule,
    LetDirective,
  ],
  templateUrl: './theme-settings-sidenav.component.html',
  styleUrls: ['./theme-settings-sidenav.component.scss'],
})
export class ThemeSettingsSidenavComponent implements OnInit, OnDestroy {
  itemSize = 56;
  panelHeight = '224px';

  colors$ = this.store.select(selectColors);
  fonts$ = this.store.select(selectFonts);

  fontList$ = this.store.select(selectFontList);
  altFonts$ = of(ALTERNATIVE_FONT_FAMILIES);

  formControls: { [key: string]: FormControl<string | null> } = {
    primary: new FormControl(''),
    secondary: new FormControl(''),
    alternative: new FormControl(''),
  };

  filteredFonts$: { [key: string]: Observable<string[] | undefined> } = {
    primary: this.fontList$,
    secondary: this.fontList$,
    alternative: this.altFonts$,
  };

  subscriptions: Subscription[] = [];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.fonts$.pipe(take(1)).subscribe(value => {
        Object.entries(value).forEach(([key, value]) => {
          this.formControls[key].setValue(value);
        });
      })
    );

    Object.keys(this.formControls).forEach(key => {
      this.filteredFonts$[key] = this.formControls[key].valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        switchMap(value => {
          const list$ = key !== 'alternative' ? this.fontList$ : this.altFonts$;
          return value
            ? list$.pipe(map(fonts => fonts?.filter(font => font.toLowerCase().includes(value.toLowerCase()))))
            : list$;
        })
      );
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  onColorChange(key: string, color: string) {
    this.store.dispatch(ThemeSettingsActions.setColor({ key: key, color: color as Color }));
  }

  setFont(event: MatAutocompleteSelectedEvent, key: string) {
    const value = event.option.value as string;
    this.store.dispatch(ThemeSettingsActions.setFont({ key: key, font: value }));
  }

  identify(index: number) {
    return index;
  }

  returnZero() {
    return 0;
  }
}
