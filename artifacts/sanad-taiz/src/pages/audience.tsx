import {
  ArrowLeft,
  Baby,
  BookOpen,
  Brain,
  Briefcase,
  Flower2,
  GraduationCap,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Wind,
} from 'lucide-react';
import { Link, useParams } from 'wouter';

const audiencePages = {
  children: {
    label: 'الأطفال', age: '٤–١١ سنة', icon: Baby, tone: 'mint',
    title: 'لكل شعور اسم، ولكل طفل مساحة',
    intro: 'صفحة تعريفية بموضوعات قد تساعد الأسرة على الإصغاء للطفل وفهم احتياجاته؛ لا تقدّم هذه النسخة خدمة مباشرة للأطفال.',
    topics: ['التعبير عن المشاعر', 'الخوف والقلق', 'التنمر', 'أنشطة ولعب توعوي', 'دعم الوالدين'],
    notice: 'هذه مساحة تعريفية وليست خدمة للأطفال. لا تتحقق هذه النسخة من موافقة ولي الأمر أو هويته إلكترونياً؛ لا تُرسل بيانات طفل ولا تستخدم طلب التواصل له قبل اعتماد إجراءات الحماية والموافقة.',
  },
  teens: {
    label: 'اليافعون', age: '١٢–١٧ سنة', icon: GraduationCap, tone: 'gold',
    title: 'مساحة تفهم التغيّرات التي تمر بها',
    intro: 'تعرّف إلى طرق مساندة في سنوات تتغيّر فيها المشاعر والعلاقات والدراسة، وخذ خطوتك التالية على مهل.',
    topics: ['الثقة بالنفس', 'التنمر', 'القلق الدراسي', 'العلاقات', 'التغيّرات النفسية'],
    notice: 'هذه مساحة تعريفية؛ لا تتحقق النسخة من موافقة ولي الأمر أو هويته إلكترونياً. لطلبات من هم دون 18 عاماً، ينبغي مشاركة ولي الأمر، ولا تُرسل بيانات حساسة عبر المنصة.',
  },
  'young-adults': {
    label: 'الشباب', age: '١٨–٢٩ سنة', icon: Sparkles, tone: 'peach',
    title: 'طريقك ليس مطلوباً أن يكون واضحاً كله',
    intro: 'مساحة للشباب للتعامل مع القلق والضغوط والعلاقات والأسئلة حول المستقبل وتقدير الذات.',
    topics: ['القلق', 'الضغوط', 'المستقبل', 'العلاقات', 'تقدير الذات'],
  },
  adults: {
    label: 'البالغون', age: '٣٠–٥٩ سنة', icon: Briefcase, tone: 'sage',
    title: 'مساحة تراعي أعباء الحياة وتغيّراتها',
    intro: 'مساندة عامة تراعي تداخل الحياة والعمل والأسرة، مع موارد حول الفقد والتكيّف والصحة النفسية.',
    topics: ['ضغوط الحياة والعمل', 'الأسرة', 'الفقد', 'التكيّف', 'الصحة النفسية'],
  },
  'older-adults': {
    label: 'كبار السن', age: '٦٠ سنة فأكثر', icon: Flower2, tone: 'lavender',
    title: 'خبرتك وحكايتك تستحقان مساحة',
    intro: 'مساحة هادئة تراعي الوحدة والفقد والتقاعد وأهمية الدعم الاجتماعي والتكيّف مع التغيّرات.',
    topics: ['الوحدة', 'الفقد', 'التقاعد', 'الدعم الاجتماعي', 'التغيّرات'],
  },
  family: {
    label: 'الأسرة ومقدمو الرعاية', age: 'مساحة مشتركة لكل الأعمار', icon: UsersRound, tone: 'cream',
    title: 'حين نساند بعضنا، تصبح الخطوة أيسر',
    intro: 'مساحة للأسرة ومقدمي الرعاية لبناء تواصل أكثر إنصاتاً، وفهم احتياجات من يرافقونهم عبر مراحل العمر.',
    topics: ['الإنصات والتواصل', 'مساندة الأطفال', 'مشاركة الرعاية', 'التعامل مع الضغوط', 'طلب دعم عند الحاجة'],
    notice: 'قبل تقديم أي خدمة لطفل، يلزم اعتماد موافقة ولي الأمر وإجراءات حماية الطفل والخصوصية. لا تتحقق هذه الواجهة من ذلك تقنياً.',
  },
} as const;

const nextSteps = [
  { title: 'مسارات الدعم', text: 'خطوات ذاتية منظمة يمكنك استكشافها بالسرعة التي تناسبك.', href: '/pathways', icon: HeartHandshake },
  { title: 'تمارين العناية بالذات', text: 'أنشطة عملية للتأمل والتنفس والاسترخاء.', href: '/self-care', icon: Wind },
  { title: 'مكتبة سند', text: 'تعرّف إلى المواد المقروءة والمرئية والمسموعة المنشورة.', href: '/library', icon: BookOpen },
  { title: 'طلب جلسة دعم', text: 'اطلب تواصلاً خاصاً مع فريق سند عبر النموذج المتاح.', href: '/booking', icon: MessageCircle },
];

export function AudiencePage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const audience = audiencePages[slug as keyof typeof audiencePages];

  if (!audience) {
    return <div className="sanad-container sanad-audience-missing"><h1>هذه المساحة غير متاحة</h1><p>اختر فئة من البوابة الرئيسية لاستكشاف المساحات الموجودة.</p><Link href="/" className="sanad-button sanad-button-primary">العودة للرئيسية <ArrowLeft size={17} /></Link></div>;
  }

  const Icon = audience.icon;
  const isMinorAudience = slug === 'children' || slug === 'teens';
  const visibleSteps = isMinorAudience ? nextSteps.filter((step) => step.title !== 'طلب جلسة دعم') : nextSteps;
  return (
    <div className={`sanad-audience-page sanad-audience-${audience.tone}`}>
      <section className="sanad-audience-hero">
        <div className="sanad-container sanad-audience-hero-inner">
          <div className="sanad-audience-hero-copy">
            <Link href="/#audiences" className="sanad-audience-back"><ArrowLeft size={15} /> كل الفئات</Link>
            <div className="sanad-eyebrow sanad-eyebrow-dark"><span /> مساحة مخصصة لـ{audience.label}</div>
            <span className="sanad-audience-age">{audience.age}</span>
            <h1>{audience.title}</h1>
            <p>{audience.intro}</p>
            <Link href="/pathways" className="sanad-button sanad-button-primary">ابدأ باستكشاف المسارات <ArrowLeft size={17} /></Link>
          </div>
          <div className="sanad-audience-emblem" aria-hidden="true"><div className="sanad-emblem-ring" /><div className="sanad-emblem-disc"><Icon size={52} strokeWidth={1.35} /></div><span className="sanad-emblem-caption">سند معك</span><span className="sanad-emblem-orbit" /></div>
        </div>
      </section>

      <section className="sanad-section sanad-audience-concerns">
        <div className="sanad-container">
          <div className="sanad-section-heading"><div><div className="sanad-eyebrow sanad-eyebrow-dark"><span /> موضوعات قريبة من حياتك</div><h2>قد تبدأ المساحة من أيٍّ من هذه النقاط</h2></div><p>هذه مداخل عامة للتعرّف، ويمكنك اختيار ما يلامس احتياجك.</p></div>
          <div className="sanad-concern-grid">{audience.topics.map((topic, index) => <div className="sanad-concern-card" key={topic}><span>٠{index + 1}</span><Sparkles size={17} /><strong>{topic}</strong></div>)}</div>
        </div>
      </section>

      <section className="sanad-section sanad-audience-starts">
        <div className="sanad-container">
          <div className="sanad-section-heading"><div><div className="sanad-eyebrow sanad-eyebrow-dark"><span /> أدوات ومسارات سند</div><h2>اختر خطوتك القادمة</h2></div><p>كل رابط يوصلك إلى خدمة موجودة في المنصة.</p></div>
          <div className="sanad-audience-steps">{visibleSteps.map((step) => { const StepIcon = step.icon; return <Link key={step.href} href={step.href} className="sanad-audience-step"><span className="sanad-step-icon"><StepIcon size={23} /></span><strong>{step.title}</strong><p>{step.text}</p><span className="sanad-card-link">اكتشف المزيد <ArrowLeft size={15} /></span></Link>; })}</div>
        </div>
      </section>

      {(slug === 'children' || slug === 'teens' || slug === 'family') && <section className="sanad-section sanad-guardian-section"><div className="sanad-container"><div className="sanad-guardian-note"><ShieldCheck size={23} /><div><strong>حماية الطفل والخصوصية أولاً</strong><p>{'notice' in audience ? audience.notice : 'يلزم اعتماد موافقة ولي الأمر وإجراءات الحماية قبل تقديم خدمة مباشرة لطفل.'}</p></div></div></div></section>}

      <section className="sanad-audience-help"><div className="sanad-container sanad-audience-help-inner"><div><div className="sanad-eyebrow"><span /> خطوة على راحتك</div><h2>لا يلزم أن تحمل كل شيء وحدك.</h2><p>إن احتجت إلى مساعدة مباشرة، اطّلع على الخيارات المتاحة أو استعن بمساحة الأسرة.</p></div><div className="sanad-audience-help-actions">{isMinorAudience ? <Link href="/audiences/family" className="sanad-button sanad-button-light">مساحة الأسرة <UsersRound size={17} /></Link> : <Link href="/booking" className="sanad-button sanad-button-light">طلب تواصل <MessageCircle size={17} /></Link>}<Link href="/help-now" className="sanad-button sanad-button-outline-light">المساعدة العاجلة <ShieldCheck size={17} /></Link></div></div></section>
    </div>
  );
}
