import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ResizeHandleDirection } from 'src/app/models/resize-handle-direction.enum';
import { WebsiteInput } from 'src/app/models/website.model';
import { UtilsService } from 'src/app/services/utils.service';
import { AppState } from 'src/app/state/app.reducer';
import { EditorActions } from 'src/app/state/editor/editor.actions';
import { selectResizeHandleDirection } from 'src/app/state/editor/editor.reducer';
import { GlobalSettingsActions } from 'src/app/state/global-settings/global-settings.actions';

import { WebsiteSettingsComponent } from '../../components/website-settings/website-settings.component';

@Component({
  standalone: true,
  templateUrl: './global-settings-sidenav.component.html',
  styleUrls: ['./global-settings-sidenav.component.scss'],
  imports: [
    CommonModule,
    MatExpansionModule,
    TranslateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    WebsiteSettingsComponent,
  ],
})
export class GlobalSettingsSidenavComponent implements OnInit {
  ResizeHandleDirection = ResizeHandleDirection;
  resizeHandleDirection$ = this.store.select(selectResizeHandleDirection);

  translations: { [key: string]: string } = {};

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService,
    private utilsService: UtilsService
  ) {
    this.utilsService.initSvgIcons(['check', 'close', 'remove']);
  }

  async ngOnInit() {
    await this.getTranslations();
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

  setResizeHandleDirection(event: MatSelectChange) {
    const direction = event.value as ResizeHandleDirection;
    this.store.dispatch(
      EditorActions.setResizeHandleDirection({
        direction: direction,
      })
    );
  }

  private async getTranslations() {
    const keys = ['EDITOR.SIDENAVS.GLOBAL_SETTINGS.LABELS.RESIZE_HANDLE_DIRECTION'];
    this.translations = (await firstValueFrom(this.translate.get(keys))) as { [key: string]: string };
  }
}
