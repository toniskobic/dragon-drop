import { Color } from './color.model';

export interface ThemeSettings {
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
}
