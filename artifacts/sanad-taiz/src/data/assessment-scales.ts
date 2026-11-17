// تعريفات وبيانات مقاييس التقييم.
export type ScaleScore = {
  type: 'score';
  title: string;
  subtitle: string;
  desc: string;
  color: string;
  icon: 'moon'|'pulse'|'heart'|'shield'|'brain'|'book';
  questions: string[];
  options: string[];
  scoring: (score: number) => string;
};

export type ScaleCategory = {
  type: 'category';
  title: string;
  subtitle: string;
  desc: string;
  color: string;
  icon: 'brain'|'book';
  questions: Array<{
    text: string;
    options: Array<{ label: string; category: string }>;
  }>;
  categories: Record<string, { name: string; desc: string }>;
  scoring: (answers: string[]) => { category: string; name: string; desc: string };
};

export type Scale = ScaleScore | ScaleCategory;

export const scalesData: Record<string, Scale> = {
  phq9: {
    type: 'score',
    title: 'PHQ-9',
    subtitle: 'الاكتئاب والحيوية',
    desc: 'درجة لقياس أعراض الاكتئاب خلال الأسبوعين الماضيين.',
    color: '#1a5f4a',
    icon: 'moon',
    questions: [
      'قلة الاهتمام أو المتعة في ممارسة الأنشطة',
      'الشعور بالحزن أو الإحباط أو اليأس',
      'صعوبة في النوم أو النوم لفترات طويلة',
      'الشعور بالتعب أو قلة الطاقة',
      'قلة الشهية أو الأكل بشكل مفرط',
      'الشعور بالسوء تجاه نفسك أو أنك فاشل',
      'صعوبة في التركيز على الأشياء',
      'التحرك أو التحدث ببطء ملحوظ، أو العكس',
      'أفكار بأنك أفضل ميتاً أو إيذاء نفسك'
    ],
    options: ['أبداً (0)', 'عدة أيام (1)', 'أكثر من النصف (2)', 'تقريباً كل يوم (3)'],
    scoring: (score) => {
      if (score <= 4) return 'لا توجد أعراض تذكر. استمر في الاعتناء بنفسك.';
      if (score <= 9) return 'أعراض خفيفة. قد يفيدك التحدث مع شخص تثق به أو تجربة مسارات الدعم.';
      if (score <= 14) return 'أعراض متوسطة. ننصحك بالتحدث مع مختص للحصول على دعم إضافي.';
      if (score <= 19) return 'أعراض شديدة نسبياً. من المهم مراجعة مختص صحي نفسي.';
      return 'أعراض شديدة. نرجو التواصل مع مختص أو طلب جلسة خاصة في أقرب وقت.';
    }
  },
  gad7: {
    type: 'score',
    title: 'GAD-7',
    subtitle: 'القلق والتوتر',
    desc: 'درجة لقياس أعراض القلق خلال الأسبوعين الماضيين.',
    color: '#e87722',
    icon: 'pulse',
    questions: [
      'الشعور بالعصبية أو القلق أو التوتر',
      'عدم القدرة على التوقف عن القلق',
      'القلق المفرط بشأن أشياء مختلفة',
      'صعوبة الاسترخاء',
      'الشعور بالتململ لدرجة صعوبة الجلوس',
      'سهولة الانزعاج أو الغضب',
      'الشعور بالخوف كما لو أن شيئاً فظيعاً سيحدث'
    ],
    options: ['أبداً (0)', 'عدة أيام (1)', 'أكثر من النصف (2)', 'تقريباً كل يوم (3)'],
    scoring: (score) => {
      if (score <= 4) return 'مستوى القلق منخفض. أنت بخير.';
      if (score <= 9) return 'قلق خفيف. جرّب تمارين التنفس ومسارات الدعم الذاتي.';
      if (score <= 14) return 'قلق متوسط. يفضل التحدث مع مختص للتعامل معه.';
      return 'قلق شديد. نوصي بطلب جلسة خاصة مع فريق سند.';
    }
  },
  who5: {
    type: 'score',
    title: 'WHO-5',
    subtitle: 'العافية اليومية',
    desc: 'مقياس بسيط للشعور بالرضا والعافية خلال الأسبوعين الماضيين.',
    color: '#f5d76e',
    icon: 'heart',
    questions: [
      'شعرت بالبهجة والسعادة',
      'شعرت بالهدوء والاسترخاء',
      'شعرت بالنشاط والحيوية',
      'استيقظت وأنا أشعر بالراحة',
      'كانت حياتي اليومية مليئة بالأشياء التي تهمني'
    ],
    options: ['في كل الأوقات (5)', 'معظم الوقت (4)', 'أكثر من النصف (3)', 'أقل من النصف (2)', 'من وقت لآخر (1)', 'أبداً (0)'],
    scoring: (score) => {
      const percentage = score * 4;
      if (percentage >= 50) return 'لديك مستوى جيد من العافية النفسية. استمر في الأنشطة التي تسعدك.';
      return 'قد تشعر بانخفاض في العافية. تواصل مع شخص تثق به أو جرّب مسارات الدعم.';
    }
  },
  pcl5: {
    type: 'score',
    title: 'PCL-5',
    subtitle: 'أثر التجارب الصعبة',
    desc: 'يقيس الأعراض المرتبطة بالضغط النفسي بعد التجارب الصعبة.',
    color: '#c4453a',
    icon: 'shield',
    questions: [
      'ذكريات مزعجة متكررة عن التجربة الصعبة',
      'الشعور بأن التجربة تتكرر (كالكابوس)',
      'تجنب ذكريات أو أماكن تذكرك بالتجربة',
      'الشعور بالخدر العاطفي أو الابتعاد عن الآخرين',
      'الشعور بالحذر الشديد أو سهولة الإثارة',
      'صعوبة في النوم أو التركيز',
      'الشعور بالذنب أو إلقاء اللوم على نفسك'
    ],
    options: ['أبداً (0)', 'قليلاً (1)', 'بشكل معتدل (2)', 'كثيراً (3)', 'شديد (4)'],
    scoring: (score) => {
      if (score <= 9) return 'أعراض خفيفة. التجارب الصعبة تؤثر فينا، لكنك تتعامل معها بشكل جيد.';
      if (score <= 19) return 'أعراض متوسطة. قد يكون التحدث مع مختص مفيداً لتجاوز هذه المشاعر.';
      return 'أعراض ملحوظة. نوصي بالتواصل مع مختص دعم نفسي للتعافي.';
    }
  },
  personality: {
    type: 'category',
    title: 'أنماط الشخصية',
    subtitle: 'MBTI مبسّط',
    desc: 'اكتشف نمط شخصيتك من خلال 8 أسئلة. ليس تشخيصاً، بل أداة فهم ذاتي.',
    color: '#8b5cf6',
    icon: 'brain',
    questions: [
      {
        text: 'في الحفلات والمناسبات، أنت...',
        options: [
          { label: 'تتفاعل مع الكثيرين وتستمتع', category: 'E' },
          { label: 'تبقى مع دائرة صغيرة وتستنزف', category: 'I' },
        ],
      },
      {
        text: 'بعد يوم طويل، تحتاج...',
        options: [
          { label: 'الخروج مع الأصدقاء', category: 'E' },
          { label: 'وقتاً هادئاً وحدك', category: 'I' },
        ],
      },
      {
        text: 'عند تعلم شيء جديد، تفضل...',
        options: [
          { label: 'التفاصيل والأمثلة الواقعية', category: 'S' },
          { label: 'الصورة الكبيرة والأفكار', category: 'N' },
        ],
      },
      {
        text: 'عند اتخاذ قرار، تعتمد على...',
        options: [
          { label: 'المنطق والتحليل', category: 'T' },
          { label: 'المشاعر وتأثير القرار', category: 'F' },
        ],
      },
      {
        text: 'في العمل، تفضل...',
        options: [
          { label: 'خطة واضحة وجدول', category: 'J' },
          { label: 'مرونة وتكيّف', category: 'P' },
        ],
      },
      {
        text: 'عند التخطيط لرحلة، أنت...',
        options: [
          { label: 'تخطط لكل التفاصيل', category: 'J' },
          { label: 'تتركها للعفوية', category: 'P' },
        ],
      },
      {
        text: 'في النقاشات، أنت...',
        options: [
          { label: 'تركز على الحقائق', category: 'S' },
          { label: 'تركز على الاحتمالات', category: 'N' },
        ],
      },
      {
        text: 'عند حل مشكلة، تبدأ بـ...',
        options: [
          { label: 'تحليل الأسباب', category: 'T' },
          { label: 'فهم مشاعر الأطراف', category: 'F' },
        ],
      },
    ],
    categories: {
      E: { name: 'انبساطي', desc: 'تستمد طاقتك من التفاعل مع الآخرين' },
      I: { name: 'انطوائي', desc: 'تستمد طاقتك من الوقت الهادئ' },
      S: { name: 'حسي', desc: 'تركز على الحقائق والتفاصيل' },
      N: { name: 'حدسي', desc: 'تركز على الاحتمالات والأفكار' },
      T: { name: 'مفكر', desc: 'تعتمد على المنطق في القرارات' },
      F: { name: 'عاطفي', desc: 'تعتمد على القيم والمشاعر' },
      J: { name: 'حازم', desc: 'تفضل التخطيط والتنظيم' },
      P: { name: 'مرن', desc: 'تفضل المرونة والتكيّف' },
    },
    scoring: (answers: string[]) => {
      const counts: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
      answers.forEach(a => { if (counts[a] !== undefined) counts[a]++; });

      const result =
        (counts.E >= counts.I ? 'E' : 'I') +
        (counts.S >= counts.N ? 'S' : 'N') +
        (counts.T >= counts.F ? 'T' : 'F') +
        (counts.J >= counts.P ? 'J' : 'P');

      const names: Record<string, string> = {
        INTJ: 'المخطط الاستراتيجي', INTP: 'المفكر', ENTJ: 'القائد', ENTP: 'المبتكر',
        INFJ: 'المستشار', INFP: 'المثالي', ENFJ: 'المعلم', ENFP: 'الملهم',
        ISTJ: 'المنظم', ISFJ: 'الحامي', ESTJ: 'المدير', ESFJ: 'المعطاء',
        ISTP: 'الحرفي', ISFP: 'الفنان', ESTP: 'المغامر', ESFP: 'الممتع',
      };

      return {
        category: result,
        name: names[result] || result,
        desc: `نمطك: ${result}. ${counts.E >= counts.I ? 'تستمد طاقتك من التفاعل' : 'تستمد طاقتك من الهدوء'}، ${counts.S >= counts.N ? 'وتركز على الحقائق' : 'وتركز على الاحتمالات'}، ${counts.T >= counts.F ? 'وتقرر بالمنطق' : 'وتقرر بالمشاعر'}، ${counts.J >= counts.P ? 'وتفضل التخطيط' : 'وتفضل المرونة'}.`,
      };
    },
  },

  learning: {
    type: 'category',
    title: 'أنماط التعلم',
    subtitle: 'VARK',
    desc: 'اكتشف طريقة تعلّمك المفضلة. 12 سؤالاً يساعدك على فهم أسلوبك.',
    color: '#e87722',
    icon: 'book',
    questions: [
      {
        text: 'عند تعلم شيء جديد، تفضل...',
        options: [
          { label: 'مشاهدة فيديو أو رسم', category: 'V' },
          { label: 'الاستماع لشرح', category: 'A' },
          { label: 'قراءة كتاب', category: 'R' },
          { label: 'التجربة العملية', category: 'K' },
        ],
      },
      {
        text: 'عند تذكر معلومة، تعتمد على...',
        options: [
          { label: 'الصور والرسوم', category: 'V' },
          { label: 'الصوت والكلمات', category: 'A' },
          { label: 'الملاحظات المكتوبة', category: 'R' },
          { label: 'ما فعلته بيدك', category: 'K' },
        ],
      },
      {
        text: 'في الصف، تفضل...',
        options: [
          { label: 'السبورة والعروض', category: 'V' },
          { label: 'شرح المعلم', category: 'A' },
          { label: 'الكتاب المدرسي', category: 'R' },
          { label: 'الأنشطة العملية', category: 'K' },
        ],
      },
      {
        text: 'عند تعلم مهارة جديدة، تفضل...',
        options: [
          { label: 'رؤية شخص يفعلها', category: 'V' },
          { label: 'سماع وصفها', category: 'A' },
          { label: 'قراءة خطواتها', category: 'R' },
          { label: 'تجربتها بنفسك', category: 'K' },
        ],
      },
      {
        text: 'عند التخطيط لرحلة، تفضل...',
        options: [
          { label: 'الخريطة', category: 'V' },
          { label: 'الاستماع لتجارب الآخرين', category: 'A' },
          { label: 'قراءة الدليل', category: 'R' },
          { label: 'التجول والاكتشاف', category: 'K' },
        ],
      },
      {
        text: 'عند حل مشكلة، تفضل...',
        options: [
          { label: 'رسم مخطط', category: 'V' },
          { label: 'التحدث مع شخص', category: 'A' },
          { label: 'كتابة الحل', category: 'R' },
          { label: 'تجربة الحلول', category: 'K' },
        ],
      },
      {
        text: 'في المحاضرات، تفضل...',
        options: [
          { label: 'الشرائح والصور', category: 'V' },
          { label: 'الإلقاء', category: 'A' },
          { label: 'الملخصات المكتوبة', category: 'R' },
          { label: 'التطبيق العملي', category: 'K' },
        ],
      },
      {
        text: 'عند شراء جهاز، تعتمد على...',
        options: [
          { label: 'الصور والفيديو', category: 'V' },
          { label: 'شرح البائع', category: 'A' },
          { label: 'المواصفات المكتوبة', category: 'R' },
          { label: 'تجربته بنفسك', category: 'K' },
        ],
      },
      {
        text: 'عند تعلم وصفة، تفضل...',
        options: [
          { label: 'مشاهدة فيديو', category: 'V' },
          { label: 'الاستماع للشرح', category: 'A' },
          { label: 'قراءة الخطوات', category: 'R' },
          { label: 'التجربة', category: 'K' },
        ],
      },
      {
        text: 'عند الدراسة، تفضل...',
        options: [
          { label: 'الخرائط الذهنية', category: 'V' },
          { label: 'القراءة بصوت عال', category: 'A' },
          { label: 'الملاحظات المكتوبة', category: 'R' },
          { label: 'الحركة والمشي', category: 'K' },
        ],
      },
      {
        text: 'عند تقديم عرض، تفضل...',
        options: [
          { label: 'الصور والرسوم', category: 'V' },
          { label: 'الإلقاء', category: 'A' },
          { label: 'النقاط المكتوبة', category: 'R' },
          { label: 'الأنشطة التفاعلية', category: 'K' },
        ],
      },
      {
        text: 'عند حفظ معلومة، تفضل...',
        options: [
          { label: 'الربط بالصور', category: 'V' },
          { label: 'التكرار بصوت', category: 'A' },
          { label: 'الكتابة', category: 'R' },
          { label: 'الربط بحركة', category: 'K' },
        ],
      },
    ],
    categories: {
      V: { name: 'بصري', desc: 'تتعلم بالمشاهدة والصور والرسوم' },
      A: { name: 'سمعي', desc: 'تتعلم بالاستماع والشرح الصوتي' },
      R: { name: 'قراءة/كتابة', desc: 'تتعلم بالقراءة والملاحظات' },
      K: { name: 'حركي', desc: 'تتعلم بالتجربة والحركة' },
    },
    scoring: (answers: string[]) => {
      const counts: Record<string, number> = { V: 0, A: 0, R: 0, K: 0 };
      answers.forEach(a => { if (counts[a] !== undefined) counts[a]++; });

      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const top = sorted[0][0];
      const names: Record<string, string> = { V: 'بصري', A: 'سمعي', R: 'قراءة/كتابة', K: 'حركي' };
      const descs: Record<string, string> = {
        V: 'أنت تتعلم بشكل أفضل عند رؤية المعلومات (صور، رسوم، فيديو).',
        A: 'أنت تتعلم بشكل أفضل عند سماع المعلومات (شرح، تسجيلات، مناقشة).',
        R: 'أنت تتعلم بشكل أفضل بالقراءة والكتابة (ملاحظات، كتب، مقالات).',
        K: 'أنت تتعلم بشكل أفضل بالتجربة العملية والحركة.',
      };

      return {
        category: top,
        name: names[top],
        desc: descs[top] + ` (النتيجة: V=${counts.V}, A=${counts.A}, R=${counts.R}, K=${counts.K})`,
      };
    },
  },

};
