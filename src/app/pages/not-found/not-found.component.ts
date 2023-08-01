import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'drd-not-found',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule, TranslateModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  constructor(private utilsService: UtilsService) {
    this.utilsService.initSvgIcons(['dragon-drop-full-black']);
  }
}
