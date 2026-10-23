import katex from 'katex';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** يحوّل نصًا يحتوي $...$ أو $$...$$ إلى HTML مع KaTeX. يعمل في البناء وفي المتصفح. */
export function tex(src: string): string {
  const out: string[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    out.push(esc(src.slice(last, m.index)));
    const display = m[1] !== undefined;
    out.push(
      katex.renderToString((m[1] ?? m[2]).trim(), { displayMode: display, throwOnError: false, strict: false }),
    );
    last = re.lastIndex;
  }
  out.push(esc(src.slice(last)));
  return out.join('');
}
