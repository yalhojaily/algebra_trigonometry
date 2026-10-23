# الجبر الجامعي وعلم المثلثات

شرح عربي تفاعلي لكتاب **College Algebra and Trigonometry**، مع ذكر المصطلح الإنجليزي بجانب كل مصطلح عربي.

الموقع: https://yalhojaily.github.io/algebra_trigonometry/

## ما في كل درس

- شرح بالحدس أولًا، ثم التعريفات والقواعد في صناديق ملوّنة.
- أمثلة محلولة تُكشف خطوة بخطوة.
- صناديق «خطأ شائع» لأكثر الأخطاء تكرارًا.
- أداة تفاعلية بمنزلقات ورسم بياني.
- تمارين مولّدة عشوائيًا تُصحَّح رياضيًا (تقبل `-2/5` و `2-3i` و `sqrt(5)` والتعابير الجبرية مثل `(x+1)(x-4)`)، مع معاينة لما كتبته وتلميح وحل.
- قائمة مصطلحات الدرس، وصفحة قاموس شاملة.
- حفظ التقدم في المتصفح، ووضع ليلي.

## الحالة

| الفصل | الحالة |
|---|---|
| R مراجعة المفاهيم الأساسية | جاهز (7 دروس) |
| 1 المعادلات والمتباينات | جاهز (8 دروس) |
| 2 إلى 11، الملاحق | قريبًا |

## التقنيات

Astro 5 + MDX، وKaTeX للمعادلات (تُرسم وقت البناء)، وCanvas للرسوم التفاعلية، وخطوط Google Noto
(Noto Kufi Arabic للعناوين، Noto Naskh Arabic للنص، Noto Sans للإنجليزية).

## التشغيل محليًا

```bash
npm install
npm run dev      # http://localhost:4321/algebra_trigonometry/
npm run build    # الناتج في dist/
```

النشر تلقائي إلى GitHub Pages عبر `.github/workflows/deploy.yml` عند كل دفع إلى `main`.

## إضافة فصل جديد

1. اكتب الدروس في `src/content/lessons/` بالاسم `2-1.mdx` وهكذا (انسخ بنية أي درس من الفصل 1).
2. أضف مولّدات التمارين في `src/lib/practice/` وسجّلها في `src/components/Practice.astro`.
3. غيّر `status` للفصل في `src/data/curriculum.ts` من `'soon'` إلى `'ready'`.

## البنية

```
src/
  data/curriculum.ts        خريطة الكتاب كاملة (الفصول والأقسام والموضوعات)
  content/lessons/*.mdx     الدروس
  components/               Box, Example, Solution, Check, Term, Practice
  components/widgets/       الأدوات التفاعلية
  lib/                      التصحيح الرياضي، مولّدات التمارين، الرسم، خط الأعداد
  pages/                    الرئيسية، صفحات الفصول، الدروس، المصطلحات
```
