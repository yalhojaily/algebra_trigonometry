// مولّدات تمارين الفصل 9: الأنظمة والمصفوفات
import { rnd, nz, pick, R, frac, choice, type Problem } from '../gen';

type Gen = () => Problem;
const sg = (k: number, v: string, lead = false) => (k === 0 ? '' : `${k < 0 ? (lead ? '-' : ' - ') : lead ? '' : ' + '}${Math.abs(k) === 1 && v ? '' : Math.abs(k)}${v}`);
/** a x + b y + c z بصيغة TeX */
const lin = (cs: number[], vs = ['x', 'y', 'z']) => {
  let s = '';
  cs.forEach((k, i) => { if (k !== 0) s += sg(k, vs[i], s === ''); });
  return s || '0';
};
const bm = (m: number[][]) => `\\begin{bmatrix} ${m.map((r) => r.join(' & ')).join(' \\\\ ')} \\end{bmatrix}`;
const det2 = (m: number[][]) => m[0][0] * m[1][1] - m[0][1] * m[1][0];
const det3 = (m: number[][]) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
const randMat = (r: number, c: number, lo = -5, hi = 5) => Array.from({ length: r }, () => Array.from({ length: c }, () => rnd(lo, hi)));

// ================= 9.1 =================
const s91: Gen[] = [
  () => {
    let a1 = 0, b1 = 0, a2 = 0, b2 = 0;
    while (a1 * b2 - a2 * b1 === 0) { a1 = nz(-5, 5); b1 = nz(-5, 5); a2 = nz(-5, 5); b2 = nz(-5, 5); }
    const x = rnd(-6, 6), y = rnd(-6, 6);
    const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
    return {
      kind: 'values', ordered: true, prompt: `حل النظام: $\\begin{cases} ${lin([a1, b1])} = ${c1} \\\\ ${lin([a2, b2])} = ${c2} \\end{cases}$ (اكتب: x، y)`, answer: [R(x), R(y)],
      hint: 'اضرب المعادلتين بأعداد تجعل معاملي أحد المتغيرين متعاكسين، ثم اجمع (الحذف). أو اعزل متغيرًا وعوّض.',
      solution: [`بالحذف: اضرب الأولى في $${a2}$ والثانية في $${-a1}$ واجمع: $${lin([a2 * b1 - a1 * b2], ['y'])} = ${a2 * c1 - a1 * c2}$`, `$y = ${y}$`, `بالتعويض: $x = ${x}$. الحل $(${x}, ${y})$.`],
      placeholder: 'مثال: (2, -3)',
    };
  },
  () => {
    const a = nz(-4, 4), b = nz(-4, 4), c = rnd(-8, 8), k = nz(-3, 3);
    const same = Math.random() < 0.5;
    const c2 = same ? k * c : k * c + nz(-4, 4);
    const right = same ? 'عدد لا نهائي من الحلول (معتمد)' : 'لا يوجد حل (غير متسق)';
    return choice(`ما نوع النظام $\\begin{cases} ${lin([a, b])} = ${c} \\\\ ${lin([k * a, k * b])} = ${c2} \\end{cases}$؟`, right,
      ['حل وحيد', 'لا يوجد حل (غير متسق)', 'عدد لا نهائي من الحلول (معتمد)'].filter((x) => x !== right),
      'هل المعادلة الثانية مضاعف للأولى؟ قارن الطرفين.',
      [`الطرف الأيسر للثانية $${k}$ مضروبًا في الأيسر للأولى.`, same ? `والطرف الأيمن أيضًا ($${k} \\cdot ${c} = ${c2}$): المستقيم نفسه.` : `لكن الطرف الأيمن $${c2} \\ne ${k * c}$: مستقيمان متوازيان.`]);
  },
  () => {
    let M: number[][] = [];
    while (!M.length || det3(M) === 0) M = randMat(3, 3, -3, 3);
    const s = [rnd(-4, 4), rnd(-4, 4), rnd(-4, 4)];
    const rhs = M.map((r) => r[0] * s[0] + r[1] * s[1] + r[2] * s[2]);
    return {
      kind: 'values', ordered: true, prompt: `حل النظام: $\\begin{cases} ${M.map((r, i) => `${lin(r)} = ${rhs[i]}`).join(' \\\\ ')} \\end{cases}$ (اكتب: x، y، z)`, answer: s.map(R),
      hint: 'احذف متغيرًا واحدًا من زوجين من المعادلات لتحصل على نظام بمعادلتين، ثم حله وعوّض.',
      solution: ['احذف $x$ (أو أي متغير) من المعادلتين الأولى والثانية، ثم من الأولى والثالثة.', 'حل النظام الناتج بمجهولين، ثم عوّض لإيجاد الثالث.', `الحل $(${s.join(', ')})$.`],
      placeholder: 'مثال: (1, -2, 3)',
    };
  },
  () => {
    // تطبيق: خلط تذاكر
    const p1 = pick([5, 8, 10, 12]), p2 = p1 + pick([3, 4, 5, 7]);
    const n1 = rnd(20, 80), n2 = rnd(20, 80);
    const total = n1 + n2, money = p1 * n1 + p2 * n2;
    return {
      kind: 'values', ordered: true, prompt: `بيع ${total} تذكرة: تذاكر عادية بـ ${p1} ريال وأخرى مميزة بـ ${p2} ريال، والإيراد ${money} ريال. كم بيع من كل نوع؟ (اكتب: العادية، المميزة)`, answer: [R(n1), R(n2)],
      hint: 'x + y = العدد الكلي، و (سعر)x + (سعر)y = الإيراد.',
      solution: [`$\\begin{cases} x + y = ${total} \\\\ ${p1}x + ${p2}y = ${money} \\end{cases}$`, `اضرب الأولى في $${p1}$ واطرح: $${p2 - p1}y = ${money - p1 * total}$ ← $y = ${n2}$`, `$x = ${n1}$`],
      placeholder: 'مثال: 45, 30',
    };
  },
  () => {
    // نمذجة: قطع مكافئ يمر بثلاث نقاط
    const a = nz(-3, 3), b = rnd(-5, 5), c = rnd(-6, 6);
    const xs = [-1, 1, 2];
    const ys = xs.map((x) => a * x * x + b * x + c);
    return {
      kind: 'values', ordered: true, prompt: `أوجد $a, b, c$ بحيث يمر منحنى $y = ax^2 + bx + c$ بالنقاط $(-1, ${ys[0]})$ و $(1, ${ys[1]})$ و $(2, ${ys[2]})$. (اكتب: a، b، c)`, answer: [R(a), R(b), R(c)],
      hint: 'كل نقطة تعطي معادلة خطية في a و b و c.',
      solution: [`$\\begin{cases} a - b + c = ${ys[0]} \\\\ a + b + c = ${ys[1]} \\\\ 4a + 2b + c = ${ys[2]} \\end{cases}$`, `بطرح الأولى من الثانية: $2b = ${ys[1] - ys[0]}$ ← $b = ${b}$`, `ثم $a = ${a}$ و $c = ${c}$`],
      placeholder: 'مثال: 2, -1, 3',
    };
  },
];

// ================= 9.2 =================
const s92: Gen[] = [
  () => {
    let M: number[][] = [];
    while (!M.length || det2(M) === 0) M = randMat(2, 2, -5, 5);
    const s = [rnd(-6, 6), rnd(-6, 6)];
    const rhs = M.map((r) => r[0] * s[0] + r[1] * s[1]);
    return {
      kind: 'values', ordered: true, prompt: `استخدم طريقة غاوس-جوردان لحل النظام ذي المصفوفة الموسّعة $\\left[\\begin{array}{cc|c} ${M[0][0]} & ${M[0][1]} & ${rhs[0]} \\\\ ${M[1][0]} & ${M[1][1]} & ${rhs[1]} \\end{array}\\right]$ (اكتب: x، y)`, answer: s.map(R),
      hint: 'حوّل الجزء الأيسر إلى مصفوفة الوحدة بعمليات الصفوف؛ العمود الأخير يصبح الحل.',
      solution: ['اجعل العنصر (1,1) يساوي 1، وصفّر ما تحته.', 'اجعل العنصر (2,2) يساوي 1، وصفّر ما فوقه.', `$\\left[\\begin{array}{cc|c} 1 & 0 & ${s[0]} \\\\ 0 & 1 & ${s[1]} \\end{array}\\right]$`],
      placeholder: 'مثال: (3, -1)',
    };
  },
  () => {
    let M: number[][] = [];
    while (!M.length || det3(M) === 0) M = randMat(3, 3, -3, 3);
    const s = [rnd(-4, 4), rnd(-4, 4), rnd(-4, 4)];
    const rhs = M.map((r) => r[0] * s[0] + r[1] * s[1] + r[2] * s[2]);
    return {
      kind: 'values', ordered: true, prompt: `حل بالمصفوفات: $\\left[\\begin{array}{ccc|c} ${M.map((r, i) => `${r.join(' & ')} & ${rhs[i]}`).join(' \\\\ ')} \\end{array}\\right]$ (اكتب: x، y، z)`, answer: s.map(R),
      hint: 'عمودًا عمودًا: اجعل المحور 1 ثم صفّر بقية عناصر العمود.',
      solution: ['العمليات المسموحة: تبديل صفين، ضرب صف في عدد غير صفري، إضافة مضاعف صف إلى آخر.', `الصيغة النهائية: $\\left[\\begin{array}{ccc|c} 1 & 0 & 0 & ${s[0]} \\\\ 0 & 1 & 0 & ${s[1]} \\\\ 0 & 0 & 1 & ${s[2]} \\end{array}\\right]$`],
      placeholder: 'مثال: (1, 0, -2)',
    };
  },
  () => {
    const c = nz(-5, 5);
    const kind = pick(['none', 'inf', 'one'] as const);
    const last = kind === 'none' ? `0 & 0 & ${c}` : kind === 'inf' ? '0 & 0 & 0' : `0 & 1 & ${c}`;
    const right = kind === 'none' ? 'لا يوجد حل' : kind === 'inf' ? 'عدد لا نهائي من الحلول' : 'حل وحيد';
    return choice(`بعد عمليات الصفوف وصلنا إلى $\\left[\\begin{array}{cc|c} 1 & ${rnd(-4, 4)} & ${rnd(-5, 5)} \\\\ ${last} \\end{array}\\right]$. ماذا نستنتج؟`, right,
      ['لا يوجد حل', 'عدد لا نهائي من الحلول', 'حل وحيد'].filter((x) => x !== right),
      'اقرأ الصف الأخير كمعادلة.',
      [kind === 'none' ? `الصف الأخير يعني $0 = ${c}$، وهذا مستحيل.` : kind === 'inf' ? 'الصف الأخير $0 = 0$ لا يضيف قيدًا، فـ $y$ متغير حر.' : `الصف الأخير يعطي $y = ${c}$، ثم $x$ من الأول.`]);
  },
  () => {
    const a = nz(-4, 4), b = nz(-4, 4), c = rnd(-6, 6);
    // نظام معتمد: x + a y = c ، 2x + 2a y = 2c ← x = c − a y
    return {
      kind: 'expr', prompt: `النظام $\\begin{cases} x ${sg(a, 'y')} = ${c} \\\\ ${lin([b, a * b])} = ${b * c} \\end{cases}$ له عدد لا نهائي من الحلول. اكتب $x$ بدلالة $y$.`,
      answer: `${c}-(${a})*y`, vars: ['y'],
      hint: 'المعادلة الثانية مضاعف للأولى، فحل الأولى لـ x.',
      solution: [`الثانية = $${b}$ × الأولى.`, `$x = ${c} ${a > 0 ? '-' : '+'} ${Math.abs(a) === 1 ? '' : Math.abs(a)}y$، والحلول $(${c} ${a > 0 ? '-' : '+'} ${Math.abs(a) === 1 ? '' : Math.abs(a)}y,\\ y)$ لكل $y$.`],
      placeholder: 'مثال: 4-2y',
    };
  },
];

// ================= 9.3 =================
const s93: Gen[] = [
  () => {
    const M = randMat(2, 2, -9, 9);
    return {
      kind: 'values', prompt: `احسب $\\det${bm(M)}$`, answer: [R(det2(M))],
      hint: 'ad − bc.',
      solution: [`$(${M[0][0]})(${M[1][1]}) - (${M[0][1]})(${M[1][0]}) = ${det2(M)}$`],
    };
  },
  () => {
    const M = randMat(3, 3, -4, 4);
    const c = [M[1][1] * M[2][2] - M[1][2] * M[2][1], M[1][0] * M[2][2] - M[1][2] * M[2][0], M[1][0] * M[2][1] - M[1][1] * M[2][0]];
    return {
      kind: 'values', prompt: `احسب $\\det${bm(M)}$`, answer: [R(det3(M))],
      hint: 'افكك على الصف الأول: a₁₁A₁₁ − a₁₂A₁₂ + a₁₃A₁₃ (إشارات متناوبة).',
      solution: [`$= (${M[0][0]})(${c[0]}) - (${M[0][1]})(${c[1]}) + (${M[0][2]})(${c[2]})$`, `$= ${det3(M)}$`],
    };
  },
  () => {
    let M: number[][] = [];
    while (!M.length || det2(M) === 0) M = randMat(2, 2, -6, 6);
    const s = [rnd(-6, 6), rnd(-6, 6)];
    const rhs = M.map((r) => r[0] * s[0] + r[1] * s[1]);
    const D = det2(M), Dx = rhs[0] * M[1][1] - M[0][1] * rhs[1], Dy = M[0][0] * rhs[1] - rhs[0] * M[1][0];
    return {
      kind: 'values', ordered: true, prompt: `استخدم قاعدة كرامر: $\\begin{cases} ${lin(M[0])} = ${rhs[0]} \\\\ ${lin(M[1])} = ${rhs[1]} \\end{cases}$ (اكتب: x، y)`, answer: s.map(R),
      hint: 'x = Dₓ / D و y = Dᵧ / D، حيث Dₓ تستبدل عمود x بالثوابت.',
      solution: [`$D = ${D}$، $D_x = ${Dx}$، $D_y = ${Dy}$`, `$x = \\dfrac{${Dx}}{${D}} = ${s[0]}$، $y = \\dfrac{${Dy}}{${D}} = ${s[1]}$`],
      placeholder: 'مثال: (-1, 4)',
    };
  },
  () => {
    const a = nz(-5, 5), b = rnd(-5, 5), c = nz(-5, 5);
    const x = rnd(-6, 6);
    // det [[x, b],[a, c]] = cx − ab = k
    const k = c * x - a * b;
    return {
      kind: 'values', prompt: `حل لـ $x$: $\\det\\begin{bmatrix} x & ${b} \\\\ ${a} & ${c} \\end{bmatrix} = ${k}$`, answer: [R(x)],
      hint: 'افك المحدد ثم حل المعادلة الخطية.',
      solution: [`$${lin([c], ['x'])} - (${b})(${a}) = ${k}$`, `$${lin([c], ['x'])} = ${k + a * b}$ ← $x = ${x}$`],
    };
  },
  () => {
    const right = pick(['يصبح المحدد صفرًا', 'تتغير إشارة المحدد', 'يُضرب المحدد في k']);
    const q = right === 'يصبح المحدد صفرًا' ? 'إذا تساوى صفان في مصفوفة مربعة' : right === 'تتغير إشارة المحدد' ? 'إذا بدّلنا صفين في مصفوفة مربعة' : 'إذا ضربنا صفًا واحدًا في العدد k';
    return choice(`${q}:`, right, ['يصبح المحدد صفرًا', 'تتغير إشارة المحدد', 'يُضرب المحدد في k', 'لا يتغير المحدد'].filter((x) => x !== right),
      'تذكّر نظريات المحددات.',
      [`${q}، ${right}. أما إضافة مضاعف صف إلى صف آخر فلا تغيّر المحدد.`]);
  },
];

// ================= 9.4 =================
const s94: Gen[] = [
  () => {
    let r1 = 0, r2 = 0;
    while (r1 === r2) { r1 = nz(-4, 4); r2 = nz(-4, 4); }
    const A = nz(-5, 5), B = nz(-5, 5);
    // A/(x − r1) + B/(x − r2) = ((A + B)x − (A r2 + B r1)) / ((x − r1)(x − r2))
    const p = A + B, q = -(A * r2 + B * r1);
    const f = (r: number) => (r === 0 ? 'x' : `(x ${r > 0 ? '-' : '+'} ${Math.abs(r)})`);
    return {
      kind: 'values', ordered: true, prompt: `فكّك إلى كسور جزئية: $\\dfrac{${lin([p, q], ['x', ''])}}{${f(r1)}${f(r2)}} = \\dfrac{A}{${f(r1).replace(/^\(|\)$/g, '')}} + \\dfrac{B}{${f(r2).replace(/^\(|\)$/g, '')}}$. (اكتب: A، B)`, answer: [R(A), R(B)],
      hint: 'اضرب في المقام، ثم عوّض x بجذر كل عامل.',
      solution: [`$${lin([p, q], ['x', ''])} = A${f(r2)} + B${f(r1)}$`, `عند $x = ${r1}$: $${p * r1 + q} = A(${r1 - r2})$ ← $A = ${A}$`, `عند $x = ${r2}$: $${p * r2 + q} = B(${r2 - r1})$ ← $B = ${B}$`],
      placeholder: 'مثال: 2, -3',
    };
  },
  () => {
    const r = nz(-4, 4), A = nz(-5, 5), B = nz(-5, 5);
    // A/(x − r) + B/(x − r)² = (A x − A r + B)/(x − r)²
    const f = `(x ${r > 0 ? '-' : '+'} ${Math.abs(r)})`;
    return {
      kind: 'values', ordered: true, prompt: `فكّك: $\\dfrac{${lin([A, -A * r + B], ['x', ''])}}{${f}^2} = \\dfrac{A}{${f.slice(1, -1)}} + \\dfrac{B}{${f}^2}$. (اكتب: A، B)`, answer: [R(A), R(B)],
      hint: 'العامل المكرر يأخذ حدًا لكل قوة. اضرب في المقام وقارن.',
      solution: [`$${lin([A, -A * r + B], ['x', ''])} = A${f} + B$`, `معامل $x$: $A = ${A}$`, `عند $x = ${r}$: $B = ${B}$`],
      placeholder: 'مثال: 3, -1',
    };
  },
  () => {
    const A = nz(-4, 4), B = nz(-4, 4), C = rnd(-4, 4), k = pick([1, 4, 9]);
    // A/x + (Bx + C)/(x² + k) = (A(x² + k) + Bx² + Cx)/(x(x² + k)) = ((A + B)x² + Cx + Ak)/(…)
    const num = lin([A + B, C, A * k], ['x^2', 'x', '']);
    return {
      kind: 'values', ordered: true, prompt: `فكّك: $\\dfrac{${num}}{x(x^2 + ${k})} = \\dfrac{A}{x} + \\dfrac{Bx + C}{x^2 + ${k}}$. (اكتب: A، B، C)`, answer: [R(A), R(B), R(C)],
      hint: 'العامل التربيعي غير القابل للتحليل يأخذ بسطًا خطيًا. عوّض x = 0 أولًا، ثم قارن المعاملات.',
      solution: [`$${num} = A(x^2 + ${k}) + (Bx + C)x$`, `عند $x = 0$: $${A * k} = ${k}A$ ← $A = ${A}$`, `معامل $x^2$: $A + B = ${A + B}$ ← $B = ${B}$، ومعامل $x$: $C = ${C}$`],
      placeholder: 'مثال: 2, -1, 3',
    };
  },
  () => {
    const right = pick([
      ['\\dfrac{3x + 1}{(x - 2)(x + 5)}', '\\dfrac{A}{x - 2} + \\dfrac{B}{x + 5}'],
      ['\\dfrac{x^2 + 1}{x(x - 1)^2}', '\\dfrac{A}{x} + \\dfrac{B}{x - 1} + \\dfrac{C}{(x - 1)^2}'],
      ['\\dfrac{2x}{(x + 1)(x^2 + 3)}', '\\dfrac{A}{x + 1} + \\dfrac{Bx + C}{x^2 + 3}'],
      ['\\dfrac{x^3}{(x^2 + 1)^2}', '\\dfrac{Ax + B}{x^2 + 1} + \\dfrac{Cx + D}{(x^2 + 1)^2}'],
    ] as const);
    const all = ['\\dfrac{A}{x - 2} + \\dfrac{B}{x + 5}', '\\dfrac{A}{x} + \\dfrac{B}{x - 1} + \\dfrac{C}{(x - 1)^2}', '\\dfrac{A}{x + 1} + \\dfrac{Bx + C}{x^2 + 3}', '\\dfrac{Ax + B}{x^2 + 1} + \\dfrac{Cx + D}{(x^2 + 1)^2}', '\\dfrac{A}{x} + \\dfrac{B}{(x - 1)^2}', '\\dfrac{A}{x + 1} + \\dfrac{B}{x^2 + 3}'];
    return choice(`ما الصورة الصحيحة لتفكيك $${right[0]}$؟`, `$${right[1]}$`,
      all.filter((x) => x !== right[1]).map((x) => `$${x}$`),
      'عامل خطي ← A، عامل مكرر ← حد لكل قوة، عامل تربيعي غير قابل للتحليل ← Bx + C.',
      [`$${right[0]} = ${right[1]}$`]);
  },
];

// ================= 9.5 =================
const s95: Gen[] = [
  () => {
    // خط ودائرة بنقاط صحيحة
    const pts = pick([[[3, 4], [4, 3]], [[0, 5], [5, 0]], [[-3, 4], [4, -3]], [[0, -5], [3, 4]], [[5, 0], [-3, -4]]] as const);
    const [[x1, y1], [x2, y2]] = pts;
    // ax + by = c بصيغة صحيحة
    const A = y2 - y1, B = -(x2 - x1), C = A * x1 + B * y1;
    return {
      kind: 'values', prompt: `حل النظام $\\begin{cases} x^2 + y^2 = 25 \\\\ ${lin([A, B])} = ${C} \\end{cases}$. اكتب قيم $x$ للحلول مفصولة بفاصلة.`, answer: [R(x1), R(x2)],
      hint: 'اعزل y (أو x) من المعادلة الخطية وعوّض في الدائرة، فتحصل على معادلة تربيعية.',
      solution: ['اعزل أحد المتغيرين من المعادلة الخطية وعوّض في معادلة الدائرة.', 'تحصل على معادلة تربيعية بمتغير واحد، حلها ثم أوجد المتغير الآخر.', `النقطتان $(${x1}, ${y1})$ و $(${x2}, ${y2})$.`],
      placeholder: 'مثال: 3, 4',
    };
  },
  () => {
    const a = rnd(1, 4), b = rnd(1, 4);
    // x² + y² = a² + b² ، x² − y² = a² − b²  ← x² = a² ، y² = b²
    return {
      kind: 'values', prompt: `حل بالحذف: $\\begin{cases} x^2 + y^2 = ${a * a + b * b} \\\\ x^2 - y^2 = ${a * a - b * b} \\end{cases}$. كم عدد الحلول الحقيقية $(x, y)$؟`, answer: [R(a === 0 || b === 0 ? 2 : 4)],
      hint: 'اجمع المعادلتين لتحذف y².',
      solution: [`بالجمع: $2x^2 = ${2 * a * a}$ ← $x = \\pm ${a}$`, `بالطرح: $2y^2 = ${2 * b * b}$ ← $y = \\pm ${b}$`, 'أربعة حلول: $(\\pm a, \\pm b)$ بكل تركيباتها.'],
    };
  },
  () => {
    const r = rnd(1, 3), k = rnd(r + 1, r + 5);
    const right = 'لا توجد حلول حقيقية (الحلول مركبة غير حقيقية)';
    return choice(`نظام $\\begin{cases} x^2 + y^2 = ${r * r} \\\\ y = ${k} \\end{cases}$:`, right, ['حلّان حقيقيان', 'حل حقيقي واحد', 'عدد لا نهائي من الحلول'],
      'هل يصل المستقيم الأفقي إلى الدائرة؟',
      [`$x^2 = ${r * r} - ${k * k} = ${r * r - k * k} < 0$`, `$x = \\pm\\sqrt{${r * r - k * k}} = \\pm ${Math.sqrt(k * k - r * r) % 1 === 0 ? Math.sqrt(k * k - r * r) : `\\sqrt{${k * k - r * r}}`}i$: حلول مركبة فقط.`]);
  },
  () => {
    // مساحة ومحيط مستطيل
    const L = rnd(5, 20), W = rnd(2, L - 1);
    return {
      kind: 'values', ordered: true, prompt: `مستطيل مساحته ${L * W} م² ومحيطه ${2 * (L + W)} م. أوجد بعديه (اكتب: الطول الأكبر، ثم الأصغر).`, answer: [R(L), R(W)],
      hint: 'xy = المساحة و 2x + 2y = المحيط. عوّض y من الثانية في الأولى.',
      solution: [`$\\begin{cases} xy = ${L * W} \\\\ x + y = ${L + W} \\end{cases}$`, `$x(${L + W} - x) = ${L * W}$ ← $x^2 - ${L + W}x + ${L * W} = 0$`, `$x = ${L}$ أو $${W}$: البعدان ${L} و ${W}.`],
      placeholder: 'مثال: 12, 5',
    };
  },
];

// ================= 9.6 =================
const LP: { cons: string; obj: [number, number]; verts: [number, number][]; max: boolean }[] = [
  { cons: 'x \\ge 0,\\ y \\ge 0,\\ x + y \\le 8,\\ x + 2y \\le 12,\\ 3x + y \\le 18', obj: [3, 5], verts: [[0, 0], [6, 0], [5, 3], [4, 4], [0, 6]], max: true },
  { cons: 'x \\ge 0,\\ y \\ge 0,\\ x + y \\le 10,\\ 2x + y \\le 16', obj: [4, 3], verts: [[0, 0], [8, 0], [6, 4], [0, 10]], max: true },
  { cons: 'x \\ge 0,\\ y \\ge 0,\\ 2x + 3y \\le 24,\\ 4x + y \\le 28', obj: [5, 4], verts: [[0, 0], [7, 0], [6, 4], [0, 8]], max: true },
  { cons: 'x \\ge 0,\\ y \\ge 0,\\ x + y \\ge 6,\\ x \\le 8,\\ y \\le 8', obj: [2, 3], verts: [[6, 0], [8, 0], [8, 8], [0, 8], [0, 6]], max: false },
];
const s96: Gen[] = [
  () => {
    const P = pick(LP);
    const c = [P.obj[0] + rnd(-1, 2), P.obj[1] + rnd(-1, 2)] as [number, number];
    const vals = P.verts.map(([x, y]) => c[0] * x + c[1] * y);
    const best = P.max ? Math.max(...vals) : Math.min(...vals);
    return {
      kind: 'values', prompt: `أوجد القيمة ${P.max ? 'العظمى' : 'الصغرى'} لـ $z = ${c[0]}x + ${c[1]}y$ تحت القيود $${P.cons}$.`, answer: [R(best)],
      hint: 'ارسم المنطقة الممكنة، وأوجد رؤوسها، وعوّض كل رأس في z.',
      solution: [`الرؤوس: ${P.verts.map(([x, y]) => `$(${x}, ${y})$`).join('، ')}`, `قيم z: ${vals.join('، ')}`, `القيمة ${P.max ? 'العظمى' : 'الصغرى'} $${best}$.`],
    };
  },
  () => {
    const a = nz(-3, 3), b = rnd(-5, 5);
    const op = pick(['<', '>', '\\le', '\\ge'] as const);
    const above = op === '>' || op === '\\ge';
    const right = `${above ? 'فوق' : 'تحت'} المستقيم ${op === '<' || op === '>' ? 'المتقطع' : 'المتصل'}`;
    return choice(`أين تقع حلول المتباينة $y ${op} ${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)}$؟`, right,
      ['فوق المستقيم المتقطع', 'تحت المستقيم المتقطع', 'فوق المستقيم المتصل', 'تحت المستقيم المتصل'].filter((x) => x !== right),
      'y أكبر ← فوق، y أصغر ← تحت. والمساواة تجعل الخط متصلًا (ضمن الحلول).',
      [`${above ? 'y أكبر من قيمة المستقيم، فالمنطقة فوقه' : 'y أصغر، فالمنطقة تحته'}، و${op === '<' || op === '>' ? 'المتباينة صارمة فالخط متقطع' : 'المساواة مسموحة فالخط متصل'}.`]);
  },
  () => {
    const x = rnd(-5, 5), y = rnd(-5, 5);
    const a = nz(-3, 3), b = nz(-3, 3), c = rnd(-6, 6);
    const lhs = a * x + b * y;
    const ok = lhs <= c;
    return choice(`هل النقطة $(${x}, ${y})$ حل للمتباينة $${lin([a, b])} \\le ${c}$؟`, ok ? 'نعم' : 'لا', [ok ? 'لا' : 'نعم', 'لا يمكن الحكم'],
      'عوّض النقطة في المتباينة.',
      [`$(${a})(${x}) + (${b})(${y}) = ${lhs}$`, `$${lhs} ${ok ? '\\le' : '>'} ${c}$، ${ok ? 'فهي حل' : 'فليست حلًا'}.`]);
  },
  () => {
    // مسألة إنتاج
    const p1 = rnd(20, 60), p2 = rnd(20, 60);
    // آلتان: منتج A يحتاج 1 ساعة على الآلة الأولى و 2 على الثانية، و B يحتاج 3 و 1. المتاح 15 و 10
    const verts: [number, number][] = [[0, 0], [5, 0], [3, 4], [0, 5]];
    const vals = verts.map(([x, y]) => p1 * x + p2 * y);
    const best = Math.max(...vals);
    return {
      kind: 'values', prompt: `مصنع ينتج منتجين: A ربحه ${p1} ريالًا، و B ربحه ${p2} ريالًا. يحتاج A ساعة على الآلة الأولى وساعتين على الثانية، ويحتاج B ثلاث ساعات على الأولى وساعة على الثانية. المتاح 15 ساعة على الأولى و 10 على الثانية. ما أقصى ربح؟`, answer: [R(best)],
      hint: 'القيود: x + 3y ≤ 15 ، 2x + y ≤ 10 ، x, y ≥ 0. أوجد الرؤوس.',
      solution: ['الرؤوس: $(0, 0)$، $(5, 0)$، $(3, 4)$، $(0, 5)$', `الربح: ${vals.join('، ')}`, `أقصى ربح $${best}$ ريالًا.`],
    };
  },
];

// ================= 9.7 =================
const s97: Gen[] = [
  () => {
    const A = randMat(2, 2), B = randMat(2, 2), k = nz(-3, 3);
    const C = A.map((r, i) => r.map((x, j) => x + k * B[i][j]));
    return {
      kind: 'values', ordered: true, prompt: `إذا كان $A = ${bm(A)}$ و $B = ${bm(B)}$، فأوجد $A ${k < 0 ? '-' : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}B$. (اكتب العناصر صفًا صفًا: a₁₁، a₁₂، a₂₁، a₂₂)`, answer: C.flat().map(R),
      hint: 'اضرب كل عنصر في B بالعدد، ثم اجمع العناصر المتناظرة.',
      solution: [`$${k}B = ${bm(B.map((r) => r.map((x) => k * x)))}$`, `$= ${bm(C)}$`],
      placeholder: 'مثال: 1, -2, 0, 5',
    };
  },
  () => {
    const A = randMat(2, 2, -4, 4), B = randMat(2, 2, -4, 4);
    const C = A.map((r, i) => [0, 1].map((j) => r[0] * B[0][j] + r[1] * B[1][j]));
    return {
      kind: 'values', ordered: true, prompt: `أوجد $AB$ حيث $A = ${bm(A)}$ و $B = ${bm(B)}$. (اكتب العناصر صفًا صفًا)`, answer: C.flat().map(R),
      hint: 'العنصر cᵢⱼ = الصف i من A في العمود j من B.',
      solution: [`$c_{11} = (${A[0][0]})(${B[0][0]}) + (${A[0][1]})(${B[1][0]}) = ${C[0][0]}$`, `وبالمثل: $AB = ${bm(C)}$`],
      placeholder: 'مثال: 4, -1, 7, 0',
    };
  },
  () => {
    const [m, n] = [rnd(1, 4), rnd(1, 4)];
    const [p, r] = [pick([n, n, rnd(1, 4)]), rnd(1, 4)];
    const right = n === p ? `$${m} \\times ${r}$` : 'الضرب غير معرّف';
    return choice(`مصفوفة $A$ أبعادها $${m} \\times ${n}$ و $B$ أبعادها $${p} \\times ${r}$. ما أبعاد $AB$؟`, right,
      [`$${n} \\times ${p}$`, `$${m} \\times ${p}$`, `$${r} \\times ${m}$`, 'الضرب غير معرّف', `$${m} \\times ${r}$`].filter((x) => x !== right),
      'الضرب ممكن إذا ساوى عدد أعمدة A عدد صفوف B، والناتج (صفوف A) × (أعمدة B).',
      [n === p ? `$${n} = ${p}$، فالناتج $${m} \\times ${r}$.` : `$${n} \\ne ${p}$، فالضرب غير معرّف.`]);
  },
  () => {
    const A = randMat(2, 3, -3, 3), B = randMat(3, 2, -3, 3);
    const C = A.map((r) => [0, 1].map((j) => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j]));
    return {
      kind: 'values', ordered: true, prompt: `أوجد $AB$ حيث $A = ${bm(A)}$ و $B = ${bm(B)}$. (اكتب العناصر صفًا صفًا)`, answer: C.flat().map(R),
      hint: '(2 × 3)(3 × 2) = 2 × 2. كل عنصر مجموع ثلاثة حواصل ضرب.',
      solution: [`$c_{11} = (${A[0][0]})(${B[0][0]}) + (${A[0][1]})(${B[1][0]}) + (${A[0][2]})(${B[2][0]}) = ${C[0][0]}$`, `$AB = ${bm(C)}$`],
      placeholder: 'مثال: 3, 0, -5, 2',
    };
  },
  () => {
    const right = 'AB لا يساوي BA عمومًا';
    return choice('أي العبارات صحيحة عن ضرب المصفوفات المربعة؟', right,
      ['AB = BA دائمًا', 'إذا كان AB = 0 فإن A = 0 أو B = 0', '(A + B)² = A² + 2AB + B² دائمًا'],
      'جرّب مصفوفتين بسيطتين 2 × 2.',
      ['ضرب المصفوفات <strong>ليس إبداليًا</strong>: مثلًا $\\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix}\\begin{bmatrix} 0 & 0 \\\\ 1 & 0 \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 0 \\end{bmatrix}$، والعكس يعطي $\\begin{bmatrix} 0 & 0 \\\\ 0 & 1 \\end{bmatrix}$.']);
  },
];

// ================= 9.8 =================
const s98: Gen[] = [
  () => {
    let M: number[][] = [];
    while (!M.length || Math.abs(det2(M)) !== 1) M = randMat(2, 2, -5, 5);
    const d = det2(M);
    const inv = [[M[1][1] / d, -M[0][1] / d], [-M[1][0] / d, M[0][0] / d]];
    return {
      kind: 'values', ordered: true, prompt: `أوجد معكوس $A = ${bm(M)}$. (اكتب العناصر صفًا صفًا)`, answer: inv.flat().map((x) => R(x + 0)),
      hint: 'A⁻¹ = (1/det) [[d, −b], [−c, a]].',
      solution: [`$\\det A = ${d}$`, `$A^{-1} = \\dfrac{1}{${d}}${bm([[M[1][1], -M[0][1]], [-M[1][0], M[0][0]]])} = ${bm(inv.map((r) => r.map((x) => x + 0)))}$`],
      placeholder: 'مثال: 2, -1, -5, 3',
    };
  },
  () => {
    let M: number[][] = [];
    while (!M.length || det2(M) === 0) M = randMat(2, 2, -6, 6);
    const d = det2(M);
    const which = rnd(0, 3);
    const raw = [M[1][1], -M[0][1], -M[1][0], M[0][0]][which];
    const pos = ['الصف 1، العمود 1', 'الصف 1، العمود 2', 'الصف 2، العمود 1', 'الصف 2، العمود 2'][which];
    return {
      kind: 'values', prompt: `للمصفوفة $A = ${bm(M)}$، ما العنصر في ${pos} من $A^{-1}$؟ (كسر دقيق)`, answer: [R(raw / d)],
      hint: 'احسب المحدد، ثم استخدم صيغة معكوس 2 × 2.',
      solution: [`$\\det A = ${d}$`, `العنصر $= \\dfrac{${raw}}{${d}} = ${frac(raw, d)}$`],
      placeholder: 'مثال: -3/7',
    };
  },
  () => {
    let M: number[][] = [];
    while (!M.length || det2(M) === 0) M = randMat(2, 2, -5, 5);
    const s = [rnd(-6, 6), rnd(-6, 6)];
    const rhs = M.map((r) => r[0] * s[0] + r[1] * s[1]);
    return {
      kind: 'values', ordered: true, prompt: `استخدم المعكوس لحل $AX = B$ حيث $A = ${bm(M)}$ و $B = ${bm(rhs.map((x) => [x]))}$. (اكتب: x، y)`, answer: s.map(R),
      hint: 'X = A⁻¹B.',
      solution: [`$A^{-1} = \\dfrac{1}{${det2(M)}}${bm([[M[1][1], -M[0][1]], [-M[1][0], M[0][0]]])}$`, `$X = A^{-1}B = ${bm(s.map((x) => [x]))}$`],
      placeholder: 'مثال: (2, -3)',
    };
  },
  () => {
    const a = nz(-5, 5), b = nz(-5, 5), d = nz(-5, 5);
    // ad − b c = 0 ← c = ad/b إذا كان صحيحًا
    const c = (a * d) / b;
    if (!Number.isInteger(c)) return s98[3]();
    return {
      kind: 'values', prompt: `ما قيمة $k$ التي تجعل $\\begin{bmatrix} ${a} & ${b} \\\\ k & ${d} \\end{bmatrix}$ بلا معكوس؟`, answer: [R(c)],
      hint: 'المصفوفة بلا معكوس إذا كان محددها صفرًا.',
      solution: [`$(${a})(${d}) - (${b})k = 0$`, `$k = \\dfrac{${a * d}}{${b}} = ${c}$`],
    };
  },
  () => {
    const right = 'مصفوفة الوحدة I';
    return choice('ما ناتج $AA^{-1}$ لأي مصفوفة مربعة $A$ لها معكوس؟', right, ['المصفوفة الصفرية', 'A نفسها', 'A²'],
      'المعكوس الضربي يحقق a · a⁻¹ = 1.',
      ['$AA^{-1} = A^{-1}A = I$، حيث $I$ قطرها الرئيسي آحاد وبقية عناصرها أصفار، وتحقق $AI = IA = A$.']);
  },
];

export const ch9: Record<string, Gen[]> = { '9.1': s91, '9.2': s92, '9.3': s93, '9.4': s94, '9.5': s95, '9.6': s96, '9.7': s97, '9.8': s98 };
