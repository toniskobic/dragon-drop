// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const fs = require('fs');

const targetPath = './environments/environment.prod.ts';
const envConfigFile = `export const environment = {
  production: true,
  appName: 'Dragon Drop',
  googleFontsApiUrl: 'https://www.googleapis.com/webfonts/v1/webfonts',
  googleFontsApiKey: '${process.env['GOOGLE_FONTS_API_KEY']}',
};
`;

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
fs.writeFileSync(targetPath, envConfigFile, 'utf8');
