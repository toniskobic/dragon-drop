import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { FontSort, WebFontListResponse } from '../models/web-font.model';

@Injectable({
  providedIn: 'root',
})
export class GoogleFontsService {
  constructor(private http: HttpClient) {}

  getAllFonts(sort: FontSort = FontSort.Popularity) {
    return this.http.get<WebFontListResponse>(environment.googleFontsApiUrl, {
      params: { key: environment.googleFontsApiKey, sort: sort },
    });
  }
}
