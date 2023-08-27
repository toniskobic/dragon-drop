import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { debounceTime, Subject, Subscription, tap } from 'rxjs';
import { Color } from 'src/app/models/color.model';
import { AppActions } from 'src/app/state/app.actions';
import { AppState } from 'src/app/state/app.reducer';
import { ThemeSettingsActions } from 'src/app/state/theme-settings/theme-settings.actions';
import { selectColors } from 'src/app/state/theme-settings/theme-settings.reducer';

@Component({
  selector: 'drd-theme-colors-picker',
  standalone: true,
  imports: [CommonModule, TranslateModule, ColorPickerModule],
  templateUrl: './theme-colors-picker.component.html',
  styleUrls: ['./theme-colors-picker.component.scss'],
})
export class ThemeColorsPickerComponent implements OnInit, OnDestroy {
  @Input() colorPickerPosition: string = 'right';
  @Input() height: boolean = false;

  colors$ = this.store.select(selectColors);

  colorChangedSubject$ = new Subject<{ key: string; color: string }>();
  colorChanged$ = this.colorChangedSubject$.asObservable();

  subscriptions: Subscription[] = [];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.colorChanged$
        .pipe(
          tap(value => {
            this.store.dispatch(ThemeSettingsActions.setColor({ key: value.key, color: value.color as Color }));
          }),
          debounceTime(100),
          tap(() => {
            this.store.dispatch(AppActions.breakMerge());
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  onColorChange(key: string, color: string) {
    this.colorChangedSubject$.next({ key: key, color: color });
  }

  identify(index: number) {
    return index;
  }

  returnZero() {
    return 0;
  }
}
