export interface WebFontListResponse {
  kind: string; // "webfonts#webfontList"
  items: WebFontItem[];
}

export interface WebFontItem {
  family: string;
  variants: FontStyle[]; // e.g. "regular", "italic", "700", "700italic"
  subsets: string[]; // e.g. "cyrillic", "greek", "latin", "latin-ext"
  version: string; // e.g. "v21"
  lastModified: string; // e.g. "2022-09-22"
  files: Record<FontStyle, string>;
  category: string; // e.g. "monospace", "sans-serif"
  kind: string; // "webfonts#webfont"
  menu: string; // e.g. "http://fonts.gstatic.com/s/anonymouspro/v21/rP2Bp2a15UIB7Un-bOeISG3pHl028A.ttf"
}

export type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type FontStyle = `${FontWeight}` | `${FontWeight}italic` | 'regular' | 'italic';
