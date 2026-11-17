import { useEffect, useRef, useState } from 'react';
import { type ContentItem, type ContentItemInput, type Pathway, type PathwayInput } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { organizations, personalContact } from '@/config/emergency';
import { useToast } from '@/components/toast-system';
import { useConfirm } from '@/components/confirm-dialog';
import { LoadingBlock } from '@/components/page-ui';

export function EmergencyAdmin() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [whatsapp, setWhatsapp] = useState('');
  const [whatsappName, setWhatsappName] = useState('سَنَد تعز');
  const [whatsappNote, setWhatsappNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editContact, setEditContact] = useState<any | null>(null);
  const [editOrg, setEditOrg] = useState<any | null>(null);
  const toast = useToast();
  const confirm = useConfirm();

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch('/api/public/help-now');
      if (!res.ok) throw new Error('فشل تحميل بيانات المساعدة');
      const data = await res.json();
      setContacts(data.contacts || []);
      setOrgs(data.organizations || []);
      setWhatsapp(data.personalContact?.whatsapp || '');
      setWhatsappName(data.personalContact?.name || 'سَنَد تعز');
      setWhatsappNote(data.personalContact?.note || '');
    } catch {
      toast.error('تعذّر تحميل البيانات', 'تحقق من اتصالك.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  async function saveContact(data: any) {
    setSaving(true);
    try {
      const res = data.id
        ? await fetch(`/api/admin/emergency-contacts/${data.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        : await fetch('/api/admin/emergency-contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('فشل الحفظ');
      toast.success(data.id ? 'تم تحديث الرقم' : 'تم إضافة الرقم', data.label);
      setEditContact(null);
      await loadData();
    } catch {
      toast.error('تعذّر الحفظ', 'حاول مرة أخرى.');
    } finally { setSaving(false); }
  }

  async function deleteContact(id: string) {
    const ok = await confirm({ title: 'تأكيد الحذف', message: 'هل تريد حذف هذا الرقم نهائياً؟', confirmText: 'نعم، احذف', cancelText: 'إلغاء', danger: true });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/emergency-contacts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('فشل الحذف');
      toast.success('تم حذف الرقم');
      await loadData();
    } catch { toast.error('تعذّر الحذف'); }
  }

  async function saveOrg(data: any) {
    setSaving(true);
    try {
      const res = data.id
        ? await fetch(`/api/admin/organizations/${data.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        : await fetch('/api/admin/organizations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('فشل الحفظ');
      toast.success(data.id ? 'تم تحديث المنظمة' : 'تم إضافة المنظمة', data.name);
      setEditOrg(null);
      await loadData();
    } catch {
      toast.error('تعذّر الحفظ', 'حاول مرة أخرى.');
    } finally { setSaving(false); }
  }

  async function deleteOrg(id: string) {
    const ok = await confirm({ title: 'تأكيد الحذف', message: 'هل تريد حذف هذه المنظمة نهائياً؟', confirmText: 'نعم، احذف', cancelText: 'إلغاء', danger: true });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/organizations/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('فشل الحذف');
      toast.success('تم حذف المنظمة');
      await loadData();
    } catch { toast.error('تعذّر الحذف'); }
  }

  async function saveWhatsapp() {
    setSaving(true);
    try {
      const responses = await Promise.all([
        fetch('/api/admin/settings/whatsapp_number', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: whatsapp || null }) }),
        fetch('/api/admin/settings/whatsapp_name', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: whatsappName || null }) }),
        fetch('/api/admin/settings/whatsapp_note', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: whatsappNote || null }) }),
      ]);
      if (responses.some((res) => !res.ok)) {
        throw new Error('تعذّر حفظ بعض الإعدادات');
      }
      toast.success('تم حفظ إعدادات الواتساب', whatsapp ? 'الرقم: ' + whatsapp : 'تم مسح الرقم');
    } catch {
      toast.error('تعذّر حفظ الإعدادات كاملة', 'قد تكون بعض القيم حُفظت؛ أعد تحميل الصفحة للتحقق.');
    } finally { setSaving(false); }
  }

  if (loading) return <div className="admin-section"><LoadingBlock/></div>;

  return <>
    {/* أرقام الطوارئ */}
    <section className="admin-section">
      <div className="admin-section-head">
        <div><h2>📞 أرقام الطوارئ</h2><p>تظهر في صفحة /help-now للمستخدمين.</p></div>
        <Button onClick={() => setEditContact({ label: '', number: '', description: '', sortOrder: '0', published: true })}>+ رقم جديد</Button>
      </div>
      {editContact && <div className="emergency-editor">
        <h3>{editContact.id ? 'تعديل الرقم' : 'رقم جديد'}</h3>
        <div className="editor-grid">
          <label>الاسم<Input value={editContact.label} onChange={e => setEditContact({...editContact, label: e.target.value})} placeholder="مثال: الإسعاف"/></label>
          <label>الرقم<Input value={editContact.number} onChange={e => setEditContact({...editContact, number: e.target.value})} placeholder="رقم موثق" dir="ltr"/></label>
          <label>الوصف<Input value={editContact.description || ''} onChange={e => setEditContact({...editContact, description: e.target.value})} placeholder="الطوارئ الطبية"/></label>
          <label>الترتيب<Input value={editContact.sortOrder} onChange={e => setEditContact({...editContact, sortOrder: e.target.value})} placeholder="0" dir="ltr"/></label>
        </div>
        <div className="editor-buttons">
          <Button onClick={() => saveContact(editContact)} disabled={saving}>{saving ? 'جارٍ الحفظ...' : 'حفظ'}</Button>
          <Button variant="outline" onClick={() => setEditContact(null)}>إلغاء</Button>
        </div>
      </div>}
      {contacts.length === 0 ? <div className="notice-card">لا توجد أرقام بعد. اضغط "+ رقم جديد" للبدء.</div> :
        <div className="emergency-list">
          {contacts.map(c => <div className="emergency-row" key={c.id}>
            <div className="emergency-row-info">
              <b>{c.label}</b>
              <span className="emergency-num" dir="ltr">{c.number}</span>
              {c.description && <small>{c.description}</small>}
            </div>
            <div className="emergency-row-actions">
              <button onClick={() => setEditContact({...c})}>تعديل</button>
              <button className="danger-action" onClick={() => deleteContact(c.id)}>حذف</button>
            </div>
          </div>)}
        </div>
      }
    </section>

    {/* المنظمات */}
    <section className="admin-section">
      <div className="admin-section-head">
        <div><h2>🏥 المنظمات الإنسانية</h2><p>تظهر في صفحة /help-now.</p></div>
        <Button onClick={() => setEditOrg({ name: '', description: '', phone: '', url: '', sortOrder: '0', published: true })}>+ منظمة جديدة</Button>
      </div>
      {editOrg && <div className="emergency-editor">
        <h3>{editOrg.id ? 'تعديل المنظمة' : 'منظمة جديدة'}</h3>
        <div className="editor-grid">
          <label>الاسم<Input value={editOrg.name} onChange={e => setEditOrg({...editOrg, name: e.target.value})} placeholder="اسم جهة موثقة"/></label>
          <label>الوصف<Input value={editOrg.description} onChange={e => setEditOrg({...editOrg, description: e.target.value})}/></label>
          <label>الهاتف<Input value={editOrg.phone || ''} onChange={e => setEditOrg({...editOrg, phone: e.target.value})} dir="ltr"/></label>
          <label>الموقع<Input value={editOrg.url || ''} onChange={e => setEditOrg({...editOrg, url: e.target.value})} dir="ltr" placeholder="https://"/></label>
        </div>
        <div className="editor-buttons">
          <Button onClick={() => saveOrg(editOrg)} disabled={saving}>{saving ? 'جارٍ الحفظ...' : 'حفظ'}</Button>
          <Button variant="outline" onClick={() => setEditOrg(null)}>إلغاء</Button>
        </div>
      </div>}
      {orgs.length === 0 ? <div className="notice-card">لا توجد منظمات بعد.</div> :
        <div className="emergency-list">
          {orgs.map(o => <div className="emergency-row" key={o.id}>
            <div className="emergency-row-info">
              <b>{o.name}</b>
              <small>{o.description}</small>
              {o.phone && <span dir="ltr">{o.phone}</span>}
            </div>
            <div className="emergency-row-actions">
              <button onClick={() => setEditOrg({...o})}>تعديل</button>
              <button className="danger-action" onClick={() => deleteOrg(o.id)}>حذف</button>
            </div>
          </div>)}
        </div>
      }
    </section>

    {/* واتساب */}
    <section className="admin-section">
      <div className="admin-section-head">
        <div><h2>💬 التواصل الشخصي (واتساب)</h2><p>رقم مباشر يظهر في /help-now.</p></div>
      </div>
      <div className="emergency-editor">
        <div className="editor-grid">
          <label>الاسم<Input value={whatsappName} onChange={e => setWhatsappName(e.target.value)}/></label>
          <label>رقم الواتساب<Input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+967771234567" dir="ltr"/></label>
          <label className="editor-wide">ملاحظة<Input value={whatsappNote} onChange={e => setWhatsappNote(e.target.value)} placeholder="تواصل مباشر مع الفريق"/></label>
        </div>
        <div className="editor-buttons">
          <Button onClick={saveWhatsapp} disabled={saving}>{saving ? 'جارٍ الحفظ...' : 'حفظ إعدادات الواتساب'}</Button>
        </div>
      </div>
    </section>
  </>;
}

export function ImageUploadField({ value, onChange, label = "صورة الغلاف" }: { value: string; onChange: (url: string) => void; label?: string }) {
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.warning('حجم الصورة كبير جداً', 'الحد الأقصى 5 MB. جرّب صورة أصغر.');
      return;
    }

    setUploading(true);


    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'فشل رفع الصورة');
      }

      const { url } = await res.json();
      onChange(url);
      toast.success('تم رفع الصورة بنجاح', 'الصورة جاهزة للحفظ.');
    } catch (err) {
      toast.error('تعذّر رفع الصورة', err instanceof Error ? err.message : 'حاول مرة أخرى.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return <div className="image-upload-field">
    <label className="image-upload-label">{label}</label>

    <div className="image-upload-actions">
      <button
        type="button"
        className="image-upload-btn"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? '⏳ جارٍ الرفع...' : '📷 اختيار من الجهاز'}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />

      <span className="image-upload-or">أو</span>

      <input
        type="text"
        className="image-upload-url"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="https://... أو /uploads/..."
      />
    </div>


    {value && <div className="image-upload-preview">
      <img src={value} alt="معاينة" onError={e => (e.currentTarget.style.display = 'none')} />
      <button
        type="button"
        className="image-upload-remove"
        onClick={() => onChange('')}
        aria-label="حذف الصورة"
      >×</button>
    </div>}
  </div>;
}

export function PathwayEditor({value,busy,onCancel,onSave}:{value:Pathway;busy:boolean;onCancel:()=>void;onSave:(data:PathwayInput)=>void}){
  const [title,setTitle]=useState(value.title);
  const [slug,setSlug]=useState(value.slug);
  const [description,setDescription]=useState(value.description);
  const [steps,setSteps]=useState(value.steps.join('\n'));
  const [activities,setActivities]=useState(value.activities.join('\n'));
  const [coverImage,setCoverImage]=useState(value.coverImage||'');
  const [published,setPublished]=useState(value.published);

  // ✨ حقول جديدة
  const [definition,setDefinition]=useState(value.definition||'');
  const [forms,setForms]=useState((value.forms||[]).map(f=>`${f.name} | ${f.desc}`).join('\n'));
  const [causes,setCauses]=useState((value.causes||[]).join('\n'));
  const [symptoms,setSymptoms]=useState((value.symptoms||[]).join('\n'));
  const [helpSources,setHelpSources]=useState((value.helpSources||[]).join('\n'));
  const [audioUrl,setAudioUrl]=useState(value.audioUrl||'');
  const [videoUrl,setVideoUrl]=useState(value.videoUrl||'');
  const [heroImage,setHeroImage]=useState(value.heroImage||'');

  return <form className="editor-panel" onSubmit={e=>{e.preventDefault();onSave({
    title,slug,description,coverImage:coverImage||null,published,
    steps:steps.split('\n').map(x=>x.trim()).filter(Boolean),
    activities:activities.split('\n').map(x=>x.trim()).filter(Boolean),
    definition:definition||null,
    forms:forms.split('\n').map(x=>x.trim()).filter(Boolean).map(line=>{
      const [name,desc]=line.split('|').map(x=>x.trim());
      return {name:name||'',desc:desc||''};
    }).filter(f=>f.name),
    causes:causes.split('\n').map(x=>x.trim()).filter(Boolean),
    symptoms:symptoms.split('\n').map(x=>x.trim()).filter(Boolean),
    helpSources:helpSources.split('\n').map(x=>x.trim()).filter(Boolean),
    audioUrl:audioUrl||null,
    videoUrl:videoUrl||null,
    heroImage:heroImage||null,
  });}} data-testid="form-pathway-editor">

    {/* القسم الأساسي */}
    <div className="editor-grid">
      <label>العنوان<Input required value={title} onChange={e=>setTitle(e.target.value)} data-testid="input-pathway-title"/></label>
      <label>الرابط المختصر<Input required value={slug} onChange={e=>setSlug(e.target.value)} data-testid="input-pathway-slug"/></label>
      <label className="editor-wide">الوصف القصير<Textarea required value={description} onChange={e=>setDescription(e.target.value)} data-testid="input-pathway-description"/></label>
    </div>

    {/* قسم التعريف */}
    <div className="editor-section">
      <h4 className="editor-section-title">📖 التعريف (ما هو؟)</h4>
      <label className="editor-wide">
        <Textarea rows={4} value={definition} onChange={e=>setDefinition(e.target.value)} placeholder="الحزن شعور إنساني طبيعي..." data-testid="input-pathway-definition"/>
      </label>
    </div>

    {/* قسم الأنواع */}
    <div className="editor-section">
      <h4 className="editor-section-title">📊 الأنواع والأشكال (سطر لكل نوع: الاسم | الوصف)</h4>
      <label className="editor-wide">
        <Textarea rows={4} value={forms} onChange={e=>setForms(e.target.value)} placeholder="حزن حاد | بعد صدمة مباشرة..." data-testid="input-pathway-forms"/>
      </label>
    </div>

    {/* قسم الأسباب */}
    <div className="editor-section">
      <h4 className="editor-section-title">🔍 الأسباب (سطر لكل سبب)</h4>
      <label className="editor-wide">
        <Textarea rows={4} value={causes} onChange={e=>setCauses(e.target.value)} placeholder="فقدان شخص عزيز&#10;انفصال أو طلاق&#10;نزوح أو هجرة" data-testid="input-pathway-causes"/>
      </label>
    </div>

    {/* قسم الأعراض */}
    <div className="editor-section">
      <h4 className="editor-section-title">🩺 الأعراض (سطر لكل عَرَض)</h4>
      <label className="editor-wide">
        <Textarea rows={4} value={symptoms} onChange={e=>setSymptoms(e.target.value)} placeholder="بكاء متكرر&#10;إرهاق&#10;انسحاب اجتماعي" data-testid="input-pathway-symptoms"/>
      </label>
    </div>

    {/* قسم مصادر مساعدة */}
    <div className="editor-section">
      <h4 className="editor-section-title">💡 مصادر المساعدة (سطر لكل مصدر)</h4>
      <label className="editor-wide">
        <Textarea rows={3} value={helpSources} onChange={e=>setHelpSources(e.target.value)} placeholder="تحدث مع شخص تثق به&#10;جرّب مسار الحزن&#10;اطلب جلسة خاصة" data-testid="input-pathway-help"/>
      </label>
    </div>

    {/* قسم الوسائط */}
    <div className="editor-section">
      <h4 className="editor-section-title">🎧 مقطع صوتي</h4>
      <div className="editor-grid">
        <label className="editor-wide">رابط الصوت (mp3) أو ارفع ملفاً<Input value={audioUrl} onChange={e=>setAudioUrl(e.target.value)} placeholder="/uploads/audio/... أو https://..." data-testid="input-pathway-audio"/></label>
      </div>
      {audioUrl && <audio controls src={audioUrl} style={{width:'100%',marginTop:8,borderRadius:8}}/>}
    </div>

    <div className="editor-section">
      <h4 className="editor-section-title">🎬 مقطع فيديو</h4>
      <div className="editor-grid">
        <label className="editor-wide">رابط الفيديو (mp4) أو YouTube<Input value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="/uploads/video/... أو https://youtube.com/..." data-testid="input-pathway-video"/></label>
      </div>
      {videoUrl && videoUrl.endsWith('.mp4') && <video controls src={videoUrl} style={{width:'100%',marginTop:8,borderRadius:8,maxHeight:200}}/>}
    </div>

    {/* قسم Hero Image */}
    <div className="editor-section">
      <h4 className="editor-section-title">🖼️ صورة Hero (خلفية الصفحة)</h4>
      <div className="editor-wide">
        <ImageUploadField value={heroImage} onChange={setHeroImage} label="صورة الغلاف الكبيرة" />
      </div>
    </div>

    {/* قسم الخطوات والأنشطة */}
    <div className="editor-section">
      <h4 className="editor-section-title">✅ الخطوات والأنشطة</h4>
      <div className="editor-grid">
        <label>الخطوات (سطر لكل خطوة)<Textarea value={steps} onChange={e=>setSteps(e.target.value)} data-testid="input-pathway-steps"/></label>
        <label>الأنشطة (سطر لكل نشاط)<Textarea value={activities} onChange={e=>setActivities(e.target.value)} data-testid="input-pathway-activities"/></label>
      </div>
    </div>

    {/* صورة الغلاف */}
    <div className="editor-section">
      <h4 className="editor-section-title">🎨 صورة الغلاف (للبطاقة)</h4>
      <div className="editor-wide">
        <ImageUploadField value={coverImage} onChange={setCoverImage} label="صورة الغلاف (اختياري)" />
      </div>
    </div>

    <label className="publish-toggle">
      <input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)}/> نشر المسار
    </label>
    <div className="editor-buttons">
      <Button type="submit" disabled={busy} data-testid="button-save-pathway">{busy?'جارٍ الحفظ…':'حفظ المسار'}</Button>
      <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-pathway">إلغاء</Button>
    </div>
  </form>;
}

export function ResourceEditor({value,busy,onCancel,onSave}:{value:ContentItem;busy:boolean;onCancel:()=>void;onSave:(data:ContentItemInput)=>void}){
  const [title,setTitle]=useState(value.title);
  const [summary,setSummary]=useState(value.summary);
  const [kind,setKind]=useState<ContentItemInput['kind']>(value.kind);
  const [category,setCategory]=useState(value.category);
  const [body,setBody]=useState(value.body||'');
  const [mediaUrl,setMediaUrl]=useState(value.mediaUrl||'');
  const [coverImage,setCoverImage]=useState(value.coverImage||'');
  const [author,setAuthor]=useState(value.author||'');
  const [duration,setDuration]=useState(value.duration||'');
  const [published,setPublished]=useState(value.published);
  return <form className="editor-panel" onSubmit={e=>{e.preventDefault();onSave({title,summary,kind,category,body:body||null,mediaUrl:mediaUrl||null,coverImage:coverImage||null,author:author||null,duration:duration||null,published});}} data-testid="form-resource-editor">
    <div className="editor-grid">
      <label>العنوان<Input required value={title} onChange={e=>setTitle(e.target.value)} data-testid="input-resource-title"/></label>
      <label>التصنيف<Input required value={category} onChange={e=>setCategory(e.target.value)} data-testid="input-resource-category"/></label>
      <label>النوع<select className="form-select" value={kind} onChange={e=>setKind(e.target.value as ContentItemInput['kind'])} data-testid="select-resource-kind"><option value="article">مقال</option><option value="guide">دليل</option><option value="course">دورة</option><option value="video">فيديو</option><option value="audio">صوت</option></select></label>
      <label>المؤلف / المصدر<Input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="مثال: د. أحمد علي" data-testid="input-resource-author"/></label>
      <div className="editor-wide">
        <ImageUploadField value={coverImage} onChange={setCoverImage} label="🖼️ صورة الغلاف" />
      </div>
      <label>المدة<Input value={duration} onChange={e=>setDuration(e.target.value)} placeholder="مثال: 5 دقائق أو 3:45" data-testid="input-resource-duration"/></label>
      <label>رابط الوسائط (فيديو/صوت)<Input value={mediaUrl} onChange={e=>setMediaUrl(e.target.value)} placeholder="https://..." data-testid="input-resource-media"/></label>
      <label className="editor-wide">الملخص<Textarea required value={summary} onChange={e=>setSummary(e.target.value)} data-testid="input-resource-summary"/></label>
      <label className="editor-wide">المحتوى الداخلي<Textarea value={body} onChange={e=>setBody(e.target.value)} data-testid="input-resource-body"/></label>
    </div>
    <label className="publish-toggle"><input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)}/> نشر المحتوى</label>
    <div className="editor-buttons">
      <Button type="submit" disabled={busy} data-testid="button-save-resource">{busy?'جارٍ الحفظ…':'حفظ المحتوى'}</Button>
      <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-resource">إلغاء</Button>
    </div>
  </form>;
}
