import { CdkDragExit, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from 'src/app/builder-components/footers/footer/footer.component';
import { HeaderComponent } from 'src/app/builder-components/headers/header/header.component';
import { SectionComponent } from 'src/app/builder-components/sections/section/section.component';
import { SectionItem } from 'src/app/models/section-item.model';

@Component({
  selector: 'drd-sections-sidenav',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, TranslateModule, DragDropModule],
  templateUrl: './sections-sidenav.component.html',
  styleUrls: ['./sections-sidenav.component.scss'],
})
export class SectionsSidenavComponent {
  sectionTypes: { [key: string]: SectionItem[] } = {
    headers: [{ name: 'Default Header', component: { component: HeaderComponent } }],
    sections: [{ name: 'Default Section', component: { component: SectionComponent } }],
    footers: [{ name: 'Default Footer', component: { component: FooterComponent } }],
  };

  exited(event: CdkDragExit<SectionItem[], unknown>) {
    const sectionItem = event.item.data as SectionItem;
    const sections = event.container.data;
    const currentIdx = event.container.data.findIndex(f => f.name === sectionItem.name);
    sections.splice(currentIdx + 1, 0, {
      ...sectionItem,
      temp: true,
    });
  }

  entered(key: string) {
    this.sectionTypes[key] = this.sectionTypes[key].filter(f => !f.temp);
  }

  identify(index: number) {
    return index;
  }

  returnZero() {
    return 0;
  }
}
