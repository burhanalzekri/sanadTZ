import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PageIntro, Pill } from '@/components/page-ui';

export function SafeSpacePage() {
  const [text, setText] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentType, setCurrentType] = useState<'morning' | 'evening' | 'custom'>('morning');
  const [customId, setCustomId] = useState('');
  const [entries, setEntries] = useState<Array<{date: string, type: string, id: string, title: string, preview: string}>>([]);
  const [saved, setSaved] = useState(false);

  const getStorageKey = (date: string, type: string, id: string) => {
    if (type === 'custom') return `sana_safe_space_${date}_custom_${id}`;
    return `sana_safe_space_${date}_${type}`;
  };

  function loadEntries() {
    const allKeys = Object.keys(localStorage).filter(k => k.startsWith('sana_safe_space_'));
    const entryList = allKeys.map(key => {
      const parts = key.replace('sana_safe_space_', '').split('_');
      const date = parts[0];
      const type = parts[1] || 'custom';
      const id = parts[2] || '';
      const title = localStorage.getItem(`sana_safe_space_title_${date}_${type}_${id}`) || 'بدون عنوان';
      const preview = localStorage.getItem(key)?.substring(0, 40) || '';
      return { date, type, id, title, preview };
    }).sort((a, b) => b.date.localeCompare(a.date));
    setEntries(entryList);
  }

  useEffect(() => {
    const key = getStorageKey(currentDate, currentType, customId);
    const savedText = localStorage.getItem(key) || '';
    setText(savedText);
  }, [currentDate, currentType, customId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (text) {
        const key = getStorageKey(currentDate, currentType, customId);
        localStorage.setItem(key, text);
        const title = text.substring(0, 20).trim() + (text.length > 20 ? '...' : '');
        localStorage.setItem(`sana_safe_space_title_${currentDate}_${currentType}_${customId}`, title);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        loadEntries();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [text, currentDate, currentType, customId]);

  function selectType(type: 'morning' | 'evening' | 'custom') {
    setCurrentType(type);
    setCustomId(type === 'custom' ? Date.now().toString() : '');
  }

  function selectEntry(date: string, type: string, id: string) {
    setCurrentDate(date);
    setCurrentType(type as any);
    setCustomId(id);
  }

  function newCustomEntry() {
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
    setCurrentType('custom');
    setCustomId(Date.now().toString());
    setText('');
  }

  function clearText() {
    if (confirm('هل أنت متأكد من مسح هذه المذكرة؟')) {
      const key = getStorageKey(currentDate, currentType, customId);
      localStorage.removeItem(key);
      localStorage.removeItem(`sana_safe_space_title_${currentDate}_${currentType}_${customId}`);
      setText('');
      loadEntries();
    }
  }

  function clearAllEntries() {
    if (!confirm('سيتم حذف جميع مذكرات هذه المساحة من هذا المتصفح. هل تريد المتابعة؟')) return;
    Object.keys(localStorage)
      .filter((key) => key.startsWith('sana_safe_space_'))
      .forEach((key) => localStorage.removeItem(key));
    setEntries([]);
    setText('');
    setCurrentDate(new Date().toISOString().split('T')[0]);
    setCurrentType('morning');
    setCustomId('');
    setSaved(false);
  }

  const prompts = [
    'أشعر اليوم بـ...',
    'الشيء الذي يقلقني أكثر هو...',
    'أنا ممتن لـ...',
    'لو كنت أستطيع التحدث مع أحدهم، سأقول...',
    'غداً، أتمنى أن...',
    'أكثر ما أحتاجه الآن هو...'
  ];

  const encouragementMessages = [
    '✍️ الكتابة تريح القلب وتنظم الأفكار.',
    '💙 التعبير عن المشاعر يخفف الحمل الثقيل.',
    '🌱 كل كلمة تكتبها هي خطوة نحو الشفاء.',
    '🌟 لا توجد صياغة مثالية، فقط كن صادقاً.',
    '🌿 خذ وقتك في التعبير، كلمة واحدة تكفي.',
    '💪 أنت شجاع لأنك تواجه مشاعرك.',
    '✨ بعد الكتابة، ستشعر بخفة أكبر.'
  ];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (dateStr === today) return 'اليوم';
    if (dateStr === yesterday) return 'أمس';
    return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
  };

  const getTypeLabel = (type: string) => {
    if (type === 'morning') return '☀️ صباح';
    if (type === 'evening') return '🌙 مساء';
    return '📝 مذكرة';
  };

  return <div className="content-wrap page-space">
    <style>{`
      @keyframes scrollLeft {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      .ticker-wrapper {
        background: linear-gradient(90deg, #0f766e, #115e59);
        color: white;
        padding: 12px 0;
        border-radius: 12px;
        margin-bottom: 20px;
        overflow: hidden;
        position: relative;
        box-shadow: 0 4px 15px rgba(15,118,110,0.4);
      }
      .ticker-content {
        display: inline-block;
        animation: scrollLeft 25s linear infinite;
        white-space: nowrap;
        padding-left: 100%;
        font-weight: bold;
        font-size: 0.95em;
        color: white;
      }
      .ticker-content span {
        padding: 0 40px;
      }
    `}</style>

    <PageIntro eyebrow="مساحة كتابة خاصة" title="هنا، لا تحتاج أن ترتّب كلماتك." description="اكتب ما يخطر لك. يُحفظ في متصفحك ولا يُرسل إلى الخادم تلقائيًا؛ يمكنك مسحه متى شئت."/>

    <div className="ticker-wrapper">
      <div className="ticker-content">
        {encouragementMessages.map((msg, i) => (
          <span key={i}>{msg}</span>
        ))}
      </div>
    </div>

    <div className="privacy-strip">
      <ShieldCheck size={19}/>
      <span>تبقى كتابتك في تخزين المتصفح على هذا الجهاز، وهي غير مشفّرة وقد يطّلع عليها مستخدم آخر للجهاز.</span>
      <Pill>تخزين محلي</Pill>
    </div>

    <div style={{marginBottom: '20px', padding: '15px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap'}}>
        <p style={{marginBottom: '10px', fontWeight: 'bold', color: 'var(--primary)'}}>📖 اختر مذكرتك:</p>
        <Button variant="outline" onClick={clearAllEntries} disabled={entries.length === 0}>مسح جميع المذكرات</Button>
      </div>
      <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px'}}>
        <button onClick={() => selectType('morning')} style={{padding: '10px 20px', borderRadius: '20px', background: currentType === 'morning' ? 'var(--primary)' : 'transparent', color: currentType === 'morning' ? 'white' : 'var(--primary)', border: '1px solid var(--primary)', cursor: 'pointer', fontWeight: 'bold'}}>☀️ مذكرة الصباح</button>
        <button onClick={() => selectType('evening')} style={{padding: '10px 20px', borderRadius: '20px', background: currentType === 'evening' ? 'var(--primary)' : 'transparent', color: currentType === 'evening' ? 'white' : 'var(--primary)', border: '1px solid var(--primary)', cursor: 'pointer', fontWeight: 'bold'}}>🌙 مذكرة المساء</button>
        <button onClick={newCustomEntry} style={{padding: '10px 20px', borderRadius: '20px', background: currentType === 'custom' ? 'var(--primary)' : 'transparent', color: currentType === 'custom' ? 'white' : 'var(--primary)', border: '1px dashed var(--primary)', cursor: 'pointer', fontWeight: 'bold'}}>+ مذكرة حرة</button>
      </div>

      <div style={{display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px'}}>
        {entries.length === 0 && <p style={{color: 'var(--muted-foreground)', fontSize: '0.9em'}}>لا توجد إدخالات سابقة.</p>}
        {entries.map((entry, i) => (
          <button
            key={i}
            onClick={() => selectEntry(entry.date, entry.type, entry.id)}
            style={{padding: '10px 15px', borderRadius: '12px', border: (currentDate === entry.date && currentType === entry.type && customId === entry.id) ? '2px solid var(--primary)' : '1px solid var(--border)', background: (currentDate === entry.date && currentType === entry.type && customId === entry.id) ? 'var(--primary-glow)' : 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: '0.85em', whiteSpace: 'nowrap', textAlign: 'right', minWidth: '120px'}}
          >
            <div style={{fontWeight: 'bold', color: 'var(--primary)'}}>{formatDate(entry.date)} - {getTypeLabel(entry.type)}</div>
            <div style={{fontSize: '0.8em', color: 'var(--muted-foreground)'}}>{entry.title}</div>
          </button>
        ))}
      </div>
    </div>

    <div style={{marginBottom: '20px', padding: '15px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)'}}>
      <p style={{marginBottom: '10px', fontWeight: 'bold', color: 'var(--primary)'}}>✨ بدايات تساعدك:</p>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
        {prompts.map((p, i) => (
          <button key={i} onClick={() => setText(prev => prev + (prev ? ' ' : '') + p + ' ')} style={{padding: '8px 15px', borderRadius: '20px', background: 'var(--primary-glow)', border: '1px solid var(--primary)', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.9em'}}>
            {p}
          </button>
        ))}
      </div>
    </div>

    <section className="writing-panel">
      <div className="writing-toolbar">
        <div className="timer-label">
          <span style={{fontWeight: 'bold', color: 'var(--primary)'}}>{formatDate(currentDate)} - {getTypeLabel(currentType)}</span>
        </div>
      </div>

      <label className="sr-only" htmlFor="private-writing">مساحة الكتابة الخاصة</label>
      <Textarea
        id="private-writing"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={currentType === 'morning' ? 'صباح الخير. بماذا تشعر هذا الصباح؟' : currentType === 'evening' ? 'مساء الخير. كيف كان يومك؟' : 'ابدأ من كلمة واحدة...'}
        className="writing-area"
      />

      <div className="writing-footer">
        <span>خذ نفساً. لا تبحث عن الصياغة المثالية.</span>
        <Button variant="ghost" onClick={clearText}>امسح الكلمات</Button>
      </div>

      {saved && <p style={{textAlign: 'center', color: 'var(--primary)', fontSize: '0.9em', marginTop: '10px'}}>✅ تم الحفظ تلقائياً</p>}
    </section>

    {text.length > 0 && (
      <div style={{marginTop: '20px', padding: '15px', background: 'var(--primary-glow)', borderRadius: '16px', border: '1px solid var(--primary)', textAlign: 'center'}}>
        <p style={{margin: 0, fontWeight: 'bold', color: 'var(--primary)'}}>
          {text.length < 20 ? '🌱 بداية جميلة. استمر...' :
           text.length < 50 ? '🌿 أنت تتحدث، وهذا شجاع.' :
           text.length < 100 ? '🌳 كلماتك تتحرر. أحسنت.' :
           text.length < 200 ? '💪 أنت تفعل شيئاً عظيماً لنفسك.' :
           '🌟 رائع. لقد أفرغت الكثير. خذ نفساً عميقاً.'}
        </p>
      </div>
    )}

    <div className="quiet-callout" style={{marginTop: '20px'}}>
      <ShieldCheck/>
      <p>هذه الملاحظات غير مشفّرة في تخزين المتصفح؛ استخدم جهازًا موثوقًا ولا تكتب معلومات تحدد هويتك، وامسحها بعد الانتهاء على جهاز مشترك. إذا كنت في خطر مباشر، تواصل مع شخص قريب أو خدمات الطوارئ المحلية.</p>
    </div>

    {/* قصص نجاح */}
    <div style={{
      marginTop: '50px',
      padding: '30px',
      background: 'var(--surface)',
      borderRadius: '24px',
      border: '1px solid var(--border)',
      boxShadow: '0 15px 35px -5px var(--shadow-color), 0 0 20px rgba(16,185,129,0.1)',
      position: 'relative',
      overflow: 'hidden',
      transformStyle: 'preserve-3d',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px) scale(1.01)';
      e.currentTarget.style.boxShadow = '0 25px 50px -10px var(--shadow-hover), 0 0 30px rgba(16,185,129,0.3)';
      e.currentTarget.style.borderColor = 'var(--primary)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = '0 15px 35px -5px var(--shadow-color), 0 0 20px rgba(16,185,129,0.1)';
      e.currentTarget.style.borderColor = 'var(--border)';
    }}
    >
      <div className="shine-effect" style={{position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)', transform: 'skewX(-25deg)', transition: '0.6s'}}/>

      <h3 style={{color: 'var(--primary)', marginBottom: '20px', fontSize: '1.4em', display: 'flex', alignItems: 'center', gap: '10px'}}>
        <span style={{fontSize: '1.2em'}}>💙</span> مساحة للتجربة
      </h3>
      <p style={{fontStyle: 'italic', color: 'var(--text)', lineHeight: '1.9', marginBottom: '20px', fontSize: '1.05em', transform: 'translateZ(15px)'}}>
        لا تُنشر شهادة شخصية في هذه المساحة إلا بعد مراجعتها والحصول على موافقة صريحة من صاحبها. يمكنك البدء بخطوة صغيرة تناسبك اليوم.
      </p>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px', transform: 'translateZ(10px)'}}>
        <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2em'}}>س</div>
        <p style={{fontSize: '0.9em', color: 'var(--muted-foreground)', margin: 0}}>مساحة دعم دون شهادة منسوبة لمستخدم</p>
      </div>
    </div>
  </div>;
}
