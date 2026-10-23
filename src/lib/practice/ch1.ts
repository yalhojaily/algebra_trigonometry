// مولّدات تمارين الفصل 1: المعادلات والمتباينات
import {
  rnd, nz, pick, shuffle, lcm, R, Z, frac, poly, factor, cx, choice, type Problem,
} from '../gen';

type Gen = () => Problem;

// ===== مساعدات الفترات =====
const INF = '\\infty';
function iv(a: string, b: string, lc: boolean, rc: boolean) {
  return `$${lc ? '[' : '('}${a}, ${b}${rc ? ']' : ')'}$`;
}
const left = (r: number | string, closed: boolean) => iv(`-${INF}`, String(r), false, closed);
const right = (r: number | string, closed: boolean) => iv(String(r), INF, closed, false);
function union(x: string, y: string) {
  return x.replace(/\$$/, '') + ' \\cup ' + y.replace(/^\$/, '');
}
const OPS = { lt: '<', le: '\\le', gt: '>', ge: '\\ge' } as const;
type Op = keyof typeof OPS;
const flip: Record<Op, Op> = { lt: 'gt', le: 'ge', gt: 'lt', ge: 'le' };

// ================= 1.1 =================
const s11: Gen[] = [
  () => {
    const x0 = nz(-9, 9), a = nz(-5, 6), b = nz(-6, 6), c = nz(-9, 9);
    let d = nz(-5, 6);
    while (d === a) d = nz(-5, 6);
    const e = a * (x0 + b) + c - d * x0;
    const lhs = `${a === 1 ? '' : a === -1 ? '-' : a}(x ${b < 0 ? '-' : '+'} ${Math.abs(b)}) ${c < 0 ? '-' : '+'} ${Math.abs(c)}`;
    const rhs = poly([d, e]);
    return {
      kind: 'values',
      prompt: `حل المعادلة: $${lhs} = ${rhs}$`,
      answer: [R(x0)],
      hint: 'وزّع الضرب أولًا، ثم اجمع حدود x في طرف والثوابت في الطرف الآخر.',
      solution: [
        `نوزّع: $${poly([a, a * b + c])} = ${rhs}$`,
        `ننقل حدود $x$ يسارًا والثوابت يمينًا: $${poly([a - d])}x = ${e - a * b - c}$`.replace('$1x', '$x').replace('$-1x', '$-x'),
        `نقسم على $${a - d}$: $x = ${x0}$`,
        `تحقق: عوّض $x=${x0}$ في الطرفين فتجد كليهما يساوي $${d * x0 + e}$.`,
      ],
    };
  },
  () => {
    const [p, q] = shuffle([2, 3, 4, 5, 6]).slice(0, 2);
    const L = lcm(p, q);
    const x0 = L * nz(-4, 4);
    const k = x0 / p + x0 / q;
    return {
      kind: 'values',
      prompt: `حل المعادلة: $\\dfrac{x}{${p}} + \\dfrac{x}{${q}} = ${k}$`,
      answer: [R(x0)],
      hint: `اضرب الطرفين في المضاعف المشترك الأصغر للمقامين (${L}) لتتخلص من الكسور.`,
      solution: [
        `المضاعف المشترك الأصغر (LCD) هو $${L}$. نضرب كل حد فيه:`,
        `$${L / p}x + ${L / q}x = ${k * L}$`,
        `$${L / p + L / q}x = ${k * L}$`,
        `$x = ${x0}$`,
      ],
    };
  },
  () => {
    const a = nz(2, 6), b = nz(-6, 6);
    const type = pick(['identity', 'contradiction', 'conditional'] as const);
    let rhs: string;
    if (type === 'identity') rhs = poly([a, a * b]);
    else if (type === 'contradiction') rhs = poly([a, a * b + nz(-5, 5)]);
    else rhs = poly([a + nz(1, 3), a * b + rnd(-5, 5)]);
    const lhs = `${a}(x ${b < 0 ? '-' : '+'} ${Math.abs(b)})`;
    const names = {
      identity: 'متطابقة (Identity): مجموعة الحل كل الأعداد الحقيقية',
      contradiction: 'تناقض (Contradiction): مجموعة الحل خالية ∅',
      conditional: 'معادلة مشروطة (Conditional): حل واحد فقط',
    };
    const why = {
      identity: 'بعد التوزيع يصبح الطرفان متطابقين تمامًا، فتختفي x ويبقى عبارة صحيحة دائمًا مثل 0 = 0.',
      contradiction: 'بعد التوزيع تختفي x ويبقى عبارة خاطئة دائمًا مثل 0 = 5.',
      conditional: 'معاملا x في الطرفين مختلفان، فلا تختفي x ونحصل على قيمة واحدة لها.',
    };
    return choice(
      `صنّف المعادلة: $${lhs} = ${rhs}$`,
      names[type],
      Object.values(names).filter((n) => n !== names[type]),
      'وزّع الطرف الأيسر وقارن معامل x والثابت في الطرفين.',
      [`بالتوزيع: $${poly([a, a * b])} = ${rhs}$`, why[type]],
    );
  },
  () => {
    const items = [
      { f: 'P = 2L + 2W', v: 'W', right: 'W = \\dfrac{P - 2L}{2}', wrong: ['W = P - L', 'W = \\dfrac{P}{2} - 2L', 'W = \\dfrac{P - L}{2}'] },
      { f: 'A = \\tfrac{1}{2}bh', v: 'h', right: 'h = \\dfrac{2A}{b}', wrong: ['h = \\dfrac{A}{2b}', 'h = 2Ab', 'h = \\dfrac{b}{2A}'] },
      { f: 'V = lwh', v: 'w', right: 'w = \\dfrac{V}{lh}', wrong: ['w = V - lh', 'w = Vlh', 'w = \\dfrac{lh}{V}'] },
      { f: 'F = \\tfrac{9}{5}C + 32', v: 'C', right: 'C = \\tfrac{5}{9}(F - 32)', wrong: ['C = \\tfrac{5}{9}F - 32', 'C = \\tfrac{9}{5}(F - 32)', 'C = \\tfrac{5}{9}(F + 32)'] },
      { f: 'A = P(1 + rt)', v: 't', right: 't = \\dfrac{A - P}{Pr}', wrong: ['t = \\dfrac{A}{Pr} - 1', 't = \\dfrac{A - P}{r}', 't = A - P - r'] },
      { f: 'I = Prt', v: 'r', right: 'r = \\dfrac{I}{Pt}', wrong: ['r = I - Pt', 'r = \\dfrac{Pt}{I}', 'r = IPt'] },
    ];
    const it = pick(items);
    return choice(
      `حل الصيغة $${it.f}$ بالنسبة للمتغير $${it.v}$:`,
      `$${it.right}$`,
      it.wrong.map((w) => `$${w}$`),
      `عامل كل الرموز الأخرى كأنها أعداد، واعزل $${it.v}$ بالعمليات العكسية.`,
      [`نعزل $${it.v}$ خطوة بخطوة بعكس العمليات المطبقة عليه، فنحصل على $${it.right}$.`],
    );
  },
];

// ================= 1.2 =================
const s12: Gen[] = [
  () => {
    const w = rnd(4, 20), k = rnd(2, 9);
    const P = 2 * (w + k) + 2 * w;
    return {
      kind: 'values',
      prompt: `طول مستطيل يزيد على عرضه بمقدار ${k} سم، ومحيطه ${P} سم. أوجد العرض (بالسنتيمتر).`,
      answer: [R(w)],
      hint: 'افرض العرض x، فيكون الطول x + ' + k + '، واستخدم P = 2L + 2W.',
      solution: [
        `ليكن العرض $x$، إذن الطول $x + ${k}$.`,
        `$2(x + ${k}) + 2x = ${P}$`,
        `$4x + ${2 * k} = ${P} \\Rightarrow 4x = ${P - 2 * k} \\Rightarrow x = ${w}$`,
        `العرض ${w} سم والطول ${w + k} سم.`,
      ],
    };
  },
  () => {
    const v1 = rnd(4, 12) * 5, v2 = rnd(4, 12) * 5, t = pick([1, 1.5, 2, 2.5, 3, 4]);
    const d = (v1 + v2) * t;
    return {
      kind: 'values',
      prompt: `انطلقت سيارتان في الوقت نفسه من مدينتين بينهما ${d} كم، كل منهما باتجاه الأخرى. سرعة الأولى ${v1} كم/س والثانية ${v2} كم/س. بعد كم ساعة تلتقيان؟`,
      answer: [R(t)],
      hint: 'المسافة = السرعة × الزمن. مجموع المسافتين اللتين تقطعهما السيارتان يساوي المسافة الكلية.',
      solution: [
        `ليكن الزمن $t$ ساعة. تقطع الأولى $${v1}t$ والثانية $${v2}t$.`,
        `$${v1}t + ${v2}t = ${d}$`,
        `$${v1 + v2}t = ${d} \\Rightarrow t = ${t}$ ساعة.`,
      ],
      placeholder: 'مثال: 2.5',
    };
  },
  () => {
    // L لترات بتركيز a% نضيف إليها x لترات بتركيز b% لنحصل على c%
    for (;;) {
      const a = pick([10, 15, 20, 25, 30]);
      const b = pick([50, 60, 70, 80, 100]);
      const c = pick([30, 35, 40, 45, 50, 60].filter((v) => v > a && v < b));
      if (!c) continue;
      const L = pick([4, 5, 6, 8, 10, 12, 15, 20]);
      const x = (L * (c - a)) / (b - c);
      if (!Number.isInteger(x) || x <= 0) continue;
      return {
        kind: 'values',
        prompt: `لدى كيميائي ${L} لترات من محلول تركيزه ${a}٪. كم لترًا من محلول تركيزه ${b}٪ يجب أن يضيف ليحصل على خليط تركيزه ${c}٪؟`,
        answer: [R(x)],
        hint: 'كمية المادة النقية = التركيز × الحجم. مجموع المادة النقية قبل الخلط = المادة النقية في الخليط.',
        solution: [
          `ليكن $x$ عدد لترات المحلول ${b}٪.`,
          `$${a / 100}(${L}) + ${b / 100}x = ${c / 100}(${L} + x)$`,
          `$${(a * L) / 100} + ${b / 100}x = ${(c * L) / 100} + ${c / 100}x$`,
          `$${(b - c) / 100}x = ${((c - a) * L) / 100} \\Rightarrow x = ${x}$ لتر.`,
        ],
      };
    }
  },
  () => {
    const total = pick([10000, 12000, 15000, 20000, 25000]);
    const r1 = pick([2, 3, 4]), r2 = pick([5, 6, 7]);
    const x = pick([2000, 3000, 4000, 5000, 6000, 8000].filter((v) => v < total));
    const I = (x * r1) / 100 + ((total - x) * r2) / 100;
    return {
      kind: 'values',
      prompt: `استثمر شخص ${total} ريال، جزء منها بفائدة بسيطة ${r1}٪ سنويًا والباقي بفائدة ${r2}٪. إذا كانت الفائدة الكلية بعد سنة ${I} ريال، فكم استثمر بفائدة ${r1}٪؟`,
      answer: [R(x)],
      hint: 'افرض المبلغ الأول x، فالباقي ' + total + ' − x. الفائدة = المبلغ × النسبة.',
      solution: [
        `$${r1 / 100}x + ${r2 / 100}(${total} - x) = ${I}$`,
        `$${r1 / 100}x + ${(total * r2) / 100} - ${r2 / 100}x = ${I}$`,
        `$-${(r2 - r1) / 100}x = ${I - (total * r2) / 100}$`,
        `$x = ${x}$ ريال.`,
      ],
    };
  },
  () => {
    const n = rnd(-20, 40);
    const s = 3 * n + 3;
    return {
      kind: 'values',
      prompt: `مجموع ثلاثة أعداد صحيحة متتالية يساوي ${s}. ما أصغرها؟`,
      answer: [R(n)],
      hint: 'الأعداد المتتالية: x و x + 1 و x + 2.',
      solution: [`$x + (x+1) + (x+2) = ${s}$`, `$3x + 3 = ${s} \\Rightarrow x = ${n}$`, `الأعداد: ${n}، ${n + 1}، ${n + 2}.`],
    };
  },
];

// ================= 1.3 =================
const s13: Gen[] = [
  () => {
    const n = rnd(5, 99);
    const r = n % 4;
    const val = [Z(1, 0), Z(0, 1), Z(-1, 0), Z(0, -1)][r];
    const txt = ['1', 'i', '-1', '-i'][r];
    return {
      kind: 'values',
      prompt: `بسّط: $i^{${n}}$`,
      answer: [val],
      hint: 'قوى i تتكرر كل 4: اقسم الأس على 4 وانظر إلى الباقي.',
      solution: [`$${n} = 4 \\cdot ${Math.floor(n / 4)} + ${r}$`, `$i^{${n}} = (i^4)^{${Math.floor(n / 4)}} \\cdot i^{${r}} = 1 \\cdot i^{${r}} = ${txt}$`],
      placeholder: 'مثال: -i',
    };
  },
  () => {
    const a = nz(-9, 9), b = nz(-9, 9), c = nz(-9, 9), d = nz(-9, 9);
    const minus = Math.random() < 0.5;
    const re = minus ? a - c : a + c, im = minus ? b - d : b + d;
    return {
      kind: 'values',
      prompt: `أوجد الناتج بالصيغة $a + bi$: $(${cx(a, b)}) ${minus ? '-' : '+'} (${cx(c, d)})$`,
      answer: [Z(re, im)],
      hint: 'اجمع (أو اطرح) الجزأين الحقيقيين معًا، والجزأين التخيليين معًا.',
      solution: [`$(${a} ${minus ? '-' : '+'} ${c < 0 ? `(${c})` : c}) + (${b} ${minus ? '-' : '+'} ${d < 0 ? `(${d})` : d})i = ${cx(re, im)}$`],
      placeholder: 'مثال: 3-2i',
    };
  },
  () => {
    const a = nz(-6, 6), b = nz(-6, 6), c = nz(-6, 6), d = nz(-6, 6);
    const re = a * c - b * d, im = a * d + b * c;
    return {
      kind: 'values',
      prompt: `أوجد الناتج بالصيغة $a + bi$: $(${cx(a, b)})(${cx(c, d)})$`,
      answer: [Z(re, im)],
      hint: 'وزّع كما في (FOIL) ثم عوّض i² = −1.',
      solution: [
        `$= ${a * c} + ${a * d}i + ${b * c}i + ${b * d}i^2$`.replace(/\+ -/g, '- '),
        `$= ${a * c} + ${a * d + b * c}i ${b * d < 0 ? '+' : '-'} ${Math.abs(b * d)}$`.replace(/\+ -/g, '- '),
        `$= ${cx(re, im)}$`,
      ],
      placeholder: 'مثال: 7+i',
    };
  },
  () => {
    const zr = nz(-5, 5), zi = nz(-5, 5), wr = nz(-4, 4), wi = nz(-4, 4);
    const nr = zr * wr - zi * wi, ni = zr * wi + zi * wr;
    const den = wr * wr + wi * wi;
    return {
      kind: 'values',
      prompt: `أوجد الناتج بالصيغة $a + bi$: $\\dfrac{${cx(nr, ni)}}{${cx(wr, wi)}}$`,
      answer: [Z(zr, zi)],
      hint: 'اضرب البسط والمقام في مرافق المقام (Conjugate).',
      solution: [
        `مرافق المقام هو $${cx(wr, -wi)}$، ونضرب به البسط والمقام.`,
        `المقام: $(${cx(wr, wi)})(${cx(wr, -wi)}) = ${wr}^2 + ${wi}^2 = ${den}$`.replace(/(-\d+)\^2/g, '($1)^2'),
        `البسط: $(${cx(nr, ni)})(${cx(wr, -wi)}) = ${cx(zr * den, zi * den)}$`,
        `النتيجة: $\\dfrac{${cx(zr * den, zi * den)}}{${den}} = ${cx(zr, zi)}$`,
      ],
      placeholder: 'مثال: 2-3i',
    };
  },
  () => {
    const [p, q] = shuffle([1, 2, 3, 4, 5, 6]).slice(0, 2);
    const kind = pick(['mul', 'div', 'add'] as const);
    if (kind === 'mul')
      return {
        kind: 'values',
        prompt: `بسّط: $\\sqrt{-${p * p}} \\cdot \\sqrt{-${q * q}}$`,
        answer: [R(-p * q)],
        hint: 'حوّل كل جذر سالب إلى الصيغة i√a قبل الضرب. لا تضرب ما تحت الجذرين مباشرة.',
        solution: [`$\\sqrt{-${p * p}} = ${p}i,\\; \\sqrt{-${q * q}} = ${q}i$`, `$${p}i \\cdot ${q}i = ${p * q}i^2 = -${p * q}$`],
      };
    if (kind === 'div')
      return {
        kind: 'values',
        prompt: `بسّط: $\\dfrac{\\sqrt{-${p * p * q * q}}}{\\sqrt{${q * q}}}$`,
        answer: [Z(0, p)],
        hint: 'اكتب √(−a) = i√a أولًا.',
        solution: [`$\\sqrt{-${p * p * q * q}} = ${p * q}i$`, `$\\dfrac{${p * q}i}{${q}} = ${p === 1 ? '' : p}i$`],
        placeholder: 'مثال: 3i',
      };
    return {
      kind: 'values',
      prompt: `بسّط: $\\sqrt{-${p * p}} + \\sqrt{-${q * q}}$`,
      answer: [Z(0, p + q)],
      hint: 'كل جذر سالب يصبح عددًا تخيليًا، ثم اجمع.',
      solution: [`$${p}i + ${q}i = ${p + q}i$`],
      placeholder: 'مثال: 5i',
    };
  },
];

// ================= 1.4 =================
const s14: Gen[] = [
  () => {
    const r1 = nz(-9, 9), r2 = nz(-9, 9);
    const b = -(r1 + r2), c = r1 * r2;
    return {
      kind: 'values',
      prompt: `حل بالتحليل: $${poly([1, b, c])} = 0$`,
      answer: r1 === r2 ? [R(r1)] : [R(r1), R(r2)],
      hint: `ابحث عن عددين حاصل ضربهما ${c} ومجموعهما ${b}.`,
      solution: [
        `$${factor(r1)}${factor(r2)} = 0$`,
        `بخاصية الضرب الصفري: $x ${r1 < 0 ? '+' : '-'} ${Math.abs(r1)} = 0$ أو $x ${r2 < 0 ? '+' : '-'} ${Math.abs(r2)} = 0$`,
        `مجموعة الحل: $\\{${[...new Set([r1, r2])].join(', ')}\\}$`,
      ],
      placeholder: 'افصل بين الحلول بفاصلة: 2, -5',
    };
  },
  () => {
    const h = nz(-6, 6), k = rnd(1, 9);
    const neg = Math.random() < 0.35;
    const K = neg ? -k * k : k * k;
    return {
      kind: 'values',
      prompt: `حل باستخدام خاصية الجذر التربيعي: $(x ${h < 0 ? '+' : '-'} ${Math.abs(h)})^2 = ${K}$`,
      answer: neg ? [Z(h, k), Z(h, -k)] : [R(h + k), R(h - k)],
      hint: 'إذا كان u² = k فإن u = ±√k. لا تنسَ الإشارة ±.',
      solution: neg
        ? [`$x ${h < 0 ? '+' : '-'} ${Math.abs(h)} = \\pm\\sqrt{${K}} = \\pm ${k}i$`, `$x = ${h} \\pm ${k}i$`]
        : [`$x ${h < 0 ? '+' : '-'} ${Math.abs(h)} = \\pm ${k}$`, `$x = ${h} \\pm ${k}$، أي $x = ${h + k}$ أو $x = ${h - k}$`],
      placeholder: neg ? 'مثال: 2+3i, 2-3i' : 'مثال: 7, -1',
    };
  },
  () => {
    const p = nz(-5, 5), q = rnd(1, 5);
    const b = -2 * p, c = p * p + q * q;
    return {
      kind: 'values',
      prompt: `حل باستخدام القانون العام: $${poly([1, b, c])} = 0$`,
      answer: [Z(p, q), Z(p, -q)],
      hint: 'المميز سالب هنا، لذا الحلول أعداد مركبة: √(−a) = i√a.',
      solution: [
        `$a = 1,\\; b = ${b},\\; c = ${c}$`,
        `$b^2 - 4ac = ${b * b} - ${4 * c} = ${b * b - 4 * c}$`,
        `$x = \\dfrac{${-b} \\pm \\sqrt{${b * b - 4 * c}}}{2} = \\dfrac{${-b} \\pm ${2 * q}i}{2} = ${p} \\pm ${q === 1 ? '' : q}i$`,
      ],
      placeholder: 'مثال: 1+2i, 1-2i',
    };
  },
  () => {
    for (;;) {
      const b = nz(-8, 8), c = nz(-10, 10);
      const D = b * b - 4 * c;
      if (D <= 0 || Number.isInteger(Math.sqrt(D))) continue;
      return {
        kind: 'values',
        prompt: `حل باستخدام القانون العام: $${poly([1, b, c])} = 0$`,
        answer: [R((-b + Math.sqrt(D)) / 2), R((-b - Math.sqrt(D)) / 2)],
        hint: 'يمكنك كتابة الإجابة بصيغة مثل (−3+sqrt(13))/2 وسيقارنها الموقع رياضيًا.',
        solution: [
          `$a = 1,\\; b = ${b},\\; c = ${c}$`,
          `$b^2 - 4ac = ${b * b} ${-4 * c < 0 ? '-' : '+'} ${Math.abs(4 * c)} = ${D}$`,
          `$x = \\dfrac{${-b} \\pm \\sqrt{${D}}}{2}$`,
        ],
        placeholder: 'مثال: (-3+sqrt(13))/2, (-3-sqrt(13))/2',
      };
    }
  },
  () => {
    const kind = pick(['rat2', 'irr2', 'one', 'cplx'] as const);
    let a = 1, b = 0, c = 0;
    if (kind === 'rat2') { const r1 = nz(-6, 6); let r2 = nz(-6, 6); while (r2 === r1) r2 = nz(-6, 6); a = pick([1, 2]); b = -a * (r1 + r2); c = a * r1 * r2; }
    if (kind === 'one') { const r = nz(-6, 6); a = pick([1, 4]); b = -2 * a * r; c = a * r * r; }
    if (kind === 'irr2') { for (;;) { a = pick([1, 2, 3]); b = nz(-7, 7); c = nz(-6, 6); const D = b * b - 4 * a * c; if (D > 0 && !Number.isInteger(Math.sqrt(D))) break; } }
    if (kind === 'cplx') { for (;;) { a = pick([1, 2, 3]); b = rnd(-5, 5); c = rnd(2, 9); if (b * b - 4 * a * c < 0) break; } }
    const D = b * b - 4 * a * c;
    const labels = {
      rat2: 'حلّان حقيقيان نسبيان (المميز مربع كامل موجب)',
      irr2: 'حلّان حقيقيان غير نسبيين (المميز موجب وليس مربعًا كاملًا)',
      one: 'حل حقيقي واحد مكرر (المميز = 0)',
      cplx: 'حلّان مركبان غير حقيقيين مترافقان (المميز سالب)',
    };
    return choice(
      `احسب المميز $b^2 - 4ac$ للمعادلة $${poly([a, b, c])} = 0$ وحدد نوع حلولها.`,
      labels[kind],
      Object.values(labels).filter((l) => l !== labels[kind]),
      'المعاملات صحيحة، لذا انظر إلى إشارة المميز وهل هو مربع كامل.',
      [`$b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${D}$`, labels[kind] + '.'],
    );
  },
];

// ================= 1.5 =================
const s15: Gen[] = [
  () => {
    const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]);
    const k = pick([1, 2, 3]);
    const findLeg = Math.random() < 0.5;
    if (findLeg)
      return {
        kind: 'values',
        prompt: `سلّم طوله ${c * k} قدمًا يستند إلى جدار، وقاعدته تبعد ${a * k} أقدام عن الجدار. ما ارتفاع النقطة التي يلمس عندها الجدار؟`,
        answer: [R(b * k)],
        hint: 'السلم هو الوتر. استخدم a² + b² = c².',
        solution: [`$${a * k}^2 + h^2 = ${c * k}^2$`, `$h^2 = ${c * c * k * k} - ${a * a * k * k} = ${b * b * k * k}$`, `$h = ${b * k}$ (نرفض الحل السالب لأنه طول).`],
      };
    return {
      kind: 'values',
      prompt: `مثلث قائم طولا ضلعي القائمة ${a * k} و ${b * k}. أوجد طول الوتر.`,
      answer: [R(c * k)],
      hint: 'نظرية فيثاغورس: a² + b² = c².',
      solution: [`$c^2 = ${a * k}^2 + ${b * k}^2 = ${c * c * k * k}$`, `$c = ${c * k}$`],
    };
  },
  () => {
    const t1 = rnd(1, 3), t2 = t1 + rnd(1, 4);
    const v0 = 16 * (t1 + t2), h = 16 * t1 * t2;
    return {
      kind: 'values',
      prompt: `قُذف جسم رأسيًا من سطح الأرض بسرعة ${v0} قدم/ث، فارتفاعه بعد $t$ ثانية هو $s = -16t^2 + ${v0}t$. متى يكون على ارتفاع ${h} قدمًا؟ (اكتب الزمنين)`,
      answer: [R(t1), R(t2)],
      hint: `ضع s = ${h} وانقل كل الحدود لطرف واحد، ثم اقسم على −16 وحلل.`,
      solution: [
        `$-16t^2 + ${v0}t = ${h}$`,
        `$16t^2 - ${v0}t + ${h} = 0 \\Rightarrow t^2 - ${t1 + t2}t + ${t1 * t2} = 0$`,
        `$(t - ${t1})(t - ${t2}) = 0 \\Rightarrow t = ${t1}$ أو $t = ${t2}$`,
        'وجود حلين منطقي: مرة وهو صاعد ومرة وهو هابط.',
      ],
      placeholder: 'مثال: 1, 4',
    };
  },
  () => {
    const v0 = 16 * rnd(2, 8);
    return {
      kind: 'values',
      prompt: `قُذف حجر رأسيًا من الأرض، وارتفاعه $s = -16t^2 + ${v0}t$. بعد كم ثانية يعود إلى الأرض؟`,
      answer: [R(v0 / 16)],
      hint: 'يعود إلى الأرض عندما s = 0. حلّل بإخراج t عاملًا مشتركًا.',
      solution: [`$-16t^2 + ${v0}t = 0$`, `$-16t(t - ${v0 / 16}) = 0$`, `$t = 0$ (لحظة الانطلاق) أو $t = ${v0 / 16}$ ثانية.`],
    };
  },
  () => {
    const w = rnd(3, 14), k = rnd(2, 8);
    const A = w * (w + k);
    return {
      kind: 'values',
      prompt: `قطعة أرض مستطيلة طولها يزيد على عرضها بمقدار ${k} م، ومساحتها ${A} م². أوجد العرض.`,
      answer: [R(w)],
      hint: 'x(x + ' + k + ') = ' + A + '، ثم حلّل. الطول لا يكون سالبًا.',
      solution: [`$x(x + ${k}) = ${A} \\Rightarrow x^2 + ${k}x - ${A} = 0$`, `$(x - ${w})(x + ${w + k}) = 0$`, `$x = ${w}$ (نرفض $x = -${w + k}$).`],
    };
  },
];

// ================= 1.6 =================
const s16: Gen[] = [
  () => {
    for (;;) {
      const a = nz(1, 9), b = nz(1, 9), p = nz(-6, 6), q = nz(-6, 6);
      if (a === b || p === q) continue;
      const num = b * p - a * q, den = a - b;
      if (num % den !== 0) continue;
      const x = num / den;
      if (x === -p || x === -q) continue;
      return {
        kind: 'values',
        prompt: `حل المعادلة: $\\dfrac{${a}}{${poly([1, p])}} = \\dfrac{${b}}{${poly([1, q])}}$`,
        answer: [R(x)],
        hint: 'اضرب تبادليًا، وتذكّر استبعاد القيم التي تجعل أي مقام صفرًا.',
        solution: [
          `القيم الممنوعة: $x \\ne ${-p}$ و $x \\ne ${-q}$.`,
          `$${a}(${poly([1, q])}) = ${b}(${poly([1, p])})$`,
          `$${poly([a, a * q])} = ${poly([b, b * p])}$`,
          `$${poly([a - b])}x = ${b * p - a * q} \\Rightarrow x = ${x}$`.replace('$1x', '$x').replace('$-1x', '$-x'),
        ],
      };
    }
  },
  () => {
    const k = nz(-6, 6);
    let m = nz(2, 5);
    if (Math.random() < 0.5) m = -m;
    return {
      kind: 'values',
      prompt: `حل المعادلة (إن وُجد حل): $\\dfrac{x}{${poly([1, -k])}} = \\dfrac{${k}}{${poly([1, -k])}} ${m < 0 ? '-' : '+'} ${Math.abs(m)}$`,
      answer: [],
      hint: 'اكتب القيمة الممنوعة أولًا، ثم اضرب في المقام وتحقق من الحل.',
      solution: [
        `القيمة الممنوعة: $x \\ne ${k}$.`,
        `نضرب في $${poly([1, -k])}$: $x = ${k} ${m < 0 ? '-' : '+'} ${Math.abs(m)}(${poly([1, -k])})$`,
        `$${poly([1, -k])} = ${m}(${poly([1, -k])}) \\Rightarrow (${1 - m})(${poly([1, -k])}) = 0 \\Rightarrow x = ${k}$`,
        `لكن $x = ${k}$ ممنوعة، فهو حل دخيل (Extraneous). مجموعة الحل خالية ∅. اكتب: لا يوجد`,
      ],
      placeholder: 'إن لم يوجد حل اكتب: لا يوجد',
    };
  },
  () => {
    const [a, b] = pick([[3, 6], [4, 12], [6, 12], [10, 15], [12, 24], [20, 30], [2, 6], [5, 20], [6, 3], [8, 24]]);
    const t = (a * b) / (a + b);
    return {
      kind: 'values',
      prompt: `يستطيع عامل إنجاز عمل وحده في ${a} ساعات، ويستطيع زميله إنجازه وحده في ${b} ساعة. كم ساعة يحتاجان إذا عملا معًا؟`,
      answer: [R(t)],
      hint: 'معدل العمل = 1 ÷ الزمن. مجموع المعدلين × الزمن المشترك = 1 عمل كامل.',
      solution: [
        `$\\dfrac{1}{${a}}t + \\dfrac{1}{${b}}t = 1$`,
        `نضرب في $${lcm(a, b)}$: $${lcm(a, b) / a === 1 ? '' : lcm(a, b) / a}t + ${lcm(a, b) / b === 1 ? '' : lcm(a, b) / b}t = ${lcm(a, b)}$`,
        Number.isInteger(t)
          ? `$${lcm(a, b) / a + lcm(a, b) / b}t = ${lcm(a, b)} \\Rightarrow t = ${t}$ ساعة.`
          : `$t = ${frac(lcm(a, b), lcm(a, b) / a + lcm(a, b) / b)} = ${t}$ ساعة.`,
      ],
      placeholder: 'مثال: 4 أو 2.4',
    };
  },
  () => {
    // √(x + a) = x − b
    for (;;) {
      const b = rnd(-4, 5), s = rnd(1, 5);
      const r = b + s; // الحل الصحيح: r − b = s ≥ 0
      const a = s * s - r;
      const other = 2 * b + 1 - r;
      const ok = (x: number) => x + a >= 0 && x - b >= 0 && Math.abs(Math.sqrt(x + a) - (x - b)) < 1e-9;
      const sols = [...new Set([r, other])].filter(ok);
      const ext = [r, other].filter((x) => !ok(x));
      const rhs = b === 0 ? 'x' : `x ${b > 0 ? '-' : '+'} ${Math.abs(b)}`;
      const lhs = a === 0 ? '\\sqrt{x}' : `\\sqrt{x ${a > 0 ? '+' : '-'} ${Math.abs(a)}}`;
      return {
        kind: 'values',
        prompt: `حل المعادلة: $${lhs} = ${rhs}$`,
        answer: sols.map(R),
        hint: 'ربّع الطرفين، حل المعادلة التربيعية، ثم تحقق من كل حل في المعادلة الأصلية.',
        solution: [
          `نربع الطرفين: $x ${a < 0 ? '-' : '+'} ${Math.abs(a)} = (${rhs})^2$`,
          `$${poly([1, -(2 * b + 1), b * b - a])} = 0 \\Rightarrow x = ${r}$ أو $x = ${other}$`,
          ext.length ? `بالتحقق: $x = ${ext[0]}$ لا تحقق المعادلة الأصلية (الطرف الأيمن سالب) فهو حل دخيل.` : 'كلا الحلين يحقق المعادلة الأصلية.',
          `مجموعة الحل: $\\{${sols.join(', ')}\\}$`,
        ],
      };
    }
  },
  () => {
    const [p, q] = shuffle([1, 2, 3, 4, 5]).slice(0, 2);
    return {
      kind: 'values',
      prompt: `حل المعادلة تربيعية الشكل: $${poly([1, 0, -(p * p + q * q), 0, p * p * q * q])} = 0$`,
      answer: [R(p), R(-p), R(q), R(-q)],
      hint: 'ضع u = x² فتصبح المعادلة تربيعية في u.',
      solution: [
        `نضع $u = x^2$: $u^2 - ${p * p + q * q}u + ${p * p * q * q} = 0$`,
        `$(u - ${p * p})(u - ${q * q}) = 0 \\Rightarrow u = ${p * p}$ أو $u = ${q * q}$`,
        `$x^2 = ${p * p} \\Rightarrow x = \\pm ${p}$، و $x^2 = ${q * q} \\Rightarrow x = \\pm ${q}$`,
      ],
      placeholder: 'اكتب الحلول الأربعة: 1, -1, 2, -2',
    };
  },
  () => {
    const k = rnd(2, 4);
    return {
      kind: 'values',
      prompt: `حل المعادلة: $x^{2/3} = ${k * k}$`,
      answer: [R(k ** 3), R(-(k ** 3))],
      hint: 'ارفع الطرفين للأس 3/2، أو اكتبها (x^{1/3})² = ' + k * k + ' ولا تنسَ ±.',
      solution: [`$(x^{1/3})^2 = ${k * k} \\Rightarrow x^{1/3} = \\pm ${k}$`, `نكعّب: $x = \\pm ${k ** 3}$`, 'تحقق: كلاهما يعطي ' + k * k + '.'],
      placeholder: 'مثال: 8, -8',
    };
  },
];

// ================= 1.7 =================
const s17: Gen[] = [
  () => {
    const a = nz(-6, 6), r = nz(-8, 8), b = nz(-9, 9);
    const op = pick(['lt', 'le', 'gt', 'ge'] as const);
    const c = a * r + b;
    const fop: Op = a < 0 ? flip[op] : op;
    const ans = (o: Op) => (o === 'lt' ? left(r, false) : o === 'le' ? left(r, true) : o === 'gt' ? right(r, false) : right(r, true));
    return choice(
      `حل المتباينة واكتب الحل بصيغة الفترات: $${poly([a, b])} ${OPS[op]} ${c}$`,
      ans(fop),
      (['lt', 'le', 'gt', 'ge'] as Op[]).filter((o) => o !== fop).map(ans),
      a < 0 ? 'تنبيه: ستقسم على عدد سالب.' : 'اعزل x كما في المعادلات.',
      [
        `$${poly([a])}x ${OPS[op]} ${c - b}$`.replace('$1x', '$x').replace('$-1x', '$-x'),
        a < 0 ? `نقسم على $${a}$ (سالب) فنعكس اتجاه المتباينة: $x ${OPS[fop]} ${r}$` : `نقسم على $${a}$: $x ${OPS[fop]} ${r}$`,
        `بصيغة الفترات: ${ans(fop)}`,
      ],
    );
  },
  () => {
    const a = pick([2, 3, 4, -2, -3]), b = nz(-6, 6);
    const lo = nz(-6, 2), hi = lo + rnd(2, 7);
    const L = a * lo + b, H = a * hi + b;
    const lc = Math.random() < 0.5, rc = Math.random() < 0.5;
    // L (lc?≤:<) ax+b (rc?≤:<) H  عندما a>0
    let m1 = Math.min(L, H), m2 = Math.max(L, H);
    const prompt = `حل المتباينة الثلاثية: $${m1} ${(a > 0 ? lc : rc) ? '\\le' : '<'} ${poly([a, b])} ${(a > 0 ? rc : lc) ? '\\le' : '<'} ${m2}$`;
    const right_ = iv(String(lo), String(hi), lc, rc);
    return choice(
      prompt,
      right_,
      [iv(String(lo), String(hi), !lc, rc), iv(String(lo), String(hi), lc, !rc), iv(String(hi), String(lo), lc, rc)],
      a < 0 ? 'طبّق العمليات على الأجزاء الثلاثة، واعكس الإشارتين عند القسمة على سالب.' : 'طبّق العملية نفسها على الأجزاء الثلاثة معًا.',
      [
        `${b > 0 ? `نطرح $${b}$ من` : `نضيف $${-b}$ إلى`} الأجزاء الثلاثة ثم نقسم على $${a}$${a < 0 ? ' مع عكس الاتجاهين' : ''}.`,
        `$${lo} ${lc ? '\\le' : '<'} x ${rc ? '\\le' : '<'} ${hi}$`,
        `بصيغة الفترات: ${right_}`,
      ],
    );
  },
  () => {
    const r1 = nz(-7, 4), r2 = r1 + rnd(1, 7);
    const op = pick(['lt', 'le', 'gt', 'ge'] as const);
    const closed = op === 'le' || op === 'ge';
    const inside = op === 'lt' || op === 'le';
    const ins = (cl: boolean) => iv(String(r1), String(r2), cl, cl);
    const out = (cl: boolean) => union(left(r1, cl), right(r2, cl));
    const right_ = inside ? ins(closed) : out(closed);
    return choice(
      `حل المتباينة التربيعية: $${poly([1, -(r1 + r2), r1 * r2])} ${OPS[op]} 0$`,
      right_,
      [ins(!closed), out(!closed), inside ? out(closed) : ins(closed)],
      'أوجد جذري المعادلة المرتبطة، ثم اختبر إشارة كل فترة بنقطة اختبار.',
      [
        `الجذران: $${factor(r1)}${factor(r2)} = 0 \\Rightarrow x = ${r1},\\; ${r2}$`,
        `نقطة اختبار بين الجذرين، مثل $x = ${(r1 + r2) / 2}$، تعطي قيمة سالبة؛ وخارجهما القيمة موجبة.`,
        `المطلوب ${inside ? 'سالب' : 'موجب'}${closed ? ' أو صفر' : ''}، إذن الحل: ${right_}`,
      ],
    );
  },
  () => {
    const p = nz(-6, 6);
    let q = nz(-6, 6);
    while (q === p) q = nz(-6, 6);
    const op = pick(['ge', 'le', 'gt', 'lt'] as const);
    const closed = op === 'ge' || op === 'le';
    const positive = op === 'ge' || op === 'gt';
    const lo = Math.min(p, q), hi = Math.max(p, q);
    // نقطة الصفر p يمكن تضمينها، ونقطة عدم التعريف q لا تُضمَّن أبدًا
    const loC = closed && lo === p, hiC = closed && hi === p;
    const between = iv(String(lo), String(hi), loC, hiC);
    const outside = union(left(lo, loC), right(hi, hiC));
    const right_ = positive ? outside : between;
    const wrongIncl = positive
      ? union(left(lo, closed), right(hi, closed))
      : iv(String(lo), String(hi), closed, closed);
    return choice(
      `حل المتباينة النسبية: $\\dfrac{${poly([1, -p])}}{${poly([1, -q])}} ${OPS[op]} 0$`,
      right_,
      [wrongIncl, positive ? between : outside, positive ? iv(String(lo), String(hi), !loC, !hiC) : union(left(lo, !loC), right(hi, !hiC))],
      'الأعداد الحرجة: صفر البسط وصفر المقام. صفر المقام لا يدخل الحل أبدًا.',
      [
        `الأعداد الحرجة: $x = ${p}$ (البسط = 0) و $x = ${q}$ (المقام = 0).`,
        `الكسر موجب خارج الفترة بينهما وسالب داخلها.`,
        `$x = ${q}$ مستبعدة دائمًا${closed ? `، و $x = ${p}$ مضمّنة لأن الكسر عندها صفر` : ''}.`,
        `الحل: ${right_}`,
      ],
    );
  },
];

// ================= 1.8 =================
const s18: Gen[] = [
  () => {
    const a = pick([1, 2, 3, -2]), m = nz(-6, 6), d = rnd(1, 6);
    const b = -a * m, c = Math.abs(a) * d;
    return {
      kind: 'values',
      prompt: `حل المعادلة: $|${poly([a, b])}| = ${c}$`,
      answer: [R(m + d), R(m - d)],
      hint: 'إذا كان |u| = k وكان k > 0 فإن u = k أو u = −k.',
      solution: [
        `$${poly([a, b])} = ${c}$ أو $${poly([a, b])} = -${c}$`,
        `من الأولى: $x = ${frac(c - b, a)}$، ومن الثانية: $x = ${frac(-c - b, a)}$`,
        `مجموعة الحل: $\\{${m - d}, ${m + d}\\}$`,
      ],
      placeholder: 'مثال: 3, -7',
    };
  },
  () => {
    const h = nz(-6, 6), r = rnd(1, 6);
    const op = pick(['lt', 'le', 'gt', 'ge'] as const);
    const closed = op === 'le' || op === 'ge';
    const inside = op === 'lt' || op === 'le';
    const a = h - r, b = h + r;
    const ins = (cl: boolean) => iv(String(a), String(b), cl, cl);
    const out = (cl: boolean) => union(left(a, cl), right(b, cl));
    const right_ = inside ? ins(closed) : out(closed);
    return choice(
      `حل المتباينة: $|x ${h < 0 ? '+' : '-'} ${Math.abs(h)}| ${OPS[op]} ${r}$`,
      right_,
      [ins(!closed), out(!closed), inside ? out(closed) : ins(closed)],
      '|x − h| < r تعني «المسافة عن h أقل من r»: فترة واحدة حول h. أما > فتعني خارجها.',
      [
        inside
          ? `$-${r} ${OPS[op]} x ${h < 0 ? '+' : '-'} ${Math.abs(h)} ${OPS[op]} ${r}$`
          : `$x ${h < 0 ? '+' : '-'} ${Math.abs(h)} ${OPS[op === 'gt' ? 'lt' : 'le']} -${r}$ أو $x ${h < 0 ? '+' : '-'} ${Math.abs(h)} ${OPS[op]} ${r}$`,
        `الحل: ${right_}`,
      ],
    );
  },
  () => {
    const k = nz(-5, 5), m = rnd(1, 9);
    const type = pick(['ge', 'lt', 'eq'] as const);
    const all = '$(-\\infty, \\infty)$ — كل الأعداد الحقيقية';
    const empty = '$\\varnothing$ — لا يوجد حل';
    const prompt = type === 'ge' ? `$|x ${k < 0 ? '-' : '+'} ${Math.abs(k)}| \\ge -${m}$` : type === 'lt' ? `$|x ${k < 0 ? '-' : '+'} ${Math.abs(k)}| < -${m}$` : `$|x ${k < 0 ? '-' : '+'} ${Math.abs(k)}| = -${m}$`;
    const right_ = type === 'ge' ? all : empty;
    return choice(
      `ما مجموعة حل ${prompt}؟`,
      right_,
      [type === 'ge' ? empty : all, `$\\{${-k - m}, ${-k + m}\\}$`, iv(String(-k - m), String(-k + m), false, false)],
      'القيمة المطلقة لا تكون سالبة أبدًا.',
      [
        'القيمة المطلقة دائمًا ≥ 0.',
        type === 'ge' ? 'أي عدد غير سالب هو أكبر من عدد سالب، فالمتباينة صحيحة لكل x.' : 'لا يمكن أن تساوي القيمة المطلقة عددًا سالبًا أو تقل عنه، فلا حل.',
      ],
    );
  },
  () => {
    // |x + p| = |x + q| مع p ≠ q ← حل واحد x = −(p+q)/2 ؛ أو |ax+b| = |cx+d|
    const a = pick([1, 2, 3]), b = nz(-6, 6), c2 = pick([1, 2]), d = nz(-6, 6);
    if (a === c2) return s18[3]();
    const x1n = d - b, x1d = a - c2; // ax+b = cx+d
    const x2n = -d - b, x2d = a + c2; // ax+b = −(cx+d)
    return {
      kind: 'values',
      prompt: `حل المعادلة: $|${poly([a, b])}| = |${poly([c2, d])}|$`,
      answer: [R(x1n / x1d), R(x2n / x2d)],
      hint: '|u| = |v| تعني u = v أو u = −v.',
      solution: [
        `$${poly([a, b])} = ${poly([c2, d])} \\Rightarrow x = ${frac(x1n, x1d)}$`,
        `$${poly([a, b])} = -(${poly([c2, d])}) \\Rightarrow x = ${frac(x2n, x2d)}$`,
      ],
      placeholder: 'يمكن كتابة الكسور: -1/3, 4',
    };
  },
];

export const ch1: Record<string, Gen[]> = {
  '1.1': s11, '1.2': s12, '1.3': s13, '1.4': s14,
  '1.5': s15, '1.6': s16, '1.7': s17, '1.8': s18,
};
