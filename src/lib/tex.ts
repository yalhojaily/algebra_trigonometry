import katex from 'katex';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** فاصلة خارج الأقواس ( و [ تصير موضعًا مسموحًا للكسر، فلا تنقسم الأزواج مثل (1, 2) */
function breakableCommas(body: string): string {
  let depth = 0;
  let res = '';
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === '(' || c === '[') depth++;
    else if ((c === ')' || c === ']') && depth > 0) depth--;
    if (c === ',' && depth === 0) {
      res += ',\\allowbreak ';
      while (body[i + 1] === ' ') i++;
    } else res += c;
  }
  return res;
}

/** يحوّل نصًا يحتوي $...$ أو $$...$$ إلى HTML مع KaTeX. يعمل في البناء وفي المتصفح. */
export function tex(src: string): string {
  const out: string[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    out.push(esc(src.slice(last, m.index)));
    const display = m[1] !== undefined;
    let body = (m[1] ?? m[2]).trim();
    // في القوائم والمجموعات داخل السطر نسمح بالكسر بعد الفواصل إذا ضاق السطر
    if (!display && /\\\{|\)\s*,\s*\(/.test(body)) body = breakableCommas(body);
    // نص إنجليزي طويل داخل المعادلة: نسمح بالكسر بين كلماته
    if (!display) body = body.replace(/\\text\{([^{}]*\s[^{}]*)\}/g, (_, t: string) =>
      t.split(/(?<=\s)/).map((w) => `\\text{${w}}`).join('\\allowbreak '));
    out.push(katex.renderToString(body, { displayMode: display, throwOnError: false, strict: false }));
    last = re.lastIndex;
  }
  out.push(esc(src.slice(last)));
  return out.join('');
}
