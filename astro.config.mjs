import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/**
 * داخل مكونات JSX في MDX تتحول كتل $$ … $$ إلى رياضيات سطرية داخل فقرة.
 * هذه الإضافة تعيد كل فقرة لا تحوي إلا $$ … $$ إلى معادلة مستقلة (display).
 */
function remarkDisplayInJsx() {
  return (tree, file) => {
    const src = String(file.value ?? '');
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.map((ch) => {
        if (ch.type === 'paragraph' && ch.children?.length === 1 && ch.children[0].type === 'inlineMath') {
          const m = ch.children[0];
          const at = m.position?.start?.offset;
          if (at != null && src.startsWith('$$', at)) {
            return {
              type: 'math',
              value: m.value,
              position: ch.position,
              data: {
                hName: 'pre',
                hChildren: [{ type: 'element', tagName: 'code', properties: { className: ['language-math', 'math-display'] }, children: [{ type: 'text', value: m.value }] }],
              },
            };
          }
        }
        walk(ch);
        return ch;
      });
    };
    walk(tree);
  };
}

// GitHub Pages: https://yalhojaily.github.io/algebra_trigonometry/
export default defineConfig({
  site: 'https://yalhojaily.github.io',
  base: '/algebra_trigonometry',
  trailingSlash: 'always',
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkMath, remarkDisplayInJsx],
    rehypePlugins: [[rehypeKatex, { strict: false }]],
  },
});
