// مولّدات تمارين الفصل 8: تطبيقات علم المثلثات
import { rnd, nz, pick, gcd, R, Z, frac, choice, type Problem } from '../gen';

type Gen = () => Problem;
const D = Math.PI / 180;
const r2 = (v: number, d = 2) => +v.toFixed(d);
const T1 = 0.051, T2 = 0.0051;
const sinD = (x: number) => Math.sin(x * D), cosD = (x: number) => Math.cos(x * D);
const deg = (x: number) => `${x}^\\circ`;

/** إجابات بلا ضجيج عشري (مثل 6e-17 بدل 0) */
const rr = (x: number) => R(+x.toFixed(10));
const cz = (a: number, b: number) => Z(+a.toFixed(10), +b.toFixed(10));

// ================= 8.1 =================
const s81: Gen[] = [
  () => {
    // ASA أو AAS: A و B و a ← b
    const A = rnd(25, 80), B = rnd(20, 175 - A - 10), a = rnd(5, 40);
    const b = (a * sinD(B)) / sinD(A);
    return {
      kind: 'values', tol: T2, prompt: `في المثلث ABC: $A = ${deg(A)}$ و $B = ${deg(B)}$ و $a = ${a}$. أوجد $b$ (منزلتان).`, answer: [rr(r2(b))],
      hint: 'قانون الجيوب: a / sin A = b / sin B.',
      solution: [`$\\dfrac{b}{\\sin ${deg(B)}} = \\dfrac{${a}}{\\sin ${deg(A)}}$`, `$b = \\dfrac{${a}\\sin ${deg(B)}}{\\sin ${deg(A)}}$`, `$\\approx ${r2(b)}$`],
      placeholder: 'مثال: 23.47',
    };
  },
  () => {
    const A = rnd(25, 70), C = rnd(30, 170 - A - 10), c = rnd(10, 60);
    const B = 180 - A - C;
    const a = (c * sinD(A)) / sinD(C);
    return {
      kind: 'values', tol: T2, prompt: `في المثلث ABC: $A = ${deg(A)}$ و $C = ${deg(C)}$ و $c = ${c}$. أوجد $B$ ثم $a$ (اكتب: B، a بمنزلتين).`, answer: [rr(B), rr(r2(a))], ordered: true,
      hint: 'مجموع الزوايا 180°، ثم قانون الجيوب.',
      solution: [`$B = 180^\\circ - ${A}^\\circ - ${C}^\\circ = ${deg(B)}$`, `$a = \\dfrac{${c}\\sin ${deg(A)}}{\\sin ${deg(C)}} \\approx ${r2(a)}$`],
      placeholder: 'مثال: 65, 31.2',
    };
  },
  () => {
    // SSA: عدد المثلثات
    const A = rnd(25, 60), b = rnd(10, 20);
    const h = b * sinD(A);
    const kind = pick(['none', 'two', 'one'] as const);
    const a = kind === 'none' ? r2(h * (rnd(50, 90) / 100), 1) : kind === 'two' ? r2(h + (b - h) * (rnd(20, 80) / 100), 1) : r2(b * (rnd(110, 160) / 100), 1);
    const n = a < h ? 0 : a < b ? 2 : 1;
    const right = ['لا يوجد مثلث', 'مثلث واحد', 'مثلثان'][n];
    return choice(`في المثلث ABC: $A = ${deg(A)}$ و $b = ${b}$ و $a = ${a}$. كم مثلثًا يحقق هذه المعطيات؟`, right,
      ['لا يوجد مثلث', 'مثلث واحد', 'مثلثان', 'عدد لا نهائي'].filter((x) => x !== right),
      'قارن a بالارتفاع h = b sin A وبالضلع b.',
      [`$h = ${b}\\sin ${deg(A)} \\approx ${r2(h)}$`, n === 0 ? `$a < h$: لا يصل الضلع إلى القاعدة.` : n === 2 ? `$h < a < b$: مثلثان.` : `$a \\ge b$: مثلث واحد.`]);
  },
  () => {
    // SSA بمثلثين: أوجد الزاويتين الممكنتين لـ B
    const A = rnd(25, 50), b = rnd(12, 20);
    const h = b * sinD(A);
    const a = r2(h + (b - h) * (rnd(30, 70) / 100), 1);
    const sB = (b * sinD(A)) / a;
    const B1 = Math.asin(sB) / D, B2 = 180 - B1;
    return {
      kind: 'values', tol: T1, prompt: `الحالة الغامضة: $A = ${deg(A)}$ و $a = ${a}$ و $b = ${b}$. أوجد القيمتين الممكنتين لـ $B$ (أقرب عُشر درجة، افصل بفاصلة).`, answer: [rr(r2(B1, 1)), rr(r2(B2, 1))],
      hint: 'sin B = b sin A / a، ثم الزاوية المكملة أيضًا إن كانت تترك مكانًا لـ C.',
      solution: [`$\\sin B = \\dfrac{${b}\\sin ${deg(A)}}{${a}} \\approx ${r2(sB, 4)}$`, `$B_1 \\approx ${r2(B1, 1)}^\\circ$ و $B_2 = 180^\\circ - B_1 \\approx ${r2(B2, 1)}^\\circ$`, `وكلاهما يصلح لأن $A + B_2 \\approx ${r2(A + B2, 1)}^\\circ < 180^\\circ$.`],
      placeholder: 'مثال: 48.6, 131.4',
    };
  },
  () => {
    const b = rnd(5, 30), c = rnd(5, 30), A = rnd(20, 160);
    const area = 0.5 * b * c * sinD(A);
    return {
      kind: 'values', tol: T1, prompt: `أوجد مساحة المثلث ABC الذي فيه $b = ${b}$ و $c = ${c}$ و $A = ${deg(A)}$ (منزلة واحدة).`, answer: [rr(r2(area, 1))],
      hint: 'المساحة = ½ × ضلعان × جيب الزاوية بينهما.',
      solution: [`$\\mathcal{A} = \\tfrac12 bc\\sin A = \\tfrac12(${b})(${c})\\sin ${deg(A)}$`, `$\\approx ${r2(area, 1)}$`],
      placeholder: 'مثال: 142.7',
    };
  },
  () => {
    // ارتفاع من نقطتين: زاويتا ارتفاع ومسافة بينهما
    const a1 = rnd(20, 40), a2 = a1 + rnd(8, 25), d = rnd(50, 200);
    // المثلث: الزاوية عند القمة = a2 − a1
    const side = (d * sinD(a1)) / sinD(a2 - a1);
    const h = side * sinD(a2);
    return {
      kind: 'values', tol: 0.51, prompt: `من نقطة على أرض مستوية زاوية ارتفاع قمة برج $${deg(a1)}$. بعد التقدم ${d} م نحو البرج صارت $${deg(a2)}$. أوجد ارتفاع البرج لأقرب متر.`, answer: [rr(Math.round(h))],
      hint: 'في المثلث المائل بين نقطتي الرصد والقمة، الزاوية عند القمة هي الفرق بين الزاويتين. استخدم قانون الجيوب ثم مثلثًا قائمًا.',
      solution: [`الزاوية عند القمة $${a2}^\\circ - ${a1}^\\circ = ${deg(a2 - a1)}$`, `المسافة من النقطة الثانية إلى القمة: $\\dfrac{${d}\\sin ${deg(a1)}}{\\sin ${deg(a2 - a1)}} \\approx ${r2(side, 2)}$`, `$h = ${r2(side, 2)}\\sin ${deg(a2)} \\approx ${Math.round(h)}$ م`],
    };
  },
];

// ================= 8.2 =================
const s82: Gen[] = [
  () => {
    const a = rnd(5, 30), b = rnd(5, 30), C = rnd(20, 160);
    const c = Math.sqrt(a * a + b * b - 2 * a * b * cosD(C));
    return {
      kind: 'values', tol: T2, prompt: `في المثلث ABC: $a = ${a}$ و $b = ${b}$ و $C = ${deg(C)}$. أوجد $c$ (منزلتان).`, answer: [rr(r2(c))],
      hint: 'ضلعان والزاوية بينهما (SAS): قانون جيوب التمام.',
      solution: [`$c^2 = ${a}^2 + ${b}^2 - 2(${a})(${b})\\cos ${deg(C)}$`, `$c^2 \\approx ${r2(c * c, 3)}$`, `$c \\approx ${r2(c)}$`],
      placeholder: 'مثال: 17.36',
    };
  },
  () => {
    let a = 0, b = 0, c = 0;
    while (!(a + b > c && a + c > b && b + c > a)) { a = rnd(4, 20); b = rnd(4, 20); c = rnd(4, 20); }
    const which = pick(['A', 'B', 'C'] as const);
    const [x, y, z] = which === 'A' ? [a, b, c] : which === 'B' ? [b, a, c] : [c, a, b];
    const ang = Math.acos((y * y + z * z - x * x) / (2 * y * z)) / D;
    return {
      kind: 'values', tol: T1, prompt: `أضلاع المثلث ABC: $a = ${a}$ و $b = ${b}$ و $c = ${c}$. أوجد الزاوية $${which}$ (أقرب عُشر درجة).`, answer: [rr(r2(ang, 1))],
      hint: 'ثلاثة أضلاع (SSS): حل قانون جيوب التمام لجيب تمام الزاوية.',
      solution: [`$\\cos ${which} = \\dfrac{${y}^2 + ${z}^2 - ${x}^2}{2(${y})(${z})} = ${frac(y * y + z * z - x * x, 2 * y * z)}$`, `$${which} \\approx ${r2(ang, 1)}^\\circ$`],
      placeholder: 'مثال: 57.9',
    };
  },
  () => {
    let a = 0, b = 0, c = 0;
    while (!(a + b > c && a + c > b && b + c > a)) { a = rnd(3, 25); b = rnd(3, 25); c = rnd(3, 25); }
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    return {
      kind: 'values', tol: T2, prompt: `استخدم صيغة هيرون لإيجاد مساحة مثلث أضلاعه ${a} و ${b} و ${c} (منزلتان).`, answer: [rr(r2(area))],
      hint: 's نصف المحيط، والمساحة √(s(s−a)(s−b)(s−c)).',
      solution: [`$s = \\dfrac{${a} + ${b} + ${c}}{2} = ${s}$`, `$\\sqrt{${s}(${s - a})(${s - b})(${s - c})}$`, `$\\approx ${r2(area)}$`],
      placeholder: 'مثال: 40.25',
    };
  },
  () => {
    const items: [string, string][] = [
      ['ضلعان والزاوية المحصورة بينهما (SAS)', 'قانون جيوب التمام'],
      ['ثلاثة أضلاع (SSS)', 'قانون جيوب التمام'],
      ['زاويتان وضلع (ASA أو AAS)', 'قانون الجيوب'],
      ['ضلعان وزاوية مقابلة لأحدهما (SSA)', 'قانون الجيوب (مع الانتباه للحالة الغامضة)'],
    ];
    const [given, right] = pick(items);
    return choice(`لحل مثلث معطى فيه ${given}، نبدأ بـ:`, right,
      ['قانون الجيوب', 'قانون جيوب التمام', 'صيغة هيرون', 'قانون الجيوب (مع الانتباه للحالة الغامضة)'].filter((x) => x !== right),
      'قانون الجيوب يحتاج زوجًا معروفًا كاملًا: زاوية والضلع المقابل لها.',
      [`في حالة ${given} نستخدم ${right}.`]);
  },
  () => {
    const d1 = rnd(20, 80), d2 = rnd(20, 80), ang = rnd(30, 150);
    const dist = Math.sqrt(d1 * d1 + d2 * d2 - 2 * d1 * d2 * cosD(ang));
    return {
      kind: 'values', tol: T1, prompt: `غادرت سفينتان ميناءً معًا. قطعت الأولى ${d1} كم والثانية ${d2} كم، والزاوية بين مساريهما $${deg(ang)}$. كم المسافة بينهما (منزلة واحدة)؟`, answer: [rr(r2(dist, 1))],
      hint: 'المساران ضلعان والزاوية بينهما معروفة.',
      solution: [`$d^2 = ${d1}^2 + ${d2}^2 - 2(${d1})(${d2})\\cos ${deg(ang)}$`, `$d \\approx ${r2(dist, 1)}$ كم`],
      placeholder: 'مثال: 64.3',
    };
  },
];

// ================= 8.3 =================
const s83: Gen[] = [
  () => {
    const m1 = rnd(10, 80), m2 = rnd(10, 80), th = rnd(20, 150);
    const R_ = Math.sqrt(m1 * m1 + m2 * m2 + 2 * m1 * m2 * cosD(th));
    return {
      kind: 'values', tol: T1, prompt: `قوتان مقدارهما ${m1} نيوتن و ${m2} نيوتن تؤثران في نقطة، والزاوية بينهما $${deg(th)}$. أوجد مقدار المحصلة (منزلة واحدة).`, answer: [rr(r2(R_, 1))],
      hint: 'في متوازي الأضلاع الزاوية المقابلة للقطر هي 180° − θ.',
      solution: [`$|\\mathbf{R}|^2 = ${m1}^2 + ${m2}^2 - 2(${m1})(${m2})\\cos(180^\\circ - ${th}^\\circ)$`, `$= ${m1}^2 + ${m2}^2 + 2(${m1})(${m2})\\cos ${deg(th)}$`, `$|\\mathbf{R}| \\approx ${r2(R_, 1)}$ N`],
      placeholder: 'مثال: 96.2',
    };
  },
  () => {
    const m = rnd(5, 50), th = rnd(5, 85);
    const kind = pick(['h', 'v'] as const);
    const val = kind === 'h' ? m * cosD(th) : m * sinD(th);
    return {
      kind: 'values', tol: T2, prompt: `متجه مقداره ${m} يصنع زاوية $${deg(th)}$ مع الأفقي. أوجد مركبته ${kind === 'h' ? 'الأفقية' : 'الرأسية'} (منزلتان).`, answer: [rr(r2(val))],
      hint: 'الأفقية |v| cos θ والرأسية |v| sin θ.',
      solution: [`$${kind === 'h' ? `${m}\\cos ${deg(th)}` : `${m}\\sin ${deg(th)}`} \\approx ${r2(val)}$`],
    };
  },
  () => {
    const W = rnd(500, 4000), th = rnd(5, 35);
    const F = W * sinD(th);
    return {
      kind: 'values', tol: 0.51, prompt: `ما القوة (الموازية للسطح) اللازمة لمنع جسم وزنه ${W} نيوتن من الانزلاق على منحدر أملس زاويته $${deg(th)}$؟ (أقرب نيوتن)`, answer: [rr(Math.round(F))],
      hint: 'مركبة الوزن الموازية للمنحدر W sin θ.',
      solution: [`$F = ${W}\\sin ${deg(th)}$`, `$\\approx ${Math.round(F)}$ N`],
    };
  },
  () => {
    const s = rnd(150, 500), w = rnd(20, 80), heading = pick([0, 90, 180, 270]);
    // رياح عمودية على مسار الطائرة
    const g = Math.hypot(s, w);
    return {
      kind: 'values', tol: T1, prompt: `طائرة سرعتها في الهواء ${s} كم/س، وتهب عليها رياح سرعتها ${w} كم/س عموديًا على اتجاهها. ما سرعتها بالنسبة للأرض؟ (منزلة واحدة)`, answer: [rr(r2(g, 1))],
      hint: 'المتجهان متعامدان، فالمحصلة وتر مثلث قائم.',
      solution: [`$\\sqrt{${s}^2 + ${w}^2}$`, `$\\approx ${r2(g, 1)}$ كم/س${heading >= 0 ? '' : ''}`],
    };
  },
  () => {
    const m1 = rnd(10, 60), m2 = rnd(10, 60), th = rnd(30, 150);
    const R_ = Math.sqrt(m1 * m1 + m2 * m2 + 2 * m1 * m2 * cosD(th));
    const right = `قوة مقدارها $${r2(R_, 1)}$ عكس اتجاه المحصلة`;
    return choice(`قوتان ${m1} N و ${m2} N بينهما $${deg(th)}$. ما القوة الموازنة؟`, right,
      [`قوة مقدارها $${r2(R_, 1)}$ في اتجاه المحصلة`, `قوة مقدارها $${m1 + m2}$ عكس اتجاه المحصلة`, `قوة مقدارها $${Math.abs(m1 - m2)}$ عمودية على المحصلة`],
      'الموازنة تلغي المحصلة: نفس المقدار، عكس الاتجاه.',
      [`المحصلة $\\approx ${r2(R_, 1)}$ N، والموازنة $-\\mathbf{R}$.`]);
  },
];

// ================= 8.4 =================
const s84: Gen[] = [
  () => {
    const a = nz(-9, 9), b = nz(-9, 9), c = nz(-9, 9), d = nz(-9, 9);
    const k = nz(-3, 3), m = nz(-3, 3);
    return {
      kind: 'values', ordered: true, prompt: `إذا كان $\\mathbf{u} = \\langle ${a}, ${b}\\rangle$ و $\\mathbf{v} = \\langle ${c}, ${d}\\rangle$، فأوجد $${k}\\mathbf{u} ${m < 0 ? '-' : '+'} ${Math.abs(m)}\\mathbf{v}$.`, answer: [rr(k * a + m * c), rr(k * b + m * d)],
      hint: 'اضرب كل مركبة في العدد، ثم اجمع المركبات المتناظرة.',
      solution: [`$${k}\\langle ${a}, ${b}\\rangle = \\langle ${k * a}, ${k * b}\\rangle$ و $${m}\\langle ${c}, ${d}\\rangle = \\langle ${m * c}, ${m * d}\\rangle$`, `$\\langle ${k * a + m * c}, ${k * b + m * d}\\rangle$`],
      placeholder: 'مثال: <3, -7>',
    };
  },
  () => {
    const m = rnd(2, 20), th = pick([30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330]);
    return {
      kind: 'values', ordered: true, prompt: `اكتب بالمركبات (قيم دقيقة) المتجه الذي مقداره ${m} وزاوية اتجاهه $${deg(th)}$.`, answer: [rr(m * cosD(th)), rr(m * sinD(th))],
      hint: '⟨|v| cos θ, |v| sin θ⟩.',
      solution: [`$\\langle ${m}\\cos ${deg(th)},\\ ${m}\\sin ${deg(th)}\\rangle$`, `$\\approx \\langle ${r2(m * cosD(th), 3)},\\ ${r2(m * sinD(th), 3)}\\rangle$`],
      placeholder: 'مثال: <5sqrt(3), -5>',
    };
  },
  () => {
    const a = nz(-9, 9), b = nz(-9, 9);
    const mag = Math.hypot(a, b);
    const dir = (Math.atan2(b, a) / D + 360) % 360;
    return {
      kind: 'values', ordered: true, tol: T1, prompt: `أوجد مقدار المتجه $\\langle ${a}, ${b}\\rangle$ وزاوية اتجاهه في $[0^\\circ, 360^\\circ)$ (اكتب: المقدار، الزاوية بمنزلة واحدة).`, answer: [rr(r2(mag, 1)), rr(r2(dir, 1))],
      hint: '|v| = √(a² + b²)، و tan θ = b/a مع مراعاة الربع.',
      solution: [`$|\\mathbf{v}| = \\sqrt{${a * a} + ${b * b}} \\approx ${r2(mag, 2)}$`, `$\\tan^{-1}\\tfrac{${b}}{${a}} \\approx ${r2(Math.atan(b / a) / D, 1)}^\\circ$، والمتجه في الربع ${['الأول', 'الثاني', 'الثالث', 'الرابع'][Math.floor(dir / 90)]}، فـ $\\theta \\approx ${r2(dir, 1)}^\\circ$`],
      placeholder: 'مثال: 7.2, 236.3',
    };
  },
  () => {
    const a = nz(-8, 8), b = nz(-8, 8), c = nz(-8, 8), d = nz(-8, 8);
    return {
      kind: 'values', prompt: `أوجد $\\langle ${a}, ${b}\\rangle \\cdot \\langle ${c}, ${d}\\rangle$.`, answer: [rr(a * c + b * d)],
      hint: 'اضرب المركبات المتناظرة واجمع.',
      solution: [`$(${a})(${c}) + (${b})(${d}) = ${a * c + b * d}$`],
    };
  },
  () => {
    const a = nz(-8, 8), b = nz(-8, 8), c = nz(-8, 8), d = nz(-8, 8);
    const th = Math.acos((a * c + b * d) / (Math.hypot(a, b) * Math.hypot(c, d))) / D;
    return {
      kind: 'values', tol: T1, prompt: `أوجد الزاوية بين $\\mathbf{u} = \\langle ${a}, ${b}\\rangle$ و $\\mathbf{v} = \\langle ${c}, ${d}\\rangle$ (أقرب عُشر درجة).`, answer: [rr(r2(th, 1))],
      hint: 'cos θ = (u · v) / (|u||v|).',
      solution: [`$\\mathbf{u}\\cdot\\mathbf{v} = ${a * c + b * d}$، $|\\mathbf{u}| = \\sqrt{${a * a + b * b}}$، $|\\mathbf{v}| = \\sqrt{${c * c + d * d}}$`, `$\\cos\\theta = \\dfrac{${a * c + b * d}}{\\sqrt{${a * a + b * b}}\\sqrt{${c * c + d * d}}}$`, `$\\theta \\approx ${r2(th, 1)}^\\circ$`],
      placeholder: 'مثال: 104.0',
    };
  },
  () => {
    const a = nz(-6, 6), b = nz(-6, 6), k = nz(-3, 3);
    const perp = Math.random() < 0.5;
    const [c, d] = perp ? [-b * k, a * k] : [a * k + nz(-2, 2), b * k];
    const dot = a * c + b * d;
    const right = dot === 0 ? 'متعامدان' : dot > 0 ? 'الزاوية بينهما حادة' : 'الزاوية بينهما منفرجة';
    return choice(`ما العلاقة بين $\\langle ${a}, ${b}\\rangle$ و $\\langle ${c}, ${d}\\rangle$؟`, right,
      ['متعامدان', 'الزاوية بينهما حادة', 'الزاوية بينهما منفرجة', 'متوازيان دائمًا'].filter((x) => x !== right),
      'إشارة الضرب النقطي تحدد نوع الزاوية.',
      [`$\\mathbf{u}\\cdot\\mathbf{v} = ${dot}$`, dot === 0 ? 'الضرب النقطي صفر: متعامدان.' : dot > 0 ? 'موجب: الزاوية حادة.' : 'سالب: الزاوية منفرجة.']);
  },
];

// ================= 8.5 =================
const SPEC: [number, number, number, string, string][] = [
  // r, θ°, ثم صيغة الجزأين بـ TeX
  [2, 60, 0, '1', '\\sqrt3'], [2, 30, 0, '\\sqrt3', '1'], [4, 120, 0, '-2', '2\\sqrt3'], [2, 135, 0, '-\\sqrt2', '\\sqrt2'], [6, 210, 0, '-3\\sqrt3', '-3'],
  [4, 300, 0, '2', '-2\\sqrt3'], [8, 225, 0, '-4\\sqrt2', '-4\\sqrt2'], [3, 90, 0, '0', '3'], [5, 180, 0, '-5', '0'], [2, 330, 0, '\\sqrt3', '-1'],
];
/** a + bi بصيغة TeX من نصين */
const imT_ = (m: string) => (m === '1' ? '' : m === '-1' ? '-' : m);
const cxT = (re: string, im: string) => (im === '0' ? re : re === '0' ? `${imT_(im)}i` : `${re} ${im.startsWith('-') ? '-' : '+'} ${imT_(im.replace(/^-/, ''))}i`);
const s85: Gen[] = [
  () => {
    const [r, t, , reT, imT] = pick(SPEC);
    return {
      kind: 'values', prompt: `اكتب بالصيغة الجبرية $a + bi$: $${r}(\\cos ${deg(t)} + i\\sin ${deg(t)})$`, answer: [cz(r * cosD(t), r * sinD(t))],
      hint: 'احسب cos θ و sin θ ثم اضرب في r.',
      solution: [`$${r}\\cos ${deg(t)} = ${reT}$، $${r}\\sin ${deg(t)} = ${imT}$`, `$${cxT(reT, imT)}$`],
      placeholder: 'مثال: -2+2sqrt(3)i',
    };
  },
  () => {
    const [r, t, , reT, imT] = pick(SPEC);
    return {
      kind: 'values', ordered: true, prompt: `اكتب $${cxT(reT, imT)}$ بالصيغة المثلثية $r\\operatorname{cis}\\theta$. اكتب: r، θ بالدرجات في $[0^\\circ, 360^\\circ)$.`, answer: [rr(r), rr(t)],
      hint: 'r = √(a² + b²)، و θ من tan θ = b/a مع مراعاة الربع.',
      solution: [`$r = \\sqrt{(${reT})^2 + (${imT})^2} = ${r}$`, `الزاوية في الربع الصحيح: $\\theta = ${deg(t)}$`, `$${r}\\operatorname{cis} ${deg(t)}$`],
      placeholder: 'مثال: 4, 120',
    };
  },
  () => {
    const r1 = rnd(1, 6), r2_ = rnd(1, 6), t1 = pick([15, 30, 45, 60, 75, 90, 120, 150]), t2 = pick([15, 30, 45, 60, 75, 90, 120, 135]);
    const r = r1 * r2_, t = t1 + t2;
    return {
      kind: 'values', prompt: `أوجد حاصل الضرب بالصيغة الجبرية: $${r1 === 1 ? '' : r1}\\operatorname{cis} ${deg(t1)} \\cdot ${r2_ === 1 ? '' : r2_}\\operatorname{cis} ${deg(t2)}$`, answer: [cz(r * cosD(t), r * sinD(t))],
      hint: 'اضرب الطولين واجمع الزاويتين، ثم حوّل.',
      solution: [`$= ${r}\\operatorname{cis}(${t1}^\\circ + ${t2}^\\circ) = ${r}\\operatorname{cis} ${deg(t)}$`, `$= ${r}\\cos ${deg(t)} + ${r}i\\sin ${deg(t)} \\approx ${r2(r * cosD(t), 4)} ${r * sinD(t) < 0 ? '-' : '+'} ${Math.abs(r2(r * sinD(t), 4))}i$`],
      placeholder: 'مثال: -6+6sqrt(3)i',
    };
  },
  () => {
    const r2_ = rnd(1, 4), r1 = r2_ * rnd(1, 4), t1 = pick([90, 120, 150, 180, 210, 240, 300]), t2 = pick([30, 45, 60, 90]);
    const r = r1 / r2_, t = t1 - t2;
    return {
      kind: 'values', prompt: `أوجد ناتج القسمة بالصيغة الجبرية: $\\dfrac{${r1}\\operatorname{cis} ${deg(t1)}}{${r2_}\\operatorname{cis} ${deg(t2)}}$`, answer: [cz(r * cosD(t), r * sinD(t))],
      hint: 'اقسم الطولين واطرح الزاويتين.',
      solution: [`$= ${r}\\operatorname{cis}(${t1}^\\circ - ${t2}^\\circ) = ${r}\\operatorname{cis} ${deg(t)}$`, `$\\approx ${r2(r * cosD(t), 4)} ${r * sinD(t) < 0 ? '-' : '+'} ${Math.abs(r2(r * sinD(t), 4))}i$`],
      placeholder: 'مثال: 2i',
    };
  },
  () => {
    const a = nz(-6, 6), b = nz(-6, 6);
    const r = Math.hypot(a, b);
    return {
      kind: 'values', tol: T2, prompt: `ما القيمة المطلقة (الطول) للعدد المركب $${a} ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}i$؟ (منزلتان أو قيمة دقيقة)`, answer: [rr(r)],
      hint: '|a + bi| = √(a² + b²): بعد النقطة عن الأصل.',
      solution: [`$\\sqrt{(${a})^2 + (${b})^2} = \\sqrt{${a * a + b * b}}$`, `$\\approx ${r2(r, 2)}$`],
      placeholder: 'مثال: sqrt(13)',
    };
  },
];

// ================= 8.6 =================
const s86: Gen[] = [
  () => {
    const [r, t] = pick([[2, 30], [2, 45], [2, 60], [1, 90], [2, 120], [2, 135], [2, 150], [1, 45], [2, 225], [2, 315]] as const);
    const n = rnd(2, 8);
    const R_ = r ** n, T = (t * n) % 360;
    const base = r === 2 && [30, 150].includes(t) ? null : null;
    void base;
    return {
      kind: 'values', prompt: `استخدم نظرية دي موافر لإيجاد $\\left[${r === 1 ? '' : r}\\operatorname{cis} ${deg(t)}\\right]^{${n}}$ بالصيغة الجبرية.`, answer: [cz(R_ * cosD(T), R_ * sinD(T))],
      hint: '[r cis θ]ⁿ = rⁿ cis(nθ).',
      solution: [`$= ${r}^{${n}}\\operatorname{cis}(${n}\\cdot ${t}^\\circ) = ${R_}\\operatorname{cis} ${deg(t * n)}$`, ...(t * n >= 360 ? [`$${t * n}^\\circ$ تكافئ $${deg(T)}$`] : []), `$\\approx ${r2(R_ * cosD(T), 4)} ${R_ * sinD(T) < 0 ? '-' : '+'} ${Math.abs(r2(R_ * sinD(T), 4))}i$`],
      placeholder: 'مثال: -64 أو 8i',
    };
  },
  () => {
    const [a, b, r, t] = pick([[1, 1, Math.SQRT2, 45], [1, -1, Math.SQRT2, 315], [-1, 1, Math.SQRT2, 135], [1, Math.sqrt(3), 2, 60], [Math.sqrt(3), 1, 2, 30], [-1, Math.sqrt(3), 2, 120]] as const);
    const n = pick([4, 6, 8, 3]);
    const R_ = r ** n, T = (t * n) % 360;
    const aT = a === Math.sqrt(3) ? '\\sqrt3' : String(a), bT = Math.abs(b) === Math.sqrt(3) ? '\\sqrt3' : '';
    return {
      kind: 'values', prompt: `أوجد $(${aT} ${b < 0 ? '-' : '+'} ${bT}i)^{${n}}$ بالصيغة الجبرية.`, answer: [cz(R_ * cosD(T), R_ * sinD(T))],
      hint: 'حوّل إلى الصيغة القطبية أولًا، ثم طبّق دي موافر.',
      solution: [`$${aT} ${b < 0 ? '-' : '+'} ${bT}i = ${r === 2 ? '2' : '\\sqrt2'}\\operatorname{cis} ${deg(t)}$`, `$= ${r2(R_, 4)}\\operatorname{cis} ${deg(t * n)}$`, `$= ${r2(R_ * cosD(T), 4)} ${R_ * sinD(T) < 0 ? '-' : '+'} ${Math.abs(r2(R_ * sinD(T), 4))}i$`],
      placeholder: 'مثال: -16-16sqrt(3)i',
    };
  },
  () => {
    const n = pick([2, 3, 4, 6]);
    const [r, t, zT] = pick([[8, 90, '8i'], [1, 0, '1'], [16, 180, '-16'], [27, 270, '-27i'], [64, 0, '64'], [1, 180, '-1']] as const);
    const R_ = r ** (1 / n);
    const k = rnd(0, n - 1);
    const ang = (t + 360 * k) / n;
    return {
      kind: 'values', ordered: true, tol: 0.0051, prompt: `أوجد الجذر $w_{${k}}$ من الجذور النونية للرتبة ${n} للعدد $${zT}$ بالصيغة القطبية. اكتب: الطول، الزاوية بالدرجات (منزلتان).`, answer: [rr(r2(R_, 2)), rr(r2(ang, 2))],
      hint: `w_k = ⁿ√r cis((θ + 360°k)/n) مع n = ${n}.`,
      solution: [`$${zT} = ${r}\\operatorname{cis} ${deg(t)}$`, `$w_{${k}} = \\sqrt[${n}]{${r}}\\operatorname{cis}\\dfrac{${t}^\\circ + 360^\\circ(${k})}{${n}}$`, `$\\approx ${r2(R_, 2)}\\operatorname{cis} ${r2(ang, 2)}^\\circ$`],
      placeholder: 'مثال: 2, 150',
    };
  },
  () => {
    const n = pick([3, 4, 6]);
    const cl = (x: number) => +x.toFixed(12);
    const roots = Array.from({ length: n }, (_, k) => cz(cl(Math.cos((2 * Math.PI * k) / n)), cl(Math.sin((2 * Math.PI * k) / n))));
    return {
      kind: 'values', prompt: `حل $x^{${n}} - 1 = 0$ في الأعداد المركبة (كل الحلول بالصيغة الجبرية، افصل بفاصلة).`, answer: roots,
      hint: 'الحلول جذور الوحدة: cis(360°k / n).',
      solution: [`$x^{${n}} = 1 = 1\\operatorname{cis} 0^\\circ$`, `$x = \\operatorname{cis}\\dfrac{360^\\circ k}{${n}},\\ k = 0, \\dots, ${n - 1}$`, n === 3 ? '$1,\\ -\\tfrac12 + \\tfrac{\\sqrt3}{2}i,\\ -\\tfrac12 - \\tfrac{\\sqrt3}{2}i$' : n === 4 ? '$1,\\ i,\\ -1,\\ -i$' : '$\\pm 1,\\ \\pm\\tfrac12 \\pm \\tfrac{\\sqrt3}{2}i$'],
      placeholder: 'مثال: 1, i, -1, -i',
    };
  },
  () => {
    const n = rnd(3, 9);
    const right = `${n} جذور على دائرة، والزاوية بين كل جذرين متتاليين $${r2(360 / n, 2)}^\\circ$`;
    return choice(`ما الوصف الصحيح للجذور النونية من الرتبة ${n} لعدد مركب غير صفري؟`, right,
      [`${n} جذور على مستقيم يمر بالأصل`, `جذر حقيقي واحد و ${n - 1} مركبة على أي شكل`, `${2 * n} جذرًا على دائرة`],
      'كل الجذور لها الطول نفسه ⁿ√r، وتختلف زواياها بـ 360°/n.',
      [`الطول المشترك $\\sqrt[n]{r}$ يضعها على دائرة، والفرق الثابت $\\tfrac{360^\\circ}{${n}}$ يجعلها رؤوس مضلع منتظم.`]);
  },
];

// ================= 8.7 =================
const s87: Gen[] = [
  () => {
    const r = rnd(2, 10), t = pick([30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330]);
    return {
      kind: 'values', ordered: true, prompt: `حوّل النقطة القطبية $(${r}, ${deg(t)})$ إلى إحداثيات ديكارتية (قيم دقيقة).`, answer: [rr(r * cosD(t)), rr(r * sinD(t))],
      hint: 'x = r cos θ و y = r sin θ.',
      solution: [`$x = ${r}\\cos ${deg(t)} \\approx ${r2(r * cosD(t), 4)}$`, `$y = ${r}\\sin ${deg(t)} \\approx ${r2(r * sinD(t), 4)}$`],
      placeholder: 'مثال: (-3, 3sqrt(3))',
    };
  },
  () => {
    const [x, y, r, t] = pick([[1, 1, Math.SQRT2, 45], [-1, 1, Math.SQRT2, 135], [-1, -1, Math.SQRT2, 225], [0, 3, 3, 90], [-4, 0, 4, 180], [1, -Math.sqrt(3), 2, 300], [-Math.sqrt(3), 1, 2, 150], [0, -5, 5, 270]] as const);
    const fx = (v: number) => (Math.abs(v) === Math.sqrt(3) ? `${v < 0 ? '-' : ''}\\sqrt3` : String(v));
    return {
      kind: 'values', ordered: true, prompt: `حوّل النقطة $(${fx(x)}, ${fx(y)})$ إلى إحداثيات قطبية $(r, \\theta)$ مع $r > 0$ و $0^\\circ \\le \\theta < 360^\\circ$. اكتب: r، θ.`, answer: [rr(r), rr(t)],
      hint: 'r = √(x² + y²)، و tan θ = y/x مع الربع الصحيح.',
      solution: [`$r = \\sqrt{(${fx(x)})^2 + (${fx(y)})^2} = ${r === Math.SQRT2 ? '\\sqrt2' : r}$`, `$\\theta = ${deg(t)}$`],
      placeholder: 'مثال: sqrt(2), 135',
    };
  },
  () => {
    const n = rnd(2, 7), a = rnd(1, 5);
    const fn = pick(['\\sin', '\\cos']);
    const petals = n % 2 ? n : 2 * n;
    return {
      kind: 'values', prompt: `كم بتلة لمنحنى الوردة $r = ${a}${fn} ${n}\\theta$؟`, answer: [rr(petals)],
      hint: 'n فردي ← n بتلة، و n زوجي ← 2n بتلة.',
      solution: [`$n = ${n}$ ${n % 2 ? 'فردي' : 'زوجي'}، فعدد البتلات ${petals}.`],
    };
  },
  () => {
    const items: [string, string, string[]][] = [
      ['r = 4\\sin\\theta', '$x^2 + (y - 2)^2 = 4$', ['$r^2 = 4r\\sin\\theta$', '$x^2 + y^2 = 4y$ ← $x^2 + (y - 2)^2 = 4$']],
      ['r = 6\\cos\\theta', '$(x - 3)^2 + y^2 = 9$', ['$r^2 = 6r\\cos\\theta$', '$x^2 + y^2 = 6x$ ← $(x - 3)^2 + y^2 = 9$']],
      ['r = \\dfrac{4}{\\cos\\theta}', '$x = 4$', ['$r\\cos\\theta = 4$', '$x = 4$: مستقيم رأسي']],
      ['r = 3\\csc\\theta', '$y = 3$', ['$r\\sin\\theta = 3$', '$y = 3$: مستقيم أفقي']],
      ['r = 5', '$x^2 + y^2 = 25$', ['$r^2 = 25$', '$x^2 + y^2 = 25$: دائرة مركزها الأصل']],
      ['\\theta = \\dfrac{\\pi}{4}', '$y = x$', ['$\\tan\\theta = 1$', '$\\tfrac{y}{x} = 1$ ← $y = x$']],
    ];
    const [eq, right, steps] = pick(items);
    return choice(`ما المعادلة الديكارتية للمعادلة القطبية $${eq}$؟`, right,
      items.map(([, w]) => w).filter((w) => w !== right).slice(0, 5).sort(() => Math.random() - 0.5),
      'استخدم x = r cos θ، y = r sin θ، r² = x² + y²، وغالبًا اضرب الطرفين في r.',
      steps);
  },
  () => {
    const a = rnd(1, 5), b = rnd(1, 5);
    const name = a === b ? 'قلبية' : a < b ? 'حلزون بعقدة داخلية' : a >= 2 * b ? 'حلزون محدب' : 'حلزون بغمّازة';
    return choice(`ما نوع منحنى $r = ${a} + ${b}\\cos\\theta$؟`, name,
      ['قلبية', 'حلزون بعقدة داخلية', 'حلزون بغمّازة', 'حلزون محدب', 'وردة'].filter((x) => x !== name),
      'قارن a و b في r = a + b cos θ.',
      [`$a = ${a}$ و $b = ${b}$: ${a === b ? 'a = b قلبية' : a < b ? 'a < b عقدة داخلية' : a >= 2 * b ? 'a ≥ 2b محدب' : 'b < a < 2b بغمّازة'}.`]);
  },
];

// ================= 8.8 =================
const s88: Gen[] = [
  () => {
    const a = nz(-4, 4), b = rnd(-6, 6), c = nz(-3, 3), d = rnd(-6, 6);
    // x = a t + b ، y = c t + d ← y = (c/a)(x − b) + d
    const m = c / a, k = d - (c * b) / a;
    return {
      kind: 'expr', prompt: `احذف الوسيط واكتب $y$ بدلالة $x$: $x = ${a}t ${b < 0 ? '-' : '+'} ${Math.abs(b)}$، $y = ${c}t ${d < 0 ? '-' : '+'} ${Math.abs(d)}$`,
      answer: `(${c})*(x-(${b}))/(${a})+(${d})`, vars: ['x'],
      hint: 'حل معادلة x لـ t، ثم عوّض في y.',
      solution: [`$t = \\dfrac{x ${b < 0 ? '+' : '-'} ${Math.abs(b)}}{${a}}$`, `$y = ${c}\\cdot\\dfrac{x ${b < 0 ? '+' : '-'} ${Math.abs(b)}}{${a}} ${d < 0 ? '-' : '+'} ${Math.abs(d)}$`, `$y = ${frac(c, a)}x ${k < 0 ? '-' : '+'} ${frac(Math.abs(Math.round(k * a)), Math.abs(a))}$`],
      placeholder: 'مثال: 2x-3 أو (3/2)x+1',
    };
  },
  () => {
    const h = nz(-4, 4), k = rnd(-4, 4), p = nz(-3, 3);
    // x = t + h ، y = p t² + k ← y = p(x − h)² + k
    return {
      kind: 'expr', prompt: `احذف الوسيط: $x = t ${h < 0 ? '-' : '+'} ${Math.abs(h)}$، $y = ${p === 1 ? '' : p === -1 ? '-' : p}t^2 ${k === 0 ? '' : k < 0 ? `- ${-k}` : `+ ${k}`}$. اكتب $y$ بدلالة $x$.`,
      answer: `${p}(x-(${h}))^2+(${k})`, vars: ['x'],
      hint: 't = x − (الإزاحة)، ثم عوّض.',
      solution: [`$t = x ${h < 0 ? '+' : '-'} ${Math.abs(h)}$`, `$y = ${p}(x ${h < 0 ? '+' : '-'} ${Math.abs(h)})^2 ${k === 0 ? '' : k < 0 ? `- ${-k}` : `+ ${k}`}$`],
      placeholder: 'مثال: 2(x-1)^2+3',
    };
  },
  () => {
    const a = rnd(2, 6), b = rnd(2, 6);
    const same = a === b;
    const right = same ? `دائرة: $x^2 + y^2 = ${a * a}$` : `قطع ناقص: $\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}} = 1$`;
    return choice(`ما المعادلة الديكارتية للمنحنى $x = ${a}\\cos t$، $y = ${b}\\sin t$؟`, right,
      [`$\\dfrac{x}{${a}} + \\dfrac{y}{${b}} = 1$`, `$y = ${frac(b, a)}x$`, `$x^2 - y^2 = ${Math.abs(a * a - b * b) || 1}$`],
      'cos²t + sin²t = 1.',
      [`$\\cos t = \\tfrac{x}{${a}}$ و $\\sin t = \\tfrac{y}{${b}}$`, `$\\left(\\tfrac{x}{${a}}\\right)^2 + \\left(\\tfrac{y}{${b}}\\right)^2 = 1$`]);
  },
  () => {
    const v0 = rnd(15, 60), ang = rnd(20, 70), t = r2(rnd(5, 30) / 10, 1);
    const x = v0 * cosD(ang) * t, y = v0 * sinD(ang) * t - 4.9 * t * t;
    return {
      kind: 'values', ordered: true, tol: T1, prompt: `قُذف جسم بسرعة ${v0} م/ث وزاوية $${deg(ang)}$: $x = (${v0}\\cos ${deg(ang)})t$، $y = (${v0}\\sin ${deg(ang)})t - 4.9t^2$. أين يكون عند $t = ${t}$ ث؟ (اكتب: x، y بمنزلة واحدة)`, answer: [rr(r2(x, 1)), rr(r2(y, 1))],
      hint: 'عوّض t في المعادلتين.',
      solution: [`$x = ${v0}\\cos ${deg(ang)}\\cdot ${t} \\approx ${r2(x, 1)}$`, `$y = ${v0}\\sin ${deg(ang)}\\cdot ${t} - 4.9(${t})^2 \\approx ${r2(y, 1)}$`],
      placeholder: 'مثال: 32.4, 11.7',
    };
  },
  () => {
    const r = rnd(1, 6);
    const kind = pick(['top', 'dist'] as const);
    if (kind === 'top') return {
      kind: 'values', prompt: `دويري $x = ${r}(t - \\sin t)$، $y = ${r}(1 - \\cos t)$. ما أقصى ارتفاع تبلغه النقطة؟`, answer: [rr(2 * r)],
      hint: 'أكبر قيمة لـ 1 − cos t هي 2.',
      solution: [`$1 - \\cos t \\le 2$ (عند $t = \\pi$)`, `$y_{\\max} = 2(${r}) = ${2 * r}$: قطر الدائرة.`],
    };
    return {
      kind: 'values', tol: T2, prompt: `دويري $x = ${r}(t - \\sin t)$، $y = ${r}(1 - \\cos t)$. ما المسافة الأفقية بين نقطتين متتاليتين يلمس فيهما المنحنى المحور x؟ (منزلتان أو قيمة دقيقة)`, answer: [rr(2 * Math.PI * r)],
      hint: 'يلمس المحور عندما y = 0، أي t = 0 و t = 2π.',
      solution: [`$t = 0$ ← $x = 0$، و $t = 2\\pi$ ← $x = ${r}(2\\pi) = ${2 * r}\\pi$`, `المسافة $${2 * r}\\pi \\approx ${r2(2 * Math.PI * r)}$ = محيط الدائرة.`],
      placeholder: 'مثال: 6pi',
    };
  },
];

export const ch8: Record<string, Gen[]> = { '8.1': s81, '8.2': s82, '8.3': s83, '8.4': s84, '8.5': s85, '8.6': s86, '8.7': s87, '8.8': s88 };
void gcd;
