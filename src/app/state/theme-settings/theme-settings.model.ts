import { Color } from 'src/app/models/color.model';

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
}
