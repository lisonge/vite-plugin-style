import type { Plugin } from 'vite';

export default function style(): Plugin {
  let isServe: boolean;
  return {
    name: pluginName,
    enforce: 'pre',
    config(_, env) {
      isServe = env.command === 'serve';
    },
    async resolveId(source, importer, options) {
      if (source === toolsModId) return resolvedToolsModId;
      if (source.endsWith(styleQuery)) {
        const cssId = source.slice(0, -styleQuery.length);
        const resolveId = (await this.resolve(cssId, importer, options))?.id;
        if (!resolveId) return;
        return resolveId + cssIdSuffix;
      }
    },
    load(id) {
      if (id === resolvedToolsModId) return toolsTemplate;
      if (id.endsWith(cssIdSuffix)) {
        const cssId = id.substring(0, id.length - cssIdSuffix.length);
        return getStyleModule(cssId, isServe);
      }
    },
  };
}

const styleQuery = '?style';

const pluginName = 'vite-plugin-style';
const cssIdSuffix = '.' + pluginName;

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

const getStyleModule = (cssId: string, isServe: boolean): string => {
  const name = getUpperCaseName(cssId.split('/').at(-1));
  return (isServe ? styleDevTemplate : styleBuildTemplate)
    .replaceAll('{0}', JSON.stringify(cssId + '?inline'))
    .replaceAll('{1}', name || '_');
};

const toolsModId = 'virtual:style-tools';
const resolvedToolsModId = '\0' + toolsModId;
const toolsTemplate = `
var a;
export default (b) => ((a = document.createElement('style')), a.append(b), a);
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
  const nodes = [style];
  const cloneNode = style.cloneNode;
  style.cloneNode = function (...args) {
    const s = cloneNode.call(this, ...args);
    nodes.push(s);
    return s;
  };
  import.meta.hot.accept({0}, (v) => {
    const t = String(v.default || '');
    nodes.forEach((s) => {
      s.textContent = t;
    });
  });
}`.trimStart();
