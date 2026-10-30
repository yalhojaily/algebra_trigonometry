// مولّدات تمارين الفصل 10: الهندسة التحليلية (القطوع المخروطية)
import { rnd, nz, pick, R, frac, choice, simpRoot, simpRootP, type Problem } from '../gen';

type Gen = () => Problem;
const shift = (v: string, h: number) => (h === 0 ? v : `(${v} ${h > 0 ? '-' : '+'} ${Math.abs(h)})`);
const r2 = (v: number, d = 2) => +v.toFixed(d);

// ================= 10.1 =================
const s101: Gen[] = [
  () => {
    const p = nz(-4, 4);
    const vert = pick([true, false]);
    const eq = vert ? `x^2 = ${4 * p}y` : `y^2 = ${4 * p}x`;
    return {
      kind: 'values', ordered: true, prompt: `أوجد إحداثيي بؤرة القطع المكافئ $${eq}$. (اكتب: x، y)`, answer: vert ? [R(0), R(p)] : [R(p), R(0)],
      hint: 'قارن بالصورة x² = 4py أو y² = 4px لتجد p.',
      solution: [`$4p = ${4 * p}$ ← $p = ${p}$`, `البؤرة $${vert ? `(0, ${p})` : `(${p}, 0)`}$، والدليل $${vert ? 'y' : 'x'} = ${-p}$.`],
      placeholder: 'مثال: (0, 2)',
    };
  },
  () => {
    const p = nz(-4, 4);
    const vert = pick([true, false]);
    return {
      kind: 'values', prompt: `قطع مكافئ رأسه الأصل وبؤرته $${vert ? `(0, ${p})` : `(${p}, 0)`}$. معادلته $${vert ? 'x^2 = ky' : 'y^2 = kx'}$؛ أوجد $k$.`, answer: [R(4 * p)],
      hint: 'k = 4p.',
      solution: [`$p = ${p}$`, `$${vert ? 'x^2' : 'y^2'} = 4(${p})${vert ? 'y' : 'x'} = ${4 * p}${vert ? 'y' : 'x'}$`],
    };
  },
  () => {
    const h = rnd(-5, 5), k = rnd(-5, 5), a = nz(-3, 3);
    // x = a(y − k)² + h ← قطع أفقي
    const right = `$(${h}, ${k})$، ويفتح ${a > 0 ? 'لليمين' : 'لليسار'}`;
    return choice(`ما رأس القطع المكافئ $x = ${a === 1 ? '' : a === -1 ? '-' : a}${shift('y', k)}^2 ${h === 0 ? '' : h > 0 ? `+ ${h}` : `- ${-h}`}$ واتجاه فتحته؟`, right,
      [`$(${k}, ${h})$، ويفتح ${a > 0 ? 'لليمين' : 'لليسار'}`, `$(${h}, ${k})$، ويفتح ${a > 0 ? 'لليسار' : 'لليمين'}`, `$(${h}, ${-k})$، ويفتح ${a > 0 ? 'للأعلى' : 'للأسفل'}`],
      'x = a(y − k)² + h قطع أفقي رأسه (h, k).',
      [`الرأس $(${h}, ${k})$`, `$a = ${a} ${a > 0 ? '> 0' : '< 0'}$ ← يفتح ${a > 0 ? 'لليمين' : 'لليسار'}.`]);
  },
  () => {
    const h = rnd(-4, 4), k = rnd(-4, 4), p = nz(-3, 3);
    // (y − k)² = 4p(x − h) ← بالصورة العامة y² − 2ky − 4px + (k² + 4ph) = 0
    const B = -2 * k, C = -4 * p, D = k * k + 4 * p * h;
    const terms = `y^2 ${B === 0 ? '' : B > 0 ? `+ ${B}y` : `- ${-B}y`} ${C > 0 ? `+ ${C}x` : `- ${-C}x`} ${D === 0 ? '' : D > 0 ? `+ ${D}` : `- ${-D}`} = 0`;
    return {
      kind: 'values', ordered: true, prompt: `أكمل المربع لإيجاد رأس القطع المكافئ $${terms}$. (اكتب: x، y)`, answer: [R(h), R(k)],
      hint: 'اجمع حدود y في طرف وأكمل المربع، ثم أخرج معامل x عاملًا مشتركًا.',
      solution: [`$y^2 ${B === 0 ? '' : B > 0 ? `+ ${B}y` : `- ${-B}y`} = ${-C}x ${-D >= 0 ? `+ ${-D}` : `- ${D}`}$`, h === 0 ? `$${shift('y', k)}^2 = ${4 * p}x$` : `$${shift('y', k)}^2 = ${4 * p}x ${-D + k * k >= 0 ? `+ ${-D + k * k}` : `- ${D - k * k}`} = ${4 * p}${shift('x', h)}$`, `الرأس $(${h}, ${k})$.`],
      placeholder: 'مثال: (2, -3)',
    };
  },
  () => {
    const w = pick([4, 6, 8, 10, 12]), d = pick([1, 2, 3]);
    // طبق قطع مكافئ x² = 4py يمر بـ (w/2, d) ← p = w²/(16 d)
    const p = (w * w) / (16 * d);
    return {
      kind: 'values', prompt: `طبق استقبال على شكل قطع مكافئ، قطره ${w} م وعمقه ${d} م. أين يجب وضع جهاز الاستقبال (البؤرة)؟ أوجد بعدها عن الرأس بالمتر.`, answer: [R(p)],
      hint: `ضع الرأس عند الأصل: x² = 4py يمر بالنقطة (${w / 2}, ${d}).`,
      solution: [`$(${w / 2})^2 = 4p(${d})$`, `$p = \\dfrac{${(w * w) / 4}}{${4 * d}} = ${frac(w * w, 16 * d)}$ م`],
    };
  },
];

// ================= 10.2 =================
const s102: Gen[] = [
  () => {
    const [a, b, c] = pick([[5, 4, 3], [5, 3, 4], [13, 12, 5], [13, 5, 12], [10, 8, 6], [10, 6, 8], [17, 15, 8]] as const);
    const horiz = Math.random() < 0.5;
    const eq = horiz ? `\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}} = 1` : `\\dfrac{x^2}{${b * b}} + \\dfrac{y^2}{${a * a}} = 1`;
    return {
      kind: 'values', prompt: `أوجد بعد كل بؤرة عن المركز $c$ للقطع الناقص $${eq}$.`, answer: [R(c)],
      hint: 'c² = a² − b² حيث a² المقام الأكبر.',
      solution: [`$c^2 = ${a * a} - ${b * b} = ${c * c}$`, `$c = ${c}$، والبؤرتان $${horiz ? `(\\pm ${c}, 0)` : `(0, \\pm ${c})`}$.`],
    };
  },
  () => {
    const a = rnd(3, 9), b = rnd(1, a - 1);
    const horiz = Math.random() < 0.5;
    const eq = horiz ? `${b * b}x^2 + ${a * a}y^2 = ${a * a * b * b}` : `${a * a}x^2 + ${b * b}y^2 = ${a * a * b * b}`;
    return {
      kind: 'values', ordered: true, prompt: `أوجد طولي المحورين الأكبر والأصغر للقطع الناقص $${eq}$. (اكتب: الأكبر، الأصغر)`, answer: [R(2 * a), R(2 * b)],
      hint: 'اقسم على الطرف الأيمن لتصل إلى الصورة القياسية.',
      solution: [`$${horiz ? `\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}}` : `\\dfrac{x^2}{${b * b}} + \\dfrac{y^2}{${a * a}}`} = 1$`, `$a = ${a}$، $b = ${b}$: المحوران $${2 * a}$ و $${2 * b}$.`],
      placeholder: 'مثال: 10, 6',
    };
  },
  () => {
    const [a, b, c] = pick([[5, 4, 3], [5, 3, 4], [13, 12, 5], [10, 8, 6], [25, 24, 7]] as const);
    return {
      kind: 'values', prompt: `قطع ناقص مركزه الأصل، أحد رأسيه $(${a}, 0)$ وإحدى بؤرتيه $(${c}, 0)$. معادلته $\\dfrac{x^2}{m} + \\dfrac{y^2}{n} = 1$؛ أوجد $n$.`, answer: [R(b * b)],
      hint: 'a بعد الرأس و c بعد البؤرة، و b² = a² − c².',
      solution: [`$a = ${a}$، $c = ${c}$`, `$b^2 = ${a * a} - ${c * c} = ${b * b}$`, `$\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}} = 1$`],
    };
  },
  () => {
    const h = rnd(-5, 5), k = rnd(-5, 5), a = rnd(2, 6), b = rnd(1, 5);
    return {
      kind: 'values', ordered: true, prompt: `ما مركز القطع الناقص $\\dfrac{${shift('x', h)}^2}{${a * a}} + \\dfrac{${shift('y', k)}^2}{${b * b}} = 1$؟ (اكتب: x، y)`, answer: [R(h), R(k)],
      hint: '(x − h)² و (y − k)² ← المركز (h, k).',
      solution: [`المركز $(${h}, ${k})$ (انتبه للإشارات).`],
      placeholder: 'مثال: (-2, 3)',
    };
  },
  () => {
    const [a, c] = pick([[5, 3], [10, 6], [13, 5], [4, 2], [8, 2], [6, 3]] as const);
    return {
      kind: 'values', tol: 0.0051, prompt: `أوجد الاختلاف المركزي لقطع ناقص فيه $a = ${a}$ و $c = ${c}$ (منزلتان أو كسر).`, answer: [R(c / a)],
      hint: 'e = c / a.',
      solution: [`$e = \\dfrac{c}{a} = ${frac(c, a)}$`],
      placeholder: 'مثال: 3/5',
    };
  },
];

// ================= 10.3 =================
const s103: Gen[] = [
  () => {
    const [a, b, c] = pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 15, 17]] as const);
    const horiz = Math.random() < 0.5;
    const eq = horiz ? `\\dfrac{x^2}{${a * a}} - \\dfrac{y^2}{${b * b}} = 1` : `\\dfrac{y^2}{${a * a}} - \\dfrac{x^2}{${b * b}} = 1`;
    return {
      kind: 'values', prompt: `أوجد $c$ (بعد البؤرة عن المركز) للقطع الزائد $${eq}$.`, answer: [R(c)],
      hint: 'في القطع الزائد c² = a² + b².',
      solution: [`$c^2 = ${a * a} + ${b * b} = ${c * c}$`, `$c = ${c}$، والبؤرتان $${horiz ? `(\\pm ${c}, 0)` : `(0, \\pm ${c})`}$.`],
    };
  },
  () => {
    const a = rnd(1, 6), b = rnd(1, 6);
    const horiz = Math.random() < 0.5;
    const eq = horiz ? `\\dfrac{x^2}{${a * a}} - \\dfrac{y^2}{${b * b}} = 1` : `\\dfrac{y^2}{${a * a}} - \\dfrac{x^2}{${b * b}} = 1`;
    const m = horiz ? b / a : a / b;
    return {
      kind: 'values', tol: 0.0051, prompt: `ما الميل الموجب لخطي تقارب القطع الزائد $${eq}$؟ (كسر أو منزلتان)`, answer: [R(m)],
      hint: horiz ? 'خطا التقارب y = ±(b/a)x.' : 'للقطع الرأسي y = ±(a/b)x.',
      solution: [`$y = \\pm ${horiz ? frac(b, a) : frac(a, b)}\\,x$`],
      placeholder: 'مثال: 4/3',
    };
  },
  () => {
    const kind = pick(['h', 'v'] as const);
    const right = kind === 'h' ? 'يفتح يمينًا ويسارًا (البؤرتان على محور x)' : 'يفتح للأعلى وللأسفل (البؤرتان على محور y)';
    const a2 = rnd(2, 9) ** 2, b2 = rnd(2, 9) ** 2;
    const eq = kind === 'h' ? `\\dfrac{x^2}{${a2}} - \\dfrac{y^2}{${b2}} = 1` : `\\dfrac{y^2}{${a2}} - \\dfrac{x^2}{${b2}} = 1`;
    return choice(`كيف يفتح القطع الزائد $${eq}$؟`, right,
      ['يفتح يمينًا ويسارًا (البؤرتان على محور x)', 'يفتح للأعلى وللأسفل (البؤرتان على محور y)', 'يفتح في الاتجاه الذي فيه المقام الأكبر'].filter((x) => x !== right),
      'المتغير الذي حده موجب يحدد المحور القاطع، بغض النظر عن المقامات.',
      [`الحد الموجب هو $${kind === 'h' ? 'x^2' : 'y^2'}$، فالمحور القاطع ${kind === 'h' ? 'أفقي' : 'رأسي'}.`]);
  },
  () => {
    const h = rnd(-5, 5), k = rnd(-5, 5), a = rnd(1, 5), b = rnd(1, 5);
    return {
      kind: 'values', ordered: true, prompt: `ما مركز القطع الزائد $\\dfrac{${shift('y', k)}^2}{${a * a}} - \\dfrac{${shift('x', h)}^2}{${b * b}} = 1$؟ (اكتب: x، y)`, answer: [R(h), R(k)],
      hint: 'المركز (h, k) كما في القطع الناقص.',
      solution: [`المركز $(${h}, ${k})$، والقطع رأسي.`],
      placeholder: 'مثال: (1, -4)',
    };
  },
  () => {
    const [a, c] = pick([[3, 5], [4, 5], [5, 13], [12, 13], [2, 3], [1, 2]] as const);
    return {
      kind: 'values', tol: 0.0051, prompt: `قطع زائد فيه $a = ${a}$ و $c = ${c}$. أوجد اختلافه المركزي (كسر أو منزلتان).`, answer: [R(c / a)],
      hint: 'e = c / a، وهو أكبر من 1 دائمًا للقطع الزائد.',
      solution: [`$e = \\dfrac{c}{a} = ${frac(c, a)} > 1$`],
      placeholder: 'مثال: 5/3',
    };
  },
];

// ================= 10.4 =================
const s104: Gen[] = [
  () => {
    const A = pick([0, 1, 2, 4, 9]), C = pick([0, 1, 2, 4, 9, -1, -4]);
    if (A === 0 && C === 0) return s104[0]();
    const sgn = Math.random() < 0.5 ? -1 : 1;
    const Cc = A === 0 ? C : C * (C === 0 ? 1 : sgn);
    const D = nz(-6, 6), E = nz(-6, 6), F = rnd(-20, 20);
    const name = A === 0 || Cc === 0 ? 'قطع مكافئ' : A === Cc ? 'دائرة' : A * Cc > 0 ? 'قطع ناقص' : 'قطع زائد';
    const terms = [A ? `${A === 1 ? '' : A}x^2` : '', Cc ? `${Cc === 1 ? '' : Cc === -1 ? '-' : Cc}y^2` : '', `${D}x`, `${E}y`, `${F}`].filter(Boolean).join(' + ').replace(/\+ -/g, '- ').replace(/^\+ /, '');
    return choice(`ما نوع القطع (على افتراض أنه غير منحل) $${terms} = 0$؟`, name,
      ['دائرة', 'قطع ناقص', 'قطع مكافئ', 'قطع زائد'].filter((x) => x !== name),
      'قارن معاملي x² و y²: أحدهما صفر ← مكافئ، متساويان ← دائرة، بالإشارة نفسها ← ناقص، بإشارتين مختلفتين ← زائد.',
      [`معامل $x^2$ هو $${A}$ ومعامل $y^2$ هو $${Cc}$ ← ${name}.`]);
  },
  () => {
    const name = pick(['دائرة', 'قطع ناقص', 'قطع مكافئ', 'قطع زائد'] as const);
    const e = { 'دائرة': '$e = 0$', 'قطع ناقص': '$0 < e < 1$', 'قطع مكافئ': '$e = 1$', 'قطع زائد': '$e > 1$' }[name];
    return choice(`ما قيم الاختلاف المركزي في حالة: ${name}؟`, e, ['$e = 0$', '$0 < e < 1$', '$e = 1$', '$e > 1$'].filter((x) => x !== e),
      'e يقيس ابتعاد الشكل عن الدائرة.',
      [`${name}: ${e}.`]);
  },
  () => {
    const h = rnd(-4, 4), k = rnd(-4, 4), r = rnd(1, 6);
    const D = -2 * h, E = -2 * k, F = h * h + k * k - r * r;
    const t = `x^2 + y^2 ${D === 0 ? '' : D > 0 ? `+ ${D}x` : `- ${-D}x`} ${E === 0 ? '' : E > 0 ? `+ ${E}y` : `- ${-E}y`} ${F === 0 ? '' : F > 0 ? `+ ${F}` : `- ${-F}`} = 0`;
    return {
      kind: 'values', ordered: true, prompt: `أكمل المربع: ما مركز ونصف قطر الدائرة $${t}$؟ (اكتب: x، y، r)`, answer: [R(h), R(k), R(r)],
      hint: 'جمّع حدود x وحدود y وأكمل المربعين.',
      solution: [`$${shift('x', h)}^2 + ${shift('y', k)}^2 = ${-F} + ${h * h} + ${k * k} = ${r * r}$`, `المركز $(${h}, ${k})$ ونصف القطر $${r}$.`],
      placeholder: 'مثال: (2, -1, 3)',
    };
  },
  () => {
    const e = pick([0.5, 1, 2, 0.25, 3]);
    const name = e === 1 ? 'قطع مكافئ' : e < 1 ? 'قطع ناقص' : 'قطع زائد';
    return choice(`مجموعة النقاط التي بعدها عن نقطة ثابتة يساوي ${e} مرة بعدها عن مستقيم ثابت هي:`, name,
      ['قطع ناقص', 'قطع مكافئ', 'قطع زائد', 'دائرة'].filter((x) => x !== name),
      'التعريف الموحد: PF = e · PD.',
      [`$e = ${e}$ ← ${name}.`]);
  },
];

export const ch10: Record<string, Gen[]> = { '10.1': s101, '10.2': s102, '10.3': s103, '10.4': s104 };
void simpRoot; void simpRootP; void r2;
