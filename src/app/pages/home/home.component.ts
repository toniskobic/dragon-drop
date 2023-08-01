import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UtilsService } from 'src/app/services/utils.service';

import ToolbarComponent from '../../components/toolbar/toolbar.component';

@Component({
  selector: 'drd-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    ToolbarComponent,
    MatButtonModule,
    RouterModule,
    TranslateModule,
  ],
})
export class HomeComponent {
  constructor(private utilsService: UtilsService) {
    this.utilsService.initSvgIcons(['dragon-drop-short']);
  }
}
