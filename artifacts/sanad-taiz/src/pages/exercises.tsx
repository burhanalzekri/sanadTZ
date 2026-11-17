import { useParams, Link } from 'wouter';
import { useListPublicPathways } from '@workspace/api-client-react';
import { ArrowLeft, Check, Sparkles, Wind } from 'lucide-react';
import { LoadingBlock, ErrorBlock } from '@/components/page-ui';
import { useEffect, useState } from 'react';
import { ExerciseRenderer, type APIExercise } from '@/components/ExerciseRenderer';

const C = {
  bg: '#faf7f2', card: '#ffffff', text: '#3d3b37', muted: '#8c8577', border: '#e8e2d6',
  accent: '#5c7c66', accentLight: '#eef2ef', highlight: '#c97b63',
};

export function ExercisesPage() {
  const { slug } = useParams();
  const query = useListPublicPathways();
  let decodedSlug = slug || '';
  try { decodedSlug = decodeURIComponent(decodedSlug); } catch (e) {}

  const pathway = query.data?.find((p: any) => String(p.id) === decodedSlug || p.slug === decodedSlug || p.title === decodedSlug);
  const [exercises, setExercises] = useState<APIExercise[]>([]);
  const [loadingEx, setLoadingEx] = useState(true);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    if (!pathway) return;
    const slugForFetch = (pathway as any).slug || pathway.id;
    if (!slugForFetch) { setLoadingEx(false); return; }
    setLoadingEx(true);
    let cancelled = false;
    fetch(`/api/public/exercises/${encodeURIComponent(String(slugForFetch))}`)
      .then(res => res.ok ? res.json() : [])
      .then((data: APIExercise[]) => { if (!cancelled) { setExercises(Array.isArray(data) ? data : []); setLoadingEx(false); } })
      .catch(() => { if (!cancelled) { setExercises([]); setLoadingEx(false); } });
    return () => { cancelled = true; };
  }, [pathway]);

  useEffect(() => {
    if (!pathway) return;
    try {
      const saved = localStorage.getItem(`sana_exercises_done_${pathway.id}`);
      if (saved) setCompleted(JSON.parse(saved));
    } catch (e) {}
  }, [pathway]);

  const toggleCompleted = (exId: string) => {
    if (!pathway) return;
    const next = completed.includes(exId) ? completed.filter(i => i !== exId) : [...completed, exId];
    setCompleted(next);
    localStorage.setItem(`sana_exercises_done_${pathway.id}`, JSON.stringify(next));
  };

  if (query.isLoading) return <LoadingBlock />;
  if (query.isError) return <ErrorBlock retry={() => query.refetch()} />;
  if (!pathway) return <div style={{ padding: '50px', textAlign: 'center', background: C.bg, minHeight: '100vh' }}><h2>المسار غير موجود</h2><Link href="/pathways" style={{ color: C.accent }}>العودة</Link></div>;
  if (loadingEx) return <LoadingBlock />;

  const completedCount = exercises.filter(e => completed.includes(e.id)).length;
  const progress = exercises.length > 0 ? Math.round((completedCount / exercises.length) * 100) : 0;

  return (
    <div className="content-wrap page-space" style={{ background: C.bg, minHeight: '100vh', paddingTop: '30px', paddingBottom: '50px' }}>

      <div style={{ marginBottom: '30px' }}>
        <Link href={`/pathways/${(pathway as any).slug || pathway.id}`}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.background = C.card; e.currentTarget.style.color = C.accent; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.muted; }}>
            <ArrowLeft size={18} /> العودة إلى تفاصيل المسار
          </button>
        </Link>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '35px 30px', marginBottom: '40px', border: `1px solid ${C.border}`, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: C.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.accent }}>
            <Wind size={28} />
          </div>
          <div>
            <span style={{ fontWeight: 'bold', fontSize: '0.85em', color: C.muted, letterSpacing: '1px' }}>برنامج علاجي عملي</span>
            <h1 style={{ margin: 0, fontSize: '1.8em', fontWeight: 'bold', color: C.text }}>تمارين { (pathway as any).title }</h1>
          </div>
        </div>
        <p style={{ margin: '0 0 25px 0', lineHeight: 1.8, fontSize: '1.05em', color: C.muted, maxWidth: '700px' }}>
          هذا ليس مجرد كلام نظري. هذه تمارين تطبيقية مجربة (CBT) لمساعدتك على فهم مشاعرك، تهدئة جسدك، وتغيير طريقة تفكيرك. خذ وقتك في كل تمرين.
        </p>
        {exercises.length > 0 && (
          <div style={{ background: C.bg, padding: '20px', borderRadius: '16px', border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 'bold', color: C.text }}>
              <span>خطواتك المنجزة</span>
              <span>{progress}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e5e0d8', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: C.accent, borderRadius: '4px', transition: 'width 0.5s ease' }} />
            </div>
            <p style={{ margin: '10px 0 0 0', fontSize: '0.9em', color: C.muted, textAlign: 'center' }}>أكملت {completedCount} من {exercises.length} تمارين</p>
          </div>
        )}
      </div>

      {exercises.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 30px', background: C.card, borderRadius: '24px', border: `1px solid ${C.border}` }}>
          <Sparkles size={48} style={{ color: C.accent, marginBottom: '20px', opacity: 0.5 }} />
          <h3 style={{ color: C.text }}>لا توجد تمارين مضافة لهذا المسار حالياً</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {exercises.map((ex, idx) => {
            const isDone = completed.includes(ex.id);
            return (
              <div key={ex.id} style={{ background: C.card, borderRadius: '20px', border: `1px solid ${C.border}`, boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)', overflow: 'hidden' }}>

                {/* شريط علوي ملون */}
                <div style={{ height: '6px', background: isDone ? C.accent : (idx % 2 === 0 ? C.highlight : '#8c8577') }} />

                <div style={{ padding: '25px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '12px', background: isDone ? C.accent : C.bg, color: isDone ? 'white' : C.text, fontWeight: 'bold', fontSize: '1.1em', border: isDone ? 'none' : `1px solid ${C.border}` }}>
                        {isDone ? <Check size={20} /> : (idx + 1)}
                      </span>
                      <h3 style={{ margin: 0, color: C.text, fontSize: '1.2em', lineHeight: 1.4 }}>{ex.title}</h3>
                    </div>
                  </div>

                  <ExerciseRenderer exercise={ex} />

                  <button onClick={() => toggleCompleted(ex.id)} style={{ marginTop: '25px', padding: '12px 20px', borderRadius: '12px', background: isDone ? '#f5f5f5' : C.accentLight, color: isDone ? C.muted : C.accent, border: `1px solid ${isDone ? C.border : C.accentLight}`, cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', transition: 'all 0.3s' }}>
                    {isDone ? <><Check size={18} /> تم إنجاز هذا التمرين</> : <><Sparkles size={18} /> ضع علامة عند إكمال التمرين</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
