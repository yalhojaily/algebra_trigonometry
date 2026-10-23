// خريطة الكتاب كاملة: الفصول ← الأقسام ← الموضوعات
// status: 'ready' للفصول المكتملة، 'soon' للفصول القادمة

export type Section = {
  id: string; // مثل "1.4"
  ar: string;
  en: string;
  topics: { ar: string; en: string }[];
};

export type Chapter = {
  id: string; // "R" أو "1" ...
  ar: string;
  en: string;
  status: 'ready' | 'soon';
  blurb: string;
  sections: Section[];
};

const t = (ar: string, en: string) => ({ ar, en });

export const chapters: Chapter[] = [
  {
    id: 'R',
    ar: 'مراجعة المفاهيم الأساسية',
    en: 'Review of Basic Concepts',
    status: 'ready',
    blurb: 'المجموعات والأعداد الحقيقية وكثيرات الحدود والمقادير النسبية والجذرية.',
    sections: [
      { id: 'R.1', ar: 'المجموعات', en: 'Sets', topics: [t('تعريفات أساسية', 'Basic Definitions'), t('العمليات على المجموعات', 'Operations on Sets')] },
      { id: 'R.2', ar: 'الأعداد الحقيقية وخصائصها', en: 'Real Numbers and Their Properties', topics: [t('مجموعات الأعداد وخط الأعداد', 'Sets of Numbers and the Number Line'), t('الأسس', 'Exponents'), t('ترتيب العمليات', 'Order of Operations'), t('خصائص الأعداد الحقيقية', 'Properties of Real Numbers'), t('الترتيب على خط الأعداد', 'Order on the Number Line'), t('القيمة المطلقة', 'Absolute Value')] },
      { id: 'R.3', ar: 'كثيرات الحدود', en: 'Polynomials', topics: [t('قواعد الأسس', 'Rules for Exponents'), t('كثيرات الحدود', 'Polynomials'), t('الجمع والطرح', 'Addition and Subtraction'), t('الضرب', 'Multiplication'), t('القسمة', 'Division')] },
      { id: 'R.4', ar: 'تحليل كثيرات الحدود', en: 'Factoring Polynomials', topics: [t('إخراج العامل المشترك الأكبر', 'Factoring Out the GCF'), t('التحليل بالتجميع', 'Factoring by Grouping'), t('تحليل ثلاثيات الحدود', 'Factoring Trinomials'), t('تحليل ثنائيات الحدود', 'Factoring Binomials'), t('التحليل بالتعويض', 'Factoring by Substitution')] },
      { id: 'R.5', ar: 'المقادير النسبية', en: 'Rational Expressions', topics: [t('المقادير النسبية', 'Rational Expressions'), t('أبسط صورة', 'Lowest Terms'), t('الضرب والقسمة', 'Multiplication and Division'), t('الجمع والطرح', 'Addition and Subtraction'), t('الكسور المركبة', 'Complex Fractions')] },
      { id: 'R.6', ar: 'الأسس النسبية', en: 'Rational Exponents', topics: [t('الأسس السالبة وقاعدة القسمة', 'Negative Exponents and the Quotient Rule'), t('الأسس النسبية', 'Rational Exponents'), t('عودة إلى الكسور المركبة', 'Complex Fractions Revisited')] },
      { id: 'R.7', ar: 'المقادير الجذرية', en: 'Radical Expressions', topics: [t('رموز الجذور', 'Radical Notation'), t('تبسيط الجذور', 'Simplified Radicals'), t('العمليات على الجذور', 'Operations with Radicals'), t('إنطاق المقام', 'Rationalizing Denominators')] },
    ],
  },
  {
    id: '1',
    ar: 'المعادلات والمتباينات',
    en: 'Equations and Inequalities',
    status: 'ready',
    blurb: 'من المعادلة الخطية إلى التربيعية والجذرية، ثم المتباينات والقيمة المطلقة، مع التطبيقات.',
    sections: [
      { id: '1.1', ar: 'المعادلات الخطية', en: 'Linear Equations', topics: [t('مصطلحات أساسية', 'Basic Terminology of Equations'), t('المعادلات الخطية', 'Linear Equations'), t('المتطابقات والمعادلات المشروطة والتناقضات', 'Identities, Conditional Equations, and Contradictions'), t('الحل لمتغير محدد', 'Solving for a Specified Variable')] },
      { id: '1.2', ar: 'التطبيقات والنمذجة بالمعادلات الخطية', en: 'Applications and Modeling with Linear Equations', topics: [t('حل المسائل التطبيقية', 'Solving Applied Problems'), t('مسائل هندسية', 'Geometry Problems'), t('مسائل الحركة', 'Motion Problems'), t('مسائل الخلط', 'Mixture Problems'), t('النمذجة بالمعادلات الخطية', 'Modeling with Linear Equations')] },
      { id: '1.3', ar: 'الأعداد المركبة', en: 'Complex Numbers', topics: [t('مفاهيم أساسية', 'Basic Concepts of Complex Numbers'), t('العمليات على الأعداد المركبة', 'Operations on Complex Numbers')] },
      { id: '1.4', ar: 'المعادلات التربيعية', en: 'Quadratic Equations', topics: [t('خاصية الضرب الصفري', 'The Zero-Factor Property'), t('خاصية الجذر التربيعي', 'The Square Root Property'), t('إكمال المربع', 'Completing the Square'), t('القانون العام', 'The Quadratic Formula'), t('الحل لمتغير محدد', 'Solving for a Specified Variable'), t('المميز', 'The Discriminant')] },
      { id: '1.5', ar: 'التطبيقات والنمذجة بالمعادلات التربيعية', en: 'Applications and Modeling with Quadratic Equations', topics: [t('مسائل هندسية', 'Geometry Problems'), t('نظرية فيثاغورس', 'The Pythagorean Theorem'), t('ارتفاع جسم مقذوف', 'Height of a Projected Object'), t('النمذجة بالمعادلات التربيعية', 'Modeling with Quadratic Equations')] },
      { id: '1.6', ar: 'أنواع أخرى من المعادلات وتطبيقاتها', en: 'Other Types of Equations and Applications', topics: [t('المعادلات النسبية', 'Rational Equations'), t('مسائل معدل العمل', 'Work Rate Problems'), t('معادلات بها جذور', 'Equations with Radicals'), t('معادلات بأسس نسبية', 'Equations with Rational Exponents'), t('معادلات تربيعية الشكل', 'Equations Quadratic in Form')] },
      { id: '1.7', ar: 'المتباينات', en: 'Inequalities', topics: [t('المتباينات الخطية', 'Linear Inequalities'), t('المتباينات الثلاثية', 'Three-Part Inequalities'), t('المتباينات التربيعية', 'Quadratic Inequalities'), t('المتباينات النسبية', 'Rational Inequalities')] },
      { id: '1.8', ar: 'معادلات ومتباينات القيمة المطلقة', en: 'Absolute Value Equations and Inequalities', topics: [t('مفاهيم أساسية', 'Basic Concepts'), t('معادلات القيمة المطلقة', 'Absolute Value Equations'), t('متباينات القيمة المطلقة', 'Absolute Value Inequalities'), t('حالات خاصة', 'Special Cases'), t('نماذج المسافة والتفاوت', 'Absolute Value Models for Distance and Tolerance')] },
    ],
  },
  {
    id: '2',
    ar: 'الرسوم البيانية والدوال',
    en: 'Graphs and Functions',
    status: 'soon',
    blurb: 'المستوى الإحداثي والدوائر والدوال الخطية وتقنيات الرسم وتركيب الدوال.',
    sections: [
      { id: '2.1', ar: 'الإحداثيات المتعامدة والرسوم', en: 'Rectangular Coordinates and Graphs', topics: [t('الأزواج المرتبة', 'Ordered Pairs'), t('نظام الإحداثيات المتعامدة', 'The Rectangular Coordinate System'), t('قانون المسافة', 'The Distance Formula'), t('قانون نقطة المنتصف', 'The Midpoint Formula'), t('معادلات بمتغيرين', 'Equations in Two Variables')] },
      { id: '2.2', ar: 'الدوائر', en: 'Circles', topics: [t('صيغة المركز ونصف القطر', 'Center-Radius Form'), t('الصيغة العامة', 'General Form'), t('تطبيق', 'An Application')] },
      { id: '2.3', ar: 'الدوال', en: 'Functions', topics: [t('العلاقات والدوال', 'Relations and Functions'), t('المجال والمدى', 'Domain and Range'), t('تحديد ما إذا كانت العلاقة دالة', 'Determining Whether Relations Are Functions'), t('رمز الدالة', 'Function Notation'), t('الدوال المتزايدة والمتناقصة والثابتة', 'Increasing, Decreasing, and Constant Functions')] },
      { id: '2.4', ar: 'الدوال الخطية', en: 'Linear Functions', topics: [t('مفاهيم أساسية', 'Basic Concepts of Linear Functions'), t('الصيغة القياسية', 'Standard Form Ax + By = C'), t('الميل', 'Slope'), t('متوسط معدل التغير', 'Average Rate of Change'), t('النماذج الخطية', 'Linear Models')] },
      { id: '2.5', ar: 'معادلات المستقيمات والنماذج الخطية', en: 'Equations of Lines and Linear Models', topics: [t('صيغة النقطة والميل', 'Point-Slope Form'), t('صيغة الميل والمقطع', 'Slope-Intercept Form'), t('المستقيمات الرأسية والأفقية', 'Vertical and Horizontal Lines'), t('المستقيمات المتوازية والمتعامدة', 'Parallel and Perpendicular Lines'), t('نمذجة البيانات', 'Modeling Data'), t('الحل البياني للمعادلات الخطية', 'Graphical Solution of Linear Equations in One Variable')] },
      { id: '2.6', ar: 'رسوم الدوال الأساسية', en: 'Graphs of Basic Functions', topics: [t('الاتصال', 'Continuity'), t('الدوال المحايدة والتربيعية والتكعيبية', 'The Identity, Squaring, and Cubing Functions'), t('دالتا الجذر التربيعي والتكعيبي', 'The Square Root and Cube Root Functions'), t('دالة القيمة المطلقة', 'The Absolute Value Function'), t('الدوال المعرفة بأكثر من قاعدة', 'Piecewise-Defined Functions'), t('العلاقة x = y²', 'The Relation x = y²')] },
      { id: '2.7', ar: 'تقنيات الرسم', en: 'Graphing Techniques', topics: [t('التمدد والانكماش', 'Stretching and Shrinking'), t('الانعكاس', 'Reflecting'), t('التماثل', 'Symmetry'), t('الدوال الزوجية والفردية', 'Even and Odd Functions'), t('الإزاحات', 'Translations')] },
      { id: '2.8', ar: 'العمليات على الدوال وتركيبها', en: 'Function Operations and Composition', topics: [t('العمليات الحسابية على الدوال', 'Arithmetic Operations on Functions'), t('خارج قسمة الفرق', 'The Difference Quotient'), t('تركيب الدوال والمجال', 'Composition of Functions and Domain')] },
    ],
  },
  {
    id: '3',
    ar: 'الدوال كثيرة الحدود والنسبية',
    en: 'Polynomial and Rational Functions',
    status: 'soon',
    blurb: 'الدوال التربيعية والقسمة التركيبية وأصفار كثيرات الحدود والدوال النسبية والتغير.',
    sections: [
      { id: '3.1', ar: 'الدوال التربيعية ونماذجها', en: 'Quadratic Functions and Models', topics: [t('دوال كثيرات الحدود', 'Polynomial Functions'), t('الدوال التربيعية', 'Quadratic Functions'), t('تقنيات الرسم', 'Graphing Techniques'), t('إكمال المربع', 'Completing the Square'), t('قانون الرأس', 'The Vertex Formula'), t('النماذج التربيعية', 'Quadratic Models')] },
      { id: '3.2', ar: 'القسمة التركيبية', en: 'Synthetic Division', topics: [t('القسمة التركيبية', 'Synthetic Division'), t('نظرية الباقي', 'Remainder Theorem'), t('الأصفار المحتملة', 'Potential Zeros of Polynomial Functions')] },
      { id: '3.3', ar: 'أصفار الدوال كثيرة الحدود', en: 'Zeros of Polynomial Functions', topics: [t('نظرية العامل', 'Factor Theorem'), t('نظرية الأصفار النسبية', 'Rational Zeros Theorem'), t('عدد الأصفار', 'Number of Zeros'), t('نظرية الأصفار المترافقة', 'Conjugate Zeros Theorem'), t('أصفار دالة كثيرة حدود', 'Zeros of a Polynomial Function'), t('قاعدة ديكارت للإشارات', "Descartes' Rule of Signs")] },
      { id: '3.4', ar: 'الدوال كثيرة الحدود: الرسوم والتطبيقات والنماذج', en: 'Polynomial Functions: Graphs, Applications, and Models', topics: [t('رسوم f(x) = axⁿ', 'Graphs of f(x) = axⁿ'), t('رسوم الدوال العامة', 'Graphs of General Polynomial Functions'), t('السلوك عند الأصفار', 'Behavior at Zeros'), t('نقاط التحول والسلوك الطرفي', 'Turning Points and End Behavior'), t('تقنيات الرسم', 'Graphing Techniques'), t('نظريتا القيمة الوسطى والمحدودية', 'Intermediate Value and Boundedness Theorems'), t('تقريب الأصفار الحقيقية', 'Approximations of Real Zeros'), t('نماذج كثيرات الحدود', 'Polynomial Models')] },
      { id: '3.5', ar: 'الدوال النسبية: الرسوم والتطبيقات والنماذج', en: 'Rational Functions: Graphs, Applications, and Models', topics: [t('دالة المقلوب f(x) = 1/x', 'The Reciprocal Function f(x) = 1/x'), t('الدالة f(x) = 1/x²', 'The Function f(x) = 1/x²'), t('خطوط التقارب', 'Asymptotes'), t('تقنيات الرسم', 'Graphing Techniques'), t('النماذج النسبية', 'Rational Models')] },
      { id: '3.6', ar: 'التغير', en: 'Variation', topics: [t('التغير الطردي', 'Direct Variation'), t('التغير العكسي', 'Inverse Variation'), t('التغير المركب والمشترك', 'Combined and Joint Variation')] },
    ],
  },
  {
    id: '4',
    ar: 'الدوال العكسية والأسية واللوغاريتمية',
    en: 'Inverse, Exponential, and Logarithmic Functions',
    status: 'soon',
    blurb: 'الدوال العكسية، النمو الأسي، اللوغاريتمات وخصائصها، والمعادلات الأسية.',
    sections: [
      { id: '4.1', ar: 'الدوال العكسية', en: 'Inverse Functions', topics: [t('الدوال المتباينة', 'One-to-One Functions'), t('الدوال العكسية', 'Inverse Functions'), t('معادلات الدوال العكسية', 'Equations of Inverses'), t('تطبيق في التشفير', 'An Application to Cryptography')] },
      { id: '4.2', ar: 'الدوال الأسية', en: 'Exponential Functions', topics: [t('الأسس وخصائصها', 'Exponents and Properties'), t('الدوال الأسية', 'Exponential Functions'), t('المعادلات الأسية', 'Exponential Equations'), t('الفائدة المركبة', 'Compound Interest'), t('العدد e والتركيب المستمر', 'The Number e and Continuous Compounding'), t('النماذج الأسية', 'Exponential Models')] },
      { id: '4.3', ar: 'الدوال اللوغاريتمية', en: 'Logarithmic Functions', topics: [t('اللوغاريتمات', 'Logarithms'), t('المعادلات اللوغاريتمية', 'Logarithmic Equations'), t('الدوال اللوغاريتمية', 'Logarithmic Functions'), t('خصائص اللوغاريتمات', 'Properties of Logarithms')] },
      { id: '4.4', ar: 'حساب اللوغاريتمات ونظرية تغيير الأساس', en: 'Evaluating Logarithms and the Change-of-Base Theorem', topics: [t('اللوغاريتمات العشرية', 'Common Logarithms'), t('تطبيقات اللوغاريتمات العشرية', 'Applications and Models with Common Logarithms'), t('اللوغاريتمات الطبيعية', 'Natural Logarithms'), t('تطبيقات اللوغاريتمات الطبيعية', 'Applications and Models with Natural Logarithms'), t('لوغاريتمات بأساسات أخرى', 'Logarithms with Other Bases')] },
      { id: '4.5', ar: 'المعادلات الأسية واللوغاريتمية', en: 'Exponential and Logarithmic Equations', topics: [t('المعادلات الأسية', 'Exponential Equations'), t('المعادلات اللوغاريتمية', 'Logarithmic Equations'), t('التطبيقات والنماذج', 'Applications and Models')] },
      { id: '4.6', ar: 'تطبيقات ونماذج النمو والتضاؤل الأسي', en: 'Applications and Models of Exponential Growth and Decay', topics: [t('دالة النمو أو التضاؤل الأسي', 'The Exponential Growth or Decay Function'), t('نماذج النمو', 'Growth Function Models'), t('نماذج التضاؤل', 'Decay Function Models')] },
    ],
  },
  {
    id: '5',
    ar: 'الدوال المثلثية',
    en: 'Trigonometric Functions',
    status: 'soon',
    blurb: 'الزوايا وقياسها، تعريف الدوال المثلثية، الزوايا المرجعية، وحل المثلثات القائمة.',
    sections: [
      { id: '5.1', ar: 'الزوايا', en: 'Angles', topics: [t('مصطلحات أساسية', 'Basic Terminology'), t('القياس بالدرجات', 'Degree Measure'), t('الوضع القياسي', 'Standard Position'), t('الزوايا المتكافئة', 'Coterminal Angles')] },
      { id: '5.2', ar: 'الدوال المثلثية', en: 'Trigonometric Functions', topics: [t('الدوال المثلثية', 'Trigonometric Functions'), t('الزوايا الربعية', 'Quadrantal Angles'), t('متطابقات المقلوب', 'Reciprocal Identities'), t('الإشارات ومدى القيم', 'Signs and Ranges of Function Values'), t('متطابقات فيثاغورس', 'Pythagorean Identities'), t('متطابقات القسمة', 'Quotient Identities')] },
      { id: '5.3', ar: 'قيم الدوال المثلثية وقياسات الزوايا', en: 'Trigonometric Function Values and Angle Measures', topics: [t('التعريف بالمثلث القائم', 'Right-Triangle-Based Definitions'), t('الدوال المتتامة', 'Cofunctions'), t('قيم الزوايا الخاصة', 'Values of Special Angles'), t('الزوايا المرجعية', 'Reference Angles'), t('الزوايا الخاصة كزوايا مرجعية', 'Special Angles as Reference Angles'), t('تقريبات الآلة الحاسبة', 'Calculator Approximations'), t('تطبيق', 'An Application')] },
      { id: '5.4', ar: 'حلول وتطبيقات المثلثات القائمة', en: 'Solutions and Applications of Right Triangles', topics: [t('خلفية تاريخية', 'Historical Background'), t('الأرقام المعنوية', 'Significant Digits'), t('حل المثلثات', 'Solving Triangles'), t('زوايا الارتفاع والانخفاض', 'Angles of Elevation or Depression'), t('الاتجاه', 'Bearing'), t('تطبيقات إضافية', 'Further Applications')] },
    ],
  },
  {
    id: '6',
    ar: 'الدوال الدائرية ورسومها',
    en: 'The Circular Functions and Their Graphs',
    status: 'soon',
    blurb: 'القياس الدائري ودائرة الوحدة ورسوم الجيب وجيب التمام والظل والحركة التوافقية.',
    sections: [
      { id: '6.1', ar: 'القياس الدائري', en: 'Radian Measure', topics: [t('القياس الدائري', 'Radian Measure'), t('التحويل بين الدرجات والراديان', 'Conversions between Degrees and Radians'), t('طول القوس', 'Arc Length on a Circle'), t('مساحة القطاع', 'Area of a Sector of a Circle')] },
      { id: '6.2', ar: 'دائرة الوحدة والدوال الدائرية', en: 'The Unit Circle and Circular Functions', topics: [t('الدوال الدائرية', 'Circular Functions'), t('قيم الدوال الدائرية', 'Values of the Circular Functions'), t('إيجاد عدد بقيمة دالة معطاة', 'Determining a Number with a Given Circular Function Value'), t('قيم الدوال كأطوال قطع', 'Function Values as Lengths of Line Segments'), t('السرعة الخطية والزاوية', 'Linear and Angular Speed')] },
      { id: '6.3', ar: 'رسوم الجيب وجيب التمام', en: 'Graphs of the Sine and Cosine Functions', topics: [t('الدوال الدورية', 'Periodic Functions'), t('رسم دالة الجيب', 'Graph of the Sine Function'), t('رسم دالة جيب التمام', 'Graph of the Cosine Function'), t('السعة والدورة', 'Amplitude and Period'), t('ربط الرسوم بالمعادلات', 'Connecting Graphs with Equations'), t('نموذج مثلثي', 'A Trigonometric Model')] },
      { id: '6.4', ar: 'إزاحة رسوم الجيب وجيب التمام', en: 'Translations of the Graphs of the Sine and Cosine Functions', topics: [t('الإزاحة الأفقية', 'Horizontal Translations'), t('الإزاحة الرأسية', 'Vertical Translations'), t('تركيب الإزاحات', 'Combinations of Translations'), t('نموذج مثلثي', 'A Trigonometric Model')] },
      { id: '6.5', ar: 'رسوم الظل وظل التمام', en: 'Graphs of the Tangent and Cotangent Functions', topics: [t('رسم دالة الظل', 'Graph of the Tangent Function'), t('رسم دالة ظل التمام', 'Graph of the Cotangent Function'), t('تقنيات الرسم', 'Techniques for Graphing'), t('ربط الرسوم بالمعادلات', 'Connecting Graphs with Equations')] },
      { id: '6.6', ar: 'رسوم القاطع وقاطع التمام', en: 'Graphs of the Secant and Cosecant Functions', topics: [t('رسم دالة القاطع', 'Graph of the Secant Function'), t('رسم دالة قاطع التمام', 'Graph of the Cosecant Function'), t('تقنيات الرسم', 'Techniques for Graphing'), t('ربط الرسوم بالمعادلات', 'Connecting Graphs with Equations'), t('جمع الإحداثيات', 'Addition of Ordinates')] },
      { id: '6.7', ar: 'الحركة التوافقية', en: 'Harmonic Motion', topics: [t('الحركة التوافقية البسيطة', 'Simple Harmonic Motion'), t('الحركة الاهتزازية المخمدة', 'Damped Oscillatory Motion')] },
    ],
  },
  {
    id: '7',
    ar: 'المتطابقات والمعادلات المثلثية',
    en: 'Trigonometric Identities and Equations',
    status: 'soon',
    blurb: 'المتطابقات الأساسية وإثباتها، متطابقات المجموع وضعف الزاوية، والدوال العكسية والمعادلات.',
    sections: [
      { id: '7.1', ar: 'المتطابقات الأساسية', en: 'Fundamental Identities', topics: [t('المتطابقات الأساسية', 'Fundamental Identities'), t('استخدامات المتطابقات', 'Uses of the Fundamental Identities')] },
      { id: '7.2', ar: 'إثبات المتطابقات المثلثية', en: 'Verifying Trigonometric Identities', topics: [t('استراتيجيات', 'Strategies'), t('الإثبات بالعمل على طرف واحد', 'Working with One Side'), t('الإثبات بالعمل على الطرفين', 'Working with Both Sides')] },
      { id: '7.3', ar: 'متطابقات المجموع والفرق', en: 'Sum and Difference Identities', topics: [t('جيب التمام للمجموع والفرق', 'Cosine Sum and Difference Identities'), t('متطابقات الدوال المتتامة', 'Cofunction Identities'), t('الجيب والظل للمجموع والفرق', 'Sine and Tangent Sum and Difference Identities'), t('تطبيقات', 'Applications'), t('إثبات متطابقة', 'Verifying an Identity')] },
      { id: '7.4', ar: 'متطابقات ضعف الزاوية ونصفها', en: 'Double-Angle and Half-Angle Identities', topics: [t('متطابقات ضعف الزاوية', 'Double-Angle Identities'), t('تطبيق', 'An Application'), t('تحويل الضرب إلى مجموع وبالعكس', 'Product-to-Sum and Sum-to-Product Identities'), t('متطابقات نصف الزاوية', 'Half-Angle Identities'), t('إثبات متطابقة', 'Verifying an Identity')] },
      { id: '7.5', ar: 'الدوال الدائرية العكسية', en: 'Inverse Circular Functions', topics: [t('مراجعة الدوال العكسية', 'Review of Inverse Functions'), t('معكوس الجيب', 'Inverse Sine Function'), t('معكوس جيب التمام', 'Inverse Cosine Function'), t('معكوس الظل', 'Inverse Tangent Function'), t('دوال عكسية أخرى', 'Other Inverse Circular Functions'), t('قيم الدوال العكسية', 'Inverse Function Values')] },
      { id: '7.6', ar: 'المعادلات المثلثية', en: 'Trigonometric Equations', topics: [t('طرق خطية', 'Linear Methods'), t('خاصية الضرب الصفري', 'Zero-Factor Property Method'), t('طرق تربيعية', 'Quadratic Methods'), t('التعويض بالمتطابقات', 'Trigonometric Identity Substitutions'), t('معادلات بأنصاف الزوايا', 'Equations with Half-Angles'), t('معادلات بمضاعفات الزوايا', 'Equations with Multiple Angles'), t('تطبيقات', 'Applications')] },
      { id: '7.7', ar: 'معادلات تتضمن دوالًا مثلثية عكسية', en: 'Equations Involving Inverse Trigonometric Functions', topics: [t('الحل لـ x بدلالة y', 'Solution for x in Terms of y Using Inverse Functions'), t('حل المعادلات المثلثية العكسية', 'Solution of Inverse Trigonometric Equations')] },
    ],
  },
  {
    id: '8',
    ar: 'تطبيقات علم المثلثات',
    en: 'Applications of Trigonometry',
    status: 'soon',
    blurb: 'قانونا الجيوب وجيوب التمام، المتجهات، الصيغة القطبية للأعداد المركبة، والمعادلات الوسيطية.',
    sections: [
      { id: '8.1', ar: 'قانون الجيوب', en: 'The Law of Sines', topics: [t('التطابق والمثلثات غير القائمة', 'Congruency and Oblique Triangles'), t('اشتقاق قانون الجيوب', 'Derivation of the Law of Sines'), t('استخدام قانون الجيوب', 'Using the Law of Sines'), t('الحالة الغامضة', 'Description of the Ambiguous Case'), t('مساحة المثلث', 'Area of a Triangle')] },
      { id: '8.2', ar: 'قانون جيوب التمام', en: 'The Law of Cosines', topics: [t('اشتقاق القانون', 'Derivation of the Law of Cosines'), t('استخدام القانون', 'Using the Law of Cosines'), t('صيغة هيرون', "Heron's Formula for the Area of a Triangle"), t('اشتقاق صيغة هيرون', "Derivation of Heron's Formula")] },
      { id: '8.3', ar: 'المتجهات المعرفة هندسيًا وتطبيقاتها', en: 'Geometrically Defined Vectors and Applications', topics: [t('مصطلحات أساسية', 'Basic Terminology'), t('القوة الموازنة', 'The Equilibrant'), t('تطبيقات المستوى المائل', 'Incline Applications'), t('تطبيقات الملاحة', 'Navigation Applications')] },
      { id: '8.4', ar: 'المتجهات المعرفة جبريًا والضرب النقطي', en: 'Algebraically Defined Vectors and the Dot Product', topics: [t('التفسير الجبري للمتجهات', 'Algebraic Interpretation of Vectors'), t('العمليات على المتجهات', 'Operations with Vectors'), t('الضرب النقطي والزاوية بين متجهين', 'The Dot Product and the Angle between Vectors')] },
      { id: '8.5', ar: 'الصيغة المثلثية (القطبية) للأعداد المركبة', en: 'Trigonometric (Polar) Form of Complex Numbers; Products and Quotients', topics: [t('المستوى المركب والتمثيل المتجهي', 'The Complex Plane and Vector Representation'), t('الصيغة القطبية', 'Trigonometric (Polar) Form'), t('التحويل بين الصيغتين', 'Converting between Rectangular and Trigonometric Forms'), t('تطبيق على الكسوريات', 'An Application to Fractals'), t('الضرب بالصيغة المثلثية', 'Products in Trigonometric Form'), t('القسمة بالصيغة المثلثية', 'Quotients in Trigonometric Form')] },
      { id: '8.6', ar: 'نظرية دي موافر وقوى الأعداد المركبة وجذورها', en: "De Moivre's Theorem; Powers and Roots of Complex Numbers", topics: [t('قوى الأعداد المركبة', "Powers of Complex Numbers (De Moivre's Theorem)"), t('جذور الأعداد المركبة', 'Roots of Complex Numbers')] },
      { id: '8.7', ar: 'المعادلات القطبية ورسومها', en: 'Polar Equations and Graphs', topics: [t('نظام الإحداثيات القطبية', 'Polar Coordinate System'), t('رسوم المعادلات القطبية', 'Graphs of Polar Equations'), t('التحويل إلى المعادلات الديكارتية', 'Conversion from Polar to Rectangular Equations'), t('تصنيف المعادلات القطبية', 'Classification of Polar Equations')] },
      { id: '8.8', ar: 'المعادلات الوسيطية ورسومها وتطبيقاتها', en: 'Parametric Equations, Graphs, and Applications', topics: [t('مفاهيم أساسية', 'Basic Concepts'), t('الرسوم ومكافئاتها الديكارتية', 'Parametric Graphs and Their Rectangular Equivalents'), t('الدويري', 'The Cycloid'), t('تطبيقات', 'Applications of Parametric Equations')] },
    ],
  },
  {
    id: '9',
    ar: 'الأنظمة والمصفوفات',
    en: 'Systems and Matrices',
    status: 'soon',
    blurb: 'أنظمة المعادلات الخطية وغير الخطية، المصفوفات والمحددات، الكسور الجزئية، والبرمجة الخطية.',
    sections: [
      { id: '9.1', ar: 'أنظمة المعادلات الخطية', en: 'Systems of Linear Equations', topics: [t('الأنظمة الخطية', 'Linear Systems'), t('طريقة التعويض', 'Substitution Method'), t('طريقة الحذف', 'Elimination Method'), t('أنظمة خاصة', 'Special Systems'), t('تطبيقات', 'Application of Systems of Equations'), t('أنظمة بثلاثة مجاهيل', 'Linear Systems with Three Unknowns'), t('نمذجة البيانات', 'Application of Systems to Model Data')] },
      { id: '9.2', ar: 'حل الأنظمة الخطية بالمصفوفات', en: 'Matrix Solution of Linear Systems', topics: [t('طريقة غاوس-جوردان', 'The Gauss-Jordan Method'), t('أنظمة خاصة', 'Special Systems')] },
      { id: '9.3', ar: 'حل الأنظمة الخطية بالمحددات', en: 'Determinant Solution of Linear Systems', topics: [t('المحددات', 'Determinants'), t('المرافقات', 'Cofactors'), t('محددات n × n', 'n × n Determinants'), t('نظريات المحددات', 'Determinant Theorems'), t('قاعدة كرامر', "Cramer's Rule")] },
      { id: '9.4', ar: 'الكسور الجزئية', en: 'Partial Fractions', topics: [t('تفكيك المقادير النسبية', 'Decomposition of Rational Expressions'), t('عوامل خطية مختلفة', 'Distinct Linear Factors'), t('عوامل خطية مكررة', 'Repeated Linear Factors'), t('عوامل خطية وتربيعية مختلفة', 'Distinct Linear and Quadratic Factors'), t('عوامل تربيعية مكررة', 'Repeated Quadratic Factors')] },
      { id: '9.5', ar: 'الأنظمة غير الخطية', en: 'Nonlinear Systems of Equations', topics: [t('حلول حقيقية', 'Nonlinear Systems with Real Solutions'), t('حلول مركبة غير حقيقية', 'Nonlinear Systems with Nonreal Complex Solutions'), t('تطبيق', 'An Application of Nonlinear Systems')] },
      { id: '9.6', ar: 'أنظمة المتباينات والبرمجة الخطية', en: 'Systems of Inequalities and Linear Programming', topics: [t('المتباينات الخطية بمتغيرين', 'Linear Inequalities in Two Variables'), t('أنظمة المتباينات', 'Systems of Inequalities'), t('البرمجة الخطية', 'Linear Programming')] },
      { id: '9.7', ar: 'خصائص المصفوفات', en: 'Properties of Matrices', topics: [t('تعريفات أساسية', 'Basic Definitions'), t('جمع المصفوفات', 'Matrix Addition'), t('مصفوفات خاصة', 'Special Matrices'), t('طرح المصفوفات', 'Matrix Subtraction'), t('الضرب في عدد', 'Scalar Multiplication'), t('ضرب المصفوفات', 'Matrix Multiplication'), t('تطبيق', 'An Application of Matrix Algebra')] },
      { id: '9.8', ar: 'معكوس المصفوفة', en: 'Matrix Inverses', topics: [t('مصفوفات الوحدة', 'Identity Matrices'), t('المعكوس الضربي', 'Multiplicative Inverses'), t('حل الأنظمة بالمعكوس', 'Solution of Systems Using Inverse Matrices')] },
    ],
  },
  {
    id: '10',
    ar: 'الهندسة التحليلية',
    en: 'Analytic Geometry',
    status: 'soon',
    blurb: 'القطوع المخروطية: المكافئ والناقص والزائد وخصائصها.',
    sections: [
      { id: '10.1', ar: 'القطوع المكافئة', en: 'Parabolas', topics: [t('القطوع المخروطية', 'Conic Sections'), t('القطوع المكافئة الأفقية', 'Horizontal Parabolas'), t('التعريف الهندسي والمعادلات', 'Geometric Definition and Equations of Parabolas'), t('تطبيق', 'An Application of Parabolas')] },
      { id: '10.2', ar: 'القطوع الناقصة', en: 'Ellipses', topics: [t('المعادلات والرسوم', 'Equations and Graphs of Ellipses'), t('القطوع الناقصة المزاحة', 'Translated Ellipses'), t('الاختلاف المركزي', 'Eccentricity'), t('تطبيقات', 'Applications of Ellipses')] },
      { id: '10.3', ar: 'القطوع الزائدة', en: 'Hyperbolas', topics: [t('المعادلات والرسوم', 'Equations and Graphs of Hyperbolas'), t('القطوع الزائدة المزاحة', 'Translated Hyperbolas'), t('الاختلاف المركزي', 'Eccentricity')] },
      { id: '10.4', ar: 'ملخص القطوع المخروطية', en: 'Summary of the Conic Sections', topics: [t('الخصائص', 'Characteristics'), t('تمييز القطوع', 'Identifying Conic Sections'), t('التعريف الهندسي', 'Geometric Definition of Conic Sections')] },
    ],
  },
  {
    id: '11',
    ar: 'موضوعات إضافية في الجبر',
    en: 'Further Topics in Algebra',
    status: 'soon',
    blurb: 'المتتابعات والمتسلسلات، نظرية ذات الحدين، الاستقراء الرياضي، والعد والاحتمالات.',
    sections: [
      { id: '11.1', ar: 'المتتابعات والمتسلسلات', en: 'Sequences and Series', topics: [t('المتتابعات', 'Sequences'), t('المتسلسلات ورمز المجموع', 'Series and Summation Notation'), t('خصائص المجموع', 'Summation Properties and Rules')] },
      { id: '11.2', ar: 'المتتابعات والمتسلسلات الحسابية', en: 'Arithmetic Sequences and Series', topics: [t('المتتابعات الحسابية', 'Arithmetic Sequences'), t('المتسلسلات الحسابية', 'Arithmetic Series')] },
      { id: '11.3', ar: 'المتتابعات والمتسلسلات الهندسية', en: 'Geometric Sequences and Series', topics: [t('المتتابعات الهندسية', 'Geometric Sequences'), t('المتسلسلات الهندسية', 'Geometric Series'), t('المتسلسلات الهندسية اللانهائية', 'Infinite Geometric Series'), t('الدفعات الدورية', 'Annuities')] },
      { id: '11.4', ar: 'نظرية ذات الحدين', en: 'The Binomial Theorem', topics: [t('نمط المفكوك', 'A Binomial Expansion Pattern'), t('مثلث باسكال', "Pascal's Triangle"), t('مضروب n', 'n-Factorial'), t('معاملات ذات الحدين', 'Binomial Coefficients'), t('نظرية ذات الحدين', 'The Binomial Theorem'), t('الحد الكائي', 'kth Term of a Binomial Expansion')] },
      { id: '11.5', ar: 'الاستقراء الرياضي', en: 'Mathematical Induction', topics: [t('مبدأ الاستقراء', 'Principle of Mathematical Induction'), t('إثبات العبارات', 'Proofs of Statements'), t('المبدأ المعمم', 'Generalized Principle of Mathematical Induction'), t('إثبات نظرية ذات الحدين', 'Proof of the Binomial Theorem')] },
      { id: '11.6', ar: 'أساسيات نظرية العد', en: 'Basics of Counting Theory', topics: [t('المبدأ الأساسي للعد', 'Fundamental Principle of Counting'), t('التباديل', 'Permutations'), t('التوافيق', 'Combinations'), t('التمييز بين التباديل والتوافيق', 'Distinguishing Permutations from Combinations')] },
      { id: '11.7', ar: 'أساسيات الاحتمالات', en: 'Basics of Probability', topics: [t('مفاهيم أساسية', 'Basic Concepts'), t('المتممات وأشكال فن', 'Complements and Venn Diagrams'), t('الأرجحية', 'Odds'), t('الأحداث المركبة', 'Compound Events'), t('احتمال ذات الحدين', 'Binomial Probability')] },
    ],
  },
  {
    id: 'A',
    ar: 'الملاحق',
    en: 'Appendices',
    status: 'soon',
    blurb: 'الصيغة القطبية للقطوع، دوران المحاور، وقوانين الهندسة.',
    sections: [
      { id: 'A.A', ar: 'الصيغة القطبية للقطوع المخروطية', en: 'Polar Form of Conic Sections', topics: [t('المعادلات والرسوم', 'Equations and Graphs'), t('التحويل إلى الصيغة الديكارتية', 'Conversion from Polar to Rectangular Form')] },
      { id: 'A.B', ar: 'دوران المحاور', en: 'Rotation of Axes', topics: [t('اشتقاق معادلات الدوران', 'Derivation of Rotation Equations'), t('تطبيق', 'Application of a Rotation Equation')] },
      { id: 'A.C', ar: 'قوانين الهندسة', en: 'Geometry Formulas', topics: [] },
    ],
  },
];

export const lessonSlug = (sectionId: string) => sectionId.replace('.', '-');

export function findSection(id: string) {
  for (const ch of chapters) {
    const i = ch.sections.findIndex((s) => s.id === id);
    if (i >= 0) return { chapter: ch, section: ch.sections[i], index: i };
  }
  return null;
}

// كل الدروس الجاهزة بالترتيب (للتنقل السابق/التالي)
export const readySections = chapters
  .filter((c) => c.status === 'ready')
  .flatMap((c) => c.sections.map((s) => ({ chapter: c, section: s })));
