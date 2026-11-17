import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft, Check, ShieldCheck } from 'lucide-react';
import { useCreateBooking } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Link } from 'wouter';
import { PageIntro } from '@/components/page-ui';

export const bookingSchema=z.object({nickname:z.string().trim().min(2,'اكتب اسماً أو لقباً من حرفين على الأقل').max(80),contactMethod:z.enum(['phone','whatsapp','email']),contactValue:z.string().trim().min(5,'أدخل وسيلة تواصل صحيحة').max(120),preferredDate:z.string().min(1,'اختر اليوم الأنسب لك'),preferredTime:z.enum(['morning','afternoon','evening','anytime'],{required_error:'اختر الوقت الأنسب لك'}),consent:z.literal(true,{errorMap:()=>({message:'يرجى الموافقة قبل إرسال الطلب'})})});

export function BookingPage() {
  const mutation = useCreateBooking();
  const [receipt, setReceipt] = useState<string | null>(null);
  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema as any),
    defaultValues: {
      nickname: '',
      contactMethod: 'phone',
      contactValue: '',
      preferredDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      preferredTime: 'anytime',
      consent: false as unknown as true,
    },
  });

  const contactMethod = form.watch('contactMethod');
  const contactValue = form.watch('contactValue');
  const nickname = form.watch('nickname');
  const preferredDate = form.watch('preferredDate');
  const preferredTime = form.watch('preferredTime');

  const methodLabel = contactMethod === 'phone' ? 'اتصال هاتفي' : contactMethod === 'whatsapp' ? 'واتساب' : 'البريد الإلكتروني';
  const timeLabel = preferredTime === 'morning' ? 'صباحاً' : preferredTime === 'afternoon' ? 'بعد الظهر' : preferredTime === 'evening' ? 'مساءً' : 'أي وقت مناسب';

  function submit(values: z.infer<typeof bookingSchema>) {
    mutation.mutate({ data: values }, {
      onSuccess: r => {
        setReceipt(r.id);
        form.reset({
          nickname: '',
          contactMethod: 'phone',
          contactValue: '',
          preferredDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
          preferredTime: 'anytime',
          consent: false as unknown as true,
        });
      },
      onError: () => setReceipt(null),
    });
  }

  if (receipt) {
    return <div className="content-wrap page-space">
      <section className="success-panel" data-testid="booking-success">
        <span className="success-icon"><Check/></span>
        <div className="eyebrow">وصل طلبك</div>
        <h1 className="serif-ar">شكراً لثقتك.</h1>
        <p>تم تسجيل طلب التواصل. هذا ليس تأكيداً لموعد؛ وتعتمد أي متابعة على تهيئة خدمة التواصل وفريق الاستجابة.</p>
        <p className="receipt-code">رقم الطلب · {receipt}</p>
        <Link href="/" className="button-primary">العودة للرئيسية <ArrowLeft size={16}/></Link>
      </section>
    </div>;
  }

  return <div className="content-wrap page-space">
    <PageIntro eyebrow="تواصل خاص" title="اطلب جلسة، بطريقتك." description="شارك أقل قدر تحتاجه من المعلومات. لا حاجة لشرح ما تمر به في هذا الطلب."/>
    <div className="booking-guardian-note" role="note"><ShieldCheck size={19}/><p>إذا كان الطلب لقاصر، يجب أن يقدّمه ولي الأمر معه. لا تتحقق هذه النسخة إلكترونياً من هوية الولي أو موافقته؛ لا تُدرج بيانات تعريفية أو حساسة عن طفل.</p></div>

    <div className="booking-steps" data-testid="booking-steps">
      <span className="booking-step active"><span className="step-num">١</span><span className="step-label">ملء البيانات</span></span>
      <span className="booking-step-sep">—</span>
      <span className="booking-step"><span className="step-num">٢</span><span className="step-label">المراجعة</span></span>
      <span className="booking-step-sep">—</span>
      <span className="booking-step"><span className="step-num">٣</span><span className="step-label">الإرسال</span></span>
    </div>

    <div className="booking-layout">
      <section className="booking-form-panel">
        <div className="form-heading">
          <span className="form-step">١</span>
          <div><h2>طلب تواصل</h2><p>الحقول المطلوبة موضّحة، والقرار بيدك.</p></div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="booking-form" data-testid="form-booking">
            <FormField control={form.control} name="nickname" render={({field}) => <FormItem>
              <FormLabel>الاسم أو اللقب</FormLabel>
              <FormControl><Input placeholder="كيف نناديك؟" autoComplete="nickname" {...field} data-testid="input-booking-nickname"/></FormControl>
              <FormMessage/>
            </FormItem>}/>

            <FormField control={form.control} name="contactMethod" render={({field}) => <FormItem>
              <FormLabel>طريقة التواصل المناسبة</FormLabel>
              <div className="contact-method-picker" data-testid="picker-contact-method">
                <button type="button" className={field.value === 'phone' ? 'contact-pick active' : 'contact-pick'} onClick={() => field.onChange('phone')} data-testid="pick-phone">
                  <span className="contact-pick-icon">📞</span>
                  <span>اتصال هاتفي</span>
                </button>
                <button type="button" className={field.value === 'whatsapp' ? 'contact-pick active' : 'contact-pick'} onClick={() => field.onChange('whatsapp')} data-testid="pick-whatsapp">
                  <span className="contact-pick-icon">💬</span>
                  <span>واتساب</span>
                </button>
                <button type="button" className={field.value === 'email' ? 'contact-pick active' : 'contact-pick'} onClick={() => field.onChange('email')} data-testid="pick-email">
                  <span className="contact-pick-icon">✉️</span>
                  <span>بريد إلكتروني</span>
                </button>
              </div>
              <FormMessage/>
            </FormItem>}/>

            <FormField control={form.control} name="contactValue" render={({field}) => <FormItem>
              <FormLabel>{contactMethod === 'email' ? 'البريد الإلكتروني' : 'رقم التواصل'}</FormLabel>
              <FormControl>
                <Input
                  type={contactMethod === 'email' ? 'email' : 'tel'}
                  autoComplete={contactMethod === 'email' ? 'email' : 'tel'}
                  placeholder={contactMethod === 'email' ? 'name@example.com' : 'مثال: 777123456'}
                  {...field}
                  data-testid="input-booking-contact"
                />
              </FormControl>
              <FormMessage/>
            </FormItem>}/>

            <FormField control={form.control} name="preferredDate" render={({field}) => <FormItem>
              <FormLabel>اليوم الأنسب لك</FormLabel>
              <FormControl><Input type="date" min={new Date().toISOString().slice(0,10)} {...field} data-testid="input-booking-date"/></FormControl>
              <FormMessage/>
            </FormItem>}/>

            <FormField control={form.control} name="preferredTime" render={({field}) => <FormItem>
              <FormLabel>الوقت الأنسب للتواصل</FormLabel>
              <FormControl>
                <select className="form-select" {...field} data-testid="select-preferred-time">
                  <option value="morning">صباحاً</option>
                  <option value="afternoon">بعد الظهر</option>
                  <option value="evening">مساءً</option>
                  <option value="anytime">أي وقت مناسب</option>
                </select>
              </FormControl>
              <FormMessage/>
            </FormItem>}/>

            {nickname && contactValue && preferredDate && (
              <div className="booking-summary" data-testid="booking-summary">
                <div className="summary-heading"><Check size={18}/><h4>ملخص طلبك</h4></div>
                <p>سنتواصل معك عبر <strong>{methodLabel}</strong> على <strong>{contactValue}</strong></p>
                <p>اليوم المفضل: <strong>{preferredDate}</strong> — الوقت: <strong>{timeLabel}</strong></p>
                <p className="summary-note">يمكنك العودة وتعديل أي حقل قبل الإرسال.</p>
              </div>
            )}

            <FormField control={form.control} name="consent" render={({field}) => <FormItem className="consent-row">
              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-booking-consent"/></FormControl>
              <FormLabel>أوافق على استخدام هذه البيانات للتواصل معي بشأن هذا الطلب فقط.</FormLabel>
              <FormMessage/>
            </FormItem>}/>

            {mutation.isError && <div className="form-error" role="alert" data-testid="booking-error">لم نتمكن من إرسال الطلب. تحقق من البيانات وحاول مرة أخرى.</div>}

            <Button type="submit" disabled={mutation.isPending} className="submit-btn" data-testid="button-booking-submit">
              {mutation.isPending ? 'جاري الإرسال...' : 'أرسل طلب التواصل'}
              {!mutation.isPending && <ArrowLeft size={17}/>}
            </Button>
          </form>
        </Form>
      </section>

      <aside className="booking-aside">
        <div className="booking-aside-art">
          <div className="aside-sun"/>
          <div className="aside-arc"/>
        </div>
        <h3 className="serif-ar">شارك أقل ما تحتاجه.</h3>
        <p>لا تضمن هذه الواجهة وصول الطلب أو حفظه لدى فريق مختص. تحقّق من تهيئة الخدمة قبل إدخال معلومات تواصل حساسة، ولا تكتب أكثر مما يلزم.</p>
        <div className="important-card">
          <strong>مهم أن تعرف</strong>
          <p>سَنَد مساحة دعم مجتمعي وليست خدمة طوارئ أو علاج. إذا كان هناك خطر مباشر، اطلب مساعدة شخص قريب أو خدمات الطوارئ المحلية.</p>
        </div>
      </aside>
    </div>
  </div>;
}
