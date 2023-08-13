import { Color } from 'src/app/models/color.model';
import { WebFontItem } from 'src/app/models/web-font.model';

export interface ThemeSettingsState {
  colors: {
    primary: Color;
    secondary: Color;
    tertiary: Color;
  };
  fonts: {
    primary: string;
    secondary: string;
    alternative: string;
  };
  fontList: WebFontItem[] | undefined;
}
