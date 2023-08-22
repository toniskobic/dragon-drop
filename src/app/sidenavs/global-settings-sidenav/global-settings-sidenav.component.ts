import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom, mergeMap, Subscription } from 'rxjs';
import {
  FAVICON_FILE_TYPES,
  FAVICON_MAX_SIZE_BYTES,
  LOGO_FILE_TYPES,
  LOGO_MAX_SIZE_BYTES,
} from 'src/app/constants/constants';
import { WebsiteInput } from 'src/app/models/website.model';
import { UtilsService } from 'src/app/services/utils.service';
import { AppState } from 'src/app/state/app.reducer';
import { GlobalSettingsActions } from 'src/app/state/global-settings/global-settings.actions';
import { selectFavicon, selectLogo, selectWebsiteTitle } from 'src/app/state/global-settings/global-settings.reducer';

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
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './global-settings-sidenav.component.html',
  styleUrls: ['./global-settings-sidenav.component.scss'],
})
export class GlobalSettingsSidenavComponent implements OnInit, OnDestroy {
  websiteTitle$ = this.store.select(selectWebsiteTitle);
  favicon$ = this.store.select(selectFavicon);
  logo$ = this.store.select(selectLogo);

  translations: { [key: string]: string } = {};
  faviconSrc: string | null = null;
  logoSrc: string | null = null;

  website = {
    title: '',
    formControl: new FormControl<string>('', { nonNullable: true }),
    valueChanged: false,
  };

  subscriptions: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService,
    private utilsService: UtilsService,
    private snackBar: MatSnackBar
  ) {
    this.utilsService.initSvgIcons(['check', 'close', 'remove']);
  }

  async ngOnInit() {
    await this.getTranslations();
    this.subscriptions.push(
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
        .subscribe(() => (this.website.valueChanged = true))
    );

    this.subscriptions.push(
      this.favicon$.subscribe(favicon => {
        if (favicon) {
          const reader = new FileReader();

          reader.addEventListener('load', () => {
            this.faviconSrc = reader.result as string;
          });

          reader.readAsDataURL(favicon);
        } else {
          this.faviconSrc = null;
        }
      })
    );

    this.subscriptions.push(
      this.logo$.subscribe(logo => {
        if (logo) {
          const reader = new FileReader();

          reader.addEventListener('load', () => {
            this.logoSrc = reader.result as string;
          });

          reader.readAsDataURL(logo);
        } else {
          this.logoSrc = null;
        }
      })
    );
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

  onFileChange(event: Event, isLogo: boolean = false) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file)
      if (this.validateFile(file, isLogo)) {
        isLogo
          ? this.store.dispatch(GlobalSettingsActions.setLogo({ logo: file }))
          : this.store.dispatch(GlobalSettingsActions.setFavicon({ favicon: file }));
      } else {
        const message = isLogo
          ? this.translations['FILE_UPLOAD.ALERTS.LOGO_DELETE_FAILED']
          : this.translations['FILE_UPLOAD.ALERTS.FAVICON_DELETE_FAILED'];
        this.snackBar.open(message, this.translations['COMMON.BUTTONS.CLOSE'], { duration: 3000 });
      }
  }

  deleteFile(isLogo: boolean = false) {
    isLogo
      ? this.store.dispatch(GlobalSettingsActions.setLogo({ logo: null }))
      : this.store.dispatch(GlobalSettingsActions.setFavicon({ favicon: null }));
  }

  private validateFile(file: File, isLogo: boolean = false): boolean {
    if (isLogo) {
      return file.size <= LOGO_MAX_SIZE_BYTES && LOGO_FILE_TYPES.includes(file.type);
    } else {
      return file.size <= FAVICON_MAX_SIZE_BYTES && FAVICON_FILE_TYPES.includes(file.type);
    }
  }

  private async getTranslations() {
    const keys = [
      'FILE_UPLOAD.ALERTS.FAVICON_DELETE_FAILED',
      'FILE_UPLOAD.ALERTS.LOGO_DELETE_FAILED',
      'COMMON.BUTTONS.CLOSE',
    ];
    this.translations = (await firstValueFrom(this.translate.get(keys))) as { [key: string]: string };
  }
}
