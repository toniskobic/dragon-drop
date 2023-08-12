import { CdkDragExit, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { DragCursorDirective } from 'src/app/directives/drag-cursor.directive';
import { SectionItem } from 'src/app/models/section-item.model';
import { SectionsService } from 'src/app/services/sections.service';

@Component({
  selector: 'drd-sections-sidenav',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, TranslateModule, DragDropModule, DragCursorDirective, MatTooltipModule],
  templateUrl: './sections-sidenav.component.html',
  styleUrls: ['./sections-sidenav.component.scss'],
})
export class SectionsSidenavComponent {
  sectionTypes: { [key: string]: SectionItem[] } = {
    headers: Array.from(this.sectionsService.headers, ([key, value]) => {
      return { name: value, class: key };
    }),
    sections: Array.from(this.sectionsService.sections, ([key, value]) => {
      return { name: value, class: key };
    }),
    footers: Array.from(this.sectionsService.footers, ([key, value]) => {
      return { name: value, class: key };
    }),
  };

  constructor(private sectionsService: SectionsService) {}

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
