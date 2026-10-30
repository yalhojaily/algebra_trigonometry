// مولّدات تمارين الملاحق: الصيغة القطبية للقطوع، دوران المحاور، قوانين الهندسة
import { rnd, nz, pick, R, frac, choice, gcd, type Problem } from '../gen';

type Gen = () => Problem;
const r1 = (v: number, d = 1) => +v.toFixed(d);
const kindOf = (e: number) => (e < 1 ? 'قطع ناقص' : e === 1 ? 'قطع مكافئ' : 'قطع زائد');
const KINDS = ['قطع ناقص', 'قطع مكافئ', 'قطع زائد', 'دائرة'];

// ================= A.A =================
const sAA: Gen[] = [
  () => {
    // r = k / (m ± n trig θ)
    const m = rnd(2, 6), n = pick([rnd(1, m - 1), m, rnd(m + 1, 2 * m + 2)]), k = m * rnd(1, 4) * pick([1, 2]);
    const trig = pick(['\\cos', '\\sin']), sg = pick(['+', '-']);
    const e = n / m;
    const right = kindOf(e);
    return choice(`ما نوع القطع $r = \\dfrac{${k}}{${m} ${sg} ${n === 1 ? "" : n}${trig}\\theta}$؟`, right, KINDS.filter((x) => x !== right).slice(0, 3),
      'اقسم البسط والمقام على الحد الثابت في المقام لتظهر الصورة ep/(1 ± e cos θ)، ثم قارن e بالعدد 1.',
      [`اقسم على ${m}: $r = \\dfrac{${frac(k, m)}}{1 ${sg} ${frac(n, m)}${trig}\\theta}$`, `$e = ${frac(n, m)}$ ${e < 1 ? '< 1' : e === 1 ? '= 1' : '> 1'} ← ${right}.`]);
  },
  () => {
    const m = rnd(2, 6), n = rnd(1, 2 * m), k = rnd(2, 12);
    const g = gcd(n, m);
    return {
      kind: 'values', prompt: `أوجد الاختلاف المركزي للقطع $r = \\dfrac{${k}}{${m} + ${n}\\cos\\theta}$. (كسر)`, answer: [R(n / m)],
      hint: 'الصورة القياسية ep/(1 + e cos θ): يجب أن يكون الثابت في المقام 1.',
      solution: [`$r = \\dfrac{${frac(k, m)}}{1 + ${frac(n, m)}\\cos\\theta}$`, `$e = ${frac(n / g, m / g)}$`],
      placeholder: 'مثال: 2/3',
    };
  },
  () => {
    // r = ep/(1 − e cos θ): الرأسان عند θ = 0 و θ = π
    const [e, p] = pick([[0.5, 6], [0.5, 4], [0.25, 12], [0.75, 4], [0.5, 2]] as const);
    const which = pick([0, 1]);
    const r = which === 0 ? (e * p) / (1 - e) : (e * p) / (1 + e);
    return {
      kind: 'values', ordered: true, prompt: `للقطع $r = \\dfrac{${e * p}}{1 - ${e}\\cos\\theta}$، أوجد الرأس عند $\\theta = ${which === 0 ? '0' : '\\pi'}$ بالإحداثيات الديكارتية $(x, y)$.`,
      answer: [R(which === 0 ? r1(r, 3) : -r1(r, 3)), R(0)], tol: 0.0051,
      hint: 'عوّض الزاوية لتجد r، ثم x = r cos θ و y = r sin θ.',
      solution: [`$r = \\dfrac{${e * p}}{1 - ${e}\\cos(${which === 0 ? '0' : '\\pi'})} = \\dfrac{${e * p}}{${which === 0 ? 1 - e : 1 + e}} = ${r1(r, 3)}$`, `النقطة $(${which === 0 ? r1(r, 3) : -r1(r, 3)}, 0)$`],
      placeholder: 'مثال: (4, 0)',
    };
  },
  () => {
    const e = pick([1, 2, 3]), p = rnd(1, 5);
    const trig = pick(['cos', 'sin'] as const), sg = pick([1, -1]);
    const dir = trig === 'cos' ? 'x' : 'y';
    return {
      kind: 'values', prompt: `القطع $r = \\dfrac{${e * p}}{1 ${sg > 0 ? '+' : '-'} ${e === 1 ? '' : e}\\${trig}\\theta}$ بؤرته القطب. دليله المستقيم $${dir} = c$. أوجد $c$.`, answer: [R(sg * p)],
      hint: 'ep هو البسط، و e معامل الدالة المثلثية. وإشارة + تعني الدليل في الاتجاه الموجب.',
      solution: [`$e = ${e}$ و $ep = ${e * p}$ ← $p = ${p}$`, `الدليل $${dir} = ${sg * p}$`],
    };
  },
];

// ================= A.B =================
const sAB: Gen[] = [
  () => {
    const A = rnd(-5, 5), C = rnd(-5, 5), B = nz(-8, 8);
    const d = B * B - 4 * A * C;
    const right = d < 0 ? 'قطع ناقص (أو دائرة)' : d === 0 ? 'قطع مكافئ' : 'قطع زائد';
    const parts: string[] = [];
    const add = (c: number, v: string) => { if (c === 0) return; const a = Math.abs(c) === 1 ? v : `${Math.abs(c)}${v}`; parts.push(parts.length === 0 ? (c < 0 ? `-${a}` : a) : `${c < 0 ? '-' : '+'} ${a}`); };
    add(A, 'x^2'); add(B, 'xy'); add(C, 'y^2');
    return choice(`دون دوران المحاور، ما نوع $${parts.join(' ')} = ${rnd(1, 20)}$ (إن لم يكن منحلًا)؟`,
      right, ['قطع ناقص (أو دائرة)', 'قطع مكافئ', 'قطع زائد', 'مستقيم'].filter((x) => x !== right).slice(0, 3),
      'المميز B² − 4AC: سالب ← ناقص، صفر ← مكافئ، موجب ← زائد.',
      [`$B^2 - 4AC = (${B})^2 - 4(${A})(${C}) = ${d}$`, `${d < 0 ? 'سالب' : d === 0 ? 'صفر' : 'موجب'} ← ${right}.`]);
  },
  () => {
    const [A, B, C, deg] = pick([[1, 1, 1, 45], [2, 3, 2, 45], [3, 2 * Math.sqrt(3), 1, 30], [1, 2 * Math.sqrt(3), 3, 60], [52, -72, 73, 36.87], [7, -6 * Math.sqrt(3), 13, 30], [0, 1, 0, 45], [4, -4, 1, 63.43]] as const);
    const bt = Math.abs(B - 2 * Math.sqrt(3)) < 1e-9 ? '2\\sqrt3' : Math.abs(B + 6 * Math.sqrt(3)) < 1e-9 ? '-6\\sqrt3' : String(B);
    return {
      kind: 'values', tol: 0.051, prompt: `ما زاوية الدوران $\\theta$ (بالدرجات، $0^\\circ < \\theta < 90^\\circ$) التي تزيل الحد $xy$ من $Ax^2 + Bxy + Cy^2 = F$ حيث $A = ${A}$ و $B = ${bt}$ و $C = ${C}$؟ (منزلة عشرية)`, answer: [R(deg)],
      hint: 'cot 2θ = (A − C)/B. وإذا A = C فإن 2θ = 90°.',
      solution: [A === C ? `$A = C$ ← $\\cot 2\\theta = 0$ ← $2\\theta = 90^\\circ$` : `$\\cot 2\\theta = \\dfrac{${A} - ${C}}{${bt}}$`, `$\\theta \\approx ${deg}^\\circ$`],
    };
  },
  () => {
    const deg = pick([30, 45, 60]), x = rnd(-4, 4), y = nz(-4, 4);
    const t = (deg * Math.PI) / 180;
    const xp = x * Math.cos(t) + y * Math.sin(t), yp = -x * Math.sin(t) + y * Math.cos(t);
    return {
      kind: 'values', ordered: true, tol: 0.0051, prompt: `دُوّر المحوران بزاوية $${deg}^\\circ$. ما إحداثيا النقطة $(${x}, ${y})$ في النظام الجديد $(x', y')$؟ (منزلتان عشريتان)`, answer: [R(+xp.toFixed(2)), R(+yp.toFixed(2))],
      hint: "x′ = x cos θ + y sin θ ، y′ = −x sin θ + y cos θ.",
      solution: [`$x' = ${x}\\cos${deg}^\\circ + (${y})\\sin${deg}^\\circ \\approx ${xp.toFixed(2)}$`, `$y' = -(${x})\\sin${deg}^\\circ + (${y})\\cos${deg}^\\circ \\approx ${yp.toFixed(2)}$`],
      placeholder: 'مثال: (1.5, -2.6)',
    };
  },
];

// ================= A.C =================
const sAC: Gen[] = [
  () => {
    const trip = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25]]);
    return {
      kind: 'values', prompt: `مثلث قائم ضلعا القائمة ${trip[0]} و ${trip[1]}. ما طول الوتر؟`, answer: [R(trip[2])],
      hint: 'فيثاغورس: c² = a² + b².', solution: [`$c = \\sqrt{${trip[0]}^2 + ${trip[1]}^2} = \\sqrt{${trip[2] ** 2}} = ${trip[2]}$`],
    };
  },
  () => {
    const kind = pick(['circle', 'cyl', 'sphere', 'cone'] as const), r = rnd(2, 9), h = rnd(2, 12);
    const v = { circle: Math.PI * r * r, cyl: Math.PI * r * r * h, sphere: (4 / 3) * Math.PI * r ** 3, cone: (1 / 3) * Math.PI * r * r * h }[kind];
    const q = { circle: `مساحة دائرة نصف قطرها ${r}`, cyl: `حجم أسطوانة نصف قطرها ${r} وارتفاعها ${h}`, sphere: `حجم كرة نصف قطرها ${r}`, cone: `حجم مخروط نصف قطر قاعدته ${r} وارتفاعه ${h}` }[kind];
    const f = { circle: 'A = \\pi r^2', cyl: 'V = \\pi r^2 h', sphere: 'V = \\tfrac43\\pi r^3', cone: 'V = \\tfrac13\\pi r^2 h' }[kind];
    return {
      kind: 'values', tol: 0.051, prompt: `احسب ${q} (منزلة عشرية واحدة).`, answer: [R(r1(v))],
      hint: `القانون: ${f.replace(/\\tfrac(\d)(\d)/, '$1/$2').replace(/\\pi/, 'π').replace(/\^2/, '²').replace(/\^3/, '³')}`,
      solution: [`$${f}$`, `$\\approx ${r1(v)}$`],
    };
  },
  () => {
    const b1 = rnd(3, 12), b2 = rnd(3, 12), h = rnd(2, 10);
    return {
      kind: 'values', prompt: `شبه منحرف قاعدتاه ${b1} و ${b2} وارتفاعه ${h}. ما مساحته؟`, answer: [R(((b1 + b2) * h) / 2)],
      hint: 'A = ½(b₁ + b₂)h.', solution: [`$A = \\tfrac12(${b1} + ${b2})(${h}) = ${((b1 + b2) * h) / 2}$`],
    };
  },
];

export const chA: Record<string, Gen[]> = { 'A.A': sAA, 'A.B': sAB, 'A.C': sAC };
