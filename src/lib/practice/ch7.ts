// مولّدات تمارين الفصل 7: المتطابقات والمعادلات المثلثية
import { rnd, pick, gcd, R, frac, choice, type Problem } from '../gen';

type Gen = () => Problem;
const PI = Math.PI;
const D = PI / 180;
const r2 = (v: number, d = 2) => +v.toFixed(d);
const qn = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع'];

/** kπ/den بصيغة TeX مختزلة */
function piT(k: number, den: number): string {
  if (k === 0) return '0';
  const g = gcd(k, den) || 1;
  let n = k / g, d = den / g;
  if (d < 0) { n = -n; d = -d; }
  const s = n < 0 ? '-' : '';
  const top = Math.abs(n) === 1 ? '\\pi ' : `${Math.abs(n)}\\pi `;
  return d === 1 ? `${s}${top}` : `${s}\\dfrac{${top}}{${d}}`;
}
const piV = (k: number, den: number) => (k * PI) / den;
/** جذر مبسط بصيغة TeX */
function rT(n: number): string {
  let k = 1, m = n;
  for (let p = 2; p * p <= m; p++) while (m % (p * p) === 0) { m /= p * p; k *= p; }
  return m === 1 ? String(k) : `${k === 1 ? '' : k}\\sqrt{${m}}`;
}
/** نقطة على الضلع النهائي في ربع q من ثلاثية (a, b): x = ±a ، y = ±b */
const TRI: [number, number][] = [[3, 4], [4, 3], [5, 12], [12, 5], [8, 15], [15, 8], [7, 24], [24, 7]];
function pointIn(q: number): { x: number; y: number; r: number } {
  const [a, b] = pick(TRI);
  const sx = q === 2 || q === 3 ? -1 : 1, sy = q === 3 || q === 4 ? -1 : 1;
  return { x: sx * a, y: sy * b, r: Math.hypot(a, b) };
}
const fr = (p: number, q: number) => frac(p, q);
type F6 = 'sin' | 'cos' | 'tan' | 'csc' | 'sec' | 'cot';
const ratio = (fn: F6, x: number, y: number, r: number): [number, number] =>
  ({ sin: [y, r], cos: [x, r], tan: [y, x], csc: [r, y], sec: [r, x], cot: [x, y] } as Record<F6, [number, number]>)[fn];

/** حلول دقيقة على شكل kπ/den */
function solSet(ks: [number, number][]): { vals: number[]; tex: string } {
  const uniq = ks.filter((k, i) => ks.findIndex((o) => Math.abs(piV(...o) - piV(...k)) < 1e-9) === i).sort((a, b) => piV(...a) - piV(...b));
  return { vals: uniq.map((k) => piV(...k)), tex: uniq.map((k) => piT(...k)).join(',\\ ') };
}

// ================= 7.1 =================
const SIMPLE1: [string, string, string, string][] = [
  ['\\tan x\\cos x', 'sin(x)', '\\dfrac{\\sin x}{\\cos x}\\cdot\\cos x', '\\sin x'],
  ['\\cot x\\sin x', 'cos(x)', '\\dfrac{\\cos x}{\\sin x}\\cdot\\sin x', '\\cos x'],
  ['\\dfrac{1 - \\cos^2 x}{\\sin x}', 'sin(x)', '\\dfrac{\\sin^2 x}{\\sin x}', '\\sin x'],
  ['\\dfrac{\\sin^2 x}{\\cos x} + \\cos x', 'sec(x)', '\\dfrac{\\sin^2 x + \\cos^2 x}{\\cos x} = \\dfrac{1}{\\cos x}', '\\sec x'],
  ['\\dfrac{1}{1 + \\tan^2 x}', 'cos(x)^2', '\\dfrac{1}{\\sec^2 x}', '\\cos^2 x'],
  ['\\sec^2 x - 1', 'tan(x)^2', '1 + \\tan^2 x - 1', '\\tan^2 x'],
  ['\\csc x\\tan x', 'sec(x)', '\\dfrac{1}{\\sin x}\\cdot\\dfrac{\\sin x}{\\cos x}', '\\sec x'],
  ['\\cos x(\\sec x - \\cos x)', 'sin(x)^2', '1 - \\cos^2 x', '\\sin^2 x'],
  ['(1 + \\cot^2 x)\\sin^2 x', '1', '\\csc^2 x\\cdot\\sin^2 x', '1'],
  ['\\dfrac{\\cot x}{\\csc x}', 'cos(x)', '\\dfrac{\\cos x / \\sin x}{1/\\sin x}', '\\cos x'],
  ['\\dfrac{\\sec x - \\cos x}{\\sin x}', 'tan(x)', '\\dfrac{\\tfrac{1 - \\cos^2 x}{\\cos x}}{\\sin x} = \\dfrac{\\sin^2 x}{\\cos x\\sin x}', '\\tan x'],
  ['\\sin(-x)\\csc x', '-1', '-\\sin x\\cdot\\dfrac{1}{\\sin x}', '-1'],
  ['\\cos(-x)\\tan(-x)', '-sin(x)', '\\cos x\\cdot(-\\tan x)', '-\\sin x'],
];
const s71: Gen[] = [
  () => {
    const [q, t, step, ans] = pick(SIMPLE1);
    return {
      kind: 'expr', prompt: `بسّط إلى دالة مثلثية واحدة أو عدد: $${q}$`, answer: t, vars: ['x'], require: ['oneTrig'],
      hint: 'حوّل كل شيء إلى sin و cos، ثم استخدم sin²x + cos²x = 1.',
      solution: [`$${q} = ${step}$`, `$= ${ans}$`],
      placeholder: 'مثال: sec(x) أو cos(x)^2',
    };
  },
  () => {
    const q = rnd(2, 4);
    const { x, y, r } = pointIn(q);
    const given = pick(['sin', 'cos', 'tan'] as const);
    const want = pick((['sin', 'cos', 'tan', 'sec', 'csc', 'cot'] as const).filter((f) => f !== given));
    const [gp, gq] = ratio(given, x, y, r);
    const [wp, wq] = ratio(want, x, y, r);
    return {
      kind: 'values', prompt: `إذا كان $\\${given}\\theta = ${fr(gp, gq)}$ و $\\theta$ في الربع ${qn[q]}، فأوجد $\\${want}\\theta$.`, answer: [R(wp / wq)],
      hint: 'ارسم مثلثًا مرجعيًا أو استخدم متطابقات فيثاغورس، ثم اختر الإشارة حسب الربع.',
      solution: [`في الربع ${qn[q]}: $x = ${x}$، $y = ${y}$، $r = ${r}$.`, `$\\${want}\\theta = ${fr(wp, wq)}$`],
      placeholder: 'مثال: -5/13',
    };
  },
  () => {
    const a = pick([0.2, 0.35, 0.6, 0.75, -0.4, -0.15]);
    const fn = pick(['sin', 'cos', 'tan', 'csc', 'sec', 'cot'] as const);
    const odd = fn !== 'cos' && fn !== 'sec';
    return {
      kind: 'values', prompt: `إذا كان $\\${fn}\\theta = ${a}$، فما قيمة $\\${fn}(-\\theta)$؟`, answer: [R(odd ? -a : a)],
      hint: 'cos و sec زوجيتان، والبقية فردية.',
      solution: [odd ? `$\\${fn}$ فردية: $\\${fn}(-\\theta) = -\\${fn}\\theta$` : `$\\${fn}$ زوجية: $\\${fn}(-\\theta) = \\${fn}\\theta$`, `$= ${odd ? -a : a}$`],
    };
  },
  () => {
    const right = pick(['$\\sin^2 x = 1 - \\cos^2 x$', '$\\tan^2 x = \\sec^2 x - 1$', '$\\cot^2 x = \\csc^2 x - 1$', '$\\cos x = \\dfrac{1}{\\sec x}$']);
    return choice('أي المتطابقات الآتية صحيحة لكل x معرّفة؟', right,
      ['$\\sin^2 x = 1 + \\cos^2 x$', '$\\tan^2 x = 1 - \\sec^2 x$', '$\\sec x = \\dfrac{1}{\\sin x}$', '$\\cot x = \\dfrac{\\sin x}{\\cos x}$'],
      'تذكّر المتطابقات الثلاث لفيثاغورس، ومقلوب كل دالة.',
      [`${right} صحيحة.`, 'المتطابقات الأساسية: $\\sin^2 x + \\cos^2 x = 1$، $\\tan^2 x + 1 = \\sec^2 x$، $1 + \\cot^2 x = \\csc^2 x$، و $\\sec x = \\tfrac{1}{\\cos x}$، و $\\cot x = \\tfrac{\\cos x}{\\sin x}$.']);
  },
];

// ================= 7.2 =================
const SIMPLE2: [string, string, string[]][] = [
  ['(1 - \\sin x)(1 + \\sin x)', 'cos(x)^2', ['$= 1 - \\sin^2 x$', '$= \\cos^2 x$']],
  ['\\sec x - \\tan x\\sin x', 'cos(x)', ['$= \\dfrac{1}{\\cos x} - \\dfrac{\\sin^2 x}{\\cos x} = \\dfrac{1 - \\sin^2 x}{\\cos x}$', '$= \\dfrac{\\cos^2 x}{\\cos x} = \\cos x$']],
  ['\\dfrac{\\tan x}{\\sec x}', 'sin(x)', ['$= \\dfrac{\\sin x / \\cos x}{1 / \\cos x}$', '$= \\sin x$']],
  ['(\\csc x - \\cot x)(\\csc x + \\cot x)', '1', ['$= \\csc^2 x - \\cot^2 x$', '$= 1$ (من $1 + \\cot^2 x = \\csc^2 x$)']],
  ['\\dfrac{1}{1 - \\sin x} + \\dfrac{1}{1 + \\sin x}', '2sec(x)^2', ['$= \\dfrac{(1 + \\sin x) + (1 - \\sin x)}{1 - \\sin^2 x}$', '$= \\dfrac{2}{\\cos^2 x} = 2\\sec^2 x$']],
  ['(\\sin x + \\cos x)^2 - 2\\sin x\\cos x', '1', ['$= \\sin^2 x + 2\\sin x\\cos x + \\cos^2 x - 2\\sin x\\cos x$', '$= \\sin^2 x + \\cos^2 x = 1$']],
  ['\\dfrac{\\cos x}{1 - \\sin x} - \\dfrac{\\cos x}{1 + \\sin x}', '2tan(x)', ['$= \\dfrac{\\cos x(1 + \\sin x) - \\cos x(1 - \\sin x)}{1 - \\sin^2 x}$', '$= \\dfrac{2\\sin x\\cos x}{\\cos^2 x} = 2\\tan x$']],
  ['\\sin^4 x - \\cos^4 x + \\cos^2 x', 'sin(x)^2', ['$= (\\sin^2 x - \\cos^2 x)(\\sin^2 x + \\cos^2 x) + \\cos^2 x$', '$= \\sin^2 x - \\cos^2 x + \\cos^2 x = \\sin^2 x$']],
];
const s72: Gen[] = [
  () => {
    const [q, t, steps] = pick(SIMPLE2);
    return {
      kind: 'expr', prompt: `بسّط الطرف الأيسر إلى أبسط صورة (دالة مثلثية واحدة أو عدد): $${q}$`, answer: t, vars: ['x'], require: ['oneTrig'],
      hint: 'اضرب، أو وحّد المقامات، أو حلّل الفرق بين مربعين، ثم استخدم متطابقات فيثاغورس.',
      solution: [`$${q}$`, ...steps],
      placeholder: 'مثال: 2sec(x)^2',
    };
  },
  () => {
    const right = pick(['$\\dfrac{\\cos x}{1 - \\sin x} = \\dfrac{1 + \\sin x}{\\cos x}$', '$\\tan x + \\cot x = \\sec x\\csc x$', '$\\dfrac{1 + \\tan^2 x}{\\tan^2 x} = \\csc^2 x$', '$\\cos^4 x - \\sin^4 x = \\cos^2 x - \\sin^2 x$']);
    return choice('أي مما يأتي متطابقة صحيحة؟ (يمكنك تجربتها بأداة الرسم في الدرس)', right,
      ['$(\\sin x + \\cos x)^2 = 1$', '$\\sin x + \\cos x = 1$', '$\\dfrac{\\sin 2x}{2} = \\sin x$', '$\\sqrt{\\sin^2 x + 9} = \\sin x + 3$'],
      'جرّب قيمة مثل x = π/4 أو x = 1 في كل طرف؛ قيمة واحدة لا تتحقق تكفي لنفي المتطابقة.',
      [`${right} متطابقة.`, 'والبقية تفشل عند قيمة واحدة على الأقل، مثلًا $(\\sin x + \\cos x)^2 = 1 + 2\\sin x\\cos x$ وليست 1.']);
  },
  () => {
    const items: [string, string, string[]][] = [
      ['\\dfrac{\\sec x}{\\csc x} = \\tan x', 'حوّل الطرف الأيسر إلى $\\sin$ و $\\cos$', ['اضرب الطرفين في $\\csc x$', 'ربّع الطرفين', 'اطرح $\\tan x$ من الطرفين']],
      ['\\dfrac{1}{\\sec x - 1} + \\dfrac{1}{\\sec x + 1} = 2\\cot x\\csc x', 'وحّد مقامي الطرف الأيسر', ['حوّل الطرف الأيمن إلى صورة ضرب', 'انقل حدود الأيمن إلى الأيسر', 'عوّض $x = 0$']],
      ['\\dfrac{\\cos x}{1 + \\sin x} = \\dfrac{1 - \\sin x}{\\cos x}', 'اضرب بسط الطرف الأيسر ومقامه في المرافق $1 - \\sin x$', ['ربّع الطرفين', 'اطرح 1 من الطرفين', 'اضرب الطرفين في المقامين معًا وأكمل كمعادلة']],
    ];
    const [eq, right, wrong] = pick(items);
    return choice(`لإثبات المتطابقة $${eq}$، أي خطوة أولى مناسبة؟`, right, wrong,
      'في إثبات المتطابقة نعمل على طرف واحد (غالبًا الأعقد) حتى يصير مثل الآخر، ولا نعاملها كمعادلة.',
      [`${right}.`, 'لا نضرب الطرفين أو نربّعهما أو ننقل الحدود، لأن ذلك يفترض صحة ما نريد إثباته.']);
  },
];

// ================= 7.3 =================
const SUMS: [string, number, string][] = [
  ['\\cos 75^\\circ', Math.cos(75 * D), '\\cos(45^\\circ + 30^\\circ) = \\cos 45^\\circ\\cos 30^\\circ - \\sin 45^\\circ\\sin 30^\\circ = \\dfrac{\\sqrt6 - \\sqrt2}{4}'],
  ['\\sin 75^\\circ', Math.sin(75 * D), '\\sin(45^\\circ + 30^\\circ) = \\sin 45^\\circ\\cos 30^\\circ + \\cos 45^\\circ\\sin 30^\\circ = \\dfrac{\\sqrt6 + \\sqrt2}{4}'],
  ['\\sin 15^\\circ', Math.sin(15 * D), '\\sin(45^\\circ - 30^\\circ) = \\sin 45^\\circ\\cos 30^\\circ - \\cos 45^\\circ\\sin 30^\\circ = \\dfrac{\\sqrt6 - \\sqrt2}{4}'],
  ['\\cos 15^\\circ', Math.cos(15 * D), '\\cos(45^\\circ - 30^\\circ) = \\cos 45^\\circ\\cos 30^\\circ + \\sin 45^\\circ\\sin 30^\\circ = \\dfrac{\\sqrt6 + \\sqrt2}{4}'],
  ['\\tan 15^\\circ', Math.tan(15 * D), '\\tan(45^\\circ - 30^\\circ) = \\dfrac{1 - \\tfrac{\\sqrt3}{3}}{1 + \\tfrac{\\sqrt3}{3}} = 2 - \\sqrt3'],
  ['\\tan 75^\\circ', Math.tan(75 * D), '\\tan(45^\\circ + 30^\\circ) = \\dfrac{1 + \\tfrac{\\sqrt3}{3}}{1 - \\tfrac{\\sqrt3}{3}} = 2 + \\sqrt3'],
  ['\\cos 105^\\circ', Math.cos(105 * D), '\\cos(60^\\circ + 45^\\circ) = \\cos 60^\\circ\\cos 45^\\circ - \\sin 60^\\circ\\sin 45^\\circ = \\dfrac{\\sqrt2 - \\sqrt6}{4}'],
  ['\\sin\\dfrac{7\\pi}{12}', Math.sin((7 * PI) / 12), '\\sin\\left(\\dfrac{\\pi}{3} + \\dfrac{\\pi}{4}\\right) = \\dfrac{\\sqrt3}{2}\\cdot\\dfrac{\\sqrt2}{2} + \\dfrac12\\cdot\\dfrac{\\sqrt2}{2} = \\dfrac{\\sqrt6 + \\sqrt2}{4}'],
  ['\\cos\\dfrac{\\pi}{12}', Math.cos(PI / 12), '\\cos\\left(\\dfrac{\\pi}{3} - \\dfrac{\\pi}{4}\\right) = \\dfrac12\\cdot\\dfrac{\\sqrt2}{2} + \\dfrac{\\sqrt3}{2}\\cdot\\dfrac{\\sqrt2}{2} = \\dfrac{\\sqrt2 + \\sqrt6}{4}'],
];
const SHIFT: [string, string, string][] = [
  ['\\cos\\left(x - \\dfrac{\\pi}{2}\\right)', 'sin(x)', '\\cos x\\cos\\tfrac{\\pi}{2} + \\sin x\\sin\\tfrac{\\pi}{2} = \\sin x'],
  ['\\sin(x + \\pi)', '-sin(x)', '\\sin x\\cos\\pi + \\cos x\\sin\\pi = -\\sin x'],
  ['\\cos(\\pi - x)', '-cos(x)', '\\cos\\pi\\cos x + \\sin\\pi\\sin x = -\\cos x'],
  ['\\sin\\left(\\dfrac{3\\pi}{2} - x\\right)', '-cos(x)', '\\sin\\tfrac{3\\pi}{2}\\cos x - \\cos\\tfrac{3\\pi}{2}\\sin x = -\\cos x'],
  ['\\tan(x + \\pi)', 'tan(x)', '\\dfrac{\\tan x + \\tan\\pi}{1 - \\tan x\\tan\\pi} = \\tan x'],
  ['\\sin\\left(x + \\dfrac{\\pi}{2}\\right)', 'cos(x)', '\\sin x\\cos\\tfrac{\\pi}{2} + \\cos x\\sin\\tfrac{\\pi}{2} = \\cos x'],
  ['\\cos(x + \\pi)', '-cos(x)', '\\cos x\\cos\\pi - \\sin x\\sin\\pi = -\\cos x'],
];
const s73: Gen[] = [
  () => {
    const [e, v, step] = pick(SUMS);
    return {
      kind: 'values', prompt: `أوجد القيمة الدقيقة لـ $${e}$ باستخدام متطابقات المجموع أو الفرق.`, answer: [R(v)],
      hint: 'اكتب الزاوية مجموعًا أو فرقًا لزاويتين خاصتين (30°، 45°، 60° أو π/6، π/4، π/3).',
      solution: [`$${e} = ${step}$`, `$\\approx ${r2(v, 4)}$`],
      placeholder: 'مثال: (sqrt(6)-sqrt(2))/4',
    };
  },
  () => {
    const qa = rnd(1, 2), qb = pick([3, 4]);
    const A = pointIn(qa), B = pointIn(qb);
    const sA = A.y / A.r, cA = A.x / A.r, sB = B.y / B.r, cB = B.x / B.r;
    const which = pick(['sin+', 'sin-', 'cos+', 'cos-'] as const);
    const val = which === 'sin+' ? sA * cB + cA * sB : which === 'sin-' ? sA * cB - cA * sB : which === 'cos+' ? cA * cB - sA * sB : cA * cB + sA * sB;
    const name = { 'sin+': '\\sin(A + B)', 'sin-': '\\sin(A - B)', 'cos+': '\\cos(A + B)', 'cos-': '\\cos(A - B)' }[which];
    const formula = { 'sin+': '\\sin A\\cos B + \\cos A\\sin B', 'sin-': '\\sin A\\cos B - \\cos A\\sin B', 'cos+': '\\cos A\\cos B - \\sin A\\sin B', 'cos-': '\\cos A\\cos B + \\sin A\\sin B' }[which];
    const P = A.r * B.r;
    return {
      kind: 'values', prompt: `إذا كان $\\sin A = ${fr(A.y, A.r)}$ و $A$ في الربع ${qn[qa]}، و $\\cos B = ${fr(B.x, B.r)}$ و $B$ في الربع ${qn[qb]}، فأوجد $${name}$.`, answer: [R(val)],
      hint: 'أوجد cos A و sin B أولًا بإشارتيهما، ثم طبّق القانون.',
      solution: [`$\\cos A = ${fr(A.x, A.r)}$، $\\sin B = ${fr(B.y, B.r)}$`, `$${name} = ${formula}$`, `$= ${fr(Math.round(val * P), P)}$`],
      placeholder: 'مثال: -33/65',
    };
  },
  () => {
    const [e, t, step] = pick(SHIFT);
    return {
      kind: 'expr', prompt: `اكتب بدلالة دالة واحدة لـ $x$: $${e}$`, answer: t, vars: ['x'], require: ['oneTrig'],
      hint: 'استخدم متطابقة المجموع أو الفرق، مع قيم الدوال عند π/2 و π و 3π/2.',
      solution: [`$${e} = ${step}$`],
      placeholder: 'مثال: -cos(x)',
    };
  },
  () => {
    const [f1, f2] = pick([['sin', 'cos'], ['cos', 'sin'], ['tan', 'cot'], ['sec', 'csc']] as const);
    const t = rnd(5, 85);
    return {
      kind: 'values', prompt: `أوجد الزاوية الحادة $\\theta$ (بالدرجات) التي تحقق $\\${f1} ${t}^\\circ = \\${f2}\\theta$.`, answer: [R(90 - t)],
      hint: 'متطابقات الدوال المتتامة: f(θ) = co-f(90° − θ).',
      solution: [`$\\${f1} ${t}^\\circ = \\${f2}(90^\\circ - ${t}^\\circ)$`, `$\\theta = ${90 - t}^\\circ$`],
    };
  },
  () => {
    const a = rnd(10, 70), b = rnd(5, 60);
    const kind = pick(['s+', 's-', 'c+', 'c-'] as const);
    const lhs = { 's+': `\\sin ${a}^\\circ\\cos ${b}^\\circ + \\cos ${a}^\\circ\\sin ${b}^\\circ`, 's-': `\\sin ${a}^\\circ\\cos ${b}^\\circ - \\cos ${a}^\\circ\\sin ${b}^\\circ`, 'c+': `\\cos ${a}^\\circ\\cos ${b}^\\circ - \\sin ${a}^\\circ\\sin ${b}^\\circ`, 'c-': `\\cos ${a}^\\circ\\cos ${b}^\\circ + \\sin ${a}^\\circ\\sin ${b}^\\circ` }[kind];
    const right = { 's+': `$\\sin ${a + b}^\\circ$`, 's-': `$\\sin ${a - b}^\\circ$`, 'c+': `$\\cos ${a + b}^\\circ$`, 'c-': `$\\cos ${a - b}^\\circ$` }[kind];
    const fn = kind[0] === 's' ? '\\sin' : '\\cos';
    const other = kind[0] === 's' ? '\\cos' : '\\sin';
    const opp = kind[1] === '+' ? a - b : a + b;
    return choice(`اكتب على صورة دالة واحدة: $${lhs}$`, right,
      [`$${fn} ${opp}^\\circ$`, `$${other} ${a + b}^\\circ$`, `$${other} ${a - b}^\\circ$`],
      'قارن بالقوانين: sin(A ± B) = sin A cos B ± cos A sin B، و cos(A ± B) = cos A cos B ∓ sin A sin B (لاحظ عكس الإشارة في جيب التمام).',
      [`هذا قانون $${fn}(A ${kind[1] === '+' ? '+' : '-'} B)$ مع $A = ${a}^\\circ$ و $B = ${b}^\\circ$.`, `الناتج ${right}`]);
  },
];

// ================= 7.4 =================
const s74: Gen[] = [
  () => {
    const q = rnd(1, 4);
    const { x, y, r } = pointIn(q);
    const given = pick(['sin', 'cos'] as const);
    const want = pick(['sin2', 'cos2', 'tan2'] as const);
    const s = y / r, c = x / r;
    const val = want === 'sin2' ? 2 * s * c : want === 'cos2' ? c * c - s * s : (2 * s * c) / (c * c - s * s);
    const nm = { sin2: '\\sin 2\\theta', cos2: '\\cos 2\\theta', tan2: '\\tan 2\\theta' }[want];
    const formula = { sin2: '2\\sin\\theta\\cos\\theta', cos2: '\\cos^2\\theta - \\sin^2\\theta', tan2: '\\dfrac{\\sin 2\\theta}{\\cos 2\\theta}' }[want];
    const exact = want === 'tan2' ? fr(2 * x * y, x * x - y * y) : fr(Math.round(val * r * r), r * r);
    return {
      kind: 'values', prompt: `إذا كان $\\${given}\\theta = ${given === 'sin' ? fr(y, r) : fr(x, r)}$ و $\\theta$ في الربع ${qn[q]}، فأوجد $${nm}$.`, answer: [R(val)],
      hint: 'أوجد الدالة الأخرى بإشارتها، ثم طبّق قانون ضعف الزاوية.',
      solution: [`$\\sin\\theta = ${fr(y, r)}$، $\\cos\\theta = ${fr(x, r)}$`, `$${nm} = ${formula}$`, `$= ${exact}$`],
      placeholder: 'مثال: -120/169',
    };
  },
  () => {
    const items: [string, number, string][] = [
      ['\\sin 15^\\circ', Math.sin(15 * D), '\\sin\\dfrac{30^\\circ}{2} = \\sqrt{\\dfrac{1 - \\cos 30^\\circ}{2}} = \\dfrac{\\sqrt{2 - \\sqrt3}}{2}'],
      ['\\cos 15^\\circ', Math.cos(15 * D), '\\cos\\dfrac{30^\\circ}{2} = \\sqrt{\\dfrac{1 + \\cos 30^\\circ}{2}} = \\dfrac{\\sqrt{2 + \\sqrt3}}{2}'],
      ['\\cos 22.5^\\circ', Math.cos(22.5 * D), '\\cos\\dfrac{45^\\circ}{2} = \\sqrt{\\dfrac{1 + \\cos 45^\\circ}{2}} = \\dfrac{\\sqrt{2 + \\sqrt2}}{2}'],
      ['\\sin 22.5^\\circ', Math.sin(22.5 * D), '\\sin\\dfrac{45^\\circ}{2} = \\sqrt{\\dfrac{1 - \\cos 45^\\circ}{2}} = \\dfrac{\\sqrt{2 - \\sqrt2}}{2}'],
      ['\\tan 22.5^\\circ', Math.tan(22.5 * D), '\\tan\\dfrac{45^\\circ}{2} = \\dfrac{1 - \\cos 45^\\circ}{\\sin 45^\\circ} = \\sqrt2 - 1'],
      ['\\cos 112.5^\\circ', Math.cos(112.5 * D), '\\cos\\dfrac{225^\\circ}{2} = -\\sqrt{\\dfrac{1 + \\cos 225^\\circ}{2}} = -\\dfrac{\\sqrt{2 - \\sqrt2}}{2}'],
      ['\\tan 67.5^\\circ', Math.tan(67.5 * D), '\\tan\\dfrac{135^\\circ}{2} = \\dfrac{1 - \\cos 135^\\circ}{\\sin 135^\\circ} = \\sqrt2 + 1'],
    ];
    const [e, v, step] = pick(items);
    return {
      kind: 'values', prompt: `استخدم متطابقات نصف الزاوية لإيجاد القيمة الدقيقة لـ $${e}$.`, answer: [R(v)],
      hint: 'اكتب الزاوية نصفًا لزاوية خاصة، واختر الإشارة حسب ربع الزاوية النصفية.',
      solution: [`$${e} = ${step}$`, `$\\approx ${r2(v, 4)}$`],
      placeholder: 'مثال: sqrt(2-sqrt(3))/2',
    };
  },
  () => {
    const q = rnd(2, 4);
    const { x, y, r } = pointIn(q);
    // θ في الربع q ضمن [0, 2π) ← θ/2 في الربع الأول أو الثاني
    const th = Math.atan2(y, x);
    const t = th < 0 ? th + 2 * PI : th;
    const want = pick(['sin', 'cos'] as const);
    const h = t / 2;
    const val = want === 'sin' ? Math.sin(h) : Math.cos(h);
    const inside = want === 'sin' ? (r - x) / (2 * r) : (r + x) / (2 * r);
    const hq = h < PI / 2 ? 1 : 2;
    return {
      kind: 'values', prompt: `إذا كان $\\cos\\theta = ${fr(x, r)}$ و $${q === 2 ? '\\tfrac{\\pi}{2}' : q === 3 ? '\\pi' : '\\tfrac{3\\pi}{2}'} < \\theta < ${q === 2 ? '\\pi' : q === 3 ? '\\tfrac{3\\pi}{2}' : '2\\pi'}$، فأوجد $\\${want}\\dfrac{\\theta}{2}$.`, answer: [R(val)],
      hint: 'حدد ربع θ/2 أولًا بقسمة حدود الفترة على 2، ثم استخدم قانون نصف الزاوية.',
      solution: [`$\\dfrac{\\theta}{2}$ في الربع ${qn[hq]}، فإشارة $\\${want}\\tfrac{\\theta}{2}$ ${val > 0 ? 'موجبة' : 'سالبة'}.`, `$\\${want}\\dfrac{\\theta}{2} = ${val > 0 ? '' : '-'}\\sqrt{\\dfrac{1 ${want === 'sin' ? '-' : '+'} (${fr(x, r)})}{2}} = ${val > 0 ? '' : '-'}\\sqrt{${fr(Math.round(inside * 2 * r), 2 * r)}}$`, `$\\approx ${r2(val, 4)}$`],
      placeholder: 'مثال: 2sqrt(5)/5',
    };
  },
  () => {
    const k = pick([1, 2, 3, 4]);
    const kx = k === 1 ? 'x' : `${k}x`;
    const k2 = `${2 * k}x`;
    const items: [string, string, string][] = [
      [`2\\sin ${kx}\\cos ${kx}`, `sin(${2 * k}x)`, `\\sin ${k2}`],
      [`\\cos^2 ${kx} - \\sin^2 ${kx}`, `cos(${2 * k}x)`, `\\cos ${k2}`],
      [`1 - 2\\sin^2 ${kx}`, `cos(${2 * k}x)`, `\\cos ${k2}`],
      [`2\\cos^2 ${kx} - 1`, `cos(${2 * k}x)`, `\\cos ${k2}`],
      [`\\dfrac{2\\tan ${kx}}{1 - \\tan^2 ${kx}}`, `tan(${2 * k}x)`, `\\tan ${k2}`],
    ];
    const [e, t, ans] = pick(items);
    return {
      kind: 'expr', prompt: `اكتب على صورة دالة مثلثية واحدة: $${e}$`, answer: t, vars: ['x'], require: ['oneTrig'],
      hint: 'هذه صورة إحدى متطابقات ضعف الزاوية مع الزاوية ' + kx + '.',
      solution: [`بقانون ضعف الزاوية للزاوية $${kx}$: $${e} = ${ans}$`],
      placeholder: 'مثال: sin(4x)',
    };
  },
  () => {
    const right = '$\\tfrac12\\left[\\sin(A + B) + \\sin(A - B)\\right]$';
    return choice('أي مما يأتي يساوي $\\sin A\\cos B$؟', right,
      ['$\\tfrac12\\left[\\cos(A - B) + \\cos(A + B)\\right]$', '$\\sin(A + B)$', '$\\tfrac12\\left[\\sin(A + B) - \\sin(A - B)\\right]$'],
      'اجمع قانوني sin(A + B) و sin(A − B).',
      ['$\\sin(A + B) + \\sin(A - B) = 2\\sin A\\cos B$', `إذن $\\sin A\\cos B = $ ${right}`]);
  },
];

// ================= 7.5 =================
const ARC: [string, number, string, string][] = [
  ['\\sin^{-1}\\dfrac12', PI / 6, '\\dfrac{\\pi}{6}', '\\sin\\tfrac{\\pi}{6} = \\tfrac12 و \\tfrac{\\pi}{6} \\in \\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]'],
  ['\\sin^{-1}\\left(-\\dfrac{\\sqrt3}{2}\\right)', -PI / 3, '-\\dfrac{\\pi}{3}', '\\sin\\left(-\\tfrac{\\pi}{3}\\right) = -\\tfrac{\\sqrt3}{2}'],
  ['\\sin^{-1}(-1)', -PI / 2, '-\\dfrac{\\pi}{2}', '\\sin\\left(-\\tfrac{\\pi}{2}\\right) = -1'],
  ['\\cos^{-1}\\left(-\\dfrac12\\right)', (2 * PI) / 3, '\\dfrac{2\\pi}{3}', '\\cos\\tfrac{2\\pi}{3} = -\\tfrac12 و \\tfrac{2\\pi}{3} \\in [0, \\pi]'],
  ['\\cos^{-1}\\dfrac{\\sqrt2}{2}', PI / 4, '\\dfrac{\\pi}{4}', '\\cos\\tfrac{\\pi}{4} = \\tfrac{\\sqrt2}{2}'],
  ['\\cos^{-1}\\left(-\\dfrac{\\sqrt3}{2}\\right)', (5 * PI) / 6, '\\dfrac{5\\pi}{6}', '\\cos\\tfrac{5\\pi}{6} = -\\tfrac{\\sqrt3}{2}'],
  ['\\cos^{-1} 0', PI / 2, '\\dfrac{\\pi}{2}', '\\cos\\tfrac{\\pi}{2} = 0'],
  ['\\tan^{-1}(-1)', -PI / 4, '-\\dfrac{\\pi}{4}', '\\tan\\left(-\\tfrac{\\pi}{4}\\right) = -1 و -\\tfrac{\\pi}{4} \\in \\left(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right)'],
  ['\\tan^{-1}\\sqrt3', PI / 3, '\\dfrac{\\pi}{3}', '\\tan\\tfrac{\\pi}{3} = \\sqrt3'],
  ['\\cot^{-1}(-1)', (3 * PI) / 4, '\\dfrac{3\\pi}{4}', '\\text{range of } \\cot^{-1} \\text{ is } (0, \\pi)\\text{, and } \\cot\\tfrac{3\\pi}{4} = -1'],
  ['\\sec^{-1} 2', PI / 3, '\\dfrac{\\pi}{3}', '\\sec^{-1} 2 = \\cos^{-1}\\tfrac12'],
  ['\\csc^{-1}(-2)', -PI / 6, '-\\dfrac{\\pi}{6}', '\\csc^{-1}(-2) = \\sin^{-1}\\left(-\\tfrac12\\right)'],
];
const s75: Gen[] = [
  () => {
    const [e, v, ans, why] = pick(ARC);
    return {
      kind: 'values', prompt: `أوجد القيمة الدقيقة بالراديان: $${e}$`, answer: [R(v)],
      hint: 'تذكّر مدى كل دالة عكسية: sin⁻¹ في [−π/2, π/2]، و cos⁻¹ في [0, π]، و tan⁻¹ في (−π/2, π/2).',
      solution: [`$${why.replace(/ و /g, '\\text{ and }')}$`, `$${e} = ${ans}$`],
      placeholder: 'مثال: -pi/3',
    };
  },
  () => {
    const fn = pick(['sin', 'cos', 'tan'] as const);
    const [a, b] = pick(TRI);
    const r = Math.hypot(a, b);
    const neg = fn !== 'cos' && Math.random() < 0.5;
    // θ = fn⁻¹(قيمة) ثم نطلب دالة أخرى
    const argP = fn === 'tan' ? (neg ? -b : b) : neg ? -b : b;
    const argQ = fn === 'tan' ? a : r;
    const th = fn === 'sin' ? Math.asin(argP / argQ) : fn === 'cos' ? Math.acos(argP / argQ) : Math.atan(argP / argQ);
    const want = pick((['sin', 'cos', 'tan'] as const).filter((g) => g !== fn));
    const val = want === 'sin' ? Math.sin(th) : want === 'cos' ? Math.cos(th) : Math.tan(th);
    const x = Math.round(Math.cos(th) * r), y = Math.round(Math.sin(th) * r);
    const [p, q] = want === 'sin' ? [y, r] : want === 'cos' ? [x, r] : [y, x];
    return {
      kind: 'values', prompt: `أوجد القيمة الدقيقة: $\\${want}\\left(\\${fn}^{-1}\\left(${fr(argP, argQ)}\\right)\\right)$`, answer: [R(val)],
      hint: `ضع θ = ${fn}⁻¹(…)، وارسم مثلثًا في الربع الذي يسمح به مدى ${fn}⁻¹.`,
      solution: [`$\\theta = \\${fn}^{-1}\\left(${fr(argP, argQ)}\\right)$ في الربع ${qn[y >= 0 ? (x >= 0 ? 1 : 2) : 4]}، والنقطة $(${x}, ${y})$ و $r = ${r}$.`, `$\\${want}\\theta = ${fr(p, q)}$`],
      placeholder: 'مثال: 4/5',
    };
  },
  () => {
    const items: [string, number, string][] = [
      ['\\sin^{-1}\\left(\\sin\\dfrac{5\\pi}{6}\\right)', PI / 6, 'لأن $\\tfrac{5\\pi}{6}$ خارج $\\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]$: $\\sin\\tfrac{5\\pi}{6} = \\tfrac12$ و $\\sin^{-1}\\tfrac12 = \\tfrac{\\pi}{6}$.'],
      ['\\cos^{-1}\\left(\\cos\\dfrac{7\\pi}{4}\\right)', PI / 4, '$\\cos\\tfrac{7\\pi}{4} = \\tfrac{\\sqrt2}{2}$ و $\\cos^{-1}\\tfrac{\\sqrt2}{2} = \\tfrac{\\pi}{4}$.'],
      ['\\tan^{-1}\\left(\\tan\\dfrac{3\\pi}{4}\\right)', -PI / 4, '$\\tan\\tfrac{3\\pi}{4} = -1$ و $\\tan^{-1}(-1) = -\\tfrac{\\pi}{4}$.'],
      ['\\sin^{-1}\\left(\\sin\\dfrac{\\pi}{5}\\right)', PI / 5, '$\\tfrac{\\pi}{5}$ داخل المدى $\\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]$، فالدالتان تلغيان بعضهما.'],
      ['\\cos^{-1}\\left(\\cos\\left(-\\dfrac{\\pi}{3}\\right)\\right)', PI / 3, '$\\cos\\left(-\\tfrac{\\pi}{3}\\right) = \\tfrac12$ و $\\cos^{-1}\\tfrac12 = \\tfrac{\\pi}{3}$.'],
    ];
    const [e, v, why] = pick(items);
    return {
      kind: 'values', prompt: `أوجد القيمة الدقيقة: $${e}$`, answer: [R(v)],
      hint: 'الدالة العكسية تعطي دائمًا زاوية من مداها، فلا تلغي الدالة الأصلية دائمًا.',
      solution: [why],
      placeholder: 'مثال: pi/6',
    };
  },
  () => {
    const fn = pick(['sin', 'cos', 'tan'] as const);
    const x = fn === 'tan' ? r2(rnd(-500, 500) / 100, 2) : r2(rnd(-95, 95) / 100, 2);
    const v = fn === 'sin' ? Math.asin(x) : fn === 'cos' ? Math.acos(x) : Math.atan(x);
    const deg = pick([true, false]);
    const ans = deg ? (v * 180) / PI : v;
    return {
      kind: 'values', tol: deg ? 0.0051 : 0.00051, prompt: `استخدم الآلة الحاسبة لإيجاد $\\${fn}^{-1}(${x})$ ${deg ? 'بالدرجات (منزلتان)' : 'بالراديان (ثلاث منازل)'}.`, answer: [R(r2(ans, deg ? 2 : 3))],
      hint: `اضبط الآلة على ${deg ? 'DEG' : 'RAD'} واستخدم زر ${fn}⁻¹.`,
      solution: [`$\\${fn}^{-1}(${x}) \\approx ${r2(ans, deg ? 2 : 3)}${deg ? '^\\circ' : ''}$`],
    };
  },
  () => {
    const right = 'غير معرّفة';
    const e = pick(['\\sin^{-1} 2', '\\cos^{-1}(-1.5)', '\\sin^{-1}\\left(-\\dfrac{\\pi}{2}\\right)']);
    return choice(`ما قيمة $${e}$؟`, right, ['$\\dfrac{\\pi}{2}$', '$0$', '$-\\dfrac{\\pi}{2}$'],
      'مجال sin⁻¹ و cos⁻¹ هو [−1, 1].',
      ['المدخل خارج $[-1, 1]$، ولا توجد زاوية جيبها (أو جيب تمامها) بهذه القيمة.']);
  },
];

// ================= 7.6 =================
const s76: Gen[] = [
  () => {
    const items: [string, [number, number][], string][] = [
      ['2\\sin x + 1 = 0', [[7, 6], [11, 6]], '\\sin x = -\\tfrac12'],
      ['2\\cos x - \\sqrt3 = 0', [[1, 6], [11, 6]], '\\cos x = \\tfrac{\\sqrt3}{2}'],
      ['\\tan x + 1 = 0', [[3, 4], [7, 4]], '\\tan x = -1'],
      ['\\sqrt2\\sin x - 1 = 0', [[1, 4], [3, 4]], '\\sin x = \\tfrac{\\sqrt2}{2}'],
      ['2\\cos x + 1 = 0', [[2, 3], [4, 3]], '\\cos x = -\\tfrac12'],
      ['\\sqrt3\\tan x - 1 = 0', [[1, 6], [7, 6]], '\\tan x = \\tfrac{\\sqrt3}{3}'],
      ['\\csc x - 2 = 0', [[1, 6], [5, 6]], '\\sin x = \\tfrac12'],
    ];
    const [eq, ks, iso] = pick(items);
    const S = solSet(ks);
    return {
      kind: 'values', prompt: `حل في الفترة $[0, 2\\pi)$: $${eq}$ (افصل الحلول بفاصلة)`, answer: S.vals.map(R),
      hint: 'اعزل الدالة المثلثية، ثم أوجد القوس المرجعي والربعين المناسبين.',
      solution: [`$${iso}$`, `$x = ${S.tex}$`],
      placeholder: 'مثال: pi/6, 5pi/6',
    };
  },
  () => {
    const items: [string, [number, number][], string[]][] = [
      ['2\\sin^2 x - \\sin x - 1 = 0', [[1, 2], [7, 6], [11, 6]], ['$(2\\sin x + 1)(\\sin x - 1) = 0$', '$\\sin x = -\\tfrac12$ أو $\\sin x = 1$']],
      ['2\\cos^2 x + \\cos x - 1 = 0', [[1, 3], [5, 3], [1, 1]], ['$(2\\cos x - 1)(\\cos x + 1) = 0$', '$\\cos x = \\tfrac12$ أو $\\cos x = -1$']],
      ['\\tan^2 x - 3 = 0', [[1, 3], [2, 3], [4, 3], [5, 3]], ['$\\tan x = \\pm\\sqrt3$', 'القوس المرجعي $\\tfrac{\\pi}{3}$ في الأرباع الأربعة']],
      ['\\sin x\\cos x - \\cos x = 0', [[1, 2], [3, 2]], ['$\\cos x(\\sin x - 1) = 0$', '$\\cos x = 0$ أو $\\sin x = 1$ (ويعطي $\\tfrac{\\pi}{2}$ المكرر)']],
      ['2\\sin x\\cos x + \\cos x = 0', [[1, 2], [3, 2], [7, 6], [11, 6]], ['$\\cos x(2\\sin x + 1) = 0$', '$\\cos x = 0$ أو $\\sin x = -\\tfrac12$']],
      ['4\\cos^2 x - 3 = 0', [[1, 6], [5, 6], [7, 6], [11, 6]], ['$\\cos^2 x = \\tfrac34$', '$\\cos x = \\pm\\tfrac{\\sqrt3}{2}$']],
      ['\\sin^2 x - \\sin x = 0', [[0, 1], [1, 1], [1, 2]], ['$\\sin x(\\sin x - 1) = 0$', '$\\sin x = 0$ أو $\\sin x = 1$']],
    ];
    const [eq, ks, steps] = pick(items);
    const S = solSet(ks);
    return {
      kind: 'values', prompt: `حل في الفترة $[0, 2\\pi)$: $${eq}$ (افصل الحلول بفاصلة)`, answer: S.vals.map(R),
      hint: 'حلّل كمعادلة تربيعية في الدالة المثلثية، أو أخرج العامل المشترك. لا تقسم على دالة قد تساوي صفرًا.',
      solution: [...steps, `$x = ${S.tex}$`],
      placeholder: 'مثال: 0, pi/2, pi',
    };
  },
  () => {
    const items: [string, [number, number][], string][] = [
      ['\\sin 2x = \\dfrac{\\sqrt3}{2}', [[1, 6], [1, 3], [7, 6], [4, 3]], '$2x \\in [0, 4\\pi)$: $2x = \\tfrac{\\pi}{3}, \\tfrac{2\\pi}{3}, \\tfrac{7\\pi}{3}, \\tfrac{8\\pi}{3}$'],
      ['\\cos 2x = \\dfrac12', [[1, 6], [5, 6], [7, 6], [11, 6]], '$2x \\in [0, 4\\pi)$: $2x = \\tfrac{\\pi}{3}, \\tfrac{5\\pi}{3}, \\tfrac{7\\pi}{3}, \\tfrac{11\\pi}{3}$'],
      ['\\tan 3x = 1', [[1, 12], [5, 12], [3, 4], [13, 12], [17, 12], [7, 4]], '$3x \\in [0, 6\\pi)$: $3x = \\tfrac{\\pi}{4} + k\\pi$, $k = 0, \\dots, 5$'],
      ['\\sin 3x = 0', [[0, 1], [1, 3], [2, 3], [1, 1], [4, 3], [5, 3]], '$3x \\in [0, 6\\pi)$: $3x = k\\pi$'],
      ['2\\sin\\dfrac{x}{2} = 1', [[1, 3], [5, 3]], '$\\tfrac{x}{2} \\in [0, \\pi)$: $\\tfrac{x}{2} = \\tfrac{\\pi}{6}, \\tfrac{5\\pi}{6}$'],
      ['\\cos\\dfrac{x}{2} = \\dfrac{\\sqrt2}{2}', [[1, 2]], '$\\tfrac{x}{2} \\in [0, \\pi)$: $\\tfrac{x}{2} = \\tfrac{\\pi}{4}$ فقط'],
    ];
    const [eq, ks, step] = pick(items);
    const S = solSet(ks);
    return {
      kind: 'values', prompt: `حل في الفترة $[0, 2\\pi)$: $${eq}$ (افصل الحلول بفاصلة)`, answer: S.vals.map(R),
      hint: 'غيّر الفترة لتناسب الزاوية المضاعفة أو النصفية، ثم اقسم أو اضرب في النهاية.',
      solution: [step, `$x = ${S.tex}$`],
      placeholder: 'مثال: pi/6, pi/3',
    };
  },
  () => {
    const items: [string, [number, number][], string[]][] = [
      ['\\cos 2x = \\cos x', [[0, 1], [2, 3], [4, 3]], ['$2\\cos^2 x - 1 = \\cos x$ ← $(2\\cos x + 1)(\\cos x - 1) = 0$', '$\\cos x = -\\tfrac12$ أو $\\cos x = 1$']],
      ['\\sin 2x = \\sin x', [[0, 1], [1, 3], [1, 1], [5, 3]], ['$2\\sin x\\cos x - \\sin x = 0$ ← $\\sin x(2\\cos x - 1) = 0$', '$\\sin x = 0$ أو $\\cos x = \\tfrac12$']],
      ['\\cos 2x + \\sin x = 0', [[1, 2], [7, 6], [11, 6]], ['$1 - 2\\sin^2 x + \\sin x = 0$ ← $(2\\sin x + 1)(\\sin x - 1) = 0$', '$\\sin x = -\\tfrac12$ أو $\\sin x = 1$']],
      ['2\\sin^2 x = 3\\cos x', [[1, 3], [5, 3]], ['$2(1 - \\cos^2 x) = 3\\cos x$ ← $(2\\cos x - 1)(\\cos x + 2) = 0$', '$\\cos x = \\tfrac12$ (و $\\cos x = -2$ مرفوضة)']],
    ];
    const [eq, ks, steps] = pick(items);
    const S = solSet(ks);
    return {
      kind: 'values', prompt: `حل في الفترة $[0, 2\\pi)$ باستخدام متطابقة مناسبة: $${eq}$ (افصل بفاصلة)`, answer: S.vals.map(R),
      hint: 'حوّل المعادلة لتحوي دالة واحدة بزاوية واحدة (ضعف الزاوية أو فيثاغورس)، ثم حلّل.',
      solution: [...steps, `$x = ${S.tex}$`],
      placeholder: 'مثال: 0, 2pi/3, 4pi/3',
    };
  },
  () => {
    const fn = pick(['sin', 'cos'] as const);
    const v = r2(rnd(10, 90) / 100 * pick([1, -1]), 2);
    const a = fn === 'sin' ? Math.asin(v) / D : Math.acos(v) / D;
    const sols = fn === 'sin' ? [a < 0 ? 360 + a : a, 180 - a] : [a, 360 - a];
    return {
      kind: 'values', tol: 0.051, prompt: `حل في الفترة $[0^\\circ, 360^\\circ)$ مقرّبًا إلى أقرب عُشر درجة: $\\${fn}\\theta = ${v}$ (افصل بفاصلة)`, answer: sols.map((s) => R(r2(s, 1))),
      hint: `الآلة تعطي حلًا واحدًا لـ ${fn}⁻¹؛ الحل الثاني من التماثل.`,
      solution: [`$\\${fn}^{-1}(${v}) \\approx ${r2(a, 1)}^\\circ$`, fn === 'sin' ? `الحل الآخر $180^\\circ - (${r2(a, 1)}^\\circ)$${a < 0 ? '، ونضيف 360° للسالب' : ''}` : `الحل الآخر $360^\\circ - ${r2(a, 1)}^\\circ$`, `$\\theta \\approx ${sols.map((s) => r2(s, 1) + '^\\circ').join(',\\ ')}$`],
      placeholder: 'مثال: 23.6, 156.4',
    };
  },
];

// ================= 7.7 =================
const s77: Gen[] = [
  () => {
    const a = rnd(6, 10), b = rnd(2, 5);
    const fn = pick(['sin', 'cos'] as const);
    return {
      kind: 'expr', prompt: `حل المعادلة $y = ${a}\\${fn} ${b}x$ لـ $x$ (بافتراض $0 \\le ${b}x \\le ${fn === 'sin' ? '\\tfrac{\\pi}{2}' : '\\pi'}$). اكتب $x$ بدلالة $y$.`,
      answer: `arc${fn}(y/${a})/${b}`, vars: ['y'],
      hint: `اقسم على ${a}، ثم طبّق ${fn}⁻¹، ثم اقسم على ${b}.`,
      solution: [`$\\dfrac{y}{${a}} = \\${fn} ${b}x$`, `$${b}x = \\${fn}^{-1}\\dfrac{y}{${a}}$`, `$x = \\dfrac{1}{${b}}\\${fn}^{-1}\\dfrac{y}{${a}}$`],
      placeholder: `مثال: arc${fn}(y/${a})/${b}`,
    };
  },
  () => {
    const items: [string, number, string[]][] = [
      ['\\sin^{-1} x = \\dfrac{\\pi}{3}', Math.sqrt(3) / 2, ['$x = \\sin\\tfrac{\\pi}{3}$', '$x = \\tfrac{\\sqrt3}{2}$']],
      ['\\cos^{-1} x = \\dfrac{3\\pi}{4}', -Math.SQRT2 / 2, ['$x = \\cos\\tfrac{3\\pi}{4}$', '$x = -\\tfrac{\\sqrt2}{2}$']],
      ['2\\cos^{-1} x = \\pi', 0, ['$\\cos^{-1} x = \\tfrac{\\pi}{2}$', '$x = \\cos\\tfrac{\\pi}{2} = 0$']],
      ['3\\tan^{-1} x = \\pi', Math.sqrt(3), ['$\\tan^{-1} x = \\tfrac{\\pi}{3}$', '$x = \\tan\\tfrac{\\pi}{3} = \\sqrt3$']],
      ['4\\sin^{-1} x = -\\pi', -Math.SQRT2 / 2, ['$\\sin^{-1} x = -\\tfrac{\\pi}{4}$', '$x = \\sin\\left(-\\tfrac{\\pi}{4}\\right) = -\\tfrac{\\sqrt2}{2}$']],
      ['\\tan^{-1}(2x - 1) = \\dfrac{\\pi}{4}', 1, ['$2x - 1 = \\tan\\tfrac{\\pi}{4} = 1$', '$x = 1$']],
    ];
    const [eq, v, steps] = pick(items);
    return {
      kind: 'values', prompt: `حل: $${eq}$`, answer: [R(v)],
      hint: 'اعزل الدالة العكسية، ثم طبّق الدالة الأصلية على الطرفين (تحقق أن الزاوية في مدى المعكوس).',
      solution: steps,
      placeholder: 'مثال: sqrt(3)/2',
    };
  },
  () => {
    const [a, b] = pick(TRI);
    const r = Math.hypot(a, b);
    const items: [string, number, string[]][] = [
      [`\\sin^{-1} x = \\cos^{-1}${fr(a, r)}`, b / r, [`$\\theta = \\cos^{-1}${fr(a, r)}$ في الربع الأول، والنقطة $(${a}, ${b})$`, `$x = \\sin\\theta = ${fr(b, r)}$`]],
      [`\\tan^{-1} x = \\sin^{-1}${fr(b, r)}`, b / a, [`$\\theta = \\sin^{-1}${fr(b, r)}$ في الربع الأول، والنقطة $(${a}, ${b})$`, `$x = \\tan\\theta = ${fr(b, a)}$`]],
      [`\\cos^{-1} x = \\tan^{-1}${fr(b, a)}`, a / r, [`$\\theta = \\tan^{-1}${fr(b, a)}$، والنقطة $(${a}, ${b})$ و $r = ${r}$`, `$x = \\cos\\theta = ${fr(a, r)}$`]],
    ];
    const [eq, v, steps] = pick(items);
    return {
      kind: 'values', prompt: `حل: $${eq}$`, answer: [R(v)],
      hint: 'ضع الطرف الأيمن θ، وارسم مثلثه القائم، ثم أوجد الدالة المطلوبة لـ θ.',
      solution: steps,
      placeholder: 'مثال: 4/5',
    };
  },
  () => {
    const right = 'لا يوجد حل';
    const e = pick(['\\sin^{-1} x = 2', '\\cos^{-1} x = -\\dfrac{\\pi}{4}', '\\tan^{-1} x = \\dfrac{\\pi}{2}']);
    return choice(`ما حل المعادلة $${e}$؟`, right, ['$x = \\sin 2$', '$x = 0$', '$x = 1$'],
      'قارن الطرف الأيمن بمدى الدالة العكسية.',
      ['الطرف الأيمن خارج مدى الدالة العكسية: $\\sin^{-1}$ في $\\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]$ ($2 > \\tfrac{\\pi}{2} \\approx 1.57$)، و $\\cos^{-1}$ في $[0, \\pi]$، و $\\tan^{-1}$ في $\\left(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right)$ مفتوحة.', 'فلا توجد قيمة لـ $x$.']);
  },
  () => {
    const a = rnd(2, 6), b = rnd(2, 4), c = rnd(1, 3);
    const yv = r2(rnd(1, 9) / 10 * a, 1) + c;
    const x = Math.acos((yv - c) / a) / b;
    return {
      kind: 'values', tol: 0.00051, prompt: `في النموذج $y = ${c} + ${a}\\cos ${b}x$ (مع $0 \\le ${b}x \\le \\pi$)، أوجد $x$ عندما $y = ${r2(yv, 2)}$ (ثلاث منازل).`, answer: [R(r2(x, 3))],
      hint: 'اطرح الثابت واقسم على السعة، ثم طبّق cos⁻¹ واقسم على المعامل.',
      solution: [`$\\cos ${b}x = \\dfrac{${r2(yv, 2)} - ${c}}{${a}}$`, `$x = \\dfrac{1}{${b}}\\cos^{-1}\\left(${r2((yv - c) / a, 4)}\\right)$`, `$\\approx ${r2(x, 3)}$`],
      placeholder: 'مثال: 0.412',
    };
  },
];

export const ch7: Record<string, Gen[]> = { '7.1': s71, '7.2': s72, '7.3': s73, '7.4': s74, '7.5': s75, '7.6': s76, '7.7': s77 };
