import type { Type } from '@angular/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DynamicContentAreaDirective } from '../directives/dynamic-content-area.directive';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private contentArea?: DynamicContentAreaDirective;

  private stack = [] as Type<unknown>[];

  private subSidenavActiveSubject$ = new BehaviorSubject(this.stack.length > 1);
  subSidenavActive$ = this.subSidenavActiveSubject$.asObservable();

  isSlidingInFromRight = false;
  isSlidingInFromLeft = false;

  sidenavTransitionDuration = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--sidenav-transition-duration'),
    10
  );

  setDynamicContentArea(host: DynamicContentAreaDirective) {
    this.contentArea = host;
  }

  async push(component: Type<unknown>) {
    this.stack.push(component);
    this.setContent(component);
    this.subSidenavActiveSubject$.next(this.stack.length > 1);
    if (this.stack.length > 1) await this.animateInFromRight();
  }

  async pop() {
    if (this.stack.length === 1) {
      return;
    }

    this.stack.pop();

    this.setContent(this.stack[this.stack.length - 1]);
    this.subSidenavActiveSubject$.next(this.stack.length > 1);
    await this.animateInFromLeft();
  }

  clear() {
    this.stack.length = 0;
    this.contentArea?.viewContainerRef.clear();
  }

  private setContent(component: Type<unknown>): void {
    this.contentArea?.viewContainerRef.clear();
    this.contentArea?.viewContainerRef.createComponent(component);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async animateInFromLeft() {
    this.isSlidingInFromLeft = true;

    await this.sleep(this.sidenavTransitionDuration);

    this.isSlidingInFromLeft = false;
  }

  private async animateInFromRight() {
    this.isSlidingInFromRight = true;

    await this.sleep(this.sidenavTransitionDuration);

    this.isSlidingInFromRight = false;
  }
}
