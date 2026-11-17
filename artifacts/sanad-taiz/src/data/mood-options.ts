// خيارات الحالة المزاجية المستخدمة في الواجهة الرئيسية.
export const moodOptions = [
  { key: 'happy',   emoji: '😊', label: 'سعيد',  msg: 'رائع! شارك هذا الشعور مع من تحب، أو اكتشف مساراً يزيد يومك إشراقاً.', href: '/pathways', cta: 'اكتشف المسارات', color: '#16a34a' },
  { key: 'calm',    emoji: '😌', label: 'هادئ',  msg: 'جميل. احتفظ بهذا الهدوء مع تمرين كتابة أو وقفة مع النفس.', href: '/safe-space', cta: 'اكتب لنفسك', color: '#0ea5e9' },
  { key: 'neutral', emoji: '😐', label: 'محايد', msg: 'لا بأس. جرّب مساراً خفيفاً يلائم يومك.', href: '/pathways', cta: 'اختر مساراً', color: '#64748b' },
  { key: 'sad',     emoji: '😔', label: 'حزين',  msg: 'نحن هنا. جرّب مسار الحزن، أو اكتب ما تشعر به في مساحة آمنة.', href: '/pathways', cta: 'افتح مسار الحزن', color: '#475569' },
  { key: 'anxious', emoji: '😰', label: 'قلق',   msg: 'خذ نفساً. مسار القلق فيه خطوات هادئة تساعدك.', href: '/pathways', cta: 'افتح مسار القلق', color: '#f59e0b' },
  { key: 'angry',   emoji: '😡', label: 'غاضب',  msg: 'من حقك أن تشعر. مسار الغضب فيه مساحة لفهم ما يشتعل داخلك.', href: '/pathways', cta: 'افتح مسار الغضب', color: '#dc2626' },
  { key: 'tired',   emoji: '😴', label: 'متعب',  msg: 'التعب إشارة، لا ضعف. مسار الإرهاق فيه خطوات لتخفيف الحمل.', href: '/pathways', cta: 'افتح مسار الإرهاق', color: '#7c3aed' },
  { key: 'scattered', emoji: '🤔', label: 'مشتت', msg: 'خذ لحظة. تقنية 5-4-3-2-1 قد تساعدك على العودة للحظة.', href: '/assessment', cta: 'جرّب تمريناً', color: '#0891b2' },
  { key: 'hopeless', emoji: '😢', label: 'يائس', msg: 'شعور صعب، لكنك لستَ وحدك. مسار الحزن فيه مساحة، وأرقام الطوارئ متاحة إن احتجت.', href: '/help-now', cta: 'تواصل مع شخص', color: '#991b1b', isCrisis: true },
  { key: 'frustrated', emoji: '😤', label: 'محبط', msg: 'الإحباط طاقة. مسار الغضب فيه خطوات لتحويلها إلى دفعة إيجابية.', href: '/pathways', cta: 'افتح مسار الغضب', color: '#ea580c' },
  { key: 'lonely',  emoji: '🥺', label: 'وحيد',  msg: 'الوحدة صعبة، لكنها لا تعني أنك لستَ محبوباً. اكتب أو تواصل معنا.', href: '/booking', cta: 'اطلب جلسة', color: '#7c2d12', isCrisis: true },
  { key: 'grateful', emoji: '🥰', label: 'ممتن', msg: 'الامتنان يغذي القلب. دوّن 3 أشياء أنت ممتن لها اليوم.', href: '/safe-space', cta: 'اكتب امتنانك', color: '#db2777' },
];
