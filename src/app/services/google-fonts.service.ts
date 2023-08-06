import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { WebFontListResponse } from '../models/web-font.model';

@Injectable({
  providedIn: 'root',
})
export class GoogleFontsService {
  constructor(private http: HttpClient) {}

  getAllFonts() {
    return this.http.get<WebFontListResponse>(environment.googleFontsApiUrl, {
      params: { key: environment.googleFontsApiKey },
    });
  }
}
