import MagicString from 'magic-string';
import type { Plugin } from 'vite';
import { getStyledNodes } from './ast';
import {
  getStyleModule,
  modIdSuffix,
  pluginName,
  resolvedToolsModId,
  styleExts,
  toolsModId,
  toolsTemplate,
} from './share';

const style = (): Plugin => {
  let isServe: boolean;
  return {
    name: pluginName,
    enforce: 'post',
    config(_, env) {
      isServe = env.command === 'serve';
    },
    async resolveId(source, importer, options) {
      if (source === toolsModId) return resolvedToolsModId;
      if (!source.endsWith(modIdSuffix)) return;
      const realSource = source.substring(
        0,
        source.length - modIdSuffix.length,
      );
      const resolveId = await this.resolve(realSource, importer, options);
      if (!resolveId) return;
      return resolveId.id + modIdSuffix;
    },
    load(id) {
      if (id === resolvedToolsModId) return toolsTemplate;
      if (!id.endsWith(modIdSuffix)) return;
      const cssId = id.substring(0, id.length - modIdSuffix.length);
      return getStyleModule(cssId, isServe);
    },
    transform(code) {
      if (!styleExts.some((v) => code.includes(v))) return;
      const nodes = getStyledNodes(this.parse(code));
      if (!nodes.length) return;
      const ms = new MagicString(code);
      nodes.forEach((n) => {
        ms.update(
          n.node.source.start,
          n.node.source.end,
          JSON.stringify(n.value + modIdSuffix),
        );
      });
      return {
        code: ms.toString(),
        map: ms.generateMap(),
      };
    },
  };
};

export default style;
