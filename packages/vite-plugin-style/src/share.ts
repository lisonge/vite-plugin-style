const query = '?style';

// https://github.com/vitejs/vite/blob/v7.1.2/packages/vite/src/node/constants.ts#L97
export const styleExts = [
  '.css',
  '.less',
  '.sass',
  '.scss',
  '.styl',
  '.stylus',
  '.pcss',
  '.postcss',
  '.sss',
].map((v) => v + query);

export const pluginName = 'vite-plugin-style';
export const modIdSuffix = '.' + pluginName;

export const getRealStyleId = (id: string): string | undefined => {
  for (const ext of styleExts) {
    if (id.endsWith(ext)) {
      return id.slice(0, -query.length);
    }
  }
};

const nameReg = /[0-9a-zA-Z_]+/g;
const autoPre = (v: string): string => {
  if (!v) return '_';
  return Number.isInteger(Number(v[0])) ? `_${v}` : v;
};
const getUpperCaseName = (value: string | undefined): string | undefined => {
  if (!value) return;
  const list = value.match(nameReg);
  if (!list?.length) return;
  return list
    .map((v, i) => {
      if (i === 0) return autoPre(v);
      return v[0].toUpperCase() + v.substring(1);
    })
    .join('');
};

export const toolsModId = 'virtual:style-tools';
export const resolvedToolsModId = '\0' + toolsModId;
export const toolsTemplate = `
var a; export default (b) => ((a = document.createElement('style')), a.append(b), a);
`.trimStart();

const styleBuildTemplate = `
import {1} from {0};
import d from '${toolsModId}';
export default d({1});
`.trimStart();

const styleDevTemplate = `
import css from {0};
import createStyle from '${toolsModId}';
const style = createStyle(css);
export default style;
if (import.meta.hot) {
  style.setAttribute('data-vite-dev-id', {0});
  const cloneList = [style]
  const cloneNode = style.cloneNode
  style.cloneNode = function (...args) {
    const s = cloneNode.call(this, ...args);
    cloneList.push(s);
    return s;
  };
  import.meta.hot.accept({0}, (v) => {
    const t = String(v.default || '');
    cloneList.forEach((s) => {
      s.textContent = t;
    });
  });
}`.trimStart();

export const getStyleModule = (cssId: string, isServe: boolean): string => {
  const name = getUpperCaseName(cssId.split('/').at(-1));
  return (isServe ? styleDevTemplate : styleBuildTemplate)
    .replaceAll('{0}', JSON.stringify(cssId + '?inline'))
    .replaceAll('{1}', name || '_');
};
