import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { InitIconsComponent } from 'src/app/components/init-icons/init-icons.component';
import ToolbarComponent from 'src/app/components/toolbar/toolbar.component';
import { CanDeactivateComponent } from 'src/app/models/can-deactivate.model';
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
export class EditorComponent
  extends InitIconsComponent
  implements CanDeactivateComponent
{
  rippleColor = getComputedStyle(document.documentElement).getPropertyValue(
    '--rich-black-lighter-ripple'
  );

  isSaved = false;

  opened$ = this.store.select(selectSidebarOpened);

  constructor(
    private store: Store<AppState>,
    override matIconRegistry: MatIconRegistry,
    override domSanitizer: DomSanitizer
  ) {
    super(domSanitizer, matIconRegistry, undefined, [
      { title: 'Pages', icon: 'pages' },
      { title: 'Add Section', icon: 'add' },
      { title: 'Theme Settings', icon: 'theme-settings' },
    ]);
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
