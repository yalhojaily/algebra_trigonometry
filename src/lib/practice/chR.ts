// مولّدات تمارين الفصل R: مراجعة المفاهيم الأساسية
import { rnd, nz, pick, shuffle, gcd, R, frac, poly, polyP, pmul, factor, choice, type Problem } from '../gen';

type Gen = () => Problem;
const set = (xs: number[]) => `\\{${xs.join(', ')}\\}`;
const sortU = (xs: number[]) => [...new Set(xs)].sort((a, b) => a - b);
const sample = (n: number, lo: number, hi: number) => sortU(shuffle(Array.from({ length: hi - lo + 1 }, (_, k) => lo + k)).slice(0, n));
const sgn = (k: number) => (k < 0 ? `- ${-k}` : `+ ${k}`);
/** حد أحادي بصيغة TeX: mono(-1,'x',1) = -x */
const mono = (k: number, v: string, e: number) => `${k === 1 ? '' : k === -1 ? '-' : k}${e === 0 ? '' : e === 1 ? v : `${v}^{${e}}`}`;
const ps = (k: number) => (k < 0 ? `(${k})` : String(k)); // عدد سالب بين قوسين

// ================= R.1 المجموعات =================
const r1: Gen[] = [
  () => {
    const A = sample(rnd(3, 5), 1, 12), B = sample(rnd(3, 5), 1, 12);
    const op = pick(['union', 'inter'] as const);
    const ans = op === 'union' ? sortU([...A, ...B]) : A.filter((x) => B.includes(x));
    return {
      kind: 'values',
      prompt: `لتكن $A = ${set(A)}$ و $B = ${set(B)}$. أوجد $A ${op === 'union' ? '\\cup' : '\\cap'} B$.`,
      answer: ans.map(R),
      hint: op === 'union' ? 'الاتحاد: كل عنصر موجود في A أو B (أو كليهما)، دون تكرار.' : 'التقاطع: العناصر المشتركة فقط، الموجودة في المجموعتين معًا.',
      solution: [
        op === 'union' ? 'نجمع عناصر المجموعتين ونحذف المكرر.' : 'نبحث عن العناصر التي تظهر في المجموعتين.',
        `$A ${op === 'union' ? '\\cup' : '\\cap'} B = ${ans.length ? set(ans) : '\\varnothing'}$`,
      ],
      placeholder: 'اكتب العناصر بفواصل، أو: لا يوجد',
    };
  },
  () => {
    const A = sample(rnd(3, 6), 1, 10);
    const ans = Array.from({ length: 10 }, (_, k) => k + 1).filter((x) => !A.includes(x));
    return {
      kind: 'values',
      prompt: `إذا كانت المجموعة الشاملة $U = \\{1, 2, 3, \\ldots, 10\\}$ و $A = ${set(A)}$، فأوجد المتممة $A'$.`,
      answer: ans.map(R),
      hint: "المتممة A' هي عناصر U التي ليست في A.",
      solution: [`نحذف عناصر $A$ من $U$: $A' = ${set(ans)}$`],
      placeholder: 'مثال: 1, 4, 9',
    };
  },
  () => {
    const n = rnd(2, 7);
    const els = shuffle(['a', 'b', 'c', 'd', 'e', 'f', 'g']).slice(0, n).sort();
    return {
      kind: 'values',
      prompt: `كم مجموعة جزئية للمجموعة $\\{${els.join(', ')}\\}$؟ (بما فيها المجموعة الخالية والمجموعة نفسها)`,
      answer: [R(2 ** n)],
      hint: 'المجموعة التي فيها n عنصرًا لها 2ⁿ مجموعة جزئية.',
      solution: [`عدد العناصر $n = ${n}$، فعدد المجموعات الجزئية $2^{${n}} = ${2 ** n}$.`, 'السبب: كل عنصر إما داخل المجموعة الجزئية أو خارجها، أي خياران لكل عنصر.'],
    };
  },
  () => {
    const k = rnd(4, 9);
    const kind = pick(['natLess', 'evenUpTo', 'intBetween'] as const);
    let prompt = '', ans: number[] = [];
    if (kind === 'natLess') { prompt = `$\\{x \\mid x \\text{ is a natural number less than } ${k}\\}$`; ans = Array.from({ length: k - 1 }, (_, j) => j + 1); }
    if (kind === 'evenUpTo') { const m = 2 * k; prompt = `$\\{x \\mid x \\text{ is an even natural number} \\le ${m}\\}$`; ans = Array.from({ length: k }, (_, j) => 2 * (j + 1)); }
    if (kind === 'intBetween') { const a = -rnd(1, 4); prompt = `$\\{x \\mid x \\text{ is an integer and } ${a} < x \\le ${a + 5}\\}$`; ans = Array.from({ length: 5 }, (_, j) => a + 1 + j); }
    return {
      kind: 'values',
      prompt: `اكتب المجموعة بطريقة سرد العناصر: ${prompt}`,
      answer: ans.map(R),
      hint: 'اقرأ الشرط واكتب كل عدد يحققه.',
      solution: [`العناصر التي تحقق الشرط: $${set(ans)}$`],
      placeholder: 'اكتب العناصر بفواصل',
    };
  },
  () => {
    const U = [1, 2, 3, 4, 5, 6];
    const items = [
      { s: `3 \\in ${set([1, 3, 5])}`, ok: true, why: 'العدد 3 من عناصر المجموعة.' },
      { s: `4 \\in ${set([1, 3, 5])}`, ok: false, why: 'العدد 4 ليس من عناصر المجموعة.' },
      { s: `${set([2, 4])} \\subseteq ${set(U)}`, ok: true, why: 'كل عنصر في {2, 4} موجود في المجموعة الثانية.' },
      { s: `${set([2, 7])} \\subseteq ${set(U)}`, ok: false, why: 'العدد 7 ليس في المجموعة الثانية.' },
      { s: `\\varnothing \\subseteq ${set([1, 2])}`, ok: true, why: 'المجموعة الخالية مجموعة جزئية من كل مجموعة.' },
      { s: `${set([1, 2, 3])} = ${set([3, 1, 2])}`, ok: true, why: 'ترتيب العناصر لا يهم في المجموعات.' },
      { s: `${set([1, 2])} \\cap ${set([3, 4])} = \\varnothing`, ok: true, why: 'لا يوجد عنصر مشترك، فالمجموعتان منفصلتان.' },
      { s: `\\{0\\} = \\varnothing`, ok: false, why: 'المجموعة {0} فيها عنصر واحد هو الصفر، فليست خالية.' },
      { s: `2 \\subseteq ${set([1, 2, 3])}`, ok: false, why: 'العدد 2 عنصر وليس مجموعة. الصحيح 2 ∈ {1, 2, 3} أو {2} ⊆ {1, 2, 3}.' },
    ];
    const it = pick(items);
    return choice(`هل العبارة صحيحة أم خاطئة؟ $${it.s}$`, it.ok ? 'صحيحة' : 'خاطئة', [it.ok ? 'خاطئة' : 'صحيحة'], 'فرّق بين ∈ (عنصر في مجموعة) و ⊆ (مجموعة داخل مجموعة).', [it.why]);
  },
];

// ================= R.2 الأعداد الحقيقية =================
const NUMS = [
  { t: '-8', cls: 'int' }, { t: '0', cls: 'whole' }, { t: '7', cls: 'nat' }, { t: '\\tfrac{3}{4}', cls: 'rat' },
  { t: '-\\tfrac{5}{2}', cls: 'rat' }, { t: '0.\\overline{3}', cls: 'rat' }, { t: '\\sqrt{2}', cls: 'irr' }, { t: '\\sqrt{16}', cls: 'nat' },
  { t: '\\pi', cls: 'irr' }, { t: '-\\sqrt{9}', cls: 'int' }, { t: '1.25', cls: 'rat' }, { t: '\\sqrt{7}', cls: 'irr' }, { t: '\\tfrac{12}{4}', cls: 'nat' },
];
const CLS = {
  nat: 'عدد طبيعي (Natural)',
  whole: 'عدد كلي وليس طبيعيًا (Whole)',
  int: 'عدد صحيح وليس كليًا (Integer)',
  rat: 'عدد نسبي وليس صحيحًا (Rational)',
  irr: 'عدد غير نسبي (Irrational)',
} as const;
const WHY = {
  nat: 'يساوي عددًا من أعداد العد 1، 2، 3، ...، فهو أيضًا كلي وصحيح ونسبي وحقيقي.',
  whole: 'الصفر عدد كلي، لكنه ليس من الأعداد الطبيعية (أعداد العد تبدأ من 1).',
  int: 'عدد صحيح سالب: ليس طبيعيًا ولا كليًا، لكنه نسبي وحقيقي.',
  rat: 'يمكن كتابته على صورة p/q بعددين صحيحين، والعشري المنتهي أو الدوري نسبي.',
  irr: 'عشريه غير منتهٍ وغير دوري، ولا يمكن كتابته p/q.',
};
const PROPS = [
  { s: 'a + b = b + a', p: 'خاصية الإبدال (Commutative)' },
  { s: '(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)', p: 'خاصية التجميع (Associative)' },
  { s: '5(x + 3) = 5x + 15', p: 'خاصية التوزيع (Distributive)' },
  { s: 'x + 0 = x', p: 'العنصر المحايد (Identity)' },
  { s: '7 + (-7) = 0', p: 'النظير الجمعي (Inverse)' },
  { s: '\\tfrac{2}{3} \\cdot \\tfrac{3}{2} = 1', p: 'النظير الضربي (Inverse)' },
  { s: '4 \\cdot (2 \\cdot x) = (4 \\cdot 2) \\cdot x', p: 'خاصية التجميع (Associative)' },
  { s: 'x \\cdot 3 = 3x', p: 'خاصية الإبدال (Commutative)' },
  { s: '-(a - b) = -a + b', p: 'خاصية التوزيع (Distributive)' },
];
const ALLP = [...new Set(PROPS.map((x) => x.p))];

const r2: Gen[] = [
  () => {
    const t = rnd(0, 2);
    if (t === 0) {
      const a = nz(-9, 9), b = nz(-5, 5), c = rnd(1, 6), d = rnd(-4, 4);
      const v = a + b * (c - d) ** 2;
      return {
        kind: 'values', prompt: `احسب: $${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}(${c} - ${ps(d)})^2$`, answer: [R(v)],
        hint: 'الأقواس أولًا، ثم الأسس، ثم الضرب، ثم الجمع والطرح.',
        solution: [`داخل القوس: $${c} - ${ps(d)} = ${c - d}$`, `الأس: $${ps(c - d)}^2 = ${(c - d) ** 2}$`, `الضرب: $${Math.abs(b)} \\cdot ${(c - d) ** 2} = ${Math.abs(b) * (c - d) ** 2}$`, `النتيجة: $${v}$`],
      };
    }
    if (t === 1) {
      const k = rnd(2, 6), m = rnd(1, 9);
      return {
        kind: 'values', prompt: `احسب: $-${k}^2 + (-${k})^2 - ${m}$`, answer: [R(-m)],
        hint: 'في −k² يُرفع k وحده للأس ثم نضع السالب. في (−k)² يُرفع السالب أيضًا.',
        solution: [`$-${k}^2 = -${k * k}$ لأن الأس يسبق السالب.`, `$(-${k})^2 = ${k * k}$`, `$-${k * k} + ${k * k} - ${m} = ${-m}$`],
      };
    }
    const e = rnd(2, 5), v = nz(-6, 6), q = nz(2, 5), r = nz(-4, 4);
    const top = v * e + q * r;
    return {
      kind: 'values', prompt: `احسب: $\\dfrac{${top} - ${q}(${r})}{${e}}$`, answer: [R(v)],
      hint: 'خط الكسر يعمل كقوسين: احسب البسط كله أولًا، والضرب قبل الطرح.',
      solution: [`الضرب أولًا: $${q}(${r}) = ${q * r}$`, `البسط: $${top} - ${ps(q * r)} = ${v * e}$`, `$\\dfrac{${v * e}}{${e}} = ${v}$`],
    };
  },
  () => {
    const it = pick(NUMS);
    return choice(`ما أدق وصف للعدد $${it.t}$؟`, CLS[it.cls as keyof typeof CLS], Object.values(CLS), 'ابدأ بسؤال: هل يمكن كتابته كسرًا p/q؟ ثم: هل هو صحيح؟ موجب؟', [WHY[it.cls as keyof typeof WHY]]);
  },
  () => {
    const it = pick(PROPS);
    return choice(`أي خاصية توضحها العبارة $${it.s}$؟`, it.p, ALLP, 'الإبدال يغيّر الترتيب، والتجميع يغيّر الأقواس، والتوزيع يفك الضرب على الجمع.', [`${it.p}.`]);
  },
  () => {
    const a = nz(-12, 12), b = nz(-12, 12);
    const kind = pick(['dist', 'diff'] as const);
    if (kind === 'dist')
      return {
        kind: 'values', prompt: `ما المسافة بين العددين $${a}$ و $${b}$ على خط الأعداد؟`, answer: [R(Math.abs(a - b))],
        hint: 'المسافة بين a و b هي |a − b|.',
        solution: [`$|${a} - ${ps(b)}| = |${a - b}| = ${Math.abs(a - b)}$`],
      };
    return {
      kind: 'values', prompt: `احسب: $|${a}| - |${b}|$`, answer: [R(Math.abs(a) - Math.abs(b))],
      hint: 'احسب كل قيمة مطلقة وحدها أولًا.',
      solution: [`$|${a}| = ${Math.abs(a)}$ و $|${b}| = ${Math.abs(b)}$`, `$${Math.abs(a)} - ${Math.abs(b)} = ${Math.abs(a) - Math.abs(b)}$`],
    };
  },
  () => {
    const x = nz(-4, 4), y = nz(-4, 4), k = rnd(2, 4);
    const v = -k * x * x + 3 * y;
    return {
      kind: 'values', prompt: `احسب قيمة $-${k}x^2 + 3y$ عندما $x = ${x}$ و $y = ${y}$.`, answer: [R(v)],
      hint: 'عوّض بين أقواس: x² يعني (' + x + ')².',
      solution: [`$-${k}(${x})^2 + 3(${y}) = -${k}(${x * x}) + ${3 * y}$`.replace('+ -', '- '), `$= ${-k * x * x} ${sgn(3 * y)} = ${v}$`],
    };
  },
];

// ================= R.3 كثيرات الحدود =================
const r3: Gen[] = [
  () => {
    const a = nz(-6, 6), b = nz(-6, 6), m = rnd(1, 6), n = rnd(1, 6);
    return {
      kind: 'expr', prompt: `بسّط: $(${mono(a, 'x', m)})(${mono(b, 'x', n)})$`, answer: `${a * b}x^${m + n}`, vars: ['x'], require: ['monomial'],
      hint: 'قاعدة الضرب: aᵐ · aⁿ = aᵐ⁺ⁿ. اضرب المعاملين واجمع الأسين.',
      solution: [`المعاملان: $${ps(a)} \\cdot ${ps(b)} = ${a * b}$`, `الأسان: $x^{${m}} \\cdot x^{${n}} = x^{${m + n}}$`, `النتيجة: $${a * b}x^{${m + n}}$`],
      placeholder: 'مثال: -12x^7',
    };
  },
  () => {
    const a = pick([2, 3, -2, -3, 5]), m = rnd(1, 4), n = rnd(2, 3);
    return {
      kind: 'expr', prompt: `بسّط: $(${mono(a, 'x', m)})^{${n}}$`, answer: `${a ** n}x^${m * n}`, vars: ['x'], require: ['monomial'],
      hint: 'قاعدة القوة: (ab)ⁿ = aⁿbⁿ و (aᵐ)ⁿ = aᵐⁿ. ارفع المعامل أيضًا.',
      solution: [`$${ps(a)}^{${n}} = ${a ** n}$`, `$(x^{${m}})^{${n}} = x^{${m * n}}$`, `النتيجة: $${a ** n}x^{${m * n}}$`],
    };
  },
  () => {
    const p = [nz(-6, 6), rnd(-9, 9), rnd(-9, 9)], q = [nz(-6, 6), rnd(-9, 9), rnd(-9, 9)];
    const minus = Math.random() < 0.6;
    const r = p.map((x, k) => (minus ? x - q[k] : x + q[k]));
    return {
      kind: 'expr', prompt: `بسّط: $(${poly(p)}) ${minus ? '-' : '+'} (${poly(q)})$`, answer: polyP(r), vars: ['x'], require: ['expanded'],
      hint: minus ? 'الطرح يغيّر إشارة كل حد في القوس الثاني، ثم اجمع الحدود المتشابهة.' : 'اجمع الحدود المتشابهة (نفس الأس).',
      solution: minus
        ? [`نوزع السالب: $${poly(p)} ${q.map((x, k) => (x === 0 ? '' : `${-x < 0 ? '-' : '+'} ${Math.abs(x)}${['x^2', 'x', ''][k]}`)).join(' ')}$`, `نجمع المتشابهة: $${poly(r)}$`]
        : [`نجمع المتشابهة: $${poly(r)}$`],
      placeholder: 'مثال: 3x^2 - 5x + 1',
    };
  },
  () => {
    const a = nz(-4, 5), b = nz(-7, 7), c = nz(-4, 5), d = nz(-7, 7);
    const r = pmul([a, b], [c, d]);
    return {
      kind: 'expr', prompt: `اضرب: $(${poly([a, b])})(${poly([c, d])})$`, answer: polyP(r), vars: ['x'], require: ['expanded'],
      hint: 'FOIL: الأولان، ثم الخارجيان، ثم الداخليان، ثم الأخيران.',
      solution: [
        `$${a * c}x^2 ${sgn(a * d)}x ${sgn(b * c)}x ${sgn(b * d)}$`,
        `نجمع الحدين الأوسطين: $${poly(r)}$`,
      ],
      placeholder: 'مثال: 6x^2 + x - 12',
    };
  },
  () => {
    const a = nz(1, 5), b = nz(-7, 7);
    const type = pick(['sq', 'diff'] as const);
    if (type === 'sq')
      return {
        kind: 'expr', prompt: `أوجد المفكوك: $(${poly([a, b])})^2$`, answer: polyP([a * a, 2 * a * b, b * b]), vars: ['x'], require: ['expanded'],
        hint: '(u + v)² = u² + 2uv + v². لا تنسَ الحد الأوسط.',
        solution: [`$(${a === 1 ? '' : a}x)^2 + 2(${a === 1 ? '' : a}x)(${b}) + (${b})^2$`, `$= ${poly([a * a, 2 * a * b, b * b])}$`],
      };
    return {
      kind: 'expr', prompt: `اضرب: $(${poly([a, b])})(${poly([a, -b])})$`, answer: polyP([a * a, 0, -b * b]), vars: ['x'], require: ['expanded'],
      hint: 'مجموع حدين في الفرق بينهما: (u + v)(u − v) = u² − v².',
      solution: [`$(${a === 1 ? '' : a}x)^2 - (${Math.abs(b)})^2 = ${poly([a * a, 0, -b * b])}$`, 'الحدان الأوسطان يلغي أحدهما الآخر.'],
    };
  },
  () => {
    const r = nz(-6, 6), p = nz(-6, 6), q = rnd(-9, 9);
    // (x - r)(x^2 + p x + q)
    const N = pmul([1, -r], [1, p, q]);
    return {
      kind: 'expr', prompt: `استخدم القسمة الطويلة: $\\dfrac{${poly(N)}}{${poly([1, -r])}}$`, answer: polyP([1, p, q]), vars: ['x'], require: ['expanded'],
      hint: `اقسم الحد الأعلى على x في كل خطوة، ثم اضرب في (${poly([1, -r])}) واطرح.`,
      solution: [
        `$x^3 \\div x = x^2$. نضرب: $x^2(${poly([1, -r])}) = ${poly([1, -r, 0, 0])}$ ونطرح، فيبقى $${poly([p, N[2], N[3]])}$`.replace(/\$1x/g, '$x'),
        `$${poly([p, 0, 0])} \\div x = ${poly([p, 0])}$. نضرب ونطرح، فيبقى $${poly([q, N[3]])}$`,
        `$${poly([q, 0])} \\div x = ${q}$. نضرب ونطرح، فيبقى صفر.`,
        `الناتج: $${poly([1, p, q])}$`,
      ],
      placeholder: 'مثال: x^2 + 3x - 4',
    };
  },
  () => {
    const n = rnd(3, 7);
    const coefs = [nz(-5, 5), ...Array.from({ length: n }, () => rnd(-6, 6))];
    const shuffled = shuffle(coefs.map((k, idx) => ({ k, p: n - idx })).filter((t) => t.k !== 0));
    const txt = shuffled.map((t, j) => `${t.k < 0 ? '-' : j ? '+' : ''} ${Math.abs(t.k) === 1 && t.p ? '' : Math.abs(t.k)}${t.p === 0 ? '' : t.p === 1 ? 'x' : `x^{${t.p}}`}`).join(' ');
    return {
      kind: 'values', prompt: `ما درجة كثير الحدود $${txt}$؟`, answer: [R(n)],
      hint: 'الدرجة هي أكبر أس للمتغير، وليس أس الحد الأول بالضرورة.',
      solution: [`أكبر أس يظهر هو $${n}$.`],
    };
  },
];

// ================= R.4 التحليل =================
const r4: Gen[] = [
  () => {
    const g = rnd(2, 6), a = nz(1, 5), b = nz(-7, 7);
    if (gcd(a, b) !== 1) return r4[0]();
    return {
      kind: 'expr', prompt: `حلل بإخراج العامل المشترك الأكبر: $${poly([g * a, g * b, 0])}$`, answer: `${g}x(${polyP([a, b])})`, vars: ['x'], require: ['factored'],
      hint: 'ابحث عن أكبر عدد وأكبر قوة لـ x تقسم كل الحدود.',
      solution: [`العامل المشترك الأكبر $${g}x$.`, `$${g}x(${poly([a, b])})$`],
      placeholder: 'مثال: 3x(2x - 5)',
    };
  },
  () => {
    const p = nz(-9, 9), q = nz(-9, 9);
    return {
      kind: 'expr', prompt: `حلل: $${poly([1, -(p + q), p * q])}$`, answer: `(x-(${p}))(x-(${q}))`, vars: ['x'], require: ['factored'],
      hint: `ابحث عن عددين حاصل ضربهما ${p * q} ومجموعهما ${-(p + q)}.`,
      solution: [`العددان $${-p}$ و $${-q}$: ضربهما $${p * q}$ ومجموعهما $${-(p + q)}$.`, `$${factor(p)}${factor(q)}$`],
      placeholder: 'مثال: (x + 2)(x - 7)',
    };
  },
  () => {
    for (;;) {
      const a = rnd(2, 4), b = nz(-6, 6), c = rnd(1, 3), d = nz(-6, 6);
      if (gcd(a, b) !== 1 || gcd(c, d) !== 1) continue;
      const P = pmul([a, b], [c, d]);
      return {
        kind: 'expr', prompt: `حلل: $${poly(P)}$`, answer: `(${polyP([a, b])})(${polyP([c, d])})`, vars: ['x'], require: ['factored'],
        hint: `جرّب عوامل ${P[0]} للحدين الأولين وعوامل ${P[2]} للحدين الأخيرين حتى يتحقق الحد الأوسط، أو استخدم طريقة ac = ${P[0] * P[2]}.`,
        solution: [`نبحث عن عددين ضربهما $ac = ${P[0] * P[2]}$ ومجموعهما $b = ${P[1]}$: هما $${a * d}$ و $${b * c}$.`, `$(${poly([a, b])})(${poly([c, d])})$`],
        placeholder: 'مثال: (2x + 3)(x - 4)',
      };
    }
  },
  () => {
    const a = rnd(1, 5), b = rnd(1, 9);
    if (gcd(a, b) !== 1) return r4[3]();
    return {
      kind: 'expr', prompt: `حلل الفرق بين مربعين: $${poly([a * a, 0, -b * b])}$`, answer: `(${polyP([a, b])})(${polyP([a, -b])})`, vars: ['x'], require: ['factored'],
      hint: 'u² − v² = (u + v)(u − v).',
      solution: [`$(${a === 1 ? '' : a}x)^2 - ${b}^2 = (${poly([a, b])})(${poly([a, -b])})$`],
      placeholder: 'مثال: (3x + 5)(3x - 5)',
    };
  },
  () => {
    const k = rnd(1, 5), plus = Math.random() < 0.5;
    const ans = plus ? `(x+${k})(x^2-${k}x+${k * k})` : `(x-${k})(x^2+${k}x+${k * k})`;
    return {
      kind: 'expr', prompt: `حلل ${plus ? 'مجموع' : 'الفرق بين'} مكعبين: $x^3 ${plus ? '+' : '-'} ${k ** 3}$`, answer: ans, vars: ['x'], require: ['factored'],
      hint: plus ? 'u³ + v³ = (u + v)(u² − uv + v²).' : 'u³ − v³ = (u − v)(u² + uv + v²).',
      solution: [`$${k ** 3} = ${k}^3$، فنطبق القانون مع $u = x$ و $v = ${k}$:`, `$${plus ? `(x + ${k})(x^2 - ${k === 1 ? '' : k}x + ${k * k})` : `(x - ${k})(x^2 + ${k === 1 ? '' : k}x + ${k * k})`}$`],
      placeholder: 'مثال: (x + 2)(x^2 - 2x + 4)',
    };
  },
  () => {
    const a = nz(-6, 6), b = nz(-6, 6);
    // (x + a)(x^2 + b) = x^3 + a x^2 + b x + ab
    return {
      kind: 'expr', prompt: `حلل بالتجميع: $${poly([1, a, b, a * b])}$`, answer: `(${polyP([1, a])})(${polyP([1, 0, b])})`, vars: ['x'], require: ['factored'],
      hint: 'جمّع الحدين الأولين معًا والأخيرين معًا، واستخرج عاملًا مشتركًا من كل زوج.',
      solution: [
        `$(x^3 ${sgn(a)}x^2) + (${poly([b, a * b])})$`,
        `$x^2(${poly([1, a])}) ${b < 0 ? '-' : '+'} ${Math.abs(b)}(${poly([1, a])})$`,
        `$(${poly([1, a])})(${poly([1, 0, b])})$`,
      ],
      placeholder: 'مثال: (x + 3)(x^2 - 2)',
    };
  },
];

// ================= R.5 المقادير النسبية =================
const r5: Gen[] = [
  () => {
    const p = nz(-7, 7);
    let q = nz(-7, 7);
    while (q === p) q = nz(-7, 7);
    const a = nz(-5, 5);
    return {
      kind: 'values', prompt: `ما القيم المستبعدة من مجال المقدار $\\dfrac{${poly([1, a])}}{${poly(pmul([1, -p], [1, -q]))}}$؟`, answer: [R(p), R(q)],
      hint: 'القيم المستبعدة هي التي تجعل المقام صفرًا. حلّل المقام.',
      solution: [`$${poly(pmul([1, -p], [1, -q]))} = ${factor(p)}${factor(q)}$`, `يصبح صفرًا عند $x = ${p}$ و $x = ${q}$.`],
      placeholder: 'مثال: 3, -2',
    };
  },
  () => {
    const p = nz(-6, 6), q = nz(-6, 6);
    let r = nz(-6, 6);
    while (r === q) r = nz(-6, 6);
    const N = pmul([1, -p], [1, -q]), D = pmul([1, -p], [1, -r]);
    return {
      kind: 'expr', prompt: `اكتب في أبسط صورة: $\\dfrac{${poly(N)}}{${poly(D)}}$`, answer: `(${polyP([1, -q])})/(${polyP([1, -r])})`, vars: ['x'],
      hint: 'حلل البسط والمقام، ثم اختصر العامل المشترك.',
      solution: [`$\\dfrac{${factor(p)}${factor(q)}}{${factor(p)}${factor(r)}}$`, `نختصر $${factor(p)}$: $\\dfrac{${poly([1, -q])}}{${poly([1, -r])}}$ مع $x \\ne ${p}$.`],
      placeholder: 'مثال: (x + 3)/(x - 1)',
    };
  },
  () => {
    const a = nz(1, 6), b = nz(1, 6), p = nz(-5, 5);
    let q = nz(-5, 5);
    while (q === p) q = nz(-5, 5);
    const num = [a + b, a * q + b * p];
    return {
      kind: 'expr', prompt: `اجمع واكتب كسرًا واحدًا: $\\dfrac{${a}}{${poly([1, p])}} + \\dfrac{${b}}{${poly([1, q])}}$`,
      answer: `(${polyP(num)})/((${polyP([1, p])})(${polyP([1, q])}))`, vars: ['x'],
      hint: 'المقام المشترك هو حاصل ضرب المقامين. حوّل كل كسر إليه ثم اجمع البسطين.',
      solution: [
        `المقام المشترك: $(${poly([1, p])})(${poly([1, q])})$`,
        `$\\dfrac{${a}(${poly([1, q])}) + ${b}(${poly([1, p])})}{(${poly([1, p])})(${poly([1, q])})}$`,
        `$= \\dfrac{${poly(num)}}{(${poly([1, p])})(${poly([1, q])})}$`,
      ],
      placeholder: 'مثال: (5x + 2)/((x+1)(x-3))',
    };
  },
  () => {
    const a = rnd(2, 6), b = rnd(2, 6), p = nz(-5, 5);
    // (a x^2)/(x+p) * (x+p)/(b x)  =  a x / b
    return {
      kind: 'expr', prompt: `اضرب وبسّط: $\\dfrac{${a}x^2}{${poly([1, p])}} \\cdot \\dfrac{${poly([b, b * p])}}{${b * a}x}$`, answer: 'x', vars: ['x'],
      hint: 'حلل كل بسط ومقام أولًا، ثم اختصر قبل الضرب.',
      solution: [`$${poly([b, b * p])} = ${b}(${poly([1, p])})$`, `$\\dfrac{${a}x^2 \\cdot ${b}(${poly([1, p])})}{(${poly([1, p])}) \\cdot ${a * b}x} = x$`],
    };
  },
  () => {
    const a = rnd(2, 7);
    // (1/x + 1/a) / (1/x - 1/a) = (a + x)/(a - x)
    return {
      kind: 'expr', prompt: `بسّط الكسر المركب: $\\dfrac{\\dfrac{1}{x} + \\dfrac{1}{${a}}}{\\dfrac{1}{x} - \\dfrac{1}{${a}}}$`, answer: `(${a}+x)/(${a}-x)`, vars: ['x'],
      hint: `اضرب البسط والمقام في ${a}x (المقام المشترك لكل الكسور الصغيرة).`,
      solution: [`نضرب في $${a}x$: $\\dfrac{${a} + x}{${a} - x}$`],
      placeholder: 'مثال: (4 + x)/(4 - x)',
    };
  },
];

// ================= R.6 الأسس النسبية =================
const r6: Gen[] = [
  () => {
    const items = [
      [8, 1, 3, 2], [27, 2, 3, 9], [16, 3, 4, 8], [32, 2, 5, 4], [81, 3, 4, 27], [25, 3, 2, 125], [64, 2, 3, 16], [9, 3, 2, 27],
    ];
    const [b, m, n, v] = pick(items);
    const neg = Math.random() < 0.4;
    return {
      kind: 'values', prompt: `احسب: $${b}^{${neg ? '-' : ''}${m}/${n}}$`, answer: [R(neg ? 1 / v : v)],
      hint: `aᵐ/ⁿ = (ⁿ√a)ᵐ. احسب الجذر أولًا لأنه يصغّر العدد.${neg ? ' والأس السالب يعني المقلوب.' : ''}`,
      solution: [
        `$\\sqrt[${n}]{${b}} = ${Math.round(b ** (1 / n))}$`,
        `$${Math.round(b ** (1 / n))}^{${m}} = ${v}$`,
        ...(neg ? [`الأس سالب، فنأخذ المقلوب: $\\dfrac{1}{${v}}$`] : []),
      ],
      placeholder: 'مثال: 9 أو 1/8',
    };
  },
  () => {
    const [p, q] = pick([[1, 2], [1, 3], [2, 3], [3, 4], [1, 4]]);
    const [r, s] = pick([[1, 2], [1, 3], [1, 6], [2, 5], [3, 2]]);
    const N = p * s + r * q, D = q * s;
    const g = gcd(N, D);
    return {
      kind: 'expr', prompt: `بسّط (المتغير موجب): $x^{${p}/${q}} \\cdot x^{${r}/${s}}$`, answer: `x^(${N / g}/${D / g})`, vars: ['x'], positive: true, require: ['monomial'],
      hint: 'قاعدة الضرب تعمل مع الأسس الكسرية: اجمع الأسين بتوحيد المقامات.',
      solution: [`$\\dfrac{${p}}{${q}} + \\dfrac{${r}}{${s}} = \\dfrac{${p * s} + ${r * q}}{${D}} = ${frac(N, D)}$`, `النتيجة: $x^{${frac(N, D)}}$`],
      placeholder: 'مثال: x^(5/6)',
    };
  },
  () => {
    const a = pick([2, 3]), m = rnd(1, 4), n = rnd(1, 3);
    // (a x^{-m} y^{n})^{-2} = x^{2m} / (a^2 y^{2n})
    return {
      kind: 'expr', prompt: `بسّط واكتب بأسس موجبة: $(${a}x^{-${m}}${mono(1, 'y', n)})^{-2}$`, answer: `x^${2 * m}/(${a * a}y^${2 * n})`, vars: ['x', 'y'], require: ['noNegativeExponent'],
      hint: 'ارفع كل عامل للأس −2، ثم انقل ما أسه سالب إلى المقام (أو البسط).',
      solution: [`$${a}^{-2}x^{${2 * m}}y^{-${2 * n}}$`, `$= \\dfrac{x^{${2 * m}}}{${a * a}y^{${2 * n}}}$`],
      placeholder: 'مثال: x^6/(4y^4)',
    };
  },
  () => {
    const m = rnd(5, 9), n = rnd(1, 4), k = rnd(2, 6);
    return {
      kind: 'expr', prompt: `بسّط باستخدام قاعدة القسمة: $\\dfrac{${mono(k * 3, 'x', m)}}{${mono(k, 'x', n)}}$`, answer: `3x^${m - n}`, vars: ['x'], require: ['monomial'],
      hint: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ. اقسم المعاملين واطرح الأسين.',
      solution: [`$\\dfrac{${k * 3}}{${k}} = 3$ و $x^{${m} - ${n}} = x^{${m - n}}$`, `النتيجة: $3x^{${m - n}}$`],
    };
  },
  () => {
    const b = pick([2, 3, 4, 5, 10]), n = rnd(2, 3);
    return {
      kind: 'values', prompt: `احسب: $${b}^{-${n}}$`, answer: [R(1 / b ** n)],
      hint: 'a⁻ⁿ = 1/aⁿ. الأس السالب لا يجعل العدد سالبًا.',
      solution: [`$${b}^{-${n}} = \\dfrac{1}{${b}^{${n}}} = \\dfrac{1}{${b ** n}}$`],
      placeholder: 'مثال: 1/8',
    };
  },
];

// ================= R.7 المقادير الجذرية =================
const SQ = [4, 9, 16, 25, 36, 49];
const FREE = [2, 3, 5, 6, 7, 10];
const rad = (k: number, m: number) => `${k === 1 ? '' : k}\\sqrt{${m}}`;
const r7: Gen[] = [
  () => {
    const s = pick(SQ), m = pick(FREE), k = Math.sqrt(s);
    const n = s * m;
    const big = SQ.filter((x) => x < s && s % x === 0 && x > 1);
    const wrong = [`${rad(big.length ? Math.sqrt(big[0]) : k + 1, big.length ? n / big[0] : m)}`, rad(k, m * 2), `${k * m}\\sqrt{${m}}`, rad(m, k)];
    return choice(`اكتب في أبسط صورة جذرية: $\\sqrt{${n}}$`, `$${rad(k, m)}$`, wrong.map((w) => `$${w}$`),
      'ابحث عن أكبر مربع كامل يقسم العدد تحت الجذر.',
      [`أكبر مربع كامل يقسم $${n}$ هو $${s}$: $\\sqrt{${n}} = \\sqrt{${s} \\cdot ${m}} = \\sqrt{${s}}\\sqrt{${m}} = ${rad(k, m)}$`]);
  },
  () => {
    const b = pick([2, 3, 5]);
    const [s1, s2] = shuffle(SQ.slice(0, 4)).slice(0, 2);
    const c1 = nz(1, 4), c2 = nz(-4, 4);
    const total = c1 * Math.sqrt(s1) + c2 * Math.sqrt(s2);
    const ans = total === 0 ? '0' : rad(total, b).replace(/^-1\\/, '-\\');
    const wrong = [rad(c1 + c2, b * 2), `${rad(c1 + c2, s1 * b + s2 * b)}`, rad(total + 1, b), rad(c1 * Math.sqrt(s1) - c2 * Math.sqrt(s2), b)];
    return choice(`بسّط: $${c1 === 1 ? '' : c1}\\sqrt{${s1 * b}} ${c2 < 0 ? '-' : '+'} ${Math.abs(c2) === 1 ? '' : Math.abs(c2)}\\sqrt{${s2 * b}}$`, `$${ans}$`, wrong.map((w) => `$${w}$`),
      `بسّط كل جذر أولًا، فيصبح كلاهما مضاعفًا لـ √${b}، ثم اجمع المعاملات.`,
      [`$\\sqrt{${s1 * b}} = ${Math.sqrt(s1)}\\sqrt{${b}}$ و $\\sqrt{${s2 * b}} = ${Math.sqrt(s2)}\\sqrt{${b}}$`, `$${c1 * Math.sqrt(s1)}\\sqrt{${b}} ${sgn(c2 * Math.sqrt(s2))}\\sqrt{${b}} = ${ans}$`]);
  },
  () => {
    const a = pick([5, 6, 7, 10, 11]), b = pick([2, 3]);
    return {
      kind: 'values', prompt: `احسب: $(\\sqrt{${a}} + \\sqrt{${b}})(\\sqrt{${a}} - \\sqrt{${b}})$`, answer: [R(a - b)],
      hint: '(u + v)(u − v) = u² − v²، و (√a)² = a.',
      solution: [`$(\\sqrt{${a}})^2 - (\\sqrt{${b}})^2 = ${a} - ${b} = ${a - b}$`],
    };
  },
  () => {
    const m = pick([2, 3, 5, 6, 7]), k = m * rnd(1, 4);
    return {
      kind: 'expr', prompt: `أنطق المقام: $\\dfrac{${k}}{\\sqrt{${m}}}$`, answer: `${k / m}sqrt(${m})`, vars: [], require: ['noRadicalDenominator'],
      hint: `اضرب البسط والمقام في √${m}.`,
      solution: [`$\\dfrac{${k}}{\\sqrt{${m}}} \\cdot \\dfrac{\\sqrt{${m}}}{\\sqrt{${m}}} = \\dfrac{${k}\\sqrt{${m}}}{${m}} = ${rad(k / m, m)}$`],
      placeholder: 'مثال: 2sqrt(3)',
    };
  },
  () => {
    for (;;) {
      const a = rnd(2, 6), m = pick([2, 3, 5, 6, 7]);
      const d = a * a - m;
      if (d === 0) continue;
      const k = Math.abs(d) * rnd(1, 2);
      return {
        kind: 'expr', prompt: `أنطق المقام: $\\dfrac{${k}}{${a} - \\sqrt{${m}}}$`, answer: `(${k}/${d})(${a}+sqrt(${m}))`, vars: [], require: ['noRadicalDenominator'],
        hint: `اضرب البسط والمقام في المرافق ${a} + √${m}.`,
        solution: [
          `$\\dfrac{${k}(${a} + \\sqrt{${m}})}{(${a} - \\sqrt{${m}})(${a} + \\sqrt{${m}})} = \\dfrac{${k}(${a} + \\sqrt{${m}})}{${a * a} - ${m}}$`,
          `$= \\dfrac{${k}(${a} + \\sqrt{${m}})}{${d}} = ${frac(k, d) === '1' ? `${a} + \\sqrt{${m}}` : `${frac(k, d) === '-1' ? '-' : frac(k, d)}(${a} + \\sqrt{${m}})`}$`,
        ],
        placeholder: 'مثال: 2(3 + sqrt(5))',
      };
    }
  },
  () => {
    const k = pick([2, 3, 4, 5]), cube = Math.random() < 0.5;
    if (cube) {
      const s = nz(-1, 1) < 0 ? -1 : 1;
      return {
        kind: 'values', prompt: `احسب: $\\sqrt[3]{${s * k ** 3}}$`, answer: [R(s * k)],
        hint: 'الجذر التكعيبي لعدد سالب معرّف وسالب.',
        solution: [`$(${s * k})^3 = ${s * k ** 3}$، إذن $\\sqrt[3]{${s * k ** 3}} = ${s * k}$`],
      };
    }
    return choice(`ما قيمة $\\sqrt{x^2}$ لأي عدد حقيقي $x$؟`, '$|x|$', ['$x$', '$-x$', '$\\pm x$'],
      'جرّب x = −3.', ['$\\sqrt{(-3)^2} = \\sqrt{9} = 3 \\ne -3$. الجذر الزوجي يعطي قيمة غير سالبة دائمًا، لذلك $\\sqrt{x^2} = |x|$.']);
  },
];

export const chR: Record<string, Gen[]> = {
  'R.1': r1, 'R.2': r2, 'R.3': r3, 'R.4': r4, 'R.5': r5, 'R.6': r6, 'R.7': r7,
};
