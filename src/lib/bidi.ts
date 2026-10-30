// يلفّ مقاطع الرموز والصيغ اللاتينية داخل نص عربي عادي بـ span باتجاه ltr،
// حتى لا تنقلب أجزاء مثل «r = ep/(1 ± e cos θ)» أو «aₙ = a₁rⁿ⁻¹» عند عرضها في سياق rtl.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// حرف عربي أو علامة ترقيم عربية يقطع المقطع
const AR = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;
// ما يجعل المقطع «صيغة» تستحق العزل: رمز رياضي أو حرف لاتيني/يوناني بجوار رمز أو رقم
const MATHY = /[=<>≤≥±−+×·÷/^√∑Σ∞|()²³ⁿ⁻¹₀-₉ₙₖ′θπαβ]|[A-Za-z].*\d|\d.*[A-Za-z]/;
export function bidi(text: string): string {
  let out = '';
  let run = '';
  const flush = () => {
    if (!run) return;
    const m = run.match(/^([\s:.,;]*)(.*?)([\s.،؛:]*)$/s)!;
    const [, lead, core, trail] = m;
    if (core && MATHY.test(core) && /[A-Za-z0-9α-ωΣ]/.test(core)) out += `${esc(lead)}<span class="ltr nw" dir="ltr">${esc(core)}</span>${esc(trail)}`;
    else out += esc(run);
    run = '';
  };
  for (const ch of text) {
    if (AR.test(ch)) { flush(); out += esc(ch); } else run += ch;
  }
  flush();
  return out;
}
