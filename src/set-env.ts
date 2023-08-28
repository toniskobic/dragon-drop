import { writeFileSync } from 'fs';

const targetPath = './src/environments/environment.prod.ts';
const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${process.env['API_URL']}'
};
`;

writeFileSync(targetPath, envConfigFile, 'utf8');
