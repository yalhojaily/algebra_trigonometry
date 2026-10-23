// مولّدات تمارين الفصل 2: الرسوم البيانية والدوال
import { rnd, nz, pick, shuffle, gcd, R, frac, poly, polyP, choice, simpRoot, type Problem } from '../gen';

type Gen = () => Problem;
const ps = (k: number) => (k < 0 ? `(${k})` : String(k));
const sq = (v: string, c: number) => (c === 0 ? `${v}^2` : `(${v} ${c > 0 ? '-' : '+'} ${Math.abs(c)})^2`);
const lin = (m: string, b: string) => `${m === '0' ? '' : m === '1' ? 'x' : m === '-1' ? '-x' : `${m}x`}${b === '0' ? (m === '0' ? '0' : '') : m === '0' ? b : b.startsWith('-') ? ` - ${b.slice(1)}` : ` + ${b}`}`;
const linP = (p: number, q: number, bn: number, bd: number) => `(${p})/(${q})*x+(${bn})/(${bd})`;
const iv = (a: string, b: string, lc: boolean, rc: boolean) => `$${lc ? '[' : '('}${a}, ${b}${rc ? ']' : ')'}$`;

// ================= 2.1 =================
const s21: Gen[] = [
  () => {
    const x1 = nz(-8, 8), y1 = nz(-8, 8);
    const [a, b] = pick([[3, 4], [5, 12], [6, 8], [1, 2], [2, 3], [1, 3], [4, 4], [2, 5]]);
    const x2 = x1 + a * pick([1, -1]), y2 = y1 + b * pick([1, -1]);
    const s = a * a + b * b;
    return {
      kind: 'values', prompt: `أوجد المسافة بين النقطتين $P(${x1}, ${y1})$ و $Q(${x2}, ${y2})$.`, answer: [R(Math.sqrt(s))],
      hint: 'd = √((x₂ − x₁)² + (y₂ − y₁)²). يمكنك كتابة الإجابة مثل sqrt(13) أو 2sqrt(5).',
      solution: [`$d = \\sqrt{(${x2} - ${ps(x1)})^2 + (${y2} - ${ps(y1)})^2} = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${s}}${simpRoot(s) !== `\\sqrt{${s}}` ? ` = ${simpRoot(s)}` : ''}$`],
      placeholder: 'مثال: 5 أو sqrt(13)',
    };
  },
  () => {
    const x1 = nz(-9, 9), y1 = nz(-9, 9), x2 = nz(-9, 9), y2 = nz(-9, 9);
    return {
      kind: 'values', ordered: true, prompt: `أوجد نقطة منتصف القطعة الواصلة بين $(${x1}, ${y1})$ و $(${x2}, ${y2})$. اكتبها $x, y$.`,
      answer: [R((x1 + x2) / 2), R((y1 + y2) / 2)],
      hint: 'المنتصف = (متوسط الإحداثيين السينيين، متوسط الإحداثيين الصاديين).',
      solution: [`$M = \\left(\\dfrac{${x1} + ${ps(x2)}}{2}, \\dfrac{${y1} + ${ps(y2)}}{2}\\right) = \\left(${frac(x1 + x2, 2)}, ${frac(y1 + y2, 2)}\\right)$`],
      placeholder: 'مثال: (1.5, -2)',
    };
  },
  () => {
    const mx = nz(-6, 6), my = nz(-6, 6), x1 = nz(-6, 6), y1 = nz(-6, 6);
    return {
      kind: 'values', ordered: true, prompt: `نقطة منتصف القطعة $\\overline{PQ}$ هي $M(${mx}, ${my})$، والطرف $P(${x1}, ${y1})$. أوجد الطرف الآخر $Q$.`,
      answer: [R(2 * mx - x1), R(2 * my - y1)],
      hint: 'إذا كان Q = (x, y) فإن (x₁ + x)/2 = إحداثي المنتصف. حل لكل إحداثي على حدة.',
      solution: [`$\\dfrac{${x1} + x}{2} = ${mx} \\Rightarrow x = ${2 * mx - x1}$`, `$\\dfrac{${y1} + y}{2} = ${my} \\Rightarrow y = ${2 * my - y1}$`, `$Q = (${2 * mx - x1}, ${2 * my - y1})$`],
      placeholder: 'مثال: (4, -1)',
    };
  },
  () => {
    const a = nz(1, 4);
    const r = nz(-5, 5);
    const c = -a * r; // y = a x + c ⇒ x-intercept r
    return {
      kind: 'values', ordered: true, prompt: `أوجد المقطع السيني ثم المقطع الصادي للمستقيم $y = ${a === 1 ? '' : a}x ${c < 0 ? '-' : '+'} ${Math.abs(c)}$. اكتبهما بالترتيب.`,
      answer: [R(r), R(c)],
      hint: 'المقطع السيني: ضع y = 0. المقطع الصادي: ضع x = 0.',
      solution: [`$y = 0$: ${a === 1 ? `$x = ${r}$` : `$${a}x = ${-c} \\Rightarrow x = ${r}$`}`, `$x = 0$: $y = ${c}$`, `المقطعان: $(${r}, 0)$ و $(0, ${c})$.`],
      placeholder: 'مثال: 3, -6',
    };
  },
  () => {
    const x0 = nz(-4, 4), a = nz(-3, 3), c = rnd(-6, 6);
    const yTrue = a * x0 * x0 + c;
    const on = Math.random() < 0.5;
    const y0 = on ? yTrue : yTrue + nz(-3, 3);
    return choice(
      `هل النقطة $(${x0}, ${y0})$ تقع على منحنى المعادلة $y = ${a === 1 ? '' : a === -1 ? '-' : a}x^2 ${c < 0 ? '-' : '+'} ${Math.abs(c)}$؟`,
      on ? 'نعم' : 'لا', [on ? 'لا' : 'نعم'],
      'عوّض بـ x في المعادلة وقارن الناتج بـ y.',
      [`$${a}(${x0})^2 ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${yTrue}$`, on ? `يساوي $${y0}$، فالنقطة على المنحنى.` : `لا يساوي $${y0}$، فالنقطة ليست على المنحنى.`],
    );
  },
];

// ================= 2.2 =================
const s22: Gen[] = [
  () => {
    const h = nz(-7, 7), k = rnd(-7, 7), r = rnd(1, 9);
    return {
      kind: 'values', ordered: true, prompt: `أوجد المركز ونصف القطر للدائرة $${sq('x', h)} + ${sq('y', k)} = ${r * r}$. اكتبها $h, k, r$.`,
      answer: [R(h), R(k), R(r)],
      hint: 'الصيغة (x − h)² + (y − k)² = r². انتبه: (x + 3)² تعني h = −3.',
      solution: [`$h = ${h}$ و $k = ${k}$ و $r = \\sqrt{${r * r}} = ${r}$`],
      placeholder: 'مثال: -3, 2, 5',
    };
  },
  () => {
    const h = nz(-6, 6), k = nz(-6, 6), r = rnd(1, 7);
    const D = -2 * h, E = -2 * k, F = h * h + k * k - r * r;
    const t = (c: number, v: string) => (c === 0 ? '' : ` ${c < 0 ? '-' : '+'} ${Math.abs(c)}${v}`);
    return {
      kind: 'values', ordered: true, prompt: `أوجد المركز ونصف القطر: $x^2 + y^2${t(D, 'x')}${t(E, 'y')}${t(F, '')} = 0$. اكتبها $h, k, r$.`,
      answer: [R(h), R(k), R(r)],
      hint: 'أكمل المربع لحدود x ولحدود y كلٌّ على حدة.',
      solution: [
        `نجمع: $(x^2${t(D, 'x')}) + (y^2${t(E, 'y')}) = ${-F}$`,
        `نكمل المربع بإضافة $${h * h}$ و $${k * k}$ للطرفين: $${sq('x', h)} + ${sq('y', k)} = ${r * r}$`,
        `المركز $(${h}, ${k})$ ونصف القطر $${r}$.`,
      ],
      placeholder: 'مثال: 2, -1, 4',
    };
  },
  () => {
    const h = nz(-6, 6), k = nz(-6, 6), r = rnd(2, 8);
    const right = `$${sq('x', h)} + ${sq('y', k)} = ${r * r}$`;
    return choice(`ما معادلة الدائرة التي مركزها $(${h}, ${k})$ ونصف قطرها $${r}$؟`, right,
      [`$${sq('x', -h)} + ${sq('y', -k)} = ${r * r}$`, `$${sq('x', h)} + ${sq('y', k)} = ${r}$`, `$${sq('x', k)} + ${sq('y', h)} = ${r * r}$`],
      'المركز يظهر بإشارة معاكسة داخل الأقواس، والطرف الأيمن r².',
      [`$(x - ${ps(h)})^2 + (y - ${ps(k)})^2 = ${r}^2$، أي ${right}`]);
  },
  () => {
    const h = nz(-5, 5), k = nz(-5, 5);
    const [a, b] = pick([[3, 4], [5, 12], [6, 8], [8, 15]]);
    const px = h + a, py = k + b;
    const r2 = a * a + b * b;
    return {
      kind: 'values', prompt: `دائرة مركزها $(${h}, ${k})$ وتمر بالنقطة $(${px}, ${py})$. ما نصف قطرها؟`, answer: [R(Math.sqrt(r2))],
      hint: 'نصف القطر هو المسافة بين المركز وأي نقطة على الدائرة.',
      solution: [`$r = \\sqrt{(${px} - ${ps(h)})^2 + (${py} - ${ps(k)})^2} = \\sqrt{${r2}} = ${Math.sqrt(r2)}$`],
    };
  },
];

// ================= 2.3 =================
const s23: Gen[] = [
  () => {
    const a = nz(-4, 4), b = rnd(-6, 6), c = rnd(-9, 9), x = nz(-4, 4);
    return {
      kind: 'values', prompt: `إذا كان $f(x) = ${poly([a, b, c])}$، فأوجد $f(${x})$.`, answer: [R(a * x * x + b * x + c)],
      hint: 'عوّض بـ x بين قوسين، ثم اتبع ترتيب العمليات.',
      solution: [`$f(${x}) = ${a}(${x})^2 ${b < 0 ? '-' : '+'} ${Math.abs(b)}(${x}) ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${a * x * x + b * x + c}$`],
    };
  },
  () => {
    const a = nz(-4, 4), b = nz(-6, 6);
    return {
      kind: 'expr', prompt: `إذا كان $f(x) = ${poly([a, b])}$، فأوجد $f(x + h)$ وبسّطه.`, answer: `${a}x+${a}h+(${b})`, vars: ['x', 'h'], require: ['expanded'],
      hint: 'ضع (x + h) مكان كل x، ثم وزّع.',
      solution: [`$f(x + h) = ${a}(x + h) ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${a}x ${a < 0 ? '-' : '+'} ${Math.abs(a)}h ${b < 0 ? '-' : '+'} ${Math.abs(b)}$`],
      placeholder: 'مثال: 3x + 3h - 5',
    };
  },
  () => {
    const t = rnd(0, 3);
    const a = nz(-6, 6);
    if (t === 0)
      return choice(`ما مجال الدالة $f(x) = \\sqrt{x ${a < 0 ? '+' : '-'} ${Math.abs(a)}}$؟`, iv(String(a), '\\infty', true, false),
        [iv(String(a), '\\infty', false, false), iv('-\\infty', String(a), false, true), iv(String(-a), '\\infty', true, false)],
        'ما تحت الجذر التربيعي يجب أن يكون غير سالب.',
        [`$x ${a < 0 ? '+' : '-'} ${Math.abs(a)} \\ge 0 \\Rightarrow x \\ge ${a}$`, `المجال ${iv(String(a), '\\infty', true, false)}`]);
    if (t === 1)
      return choice(`ما مجال الدالة $f(x) = \\dfrac{3}{x ${a < 0 ? '+' : '-'} ${Math.abs(a)}}$؟`, `$(-\\infty, ${a}) \\cup (${a}, \\infty)$`,
        ['$(-\\infty, \\infty)$', `$(${a}, \\infty)$`, `$(-\\infty, ${-a}) \\cup (${-a}, \\infty)$`],
        'المقام لا يكون صفرًا.',
        [`$x ${a < 0 ? '+' : '-'} ${Math.abs(a)} = 0$ عند $x = ${a}$، فنستبعدها.`]);
    if (t === 2)
      return choice(`ما مجال الدالة $f(x) = ${poly([nz(-3, 3), rnd(-5, 5), rnd(-5, 5)])}$؟`, '$(-\\infty, \\infty)$', [`$[0, \\infty)$`, `$(0, \\infty)$`, `$(-\\infty, 0)$`],
        'كثير الحدود معرّف لكل عدد حقيقي.', ['لا يوجد مقام ولا جذر زوجي، فالمجال كل الأعداد الحقيقية.']);
    return choice(`ما مدى الدالة $f(x) = x^2 ${a < 0 ? '-' : '+'} ${Math.abs(a)}$؟`, iv(String(a), '\\infty', true, false),
      [iv('-\\infty', '\\infty', false, false), iv('0', '\\infty', true, false), iv(String(-a), '\\infty', true, false)],
      'x² لا يقل عن صفر.', [`$x^2 \\ge 0 \\Rightarrow x^2 ${a < 0 ? '-' : '+'} ${Math.abs(a)} \\ge ${a}$، فالمدى ${iv(String(a), '\\infty', true, false)}`]);
  },
  () => {
    const xs = shuffle([1, 2, 3, 4, 5, 6]).slice(0, 4);
    const isF = Math.random() < 0.5;
    const pts = xs.map((x) => [x, rnd(-5, 5)]);
    if (!isF) pts.push([xs[0], pts[0][1] + nz(1, 3)]);
    const txt = shuffle(pts).map(([x, y]) => `(${x}, ${y})`).join(', ');
    return choice(`هل العلاقة $\\{${txt}\\}$ دالة؟`, isF ? 'نعم، دالة' : 'لا، ليست دالة', [isF ? 'لا، ليست دالة' : 'نعم، دالة'],
      'الدالة: كل قيمة x تقابلها قيمة y واحدة فقط.',
      [isF ? 'كل الإحداثيات السينية مختلفة، فكل x له y واحد.' : `القيمة $x = ${xs[0]}$ تظهر مع قيمتين مختلفتين لـ y.`]);
  },
  () => {
    const p = nz(-5, 5);
    const items = [
      { f: `f(x) = (x ${p < 0 ? '+' : '-'} ${Math.abs(p)})^2`, inc: iv(String(p), '\\infty', false, false), dec: iv('-\\infty', String(p), false, false) },
      { f: `f(x) = -|x ${p < 0 ? '+' : '-'} ${Math.abs(p)}|`, inc: iv('-\\infty', String(p), false, false), dec: iv(String(p), '\\infty', false, false) },
    ];
    const it = pick(items);
    return choice(`على أي فترة تكون الدالة $${it.f}$ متزايدة؟`, it.inc, [it.dec, '$(-\\infty, \\infty)$', iv(String(-p), '\\infty', false, false)],
      'ارسم الدالة الأم ثم أزحها. المتزايدة: يصعد الرسم كلما تحركنا يمينًا.',
      [`رأس الرسم عند $x = ${p}$.`, `متزايدة على ${it.inc} ومتناقصة على ${it.dec}.`]);
  },
];

// ================= 2.4 =================
const s24: Gen[] = [
  () => {
    const x1 = nz(-8, 8), y1 = nz(-8, 8);
    let x2 = nz(-8, 8);
    while (x2 === x1) x2 = nz(-8, 8);
    const y2 = rnd(-8, 8);
    return {
      kind: 'values', prompt: `أوجد ميل المستقيم المار بالنقطتين $(${x1}, ${y1})$ و $(${x2}, ${y2})$.`, answer: [R((y2 - y1) / (x2 - x1))],
      hint: 'm = (y₂ − y₁) / (x₂ − x₁). يمكنك كتابة الكسر مثل -3/4.',
      solution: [`$m = \\dfrac{${y2} - ${ps(y1)}}{${x2} - ${ps(x1)}} = \\dfrac{${y2 - y1}}{${x2 - x1}} = ${frac(y2 - y1, x2 - x1)}$`],
      placeholder: 'مثال: -3/4',
    };
  },
  () => {
    for (;;) {
      const A = nz(-6, 6), B = nz(-6, 6), C = rnd(-12, 12);
      if (gcd(gcd(A, B), C) !== 1) continue;
      return {
        kind: 'values', ordered: true, prompt: `أوجد الميل ثم المقطع الصادي للمستقيم $${A === 1 ? '' : A === -1 ? '-' : A}x ${B < 0 ? '-' : '+'} ${Math.abs(B) === 1 ? '' : Math.abs(B)}y = ${C}$.`,
        answer: [R(-A / B), R(C / B)],
        hint: 'حل المعادلة بالنسبة إلى y لتصبح y = mx + b.',
        solution: [`$${B === 1 ? '' : B === -1 ? '-' : B}y = ${poly([-A, C])}$`, `$y = ${frac(-A, B)}x + ${frac(C, B)}$`.replace('+ -', '- '), `الميل $${frac(-A, B)}$ والمقطع الصادي $${frac(C, B)}$.`],
        placeholder: 'مثال: 2/3, -4',
      };
    }
  },
  () => {
    const a = nz(-3, 3), b = rnd(-5, 5), c = rnd(-5, 5);
    const x1 = rnd(-3, 1), x2 = x1 + rnd(1, 4);
    const f = (x: number) => a * x * x + b * x + c;
    return {
      kind: 'values', prompt: `أوجد متوسط معدل التغير للدالة $f(x) = ${poly([a, b, c])}$ على الفترة $[${x1}, ${x2}]$.`, answer: [R((f(x2) - f(x1)) / (x2 - x1))],
      hint: 'متوسط معدل التغير = (f(b) − f(a)) / (b − a)، وهو ميل القاطع.',
      solution: [`$f(${x2}) = ${f(x2)}$ و $f(${x1}) = ${f(x1)}$`, `$\\dfrac{${f(x2)} - ${ps(f(x1))}}{${x2} - ${ps(x1)}} = \\dfrac{${f(x2) - f(x1)}}{${x2 - x1}} = ${frac(f(x2) - f(x1), x2 - x1)}$`],
    };
  },
  () => {
    const x = nz(-6, 6), y = nz(-6, 6), t = pick(['h', 'v'] as const);
    return choice(`ما ميل المستقيم ${t === 'h' ? `$y = ${y}$` : `$x = ${x}$`}؟`, t === 'h' ? '$0$' : 'غير معرّف', [t === 'h' ? 'غير معرّف' : '$0$', `$${t === 'h' ? y : x}$`, '$1$'],
      t === 'h' ? 'المستقيم الأفقي: y لا يتغير.' : 'المستقيم الرأسي: x لا يتغير، فالمقام في قانون الميل صفر.',
      [t === 'h' ? 'كل نقاطه لها y نفسه، فالارتفاع صفر والميل 0.' : 'كل نقاطه لها x نفسه، فالمسافة الأفقية صفر، والقسمة على صفر غير معرّفة.']);
  },
  () => {
    const fixed = rnd(2, 8) * 100, per = rnd(2, 9) * 5, n = rnd(10, 60);
    return {
      kind: 'values', prompt: `تكلفة إنتاج $x$ قطعة هي $C(x) = ${per}x + ${fixed}$ ريال. كم تكلفة إنتاج ${n} قطعة؟ (وما معنى الميل ${per}؟ فكّر فيه)`, answer: [R(per * n + fixed)],
      hint: 'عوّض x = ' + n + '. الميل هو التكلفة الإضافية لكل قطعة.',
      solution: [`$C(${n}) = ${per}(${n}) + ${fixed} = ${per * n + fixed}$ ريال.`, `الميل ${per} يعني أن كل قطعة إضافية تكلف ${per} ريال (التكلفة الحدية)، و ${fixed} تكلفة ثابتة.`],
    };
  },
];

// ================= 2.5 =================
const s25: Gen[] = [
  () => {
    const x1 = nz(-5, 5), y1 = nz(-5, 5);
    let x2 = nz(-5, 5);
    while (x2 === x1) x2 = nz(-5, 5);
    const y2 = rnd(-6, 6);
    const p = y2 - y1, q = x2 - x1;
    return {
      kind: 'expr', prompt: `اكتب معادلة المستقيم المار بالنقطتين $(${x1}, ${y1})$ و $(${x2}, ${y2})$ بصيغة الميل والمقطع $y = mx + b$.`,
      answer: linP(p, q, q * y1 - p * x1, q), vars: ['x'], require: ['expanded'],
      hint: 'احسب الميل، ثم عوّض بنقطة في y − y₁ = m(x − x₁) وحل بالنسبة إلى y.',
      solution: [`$m = \\dfrac{${p}}{${q}} = ${frac(p, q)}$`, `$y - ${ps(y1)} = ${frac(p, q)}(x - ${ps(x1)})$`, `$y = ${lin(frac(p, q), frac(q * y1 - p * x1, q))}$`],
      placeholder: 'اكتب الطرف الأيمن، مثل 2/3x - 1',
    };
  },
  () => {
    const p = nz(-5, 5), q = rnd(1, 4), x0 = nz(-5, 5), y0 = nz(-5, 5), b0 = rnd(-6, 6);
    const perp = Math.random() < 0.5;
    const P = perp ? -q : p, Q = perp ? p : q;
    return {
      kind: 'expr', prompt: `اكتب معادلة المستقيم ${perp ? 'العمودي على' : 'الموازي لـ'} $y = ${lin(frac(p, q), String(b0))}$ والمار بالنقطة $(${x0}, ${y0})$، بصيغة $y = mx + b$.`,
      answer: linP(P, Q, Q * y0 - P * x0, Q), vars: ['x'], require: ['expanded'],
      hint: perp ? 'ميل العمودي هو المقلوب السالب: m₂ = −1/m₁.' : 'المستقيمات المتوازية لها الميل نفسه.',
      solution: [`الميل المطلوب $${frac(P, Q)}$.`, `$y - ${ps(y0)} = ${frac(P, Q)}(x - ${ps(x0)})$`, `$y = ${lin(frac(P, Q), frac(Q * y0 - P * x0, Q))}$`],
      placeholder: 'اكتب الطرف الأيمن، مثل -1/2x + 4',
    };
  },
  () => {
    const x0 = nz(-6, 6), y0 = nz(-6, 6), t = pick(['h', 'v'] as const);
    return choice(`ما معادلة المستقيم ${t === 'h' ? 'الأفقي' : 'الرأسي'} المار بالنقطة $(${x0}, ${y0})$؟`, t === 'h' ? `$y = ${y0}$` : `$x = ${x0}$`,
      [t === 'h' ? `$x = ${x0}$` : `$y = ${y0}$`, `$y = ${x0}$`, `$x = ${y0}$`],
      'الأفقي: y ثابت. الرأسي: x ثابت.', [t === 'h' ? `كل نقاط المستقيم الأفقي لها $y = ${y0}$.` : `كل نقاط المستقيم الرأسي لها $x = ${x0}$.`]);
  },
  () => {
    const a = nz(-5, 5), b = rnd(-6, 6);
    let c = nz(-5, 5);
    const rel = pick(['par', 'perp', 'none'] as const);
    let m1 = `${a}`, m2 = '';
    if (rel === 'par') m2 = `${a}`;
    else if (rel === 'perp') m2 = frac(-1, a);
    else { while (c === a || c * a === -1) c = nz(-5, 5); m2 = `${c}`; }
    return choice(`ما العلاقة بين المستقيمين $y = ${lin(m1, String(b))}$ و $y = ${lin(m2, String(b + nz(1, 4)))}$؟`,
      rel === 'par' ? 'متوازيان' : rel === 'perp' ? 'متعامدان' : 'لا متوازيان ولا متعامدان', ['متوازيان', 'متعامدان', 'لا متوازيان ولا متعامدان'],
      'قارن الميلين: متساويان ← متوازيان، حاصل ضربهما −1 ← متعامدان.',
      [`الميلان $${m1}$ و $${m2}$.`, rel === 'par' ? 'متساويان، فالمستقيمان متوازيان.' : rel === 'perp' ? `حاصل ضربهما $-1$، فهما متعامدان.` : 'ليسا متساويين وحاصل ضربهما ليس −1.']);
  },
];

// ================= 2.6 =================
const s26: Gen[] = [
  () => {
    const c = nz(-3, 3), a = nz(-4, 4), b = rnd(-5, 5), d = nz(-4, 4);
    const x = pick([c - 2, c - 1, c, c + 1, c + 2]);
    const v = x <= c ? a * x + b : d * x * x;
    return {
      kind: 'values', prompt: `لتكن $f(x) = \\begin{cases} ${poly([a, b])} & x \\le ${c} \\\\ ${poly([d, 0, 0])} & x > ${c} \\end{cases}$. أوجد $f(${x})$.`, answer: [R(v)],
      hint: 'حدد أي قاعدة تنطبق بمقارنة x بـ ' + c + ' أولًا.',
      solution: [`$${x} ${x <= c ? '\\le' : '>'} ${c}$، فنستخدم ${x <= c ? `$${poly([a, b])}$` : `$${poly([d, 0, 0])}$`}.`, `$f(${x}) = ${v}$`],
    };
  },
  () => {
    const x = pick([2.7, -2.7, 3, -0.5, 0.5, -3.2, 4.99, -1]);
    return {
      kind: 'values', prompt: `احسب $[\\![${x}]\\!]$ (دالة أكبر عدد صحيح).`, answer: [R(Math.floor(x))],
      hint: 'أكبر عدد صحيح أقل من أو يساوي العدد. انتبه للأعداد السالبة.',
      solution: [`أكبر عدد صحيح $\\le ${x}$ هو $${Math.floor(x)}$.`, ...(x < 0 && !Number.isInteger(x) ? [`لاحظ أن $${Math.floor(x)} < ${x}$: نتحرك يسارًا على خط الأعداد، لا نحو الصفر.`] : [])],
    };
  },
  () => {
    const items = [
      { f: 'f(x) = \\sqrt{x}', d: '$[0, \\infty)$', r: '$[0, \\infty)$' },
      { f: 'f(x) = |x|', d: '$(-\\infty, \\infty)$', r: '$[0, \\infty)$' },
      { f: 'f(x) = x^3', d: '$(-\\infty, \\infty)$', r: '$(-\\infty, \\infty)$' },
      { f: 'f(x) = x^2', d: '$(-\\infty, \\infty)$', r: '$[0, \\infty)$' },
      { f: 'f(x) = \\sqrt[3]{x}', d: '$(-\\infty, \\infty)$', r: '$(-\\infty, \\infty)$' },
    ];
    const it = pick(items);
    const ask = pick(['d', 'r'] as const);
    return choice(`ما ${ask === 'd' ? 'مجال' : 'مدى'} الدالة $${it.f}$؟`, ask === 'd' ? it.d : it.r, ['$[0, \\infty)$', '$(-\\infty, \\infty)$', '$(0, \\infty)$', '$(-\\infty, 0]$'],
      'تخيل الرسم: المجال ما يغطيه أفقيًا، والمدى ما يغطيه رأسيًا.',
      [`المجال ${it.d}، والمدى ${it.r}.`]);
  },
];

// ================= 2.7 =================
const s27: Gen[] = [
  () => {
    const h = nz(-5, 5), k = nz(-5, 5), base = pick([['x^2', 'x²'], ['|x|', '|x|'], ['\\sqrt{x}', '√x']] as const);
    const inner = `x ${h > 0 ? '-' : '+'} ${Math.abs(h)}`;
    const f = base[0] === 'x^2' ? `(${inner})^2` : base[0] === '|x|' ? `|${inner}|` : `\\sqrt{${inner}}`;
    const right = `إزاحة ${Math.abs(h)} ${h > 0 ? 'يمينًا' : 'يسارًا'} و ${Math.abs(k)} ${k > 0 ? 'للأعلى' : 'للأسفل'}`;
    return choice(`كيف نحصل على رسم $y = ${f} ${k > 0 ? '+' : '-'} ${Math.abs(k)}$ من رسم $y = ${base[0]}$؟`, right,
      [`إزاحة ${Math.abs(h)} ${h > 0 ? 'يسارًا' : 'يمينًا'} و ${Math.abs(k)} ${k > 0 ? 'للأعلى' : 'للأسفل'}`, `إزاحة ${Math.abs(k)} ${k > 0 ? 'يمينًا' : 'يسارًا'} و ${Math.abs(h)} ${h > 0 ? 'للأعلى' : 'للأسفل'}`, `إزاحة ${Math.abs(h)} ${h > 0 ? 'يسارًا' : 'يمينًا'} و ${Math.abs(k)} ${k > 0 ? 'للأسفل' : 'للأعلى'}`],
      'f(x − h): يمينًا بمقدار h. f(x) + k: للأعلى بمقدار k.',
      [`داخل الدالة $${inner}$: الإزاحة الأفقية عكس الإشارة، أي ${h > 0 ? 'يمينًا' : 'يسارًا'}.`, `خارج الدالة: ${k > 0 ? 'للأعلى' : 'للأسفل'} ${Math.abs(k)}.`]);
  },
  () => {
    const a = pick([2, 3, -2, -1, 0.5, -0.5]), h = nz(-4, 4), k = rnd(-5, 5);
    return {
      kind: 'expr', prompt: `اكتب معادلة الدالة الناتجة من $y = x^2$ بعد: ${a < 0 ? 'انعكاس حول المحور x، ثم ' : ''}${Math.abs(a) !== 1 ? `${Math.abs(a) > 1 ? 'تمدد' : 'انكماش'} رأسي بمعامل ${Math.abs(a)}، ثم ` : ''}إزاحة ${Math.abs(h)} ${h > 0 ? 'يمينًا' : 'يسارًا'}${k !== 0 ? ` و ${Math.abs(k)} ${k > 0 ? 'للأعلى' : 'للأسفل'}` : ''}.`,
      answer: `${a}(x-(${h}))^2+(${k})`, vars: ['x'],
      hint: 'الصيغة y = a(x − h)² + k: a للتمدد والانعكاس، h للإزاحة الأفقية، k للرأسية.',
      solution: [`$y = ${a === 1 ? '' : a === -1 ? '-' : a}(x ${h > 0 ? '-' : '+'} ${Math.abs(h)})^2${k === 0 ? '' : ` ${k > 0 ? '+' : '-'} ${Math.abs(k)}`}$`],
      placeholder: 'مثال: -2(x+3)^2 + 1',
    };
  },
  () => {
    const items = [
      { f: 'f(x) = x^4 - 3x^2', t: 'زوجية', why: 'كل الأسس زوجية، فـ f(−x) = f(x).' },
      { f: 'f(x) = x^3 + 5x', t: 'فردية', why: 'كل الأسس فردية، فـ f(−x) = −f(x).' },
      { f: 'f(x) = x^2 + 4x', t: 'لا زوجية ولا فردية', why: 'f(−x) = x² − 4x، لا يساوي f(x) ولا −f(x).' },
      { f: 'f(x) = |x| + 2', t: 'زوجية', why: '|−x| = |x|، فـ f(−x) = f(x).' },
      { f: 'f(x) = 2x^5 - x', t: 'فردية', why: 'f(−x) = −2x⁵ + x = −f(x).' },
      { f: 'f(x) = x^3 + 1', t: 'لا زوجية ولا فردية', why: 'f(−x) = −x³ + 1، و −f(x) = −x³ − 1. لا تساوي أيًا منهما.' },
      { f: 'f(x) = 7', t: 'زوجية', why: 'الدالة الثابتة: f(−x) = 7 = f(x).' },
    ];
    const it = pick(items);
    return choice(`هل الدالة $${it.f}$ زوجية أم فردية أم لا هذه ولا تلك؟`, it.t, ['زوجية', 'فردية', 'لا زوجية ولا فردية'],
      'احسب f(−x): إن ساوى f(x) فزوجية (تماثل حول المحور y)، وإن ساوى −f(x) ففردية (تماثل حول نقطة الأصل).', [it.why]);
  },
  () => {
    const items = [
      { e: 'y = x^2 + 2', s: 'المحور y فقط' },
      { e: 'x = y^2 - 3', s: 'المحور x فقط' },
      { e: 'x^2 + y^2 = 9', s: 'المحوران ونقطة الأصل' },
      { e: 'y = x^3', s: 'نقطة الأصل فقط' },
      { e: 'y = x^2 - 4x', s: 'لا تماثل' },
      { e: 'y = |x|', s: 'المحور y فقط' },
    ];
    const it = pick(items);
    return choice(`ما نوع تماثل رسم $${it.e}$؟`, it.s, ['المحور y فقط', 'المحور x فقط', 'نقطة الأصل فقط', 'المحوران ونقطة الأصل', 'لا تماثل'],
      'محور y: استبدل x بـ −x. محور x: استبدل y بـ −y. نقطة الأصل: الاثنان معًا. إن بقيت المعادلة كما هي فهناك تماثل.',
      [`نجري الاختبارات الثلاثة: الإجابة «${it.s}».`]);
  },
];

// ================= 2.8 =================
const s28: Gen[] = [
  () => {
    const a = nz(-4, 4), b = rnd(-6, 6), c = nz(-3, 3), d = rnd(-5, 5), x = nz(-3, 3);
    const f = (t: number) => a * t + b, g = (t: number) => c * t * t + d;
    const op = pick(['+', '-', '*'] as const);
    const val = op === '+' ? f(x) + g(x) : op === '-' ? f(x) - g(x) : f(x) * g(x);
    const name = op === '+' ? 'f + g' : op === '-' ? 'f - g' : 'fg';
    return {
      kind: 'values', prompt: `إذا كان $f(x) = ${poly([a, b])}$ و $g(x) = ${poly([c, 0, d])}$، فأوجد $(${name})(${x})$.`, answer: [R(val)],
      hint: 'احسب f(' + x + ') و g(' + x + ') كلًّا وحده، ثم طبّق العملية.',
      solution: [`$f(${x}) = ${f(x)}$ و $g(${x}) = ${g(x)}$`, `$(${name})(${x}) = ${f(x)} ${op === '*' ? '\\cdot' : op} ${ps(g(x))} = ${val}$`],
    };
  },
  () => {
    const a = nz(-4, 4), b = rnd(-6, 6), c = nz(-3, 3), d = rnd(-5, 5), x = nz(-3, 3);
    const f = (t: number) => a * t + b, g = (t: number) => c * t * t + d;
    const fg = Math.random() < 0.5;
    const val = fg ? f(g(x)) : g(f(x));
    return {
      kind: 'values', prompt: `إذا كان $f(x) = ${poly([a, b])}$ و $g(x) = ${poly([c, 0, d])}$، فأوجد $(${fg ? 'f \\circ g' : 'g \\circ f'})(${x})$.`, answer: [R(val)],
      hint: 'ابدأ بالدالة الداخلية (اليمنى) ثم ضع ناتجها في الخارجية.',
      solution: fg
        ? [`$g(${x}) = ${g(x)}$`, `$f(${g(x)}) = ${a === 1 ? '' : a === -1 ? '-' : a}(${g(x)}) ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${val}$`]
        : [`$f(${x}) = ${f(x)}$`, `$g(${f(x)}) = ${c}(${f(x)})^2 ${d < 0 ? '-' : '+'} ${Math.abs(d)} = ${val}$`],
    };
  },
  () => {
    const a = nz(-3, 3), b = rnd(-5, 5), c = nz(-3, 3), d = rnd(-5, 5);
    const fg = Math.random() < 0.5;
    // f(x) = a x + b , g(x) = c x^2 + d
    const ans = fg ? polyP([a * c, 0, a * d + b]) : polyP([c * a * a, 2 * a * b * c, c * b * b + d]);
    return {
      kind: 'expr', prompt: `إذا كان $f(x) = ${poly([a, b])}$ و $g(x) = ${poly([c, 0, d])}$، فأوجد $(${fg ? 'f \\circ g' : 'g \\circ f'})(x)$ وبسّطه.`, answer: ans, vars: ['x'], require: ['expanded'],
      hint: fg ? 'ضع g(x) كاملة مكان x في f.' : 'ضع f(x) كاملة مكان x في g، ثم فك المربع.',
      solution: fg
        ? [`$f(g(x)) = ${a}(${poly([c, 0, d])}) ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${poly([a * c, 0, a * d + b])}$`]
        : [`$g(f(x)) = ${c}(${poly([a, b])})^2 ${d < 0 ? '-' : '+'} ${Math.abs(d)}$`, `$= ${c}(${poly([a * a, 2 * a * b, b * b])}) ${d < 0 ? '-' : '+'} ${Math.abs(d)} = ${poly([c * a * a, 2 * a * b * c, c * b * b + d])}$`],
      placeholder: 'مثال: 4x^2 - 12x + 7',
    };
  },
  () => {
    const a = nz(-3, 3), b = rnd(-6, 6), c = rnd(-6, 6);
    return {
      kind: 'expr', prompt: `أوجد خارج قسمة الفرق $\\dfrac{f(x + h) - f(x)}{h}$ للدالة $f(x) = ${poly([a, b, c])}$ وبسّطه.`,
      answer: `${2 * a}x+${a}h+(${b})`, vars: ['x', 'h'], require: ['expanded'],
      hint: 'احسب f(x + h)، اطرح f(x) فتختفي حدود كثيرة، ثم اقسم كل حد على h.',
      solution: [
        `$f(x + h) = ${a === 1 ? '' : a === -1 ? '-' : a}(x + h)^2 ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}(x + h) ${c < 0 ? '-' : '+'} ${Math.abs(c)}$`.replace(/ [+-] 0\(x \+ h\)/, '').replace(/ [+-] 0\$$/, '$'),
        `$f(x + h) - f(x) = ${2 * a}xh + ${a === 1 ? '' : a === -1 ? '-' : a}h^2${b === 0 ? '' : ` ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}h`}$`.replace(/\+ -/g, '- '),
        `نقسم على $h$: $${poly([2 * a, 0])} ${a < 0 ? '-' : '+'} ${Math.abs(a) === 1 ? '' : Math.abs(a)}h ${b === 0 ? '' : `${b < 0 ? '-' : '+'} ${Math.abs(b)}`}$`,
      ],
      placeholder: 'مثال: 4x + 2h - 3',
    };
  },
  () => {
    const k = nz(1, 6);
    return choice(`إذا كان $f(x) = \\sqrt{x}$ و $g(x) = x - ${k}$، فما مجال $f \\circ g$؟`, iv(String(k), '\\infty', true, false),
      [iv('0', '\\infty', true, false), iv(String(-k), '\\infty', true, false), '$(-\\infty, \\infty)$'],
      'المجال: x في مجال g، و g(x) في مجال f.',
      [`$(f \\circ g)(x) = \\sqrt{x - ${k}}$، ويحتاج $x - ${k} \\ge 0$، أي $x \\ge ${k}$.`]);
  },
];

export const ch2: Record<string, Gen[]> = {
  '2.1': s21, '2.2': s22, '2.3': s23, '2.4': s24, '2.5': s25, '2.6': s26, '2.7': s27, '2.8': s28,
};
