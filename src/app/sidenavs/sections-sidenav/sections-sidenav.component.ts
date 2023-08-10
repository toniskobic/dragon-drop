import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
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
  headers: SectionItem[] = [{ name: 'Default Header', component: { component: HeaderComponent } }];
  sections: SectionItem[] = [{ name: 'Default Section', component: { component: SectionComponent } }];
}
