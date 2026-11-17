import { useEffect, useState } from 'react';
import { exerciseData } from '@/data/self-care-exercises';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useParams } from 'wouter';
import { EmptyBlock } from '@/components/page-ui';

export function SelfCarePage() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);

  const exercises = [
    {
      key: 'breathing',
      icon: '🌬️',
      title: 'تنفس 4-7-8',
      desc: 'تمرين تنفس عميق لتهدئة الجهاز العصبي',
      duration: '5 دقائق',
      color: '#2a7a5f',
    },
    {
      key: 'relaxation',
      icon: '🧘',
      title: 'استرخاء عضلي',
      desc: 'إرخاء تدريجي لكل عضلات الجسم',
      duration: '10 دقائق',
      color: '#e87722',
    },
    {
      key: 'gratitude',
      icon: '📝',
      title: 'قائمة النعم',
      desc: 'اكتب 3 أشياء أنت ممتن لها اليوم',
      duration: '5 دقائق',
      color: '#f5d76e',
    },
    {
      key: 'meditation',
      icon: '🌟',
      title: 'تأمل قصير',
      desc: 'لحظات هدوء مع تركيز على النفس',
      duration: '5 دقائق',
      color: '#1a5f4a',
    },
  ];

  if (activeExercise) {
    const exercise = exercises.find(e => e.key === activeExercise)!;
    return <div className="self-care-page">
      <section className="self-care-header">
        <Link href="/self-care" className="back-link"><ArrowLeft size={16}/> العودة</Link>
      </section>
      <div className="content-wrap page-space">
        <div className="self-care-exercise">
          <div className="self-care-exercise-icon">{exercise.icon}</div>
          <h1 className="serif-ar">{exercise.title}</h1>
          <p className="self-care-exercise-desc">{exercise.desc}</p>

          {activeExercise === 'breathing' && <BreathingExercise/>}
          {activeExercise === 'relaxation' && <RelaxationExercise/>}
          {activeExercise === 'gratitude' && <GratitudeExercise/>}
          {activeExercise === 'meditation' && <MeditationExercise/>}

          <button onClick={() => setActiveExercise(null)} className="btn-lifespeak-secondary">
            العودة للتمارين <ArrowLeft size={16}/>
          </button>
        </div>
      </div>
    </div>;
  }

  return <div className="self-care-page">
    <section className="self-care-hero">
      <div className="content-wrap">
        <div className="self-care-hero-content">
          <div className="eyebrow">استكشاف ذاتي</div>
          <h1 className="serif-ar">العناية بالذات</h1>
          <p>اعتنِ بنفسك — خطوة صغيرة كل يوم. اختر تمريناً وابدأ.</p>
        </div>
      </div>
    </section>
  {/* ✨ جديد: تعريف + أهمية */}
  <section className="self-care-intro">
    <div className="content-wrap">
      <div className="self-care-intro-grid">
        <div className="self-care-intro-card">
          <h2 className="self-care-intro-title">📖 ما هي العناية بالذات؟</h2>
          <p>العناية بالذات هي مجموعة من الممارسات اليومية التي تهدف إلى الحفاظ على صحتك النفسية والجسدية. ليست رفاهية، بل ضرورة. تشمل: النوم الكافي، التغذية، الحركة، التنفس، التأمل، وقول "لا" عند الحاجة. ابدأ بخطوة صغيرة — 5 دقائق يومياً تكفي.</p>
        </div>
        <div className="self-care-intro-card self-care-importance">
          <h2 className="self-care-intro-title">🎯 لماذا هي مهمة؟</h2>
          <ul className="self-care-importance-list">
            <li>تقلل التوتر والقلق</li>
            <li>تحسن النوم والراحة</li>
            <li>تعزز الصحة النفسية</li>
            <li>تقوي المناعة الطبيعية</li>
            <li>تزيد الإنتاجية والتركيز</li>
            <li>تحسن العلاقات بالآخرين</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  {/* ✨ جديد: تعريف + أهمية */}
    <div className="content-wrap page-space">
      <div className="self-care-grid">
        {exercises.map(ex => <Link
          key={ex.key}
          href={`/self-care/${ex.key}`}
          className="self-care-card"
          style={{ borderTopColor: ex.color }}
          data-testid={`self-care-${ex.key}`}
        >
          <div className="self-care-card-icon" style={{ background: `${ex.color}15`, color: ex.color }}>
            {ex.icon}
          </div>
          <h3 className="serif-ar">{ex.title}</h3>
          <p>{ex.desc}</p>
          <div className="self-care-card-footer">
            <span>{ex.duration}</span>
            <ArrowLeft size={16}/>
          </div>
        </Link>)}
      </div>
    </div>
  </div>;
}

export function BreathingExercise() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'inhale'|'hold'|'exhale'|'ready'>('ready');
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!running) return;
    const sequence = [
      { phase: 'inhale' as const, duration: 4000 },
      { phase: 'hold' as const, duration: 7000 },
      { phase: 'exhale' as const, duration: 8000 },
    ];
    let idx = 0;
    let timeout: number;
    const tick = () => {
      setPhase(sequence[idx].phase);
      timeout = window.setTimeout(() => {
        idx = (idx + 1) % sequence.length;
        if (idx === 0) setCycles(c => c + 1);
        tick();
      }, sequence[idx].duration);
    };
    tick();
    return () => window.clearTimeout(timeout);
  }, [running]);

  return <div className="breathing-exercise">
    <div className={`breathing-circle breathing-${phase}`}>
      <div className="breathing-label">
        {phase === 'ready' ? 'جاهز؟' :
         phase === 'inhale' ? 'شهيق' :
         phase === 'hold' ? 'احبس' : 'زفير'}
      </div>
    </div>
    <div className="breathing-info">
      <p>الدورات المكتملة: <strong>{cycles}</strong></p>
      <Button onClick={() => { setRunning(!running); setCycles(0); }} className="btn-lifespeak-primary">
        {running ? 'إيقاف' : 'ابدأ التمرين'}
      </Button>
    </div>
  </div>;
}

export function RelaxationExercise() {
  const steps = [
    'اجلس في مكان هادئ وأغمض عينيك',
    'خذ نفساً عميقاً، ثم أخرجه ببطء',
    'شد عضلات وجهك 5 ثوان، ثم ارخها',
    'ارفع كتفيك 5 ثوان، ثم ارخهما',
    'شد قبضتيك 5 ثوان، ثم ارخهما',
    'شد عضلات بطنك 5 ثوان، ثم ارخها',
    'شد ساقيك 5 ثوان، ثم ارخهما',
    'خذ نفساً عميقاً، وافتح عينيك',
  ];
  const [current, setCurrent] = useState(0);
  return <div className="relaxation-exercise">
    <div className="relaxation-steps">
      {steps.map((s, i) => <div key={i} className={`relaxation-step ${i === current ? 'active' : ''} ${i < current ? 'done' : ''}`}>
        <span className="step-num-small">{i < current ? '✓' : i + 1}</span>
        <p>{s}</p>
      </div>)}
    </div>
    <div className="relaxation-actions">
      {current < steps.length - 1 ? <Button onClick={() => setCurrent(current + 1)} className="btn-lifespeak-primary">
        الخطوة التالية <ArrowLeft size={16}/>
      </Button> : <Button onClick={() => setCurrent(0)} className="btn-lifespeak-primary">
        ابدأ من جديد
      </Button>}
    </div>
  </div>;
}

export function GratitudeExercise() {
  const [items, setItems] = useState(['', '', '']);
  const [saved, setSaved] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(`gratitude-${today}`);
      if (stored) {
        setItems(JSON.parse(stored));
        setSaved(true);
      }
    } catch { /* ignore */ }
  }, [today]);

  function save() {
    try {
      window.localStorage.setItem(`gratitude-${today}`, JSON.stringify(items));
      setSaved(true);
    } catch { /* ignore */ }
  }

  return <div className="gratitude-exercise">
    <p className="gratitude-intro">اكتب 3 أشياء أنت ممتن لها اليوم. لا شيء صغير جداً.</p>
    {items.map((item, i) => <div className="gratitude-item" key={i}>
      <span className="gratitude-num">{i + 1}</span>
      <input
        type="text"
        value={item}
        onChange={e => { const n = [...items]; n[i] = e.target.value; setItems(n); setSaved(false); }}
        placeholder={`أنا ممتن لـ...`}
      />
    </div>)}
    <Button onClick={save} className="btn-lifespeak-primary">
      {saved ? '✓ محفوظ' : 'حفظ قائمة النعم'}
    </Button>
  </div>;
}

export function MeditationExercise() {
  const [seconds, setSeconds] = useState(300);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { setRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return <div className="meditation-exercise">
    <div className="meditation-timer">
      {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
    <p>اجلس بهدوء، أغلق عينيك، وتنفس بعمق. ركّز على أنفاسك فقط.</p>
    <Button onClick={() => setRunning(!running)} className="btn-lifespeak-primary">
      {running ? 'إيقاف مؤقت' : seconds === 300 ? 'ابدأ التأمل' : seconds === 0 ? 'ابدأ من جديد' : 'استمر'}
    </Button>
  </div>;
}

export function SelfCareExercisePage() {
  const { key } = useParams<{ key: string }>();
  const data = key ? exerciseData[key] : null;

  if (!data) {
    return <div className="content-wrap page-space">
      <EmptyBlock title="التمرين غير موجود" hint="ربما تغيّر الرابط. تصفح التمارين المتاحة."/>
      <Link href="/self-care" className="btn-lifespeak-primary">العودة للعناية بالذات <ArrowLeft size={16}/></Link>
    </div>;
  }

  return <div className="self-care-detail-page">
    <section className="self-care-detail-hero" style={{ background: `linear-gradient(135deg, ${data.color}20 0%, ${data.color}05 100%)` }}>
      <div className="content-wrap">
        <Link href="/self-care" className="back-link"><ArrowLeft size={16}/> العناية بالذات</Link>
        <div className="self-care-detail-hero-content">
          <div className="self-care-detail-icon" style={{ background: `${data.color}20`, color: data.color }}>{data.icon}</div>
          <h1 className="serif-ar">{data.title}</h1>
          <p>{data.intro}</p>
        </div>
      </div>
    </section>

    <div className="content-wrap page-space">
      <div className="self-care-detail-sections">
        {/* التعريف */}
        <section className="self-care-detail-section">
          <h2 className="self-care-detail-title"><span>📖</span> ما هو؟</h2>
          <p className="self-care-detail-text">{data.definition}</p>
        </section>

        {/* الأنواع */}
        <section className="self-care-detail-section">
          <h2 className="self-care-detail-title"><span>📊</span> الأنواع والأشكال</h2>
          <div className="self-care-types-grid">
            {data.types.map((t, i) => <div className="self-care-type-card" key={i}>
              <h4>{t.name}</h4>
              <p>{t.desc}</p>
            </div>)}
          </div>
        </section>

        {/* الأهمية */}
        <section className="self-care-detail-section">
          <h2 className="self-care-detail-title"><span>🎯</span> الأهمية</h2>
          <ul className="self-care-bullets">
            {data.importance.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>

        {/* الخطوات */}
        <section className="self-care-detail-section">
          <h2 className="self-care-detail-title"><span>📝</span> الخطوات</h2>
          <ol className="self-care-steps-list">
            {data.steps.map((step, i) => <li key={i}>
              <span className="self-care-step-num">{i + 1}</span>
              <span>{step}</span>
            </li>)}
          </ol>
        </section>

        {/* أمثلة */}
        <section className="self-care-detail-section">
          <h2 className="self-care-detail-title"><span>💡</span> أمثلة</h2>
          <ul className="self-care-bullets">
            {data.examples.map((ex, i) => <li key={i}>{ex}</li>)}
          </ul>
        </section>

        {/* طرق العناية */}
        <section className="self-care-detail-section self-care-detail-care">
          <h2 className="self-care-detail-title"><span>🛡️</span> طرق العناية (للاستمرارية)</h2>
          <ul className="self-care-bullets self-care-bullets-care">
            {data.careTips.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </section>

        {/* تمرين تفاعلي */}
        <section className="self-care-detail-section self-care-interactive">
          <h2 className="self-care-detail-title"><span>▶</span> جرّب الآن</h2>
          {key === 'breathing' && <BreathingExercise/>}
          {key === 'relaxation' && <RelaxationExercise/>}
          {key === 'gratitude' && <GratitudeExercise/>}
          {key === 'meditation' && <MeditationExercise/>}
        </section>
      </div>
    </div>
  </div>;
}
