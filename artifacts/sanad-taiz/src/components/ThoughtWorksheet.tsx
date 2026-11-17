import { useState, useEffect } from 'react';
import { Save, Check, Lightbulb, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';

export interface WorksheetField {
  icon?: string;
  label: string;
  placeholder?: string;
}

interface ThoughtWorksheetProps {
  exerciseId?: string;
  title?: string;
  fields?: WorksheetField[];
}

const DEFAULT_FIELDS: WorksheetField[] = [
  { icon: '💭', label: 'ما هي الفكرة التي تقلقك؟', placeholder: 'مثال: أنا فاشل...' },
  { icon: '🔍', label: 'ما الدليل الحقيقي على هذه الفكرة؟', placeholder: 'هل هناك حقائق ملموسة؟' },
  { icon: '💡', label: 'هل هناك تفسير آخر ممكن؟', placeholder: 'ماذا لو كان الأمر مختلفاً؟' },
  { icon: '🌱', label: 'ما الفكرة الأكثر توازناً؟', placeholder: 'مثال: أنا أبذل جهدي...' },
];

export function ThoughtWorksheet({ exerciseId, title, fields }: ThoughtWorksheetProps = {}) {
  const activeFields = fields && fields.length > 0 ? fields : DEFAULT_FIELDS;
  const storageKey = `sana_worksheet_${exerciseId || 'default'}`;
  const heading = title || 'ورقة عمل';

  // ألوان صريحة لا تعتمد على أي متغيرات خارجية
  const C = {
    bg: '#ffffff',
    text: '#3d3b37',
    muted: '#8c8577',
    border: '#e8e2d6',
    primary: '#5c7c66', // أخضر زيتي هادئ
    primaryLight: '#eef2ef',
  };

  const [step, setStep] = useState(0);
  const [values, setValues] = useState<string[]>(activeFields.map(() => ''));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed.values) && parsed.values.length === activeFields.length) {
          setValues(parsed.values);
        }
      } catch (e) {}
    }
  }, [storageKey, activeFields.length]);

  const saveWorksheet = () => {
    localStorage.setItem(storageKey, JSON.stringify({ values }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetWorksheet = () => {
    if (confirm('هل أنت متأكد من مسح الإجابات؟')) {
      setValues(activeFields.map(() => ''));
      localStorage.removeItem(storageKey);
    }
  };

  const currentField = activeFields[step];
  const currentValue = values[step] || '';
  const setCurrentValue = (val: string) => {
    const copy = [...values];
    copy[step] = val;
    setValues(copy);
  };

  return (
    <div dir="rtl" style={{
      background: C.bg, borderRadius: '16px', padding: '24px',
      border: `1px solid ${C.border}`, marginTop: '20px',
      boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)', fontFamily: 'inherit'
    }}>
      {/* العنوان */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ background: C.primaryLight, padding: '8px', borderRadius: '10px', color: C.primary }}>
          <Lightbulb size={20} />
        </div>
        <h3 style={{ margin: 0, color: C.text, fontSize: '1.1em', fontWeight: 'bold' }}>
          {heading}
        </h3>
      </div>

      {/* شريط التقدم */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {activeFields.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: '6px', borderRadius: '3px',
            background: i <= step ? C.primary : C.border,
            transition: 'background 0.3s'
          }} />
        ))}
      </div>

      {/* السؤال الحالي */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold',
          color: C.text, marginBottom: '12px', fontSize: '1.05em'
        }}>
          <span style={{ fontSize: '1.2em' }}>{currentField.icon || '📝'}</span>
          {currentField.label}
        </label>
        <textarea
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          placeholder={currentField.placeholder || ''}
          rows={5}
          dir="rtl"
          style={{
            width: '100%', padding: '16px', borderRadius: '12px',
            border: `1.5px solid ${C.border}`, background: '#fcfcfc',
            color: C.text, fontSize: '1em', fontFamily: 'inherit',
            resize: 'vertical', outline: 'none', transition: 'border 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = C.primary}
          onBlur={(e) => e.target.style.borderColor = C.border}
        />
      </div>

      {/* أزرار التنقل */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          style={{
            flex: 1, padding: '12px', borderRadius: '10px',
            background: '#f5f5f5', border: `1px solid ${C.border}`,
            color: step === 0 ? '#ccc' : C.text, cursor: step === 0 ? 'not-allowed' : 'pointer',
            fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px'
          }}
        >
          <ChevronRight size={18} /> السابق
        </button>
        <button
          onClick={() => setStep(Math.min(activeFields.length - 1, step + 1))}
          disabled={step === activeFields.length - 1}
          style={{
            flex: 1, padding: '12px', borderRadius: '10px',
            background: step === activeFields.length - 1 ? '#f5f5f5' : C.primary,
            border: 'none', color: step === activeFields.length - 1 ? '#ccc' : 'white',
            cursor: step === activeFields.length - 1 ? 'not-allowed' : 'pointer',
            fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px'
          }}
        >
          التالي <ChevronLeft size={18} />
        </button>
      </div>

      {/* أزرار الحفظ */}
      <div style={{ display: 'flex', gap: '10px', paddingTop: '20px', borderTop: `1px solid ${C.border}` }}>
        <button
          onClick={saveWorksheet}
          style={{
            flex: 1, padding: '12px', borderRadius: '10px',
            background: C.primaryLight, color: C.primary,
            border: 'none', cursor: 'pointer', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          {saved ? <><Check size={18} /> تم الحفظ بنجاح</> : <><Save size={18} /> حفظ إجاباتي</>}
        </button>
        <button
          onClick={resetWorksheet}
          style={{
            padding: '12px 16px', borderRadius: '10px',
            background: 'transparent', border: `1px solid ${C.border}`,
            color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
          }}
        >
          <RotateCcw size={16} /> مسح
        </button>
      </div>
    </div>
  );
}
