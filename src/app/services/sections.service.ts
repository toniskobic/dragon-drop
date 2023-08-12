import { Injectable, Type } from '@angular/core';

import { FooterComponent } from '../builder-components/footers/footer/footer.component';
import { HeaderComponent } from '../builder-components/headers/header/header.component';
import { SectionComponent } from '../builder-components/sections/section/section.component';
import { DynamicElement } from '../models/dynamic-component.model';

@Injectable({
  providedIn: 'root',
})
export class SectionsService {
  headers: Map<Type<DynamicElement>, string> = new Map<Type<DynamicElement>, string>([
    [HeaderComponent, 'Default Header'],
  ]);

  sections: Map<Type<DynamicElement>, string> = new Map<Type<DynamicElement>, string>([
    [SectionComponent, 'Default Section'],
  ]);

  footers: Map<Type<DynamicElement>, string> = new Map<Type<DynamicElement>, string>([
    [FooterComponent, 'Default Footer'],
  ]);

  allSections: Map<Type<DynamicElement>, string> = new Map<Type<DynamicElement>, string>([
    ...Array.from(this.headers.entries()),
    ...Array.from(this.sections.entries()),
    ...Array.from(this.footers.entries()),
  ]);

  constructor() {}
}
