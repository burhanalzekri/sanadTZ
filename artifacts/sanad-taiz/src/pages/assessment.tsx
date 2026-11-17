import { useState } from 'react';
import { scalesData } from '@/data/assessment-scales';
import { ArrowLeft, BookOpen, Brain, HeartHandshake, HeartPulse, Moon, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageIntro, Pill } from '@/components/page-ui';
import { CrisisBanner } from '@/components/support-ui';

export const scaleIcons: Record<string, React.ComponentType<{size?: number}>> = { moon: Moon, pulse: HeartPulse, heart: HeartHandshake, shield: ShieldCheck, brain: Brain, book: BookOpen };

export function AssessmentPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [showResult, setShowResult] = useState(false);

  function selectScale(key: string) {
    setSelected(key);
    setAnswers({});
    setShowResult(false);
  }

  if (!selected) {
    return <div className="content-wrap page-space">
      <PageIntro eyebrow="استكشاف ذاتي" title="مقاييس نفسية توعوية" description="مقاييس قصيرة تساعدك على ملاحظة ما تمر به. ليست تشخيصاً، ولا تحفظ إجاباتك."/>
      <div className="privacy-strip"><ShieldCheck size={19}/><span>إجاباتك تبقى في هذه الصفحة فقط. لا تُحفظ ولا تُرسل.</span><Pill>ليست تشخيصاً</Pill></div>
      <div className="scales-grid">
        {Object.entries(scalesData).map(([key, data]) => {
          const Icon = scaleIcons[data.icon];
          return <button className="scale-card" key={key} onClick={() => selectScale(key)} data-testid={`scale-${key}`}>
            <div className="scale-card-top">
              <div className="scale-icon" style={{ background: `${data.color}15`, color: data.color }}><Icon size={24}/></div>
              <span className="scale-badge">{data.questions.length} أسئلة</span>
            </div>
            <div className="scale-card-info">
              <h3 className="serif-ar">{data.title}</h3>
              <h4>{data.subtitle}</h4>
              <p>{data.desc}</p>
            </div>
            <div className="scale-card-footer"><span>ابدأ التقييم</span><ArrowLeft size={16}/></div>
          </button>;
        })}
      </div>
    </div>;
  }

  const scale = scalesData[selected];
  const Icon = scaleIcons[scale.icon];
  const complete = Object.keys(answers).length === scale.questions.length;

  let total: number = 0;
  let categoryResult: { category: string; name: string; desc: string } | null = null;

  if (scale.type === 'score') {
    total = Object.values(answers).reduce((a, b) => Number(a) + (typeof b === 'number' ? b : 0), 0) as number;
  } else {
    const answerCategories = Object.values(answers).map(v => String(v));
    categoryResult = scale.scoring(answerCategories);
  }

  if (showResult) {
    return <div className="content-wrap page-space">
      <div className="scale-result-card" data-testid="scale-result">
        <div className="scale-result-icon" style={{ color: scale.color }}><Icon size={48}/></div>
        <h2 className="serif-ar">نتيجتك في مقياس {scale.title}</h2>
        {scale.type === 'score' ? (
          <>
            <div className="scale-score-display"><span className="score-num">{total}</span></div>
            <p className="scale-result-text">{scale.scoring(total)}</p>
          </>
        ) : categoryResult && (
          <>
            <div className="scale-category-display">
              <span className="category-code" style={{ color: scale.color }}>{categoryResult.category}</span>
              <h3 className="category-name serif-ar">{categoryResult.name}</h3>
            </div>
            <p className="scale-result-text">{categoryResult.desc}</p>
          </>
        )}
        <div className="scale-disclaimer"><ShieldCheck size={18}/><span>هذا المقياس توعوي وليس تشخيصاً طبياً. للحصول على تقييم دقيق، يرجى مراجعة مختص.</span></div>
        <div className="scale-result-actions">
          <Button onClick={() => selectScale(selected)}>إعادة التقييم</Button>
          <Button variant="outline" onClick={() => setSelected(null)}>العودة للمقاييس</Button>
        </div>
      </div>
    </div>;
  }

  return <div className="content-wrap page-space">
    <button onClick={() => setSelected(null)} className="back-link"><ArrowLeft size={16}/> العودة للمقاييس</button>
    <PageIntro eyebrow={`مقياس ${scale.title}`} title={scale.subtitle} description={scale.desc}/>
    <div className="scale-questions-list">
      {scale.type === 'score' ? (
        scale.questions.map((q, idx) => (
          <div className="scale-question-card" key={idx}>
            <div className="scale-q-title"><span className="scale-q-num">{String(idx+1).padStart(2,'0')}</span><h3>{q}</h3></div>
            <div className="scale-options">
              {scale.options.map((opt, oIdx) => (
                <button key={oIdx} className={`scale-opt-btn ${answers[idx] === oIdx ? 'selected' : ''}`} onClick={() => setAnswers({...answers, [idx]: oIdx})} data-testid={`scale-opt-${idx}-${oIdx}`}>{opt}</button>
              ))}
            </div>
          </div>
        ))
      ) : (
        scale.questions.map((q, idx) => (
          <div className="scale-question-card" key={idx}>
            <div className="scale-q-title"><span className="scale-q-num">{String(idx+1).padStart(2,'0')}</span><h3>{q.text}</h3></div>
            <div className="scale-options">
              {q.options.map((opt, oIdx) => (
                <button key={oIdx} className={`scale-opt-btn ${answers[idx] === opt.category ? 'selected' : ''}`} onClick={() => setAnswers({...answers, [idx]: opt.category})} data-testid={`scale-opt-${idx}-${oIdx}`}>{opt.label}</button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
    {selected === 'phq9' && answers[8] === 3 && <CrisisBanner/>}
    <div className="scale-actions-bottom">
      <Button disabled={!complete} onClick={() => setShowResult(true)} data-testid="scale-submit">عرض النتيجة <ArrowLeft size={16}/></Button>
      {!complete && <span className="scale-warning">يرجى الإجابة على جميع الأسئلة.</span>}
    </div>
  </div>;
}
