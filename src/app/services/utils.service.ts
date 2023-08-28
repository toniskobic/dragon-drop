import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {}

  initSvgIcons(icons: string[]) {
    icons.forEach(icon => {
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/svgs/${icon}.svg`)
      );
    });
  }

  formatString(string: string, placeholders: { [key: string]: string }) {
    for (const propertyName in placeholders) {
      const re = new RegExp('{' + propertyName + '}', 'gm');
      string = string.replace(re, placeholders[propertyName]);
    }

    return string;
  }

  filterInPlace<T, I = T>(a: T[], condition: (value: T, index: number, array: T[]) => unknown, thisArg?: I) {
    let j = 0;

    a.forEach((e, i) => {
      if (condition.call(thisArg, e, i, a)) {
        if (i !== j) a[j] = e;
        j++;
      }
    });

    a.length = j;
    return a;
  }

  removeWhitespace(input: string): string {
    return input.trim().replace(/\s+/g, ' ');
  }
}
