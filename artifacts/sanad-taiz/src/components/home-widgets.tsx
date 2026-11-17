import { useState } from 'react';
import { moodOptions } from '@/data/mood-options';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';

export function MoodScale() {
  const [selected, setSelected] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try { return window.localStorage.getItem('last-mood'); } catch { return null; }
  });
  const [showAll, setShowAll] = useState(false);
  const selectedMood = moodOptions.find(m => m.key === selected);
  const displayed = showAll ? moodOptions : moodOptions.slice(0, 6);

  function pick(key: string) {
    setSelected(key);
    try { window.localStorage.setItem('last-mood', key); } catch { /* ignore */ }
  }

  return <section className="mood-scale-section">
    <div className="content-wrap">
      <div className="mood-scale-inner">
        <div className="eyebrow">لحظة صدق</div>
        <h2 className="serif-ar">كيف تشعر الآن؟</h2>
        <p>اختر ما يعبّر عنك. يُحفظ آخر اختيار محلياً على هذا الجهاز.</p>

        <div className="mood-picker">
          {displayed.map(m => (
            <button
              key={m.key}
              className={`mood-btn ${selected === m.key ? 'active' : ''}`}
              onClick={() => pick(m.key)}
              aria-pressed={selected === m.key}
              data-testid={`mood-${m.key}`}
              style={selected === m.key ? { borderColor: m.color, boxShadow: `0 8px 24px ${m.color}55` } : undefined}
            >
              <span className="mood-emoji">{m.emoji}</span>
              <span className="mood-label">{m.label}</span>
            </button>
          ))}
        </div>

        <button
          className="mood-toggle-more"
          onClick={() => setShowAll(!showAll)}
          aria-expanded={showAll}
        >
          {showAll ? '↑ عرض أقل' : '↓ عرض كل المشاعر (12)'}
        </button>

        {selectedMood && (
          <div className={`mood-response ${selectedMood.isCrisis ? 'mood-response-crisis' : ''}`}>
            <div className="mood-response-head">
              <span className="mood-response-emoji">{selectedMood.emoji}</span>
              <div>
                <h4>{selectedMood.label}</h4>
                <p>{selectedMood.msg}</p>
              </div>
            </div>
            <div className="mood-response-actions">
              <Link href={selectedMood.href} className="mood-cta" style={{ background: selectedMood.color }}>
                {selectedMood.cta} <ArrowLeft size={15}/>
              </Link>
              {selectedMood.isCrisis && (
                <Link href="/help-now" className="mood-crisis-link">
                  🆘 أرقام الطوارئ
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  </section>;
}

export function AssessmentPromo() {
  const assessments = [
    { code: 'PHQ-9', name: 'الاكتئاب', icon: '🌙', color: '#1a5f4a' },
    { code: 'GAD-7', name: 'القلق', icon: '💓', color: '#e87722' },
    { code: 'WHO-5', name: 'العافية', icon: '💛', color: '#f5d76e' },
    { code: 'PCL-5', name: 'الصدمات', icon: '🛡️', color: '#c4453a' },
    { code: 'VARK', name: 'أنماط التعلم', icon: '📚', color: '#8b5cf6' },
    { code: 'MBTI', name: 'أنماط الشخصية', icon: '🧠', color: '#0ea5e9' }
  ];

  return <section className="assessment-promo" style={{perspective: '1200px'}}>
    <div className="content-wrap">
      <div className="assessment-promo-inner" style={{display: 'flex', flexDirection: 'column', gap: '20px', transformStyle: 'preserve-3d'}}>
        <div className="assessment-promo-content" style={{textAlign: 'center'}}>
          <div className="eyebrow" style={{color: 'var(--primary)', fontWeight: 'bold', marginBottom: '5px'}}>استكشاف ذاتي</div>
          <h2 className="serif-ar" style={{fontSize: '1.8em', marginBottom: '10px'}}>خطوة لفهم ما تمرّ به</h2>
          <p style={{color: 'var(--muted-foreground)', marginBottom: '20px'}}>مقاييس قصيرة للتأمل الذاتي تساعدك على ملاحظة بعض الجوانب من دون أحكام.</p>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px', marginBottom: '20px', transformStyle: 'preserve-3d'}}>
          {assessments.map((a, i) => (
            <div key={i} style={{
              background: 'var(--surface)',
              padding: '15px',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              textAlign: 'center',
              boxShadow: '0 10px 25px -5px var(--shadow-color), 0 0 15px rgba(16,185,129,0.1)',
              transform: 'translateZ(20px)',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateZ(40px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 20px 40px -10px var(--shadow-hover), 0 0 25px rgba(16,185,129,0.3)';
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateZ(20px) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 25px -5px var(--shadow-color), 0 0 15px rgba(16,185,129,0.1)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
            >
              <div style={{position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)', transform: 'skewX(-25deg)', transition: '0.5s'}} className="shine-effect"/>
              <div style={{fontSize: '2em', marginBottom: '5px'}}>{a.icon}</div>
              <div style={{fontWeight: 'bold', color: 'var(--primary)', fontSize: '1em'}}>{a.code}</div>
              <div style={{fontSize: '0.8em', color: 'var(--muted-foreground)'}}>{a.name}</div>
            </div>
          ))}
        </div>

        <div style={{textAlign: 'center', transform: 'translateZ(30px)'}}>
          <Link href="/assessment" className="button-primary promo-cta" data-testid="link-assessment-promo" style={{display: 'inline-block', padding: '12px 30px', fontSize: '1em', boxShadow: '0 8px 20px rgba(16,185,129,0.4)', transform: 'translateY(0)', transition: 'all 0.3s'}} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 25px rgba(16,185,129,0.6)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(16,185,129,0.4)';}}>
            ابدأ استكشافاً ذاتياً <ArrowLeft size={16}/>
          </Link>
          <div className="promo-footnote" style={{marginTop: '10px', fontSize: '0.85em', color: 'var(--muted-foreground)'}}>
            <ShieldCheck size={14}/> أداة مساندة للتوعية، وليست تشخيصاً أو بديلاً عن المختص.
          </div>
        </div>
      </div>
    </div>
  </section>;
}

export function SelfCarePromo() {
  const exercises = [
    { key: 'breathing', icon: '🌬️', title: 'تنفس 4-7-8', duration: '5 دقائق', color: '#2a7a5f' },
    { key: 'relaxation', icon: '🧘', title: 'استرخاء عضلي', duration: '10 دقائق', color: '#e87722' },
    { key: 'gratitude', icon: '📝', title: 'قائمة النعم', duration: '5 دقائق', color: '#f5d76e' },
    { key: 'meditation', icon: '🌟', title: 'تأمل قصير', duration: '5 دقائق', color: '#1a5f4a' },
  ];

  return <section className="self-care-promo">
    <div className="content-wrap">
      <div className="section-heading">
        <div>
          <div className="eyebrow">العناية بالذات</div>
          <h2 className="serif-ar">خطوة صغيرة، كل يوم.</h2>
        </div>
        <p>تمرين عملي واحد قد يغيّر يومك.</p>
      </div>

      <div className="self-care-promo-grid">
        {exercises.map(ex => <Link
          key={ex.key}
          href={`/self-care/${ex.key}`}
          className="self-care-promo-card"
          style={{ borderTopColor: ex.color }}
          data-testid={`promo-self-care-${ex.key}`}
        >
          <div className="self-care-promo-icon" style={{ background: `${ex.color}15`, color: ex.color }}>
            {ex.icon}
          </div>
          <h3 className="serif-ar">{ex.title}</h3>
          <div className="self-care-promo-footer">
            <span>{ex.duration}</span>
            <ArrowLeft size={16}/>
          </div>
        </Link>)}
      </div>

      <div className="self-care-promo-cta">
        <Link href="/self-care" className="btn-lifespeak-primary">
          اكتشف كل التمارين <ArrowLeft size={16}/>
        </Link>
      </div>
    </div>
  </section>;
}
