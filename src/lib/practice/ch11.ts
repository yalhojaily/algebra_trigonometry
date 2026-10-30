// مولّدات تمارين الفصل 11: موضوعات إضافية في الجبر
import { rnd, nz, pick, R, frac, choice, type Problem } from '../gen';

type Gen = () => Problem;
const fact = (k: number): number => (k <= 1 ? 1 : k * fact(k - 1));
const C = (n: number, k: number) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
const P = (n: number, r: number) => fact(n) / fact(n - r);
const r2 = (v: number, d = 2) => +v.toFixed(d);
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

// ================= 11.1 =================
const s111: Gen[] = [
  () => {
    const f = pick([
      { t: (n: number) => `${n}^2 + 1`, tex: 'n^2 + 1', v: (n: number) => n * n + 1 },
      { t: () => '', tex: '\\dfrac{n + 1}{n}', v: (n: number) => (n + 1) / n },
      { t: () => '', tex: '(-1)^n \\cdot 2n', v: (n: number) => (n % 2 ? -1 : 1) * 2 * n },
      { t: () => '', tex: '3n - 5', v: (n: number) => 3 * n - 5 },
      { t: () => '', tex: '\\dfrac{2^n}{n}', v: (n: number) => 2 ** n / n },
    ]);
    const n = rnd(1, 8);
    return {
      kind: 'values', prompt: `أوجد الحد $a_{${n}}$ للمتتابعة $a_n = ${f.tex}$.`, answer: [R(f.v(n))],
      hint: 'عوّض قيمة n في الصيغة.',
      solution: [`$a_{${n}} = ${f.tex.replace(/n/g, `(${n})`)}$`, `$= ${Number.isInteger(f.v(n)) ? f.v(n) : r2(f.v(n), 4)}$`],
    };
  },
  () => {
    let a1 = rnd(1, 5), c = nz(-3, 3), m = pick([1, 2, 3]);
    if (a1 * (m - 1) + c === 0) a1++;
    // aₙ = m·aₙ₋₁ + c
    const a = [a1];
    for (let i = 1; i < 5; i++) a.push(m * a[i - 1] + c);
    return {
      kind: 'values', prompt: `متتابعة معرّفة تراجعيًا: $a_1 = ${a1}$ و $a_n = ${m === 1 ? '' : m}a_{n-1} ${c < 0 ? '-' : '+'} ${Math.abs(c)}$ لـ $n \\ge 2$. أوجد $a_5$.`, answer: [R(a[4])],
      hint: 'احسب الحدود واحدًا تلو الآخر.',
      solution: [`$a_1, a_2, a_3, a_4, a_5 = ${a.join(',\\ ')}$`],
    };
  },
  () => {
    const kind = pick(['sq', 'lin', 'cube'] as const);
    const lo = rnd(1, 3), hi = lo + rnd(2, 4);
    const term = { sq: (i: number) => i * i, lin: (i: number) => 3 * i - 1, cube: (i: number) => i ** 3 }[kind];
    const tx = { sq: 'i^2', lin: '(3i - 1)', cube: 'i^3' }[kind];
    const vals = Array.from({ length: hi - lo + 1 }, (_, k) => term(lo + k));
    return {
      kind: 'values', prompt: `احسب $\\displaystyle\\sum_{i=${lo}}^{${hi}} ${tx}$`, answer: [R(vals.reduce((s, x) => s + x, 0))],
      hint: 'عوّض كل قيمة لـ i من البداية إلى النهاية واجمع.',
      solution: [`$= ${vals.join(' + ')}$`, `$= ${vals.reduce((s, x) => s + x, 0)}$`],
    };
  },
  () => {
    const n = rnd(5, 30), c = nz(2, 9);
    const sumI = (n * (n + 1)) / 2, sumI2 = (n * (n + 1) * (2 * n + 1)) / 6;
    const kind = pick(['c', 'i', 'i2'] as const);
    const ans = kind === 'c' ? c * n : kind === 'i' ? c * sumI : sumI2;
    const tx = kind === 'c' ? `${c}` : kind === 'i' ? `${c}i` : 'i^2';
    return {
      kind: 'values', prompt: `استخدم قواعد المجموع: $\\displaystyle\\sum_{i=1}^{${n}} ${tx}$`, answer: [R(ans)],
      hint: '∑c = nc ، ∑i = n(n+1)/2 ، ∑i² = n(n+1)(2n+1)/6.',
      solution: [kind === 'c' ? `$= ${n}\\cdot ${c} = ${ans}$` : kind === 'i' ? `$= ${c}\\cdot\\dfrac{${n}(${n + 1})}{2} = ${ans}$` : `$= \\dfrac{${n}(${n + 1})(${2 * n + 1})}{6} = ${ans}$`],
    };
  },
];

// ================= 11.2 =================
const s112: Gen[] = [
  () => {
    const a1 = rnd(-10, 10), d = nz(-6, 6), n = rnd(10, 40);
    return {
      kind: 'values', prompt: `متتابعة حسابية حدها الأول $${a1}$ وأساسها $${d}$. أوجد الحد $a_{${n}}$.`, answer: [R(a1 + (n - 1) * d)],
      hint: 'aₙ = a₁ + (n − 1)d.',
      solution: [`$a_{${n}} = ${a1} + (${n} - 1)(${d})$`, `$= ${a1 + (n - 1) * d}$`],
    };
  },
  () => {
    const a1 = rnd(-10, 10), d = nz(-6, 6), i = rnd(3, 6), j = i + rnd(3, 8);
    const ai = a1 + (i - 1) * d, aj = a1 + (j - 1) * d;
    return {
      kind: 'values', ordered: true, prompt: `في متتابعة حسابية $a_{${i}} = ${ai}$ و $a_{${j}} = ${aj}$. أوجد الحد الأول والأساس. (اكتب: a₁، d)`, answer: [R(a1), R(d)],
      hint: 'الفرق بين الحدين = (j − i) × d.',
      solution: [`$${aj} - (${ai}) = ${j - i}d$ ← $d = ${d}$`, `$a_1 = ${ai} - ${i - 1}(${d}) = ${a1}$`],
      placeholder: 'مثال: 3, -2',
    };
  },
  () => {
    const a1 = rnd(-10, 20), d = nz(-5, 8), n = rnd(10, 50);
    const an = a1 + (n - 1) * d;
    return {
      kind: 'values', prompt: `أوجد مجموع أول ${n} حدًا من المتتابعة الحسابية: $${a1}, ${a1 + d}, ${a1 + 2 * d}, \\dots$`, answer: [R((n * (a1 + an)) / 2)],
      hint: 'Sₙ = n(a₁ + aₙ)/2 ، أو Sₙ = (n/2)[2a₁ + (n − 1)d].',
      solution: [`$a_{${n}} = ${a1} + ${n - 1}(${d}) = ${an}$`, `$S_{${n}} = \\dfrac{${n}(${a1} ${an < 0 ? '-' : '+'} ${Math.abs(an)})}{2} = ${(n * (a1 + an)) / 2}$`],
    };
  },
  () => {
    const a = rnd(1, 9), d = rnd(1, 9), lo = 1, hi = rnd(10, 60);
    const first = a + d * lo, last = a + d * hi;
    return {
      kind: 'values', prompt: `احسب $\\displaystyle\\sum_{i=1}^{${hi}} (${d}i + ${a})$`, answer: [R((hi * (first + last)) / 2)],
      hint: 'هذه متسلسلة حسابية: احسب الحد الأول والأخير.',
      solution: [`الحد الأول $${first}$ والأخير $${last}$`, `$S = \\dfrac{${hi}(${first} + ${last})}{2} = ${(hi * (first + last)) / 2}$`],
    };
  },
];

// ================= 11.3 =================
const s113: Gen[] = [
  () => {
    const a1 = nz(-5, 5), r = pick([2, 3, -2, -3, 0.5]), n = rnd(4, 8);
    const an = a1 * r ** (n - 1);
    return {
      kind: 'values', prompt: `متتابعة هندسية حدها الأول $${a1}$ ونسبتها $${r}$. أوجد $a_{${n}}$.`, answer: [R(an)],
      hint: 'aₙ = a₁ rⁿ⁻¹.',
      solution: [`$a_{${n}} = ${a1}(${r})^{${n - 1}}$`, `$= ${r2(an, 6)}$`],
    };
  },
  () => {
    const a1 = rnd(1, 6), r = pick([2, 3, -2]), n = rnd(4, 9);
    const S = (a1 * (1 - r ** n)) / (1 - r);
    return {
      kind: 'values', prompt: `أوجد مجموع أول ${n} حدود من المتتابعة الهندسية $${a1}, ${a1 * r}, ${a1 * r * r}, \\dots$`, answer: [R(S)],
      hint: 'Sₙ = a₁(1 − rⁿ)/(1 − r).',
      solution: [`$r = ${r}$`, `$S_{${n}} = \\dfrac{${a1}(1 - (${r})^{${n}})}{1 - (${r})} = ${S}$`],
    };
  },
  () => {
    const a1 = rnd(1, 20), [p, q] = pick([[1, 2], [1, 3], [2, 3], [-1, 2], [1, 4], [3, 4], [-1, 3]] as const);
    const r = p / q;
    return {
      kind: 'values', prompt: `أوجد مجموع المتسلسلة الهندسية اللانهائية التي حدها الأول $${a1}$ ونسبتها $${frac(p, q)}$.`, answer: [R(a1 / (1 - r))],
      hint: 'إذا |r| < 1 فإن S = a₁ / (1 − r).',
      solution: [`$|r| = ${frac(Math.abs(p), q)} < 1$`, `$S = \\dfrac{${a1}}{1 - (${frac(p, q)})} = ${frac(a1 * q, q - p)}$`],
    };
  },
  () => {
    const r = pick([2, -2, 1.5, 3]);
    const right = 'ليس لها مجموع (متباعدة)';
    return choice(`ما مجموع المتسلسلة الهندسية اللانهائية التي حدها الأول 5 ونسبتها $${r}$؟`, right,
      [`$${r2(5 / (1 - r), 3)}$`, '$0$', '$5$'],
      'القانون S = a₁/(1 − r) يصح فقط إذا |r| < 1.',
      [`$|r| = ${Math.abs(r)} \\ge 1$، فالحدود لا تقترب من الصفر والمجاميع لا تستقر.`]);
  },
  () => {
    const R_ = pick([100, 200, 500, 1000]), i = pick([0.04, 0.05, 0.06, 0.08]), n = pick([5, 10, 15, 20]);
    const S = R_ * (((1 + i) ** n - 1) / i);
    return {
      kind: 'values', tol: 0.51, prompt: `دفعة دورية: يُودع ${R_} ريال في نهاية كل سنة بفائدة ${i * 100}% مركبة سنويًا. كم يصبح الرصيد بعد ${n} ${n <= 10 ? 'سنوات' : 'سنة'}؟ (لأقرب ريال)`, answer: [R(Math.round(S))],
      hint: 'S = R[(1 + i)ⁿ − 1]/i: مجموع متسلسلة هندسية نسبتها 1 + i.',
      solution: [`$S = ${R_}\\cdot\\dfrac{(1 + ${i})^{${n}} - 1}{${i}}$`, `$\\approx ${Math.round(S)}$ ريال`],
    };
  },
];

// ================= 11.4 =================
const s114: Gen[] = [
  () => {
    const n = rnd(5, 12), k = rnd(1, n - 1);
    return {
      kind: 'values', prompt: `احسب $\\dbinom{${n}}{${k}}$.`, answer: [R(C(n, k))],
      hint: 'n! / (k!(n − k)!).',
      solution: [`$\\dfrac{${n}!}{${k}!\\,${n - k}!} = ${C(n, k)}$`],
    };
  },
  () => {
    const n = rnd(4, 9), k = rnd(1, n - 1), a = pick([1, 2, 3]), b = pick([1, -1, 2, -2]);
    // (a x + b y)ⁿ: الحد رقم k + 1 معامله C(n,k) aⁿ⁻ᵏ bᵏ
    const coef = C(n, k) * a ** (n - k) * b ** k;
    return {
      kind: 'values', prompt: `ما معامل الحد $x^{${n - k}}y^{${k}}$ في مفكوك $(${a === 1 ? '' : a}x ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y)^{${n}}$؟`, answer: [R(coef)],
      hint: 'الحد العام: C(n, k)(الأول)ⁿ⁻ᵏ(الثاني)ᵏ.',
      solution: [`$\\dbinom{${n}}{${k}}(${a}x)^{${n - k}}(${b}y)^{${k}}$`, `المعامل $${C(n, k)}\\cdot ${a}^{${n - k}}\\cdot (${b})^{${k}} = ${coef}$`],
    };
  },
  () => {
    const n = rnd(3, 6), a = pick([1, 2]), b = pick([1, -1, 3, -2]);
    return {
      kind: 'expr', prompt: `انشر $(${a === 1 ? '' : a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)})^{${n}}$.`, answer: Array.from({ length: n + 1 }, (_, k) => `(${C(n, k) * a ** (n - k) * b ** k})*x^${n - k}`).join('+'), vars: ['x'], require: ['expanded'],
      hint: 'استخدم صف مثلث باسكال رقم n.',
      solution: [`المعاملات من مثلث باسكال: $${Array.from({ length: n + 1 }, (_, k) => C(n, k)).join(',\\ ')}$`, `الحد العام $\\dbinom{${n}}{k}(${a}x)^{${n} - k}(${b})^{k}$`],
      placeholder: 'مثال: x^3+6x^2+12x+8',
    };
  },
  () => {
    const n = rnd(3, 8);
    return {
      kind: 'values', prompt: `احسب $\\dfrac{${n + 2}!}{${n}!}$.`, answer: [R((n + 2) * (n + 1))],
      hint: `(${n + 2})! = (${n + 2})(${n + 1}) · ${n}!`,
      solution: [`$= \\dfrac{${n + 2}\\cdot ${n + 1}\\cdot ${n}!}{${n}!} = ${n + 2}\\cdot ${n + 1} = ${(n + 2) * (n + 1)}$`],
    };
  },
  () => {
    const n = rnd(4, 10);
    return {
      kind: 'values', prompt: `ما مجموع معاملات مفكوك $(x + y)^{${n}}$؟`, answer: [R(2 ** n)],
      hint: 'عوّض x = y = 1.',
      solution: [`$(1 + 1)^{${n}} = 2^{${n}} = ${2 ** n}$`],
    };
  },
];

// ================= 11.5 =================
const s115: Gen[] = [
  () => {
    const items: [string, string, string[]][] = [
      ['1 + 2 + \\cdots + n = \\dfrac{n(n+1)}{2}', 'نفترض صحتها عند n = k، ونضيف k + 1 للطرفين', ['نتحقق من n = 1 و n = 2 و n = 3 فقط', 'نفترض صحتها عند n = k + 1 ونثبتها عند n = k', 'نعوّض n = ∞']],
      ['2^n > n', 'نفترض 2ᵏ > k ونثبت 2ᵏ⁺¹ > k + 1', ['نتحقق من n = 10 فقط', 'نضرب الطرفين في n', 'نفترض 2ᵏ⁺¹ > k + 1']],
    ];
    const [st, right, wrong] = pick(items);
    return choice(`في خطوة الاستقراء لإثبات $${st}$ لكل عدد صحيح موجب n:`, right, wrong,
      'خطوة الاستقراء: من فرض صحة P(k) نستنتج صحة P(k + 1).',
      ['الاستقراء خطوتان: الأساس $P(1)$، ثم $P(k) \\Rightarrow P(k + 1)$.', `${right}.`]);
  },
  () => {
    const k = rnd(2, 9);
    // P(n): 1 + 3 + … + (2n − 1) = n²: الحد المضاف عند الانتقال من k إلى k + 1
    return {
      kind: 'values', prompt: `في إثبات $1 + 3 + 5 + \\cdots + (2n - 1) = n^2$ بالاستقراء، ما الحد الذي نضيفه للطرفين للانتقال من $n = ${k}$ إلى $n = ${k + 1}$؟`, answer: [R(2 * k + 1)],
      hint: 'الحد رقم k + 1 هو 2(k + 1) − 1.',
      solution: [`$2(${k + 1}) - 1 = ${2 * k + 1}$`, `وفعلًا $${k}^2 + ${2 * k + 1} = ${(k + 1) ** 2} = ${k + 1}^2$.`],
    };
  },
  () => {
    const right = '$n \\ge 5$';
    return choice('نريد إثبات $2^n > n^2$ بالاستقراء المعمم. من أي قيمة لـ n يجب أن يبدأ الإثبات لتصح العبارة لكل ما بعدها؟', right, ['$n \\ge 1$', '$n \\ge 3$', '$n \\ge 4$'],
      'جرّب القيم: 2¹ و 1، 2² و 4، 2³ و 9، 2⁴ و 16، 2⁵ و 25.',
      ['$2^4 = 16 = 4^2$ ليست أكبر، و $2^5 = 32 > 25$.', 'ومن $n = 5$ تصح بالاستقراء (مبدأ الاستقراء المعمم يبدأ من $n = 5$). ولاحظ أنها تصح أيضًا عند $n = 1$ لكنها تفشل عند 2 و 3 و 4.']);
  },
  () => {
    const n = rnd(3, 12);
    return {
      kind: 'values', prompt: `تحقق من صيغة $1^3 + 2^3 + \\cdots + n^3 = \\left(\\dfrac{n(n+1)}{2}\\right)^2$ عند $n = ${n}$: ما قيمة الطرفين؟`, answer: [R(((n * (n + 1)) / 2) ** 2)],
      hint: 'احسب الطرف الأيمن مباشرة.',
      solution: [`$\\left(\\dfrac{${n}\\cdot ${n + 1}}{2}\\right)^2 = ${(n * (n + 1)) / 2}^2 = ${((n * (n + 1)) / 2) ** 2}$`],
    };
  },
];

// ================= 11.6 =================
const s116: Gen[] = [
  () => {
    const a = rnd(2, 6), b = rnd(2, 6), c = rnd(2, 5);
    return {
      kind: 'values', prompt: `مطعم يقدم ${a} مقبلات و ${b} أطباق رئيسية و ${c} حلويات. كم وجبة مختلفة (طبق من كل نوع) يمكن تكوينها؟`, answer: [R(a * b * c)],
      hint: 'المبدأ الأساسي للعد: اضرب عدد الخيارات في كل مرحلة.',
      solution: [`$${a}\\cdot ${b}\\cdot ${c} = ${a * b * c}$`],
    };
  },
  () => {
    const n = rnd(5, 10), r = rnd(2, 4);
    return {
      kind: 'values', prompt: `بكم طريقة يمكن اختيار رئيس ونائب${r > 2 ? ' وأمين سر' : ''}${r > 3 ? ' وأمين صندوق' : ''} من بين ${n} أشخاص؟`, answer: [R(P(n, r))],
      hint: 'المناصب مختلفة فالترتيب مهم: تباديل.',
      solution: [`$P(${n}, ${r}) = \\dfrac{${n}!}{${n - r}!} = ${P(n, r)}$`],
    };
  },
  () => {
    const n = rnd(6, 15), r = rnd(2, 5);
    return {
      kind: 'values', prompt: `بكم طريقة يمكن اختيار لجنة من ${r} أعضاء من بين ${n} شخصًا؟`, answer: [R(C(n, r))],
      hint: 'أعضاء اللجنة متساوون فالترتيب لا يهم: توافيق.',
      solution: [`$C(${n}, ${r}) = \\dfrac{${n}!}{${r}!\\,${n - r}!} = ${C(n, r)}$`],
    };
  },
  () => {
    const items: [string, string][] = [
      ['ترتيب 5 كتب على رف', 'تبديل'], ['اختيار 3 فواكه من سلة فيها 8', 'توفيق'], ['تكوين رمز سري من 4 أرقام مختلفة', 'تبديل'],
      ['اختيار فريق من 5 لاعبين من 12', 'توفيق'], ['ترتيب الفائزين بالمراكز الثلاثة الأولى', 'تبديل'], ['اختيار 6 أرقام في سحب يانصيب', 'توفيق'],
    ];
    const [s, right] = pick(items);
    return choice(`${s}: هل هو تبديل أم توفيق؟`, right, [right === 'تبديل' ? 'توفيق' : 'تبديل', 'لا هذا ولا ذاك'],
      'اسأل: هل يتغير الناتج إذا غيّرنا الترتيب؟',
      [right === 'تبديل' ? 'الترتيب يصنع نتيجة مختلفة ← تبديل.' : 'الترتيب لا يغيّر النتيجة ← توفيق.']);
  },
  () => {
    const m = rnd(4, 8), w = rnd(4, 8), a = rnd(1, 3), b = rnd(1, 3);
    return {
      kind: 'values', prompt: `من ${m} رجال و ${w} نساء، بكم طريقة نختار لجنة من ${a === 1 ? 'رجل واحد' : `${a} رجال`} و${b === 1 ? 'امرأة واحدة' : `${b} نساء`}؟`, answer: [R(C(m, a) * C(w, b))],
      hint: 'اختر الرجال، واختر النساء، ثم اضرب (المبدأ الأساسي).',
      solution: [`$C(${m}, ${a})\\cdot C(${w}, ${b}) = ${C(m, a)}\\cdot ${C(w, b)} = ${C(m, a) * C(w, b)}$`],
    };
  },
];

// ================= 11.7 =================
const s117: Gen[] = [
  () => {
    const red = rnd(2, 8), blue = rnd(2, 8), green = rnd(1, 6);
    const tot = red + blue + green;
    const which = pick(['red', 'notblue'] as const);
    const num = which === 'red' ? red : tot - blue;
    return {
      kind: 'values', prompt: `في كيس ${red} كرات حمراء و ${blue} زرقاء و ${green} خضراء. سُحبت كرة عشوائيًا. ما احتمال أن تكون ${which === 'red' ? 'حمراء' : 'ليست زرقاء'}؟ (كسر)`, answer: [R(num / tot)],
      hint: which === 'red' ? 'عدد النتائج المواتية ÷ عدد النتائج الكلي.' : 'P(E′) = 1 − P(E).',
      solution: which === 'red' ? [`$P = \\dfrac{${red}}{${tot}}${gcd(red, tot) > 1 ? ` = ${frac(red, tot)}` : ''}$`] : [`$P(\\text{blue}) = \\dfrac{${blue}}{${tot}}$`, `$1 - \\dfrac{${blue}}{${tot}} = ${frac(tot - blue, tot)}$`],
      placeholder: 'مثال: 3/8',
    };
  },
  () => {
    const s = pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    let ways = 0;
    for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) if (i + j === s) ways++;
    return {
      kind: 'values', prompt: `رُمي حجرا نرد. ما احتمال أن يكون المجموع ${s}؟ (كسر)`, answer: [R(ways / 36)],
      hint: 'فضاء العينة 36 نتيجة متساوية الاحتمال. عُدّ الأزواج.',
      solution: [`عدد الأزواج التي مجموعها ${s}: ${ways}`, `$P = \\dfrac{${ways}}{36}${gcd(ways, 36) > 1 ? ` = ${frac(ways, 36)}` : ''}$`],
      placeholder: 'مثال: 1/6',
    };
  },
  () => {
    const fav = rnd(1, 9); let unf = rnd(1, 9); if (unf === fav) unf = fav + 1;
    return {
      kind: 'values', prompt: `أرجحية وقوع حدث هي ${fav} إلى ${unf}. ما احتمال وقوعه؟ (كسر)`, answer: [R(fav / (fav + unf))],
      hint: 'الأرجحية a إلى b تعني P = a / (a + b).',
      solution: [`$P = \\dfrac{${fav}}{${fav} + ${unf}} = ${frac(fav, fav + unf)}$`],
      placeholder: 'مثال: 2/7',
    };
  },
  () => {
    const pa = pick([0.2, 0.3, 0.4, 0.5]), pb = pick([0.3, 0.4, 0.5, 0.6]), pab = pick([0.1, 0.15, 0.2]);
    return {
      kind: 'values', tol: 0.0051, prompt: `$P(A) = ${pa}$ و $P(B) = ${pb}$ و $P(A \\cap B) = ${pab}$. أوجد $P(A \\cup B)$.`, answer: [R(r2(pa + pb - pab, 2))],
      hint: 'قاعدة الجمع: P(A ∪ B) = P(A) + P(B) − P(A ∩ B).',
      solution: [`$${pa} + ${pb} - ${pab} = ${r2(pa + pb - pab, 2)}$`],
    };
  },
  () => {
    const n = rnd(4, 10), p = pick([0.5, 0.25, 0.2, 0.1, 0.3]);
    const k = Math.min(n - 1, Math.max(1, Math.round(n * p) + rnd(-1, 1)));
    const v = C(n, k) * p ** k * (1 - p) ** (n - k);
    return {
      kind: 'values', tol: 0.00051, prompt: `احتمال النجاح في كل محاولة ${p}. ما احتمال ${k === 1 ? "نجاح واحد" : `${k} نجاحات`} بالضبط في ${n} محاولات مستقلة؟ (ثلاث منازل)`, answer: [R(r2(v, 3))],
      hint: 'C(n, k) pᵏ (1 − p)ⁿ⁻ᵏ.',
      solution: [`$\\dbinom{${n}}{${k}}(${p})^{${k}}(${r2(1 - p, 2)})^{${n - k}}$`, `$= ${C(n, k)}\\cdot ${r2(p ** k, 6)}\\cdot ${r2((1 - p) ** (n - k), 6)} \\approx ${r2(v, 3)}$`],
      placeholder: 'مثال: 0.246',
    };
  },
];

export const ch11: Record<string, Gen[]> = { '11.1': s111, '11.2': s112, '11.3': s113, '11.4': s114, '11.5': s115, '11.6': s116, '11.7': s117 };
