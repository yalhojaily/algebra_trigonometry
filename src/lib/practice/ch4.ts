// مولّدات تمارين الفصل 4: الدوال العكسية والأسية واللوغاريتمية
import { rnd, nz, pick, R, frac, choice, type Problem } from '../gen';

type Gen = () => Problem;
const ps = (k: number) => (k < 0 ? `(${k})` : String(k));
const sgn = (k: number) => (k < 0 ? `- ${-k}` : `+ ${k}`);
const r2 = (v: number, d = 2) => +v.toFixed(d);
const money = (v: number) => v.toFixed(2);
const T2 = 0.0051; // تسامح التقريب لمنزلتين
const T3 = 0.00051; // تسامح التقريب لثلاث منازل

// ================= 4.1 =================
const s41: Gen[] = [
  () => {
    const sets: [string, string[]][] = [
      ['$f(x) = x^3 - 1$', ['$f(x) = x^2 + 1$', '$f(x) = |x - 2|$', '$f(x) = x^4 - x$']],
      ['$f(x) = 2^x$', ['$f(x) = (x - 3)^2$', '$f(x) = |x| + 1$', '$f(x) = x^2 - 4x$']],
      ['$f(x) = \\sqrt{x + 4}$', ['$f(x) = x^2 - 4$', '$f(x) = -|x|$', '$f(x) = 5$']],
      ['$f(x) = \\dfrac{1}{x}$', ['$f(x) = \\dfrac{1}{x^2}$', '$f(x) = x^2 + x$', '$f(x) = |x + 1|$']],
      ['$f(x) = -3x + 7$', ['$f(x) = x^2$', '$f(x) = |3x|$', '$f(x) = x^4 + 1$']],
    ];
    const [right, wrong] = pick(sets);
    return choice('أي الدوال الآتية واحد لواحد (لها دالة عكسية)؟', right, wrong,
      'اختبار المستقيم الأفقي: هل يقطع أي مستقيم أفقي المنحنى في أكثر من نقطة؟',
      [`${right} تجتاز اختبار المستقيم الأفقي: كل قيمة لـ $y$ تأتي من قيمة واحدة فقط لـ $x$.`, 'أما البقية ففيها قيمتان مختلفتان لـ $x$ تعطيان الناتج نفسه (مثل $x$ و $-x$ في الدوال الزوجية).']);
  },
  () => {
    const a = nz(-5, 5), b = nz(-9, 9);
    return {
      kind: 'expr', prompt: `أوجد الدالة العكسية للدالة $f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}x ${sgn(b)}$. اكتب $f^{-1}(x)$.`,
      answer: `(x - (${b}))/(${a})`, vars: ['x'],
      hint: 'اكتب y = f(x)، بدّل x و y، ثم حل المعادلة لـ y.',
      solution: [`$y = ${a}x ${sgn(b)}$`, `بدّل: $x = ${a}y ${sgn(b)}$`, `$${a}y = x ${sgn(-b)}$`, `$f^{-1}(x) = \\dfrac{x ${sgn(-b)}}{${a}}$`],
      placeholder: 'مثال: (x - 3)/2',
    };
  },
  () => {
    const a = nz(1, 6), b = nz(-6, 6);
    return {
      kind: 'expr', prompt: `أوجد الدالة العكسية للدالة $f(x) = \\dfrac{x ${sgn(b)}}{x - ${a}}$، حيث $x \\ne ${a}$.`,
      answer: `(${a}x + (${b}))/(x - 1)`, vars: ['x'],
      hint: 'بعد تبديل x و y اضرب في المقام، اجمع حدود y في طرف، ثم أخرج y عاملًا مشتركًا.',
      solution: [`بدّل: $x = \\dfrac{y ${sgn(b)}}{y - ${a}}$`, `$x(y - ${a}) = y ${sgn(b)}$ ← $xy - y = ${a}x ${sgn(b)}$`, `$y(x - 1) = ${a}x ${sgn(b)}$`, `$f^{-1}(x) = \\dfrac{${a}x ${sgn(b)}}{x - 1}$`],
      placeholder: 'مثال: (2x+1)/(x-1)',
    };
  },
  () => {
    const a = nz(-4, 4), b = rnd(-8, 8), x = rnd(-5, 5);
    const c = a * x + b;
    return {
      kind: 'values', prompt: `إذا كان $f(x) = ${a}x ${b === 0 ? '' : sgn(b)}$، فأوجد $f^{-1}(${c})$.`, answer: [R(x)],
      hint: `f⁻¹(${c}) هو العدد الذي تحوّله f إلى ${c}. حل f(x) = ${c}.`,
      solution: [`نحل $${a}x ${b === 0 ? '' : sgn(b)} = ${c}$`, `$x = ${x}$، إذن $f^{-1}(${c}) = ${x}$`],
    };
  },
  () => {
    const p = rnd(-6, 6), q = rnd(-6, 6);
    const right = `$(${q}, ${p})$`;
    return choice(`النقطة $(${p}, ${q})$ تقع على منحنى الدالة $f$ الواحد لواحد. أي نقطة تقع حتمًا على منحنى $f^{-1}$؟`, right,
      [`$(${-p}, ${-q})$`, `$(${p}, ${-q})$`, `$(${-q}, ${-p})$`, `$(${p}, ${q})$`].filter((w) => w !== right),
      'المعكوس يبدّل المدخل بالمخرج.',
      [`$f(${p}) = ${q}$ يعني $f^{-1}(${q}) = ${p}$، فالنقطة ${right}.`, 'هندسيًا: انعكاس حول المستقيم $y = x$.']);
  },
  () => {
    const k = nz(-5, 5);
    const right = `$[${k}, \\infty)$`;
    return choice(`للدالة $f(x) = \\sqrt{x} ${sgn(k)}$، ما مجال الدالة العكسية $f^{-1}$؟`, right,
      ['$[0, \\infty)$', `$[${-k}, \\infty)$`, '$(-\\infty, \\infty)$'],
      'مجال المعكوس = مدى الدالة الأصلية.',
      [`مدى $f$ هو $[${k}, \\infty)$ لأن $\\sqrt{x} \\ge 0$.`, `ومجال $f^{-1}$ يساوي مدى $f$، أي ${right}.`]);
  },
];

// ================= 4.2 =================
const s42: Gen[] = [
  () => {
    let b = 0, m = 0, c = 0, x = 0, n = 99;
    while (n < -3 || n > 6 || n === 0) { b = pick([2, 3, 5]); m = nz(-3, 3); c = rnd(-4, 4); x = rnd(-3, 3); n = m * x + c; if (b === 5 && n > 4) n = 99; if (b === 3 && n > 5) n = 99; }
    const rhs = n > 0 ? String(b ** n) : `\\dfrac{1}{${b ** -n}}`;
    const ex = `${m === 1 ? '' : m === -1 ? '-' : m}x${c === 0 ? '' : ` ${sgn(c)}`}`;
    return {
      kind: 'values', prompt: `حل المعادلة $${b}^{${ex}} = ${rhs}$.`, answer: [R(x)],
      hint: `اكتب الطرف الأيمن قوة للعدد ${b}، ثم ساوِ الأسس.`,
      solution: [`$${rhs} = ${b}^{${n}}$`, `$${ex} = ${n}$`, `$x = ${x}$`],
    };
  },
  () => {
    const [p, q, base, A, B] = pick([[2, 3, 2, 4, 8], [3, 2, 3, 27, 9], [2, 3, 5, 25, 125], [3, 2, 2, 8, 4], [2, 1, 3, 9, 3], [1, 2, 2, 2, 4]] as const);
    const c = nz(-3, 3);
    // A^x = B^(x + c) ← p x = q (x + c) ← x = qc/(p − q)
    const x = (q * c) / (p - q);
    return {
      kind: 'values', prompt: `حل المعادلة $${A}^{x} = ${B}^{x ${sgn(c)}}$.`, answer: [R(x)],
      hint: `اكتب ${A} و ${B} قوتين للأساس نفسه ${base}.`,
      solution: [`$${base}^{${p}x} = ${base}^{${q}(x ${sgn(c)})}$`, `$${p}x = ${q}x ${sgn(q * c)}$`, `$${p - q}x = ${q * c}$ ← $x = ${frac(q * c, p - q)}$`],
    };
  },
  () => {
    const P = pick([1000, 2000, 5000, 8000, 10000]), r = pick([3, 4, 5, 6, 8]), t = rnd(2, 15);
    const [nAr, n] = pick([['سنويًا', 1], ['كل نصف سنة', 2], ['كل ربع سنة', 4], ['شهريًا', 12]] as const);
    const A = P * (1 + r / 100 / n) ** (n * t);
    return {
      kind: 'values', tol: T2, prompt: `أُودع مبلغ ${P} ريال بفائدة سنوية ${r}% تُركّب ${nAr}. كم يصبح المبلغ بعد ${t} سنوات؟ قرّب إلى منزلتين عشريتين، واكتبه بلا فواصل.`, answer: [R(r2(A))],
      hint: 'A = P(1 + r/n)^(nt)، والمعدل r عدد عشري: 5% = 0.05.',
      solution: [`$A = ${P}\\left(1 + \\dfrac{${r / 100}}{${n}}\\right)^{${n}\\cdot ${t}}$`, `$A \\approx ${money(A)}$ ريال`],
      placeholder: 'مثال: 12345.67',
    };
  },
  () => {
    const P = pick([1000, 2500, 4000, 6000, 10000]), r = pick([2, 3, 4, 5, 6, 7]), t = rnd(3, 20);
    const A = P * Math.exp((r / 100) * t);
    return {
      kind: 'values', tol: T2, prompt: `أُودع ${P} ريال بفائدة ${r}% تُركّب تركيبًا مستمرًا. كم يصبح المبلغ بعد ${t} سنة؟ قرّب إلى منزلتين.`, answer: [R(r2(A))],
      hint: 'التركيب المستمر: A = Pe^(rt).',
      solution: [`$A = ${P}e^{${r / 100}\\cdot ${t}} = ${P}e^{${r2((r / 100) * t, 4)}}$`, `$A \\approx ${money(A)}$ ريال`],
      placeholder: 'مثال: 1234.56',
    };
  },
  () => {
    const b = pick([2, 3, 4, 5]), h = rnd(-4, 4), k = nz(-5, 5);
    const ex = h === 0 ? 'x' : `x ${sgn(-h)}`;
    const right = `$y = ${k}$`;
    return choice(`ما خط التقارب الأفقي لمنحنى $f(x) = ${b}^{${ex}} ${sgn(k)}$؟`, right,
      ['$y = 0$', `$y = ${-k}$`, `$x = ${h}$`],
      'الدالة bˣ تقترب من 0 عندما x → −∞، والإزاحة الرأسية تنقل خط التقارب.',
      [`$${b}^{${ex}} \\to 0$ عندما $x \\to -\\infty$، فإن $f(x) \\to ${k}$.`, `خط التقارب ${right}، والإزاحة الأفقية لا تؤثر فيه.`]);
  },
  () => {
    const right = pick(['$f(x) = \\left(\\tfrac{2}{3}\\right)^x$', '$f(x) = 0.8^x$', '$f(x) = 3^{-x}$', '$f(x) = e^{-x}$']);
    return choice('أي الدوال الآتية تمثل اضمحلالًا أسيًا (متناقصة)؟', right,
      ['$f(x) = \\left(\\tfrac{3}{2}\\right)^x$', '$f(x) = e^x$', '$f(x) = 1.05^x$', '$f(x) = 2^{x} - 3$'],
      'bˣ متناقصة عندما 0 < b < 1. وانتبه: b^(−x) = (1/b)^x.',
      [`${right}: أساسها الفعلي بين 0 و 1.`, 'أما الأخرى فأساسها أكبر من 1 فهي متزايدة.']);
  },
];

// ================= 4.3 =================
const s43: Gen[] = [
  () => {
    const b = pick([2, 3, 4, 5, 10]), n = rnd(-2, 3);
    const v = n >= 0 ? String(b ** n) : `\\tfrac{1}{${b ** -n}}`;
    const right = `$${b}^{${n}} = ${v}$`;
    return choice(`أي صيغة أسية تكافئ $\\log_{${b}} ${v} = ${n}$؟`, right,
      [`$${n}^{${b}} = ${v}$`, `$${v}^{${n}} = ${b}$`, `$${b}^{${v}} = ${n}$`],
      'log_b x = y تعني b^y = x: الأساس يبقى أساسًا، واللوغاريتم هو الأس.',
      [`الأساس $${b}$، والأس $${n}$، والناتج $${v}$: ${right}.`]);
  },
  () => {
    const opts: [string, number, string][] = [];
    for (const b of [2, 3, 4, 5]) for (const n of [-3, -2, -1, 2, 3, 4, 5]) if (b ** Math.abs(n) <= 256)
      opts.push([`\\log_{${b}} ${n > 0 ? b ** n : `\\tfrac{1}{${b ** -n}}`}`, n, `$${b}^{${n}} = ${n > 0 ? b ** n : `\\tfrac{1}{${b ** -n}}`}$`]);
    for (const n of [-3, -2, 2, 3, 4]) opts.push([`\\log ${n > 0 ? 10 ** n : `0.${'0'.repeat(-n - 1)}1`}`, n, `$10^{${n}}$`]);
    for (const b of [2, 3, 5, 7]) opts.push([`\\log_{${b}} \\sqrt{${b}}`, 0.5, `$\\sqrt{${b}} = ${b}^{1/2}$`]);
    for (const n of [-2, 3, 5]) opts.push([`\\ln e^{${n}}`, n, '$\\ln e^x = x$']);
    opts.push(['\\log_{7} 1', 0, '$7^0 = 1$'], ['\\log_{9} 3', 0.5, '$9^{1/2} = 3$'], ['\\log_{8} 2', 1 / 3, '$8^{1/3} = 2$'], ['\\log_{4} 8', 1.5, '$4^{3/2} = 8$']);
    const [e, v, why] = pick(opts);
    return {
      kind: 'values', prompt: `احسب بدون آلة حاسبة: $${e}$`, answer: [R(v)],
      hint: 'اسأل: الأساس مرفوعًا لأي أس يعطي هذا العدد؟',
      solution: [`${why}`, `إذن $${e} = ${Number.isInteger(v) ? v : v === 1 / 3 ? '\\tfrac{1}{3}' : v === 1.5 ? '\\tfrac{3}{2}' : '\\tfrac{1}{2}'}$`],
    };
  },
  () => {
    const b = pick([2, 3, 4, 5]), n = rnd(-2, 4), p = rnd(-5, 5);
    const x = b ** n - p;
    return {
      kind: 'values', prompt: `حل $\\log_{${b}}(x ${p === 0 ? '' : sgn(p)}) = ${n}$.`, answer: [R(x)],
      hint: 'حوّل إلى الصيغة الأسية.',
      solution: [`$x ${p === 0 ? '' : sgn(p)} = ${b}^{${n}} = ${n >= 0 ? b ** n : frac(1, b ** -n)}$`, `$x = ${frac(b ** n * (n < 0 ? b ** -n : 1) - p * (n < 0 ? b ** -n : 1), n < 0 ? b ** -n : 1)}$`],
    };
  },
  () => {
    const a = rnd(2, 5), c = rnd(2, 4);
    const kind = pick(['ln', 'log']);
    const L = kind === 'ln' ? '\\ln' : '\\log';
    const P = kind;
    const sq = Math.random() < 0.5;
    const yT = sq ? '\\sqrt{y}' : 'y';
    const yC = sq ? '\\tfrac{1}{2}' : '';
    const yP = sq ? '(1/2)' : '';
    return {
      kind: 'expr', prompt: `استخدم خصائص اللوغاريتمات لفك العبارة إلى مجموع وفرق لوغاريتمات (كل المتغيرات موجبة): $${L}\\left(\\dfrac{x^{${a}}${yT}}{z^{${c}}}\\right)$`,
      answer: `${a}${P}(x) + ${yP}${P}(y) - ${c}${P}(z)`, vars: ['x', 'y', 'z'], positive: true, require: ['logsExpanded'],
      hint: 'لوغاريتم الضرب = مجموع، والقسمة = فرق، والأس ينزل معاملًا.',
      solution: [`$= ${L} x^{${a}} + ${L} ${yT} - ${L} z^{${c}}$`, `$= ${a}${L} x + ${yC}${L} y - ${c}${L} z$`],
      placeholder: `مثال: 2${P}(x) + ${P}(y) - 3${P}(z)`,
    };
  },
  () => {
    const a = rnd(2, 4), c = rnd(2, 5), b = pick([2, 3, 5]);
    return {
      kind: 'expr', prompt: `اكتب العبارة لوغاريتمًا واحدًا (كل المتغيرات موجبة): $${a}\\log_{${b}} x + \\log_{${b}} y - ${c}\\log_{${b}} z$`,
      answer: `log_${b}(x^${a}*y/z^${c})`, vars: ['x', 'y', 'z'], positive: true, require: ['logsCondensed'],
      hint: 'أدخل المعاملات أسسًا أولًا، ثم حوّل الجمع إلى ضرب والطرح إلى قسمة.',
      solution: [`$= \\log_{${b}} x^{${a}} + \\log_{${b}} y - \\log_{${b}} z^{${c}}$`, `$= \\log_{${b}}\\left(\\dfrac{x^{${a}}y}{z^{${c}}}\\right)$`],
      placeholder: `مثال: log_${b}(x^2*y/z^3)`,
    };
  },
  () => {
    const a = nz(-4, 4), b = nz(-8, 8);
    const bound = frac(-b, a);
    const right = a > 0 ? `$\\left(${bound}, \\infty\\right)$` : `$\\left(-\\infty, ${bound}\\right)$`;
    return choice(`ما مجال الدالة $f(x) = \\log(${a === 1 ? '' : a === -1 ? '-' : a}x ${sgn(b)})$؟`, right,
      [a > 0 ? `$\\left(-\\infty, ${bound}\\right)$` : `$\\left(${bound}, \\infty\\right)$`, a > 0 ? `$\\left[${bound}, \\infty\\right)$` : `$\\left(-\\infty, ${bound}\\right]$`, '$(0, \\infty)$'],
      'ما داخل اللوغاريتم يجب أن يكون موجبًا تمامًا (> 0).',
      [`$${a}x ${sgn(b)} > 0$`, `${a < 0 ? 'نقسم على سالب فتنقلب المتباينة: ' : ''}$x ${a > 0 ? '>' : '<'} ${bound}$`, `المجال ${right}.`]);
  },
];

// ================= 4.4 =================
const s44: Gen[] = [
  () => {
    const b = pick([2, 3, 5, 6, 7, 8]), x = pick([3, 5, 7, 10, 12, 20, 30, 45, 50, 100]);
    if (Math.log(x) / Math.log(b) % 1 === 0) return s44[0]();
    const v = Math.log(x) / Math.log(b);
    return {
      kind: 'values', tol: T3, prompt: `استخدم قانون تغيير الأساس لحساب $\\log_{${b}} ${x}$ مقرّبًا إلى ثلاث منازل عشرية.`, answer: [R(r2(v, 3))],
      hint: 'log_b x = ln x / ln b (أو log x / log b).',
      solution: [`$\\log_{${b}} ${x} = \\dfrac{\\ln ${x}}{\\ln ${b}} = \\dfrac{${r2(Math.log(x), 4)}}{${r2(Math.log(b), 4)}}$`, `$\\approx ${r2(v, 3)}$`],
      placeholder: 'مثال: 2.322',
    };
  },
  () => {
    const b = pick([3, 5, 6, 7]), x = pick([10, 11, 12, 15, 17, 40]);
    const right = `$\\dfrac{\\ln ${x}}{\\ln ${b}}$`;
    return choice(`أي عبارة تساوي $\\log_{${b}} ${x}$؟`, right,
      [`$\\dfrac{\\ln ${b}}{\\ln ${x}}$`, `$\\ln ${x} - \\ln ${b}$`, `$\\ln\\left(\\dfrac{${x}}{${b}}\\right)$`],
      'تغيير الأساس: لوغاريتم العدد في البسط، ولوغاريتم الأساس في المقام.',
      [`$\\log_{${b}} ${x} = \\dfrac{\\log_a ${x}}{\\log_a ${b}}$ لأي أساس $a$، ومنه ${right}.`, `أما $\\ln ${x} - \\ln ${b}$ فتساوي $\\ln\\tfrac{${x}}{${b}}$، وهي شيء آخر.`]);
  },
  () => {
    const b = pick([2, 3]), x = rnd(5, 200);
    const n = Math.floor(Math.log(x) / Math.log(b) + 1e-9);
    if (b ** n === x) return s44[2]();
    const right = `بين $${n}$ و $${n + 1}$`;
    return choice(`بدون آلة حاسبة: أين تقع قيمة $\\log_{${b}} ${x}$؟`, right,
      [`بين $${n - 1}$ و $${n}$`, `بين $${n + 1}$ و $${n + 2}$`, `بين $${Math.floor(x / 10)}$ و $${Math.floor(x / 10) + 1}$`],
      `ابحث عن قوتين متتاليتين للعدد ${b} يقع ${x} بينهما.`,
      [`$${b}^{${n}} = ${b ** n} < ${x} < ${b ** (n + 1)} = ${b}^{${n + 1}}$`, `إذن ${right}.`]);
  },
  () => {
    const m = pick([1.5, 2, 2.5, 3.2, 4, 5, 6.3, 7.9, 8]), n = rnd(2, 12);
    const pH = -Math.log10(m * 10 ** -n);
    return {
      kind: 'values', tol: T2, prompt: `تركيز أيونات الهيدروجين في محلول هو $[\\text{H}^+] = ${m} \\times 10^{-${n}}$ مول/لتر. أوجد الـ pH مقرّبًا إلى منزلتين (${'$\\text{pH} = -\\log[\\text{H}^+]$'}).`,
      answer: [R(r2(pH))],
      hint: 'log(m × 10^(−n)) = log m − n.',
      solution: [`$\\text{pH} = -\\log(${m} \\times 10^{-${n}}) = -(\\log ${m} - ${n})$`, `$= ${n} - ${r2(Math.log10(m), 4)} \\approx ${r2(pH)}$`],
      placeholder: 'مثال: 4.52',
    };
  },
  () => {
    const M1 = rnd(4, 8), d = rnd(1, 3);
    return {
      kind: 'values', prompt: `مقياس ريختر لوغاريتمي: $M = \\log\\dfrac{A}{A_0}$. كم مرة تبلغ شدة (سعة) زلزال قوته ${M1 + d} مقارنة بزلزال قوته ${M1}؟`, answer: [R(10 ** d)],
      hint: 'زيادة درجة واحدة تعني ضرب السعة في 10.',
      solution: [`$\\dfrac{A_1}{A_2} = \\dfrac{10^{${M1 + d}}A_0}{10^{${M1}}A_0} = 10^{${d}}$`, `$= ${10 ** d}$ مرة.`],
    };
  },
  () => {
    const x = pick([2, 3, 5, 7, 20, 50, 0.5]);
    const ln = Math.log(x);
    return {
      kind: 'values', tol: T3, prompt: `احسب $\\ln ${x}$ مقرّبًا إلى ثلاث منازل عشرية، ثم تحقق بأن $e$ مرفوعًا إلى الناتج يعطي تقريبًا ${x}.`, answer: [R(r2(ln, 3))],
      hint: 'ln هو اللوغاريتم للأساس e ≈ 2.71828، وزره في الآلة الحاسبة ln.',
      solution: [`$\\ln ${x} \\approx ${r2(ln, 3)}$`, `تحقق: $e^{${r2(ln, 3)}} \\approx ${r2(Math.exp(r2(ln, 3)), 3)}$`],
      placeholder: 'مثال: 1.609',
    };
  },
];

// ================= 4.5 =================
const s45: Gen[] = [
  () => {
    const a = rnd(1, 5), b = pick([2, 3, 5, 7, 1.5]), c = rnd(a + 3, 60);
    const x = Math.log(c / a) / Math.log(b);
    const iso = a === 1 ? `${c}` : `\\dfrac{${c}}{${a}}`;
    return {
      kind: 'values', tol: T3, prompt: `حل $${a === 1 ? '' : a + '\\cdot '}${b}^{x} = ${c}$، وقرّب إلى ثلاث منازل (يمكنك كتابة الإجابة الدقيقة مثل ln(5)/ln(3) أيضًا).`,
      answer: [R(x)],
      hint: 'اعزل الحد الأسي، ثم خذ ln للطرفين وأنزل الأس.',
      solution: [`$${b}^x = ${iso}$`, `$x\\ln ${b} = \\ln ${a === 1 ? c : `\\tfrac{${c}}{${a}}`}$`, `$x = \\dfrac{\\ln ${a === 1 ? c : `(${c}/${a})`}}{\\ln ${b}} \\approx ${r2(x, 3)}$`],
      placeholder: 'مثال: 1.465',
    };
  },
  () => {
    const k = pick([2, 3, 4, 0.5, -2]), c = pick([5, 7, 10, 12, 20, 0.4]), p = rnd(0, 6);
    const x = Math.log(c) / k;
    return {
      kind: 'values', tol: T3, prompt: `حل $e^{${k}x}${p ? ` + ${p}` : ''} = ${c + p}$ مقرّبًا إلى ثلاث منازل.`, answer: [R(x)],
      hint: 'اعزل e^(kx) ثم خذ ln للطرفين: ln(e^u) = u.',
      solution: [...(p ? [`$e^{${k}x} = ${c}$`] : []), `$${k}x = \\ln ${c}$`, `$x = \\dfrac{\\ln ${c}}{${k}} \\approx ${r2(x, 3)}$`],
      placeholder: 'مثال: 0.805',
    };
  },
  () => {
    const [b, n, r, d] = pick([[2, 3, 2, 2], [2, 4, 2, 6], [2, 5, 4, 4], [6, 1, 2, 1], [2, 2, 1, 3], [10, 1, 2, 3], [3, 2, 1, 8], [2, 3, 1, 7], [2, 4, 1, 15], [10, 2, 5, 15]] as const);
    const L = b === 10 ? '\\log' : `\\log_{${b}}`;
    return {
      kind: 'values', prompt: `حل المعادلة $${L} x + ${L}(x + ${d}) = ${n}$.`, answer: [R(r)],
      hint: 'اجمع اللوغاريتمين في واحد، حوّل إلى الصيغة الأسية، ثم تحقق من الحلول في المعادلة الأصلية.',
      solution: [`$${L}\\big(x(x + ${d})\\big) = ${n}$ ← $x^2 + ${d}x = ${b ** n}$`, `$x^2 + ${d}x - ${b ** n} = 0$ ← $(x - ${r})(x + ${r + d}) = 0$`, `$x = ${r}$ أو $x = ${-(r + d)}$`, `نرفض $x = ${-(r + d)}$ لأن $${L}(${-(r + d)})$ غير معرّف. الحل $x = ${r}$.`],
    };
  },
  () => {
    const c = pick([2, 3, 4, 5]);
    const d = (c - 1) * rnd(1, 4);
    const x = (c * d) / (c - 1);
    return {
      kind: 'values', prompt: `حل $\\ln x - \\ln(x - ${d}) = \\ln ${c}$.`, answer: [R(x)],
      hint: 'الفرق بين لوغاريتمين = لوغاريتم القسمة. ثم ساوِ ما داخل اللوغاريتمين.',
      solution: [`$\\ln\\dfrac{x}{x - ${d}} = \\ln ${c}$ ← $\\dfrac{x}{x - ${d}} = ${c}$`, `$x = ${c}x - ${c * d}$ ← $${c - 1}x = ${c * d}$ ← $x = ${x}$`, `تحقق: $${x} > ${d}$ فكلا اللوغاريتمين معرّف.`],
    };
  },
  () => {
    const b = pick([2, 3, 5]), n = rnd(1, 3), m = rnd(1, 3);
    // b^(2x) − (b^n + b^m) b^x + b^(n+m) = 0 ← b^x = b^n أو b^m
    if (n === m) return s45[4]();
    const s = b ** n + b ** m, p = b ** (n + m);
    return {
      kind: 'values', prompt: `حل $${b}^{2x} - ${s}\\cdot ${b}^{x} + ${p} = 0$. (افصل الحلول بفاصلة)`, answer: [R(n), R(m)],
      hint: `المعادلة تربيعية في u = ${b}^x.`,
      solution: [`ضع $u = ${b}^x$: $u^2 - ${s}u + ${p} = 0$`, `$(u - ${b ** n})(u - ${b ** m}) = 0$`, `$${b}^x = ${b ** n}$ ← $x = ${n}$، أو $${b}^x = ${b ** m}$ ← $x = ${m}$`],
      placeholder: 'مثال: 1, 2',
    };
  },
  () => {
    const c = nz(-9, -1);
    const right = 'لا يوجد حل';
    return choice(`ما حل المعادلة $3^{x} = ${c}$؟`, right,
      [`$x = \\log_3 ${-c}$`, `$x = -\\log_3 ${-c}$`, `$x = \\dfrac{${c}}{3}$`],
      'ما مدى الدالة 3ˣ؟',
      ['$3^x > 0$ لكل $x$، فلا يمكن أن تساوي عددًا سالبًا.', 'ولو أخذنا اللوغاريتم لظهر $\\log_3$ لعدد سالب، وهو غير معرّف.']);
  },
];

// ================= 4.6 =================
const s46: Gen[] = [
  () => {
    const A0 = pick([500, 1000, 2000, 5000]), k = pick([0.02, 0.03, 0.05, 0.08, 0.12]), t = rnd(3, 25);
    const A = A0 * Math.exp(k * t);
    return {
      kind: 'values', tol: 0.51, prompt: `مجتمع بكتيري يتبع النموذج $P(t) = ${A0}e^{${k}t}$ حيث $t$ بالساعات. كم يكون عدده بعد ${t} ساعة؟ قرّب إلى أقرب عدد صحيح.`, answer: [R(Math.round(A))],
      hint: 'عوّض قيمة t مباشرة.',
      solution: [`$P(${t}) = ${A0}e^{${k}\\cdot${t}} = ${A0}e^{${r2(k * t, 3)}}$`, `$\\approx ${Math.round(A)}$`],
    };
  },
  () => {
    const T = pick([5, 8, 10, 12, 20, 25, 35]);
    const k = Math.log(2) / T;
    return {
      kind: 'values', tol: 0.00006, prompt: `كمية تنمو أسيًا وفق $A = A_0e^{kt}$ وتتضاعف كل ${T} سنوات. أوجد $k$ مقرّبًا إلى أربع منازل عشرية.`, answer: [R(r2(k, 4))],
      hint: 'عند t = T يكون A = 2A₀.',
      solution: [`$2A_0 = A_0e^{${T}k}$ ← $2 = e^{${T}k}$`, `$${T}k = \\ln 2$ ← $k = \\dfrac{\\ln 2}{${T}} \\approx ${r2(k, 4)}$`],
      placeholder: 'مثال: 0.0693',
    };
  },
  () => {
    const A0 = pick([16, 32, 64, 80, 160, 320, 800]), T = pick([5, 8, 12, 30, 1600]), m = rnd(1, 4);
    const A = A0 / 2 ** m;
    return {
      kind: 'values', prompt: `مادة مشعة عمر النصف لها ${T} سنة. بدأنا بـ ${A0} غرامًا. كم يبقى بعد ${T * m} سنة؟`, answer: [R(A)],
      hint: `${T * m} سنة تساوي ${m} من أعمار النصف.`,
      solution: [`$\\dfrac{${T * m}}{${T}} = ${m}$ أعمار نصف.`, `$A = ${A0}\\left(\\tfrac{1}{2}\\right)^{${m}} = ${A}$ غرامًا.`],
    };
  },
  () => {
    const A0 = pick([100, 200, 500, 1000]), k = pick([0.04, 0.05, 0.07, 0.1, 0.15]), f = pick([3, 5, 10]);
    const t = Math.log(f) / k;
    return {
      kind: 'values', tol: T2, prompt: `مجتمع يتبع $P(t) = ${A0}e^{${k}t}$. بعد كم سنة يصبح ${A0 * f}؟ قرّب إلى منزلتين.`, answer: [R(r2(t))],
      hint: 'اقسم على الكمية الابتدائية، ثم خذ ln.',
      solution: [`$${A0 * f} = ${A0}e^{${k}t}$ ← $e^{${k}t} = ${f}$`, `$${k}t = \\ln ${f}$ ← $t = \\dfrac{\\ln ${f}}{${k}} \\approx ${r2(t)}$ سنة.`],
      placeholder: 'مثال: 23.03',
    };
  },
  () => {
    const p = pick([10, 20, 25, 40, 60, 75, 80]);
    const k = Math.log(0.5) / 5730;
    const t = Math.log(p / 100) / k;
    return {
      kind: 'values', tol: 1.01, prompt: `عمر النصف للكربون 14 هو 5730 سنة. عظمة متحجرة بقي فيها ${p}% من الكربون 14 الأصلي. قدّر عمرها إلى أقرب سنة.`, answer: [R(Math.round(t))],
      hint: 'أوجد k من عمر النصف، ثم حل e^(kt) = النسبة الباقية.',
      solution: [`$k = \\dfrac{\\ln 0.5}{5730} \\approx ${r2(k, 7)}$`, `$e^{kt} = ${p / 100}$ ← $t = \\dfrac{\\ln ${p / 100}}{k}$`, `$t \\approx ${Math.round(t)}$ سنة.`],
      placeholder: 'مثال: 11460',
    };
  },
  () => {
    const k = pick([-0.3, -0.12, -0.05, 0.02, 0.09, 0.25]);
    const right = k > 0 ? `نمو، وزمن التضاعف $\\dfrac{\\ln 2}{${k}}$` : `اضمحلال، وعمر النصف $\\dfrac{\\ln 2}{${-k}}$`;
    return choice(`النموذج $A(t) = 50e^{${k}t}$ يمثل:`, right,
      [k > 0 ? `اضمحلال، وعمر النصف $\\dfrac{\\ln 2}{${k}}$` : `نمو، وزمن التضاعف $\\dfrac{\\ln 2}{${-k}}$`, k > 0 ? `نمو، وزمن التضاعف $\\dfrac{${k}}{\\ln 2}$` : `اضمحلال، وعمر النصف $\\dfrac{${-k}}{\\ln 2}$`, k > 0 ? `نمو، وزمن التضاعف $\\dfrac{50}{${k}}$` : `اضمحلال، وعمر النصف $\\dfrac{25}{${-k}}$`],
      'إشارة k تحدد النوع، والزمن المميز ln 2 / |k|.',
      [`$k ${k > 0 ? '> 0' : '< 0'}$ ← ${k > 0 ? 'نمو' : 'اضمحلال'}.`, `$e^{${k}T} = ${k > 0 ? 2 : '\\tfrac{1}{2}'}$ ← $T = \\dfrac{\\ln 2}{${Math.abs(k)}}$`]);
  },
];

export const ch4: Record<string, Gen[]> = { '4.1': s41, '4.2': s42, '4.3': s43, '4.4': s44, '4.5': s45, '4.6': s46 };
