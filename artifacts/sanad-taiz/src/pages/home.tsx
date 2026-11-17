import {
  ArrowLeft,
  AudioLines,
  Baby,
  BookOpen,
  Briefcase,
  Brain,
  Check,
  CircleHelp,
  Compass,
  Flower2,
  GraduationCap,
  Headphones,
  Heart,
  HeartHandshake,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Video,
  Wind,
} from 'lucide-react';
import { useListPublicPathways, useListPublicResources } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { getPathwayImage } from '@/config/pathway-images';
import { LoadingBlock, ErrorBlock, EmptyBlock } from '@/components/page-ui';
import { MoodScale, AssessmentPromo, SelfCarePromo } from '@/components/home-widgets';

const audiences = [
  {
    slug: 'children',
    label: 'الأطفال',
    age: '٤–١١ سنة',
    icon: Baby,
    color: 'mint',
    description: 'مساحة لطيفة للتعبير عن المشاعر وفهمها، مع إرشاد يساند الوالدين.',
    topics: ['المشاعر', 'الخوف', 'التنمر', 'اللعب التوعوي'],
  },
  {
    slug: 'teens',
    label: 'اليافعون',
    age: '١٢–١٧ سنة',
    icon: GraduationCap,
    color: 'gold',
    description: 'مساندة قريبة في سنوات التغيّر، المدرسة، الصداقات والثقة بالنفس.',
    topics: ['الثقة بالنفس', 'القلق الدراسي', 'العلاقات', 'التغيّرات'],
  },
  {
    slug: 'young-adults',
    label: 'الشباب',
    age: '١٨–٢٩ سنة',
    icon: Sparkles,
    color: 'peach',
    description: 'خطوات عملية للتعامل مع القلق والضغوط والعلاقات والأسئلة حول المستقبل.',
    topics: ['القلق', 'الضغوط', 'المستقبل', 'تقدير الذات'],
  },
  {
    slug: 'adults',
    label: 'البالغون',
    age: '٣٠–٥٩ سنة',
    icon: Briefcase,
    color: 'sage',
    description: 'موارد تراعي تداخل العمل والأسرة والفقد والتكيّف مع تغيّرات الحياة.',
    topics: ['العمل', 'الأسرة', 'الفقد', 'التكيّف'],
  },
  {
    slug: 'older-adults',
    label: 'كبار السن',
    age: '٦٠ سنة فأكثر',
    icon: Flower2,
    color: 'lavender',
    description: 'مساحة تراعي الوحدة والتقاعد والفقد وأهمية الروابط والدعم الاجتماعي.',
    topics: ['الوحدة', 'التقاعد', 'الدعم الاجتماعي', 'التغيّرات'],
  },
  {
    slug: 'family',
    label: 'الأسرة ومقدمو الرعاية',
    age: 'لكل الأعمار',
    icon: UsersRound,
    color: 'cream',
    description: 'إرشاد للأسرة ومقدمي الرعاية كي تكون المساندة أقرب وأكثر تفهّماً.',
    topics: ['التواصل', 'دعم الأطفال', 'الرعاية', 'الإنصات'],
  },
];

const supportServices = [
  { title: 'التوعية والتثقيف النفسي', text: 'معلومات مبسطة تساعدك على فهم ما تمرّ به.', icon: Brain, href: '/library', label: 'استكشف المكتبة' },
  { title: 'الدعم النفسي الأولي', text: 'خطوات أولية ومعلومات المساندة عند الحاجة.', icon: HeartHandshake, href: '/help-now', label: 'خيارات المساعدة' },
  { title: 'جلسات الدعم الفردي', text: 'قدّم طلب تواصل عبر النموذج؛ ولا يُعد الطلب تأكيداً لموعد.', icon: MessageCircle, href: '/booking', label: 'طلب جلسة' },
  { title: 'الإرشاد الأسري والوالدي', text: 'مساحة موجهة للأسرة ومقدمي الرعاية.', icon: UsersRound, href: '/audiences/family', label: 'مساحة الأسرة' },
  { title: 'الأنشطة والتمارين النفسية', text: 'أنشطة عملية للاستخدام الذاتي على مهل.', icon: Sparkles, href: '/self-care', label: 'التمارين' },
  { title: 'الاسترخاء والتنفس', text: 'تمارين للتنفس والاسترخاء، مع مواد صوتية عند توفرها.', icon: Wind, href: '/self-care', label: 'ابدأ تمريناً' },
  { title: 'المساندة الجماعية والمجتمعية', text: 'استكشف المواد القصصية للتأمل؛ لا تتيح المنصة حالياً جلسات جماعية للحجز.', icon: Heart, href: '/stories', label: 'قصص المجتمع' },
  { title: 'المكتبة النفسية والمعرفية', text: 'تظهر في المكتبة المواد التي نُشرت فعلياً فقط.', icon: BookOpen, href: '/library', label: 'المكتبة' },
];

const youthTopics = [
  'تحديات بناء الثقة بالنفس',
  'كيف أتعامل مع القلق؟',
  'التعامل مع ضغوط الدراسة',
  'العلاقات الاجتماعية',
  'اكتشاف نقاط القوة',
  'مساحة للتعبير عن المشاعر',
];

export function Home() {
  const pathways = useListPublicPathways();
  const resources = useListPublicResources();
  const featuredPathways = (pathways.data || []).slice(0, 3);
  const video = (resources.data || []).find((resource) => resource.kind === 'video');
  const audio = (resources.data || []).find((resource) => resource.kind === 'audio');
  const reading = (resources.data || []).find((resource) => resource.kind !== 'video' && resource.kind !== 'audio');
  const readingTitle = reading?.title || (resources.isLoading ? 'جارٍ تحميل المكتبة' : resources.isError ? 'تعذّر تحميل المكتبة' : 'لا توجد مواد مكتوبة منشورة حالياً');
  const readingSummary = reading?.summary || (resources.isLoading ? 'يرجى الانتظار حتى تظهر المواد المتاحة.' : resources.isError ? 'تعذّر جلب المواد؛ أعد المحاولة من صفحة المكتبة.' : 'تظهر هنا المواد بعد نشرها واعتمادها.');
  const videoTitle = video?.title || (resources.isLoading ? 'جارٍ تحميل المحتوى المرئي' : resources.isError ? 'تعذّر تحميل المحتوى المرئي' : 'لا توجد مواد مرئية منشورة حالياً');
  const videoSummary = video?.summary || (resources.isLoading ? 'يرجى الانتظار حتى تظهر المواد المتاحة.' : resources.isError ? 'تعذّر جلب المواد المرئية حالياً.' : 'تظهر هنا المقاطع بعد نشرها واعتمادها.');
  const audioTitle = audio?.title || (resources.isLoading ? 'جارٍ تحميل المحتوى المسموع' : resources.isError ? 'تعذّر تحميل المحتوى المسموع' : 'لا توجد مواد مسموعة منشورة حالياً');
  const audioSummary = audio?.summary || (resources.isLoading ? 'يرجى الانتظار حتى تظهر المواد المتاحة.' : resources.isError ? 'تعذّر جلب المواد المسموعة حالياً.' : 'تظهر هنا التسجيلات بعد نشرها واعتمادها.');

  return (
    <div className="sanad-home page-enter">
      <section className="sanad-hero" aria-labelledby="sanad-hero-title">
        <div className="sanad-hero-inner">
          <div className="sanad-hero-copy">
            <div className="sanad-eyebrow"><span /> رفيقك نحو الصحة النفسية</div>
            <h1 id="sanad-hero-title">سند تعز –<br /><span>مساحة آمنة لكل قلب</span></h1>
            <p id="about-sanad" className="sanad-hero-description">
              لأن الصحة النفسية حق للجميع، نرافقك في كل مرحلة من مراحل حياتك، ونقدم لك المعرفة والمساندة والدعم الذي تحتاجه.
            </p>
            <div className="sanad-hero-actions">
              <a href="#support-services" className="sanad-button sanad-button-primary">اكتشف خدمات الدعم <ArrowLeft size={18} /></a>
              <Link href="/help-now" className="sanad-button sanad-button-light">أحتاج مساعدة الآن <HeartHandshake size={18} /></Link>
              <a href="#about-sanad" className="sanad-button sanad-button-text">تعرّف على سند <ArrowLeft size={16} /></a>
            </div>
            <div className="sanad-hero-assurances" aria-label="معلومات مهمة">
              <span><ShieldCheck size={16} /> مساحة مجتمعية للتعلّم والمساندة</span>
              <span><Check size={16} /> خيارات تناسب مراحل عمرية مختلفة</span>
            </div>
          </div>
          <div className="sanad-hero-visual" aria-hidden="true">
            <div className="sanad-hero-orbit sanad-orbit-one" />
            <div className="sanad-hero-orbit sanad-orbit-two" />
            <div className="sanad-hero-platform" />
            <div className="sanad-hero-art-card">
              <img src="/manus-storage/async-images/l6enD2RqaCrbJ2tMba6wg3/image-1.webp" alt="" fetchPriority="high" />
            </div>
            <div className="sanad-hero-float sanad-hero-float-top"><Heart size={16} fill="currentColor" /> لكل مرحلة حكاية</div>
            <div className="sanad-hero-float sanad-hero-float-bottom"><span className="sanad-float-dot" /> المعرفة · المساندة · الأمل</div>
          </div>
        </div>
        <a href="#audiences" className="sanad-scroll-cue" aria-label="انتقل إلى الفئات العمرية"><span /> ابدأ من هنا</a>
      </section>

      <section id="audiences" className="sanad-section sanad-audience-section">
        <div className="sanad-container">
          <div className="sanad-section-heading">
            <div>
              <div className="sanad-eyebrow sanad-eyebrow-dark"><span /> بوابة واحدة للجميع</div>
              <h2>اختر المرحلة الأقرب إليك</h2>
            </div>
            <p>احتياجاتنا تتغيّر مع العمر. ابدأ من المساحة التي تشبه يومك.</p>
          </div>
          <div className="sanad-audience-grid">
            {audiences.map((audience, index) => {
              const Icon = audience.icon;
              return (
                <Link key={audience.slug} href={`/audiences/${audience.slug}`} className={`sanad-audience-card sanad-tone-${audience.color}`}>
                  <div className="sanad-audience-topline"><span>٠{index + 1}</span><span>{audience.age}</span></div>
                  <div className="sanad-audience-icon"><Icon size={25} strokeWidth={1.8} /></div>
                  <h3>{audience.label}</h3>
                  <p>{audience.description}</p>
                  <div className="sanad-topic-list">{audience.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
                  <span className="sanad-card-link">ادخل المساحة <ArrowLeft size={16} /></span>
                </Link>
              );
            })}
          </div>
          <p className="sanad-section-note"><ShieldCheck size={16} /> مساحات سند للتوعية والمساندة العامة، ولا تحل محل المختص النفسي.</p>
        </div>
      </section>

      <section id="support-services" className="sanad-section sanad-services-section">
        <div className="sanad-container">
          <div className="sanad-section-heading">
            <div><div className="sanad-eyebrow sanad-eyebrow-dark"><span /> خدمات الدعم</div><h2>اختر نوع المساندة الذي يناسبك</h2></div>
            <p>يمكنك استكشاف ما هو متاح، والانتقال إلى الخطوة التي ترتاح لها.</p>
          </div>
          <div className="sanad-services-grid">
            {supportServices.map((service) => {
              const Icon = service.icon;
              return <Link href={service.href} className="sanad-service-card" key={service.title}>
                <span className="sanad-service-icon"><Icon size={23} strokeWidth={1.8} /></span>
                <span className="sanad-service-copy"><strong>{service.title}</strong><small>{service.text}</small><b>{service.label} <ArrowLeft size={14} /></b></span>
              </Link>;
            })}
          </div>
        </div>
      </section>

      <section className="sanad-section sanad-family-section">
        <div className="sanad-container sanad-family-layout">
          <div className="sanad-family-copy">
            <div className="sanad-eyebrow"><span /> مساحة الطفل والأسرة</div>
            <h2>مشاعر الطفل تستحق أن تُسمع</h2>
            <p>مداخل توعوية للأسرة حول فهم المشاعر والخوف والقلق والتنمر. وتبقى المواد الموجهة للأطفال مرتبطة بما ينشر ويُصنّف فعلياً في المكتبة.</p>
            <ul className="sanad-check-list">
              <li><Check size={16} /> موضوعات للتعرّف إلى مشاعر الطفل والخوف والقلق والتنمر</li>
              <li><Check size={16} /> إرشادات عامة للوالدين حول فهم السلوك والإنصات للطفل</li>
              <li><Video size={16} /> تعرض المكتبة المرئية ما نُشر فعلياً؛ لا تُعد المادة مخصصة للأطفال ما لم تُصنّف لذلك</li>
              <li><Check size={16} /> علامات عامة للتأمل في الوقت المناسب لطلب مساعدة مختص</li>
            </ul>
            <Link href="/audiences/children" className="sanad-button sanad-button-light">اكتشف مساحة الأطفال <ArrowLeft size={17} /></Link>
          </div>
          <div className="sanad-family-side">
            <div className="sanad-family-orb" aria-hidden="true"><Baby size={48} strokeWidth={1.2} /></div>
            <div className="sanad-family-message"><ShieldCheck size={21} /><div><strong>حماية الطفل قبل الخدمة</strong><p>هذه مساحة تعريفية فقط؛ لا تتحقق المنصة حالياً من موافقة ولي الأمر. يلزم اعتماد إجراءات الحماية قبل أي تواصل مباشر مع قاصر.</p></div></div>
            <Link href="/audiences/family" className="sanad-family-link">مساحة للأسرة ومقدمي الرعاية <ArrowLeft size={15} /></Link>
          </div>
        </div>
      </section>

      <section className="sanad-section sanad-youth-section">
        <div className="sanad-container sanad-youth-layout">
          <div className="sanad-youth-intro">
            <div className="sanad-eyebrow sanad-eyebrow-dark"><span /> لليافعين والشباب</div>
            <h2>مساحتك. صوتك. خطوتك القادمة.</h2>
            <p>تجربة أخفّ وأكثر حيوية لاستكشاف المشاعر والضغوط والعلاقات، من دون أحكام أو استعجال.</p>
            <Link href="/audiences/teens" className="sanad-button sanad-button-primary">ادخل مساحة اليافعين <ArrowLeft size={17} /></Link>
            <Link href="/audiences/young-adults" className="sanad-secondary-link">أنا شاب/ة من ١٨ إلى ٢٩ <ArrowLeft size={15} /></Link>
          </div>
          <div className="sanad-youth-topic-grid">
            {youthTopics.map((topic, index) => <div className="sanad-youth-topic" key={topic}><span>٠{index + 1}</span><Sparkles size={16} /><strong>{topic}</strong></div>)}
          </div>
        </div>
      </section>

      <section className="sanad-section sanad-life-section">
        <div className="sanad-container">
          <div className="sanad-section-heading">
            <div><div className="sanad-eyebrow sanad-eyebrow-dark"><span /> لكل مرحلة احتياجها</div><h2>والدعم يرافقك مع تغيّر الحياة</h2></div>
            <p>مساحتان للكبار، بمداخل تراعي تفاصيل الحياة في كل مرحلة.</p>
          </div>
          <div className="sanad-life-grid">
            <Link href="/audiences/adults" className="sanad-life-card sanad-life-adults">
              <span className="sanad-life-icon"><Briefcase size={24} /></span><span className="sanad-life-age">٣٠–٥٩ سنة</span>
              <h3>للبالغين</h3><p>ضغوط الحياة والعمل، الأسرة، الفقد، التكيّف والصحة النفسية.</p>
              <span className="sanad-card-link">اكتشف مساحة البالغين <ArrowLeft size={16} /></span>
            </Link>
            <Link href="/audiences/older-adults" className="sanad-life-card sanad-life-older">
              <span className="sanad-life-icon"><Flower2 size={24} /></span><span className="sanad-life-age">٦٠ سنة فأكثر</span>
              <h3>لكبار السن</h3><p>الوحدة والفقد والتقاعد والروابط الاجتماعية والتكيف مع التغيرات.</p>
              <span className="sanad-card-link">اكتشف مساحة كبار السن <ArrowLeft size={16} /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="sanad-section sanad-pathways-section">
        <div className="sanad-container">
          <div className="sanad-section-heading">
            <div><div className="sanad-eyebrow sanad-eyebrow-dark"><span /> مسارات الدعم النفسي</div><h2>خطوات صغيرة، على مهل</h2></div>
            <Link href="/pathways" className="sanad-inline-link">كل المسارات <ArrowLeft size={16} /></Link>
          </div>
          {pathways.isLoading ? <LoadingBlock /> : pathways.isError ? <ErrorBlock retry={() => pathways.refetch()} /> : featuredPathways.length ? (
            <div className="sanad-pathways-grid">
              {featuredPathways.map((pathway, index) => {
                const image = getPathwayImage(pathway.title);
                return <Link href={`/pathways/${pathway.slug}`} key={pathway.id} className="sanad-pathway-card">
                  <div className="sanad-pathway-visual" style={{ background: image.gradient }}><span>{image.icon}</span><small>٠{index + 1}</small><div className="sanad-pathway-shape" /></div>
                  <div className="sanad-pathway-body"><h3>{pathway.title}</h3><p>{pathway.description}</p><span className="sanad-card-link">افتح المسار <ArrowLeft size={15} /></span></div>
                </Link>;
              })}
            </div>
          ) : <EmptyBlock title="مسارات الدعم قريباً" />}
        </div>
      </section>

      <section className="sanad-section sanad-library-section">
        <div className="sanad-container">
          <div className="sanad-section-heading">
            <div><div className="sanad-eyebrow"><span /> مركز التوعية والمعرفة</div><h2>اقرأ، شاهد، أو استمع</h2></div>
            <Link href="/library" className="sanad-inline-link sanad-inline-light">كل المكتبة <ArrowLeft size={16} /></Link>
          </div>
          <div className="sanad-library-grid">
            <Link href="/library" className="sanad-library-card sanad-library-reading"><span><BookOpen size={22} /></span><small>مواد مكتوبة</small><h3>{readingTitle}</h3><p>{readingSummary}</p><b>استكشف المقروء <ArrowLeft size={15} /></b></Link>
            <Link href="/tv" className="sanad-library-card sanad-library-video"><span><Video size={22} /></span><small>مرئي</small><h3>{videoTitle}</h3><p>{videoSummary}</p><b><Play size={15} /> استكشف المرئي</b></Link>
            <Link href="/radio" className="sanad-library-card sanad-library-audio"><span><Headphones size={22} /></span><small>مسموع</small><h3>{audioTitle}</h3><p>{audioSummary}</p><b><AudioLines size={15} /> استكشف المسموع</b></Link>
          </div>
          <p className="sanad-library-caption"><CircleHelp size={15} /> المحتوى المتاح يظهر كما هو منشور في المكتبة؛ لا يعني اختيار العمر أن كل مادة صُنّفت عمرياً بعد.</p>
        </div>
      </section>

      <section className="sanad-section sanad-self-check-section">
        <div className="sanad-container sanad-self-check-card">
          <div className="sanad-self-check-copy"><div className="sanad-eyebrow sanad-eyebrow-dark"><span /> لحظة مع نفسك</div><h2>ليس مطلوباً أن تعرف كل الإجابات</h2><p>تعرّف إلى مشاعرك، جرّب تمريناً بسيطاً، أو ابدأ تقييماً ذاتياً توعوياً.</p></div>
          <div className="sanad-self-check-actions"><Link href="/assessment" className="sanad-button sanad-button-primary">وقفة مع النفس <Brain size={17} /></Link><Link href="/self-care" className="sanad-button sanad-button-outline">تمارين العناية بالذات <Wind size={17} /></Link></div>
          <p className="sanad-self-check-note"><ShieldCheck size={16} /> التقييمات والتمارين أدوات مساندة، وليست تشخيصاً أو بديلاً عن المختص.</p>
        </div>
      </section>

      <section className="sanad-section sanad-stories-section">
        <div className="sanad-container sanad-stories-card">
          <div className="sanad-stories-art" aria-hidden="true"><div /><div /><HeartHandshake size={36} /></div>
          <div className="sanad-stories-copy"><div className="sanad-eyebrow sanad-eyebrow-dark"><span /> قصص وتجارب للتأمل</div><h2>أحياناً يكفي أن نعرف أننا لسنا وحدنا</h2><p>استكشف المواد القصصية المدرجة؛ لا تُعامل بوصفها شهادات موثقة ما لم يظهر توثيقها.</p><Link href="/stories" className="sanad-button sanad-button-primary">اكتشف القصص <ArrowLeft size={17} /></Link></div>
        </div>
      </section>

      <section className="sanad-help-section">
        <div className="sanad-container sanad-help-inner">
          <div className="sanad-help-copy"><div className="sanad-eyebrow"><span /> أنت لست وحدك</div><h2>لست مضطراً لمواجهة الصعوبات وحدك.</h2><p>قدّم طلب جلسة، واطّلع على بيانات الإحالة الموثقة والمهيأة عند توفرها.</p></div>
          <div className="sanad-help-actions"><Link href="/booking" className="sanad-button sanad-button-light">طلب جلسة دعم نفسي <MessageCircle size={17} /></Link><Link href="/help-now" className="sanad-button sanad-button-outline-light">خيارات المساعدة <ShieldCheck size={17} /></Link></div>
          <p className="sanad-help-note">سند مساحة مجتمعية للتوعية والمساندة، وليس خدمة طوارئ أو بديلاً عن المختص. في الخطر المباشر، راجع صفحة المساعدة العاجلة.</p>
        </div>
      </section>
    </div>
  );
}
