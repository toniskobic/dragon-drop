import { CdkDragExit, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from 'src/app/builder-components/footers/footer/footer.component';
import { HeaderComponent } from 'src/app/builder-components/headers/header/header.component';
import { SectionComponent } from 'src/app/builder-components/sections/section/section.component';
import { DragCursorDirective } from 'src/app/directives/drag-cursor.directive';
import { SectionItem } from 'src/app/models/section-item.model';

@Component({
  selector: 'drd-sections-sidenav',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, TranslateModule, DragDropModule, DragCursorDirective],
  templateUrl: './sections-sidenav.component.html',
  styleUrls: ['./sections-sidenav.component.scss'],
})
export class SectionsSidenavComponent {
  sectionTypes: { [key: string]: SectionItem[] } = {
    headers: [{ name: 'Default Header', class: HeaderComponent }],
    sections: [{ name: 'Default Section', class: SectionComponent }],
    footers: [{ name: 'Default Footer', class: FooterComponent }],
  };

  exited(event: CdkDragExit<SectionItem[], unknown>) {
    const sectionItem = event.item.data as SectionItem;
    const sections = event.container.data;
    const currentIdx = event.container.data.findIndex(item => item.name === sectionItem.name);
    sections.splice(currentIdx + 1, 0, {
      ...sectionItem,
      temp: true,
    });
  }

  entered(key: string) {
    this.sectionTypes[key] = this.sectionTypes[key].filter(item => !item.temp);
  }

  identify(index: number) {
    return index;
  }

  returnZero() {
    return 0;
  }
}
