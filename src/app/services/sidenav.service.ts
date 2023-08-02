import type { Type as Component } from '@angular/core';
import { Injectable } from '@angular/core';

import { SidenavContentAreaDirective } from '../directives/sidenav-content-area.directive';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  #contentArea?: SidenavContentAreaDirective;

  #stack = [] as Component<unknown>[];

  setDynamicContentArea(host: SidenavContentAreaDirective) {
    this.#contentArea = host;
  }

  push(component: Component<unknown>): void {
    this.#stack.push(component);
  }

  pop(): void {
    // At least one item must be in the
    // stack so user isn't left with an empty sidenav
    if (this.#stack.length === 1) {
      return;
    }

    this.#stack.pop();
  }
}
