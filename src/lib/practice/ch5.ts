// مولّدات تمارين الفصل 5: الدوال المثلثية
import { rnd, nz, pick, gcd, R, frac, choice, type Problem } from '../gen';

type Gen = () => Problem;
const D = Math.PI / 180;
const r2 = (v: number, d = 2) => +v.toFixed(d);
const T2 = 0.0051, T4 = 0.000051;
const deg = (v: number | string) => `${v}^\\circ`;
/** الزاوية كمدخل لدالة: أقواس للسالبة */
const arg = (v: number) => (v < 0 ? `(${v}^\\circ)` : ` ${v}^\\circ`);
const quadName = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع'];
const norm = (t: number) => ((t % 360) + 360) % 360;
const refOf = (t: number) => { const m = norm(t); return m <= 90 ? m : m <= 180 ? 180 - m : m <= 270 ? m - 180 : 360 - m; };

type Fn = 'sin' | 'cos' | 'tan' | 'csc' | 'sec' | 'cot';
const F: Record<Fn, (x: number) => number> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  csc: (x) => 1 / Math.sin(x), sec: (x) => 1 / Math.cos(x), cot: (x) => Math.cos(x) / Math.sin(x),
};
/** القيم الدقيقة للزوايا الخاصة 30 و 45 و 60 */
const EX: Record<Fn, Record<number, string>> = {
  sin: { 30: '\\tfrac{1}{2}', 45: '\\tfrac{\\sqrt{2}}{2}', 60: '\\tfrac{\\sqrt{3}}{2}' },
  cos: { 30: '\\tfrac{\\sqrt{3}}{2}', 45: '\\tfrac{\\sqrt{2}}{2}', 60: '\\tfrac{1}{2}' },
  tan: { 30: '\\tfrac{\\sqrt{3}}{3}', 45: '1', 60: '\\sqrt{3}' },
  csc: { 30: '2', 45: '\\sqrt{2}', 60: '\\tfrac{2\\sqrt{3}}{3}' },
  sec: { 30: '\\tfrac{2\\sqrt{3}}{3}', 45: '\\sqrt{2}', 60: '2' },
  cot: { 30: '\\sqrt{3}', 45: '1', 60: '\\tfrac{\\sqrt{3}}{3}' },
};
const clean = (v: number) => (Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) : v);
/** جذر مبسط: [k, m] حيث √n = k√m */
function simp(n: number): [number, number] { let k = 1, m = n; for (let p = 2; p * p <= m; p++) while (m % (p * p) === 0) { m /= p * p; k *= p; } return [k, m]; }
const rT = (n: number) => { const [k, m] = simp(n); return m === 1 ? String(k) : `${k === 1 ? '' : k}\\sqrt{${m}}`; };

// ================= 5.1 =================
const s51: Gen[] = [
  () => {
    const kind = pick(['comp', 'supp'] as const);
    const t = kind === 'comp' ? rnd(5, 85) : rnd(5, 175);
    return {
      kind: 'values', prompt: `أوجد ${kind === 'comp' ? 'المتممة' : 'المكملة'} للزاوية $${deg(t)}$ (بالدرجات).`, answer: [R((kind === 'comp' ? 90 : 180) - t)],
      hint: kind === 'comp' ? 'الزاويتان المتتامتان مجموعهما 90°.' : 'الزاويتان المتكاملتان مجموعهما 180°.',
      solution: [`$${kind === 'comp' ? 90 : 180}^\\circ - ${t}^\\circ = ${(kind === 'comp' ? 90 : 180) - t}^\\circ$`],
    };
  },
  () => {
    const kind = pick(['comp', 'supp'] as const);
    const a = rnd(2, 5), b = rnd(-20, 20), c = rnd(1, 4), x = rnd(5, 15);
    const tot = kind === 'comp' ? 90 : 180;
    const d = tot - (a * x + b) - c * x;
    if (a * x + b <= 0 || c * x + d <= 0) return s51[1]();
    const e1 = `${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)}`, e2 = `${c === 1 ? '' : c}x ${d < 0 ? '-' : '+'} ${Math.abs(d)}`;
    return {
      kind: 'values', prompt: `الزاويتان $(${e1})^\\circ$ و $(${e2})^\\circ$ ${kind === 'comp' ? 'متتامتان' : 'متكاملتان'}. أوجد قياس كل منهما (اكتب الأولى ثم الثانية).`,
      answer: [R(a * x + b), R(c * x + d)], ordered: true,
      hint: `مجموعهما ${tot}°. كوّن معادلة وحلها لـ x.`,
      solution: [`$${e1} + ${e2} = ${tot}$ ← $${a + c}x ${b + d < 0 ? '-' : '+'} ${Math.abs(b + d)} = ${tot}$ ← $x = ${x}$`, `الزاويتان $${deg(a * x + b)}$ و $${deg(c * x + d)}$.`],
      placeholder: 'مثال: 35, 55',
    };
  },
  () => {
    const d = rnd(10, 300), m = rnd(1, 59), s = rnd(0, 59);
    const v = d + m / 60 + s / 3600;
    return {
      kind: 'values', tol: 0.0051, prompt: `حوّل $${d}^\\circ ${m}' ${s}''$ إلى درجات عشرية مقرّبة إلى منزلتين.`, answer: [R(r2(v))],
      hint: "1′ = (1/60)°، و 1″ = (1/3600)°.",
      solution: [`$${d} + \\dfrac{${m}}{60} + \\dfrac{${s}}{3600}$`, `$\\approx ${r2(v)}^\\circ$`],
      placeholder: 'مثال: 74.27',
    };
  },
  () => {
    const d = rnd(10, 300), m = rnd(0, 59), s = rnd(0, 59);
    const v = (d * 3600 + m * 60 + s) / 3600;
    const shown = +v.toFixed(4);
    // نعيد حساب الدقائق والثواني من القيمة المعروضة
    const tot = Math.round(shown * 3600);
    const D2 = Math.floor(tot / 3600), M2 = Math.floor((tot % 3600) / 60), S2 = tot % 60;
    return {
      kind: 'values', ordered: true, prompt: `حوّل $${shown}^\\circ$ إلى درجات ودقائق وثوانٍ (قرّب الثواني لأقرب عدد صحيح). اكتب: الدرجات، الدقائق، الثواني.`,
      answer: [R(D2), R(M2), R(S2)],
      hint: 'اضرب الجزء العشري في 60 لتحصل على الدقائق، ثم الجزء العشري للدقائق في 60 لتحصل على الثواني.',
      solution: [`$${r2(shown - D2, 4)} \\times 60 = ${r2((shown - D2) * 60, 4)}'$`, `$${r2((shown - D2) * 60 - M2, 4)} \\times 60 \\approx ${S2}''$`, `$${D2}^\\circ ${M2}' ${S2}''$`],
      placeholder: 'مثال: 74, 15, 30',
    };
  },
  () => {
    const t = nz(-900, 1100);
    if (t >= 0 && t < 360) return s51[4]();
    const m = norm(t);
    return {
      kind: 'values', prompt: `أوجد الزاوية المكافئة (المشتركة في الضلع النهائي) للزاوية $${deg(t)}$ الواقعة في $[0^\\circ, 360^\\circ)$.`, answer: [R(m)],
      hint: 'أضف أو اطرح مضاعفات 360° حتى تقع الزاوية بين 0° و 360°.',
      solution: [`$${t}^\\circ ${t < 0 ? '+' : '-'} ${Math.abs((m - t) / 360)}(360^\\circ) = ${m}^\\circ$`],
    };
  },
  () => {
    let t = 0;
    while (norm(t) % 90 === 0) t = rnd(-700, 900);
    const q = Math.floor(norm(t) / 90) + 1;
    return choice(`في أي ربع يقع الضلع النهائي للزاوية $${deg(t)}$ في الوضع القياسي؟`, `الربع ${quadName[q]}`,
      [1, 2, 3, 4].filter((k) => k !== q).map((k) => `الربع ${quadName[k]}`),
      'أوجد الزاوية المكافئة بين 0° و 360° أولًا.',
      [`الزاوية المكافئة $${norm(t)}^\\circ$`, `وهي بين $${(q - 1) * 90}^\\circ$ و $${q * 90}^\\circ$، فالضلع في الربع ${quadName[q]}.`]);
  },
  () => {
    const rpm = pick([30, 45, 60, 90, 120, 150, 300]), s = pick([1, 2, 3, 5, 10]);
    const v = (rpm / 60) * 360 * s;
    return {
      kind: 'values', prompt: `بكرة تدور ${rpm} دورة في الدقيقة. كم درجة تدور نقطة على حافتها في ${({ 1: 'ثانية واحدة', 2: 'ثانيتين' } as Record<number, string>)[s] ?? `${s} ثوانٍ`}؟`, answer: [R(v)],
      hint: 'الدورة 360°، والدقيقة 60 ثانية.',
      solution: [`في الثانية: $\\dfrac{${rpm}}{60}$ دورة $= ${r2((rpm / 60) * 360, 2)}^\\circ$`, `في ${s} ${s > 2 ? 'ثوانٍ' : s === 2 ? 'ثانيتين' : 'ثانية'}: $${r2((rpm / 60) * 360, 2)} \\times ${s} = ${v}^\\circ$`],
    };
  },
];

// ================= 5.2 =================
const TRIPLES: [number, number][] = [[3, 4], [4, 3], [5, 12], [12, 5], [8, 15], [15, 8], [7, 24], [24, 7], [1, 1], [1, 2], [2, 1], [1, 3], [2, 3], [3, 1]];
const s52: Gen[] = [
  () => {
    const [a, b] = pick(TRIPLES);
    const x = a * pick([-1, 1]), y = b * pick([-1, 1]);
    const n = x * x + y * y;
    const fn = pick(['sin', 'cos', 'tan', 'csc', 'sec', 'cot'] as const);
    const val = { sin: y / Math.sqrt(n), cos: x / Math.sqrt(n), tan: y / x, csc: Math.sqrt(n) / y, sec: Math.sqrt(n) / x, cot: x / y }[fn];
    const def = { sin: '\\dfrac{y}{r}', cos: '\\dfrac{x}{r}', tan: '\\dfrac{y}{x}', csc: '\\dfrac{r}{y}', sec: '\\dfrac{r}{x}', cot: '\\dfrac{x}{y}' }[fn];
    const num = { sin: String(y), cos: String(x), tan: String(y), csc: rT(n), sec: rT(n), cot: String(x) }[fn];
    const den = { sin: rT(n), cos: rT(n), tan: String(x), csc: String(y), sec: String(x), cot: String(y) }[fn];
    return {
      kind: 'values', prompt: `الضلع النهائي للزاوية $\\theta$ يمر بالنقطة $(${x}, ${y})$. أوجد القيمة الدقيقة لـ $\\${fn}\\theta$.`, answer: [R(val)],
      hint: 'r = √(x² + y²)، ثم استخدم تعريف الدالة.',
      solution: [`$r = \\sqrt{${x * x} + ${y * y}} = ${rT(n)}$`, `$\\${fn}\\theta = ${def} = \\dfrac{${num}}{${den}}$`, `$\\approx ${r2(val, 4)}$ (اكتبها بصيغة دقيقة مثل 2sqrt(5)/5)`],
      placeholder: 'مثال: -3/5 أو 2sqrt(5)/5',
    };
  },
  () => {
    const t = pick([0, 90, 180, 270, 360, -90, 450, -180]);
    const fn = pick(['sin', 'cos', 'tan', 'sec', 'csc', 'cot'] as const);
    const v = F[fn](t * D);
    const und = !Number.isFinite(v) || Math.abs(v) > 1e10;
    const right = und ? 'غير معرّف' : `$${clean(v)}$`;
    const all = ['$0$', '$1$', '$-1$', 'غير معرّف'];
    const m = norm(t);
    const [px, py] = m === 0 ? [1, 0] : m === 90 ? [0, 1] : m === 180 ? [-1, 0] : [0, -1];
    return choice(`ما قيمة $\\${fn}${arg(t)}$؟`, right, all.filter((w) => w !== right),
      'زاوية ربعية: خذ النقطة على المحور التي بعدها 1 عن الأصل.',
      [`الضلع النهائي يمر بـ $(${px}, ${py})$ و $r = 1$.`, `${right === 'غير معرّف' ? 'المقام صفر، فالقيمة غير معرّفة.' : `$\\${fn}${arg(t)} = ${clean(v)}$`}`]);
  },
  () => {
    const fn = pick(['sin', 'cos', 'tan'] as const);
    let p = 1, q = 1;
    while (gcd(p, q) !== 1 || p === q) { p = rnd(1, 7); q = fn === 'tan' ? rnd(1, 12) : rnd(p + 1, 12); }
    const rec = { sin: 'csc', cos: 'sec', tan: 'cot' }[fn];
    const s = pick([1, -1]);
    return {
      kind: 'values', prompt: `إذا كان $\\${fn}\\theta = ${s < 0 ? '-' : ''}${frac(p, q)}$، فأوجد $\\${rec}\\theta$.`, answer: [R((s * q) / p)],
      hint: `${rec} هي مقلوب ${fn}.`,
      solution: [`$\\${rec}\\theta = \\dfrac{1}{\\${fn}\\theta} = ${s < 0 ? '-' : ''}${frac(q, p)}$`],
    };
  },
  () => {
    const q = rnd(1, 4);
    const [s1, s2] = [[1, 1], [1, -1], [-1, 1], [-1, -1]][q - 1]; // إشارة sin و cos
    const opts: [string, string][] = [
      [`\\sin\\theta ${s1 > 0 ? '>' : '<'} 0`, `\\cos\\theta ${s2 > 0 ? '>' : '<'} 0`],
      [`\\sin\\theta ${s1 > 0 ? '>' : '<'} 0`, `\\tan\\theta ${s1 * s2 > 0 ? '>' : '<'} 0`],
      [`\\cos\\theta ${s2 > 0 ? '>' : '<'} 0`, `\\cot\\theta ${s1 * s2 > 0 ? '>' : '<'} 0`],
      [`\\sec\\theta ${s2 > 0 ? '>' : '<'} 0`, `\\csc\\theta ${s1 > 0 ? '>' : '<'} 0`],
    ];
    const [c1, c2] = pick(opts);
    return choice(`إذا كان $${c1}$ و $${c2}$، ففي أي ربع يقع الضلع النهائي لـ $\\theta$؟`, `الربع ${quadName[q]}`,
      [1, 2, 3, 4].filter((k) => k !== q).map((k) => `الربع ${quadName[k]}`),
      'تذكّر: الأول كل الدوال موجبة، الثاني الجيب، الثالث الظل، الرابع جيب التمام (ومقلوب كل منها).',
      [`الجيب موجب في الربعين الأول والثاني، وجيب التمام موجب في الأول والرابع، والظل موجب في الأول والثالث.`, `الشرطان معًا يتحققان في الربع ${quadName[q]}.`]);
  },
  () => {
    const [a, b] = pick([[3, 4], [4, 3], [5, 12], [12, 5], [8, 15], [15, 8], [1, 1], [1, 2], [2, 1], [1, 3], [2, 3]] as const);
    const n = a * a + b * b;
    const q = pick([2, 3, 4]);
    const sx = q === 2 || q === 3 ? -1 : 1, sy = q === 2 ? 1 : -1;
    const given = pick(['sin', 'cos'] as const);
    const want = given === 'sin' ? 'cos' : 'sin';
    const gv = given === 'sin' ? sy * b : sx * a, wv = given === 'sin' ? sx * a : sy * b;
    const isRoot = simp(n)[1] !== 1;
    const gT = isRoot ? `${gv < 0 ? '-' : ''}\\dfrac{${Math.abs(gv)}}{${rT(n)}}` : `${gv < 0 ? '-' : ''}\\dfrac{${Math.abs(gv)}}{${Math.sqrt(n)}}`;
    return {
      kind: 'values', prompt: `إذا كان $\\${given}\\theta = ${gT}$ و $\\theta$ في الربع ${quadName[q]}، فأوجد $\\${want}\\theta$ بالقيمة الدقيقة.`, answer: [R(wv / Math.sqrt(n))],
      hint: 'استخدم sin²θ + cos²θ = 1، ثم اختر الإشارة حسب الربع.',
      solution: [`$\\${want}^2\\theta = 1 - \\left(${gT}\\right)^2 = 1 - \\dfrac{${gv * gv}}{${n}} = \\dfrac{${wv * wv}}{${n}}$`, `في الربع ${quadName[q]} يكون $\\${want}\\theta ${wv > 0 ? '> 0' : '< 0'}$.`, `$\\${want}\\theta = ${wv < 0 ? '-' : ''}\\dfrac{${Math.abs(wv)}}{${rT(n)}} \\approx ${r2(wv / Math.sqrt(n), 4)}$`],
      placeholder: 'مثال: -4/5 أو -2sqrt(13)/13',
    };
  },
  () => {
    const items: [string, boolean][] = [
      ['\\sin\\theta = 1.5', false], ['\\cos\\theta = -1.2', false], ['\\tan\\theta = 25', true], ['\\sec\\theta = 0.4', false], ['\\csc\\theta = -3', true], ['\\cot\\theta = -0.01', true], ['\\sin\\theta = -0.99', true], ['\\sec\\theta = -1', true], ['\\csc\\theta = 0.5', false],
    ];
    const [e, ok] = pick(items);
    return choice(`هل يمكن أن يكون $${e}$ لزاوية ما؟`, ok ? 'نعم، ممكن' : 'لا، مستحيل',
      [ok ? 'لا، مستحيل' : 'نعم، ممكن', 'ممكن فقط في الربع الأول'],
      'مدى sin و cos هو [−1, 1]، ومدى sec و csc هو (−∞, −1] ∪ [1, ∞)، والظل وظل التمام أي عدد.',
      [`${ok ? 'القيمة داخل مدى الدالة.' : 'القيمة خارج مدى الدالة.'}`, '$-1 \\le \\sin\\theta, \\cos\\theta \\le 1$، و $|\\sec\\theta|, |\\csc\\theta| \\ge 1$، والظل وظل التمام بلا قيود.']);
  },
];

// ================= 5.3 =================
const s53: Gen[] = [
  () => {
    const [a0, b0] = pick([[3, 4], [5, 12], [8, 15], [7, 24], [20, 21], [9, 40]] as const);
    const k = rnd(1, 3), a = a0 * k, b = b0 * k, c = Math.hypot(a, b);
    const fn = pick(['sin', 'cos', 'tan', 'csc', 'sec', 'cot'] as const);
    const val = { sin: a / c, cos: b / c, tan: a / b, csc: c / a, sec: c / b, cot: b / a }[fn];
    const nm = { sin: 'المقابل / الوتر', cos: 'المجاور / الوتر', tan: 'المقابل / المجاور', csc: 'الوتر / المقابل', sec: 'الوتر / المجاور', cot: 'المجاور / المقابل' }[fn];
    return {
      kind: 'values', prompt: `في المثلث ABC القائم في C: الضلع المقابل للزاوية A طوله ${a}، والمجاور لها ${b}. أوجد $\\${fn} A$.`, answer: [R(val)],
      hint: 'احسب الوتر بفيثاغورس، ثم طبّق التعريف.',
      solution: [`$c = \\sqrt{${a}^2 + ${b}^2} = ${c}$`, `$\\${fn} A = $ ${nm}`, `$= ${fn === 'sin' || fn === 'csc' ? (fn === 'sin' ? frac(a, c) : frac(c, a)) : fn === 'cos' || fn === 'sec' ? (fn === 'cos' ? frac(b, c) : frac(c, b)) : fn === 'tan' ? frac(a, b) : frac(b, a)}$`],
    };
  },
  () => {
    const [f1, f2] = pick([['sin', 'cos'], ['cos', 'sin'], ['tan', 'cot'], ['sec', 'csc'], ['cot', 'tan']] as const);
    const a = rnd(1, 4), b = rnd(-10, 20), c = rnd(1, 4), x = rnd(4, 14);
    const d = 90 - (a * x + b) - c * x;
    if (a * x + b <= 0 || c * x + d <= 0) return s53[1]();
    const e1 = `${a === 1 ? '' : a}\\theta ${b < 0 ? '-' : '+'} ${Math.abs(b)}^\\circ`, e2 = `${c === 1 ? '' : c}\\theta ${d < 0 ? '-' : '+'} ${Math.abs(d)}^\\circ`;
    return {
      kind: 'values', prompt: `أوجد $\\theta$ (بالدرجات) بحيث $\\${f1}(${e1}) = \\${f2}(${e2})$، بافتراض أن الزاويتين حادتان.`, answer: [R(x)],
      hint: 'الدالة وتمامها متساويتان عندما تكون الزاويتان متتامتين (مجموعهما 90°).',
      solution: [`$(${e1}) + (${e2}) = 90^\\circ$`, `$${a + c}\\theta ${b + d < 0 ? '-' : '+'} ${Math.abs(b + d)} = 90$`, `$\\theta = ${x}^\\circ$`],
    };
  },
  () => {
    const ref = pick([30, 45, 60]);
    const q = rnd(1, 4);
    const t = [0, ref, 180 - ref, 180 + ref, 360 - ref][q] + pick([0, 0, 360, -360]);
    const fn = pick(['sin', 'cos', 'tan', 'csc', 'sec', 'cot'] as const);
    const v = clean(F[fn](t * D));
    const neg = v < 0;
    return {
      kind: 'values', prompt: `أوجد القيمة الدقيقة لـ $\\${fn}${arg(t)}$.`, answer: [R(v)],
      hint: 'أوجد الزاوية المرجعية، ثم القيمة للزاوية الخاصة، ثم الإشارة حسب الربع.',
      solution: [`الزاوية المكافئة $${norm(t)}^\\circ$ في الربع ${quadName[q]}، والزاوية المرجعية $${ref}^\\circ$.`, `$\\${fn} ${ref}^\\circ = ${EX[fn][ref]}$، والإشارة في هذا الربع ${neg ? 'سالبة' : 'موجبة'}.`, `$\\${fn}${arg(t)} = ${neg ? '-' : ''}${EX[fn][ref]}$`],
      placeholder: 'مثال: -sqrt(3)/2',
    };
  },
  () => {
    let t = 0;
    while (norm(t) % 90 === 0) t = rnd(-400, 700);
    const ref = refOf(t);
    return {
      kind: 'values', prompt: `أوجد الزاوية المرجعية للزاوية $${deg(t)}$.`, answer: [R(ref)],
      hint: 'أوجد الزاوية المكافئة بين 0° و 360°، ثم الزاوية الحادة بين ضلعها النهائي ومحور x.',
      solution: [`الزاوية المكافئة $${norm(t)}^\\circ$ في الربع ${quadName[Math.floor(norm(t) / 90) + 1]}.`, `الزاوية المرجعية $${ref}^\\circ$.`],
    };
  },
  () => {
    const fn = pick(['sin', 'cos', 'tan', 'sec', 'csc', 'cot'] as const);
    const t = r2(rnd(1, 3590) / 10 + 0.0, 1);
    const v = F[fn](t * D);
    if (!Number.isFinite(v) || Math.abs(v) > 50) return s53[4]();
    const help = fn === 'sec' ? '1/cos' : fn === 'csc' ? '1/sin' : fn === 'cot' ? '1/tan' : '';
    return {
      kind: 'values', tol: T4, prompt: `استخدم الآلة الحاسبة (بوضع الدرجات DEG) لإيجاد $\\${fn}${arg(t)}$ مقرّبًا إلى أربع منازل عشرية.`, answer: [R(r2(v, 4))],
      hint: help ? `لا يوجد زر ${fn}؛ استخدم ${help}.` : 'تأكد أن الآلة على وضع الدرجات DEG لا الراديان RAD.',
      solution: [help ? `$\\${fn}${arg(t)} = \\dfrac{1}{\\${help.slice(2)} ${deg(t)}}$` : `$\\${fn}${arg(t)}$`, `$\\approx ${r2(v, 4)}$`],
      placeholder: 'مثال: 0.7071',
    };
  },
  () => {
    const fn = pick(['sin', 'cos', 'tan'] as const);
    const target = fn === 'tan' ? r2(rnd(10, 400) / 100, 2) : r2(rnd(5, 98) / 100, 2);
    const ang = fn === 'sin' ? Math.asin(target) / D : fn === 'cos' ? Math.acos(target) / D : Math.atan(target) / D;
    return {
      kind: 'values', tol: 0.0051, prompt: `أوجد الزاوية الحادة $\\theta$ (بالدرجات، مقرّبة إلى منزلتين) التي تحقق $\\${fn}\\theta = ${target}$.`, answer: [R(r2(ang))],
      hint: `استخدم الدالة العكسية في الآلة: ${fn}⁻¹.`,
      solution: [`$\\theta = \\${fn}^{-1}(${target})$`, `$\\approx ${r2(ang)}^\\circ$`],
      placeholder: 'مثال: 41.81',
    };
  },
  () => {
    const fn = pick(['sin', 'cos', 'tan'] as const);
    const ref = pick([30, 45, 60]);
    const sgn = pick([1, -1]);
    const val = sgn * F[fn](ref * D);
    const sols = [ref, 180 - ref, 180 + ref, 360 - ref].filter((t) => Math.abs(F[fn](t * D) - val) < 1e-9);
    return {
      kind: 'values', prompt: `أوجد كل قيم $\\theta$ في الفترة $[0^\\circ, 360^\\circ)$ التي تحقق $\\${fn}\\theta = ${sgn < 0 ? '-' : ''}${EX[fn][ref]}$. (افصل بفاصلة)`, answer: sols.map(R),
      hint: `الزاوية المرجعية ${ref}°. في أي ربعين تكون ${fn} ${sgn > 0 ? 'موجبة' : 'سالبة'}؟`,
      solution: [`الزاوية المرجعية $${ref}^\\circ$ لأن $\\${fn} ${ref}^\\circ = ${EX[fn][ref]}$.`, `${fn} ${sgn > 0 ? 'موجبة' : 'سالبة'} في ربعين، فالحلان:`, `$\\theta = ${sols.map((s) => deg(s)).join(',\\ ')}$`],
      placeholder: 'مثال: 30, 150',
    };
  },
];

// ================= 5.4 =================
const s54: Gen[] = [
  () => {
    const A = r2(rnd(150, 750) / 10, 1), c = rnd(10, 90);
    const which = pick(['a', 'b'] as const);
    const v = which === 'a' ? c * Math.sin(A * D) : c * Math.cos(A * D);
    return {
      kind: 'values', tol: T2, prompt: `في المثلث ABC القائم في C: $A = ${deg(A)}$ والوتر $c = ${c}$. أوجد ${which === 'a' ? 'الضلع a (المقابل لـ A)' : 'الضلع b (المجاور لـ A)'} مقرّبًا إلى منزلتين.`, answer: [R(r2(v))],
      hint: which === 'a' ? 'sin A = a/c.' : 'cos A = b/c.',
      solution: [`$${which === 'a' ? '\\sin' : '\\cos'} ${A}^\\circ = \\dfrac{${which}}{${c}}$`, `$${which} = ${c}${which === 'a' ? '\\sin' : '\\cos'} ${A}^\\circ$`, `$\\approx ${r2(v)}$`],
      placeholder: 'مثال: 23.45',
    };
  },
  () => {
    const a = rnd(5, 40), b = rnd(5, 40);
    const A = Math.atan(a / b) / D;
    return {
      kind: 'values', tol: T2, prompt: `في المثلث ABC القائم في C: $a = ${a}$ و $b = ${b}$. أوجد الزاوية $A$ بالدرجات مقرّبة إلى منزلتين.`, answer: [R(r2(A))],
      hint: 'tan A = a / b، ثم الدالة العكسية.',
      solution: [`$\\tan A = \\dfrac{${a}}{${b}}$`, `$A = \\tan^{-1}\\left(\\dfrac{${a}}{${b}}\\right)$`, `$\\approx ${r2(A)}^\\circ$، و $B = 90^\\circ - A \\approx ${r2(90 - A)}^\\circ$.`],
      placeholder: 'مثال: 36.87',
    };
  },
  () => {
    const d = rnd(20, 150), a = r2(rnd(100, 650) / 10, 1);
    const h = d * Math.tan(a * D);
    return {
      kind: 'values', tol: T2, prompt: `من نقطة على الأرض تبعد ${d} م عن قاعدة مبنى، زاوية ارتفاع قمته $${deg(a)}$. ما ارتفاع المبنى (مقرّبًا إلى منزلتين)؟`, answer: [R(r2(h))],
      hint: 'الارتفاع مقابل للزاوية، والمسافة مجاورة لها: استخدم الظل.',
      solution: [`$\\tan ${a}^\\circ = \\dfrac{h}{${d}}$`, `$h = ${d}\\tan ${a}^\\circ$`, `$\\approx ${r2(h)}$ م`],
      placeholder: 'مثال: 57.34',
    };
  },
  () => {
    const h = rnd(30, 300), a = r2(rnd(50, 450) / 10, 1);
    const d = h / Math.tan(a * D);
    return {
      kind: 'values', tol: T2, prompt: `من قمة منارة ارتفاعها ${h} م فوق سطح البحر، زاوية انخفاض قارب $${deg(a)}$. كم يبعد القارب أفقيًا عن قاعدة المنارة (مقرّبًا إلى منزلتين)؟`, answer: [R(r2(d))],
      hint: 'زاوية الانخفاض تساوي زاوية الارتفاع من القارب إلى قمة المنارة.',
      solution: [`$\\tan ${a}^\\circ = \\dfrac{${h}}{d}$`, `$d = \\dfrac{${h}}{\\tan ${a}^\\circ}$`, `$\\approx ${r2(d)}$ م`],
      placeholder: 'مثال: 412.5',
    };
  },
  () => {
    const L = rnd(5, 15), h = r2(L * rnd(55, 95) / 100, 1);
    const ang = Math.asin(h / L) / D;
    return {
      kind: 'values', tol: T2, prompt: `سُلّم طوله ${L} م يستند إلى جدار، وأعلاه على ارتفاع ${h} م. ما الزاوية بين السلّم والأرض (بالدرجات، منزلتان)؟`, answer: [R(r2(ang))],
      hint: 'الارتفاع مقابل للزاوية، والسلّم هو الوتر.',
      solution: [`$\\sin\\theta = \\dfrac{${h}}{${L}}$`, `$\\theta = \\sin^{-1}\\left(\\dfrac{${h}}{${L}}\\right)$`, `$\\approx ${r2(ang)}^\\circ$`],
      placeholder: 'مثال: 64.16',
    };
  },
  () => {
    const b1 = rnd(10, 70), s1 = rnd(10, 30), s2 = rnd(10, 30), t = rnd(2, 4);
    const d1 = s1 * t, d2 = s2 * t;
    const sep = Math.hypot(d1, d2);
    return {
      kind: 'values', tol: T2, prompt: `غادرت سفينتان ميناءً في الوقت نفسه. الأولى باتجاه $${deg(b1)}$ بسرعة ${s1} كم/س، والثانية باتجاه $${deg(b1 + 90)}$ بسرعة ${s2} كم/س (الاتجاهات تُقاس مع عقارب الساعة من الشمال). كم المسافة بينهما بعد ${t} ساعات؟ (منزلتان)`, answer: [R(r2(sep))],
      hint: 'الاتجاهان يختلفان بـ 90°، فمساراهما ضلعا مثلث قائم.',
      solution: [`المسافتان $${d1}$ كم و $${d2}$ كم، والزاوية بينهما $${deg(90)}$.`, `$d = \\sqrt{${d1}^2 + ${d2}^2}$`, `$\\approx ${r2(sep)}$ كم`],
      placeholder: 'مثال: 85.44',
    };
  },
  () => {
    const items: [string, number][] = [['0.0450', 3], ['208', 3], ['7.080', 4], ['0.003', 1], ['45.10', 4], ['1300.', 4], ['6.02', 3], ['0.100', 3]];
    const [n, k] = pick(items);
    return choice(`كم رقمًا معنويًا في العدد $${n}$؟`, String(k), [1, 2, 3, 4, 5].filter((x) => x !== k).map(String).slice(0, 3),
      'الأصفار في البداية ليست معنوية؛ والأصفار بين أرقام غير صفرية معنوية؛ والأصفار في النهاية بعد الفاصلة العشرية معنوية.',
      [`العدد $${n}$ فيه ${k === 1 ? 'رقم معنوي واحد' : `${k} أرقام معنوية`}.`]);
  },
];

export const ch5: Record<string, Gen[]> = { '5.1': s51, '5.2': s52, '5.3': s53, '5.4': s54 };
