import prettier from 'prettier';
import { styleExts } from '../src/share';
import fs from 'node:fs/promises';
import process from 'node:process';

const template = `
declare module '{0}' {
  const style: HTMLStyleElement;
  export default style;
}
`;
const rawContent = styleExts
  .map((v) => template.replace('{0}', '*' + v))
  .join('\n');
const formattedContent = await prettier.format(rawContent, {
  parser: 'typescript',
});
await fs.writeFile(process.cwd() + '/client.d.ts', formattedContent, 'utf-8');
console.log('client.d.ts generated successfully!');
