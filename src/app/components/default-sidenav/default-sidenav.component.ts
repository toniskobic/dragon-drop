import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ListItem } from 'src/app/models/list-item.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'drd-default-sidenav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatRippleModule],
  templateUrl: './default-sidenav.component.html',
  styleUrls: ['./default-sidenav.component.scss'],
})
export class DefaultSidenavComponent implements OnInit {
  rippleColor = getComputedStyle(document.documentElement).getPropertyValue(
    '--rich-black-lighter-ripple'
  );

  translations: { [key: string]: string } = {};
  listItems: ListItem[] = [];

  constructor(
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
