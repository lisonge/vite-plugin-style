import type { ImportDeclaration, ImportExpression } from 'acorn';
import { simple } from 'acorn-walk';
import type { ProgramNode } from 'rollup';
import { getRealStyleId } from './share';

interface NodeItem {
  node: ImportExpression | ImportDeclaration;
  value: string;
}

export const getStyledNodes = (programNode: ProgramNode): NodeItem[] => {
  const nodes: NodeItem[] = [];
  simple(programNode, {
    ImportExpression(node) {
      const s = node.source;
      if (s.type === 'Literal' && typeof s.value === 'string') {
        const value = getRealStyleId(s.value);
        if (!value) return;
        nodes.push({ node, value });
      } else if (s.type === 'TemplateLiteral' && s.quasis.length === 1) {
        const v = s.quasis[0].value;
        const value = getRealStyleId(v.cooked || v.raw);
        if (!value) return;
        nodes.push({ node, value });
      }
    },
    ImportDeclaration(node) {
      const s = node.source;
      if (typeof s.value === 'string') {
        const value = getRealStyleId(s.value);
        if (!value) return;
        nodes.push({ node, value });
      }
    },
  });
  return nodes;
};
