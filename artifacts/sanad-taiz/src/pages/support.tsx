import { ArrowLeft, Clock3, HeartHandshake, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';
import { emergencyNumbers, organizations, personalContact } from '@/config/emergency';
import { PageIntro } from '@/components/page-ui';

export function HelpNowPage() {
  const hasNumbers = emergencyNumbers.length > 0;
  const hasOrgs = organizations.length > 0;
  const hasWhatsapp = !!(personalContact.whatsapp && personalContact.whatsapp.trim());

  return <div className="content-wrap page-space help-now-page">
    <div className="help-header">
      <div className="help-emergency-icon"><ShieldCheck size={36}/></div>
      <h1 className="serif-ar">أنت لستَ وحدك.</h1>
      <p>إن كنت في خطر مباشر — لك أو لشخص آخر — اعرض أدناه بيانات الإحالة المحلية المهيأة في المنصة فقط.</p>
    </div>

    {/* أرقام الطوارئ */}
    <section className="help-section">
      <h2 className="serif-ar help-section-title"><ShieldCheck size={20}/> أرقام الطوارئ</h2>
      {hasNumbers ? (
        <div className="help-numbers">
          {emergencyNumbers.map((item, i) => (
            <a href={'tel:' + item.number.replace(/\s/g, '')} className="help-number-card" key={i} data-testid={'call-' + i}>
              <div className="help-num-label">{item.label}</div>
              <div className="help-num-value" dir="ltr">{item.number}</div>
              {item.description && <div className="help-num-desc">{item.description}</div>}
              <div className="help-num-call">اتصل الآن <ArrowLeft size={14}/></div>
            </a>
          ))}
        </div>
      ) : (
        <div className="help-pending" data-testid="pending-numbers">
          <Clock3 size={22}/>
          <div>
            <h4>لا تتوفر حالياً أرقام طوارئ محلية موثقة</h4>
            <p>لم تُهيّأ في المنصة أرقام محلية معتمدة حتى الآن. إذا كان الخطر مباشراً، انتقل إلى أقرب مرفق صحي متاح أو تواصل مع جهة طوارئ محلية موثوقة. لا تنتظر رداً من سند ولا تعتمد على رقم غير متحقق.</p>
          </div>
        </div>
      )}
    </section>

    {/* المنظمات الإنسانية */}
    <section className="help-section">
      <h2 className="serif-ar help-section-title"><HeartHandshake size={20}/> المنظمات الإنسانية</h2>
      {hasOrgs ? (
        <div className="help-orgs">
          {organizations.map((org, i) => (
            <div className="help-org-card" key={i}>
              <h4>{org.name}</h4>
              <p>{org.description}</p>
              {org.phone && <a href={'tel:' + org.phone} className="help-org-link" dir="ltr">{org.phone}</a>}
              {org.url && <a href={org.url} target="_blank" rel="noreferrer" className="help-org-link">زيارة الموقع</a>}
            </div>
          ))}
        </div>
      ) : (
        <div className="help-pending" data-testid="pending-orgs">
          <Clock3 size={22}/>
          <div>
            <h4>لا تتوفر حالياً جهات إحالة موثقة</h4>
            <p>لم تُهيّأ في المنصة أسماء أو أرقام جهات إحالة معتمدة بعد. راجع بيانات الإحالة المحلية الموثوقة أو أقرب مرفق صحي.</p>
          </div>
        </div>
      )}
    </section>

    {/* تواصل بشري مباشر */}
    <section className="help-section">
      <h2 className="serif-ar help-section-title"><HeartHandshake size={20}/> تواصل بشري مباشر</h2>
      {hasWhatsapp ? (
        <a href={`https://wa.me/${personalContact.whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noreferrer" className="help-whatsapp-card" data-testid="whatsapp-contact">
          <div className="help-wa-icon">💬</div>
          <div>
            <h4>{personalContact.name} — {personalContact.role}</h4>
            <p>{personalContact.note}</p>
          </div>
          <ArrowLeft size={20}/>
        </a>
      ) : (
        <div className="help-pending" data-testid="pending-whatsapp">
          <Clock3 size={22}/>
          <div>
            <h4>لا يوجد رقم تواصل مباشر مهيأ حالياً</h4>
            <p>لا تتوفر في المنصة قناة تواصل مباشر مهيأة الآن. لا تنتظر رداً من سند في الحالات العاجلة.</p>
          </div>
        </div>
      )}
    </section>

    {/* خطوات فورية للسلامة */}
    <div className="help-steps">
      <h2 className="serif-ar">خطوات فورية للسلامة</h2>
      <ul>
        <li>ابتعد عن أي شيء قد يؤذيك أو يؤذي غيرك.</li>
        <li>اتصل بشخص تثق به — لا تبقَ وحدك.</li>
        <li>تنفس ببطء: شهيق 4 ثوانٍ، حبس 4، زفير 6.</li>
        <li>إذا كان الخطر مباشراً، انتقل إلى مكان أكثر أماناً إن أمكن، واطلب مساعدة جهة محلية موثوقة أو توجّه إلى أقرب مرفق صحي. لا تنتظر رد المنصة.</li>
      </ul>
    </div>

    <div className="help-note">
      <ShieldCheck size={18}/>
      <span>سَنَد ليس خدمة طوارئ ولا يستقبل اتصالات أو يتابع الحالات الحرجة. في الخطر المباشر، لا تنتظر رد المنصة؛ اطلب مساعدة محلية موثوقة أو توجّه إلى أقرب مرفق صحي متاح.</span>
    </div>

    <Link href="/" className="button-secondary help-back">العودة للرئيسية <ArrowLeft size={16}/></Link>
  </div>;
}

export function PrivacyPage() {
  return <div className="content-wrap page-space privacy-page">
    <PageIntro eyebrow="الخصوصية والبيانات" title="بياناتك ملكك. ونحن نحترم ذلك." description="بلغة بسيطة: ما يُحفظ على هذا الجهاز، وما قد يحفظه الخادم عند تفعيله، وحدود الحماية."/>

    <div className="privacy-grid">
      <section className="privacy-block">
        <h3 className="serif-ar">ما قد يحفظه الخادم عند تفعيل API</h3>
        <ul>
          <li><b>طلبات الجلسات:</b> اسم مستعار وطريقة تواصل؛ يشفر المشروع بيانات التواصل بتشفير AES-256-GCM عند حفظها في قاعدة البيانات.</li>
          <li><b>حساب الإدارة:</b> البريد وتجزئة كلمة المرور باستخدام Scrypt.</li>
          <li><b>سجل النشاط:</b> أحداث إنشاء أو تعديل المحتوى الإداري.</li>
          <li>تحتاج هذه الوظائف إلى قاعدة PostgreSQL وإعدادها؛ معاينة المشروع الحالية لا تتصل بقاعدة بيانات.</li>
        </ul>
      </section>

      <section className="privacy-block">
        <h3 className="serif-ar">ما يُحفظ داخل المتصفح</h3>
        <ul>
          <li><b>المذكرات وورقة التفكير والامتنان وبعض تفضيلاتك:</b> تُخزَّن في `localStorage` لهذا المتصفح حتى تمسحها؛ هذا التخزين غير مشفّر، وقد يطّلع عليها مستخدم آخر للجهاز أو شيفرة ضارة تعمل في الموقع.</li>
          <li>استخدم جهازاً تثق به، ولا تكتب في المذكرات معلومات تكشف هويتك. صفحة المساحة الآمنة توفر مسح جميع مذكراتها، كما يمسح «الخروج السريع» تخزين المتصفح المحلي.</li>
          <li><b>إجابات المقاييس:</b> لا تُرسل إلى خادم التطبيق في هذه النسخة.</li>
          <li>لا يضيف التطبيق عنوان IP إلى سجل الطلبات، لكن البنية التحتية ومحدد معدل الطلب قد يعالجانه مؤقتاً.</li>
        </ul>
      </section>

      <section className="privacy-block privacy-warning">
        <h3 className="serif-ar">حدود حماية أنفسنا</h3>
        <p>التشفير أثناء التخزين لا يلغي مخاطر الجهاز أو الخادم أو الوصول الإداري. لا يمكن ضمان سرية مطلقة، وقد تتعرض البنية التحتية للاختراق أو التفتيش. لذلك:</p>
        <ul>
          <li>لا تشارك في طلب الجلسة أي معلومة قد تعرضك للخطر.</li>
          <li>استخدم اسمك المستعار، ورقم هاتف يمكنك تغييره إن أمكن.</li>
          <li>على الأجهزة المشتركة: استخدم زر «خروج سريع» بعد الانتهاء.</li>
        </ul>
      </section>

      <section className="privacy-block">
        <h3 className="serif-ar">حذف بياناتك</h3>
        <p>يمكنك مسح المذكرات المحلية من صفحة المساحة الآمنة أو مسح بيانات الموقع من إعدادات المتصفح. لا تتضمن هذه النسخة قناة آلية لمعالجة طلبات حذف بيانات الخادم أو مهلة حذف مضمونة؛ لا تُدخل بيانات حقيقية قبل اعتماد مسار واضح للحذف والاستجابة.</p>
      </section>
    </div>

    <div className="privacy-footer">
      <Link href="/" className="button-secondary">العودة للرئيسية <ArrowLeft size={16}/></Link>
      <Link href="/help-now" className="text-link">المساعدة العاجلة <ArrowLeft size={14}/></Link>
    </div>
  </div>;
}
