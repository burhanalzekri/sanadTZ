import { useListPublicPathways } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { ArrowLeft, Check, BookOpen, Brain, Wind, Heart, Sparkles, Sun, Moon, Dumbbell } from 'lucide-react';
import { PageIntro, LoadingBlock, ErrorBlock } from '@/components/page-ui';
import { useState, useEffect } from 'react';
import { ExerciseRenderer, type APIExercise } from '@/components/ExerciseRenderer';

const stepIcons = [
  <BookOpen size={24} />,
  <Wind size={24} />,
  <Brain size={24} />,
  <Sparkles size={24} />,
  <Sun size={24} />,
  <Heart size={24} />,
  <Moon size={24} />
];

export function PathwayDetailPage() {
  const { slug } = useParams();
  const query = useListPublicPathways();
  let decodedSlug = slug || ''; try { decodedSlug = decodeURIComponent(decodedSlug); } catch(e) {}; const pathway = query.data?.find(p => String(p.id) === decodedSlug || p.slug === decodedSlug || p.title === decodedSlug);

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // جلب التمارين من الـ API حسب slug المسار
  const [exercises, setExercises] = useState<APIExercise[]>([]);
  useEffect(() => {
    if (!pathway) return;
    const slugForFetch = pathway.slug || pathway.id;
    if (!slugForFetch) return;
    let cancelled = false;
    fetch(`/api/public/exercises/${encodeURIComponent(String(slugForFetch))}`)
      .then(r => r.ok ? r.json() : [])
      .then((data: APIExercise[]) => { if (!cancelled) setExercises(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) setExercises([]); });
    return () => { cancelled = true; };
  }, [pathway]);

  useEffect(() => {
    if (pathway) {
      const saved = localStorage.getItem(`sana_progress_${pathway.id}`);
      if (saved) {
        try { setCompletedSteps(JSON.parse(saved)); } catch (e) {}
      }
    }
  }, [pathway]);

  const toggleStep = (index: number) => {
    const newCompleted = completedSteps.includes(index)
      ? completedSteps.filter(i => i !== index)
      : [...completedSteps, index];
    setCompletedSteps(newCompleted);
    if (pathway) {
      localStorage.setItem(`sana_progress_${pathway.id}`, JSON.stringify(newCompleted));
    }
  };

  if (query.isLoading) return <LoadingBlock />;
  if (query.isError) return <ErrorBlock retry={() => query.refetch()} />;
  if (!pathway) return <div className="content-wrap page-space"><h2>المسار غير موجود</h2><Link href="/pathways" style={{color: 'var(--primary)'}}>العودة للمسارات</Link></div>;

  const steps = (pathway as any).steps || [];
  const progress = steps.length > 0 ? Math.round((completedSteps.length / steps.length) * 100) : 0;

  return (
    <div className="content-wrap page-space" style={{perspective: '1500px'}}>
      {/* زر العودة الأنيق */}
      <div style={{marginBottom: '20px'}}>
        <Link href="/pathways">
          <button style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 24px',
            borderRadius: '14px',
            background: 'var(--surface)',
            color: 'var(--primary)',
            border: '2px solid var(--primary)',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1em',
            boxShadow: '0 5px 15px rgba(16,185,129,0.15)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateX(-5px)';}}
          onMouseLeave={(e) => {e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'translateX(0)';}}
          >
            <ArrowLeft size={20} /> العودة إلى المسارات
          </button>
        </Link>
      </div>

      {/* بطاقة 3D العلوية (Hero) */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, var(--surface) 100%)',
          borderRadius: '30px',
          padding: '40px 30px',
          marginBottom: '30px',
          border: '1px solid var(--border)',
          boxShadow: '0 25px 50px -12px var(--shadow-color), 0 0 30px rgba(16,185,129,0.15)',
          position: 'relative',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px) rotateX(2deg)';
          e.currentTarget.style.boxShadow = '0 35px 60px -15px var(--shadow-color), 0 0 40px rgba(16,185,129,0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) rotateX(0)';
          e.currentTarget.style.boxShadow = '0 25px 50px -12px var(--shadow-color), 0 0 30px rgba(16,185,129,0.15)';
        }}
      >
        <div className="shine-overlay" style={{
          position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)',
          transform: 'skewX(-25deg)', transition: '0.8s', pointerEvents: 'none', zIndex: 1
        }} />
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
          filter: 'blur(30px)', zIndex: 0, pointerEvents: 'none'
        }}/>
        <div style={{position: 'relative', zIndex: 2}}>
          <PageIntro eyebrow="مسار" title={pathway.title} description={pathway.description} />
          <div style={{marginTop: '30px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: 'bold'}}>
              <span style={{color: 'var(--primary)', fontSize: '1.1em'}}>تقدمك في المسار</span>
              <span style={{color: 'var(--primary)', fontSize: '1.4em', textShadow: '0 0 10px rgba(16,185,129,0.5)'}}>{progress}%</span>
            </div>
            <div style={{width: '100%', height: '14px', background: 'var(--surface-hover)', borderRadius: '7px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'}}>
              <div style={{width: `${progress}%`, height: '100%', background: 'linear-gradient(to left, #10b981, #0f766e)', borderRadius: '7px', transition: 'width 0.5s ease', boxShadow: '0 0 15px rgba(16,185,129,0.6)'}} />
            </div>
            <p style={{marginTop: '12px', fontSize: '0.95em', color: 'var(--muted-foreground)', textAlign: 'center'}}>
              أكملت {completedSteps.length} من {steps.length} خطوات
            </p>
          </div>
        </div>
      </div>

      {/* زر التمارين */}
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '40px'}}>
        <Link href={`/pathways/${pathway.slug || pathway.id}/exercises`}>
          <button
            style={{
              padding: '15px 35px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1em',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 25px rgba(245,158,11,0.4)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(245,158,11,0.6)';}}
            onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(245,158,11,0.4)';}}
          >
            <Dumbbell size={24} /> الانتقال إلى التمارين التفاعلية
          </button>
        </Link>
      </div>

      {/* الخطوات */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
        {steps.map((step: any, index: number) => {
          const isCompleted = completedSteps.includes(index);
          const stepText = typeof step === 'string' ? step : (step.text || step.content || JSON.stringify(step));
          const Icon = stepIcons[index % stepIcons.length];
          const stepExercises = exercises.filter(ex => ex.stepIndex === index);

          return (
            <div
              key={index}
              id={stepExercises.length > 0 ? 'exercises-section' : `step-${index}`}
              style={{
                background: 'var(--surface)',
                borderRadius: '24px',
                border: isCompleted ? '2px solid var(--primary)' : '1px solid var(--border)',
                padding: '35px',
                position: 'relative',
                transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: isCompleted
                  ? '0 20px 40px -10px rgba(16,185,129,0.3)'
                  : '0 15px 35px -5px var(--shadow-color)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) rotateX(2deg) scale(1.01)';
                e.currentTarget.style.boxShadow = '0 30px 60px -15px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) rotateX(0) scale(1)';
                e.currentTarget.style.boxShadow = isCompleted
                  ? '0 20px 40px -10px rgba(16,185,129,0.3)'
                  : '0 15px 35px -5px var(--shadow-color)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '25px',
                paddingBottom: '20px',
                borderBottom: isCompleted ? '2px solid var(--primary)' : '2px solid var(--primary)',
                position: 'relative',
                zIndex: 2
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  background: isCompleted ? 'var(--primary)' : 'var(--primary-glow)',
                  color: isCompleted ? 'white' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(16,185,129,0.3)'
                }}>
                  {isCompleted ? <Check size={28} /> : Icon}
                </div>
                <div>
                  <span style={{
                    color: 'var(--primary)',
                    fontWeight: 'bold',
                    fontSize: '1.1em',
                    display: 'block'
                  }}>
                    الخطوة {index + 1}
                  </span>
                </div>
              </div>

              <div
                className="pathway-step-content"
                style={{
                  color: 'var(--text)',
                  lineHeight: '1.9',
                  fontSize: '1.05em',
                  marginBottom: '25px',
                  position: 'relative',
                  zIndex: 2
                }}
                dangerouslySetInnerHTML={{__html: stepText}}
              />

              {stepExercises.map(ex => (
                <ExerciseRenderer key={ex.id} exercise={ex} />
              ))}

              <button
                onClick={() => toggleStep(index)}
                style={{
                  padding: '14px 24px',
                  borderRadius: '14px',
                  background: isCompleted ? 'linear-gradient(135deg, #10b981, #0f766e)' : '#0f766e',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  boxShadow: '0 8px 20px rgba(16,185,129,0.4)',
                  transition: 'all 0.3s ease',
                  fontSize: '1em',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                {isCompleted ? (
                  <>
                    <Check size={20} /> تم الإكمال (اضغط للتراجع)
                  </>
                ) : (
                  <>
                    <Sparkles size={20} /> تحديد كخطوة مكتملة
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
