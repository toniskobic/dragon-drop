import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { ContextMenuType } from 'src/app/models/context-menu-type.enum';
import { DynamicComponent } from 'src/app/models/dynamic-component.model';
import { ThemeColor } from 'src/app/models/theme-color.enum';

import { ElementContextMenuComponent } from '../element-context-menu/element-context-menu.component';
import { SectionContextMenuComponent } from '../section-context-menu/section-context-menu.component';

@Component({
  selector: 'drd-context-menu-wrapper',
  standalone: true,
  templateUrl: './context-menu-wrapper.component.html',
  styleUrls: ['./context-menu-wrapper.component.scss'],
  imports: [
    CommonModule,
    MatMenuModule,
    MatListModule,
    MatIconModule,
    MatRippleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ColorPickerModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule,
    SectionContextMenuComponent,
    ElementContextMenuComponent,
  ],
})
export class ContextMenuWrapperComponent {
  ThemeColor = ThemeColor;
  ContextMenuType = ContextMenuType;

  @ViewChild(MatMenuTrigger) matMenuTrigger!: MatMenuTrigger;

  @Input() type?: ContextMenuType;
  @Input() section?: DynamicComponent;
  @Input() elementId?: string;

  contextMenuPosition = { x: '0px', y: '0px' };
}
