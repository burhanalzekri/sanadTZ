import { ArrowLeft, HeartHandshake, X } from 'lucide-react';
import { Link } from 'wouter';

export function CrisisBanner() {
  return <div className="crisis-banner" role="alert" data-testid="crisis-banner">
    <div className="crisis-icon"><HeartHandshake size={22}/></div>
    <div className="crisis-content">
      <h4>شكراً لأنك شاركت.</h4>
      <p>هذه ليست إجابتك وحدك. تحدث مع شخص تثق به الآن — أو اطّلع على أرقام الطوارئ.</p>
      <Link href="/help-now" className="crisis-link">اعرض أرقام الطوارئ <ArrowLeft size={15}/></Link>
    </div>
  </div>;
}

export function QuickExit() {
  function exit() {
    try {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(';').forEach(c => {
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });
    } catch (e) {}

    // جرّب الإغلاق (يعمل في بعض الحالات)
    try { window.close(); } catch (e) {}

    // إن لم يُغلق بعد 100ms، اذهب للصفحة الرئيسية
    setTimeout(() => {
      try { window.location.replace('/'); } catch (e) {}
    }, 100);
  }
  return <button className="quick-exit-btn" onClick={exit} aria-label="خروج سريع" title="خروج سريع" data-testid="quick-exit">
    <X size={16}/> <span>خروج سريع</span>
  </button>;
}
