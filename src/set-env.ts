import { writeFileSync } from 'fs';

const targetPath = './src/environments/environment.prod.ts';
const envConfigFile = `export const environment = {
  production: true,
  appName: 'Dragon Drop',
  googleFontsApiUrl: 'https://www.googleapis.com/webfonts/v1/webfonts',
  googleFontsApiKey: '${process.env['GOOGLE_FONTS_API_KEY']}'
};
`;

writeFileSync(targetPath, envConfigFile, 'utf8');
