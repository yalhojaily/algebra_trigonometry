// مولّدات تمارين الفصل 6: الدوال الدائرية ورسومها
import { rnd, nz, pick, gcd, R, frac, choice, type Problem } from '../gen';

type Gen = () => Problem;
const PI = Math.PI;
const r2 = (v: number, d = 2) => +v.toFixed(d);
const T2 = 0.0051, T3 = 0.00051;

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
/** العدد kπ/den */
const piV = (k: number, den: number) => (k * PI) / den;
/** b ككسر TeX لعامل الدورة */
const numT = (v: number) => (Number.isInteger(v) ? String(v) : v === 0.5 ? '\\tfrac12' : String(v));
const coef = (a: number) => (a === 1 ? '' : a === -1 ? '-' : String(a));

type F6 = 'sin' | 'cos' | 'tan' | 'csc' | 'sec' | 'cot';
const FV: Record<F6, (x: number) => number> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan, csc: (x) => 1 / Math.sin(x), sec: (x) => 1 / Math.cos(x), cot: (x) => Math.cos(x) / Math.sin(x),
};
const EX: Record<F6, Record<number, string>> = {
  sin: { 6: '\\tfrac{1}{2}', 4: '\\tfrac{\\sqrt{2}}{2}', 3: '\\tfrac{\\sqrt{3}}{2}' },
  cos: { 6: '\\tfrac{\\sqrt{3}}{2}', 4: '\\tfrac{\\sqrt{2}}{2}', 3: '\\tfrac{1}{2}' },
  tan: { 6: '\\tfrac{\\sqrt{3}}{3}', 4: '1', 3: '\\sqrt{3}' },
  csc: { 6: '2', 4: '\\sqrt{2}', 3: '\\tfrac{2\\sqrt{3}}{3}' },
  sec: { 6: '\\tfrac{2\\sqrt{3}}{3}', 4: '\\sqrt{2}', 3: '2' },
  cot: { 6: '\\sqrt{3}', 4: '1', 3: '\\tfrac{\\sqrt{3}}{3}' },
};
const clean = (v: number) => (Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) : v);

/** زاوية خاصة بمرجع π/den في ربع q، مع إمكان إضافة دورة */
function special(): { k: number; den: number; ref: number; q: number } {
  const ref = pick([6, 4, 3]); // المرجع π/ref
  const q = rnd(1, 4);
  // نكتب الزاوية kπ/ref
  const k = [0, 1, ref - 1, ref + 1, 2 * ref - 1][q] + pick([0, 0, 0, 2 * ref, -2 * ref]);
  return { k, den: ref, ref, q };
}

// ================= 6.1 =================
const s61: Gen[] = [
  () => {
    const deg = pick([30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360, -45, -150, 480, 20, 75]);
    const g = gcd(deg, 180);
    return {
      kind: 'values', prompt: `حوّل $${deg}^\\circ$ إلى الراديان بالقيمة الدقيقة (بدلالة $\\pi$).`, answer: [R(piV(deg, 180))],
      hint: 'اضرب في π/180°.',
      solution: [`$${deg}^\\circ \\cdot \\dfrac{\\pi}{180^\\circ} = \\dfrac{${deg}\\pi}{180}$`, `$= ${piT(deg / g, 180 / g)}$`],
      placeholder: 'مثال: 5pi/6',
    };
  },
  () => {
    const den = pick([2, 3, 4, 5, 6, 9, 10, 12, 15, 18]);
    let k = nz(-20, 20);
    while (gcd(k, den) !== 1) k = nz(-20, 20);
    const deg = (k * 180) / den;
    return {
      kind: 'values', prompt: `حوّل $${piT(k, den)}$ راديان إلى الدرجات.`, answer: [R(deg)],
      hint: 'اضرب في 180°/π، فيختصر π.',
      solution: [`$${piT(k, den)} \\cdot \\dfrac{180^\\circ}{\\pi} = \\dfrac{${k} \\cdot 180^\\circ}{${den}}$`, `$= ${r2(deg, 4)}^\\circ$`],
    };
  },
  () => {
    const x = r2(rnd(5, 600) / 100, 2);
    const deg = (x * 180) / PI;
    return {
      kind: 'values', tol: T2, prompt: `حوّل $${x}$ راديان إلى الدرجات مقرّبًا إلى منزلتين.`, answer: [R(r2(deg))],
      hint: '1 راديان ≈ 57.3°.',
      solution: [`$${x} \\cdot \\dfrac{180^\\circ}{\\pi}$`, `$\\approx ${r2(deg)}^\\circ$`],
      placeholder: 'مثال: 143.24',
    };
  },
  () => {
    const r = rnd(2, 30), deg = pick([30, 40, 45, 60, 72, 90, 120, 135, 150, 210, 300]);
    const s = r * piV(deg, 180);
    return {
      kind: 'values', tol: T2, prompt: `دائرة نصف قطرها ${r} سم. أوجد طول القوس المقابل لزاوية مركزية قياسها $${deg}^\\circ$ (منزلتان، أو بالقيمة الدقيقة).`, answer: [R(s)],
      hint: 's = rθ، والزاوية يجب أن تكون بالراديان.',
      solution: [`$\\theta = ${deg}^\\circ = ${piT(deg / gcd(deg, 180), 180 / gcd(deg, 180))}$`, `$s = ${r} \\cdot ${piT(deg / gcd(deg, 180), 180 / gcd(deg, 180))} = ${piT((r * deg) / gcd(r * deg, 180), 180 / gcd(r * deg, 180))}$`, `$\\approx ${r2(s)}$ سم`],
      placeholder: 'مثال: 6pi أو 18.85',
    };
  },
  () => {
    const r = rnd(2, 20), th = pick([[1, 6], [1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [5, 6], [1, 1]] as const);
    const A = 0.5 * r * r * piV(th[0], th[1]);
    return {
      kind: 'values', tol: T2, prompt: `أوجد مساحة القطاع الدائري في دائرة نصف قطرها ${r} م وزاويته المركزية $${piT(th[0], th[1])}$ راديان (منزلتان أو قيمة دقيقة).`, answer: [R(A)],
      hint: 'A = ½ r² θ بالراديان.',
      solution: [`$A = \\tfrac12 (${r})^2 \\cdot ${piT(th[0], th[1])}$`, `$= ${piT(r * r * th[0], 2 * th[1])}$`, `$\\approx ${r2(A)}$ م²`],
      placeholder: 'مثال: 12pi',
    };
  },
  () => {
    const r = rnd(3, 25), s = r2(r * rnd(20, 500) / 100, 1);
    const th = s / r;
    return {
      kind: 'values', tol: 0.0051, prompt: `قوس طوله ${s} سم في دائرة نصف قطرها ${r} سم. ما قياس الزاوية المركزية بالراديان (منزلتان)؟`, answer: [R(r2(th))],
      hint: 'θ = s / r.',
      solution: [`$\\theta = \\dfrac{${s}}{${r}}$`, `$\\approx ${r2(th)}$ راديان`],
    };
  },
];

// ================= 6.2 =================
const s62: Gen[] = [
  () => {
    const { k, den, ref, q } = special();
    const fn = pick(['sin', 'cos', 'tan', 'csc', 'sec', 'cot'] as const);
    const v = clean(FV[fn](piV(k, den)));
    const qn = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع'][q];
    return {
      kind: 'values', prompt: `أوجد القيمة الدقيقة: $\\${fn}\\left(${piT(k, den)}\\right)$`, answer: [R(v)],
      hint: 'حدد الربع والقوس المرجعي، ثم استخدم قيم π/6 و π/4 و π/3.',
      solution: [`النقطة على دائرة الوحدة في الربع ${qn}، والقوس المرجعي $${piT(1, ref)}$.`, `$\\${fn}\\left(${piT(1, ref)}\\right) = ${EX[fn][ref]}$، والإشارة ${v < 0 ? 'سالبة' : 'موجبة'}.`, `$\\${fn}\\left(${piT(k, den)}\\right) = ${v < 0 ? '-' : ''}${EX[fn][ref]}$`],
      placeholder: 'مثال: -sqrt(3)/2',
    };
  },
  () => {
    const fn = pick(['sin', 'cos', 'tan'] as const);
    const ref = pick([6, 4, 3]);
    const sg = pick([1, -1]);
    const target = sg * FV[fn](PI / ref);
    const cands = [1, ref - 1, ref + 1, 2 * ref - 1].map((k) => piV(k, ref)).filter((s) => Math.abs(FV[fn](s) - target) < 1e-9);
    const ks = [1, ref - 1, ref + 1, 2 * ref - 1].filter((k) => Math.abs(FV[fn](piV(k, ref)) - target) < 1e-9);
    return {
      kind: 'values', prompt: `أوجد كل قيم $s$ في الفترة $[0, 2\\pi)$ التي تحقق $\\${fn} s = ${sg < 0 ? '-' : ''}${EX[fn][ref]}$. (افصل بفاصلة)`, answer: cands.map(R),
      hint: `القوس المرجعي π/${ref}. في أي ربعين تكون ${fn} ${sg > 0 ? 'موجبة' : 'سالبة'}؟`,
      solution: [`القوس المرجعي $${piT(1, ref)}$.`, `$s = ${ks.map((k) => piT(k, ref)).join(',\\ ')}$`],
      placeholder: 'مثال: pi/6, 5pi/6',
    };
  },
  () => {
    const x = r2(rnd(-60, 60) / 10, 1);
    const fn = pick(['sin', 'cos', 'tan', 'sec'] as const);
    const v = FV[fn](x);
    if (Math.abs(v) > 40) return s62[2]();
    return {
      kind: 'values', tol: 0.00006, prompt: `استخدم الآلة الحاسبة (بوضع الراديان RAD) لإيجاد $\\${fn}(${x})$ مقرّبًا إلى أربع منازل.`, answer: [R(r2(v, 4))],
      hint: fn === 'sec' ? 'sec = 1/cos، والآلة على RAD.' : 'تأكد أن الآلة على وضع الراديان.',
      solution: [`$\\${fn}(${x}) \\approx ${r2(v, 4)}$`],
      placeholder: 'مثال: -0.4161',
    };
  },
  () => {
    const fn = pick(['sin', 'cos'] as const);
    const val = r2(rnd(5, 95) / 100 * pick([1, -1]), 2);
    // نطلب الحل في الربع المحدد
    const base = fn === 'sin' ? Math.asin(val) : Math.acos(val);
    let s = 0, interval = '';
    if (fn === 'sin') {
      if (val > 0) { s = PI - base; interval = '\\left[\\tfrac{\\pi}{2}, \\pi\\right]'; } else { s = PI - base; interval = '\\left[\\pi, \\tfrac{3\\pi}{2}\\right]'; }
    } else {
      if (val > 0) { s = 2 * PI - base; interval = '\\left[\\tfrac{3\\pi}{2}, 2\\pi\\right]'; } else { s = 2 * PI - base; interval = '\\left[\\pi, \\tfrac{3\\pi}{2}\\right]'; }
    }
    return {
      kind: 'values', tol: 0.00051, prompt: `أوجد قيمة $s$ في الفترة $${interval}$ التي تحقق $\\${fn} s = ${val}$ (ثلاث منازل).`, answer: [R(r2(s, 3))],
      hint: `الآلة تعطي ${fn}⁻¹ في ربع واحد فقط؛ استخدم التماثل لتنتقل إلى الفترة المطلوبة.`,
      solution: [`$\\${fn}^{-1}(${val}) \\approx ${r2(base, 4)}$`, fn === 'sin' ? `الجيب يتماثل حول $\\tfrac{\\pi}{2}$: $s = \\pi ${base < 0 ? '+' : '-'} ${Math.abs(r2(base, 4))}$` : `جيب التمام يتماثل حول محور $x$: $s = 2\\pi - ${r2(base, 4)}$`, `$s \\approx ${r2(s, 3)}$`],
      placeholder: 'مثال: 2.214',
    };
  },
  () => {
    const r = rnd(5, 60), rpm = pick([10, 20, 30, 45, 60, 100, 120]);
    const w = (rpm * 2 * PI) / 60;
    const v = r * w;
    return {
      kind: 'values', tol: T2, prompt: `عجلة نصف قطرها ${r} سم تدور ${rpm} دورة في الدقيقة. أوجد السرعة الخطية لنقطة على حافتها بالسم/ث (منزلتان).`, answer: [R(r2(v))],
      hint: 'ω بالراديان في الثانية (الدورة = 2π)، ثم v = rω.',
      solution: [`$\\omega = \\dfrac{${rpm} \\cdot 2\\pi}{60} = ${piT(rpm * 2, 60)}$ راديان/ث`, `$v = r\\omega = ${r} \\cdot ${piT(rpm * 2, 60)}$`, `$\\approx ${r2(v)}$ سم/ث`],
      placeholder: 'مثال: 125.66',
    };
  },
  () => {
    const [k, den] = pick([[2, 3], [3, 4], [5, 6], [7, 4], [3, 2], [5, 3], [4, 1], [6, 1]] as const);
    const t = rnd(2, 12);
    return {
      kind: 'values', prompt: `نقطة على عجلة تدور بزاوية $${piT(k, den)}$ راديان كل ${t} ثوانٍ. ما سرعتها الزاوية $\\omega$ بالراديان في الثانية (قيمة دقيقة)؟`, answer: [R(piV(k, den) / t)],
      hint: 'ω = θ / t.',
      solution: [`$\\omega = \\dfrac{${piT(k, den)}}{${t}} = ${piT(k, den * t)}$ راديان/ث`],
      placeholder: 'مثال: pi/12',
    };
  },
];

// ================= 6.3 =================
const s63: Gen[] = [
  () => {
    const a = nz(-5, 5), b = pick([0.5, 1, 2, 3, 4, 6]);
    const fn = pick(['sin', 'cos'] as const);
    return {
      kind: 'values', ordered: true, prompt: `أوجد السعة والدورة للدالة $y = ${coef(a)}\\${fn}${b === 1 ? ' x' : `\\left(${numT(b)}x\\right)`}$. اكتب: السعة، الدورة.`, answer: [R(Math.abs(a)), R((2 * PI) / b)],
      hint: 'السعة |a|، والدورة 2π/b.',
      solution: [`السعة $|${a}| = ${Math.abs(a)}$`, `الدورة $\\dfrac{2\\pi}{${numT(b)}} = ${b === 0.5 ? '4\\pi' : piT(2, b)}$`],
      placeholder: 'مثال: 3, pi',
    };
  },
  () => {
    const A = rnd(1, 5), P = pick([[1, 1], [2, 1], [1, 2], [4, 1], [2, 3], [1, 3]] as const);
    const b = 2 / (P[0] / P[1]);
    const fn = pick(['sin', 'cos'] as const);
    const bT = Number.isInteger(b) ? String(b) : `\\tfrac{${2 * P[1]}}{${P[0]}}`;
    const right = `$y = ${A === 1 ? '' : A}\\${fn}\\left(${b === 1 ? '' : bT}x\\right)$`;
    return choice(`أي معادلة على صورة $y = a\\${fn}(bx)$ (مع $a > 0$) سعتها ${A} ودورتها $${piT(P[0], P[1])}$؟`, right,
      [`$y = ${A === 1 ? '' : A}\\${fn}\\left(${piT(P[0], P[1])}x\\right)$`, `$y = ${A === 1 ? '' : A}\\${fn}\\left(${b === 1 ? '2' : Number.isInteger(1 / b) ? 1 / b : `\\tfrac{${P[0]}}{${2 * P[1]}}`}x\\right)$`, `$y = ${2 * A}\\${fn}\\left(${b === 1 ? '' : bT}x\\right)$`],
      'الدورة 2π/b، فإن b = 2π ÷ الدورة.',
      [`$b = \\dfrac{2\\pi}{${piT(P[0], P[1])}} = ${bT}$`, `المعادلة ${right}`]);
  },
  () => {
    const a = nz(-4, 4), b = pick([1, 2, 3, 0.5]), fn = pick(['sin', 'cos'] as const);
    const right = `$[${-Math.abs(a)}, ${Math.abs(a)}]$`;
    return choice(`ما مدى الدالة $y = ${coef(a)}\\${fn}${b === 1 ? ' x' : `\\left(${numT(b)}x\\right)`}$؟`, right,
      [`$[${-Math.abs(a) * 2}, ${Math.abs(a) * 2}]$`, '$[-1, 1]$', `$[0, ${Math.abs(a)}]$`, `$(-\\infty, \\infty)$`].filter((w) => w !== right),
      'المعامل b يغيّر الدورة فقط، والسعة تحدد المدى.',
      [`السعة ${Math.abs(a)}، فالمدى ${right} (ولا تؤثر إشارة a في المدى).`]);
  },
  () => {
    const [n, d] = pick([[1, 1], [1, 2], [2, 3], [4, 1], [3, 1], [1, 3], [3, 2]] as const);
    return {
      kind: 'values', prompt: `منحنى $y = \\sin(bx)$ مع $b > 0$ دورته $${piT(n, d)}$. أوجد $b$.`, answer: [R((2 * d) / n)],
      hint: 'الدورة = 2π / b.',
      solution: [`$\\dfrac{2\\pi}{b} = ${piT(n, d)}$`, `$b = \\dfrac{2\\pi}{${piT(n, d)}} = ${frac(2 * d, n)}$`],
    };
  },
  () => {
    const a = nz(-4, 4), b = pick([1, 2, 3, 4]);
    const fn = pick(['sin', 'cos'] as const);
    // أول قيمة عظمى موجبة
    let x = 0;
    if (fn === 'sin') x = a > 0 ? PI / (2 * b) : (3 * PI) / (2 * b);
    else x = a > 0 ? (2 * PI) / b : PI / b;
    const kk = fn === 'sin' ? (a > 0 ? [1, 2 * b] : [3, 2 * b]) : a > 0 ? [2, b] : [1, b];
    return {
      kind: 'values', prompt: `أوجد أصغر قيمة موجبة لـ $x$ تبلغ عندها $y = ${coef(a)}\\${fn}${b === 1 ? ' x' : `(${b}x)`}$ قيمتها العظمى.`, answer: [R(x)],
      hint: `القيمة العظمى ${Math.abs(a)} تحدث حين يكون ${fn}(${b}x) = ${a > 0 ? 1 : -1}.`,
      solution: [`نحتاج $\\${fn}(${b === 1 ? '' : b}x) = ${a > 0 ? 1 : -1}$`, `$${b === 1 ? '' : b}x = ${piT(kk[0] * b, kk[1])}$ (أول قيمة موجبة)`, `$x = ${piT(kk[0], kk[1])}$`],
      placeholder: 'مثال: pi/4',
    };
  },
];

// ================= 6.4 =================
const s64: Gen[] = [
  () => {
    const b = pick([1, 2, 3, 4]), dk = nz(-6, 6), den = pick([2, 3, 4, 6]);
    // y = a sin(bx − c) مع c = b·d
    const fn = pick(['sin', 'cos'] as const);
    const cK = b * dk; // c = cK·π/den
    const inner = `${b === 1 ? '' : b}x ${cK > 0 ? '-' : '+'} ${piT(Math.abs(cK), den)}`;
    return {
      kind: 'values', ordered: true, prompt: `أوجد الدورة والإزاحة الطورية للدالة $y = 2\\${fn}\\left(${inner}\\right)$. اكتب: الدورة، الإزاحة (موجبة لليمين وسالبة لليسار).`,
      answer: [R((2 * PI) / b), R(piV(dk, den))],
      hint: 'أخرج b عاملًا مشتركًا: b(x − d)، فالإزاحة d والدورة 2π/b.',
      solution: [`$${inner} = ${b === 1 ? '' : b}\\left(x ${dk > 0 ? '-' : '+'} ${piT(Math.abs(dk), den)}\\right)$`, `الدورة $\\dfrac{2\\pi}{${b}} = ${piT(2, b)}$`, `الإزاحة الطورية $${piT(dk, den)}$ (${dk > 0 ? 'يمينًا' : 'يسارًا'})`],
      placeholder: 'مثال: pi, -pi/4',
    };
  },
  () => {
    const a = nz(-4, 4), c = nz(-5, 5), fn = pick(['sin', 'cos'] as const), b = pick([1, 2, 3]);
    return {
      kind: 'values', ordered: true, prompt: `أوجد القيمة الصغرى والعظمى للدالة $y = ${c} ${a < 0 ? '-' : '+'} ${Math.abs(a) === 1 ? '' : Math.abs(a)}\\${fn}${b === 1 ? ' x' : `(${b}x)`}$. اكتب: الصغرى، العظمى.`,
      answer: [R(c - Math.abs(a)), R(c + Math.abs(a))],
      hint: 'خط المنتصف y = c، والمنحنى يبتعد عنه بمقدار السعة.',
      solution: [`خط المنتصف $y = ${c}$، والسعة $${Math.abs(a)}$.`, `الصغرى $${c} - ${Math.abs(a)} = ${c - Math.abs(a)}$، والعظمى $${c} + ${Math.abs(a)} = ${c + Math.abs(a)}$.`],
      placeholder: 'مثال: -1, 5',
    };
  },
  () => {
    const a = rnd(1, 4), c = nz(-3, 3), dk = nz(-3, 3);
    const right = `$y = ${c} + ${a === 1 ? '' : a}\\sin\\left(x ${dk > 0 ? '-' : '+'} ${piT(Math.abs(dk), 4)}\\right)$`;
    return choice(`منحنى $y = \\sin x$ مُدّ رأسيًا بمعامل ${a}، ثم أزيح $${piT(Math.abs(dk), 4)}$ إلى ${dk > 0 ? 'اليمين' : 'اليسار'} و ${Math.abs(c)} ${c > 0 ? 'إلى الأعلى' : 'إلى الأسفل'}. ما معادلته؟`, right,
      [`$y = ${c} + ${a === 1 ? '' : a}\\sin\\left(x ${dk > 0 ? '+' : '-'} ${piT(Math.abs(dk), 4)}\\right)$`, `$y = ${-c} + ${a === 1 ? '' : a}\\sin\\left(x ${dk > 0 ? '-' : '+'} ${piT(Math.abs(dk), 4)}\\right)$`, `$y = ${c} + \\sin\\left(${a}x ${dk > 0 ? '-' : '+'} ${piT(Math.abs(dk), 4)}\\right)$`],
      'الإزاحة لليمين بمقدار d تعني x − d، والإزاحة للأعلى تعني + c خارج الدالة.',
      [`لليمين ← $x - d$، ولليسار ← $x + d$.`, `المعادلة ${right}`]);
  },
  () => {
    const b = pick([2, 3, 4]), dk = rnd(1, 3);
    // y = cos(b(x − dπ/4b)) : الإزاحة الطورية
    const c = dk; // bx − cπ/4
    return {
      kind: 'values', prompt: `أوجد الإزاحة الطورية للدالة $y = \\cos\\left(${b}x - ${piT(c, 4)}\\right)$ (موجبة لليمين).`, answer: [R(piV(c, 4 * b))],
      hint: 'حل bx − c = 0 لـ x: هذه بداية الدورة.',
      solution: [`$${b}x - ${piT(c, 4)} = 0$`, `$x = ${piT(c, 4 * b)}$`],
      placeholder: 'مثال: pi/8',
    };
  },
  () => {
    const hi = rnd(25, 40), lo = rnd(5, 20);
    const amp = (hi - lo) / 2, mid = (hi + lo) / 2;
    return {
      kind: 'values', ordered: true, prompt: `تتراوح درجة الحرارة في مدينة خلال السنة بين ${lo}° و ${hi}° تقريبًا وفق نموذج جيبي $f(x) = a\\sin(bx) + c$. أوجد السعة $a > 0$ وخط المنتصف $c$. اكتب: a، c.`,
      answer: [R(amp), R(mid)],
      hint: 'السعة نصف الفرق بين العظمى والصغرى، وخط المنتصف متوسطهما.',
      solution: [`$a = \\dfrac{${hi} - ${lo}}{2} = ${amp}$`, `$c = \\dfrac{${hi} + ${lo}}{2} = ${mid}$`],
      placeholder: 'مثال: 8, 24',
    };
  },
];

// ================= 6.5 =================
const s65: Gen[] = [
  () => {
    const b = pick([0.5, 1, 2, 3, 4, 6]), fn = pick(['tan', 'cot'] as const), a = nz(-3, 3);
    return {
      kind: 'values', prompt: `ما دورة الدالة $y = ${coef(a)}\\${fn}${b === 1 ? ' x' : `\\left(${numT(b)}x\\right)`}$؟`, answer: [R(PI / b)],
      hint: 'دورة الظل وظل التمام π/b (وليست 2π/b).',
      solution: [b === 1 ? 'الدورة $\\pi$' : `الدورة $\\dfrac{\\pi}{${numT(b)}}${b === 0.5 ? ' = 2\\pi' : ''}$`],
      placeholder: 'مثال: pi/2',
    };
  },
  () => {
    const b = pick([1, 2, 3, 4]), fn = pick(['tan', 'cot'] as const);
    const x = fn === 'tan' ? PI / (2 * b) : PI / b;
    return {
      kind: 'values', prompt: `أوجد أصغر خط تقارب رأسي موجب ($x > 0$) لمنحنى $y = \\${fn}${b === 1 ? ' x' : `(${b}x)`}$.`, answer: [R(x)],
      hint: fn === 'tan' ? 'خطوط تقارب الظل حيث cos(bx) = 0.' : 'خطوط تقارب ظل التمام حيث sin(bx) = 0.',
      solution: [fn === 'tan' ? `$${b === 1 ? '' : b}x = \\dfrac{\\pi}{2}$` : `$${b === 1 ? '' : b}x = \\pi$`, `$x = ${fn === 'tan' ? piT(1, 2 * b) : piT(1, b)}$`],
      placeholder: 'مثال: pi/4',
    };
  },
  () => {
    const a = nz(-3, 3), fn = pick(['tan', 'cot'] as const);
    const inc = (fn === 'tan') === (a > 0);
    const right = inc ? 'متزايدة بين كل خطي تقارب متتاليين' : 'متناقصة بين كل خطي تقارب متتاليين';
    return choice(`أي وصف يناسب منحنى $y = ${coef(a)}\\${fn} x$؟`, right,
      [inc ? 'متناقصة بين كل خطي تقارب متتاليين' : 'متزايدة بين كل خطي تقارب متتاليين', `لها سعة تساوي ${Math.abs(a)}`, 'مداها $[-1, 1]$'],
      'tan متزايدة و cot متناقصة، والمعامل السالب يقلب الاتجاه. ولا سعة لهما.',
      [`$\\${fn} x$ ${fn === 'tan' ? 'متزايدة' : 'متناقصة'}${a < 0 ? '، والإشارة السالبة تعكسها' : ''}.`, `إذن ${right}.`]);
  },
  () => {
    const { k, den } = special();
    const fn = pick(['tan', 'cot'] as const);
    const v = clean(FV[fn](piV(k, den)));
    return {
      kind: 'values', prompt: `أوجد القيمة الدقيقة: $\\${fn}\\left(${piT(k, den)}\\right)$`, answer: [R(v)],
      hint: 'tan موجبة في الربعين الأول والثالث، وكذلك cot.',
      solution: [`القوس المرجعي $${piT(1, den)}$ والإشارة ${v < 0 ? 'سالبة' : 'موجبة'}.`, `$\\${fn}\\left(${piT(k, den)}\\right) = ${v < 0 ? '-' : ''}${EX[fn][den]}$`],
      placeholder: 'مثال: -sqrt(3)',
    };
  },
  () => {
    const b = pick([1, 2, 3]), c = nz(-3, 3);
    // y = c + tan(bx): قيمة عند x = π/(4b)
    return {
      kind: 'values', prompt: `للدالة $y = ${c} + \\tan${b === 1 ? ' x' : `(${b}x)`}$، أوجد $y$ عند $x = ${piT(1, 4 * b)}$.`, answer: [R(c + 1)],
      hint: `${b}x = π/4 عند هذه النقطة.`,
      solution: [`$\\tan\\left(${b} \\cdot ${piT(1, 4 * b)}\\right) = \\tan\\dfrac{\\pi}{4} = 1$`, `$y = ${c} + 1 = ${c + 1}$`],
    };
  },
];

// ================= 6.6 =================
const s66: Gen[] = [
  () => {
    const b = pick([0.5, 1, 2, 3, 4]), fn = pick(['sec', 'csc'] as const), a = nz(-3, 3);
    return {
      kind: 'values', prompt: `ما دورة الدالة $y = ${coef(a)}\\${fn}${b === 1 ? ' x' : `\\left(${numT(b)}x\\right)`}$؟`, answer: [R((2 * PI) / b)],
      hint: 'القاطع وقاطع التمام لهما دورة الجيب وجيب التمام: 2π/b.',
      solution: [b === 1 ? 'الدورة $2\\pi$ مثل جيب التمام والجيب' : `الدورة $\\dfrac{2\\pi}{${numT(b)}} = ${b === 0.5 ? '4\\pi' : piT(2, b)}$`],
      placeholder: 'مثال: pi',
    };
  },
  () => {
    const a = rnd(1, 4), c = nz(-3, 3), fn = pick(['sec', 'csc'] as const);
    const right = `$(-\\infty, ${c - a}] \\cup [${c + a}, \\infty)$`;
    return choice(`ما مدى الدالة $y = ${c} + ${a === 1 ? '' : a}\\${fn} x$؟`, right,
      [`$[${c - a}, ${c + a}]$`, `$(-\\infty, ${-a}] \\cup [${a}, \\infty)$`, '$(-\\infty, \\infty)$'],
      'مدى sec x هو |y| ≥ 1. اضرب في a ثم أزح بـ c.',
      [`$${a}\\${fn} x \\le ${-a}$ أو $\\ge ${a}$.`, `بإضافة ${c}: ${right}`]);
  },
  () => {
    const b = pick([1, 2]), fn = pick(['sec', 'csc'] as const);
    const P = (2 * PI) / b;
    const xs: number[] = [];
    for (let k = 0; k < 8; k++) { const x = (fn === 'sec' ? PI / (2 * b) : 0) + (k * PI) / b; if (x >= 0 && x < P - 1e-9) xs.push(x); }
    const ks = xs.map((x) => Math.round((x / PI) * 2 * b));
    return {
      kind: 'values', prompt: `أوجد كل خطوط التقارب الرأسية لمنحنى $y = \\${fn}${b === 1 ? ' x' : `(${b}x)`}$ في الفترة $\\left[0, ${piT(2, b)}\\right)$. (اكتب قيم x مفصولة بفاصلة)`, answer: xs.map(R),
      hint: fn === 'sec' ? 'حيث cos(bx) = 0.' : 'حيث sin(bx) = 0.',
      solution: [fn === 'sec' ? `$\\cos(${b}x) = 0$ ← $${b}x = \\tfrac{\\pi}{2} + k\\pi$` : `$\\sin(${b}x) = 0$ ← $${b}x = k\\pi$`, `$x = ${ks.map((k) => piT(k, 2 * b)).join(',\\ ')}$`],
      placeholder: 'مثال: pi/2, 3pi/2',
    };
  },
  () => {
    const { k, den } = special();
    const fn = pick(['sec', 'csc'] as const);
    const v = clean(FV[fn](piV(k, den)));
    return {
      kind: 'values', prompt: `أوجد القيمة الدقيقة: $\\${fn}\\left(${piT(k, den)}\\right)$`, answer: [R(v)],
      hint: fn === 'sec' ? 'sec = 1/cos.' : 'csc = 1/sin.',
      solution: [`$\\${fn === 'sec' ? 'cos' : 'sin'}\\left(${piT(k, den)}\\right) = ${v < 0 ? '-' : ''}${EX[fn === 'sec' ? 'cos' : 'sin'][den]}$`, `بالمقلوب: $\\${fn}\\left(${piT(k, den)}\\right) = ${v < 0 ? '-' : ''}${EX[fn][den]}$`],
      placeholder: 'مثال: -2sqrt(3)/3',
    };
  },
  () => {
    const opts: [number, number, string, string][] = [[0, 1, '0', '1'], [1, 2, '1', '0'], [1, 1, '0', '-1'], [3, 2, '-1', '0'], [1, 4, '\\tfrac{\\sqrt2}{2}', '\\tfrac{\\sqrt2}{2}'], [1, 6, '\\tfrac12', '\\tfrac{\\sqrt3}{2}'], [1, 3, '\\tfrac{\\sqrt3}{2}', '\\tfrac12']];
    const [n, d, sT, cT] = pick(opts);
    const xv = piV(n, d);
    const y = Math.sin(xv) + Math.cos(xv);
    return {
      kind: 'values', prompt: `بجمع الإحداثيات: أوجد قيمة $y = \\sin x + \\cos x$ عند $x = ${piT(n, d)}$ (قيمة دقيقة).`, answer: [R(y)],
      hint: 'احسب كل دالة على حدة ثم اجمع.',
      solution: [`$\\sin\\left(${piT(n, d)}\\right) = ${sT}$ و $\\cos\\left(${piT(n, d)}\\right) = ${cT}$`, `$y = ${sT} + ${cT.startsWith('-') ? `(${cT})` : cT} ${Number.isInteger(clean(y)) ? '=' : '\\approx'} ${Number.isInteger(clean(y)) ? clean(y) : r2(y, 4)}$`],
      placeholder: 'مثال: sqrt(2)',
    };
  },
];

// ================= 6.7 =================
const s67: Gen[] = [
  () => {
    const a = rnd(2, 10), w = pick([[1, 1], [2, 1], [3, 1], [1, 2], [4, 1], [1, 3]] as const);
    const wv = piV(w[0], w[1]);
    return {
      kind: 'values', ordered: true, prompt: `جسم يهتز وفق $s(t) = ${a}\\cos\\left(${piT(w[0], w[1])}t\\right)$ (t بالثواني). أوجد السعة والدورة والتردد. اكتب: السعة، الدورة، التردد.`,
      answer: [R(a), R((2 * PI) / wv), R(wv / (2 * PI))],
      hint: 'الدورة 2π/ω، والتردد مقلوب الدورة.',
      solution: [`السعة $${a}$`, `$T = \\dfrac{2\\pi}{${piT(w[0], w[1])}} = ${r2((2 * PI) / wv, 4)}$ ث`, `$f = \\dfrac{1}{T} = ${r2(wv / (2 * PI), 4)}$ هرتز`],
      placeholder: 'مثال: 4, 2, 1/2',
    };
  },
  () => {
    const a = rnd(2, 8), f = pick([0.5, 1, 2, 3, 4]);
    return {
      kind: 'expr', prompt: `اكتب معادلة حركة توافقية بسيطة $s(t)$ لجسم سعته ${a} سم وتردده ${f} هرتز، علمًا بأن $s(0) = ${a}$.`,
      answer: `${a}cos(${2 * f}*pi*t)`, vars: ['t'],
      hint: 's(0) = a تعني نموذج جيب التمام s = a cos(ωt)، حيث ω = 2πf.',
      solution: [`$\\omega = 2\\pi f = 2\\pi(${f}) = ${2 * f === 1 ? '' : 2 * f}\\pi$`, `$s(t) = ${a}\\cos(${2 * f === 1 ? '' : 2 * f}\\pi t)$`],
      placeholder: 'مثال: 3cos(4pi*t)',
    };
  },
  () => {
    const a = rnd(2, 10), w = pick([1, 2, 3, 4, 5]), t = r2(rnd(1, 50) / 10, 1);
    const s = a * Math.sin(w * t);
    return {
      kind: 'values', tol: T3, prompt: `موضع جسم $s(t) = ${a}\\sin(${w}t)$ سم. أوجد موضعه عند $t = ${t}$ ث (ثلاث منازل، والآلة على RAD).`, answer: [R(r2(s, 3))],
      hint: 'عوّض مباشرة؛ الزاوية بالراديان.',
      solution: [`$s(${t}) = ${a}\\sin(${r2(w * t, 2)})$`, `$\\approx ${r2(s, 3)}$ سم`],
      placeholder: 'مثال: -2.877',
    };
  },
  () => {
    const a = rnd(3, 12), k = pick([0.1, 0.2, 0.3, 0.5]), t = rnd(2, 10);
    const amp = a * Math.exp(-k * t);
    return {
      kind: 'values', tol: T3, prompt: `حركة مخمدة $s(t) = ${a}e^{-${k}t}\\cos(2\\pi t)$. ما «السعة» (أقصى إزاحة ممكنة) عند $t = ${t}$؟ (ثلاث منازل)`, answer: [R(r2(amp, 3))],
      hint: 'غلاف الحركة a·e^(−kt) هو السعة المتناقصة.',
      solution: [`$${a}e^{-${k}(${t})} = ${a}e^{-${r2(k * t, 2)}}$`, `$\\approx ${r2(amp, 3)}$`],
      placeholder: 'مثال: 1.624',
    };
  },
  () => {
    const right = 'تتناقص سعة الاهتزاز مع الزمن';
    return choice('في الحركة المخمدة $s(t) = a e^{-kt}\\cos(\\omega t)$ مع $k > 0$:', right,
      ['تزداد السعة مع الزمن', 'تتغير الدورة مع الزمن', 'الجسم يتوقف بعد دورة واحدة'],
      'ماذا يحدث للعامل e^(−kt) عندما يكبر t؟',
      ['$e^{-kt} \\to 0$ كلما زاد $t$، فيتقلّص المدى الذي يتحرك فيه الجسم.', 'أما الدورة فتبقى $\\tfrac{2\\pi}{\\omega}$.']);
  },
];

export const ch6: Record<string, Gen[]> = { '6.1': s61, '6.2': s62, '6.3': s63, '6.4': s64, '6.5': s65, '6.6': s66, '6.7': s67 };
