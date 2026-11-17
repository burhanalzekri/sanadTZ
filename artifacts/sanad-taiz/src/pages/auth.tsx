import { useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/components/toast-system';

export function SignInPage(){
  const [,setLocation]=useLocation(); const queryClient = useQueryClient(); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [busy,setBusy]=useState(false);
  const toast = useToast();
  async function submit(e:FormEvent){e.preventDefault();setBusy(true);try{const response=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({email,password})});const data=await response.json();if(!response.ok)throw new Error(data.error||'تعذر تسجيل الدخول');toast.success('مرحباً بعودتك', 'تم تسجيل الدخول بنجاح.');queryClient.clear();setLocation('/admin');}catch(err){toast.error('تعذّر تسجيل الدخول', err instanceof Error ? err.message : 'تحقق من بياناتك.');}finally{setBusy(false);}}
  return <div className="auth-page" dir="rtl"><div className="auth-note"><Link href="/" className="brand"><span className="brand-mark"><HeartHandshake/></span><span><b>سَنَد</b><small>تعز · مساحة للخطوة الأولى</small></span></Link><p className="serif-ar">أهلاً بعودتك.<br/>مساحتك تنتظرك.</p></div><form className="auth-form" onSubmit={submit}><h1 className="serif-ar">تسجيل الدخول</h1><p>أدخل بيانات حساب الفريق للوصول إلى لوحة الإدارة.</p><label>البريد الإلكتروني<Input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>كلمة المرور<Input type="password" autoComplete="current-password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)}/></label><Button type="submit" disabled={busy}>{busy?'جارٍ التحقق…':'دخول آمن'}</Button><Link href="/" className="login-link">العودة للرئيسية</Link></form></div>;
}
