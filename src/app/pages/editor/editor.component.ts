import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DefaultSidenavComponent } from 'src/app/components/sidenavs/default-sidenav/default-sidenav.component';
import ToolbarComponent from 'src/app/components/toolbar/toolbar.component';
import { SidenavContentAreaDirective } from 'src/app/directives/sidenav-content-area.directive';
import { CanDeactivateComponent } from 'src/app/models/can-deactivate.model';
import { SidenavService } from 'src/app/services/sidenav.service';
import { selectSidebarOpened } from 'src/app/state/editor.selectors';
import { AppState } from 'src/app/state/editor-state.model';

@Component({
  selector: 'drd-editor',
  standalone: true,
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatRippleModule,
    ToolbarComponent,
    DefaultSidenavComponent,
    SidenavContentAreaDirective,
  ],
})
export class EditorComponent implements CanDeactivateComponent, OnInit {
  @ViewChild(SidenavContentAreaDirective, { static: true }) sidenavContentArea?: SidenavContentAreaDirective;

  toolbarHeight = getComputedStyle(document.documentElement).getPropertyValue('--toolbar-height-value');

  isSaved = false;
  opened$ = this.store.select(selectSidebarOpened);

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService,
    public sidenavService: SidenavService
  ) {
    console.log(this.toolbarHeight);
  }

  ngOnInit(): void {
    if (!this.sidenavContentArea) {
      throw new Error('sidenavContentArea is undefined');
    }

    this.sidenavService.setDynamicContentArea(this.sidenavContentArea);
  }

  canDeactivate(): boolean {
    return this.isSaved || confirm(this.translate.instant('EDITOR.ALERTS.UNSAVED_CHANGES') as string);
  }

  @HostListener('window:beforeunload', ['$event'])
  confirmExit(event: BeforeUnloadEvent) {
    if (this.isSaved) return true;

    event.preventDefault();
    return (event.returnValue = '');
  }
}
