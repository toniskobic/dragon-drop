import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { mergeMap, Subscription } from 'rxjs';
import { WebsiteInput } from 'src/app/models/website.model';
import { UtilsService } from 'src/app/services/utils.service';
import { AppState } from 'src/app/state/app.reducer';
import { GlobalSettingsActions } from 'src/app/state/global-settings/global-settings.actions';
import { selectGlobalSettingsState, selectWebsiteTitle } from 'src/app/state/global-settings/global-settings.reducer';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    TranslateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './global-settings-sidenav.component.html',
  styleUrls: ['./global-settings-sidenav.component.scss'],
})
export class GlobalSettingsSidenavComponent implements OnInit, OnDestroy {
  websiteTitle$ = this.store.select(selectWebsiteTitle);
  favicon$ = this.store.select(selectGlobalSettingsState);

  website = {
    title: '',
    formControl: new FormControl<string>('', { nonNullable: true }),
    valueChanged: false,
  };

  subscriptions: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    private utilsService: UtilsService
  ) {
    this.utilsService.initSvgIcons(['check', 'close']);
  }

  ngOnInit(): void {
    this.websiteTitle$
      .pipe(
        mergeMap(title => {
          this.website = {
            title: title,
            formControl: new FormControl<string>(title, { nonNullable: true }),
            valueChanged: false,
          };
          return this.website.formControl.valueChanges;
        })
      )
      .subscribe(() => (this.website.valueChanged = true));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  close(website: WebsiteInput) {
    website.formControl.setValue(website.title);
    website.valueChanged = false;
  }

  confirm(website: WebsiteInput) {
    const websiteTitle = website.formControl.value;
    this.store.dispatch(
      GlobalSettingsActions.setWebsiteTitle({
        websiteTitle: websiteTitle,
      })
    );

    website.valueChanged = false;
  }
}
