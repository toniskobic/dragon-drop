import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicContentAreaDirective } from 'src/app/directives/dynamic-content-area.directive';
import { SidenavService } from 'src/app/services/sidenav.service';
import { UtilsService } from 'src/app/services/utils.service';

import { DefaultSidenavComponent } from '../default-sidenav/default-sidenav.component';

@Component({
  selector: 'drd-sidenav-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    MatRippleModule,
    DefaultSidenavComponent,
    DynamicContentAreaDirective,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './sidenav-wrapper.component.html',
  styleUrls: ['./sidenav-wrapper.component.scss'],
})
export class SidenavWrapperComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild(DynamicContentAreaDirective, { static: true }) sidenavContentArea!: DynamicContentAreaDirective;

  rippleColor = getComputedStyle(document.documentElement).getPropertyValue('--rich-black-lighter-ripple');
  subSidenavActive$ = this.sidenavService.subSidenavActive$;
  subSidenavLabel$ = this.sidenavService.subSidenavLabel$;

  get isSlidingInFromRight() {
    return this.sidenavService.isSlidingInFromRight;
  }

  get isSlidingInFromLeft() {
    return this.sidenavService.isSlidingInFromLeft;
  }

  constructor(
    public sidenavService: SidenavService,
    private utilsService: UtilsService,
    private cdr: ChangeDetectorRef
  ) {
    this.utilsService.initSvgIcons(['back']);
  }

  ngOnInit(): void {
    this.sidenavService.setDynamicContentArea(this.sidenavContentArea);
  }

  async ngAfterContentInit() {
    await this.sidenavService.push({ component: DefaultSidenavComponent });
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.sidenavService.clear();
  }

  async goBack() {
    await this.sidenavService.pop();
  }
}
