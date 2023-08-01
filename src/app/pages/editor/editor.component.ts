import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
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
export class EditorComponent implements CanDeactivateComponent {
  rippleColor = getComputedStyle(document.documentElement).getPropertyValue(
    '--rich-black-lighter-ripple'
  );

  isSaved = false;

  opened$ = this.store.select(selectSidebarOpened);
  listItems: ListItem[] = [
    { title: 'Pages', icon: 'pages' },
    { title: 'Add Section', icon: 'add' },
    { title: 'Theme Settings', icon: 'theme-settings' },
  ];

  constructor(
    private store: Store<AppState>,
    private utilsService: UtilsService
  ) {
    this.utilsService.initSvgIcons(this.listItems.map(item => item.icon));
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
}
