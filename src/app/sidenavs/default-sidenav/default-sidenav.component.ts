import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { ListItem } from 'src/app/models/list-item.model';
import { Sidenav } from 'src/app/models/sidenav.model';
import { SidenavService } from 'src/app/services/sidenav.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ThemeSettingsSidenavComponent } from 'src/app/sidenavs/theme-settings-sidenav/theme-settings-sidenav.component';

import { PagesSidenavComponent } from '../pages-sidenav/pages-sidenav.component';
import { SectionsSidenavComponent } from '../sections-sidenav/sections-sidenav.component';

@Component({
  selector: 'drd-default-sidenav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatRippleModule, TranslateModule],
  templateUrl: './default-sidenav.component.html',
  styleUrls: ['./default-sidenav.component.scss'],
})
export class DefaultSidenavComponent {
  rippleColor = getComputedStyle(document.documentElement).getPropertyValue('--rich-black-lighter-ripple');

  listItems: ListItem[] = [
    {
      label: 'EDITOR.MENU.LABELS.PAGES',
      icon: 'pages',
      component: PagesSidenavComponent,
    },
    {
      label: 'EDITOR.MENU.LABELS.SECTIONS',
      icon: 'add',
      component: SectionsSidenavComponent,
    },
    {
      label: 'EDITOR.MENU.LABELS.THEME_SETTINGS',
      icon: 'theme-settings',
      component: ThemeSettingsSidenavComponent,
    },
  ];

  constructor(
    private utilsService: UtilsService,
    private sidenavService: SidenavService
  ) {
    this.utilsService.initSvgIcons(['pages', 'add', 'theme-settings']);
  }

  async onClick(sidenav: Sidenav) {
    await this.sidenavService.push(sidenav);
  }
}
