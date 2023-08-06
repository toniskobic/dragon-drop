import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { firstValueFrom, map } from 'rxjs';
import { GoogleFontsService } from 'src/app/services/google-fonts.service';

@Component({
  selector: 'drd-theme-settings-sidenav',
  standalone: true,
  imports: [CommonModule, MatExpansionModule],
  templateUrl: './theme-settings-sidenav.component.html',
  styleUrls: ['./theme-settings-sidenav.component.scss'],
})
export class ThemeSettingsSidenavComponent implements OnInit {
  googleFonts$ = this.googleFontsService.getAllFonts().pipe(map(fonts => fonts.items));

  constructor(private googleFontsService: GoogleFontsService) {}

  async ngOnInit() {
    const fonts = await firstValueFrom(this.googleFontsService.getAllFonts());
    console.log(fonts);
  }
}
