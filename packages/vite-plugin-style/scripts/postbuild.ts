import prettier from 'prettier';
import fs from 'node:fs/promises';
import process from 'node:process';

// https://github.com/vitejs/vite/blob/v7.1.2/packages/vite/src/node/constants.ts#L97
const styleExts = [
  '.css',
  '.less',
  '.sass',
  '.scss',
  '.styl',
  '.stylus',
  '.pcss',
  '.postcss',
  '.sss',
];

const template = `
declare module '*{0}?style' {
  const style: HTMLStyleElement;
  export default style;
}`.trimStart();

const rawContent = styleExts.map((v) => template.replace('{0}', v)).join('\n');
const formattedContent = await prettier.format(rawContent, {
  parser: 'typescript',
});
await fs.writeFile(process.cwd() + '/client.d.ts', formattedContent, 'utf-8');
console.log('client.d.ts generated successfully!');
