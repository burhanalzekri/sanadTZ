import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { type ContentItem } from '@workspace/api-client-react';
import { useLocation } from 'wouter';
import { Pill } from '@/components/page-ui';

export function getImageForTitle(title: string): string {
  const t = title || '';
  // مقالات
  if (t.includes('القلق')) return 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop';
  if (t.includes('الصدمة')) return 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=800&auto=format&fit=crop';
  if (t.includes('الأطفال')) return 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop';
  if (t.includes('الضغوط')) return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop';
  if (t.includes('العلاقات')) return 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop';
  if (t.includes('الراحة')) return 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop';
  if (t.includes('العودة')) return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop';
  if (t.includes('البداية')) return 'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=800&auto=format&fit=crop';
  if (t.includes('الإرهاق')) return 'https://images.unsplash.com/photo-1517436073-3b1b1167a7f2?q=80&w=800&auto=format&fit=crop';
  if (t.includes('التنفس') || t.includes('التهدئة')) return 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop';
  // فيديوهات
  if (t.includes('الإدمان')) return 'https://images.unsplash.com/photo-1517436073-3b1b1167a7f2?q=80&w=800&auto=format&fit=crop';
  if (t.includes('الاكتئاب')) return 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop';
  if (t.includes('الغضب')) return 'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=800&auto=format&fit=crop';
  if (t.includes('النوم') || t.includes('الأرق')) return 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop';
  // صوتيات
  if (t.includes('تأمل') || t.includes('استرخاء')) return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop';
  if (t.includes('نفس') || t.includes('تنفس')) return 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop';

  // صورة افتراضية (طبيعة هادئة)
  return 'https://images.unsplash.com/photo-1506744626753-eda818c6cce5?q=80&w=800&auto=format&fit=crop';
}

export function ResourceCard({ item, compact=false }: { item: ContentItem; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const kindName = { article: 'مقال', guide: 'دليل', course: 'دورة', video: 'فيديو', audio: 'صوت' };

  // إذا كان العنصر تقييماً، ننتقل إلى صفحة التقييمات
  const handleClick = () => {
    if (item.category === 'التقييمات') {
      setLocation('/assessment');
    } else {
      setOpen(true);
    }
  };

  return <>
    <article className={compact ? 'resource-card compact' : 'resource-card'} data-testid={`card-resource-${item.id}`}>
      <button className="resource-card-btn" onClick={handleClick} aria-label={`افتح ${item.title}`} data-testid={`button-open-resource-${item.id}`}>
        <div className="resource-visual" style={{backgroundImage: `url(${item.coverImage || item.coverImage || getImageForTitle(item.title)})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="resource-visual-overlay"/>
          <span className="resource-duration">{item.duration || (item.kind === 'video' ? 'فيديو' : item.kind === 'audio' ? 'صوت' : 'قراءة')}</span>
        </div>
        <div className="resource-card-body">
          <div className="resource-meta"><Pill>{kindName[item.kind]}</Pill><span>{item.category}</span></div>
          <h3 className="serif-ar">{item.title}</h3>
          <p>{item.summary}</p>
          <span className="resource-open-link">افتح المحتوى <ArrowLeft size={16}/></span>
        </div>
      </button>
    </article>
    {open && <div className="modal-backdrop" role="presentation" onClick={()=>setOpen(false)}><section className="resource-modal" role="dialog" aria-modal="true" aria-label={item.title} onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setOpen(false)} aria-label="إغلاق" data-testid="button-close-resource"><X/></button><div style={{display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px'}}><img src={item.coverImage || item.coverImage || getImageForTitle(item.title)} alt={item.title} style={{width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: '0 0 20px rgba(16,185,129,0.3)'}} /><div><Pill>{kindName[item.kind]} · {item.category}</Pill><h2 className="serif-ar" style={{color: 'var(--primary)', margin: 0}}>{item.title}</h2></div></div><p className="modal-summary">{item.summary}</p>{item.mediaUrl && (item.kind==='video' ? <video controls src={item.mediaUrl} className="media-player"/> : item.kind==='audio' ? <audio controls src={item.mediaUrl} className="audio-player"/> : <a href={item.mediaUrl} target="_blank" rel="noreferrer" className="text-link">افتح الرابط <ArrowLeft size={16}/></a>)}{item.body && <div className="resource-body" dangerouslySetInnerHTML={{ __html: item.body }} />}<p className="modal-footnote">محتوى مساند للتعلّم الذاتي، وليس بديلاً عن دعم المختصين.</p></section></div>}
  </>;
}
