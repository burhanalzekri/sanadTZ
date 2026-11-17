import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';

const C = {
  bg: '#f7f7ef', card: '#ffffff', text: '#173d34', muted: '#64756a',
  border: '#dce6dd', accent: '#237863',
};
const storyNotice = 'المواد القصصية في هذه النسخة لا تتضمن بيانات تحقق أو موافقات نشر مستقلة لكل قصة؛ لذلك لا تُعرض كشهادات موثقة أو نصيحة علاجية.';

interface Story { id: string; title: string; category: string; image: string; excerpt: string; content: string; }

export function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selected, setSelected] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/stories/index.json').then(r => r.json()).then(d => { setStories(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', background: C.bg, minHeight: '100vh' }}>جاري التحميل...</div>;

  if (selected) {
    return (
      <div style={{ background: C.bg, minHeight: '100vh', paddingTop: '30px', paddingBottom: '50px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <button onClick={() => setSelected(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', background: C.card, color: C.muted, border: `1px solid ${C.border}`, cursor: 'pointer', marginBottom: '30px' }}>
            <ArrowLeft size={18} /> العودة إلى القصص
          </button>
          <div style={{ background: C.card, borderRadius: '24px', padding: '40px 30px', border: `1px solid ${C.border}`, boxShadow: '0 8px 0 rgba(16,76,65,.06), 0 22px 40px -30px rgba(16,76,65,.35)' }}>
            <img src={selected.image} alt={selected.title} style={{ width: '100%', borderRadius: '16px', marginBottom: '25px' }} />
            <h1 style={{ color: C.text, fontSize: '2em', marginBottom: '10px' }}>{selected.title}</h1>
            <p style={{ color: C.muted, marginBottom: '12px' }}>موضوع: {selected.category}</p>
            <p role="note" style={{ color: '#65552e', background: '#fbf5e4', border: '1px solid #ead89e', borderRadius: '14px', padding: '12px 16px', marginBottom: '25px', lineHeight: 1.7 }}>{storyNotice}</p>
            <div style={{ color: C.text, lineHeight: 1.9, fontSize: '1.05em', whiteSpace: 'pre-wrap' }}>{selected.content}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', paddingTop: '30px', paddingBottom: '50px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ background: C.card, borderRadius: '24px', padding: '35px 30px', marginBottom: '40px', border: `1px solid ${C.border}`, boxShadow: '0 8px 0 rgba(16,76,65,.06), 0 22px 40px -30px rgba(16,76,65,.35)', textAlign: 'center' }}>
          <BookOpen size={48} style={{ color: C.accent, marginBottom: '15px' }} />
          <h1 style={{ color: C.text, fontSize: '1.8em', marginBottom: '10px' }}>قصص وتجارب</h1>
          <p role="note" style={{ color: C.muted, maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>{storyNotice}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
          {stories.map(s => (
            <div key={s.id} onClick={() => setSelected(s)} style={{ background: C.card, borderRadius: '20px', border: `1px solid ${C.border}`, boxShadow: '0 7px 0 rgba(16,76,65,.05), 0 18px 34px -28px rgba(16,76,65,.35)', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <img src={s.image} alt={s.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.8em', color: C.accent, fontWeight: 'bold' }}>{s.category}</span>
                <h3 style={{ margin: '10px 0', color: C.text, fontSize: '1.2em' }}>{s.title}</h3>
                <p style={{ color: C.muted, fontSize: '0.9em', marginBottom: '15px', lineHeight: 1.6 }}>{s.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: C.muted, fontSize: '0.85em' }}>
                  <BookOpen size={14} /> مادة قصصية للتأمل
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
