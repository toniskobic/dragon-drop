import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import ToolbarComponent from 'src/app/components/toolbar/toolbar.component';
import { CanDeactivateComponent } from 'src/app/models/can-deactivate.model';
import { ListItem } from 'src/app/models/list-item.model';
import { UtilsService } from 'src/app/services/utils.service';
import { selectSidebarOpened } from 'src/app/state/editor.selectors';
import { AppState } from 'src/app/state/editor-state.model';

@Component({
  selector: 'drd-editor',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatRippleModule,
    ToolbarComponent,
  ],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements CanDeactivateComponent, OnInit {
  rippleColor = getComputedStyle(document.documentElement).getPropertyValue(
    '--rich-black-lighter-ripple'
  );

  isSaved = false;

  opened$ = this.store.select(selectSidebarOpened);
  translations: { [key: string]: string } = {};
  listItems: ListItem[] = [];

  constructor(
    private store: Store<AppState>,
    private utilsService: UtilsService,
    private translate: TranslateService
  ) {
    this.utilsService.initSvgIcons(['pages', 'add', 'theme-settings']);
  }

  async ngOnInit() {
    await this.getTranslations();

    this.listItems = [
      { label: this.translations['EDITOR.MENU.LABELS.PAGES'], icon: 'pages' },
      {
        label: this.translations['EDITOR.MENU.LABELS.ADD_SECTION'],
        icon: 'add',
      },
      {
        label: this.translations['EDITOR.MENU.LABELS.THEME_SETTINGS'],
        icon: 'theme-settings',
      },
    ];
  }

  canDeactivate(): boolean {
    return (
      this.isSaved ||
      confirm('Are you sure you want to leave, all your progress will be lost?')
    );
  }

  @HostListener('window:beforeunload', ['$event'])
  confirmExit(event: BeforeUnloadEvent) {
    if (this.isSaved) return true;

    event.preventDefault();
    return (event.returnValue = '');
  }

  private async getTranslations() {
    const keys = [
      'EDITOR.MENU.LABELS.PAGES',
      'EDITOR.MENU.LABELS.ADD_SECTION',
      'EDITOR.MENU.LABELS.THEME_SETTINGS',
    ];
    this.translations = (await firstValueFrom(this.translate.get(keys))) as {
      [key: string]: string;
    };
  }
}
