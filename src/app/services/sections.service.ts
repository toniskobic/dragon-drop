import { Injectable, Type } from '@angular/core';

import { FooterComponent } from '../builder-components/footers/footer/footer.component';
import { HeaderComponent } from '../builder-components/headers/header/header.component';
import { SectionComponent } from '../builder-components/sections/section/section.component';
import { DynamicComponentType } from '../models/dynamic-component.model';

@Injectable({
  providedIn: 'root',
})
export class SectionsService {
  headers: Map<Type<DynamicComponentType>, string> = new Map<Type<DynamicComponentType>, string>([
    [HeaderComponent, 'Default Header'],
  ]);

  sections: Map<Type<DynamicComponentType>, string> = new Map<Type<DynamicComponentType>, string>([
    [SectionComponent, 'Default Section'],
  ]);

  footers: Map<Type<DynamicComponentType>, string> = new Map<Type<DynamicComponentType>, string>([
    [FooterComponent, 'Default Footer'],
  ]);

  allSections: Map<Type<DynamicComponentType>, string> = new Map<Type<DynamicComponentType>, string>([
    ...Array.from(this.headers.entries()),
    ...Array.from(this.sections.entries()),
    ...Array.from(this.footers.entries()),
  ]);

  constructor() {}
}
