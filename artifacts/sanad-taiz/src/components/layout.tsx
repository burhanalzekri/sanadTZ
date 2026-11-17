import { useEffect, useState, type ReactNode } from 'react';
import { ArrowUpLeft, ChevronLeft, Compass, Feather, HeartHandshake, HeartPulse, Home as HomeIcon, Library, Menu, MessageCircle, Moon, ShieldCheck, Sun, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export const navItems: Array<[string, string, React.ComponentType<{ size?: number; strokeWidth?: number }>]> = [
  ['/', 'الرئيسية', HomeIcon],
  ['/pathways', 'مسارات الدعم', Compass],
  ['/assessment', 'وقفة مع النفس', HeartPulse],
  ['/safe-space', 'مساحة آمنة', Feather],
  ['/library', 'المكتبة', Library],
  ['/booking', 'طلب جلسة', MessageCircle],
];

export function ThemeControl() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const preference = localStorage.getItem('sanad-theme') === 'dark';
    setDark(preference); document.documentElement.classList.toggle('dark', preference);
  }, []);
  function toggle() {
    const next = !dark; setDark(next); document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('sanad-theme', next ? 'dark' : 'light');
  }
  return <button onClick={toggle} className="icon-button" aria-label={dark ? 'استخدم الوضع الفاتح' : 'استخدم الوضع الداكن'} data-testid="button-theme">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>;
}

export function Shell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const isMinorAudience = location === '/audiences/children' || location === '/audiences/teens';
  const visibleNavItems = isMinorAudience ? navItems.filter(([href]) => href !== '/booking') : navItems;
  const contactHref = isMinorAudience ? '/audiences/family' : '/booking';
  const contactLabel = isMinorAudience ? 'مساحة الأسرة' : 'اطلب تواصلاً خاصاً';
  return <div className="sanad-shell" dir="rtl">
    <div className="top-note"><ShieldCheck size={15}/> مساحة دعم مجتمعي — ليست رعاية طارئة أو بديلاً عن المختصين</div>
    <header className="site-header">
      <Link href="/" className="brand" data-testid="link-brand"><span className="brand-mark"><HeartHandshake size={21}/></span><span><b>سَنَد</b><small>تعز · مساحة للخطوة الأولى</small></span></Link>
      <nav className="desktop-nav" aria-label="التنقل الرئيسي">{visibleNavItems.map(([href, label, Icon]) => <Link key={href} href={href} className={location === href ? 'nav-link active' : 'nav-link'} data-testid={`link-nav-${href.replaceAll('/', '') || 'home'}`}><Icon size={16} strokeWidth={1.8}/><span>{label}</span></Link>)}</nav>
      <div className="header-actions"><button onClick={() => document.body.classList.toggle('zen-mode')} className="icon-button" title="وضع الهدوء" style={{marginLeft: '10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '50%', padding: '8px', cursor: 'pointer'}}>🧘</button><ThemeControl/><Link href="/sign-in" className="login-link" data-testid="link-sign-in">دخول</Link><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="فتح القائمة" data-testid="button-menu">{menuOpen ? <X/> : <Menu/>}</button></div>
    </header>
    {menuOpen && <nav className="mobile-nav" aria-label="التنقل للجوال">{visibleNavItems.map(([href, label, Icon]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="mobile-nav-link" data-testid={`mobile-link-${href.replaceAll('/', '') || 'home'}`}><Icon size={18} strokeWidth={1.8}/><span>{label}</span><ChevronLeft size={16}/></Link>)}<Link href="/sign-in" className="mobile-nav-link">دخول <ChevronLeft size={16}/></Link></nav>}
    <main>{children}</main>
    <footer className="site-footer">
      <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap'}}>
        <Link href="/" style={{color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.9em'}}>الرئيسية</Link>
        <Link href="/pathways" style={{color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.9em'}}>المسارات</Link>
        <Link href="/library" style={{color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.9em'}}>المكتبة</Link>
        <Link href="/assessment" style={{color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.9em'}}>التقييمات</Link>
        <Link href="/stories" style={{color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9em'}}>قصص وتجارب</Link>
        <Link href={contactHref} style={{color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.9em'}}>{isMinorAudience ? 'مساحة الأسرة' : 'طلب جلسة'}</Link>
      </div>
      <div className="footer-brand"><span className="brand-mark"><HeartHandshake size={20}/></span><div><b>سَنَد تعز</b><p>خطوة صغيرة، ومساحة إنسانية.</p></div></div>
      <p className="footer-note">هذا الموقع للمساندة والتعلّم الذاتي، وليس للطوارئ أو التشخيص أو العلاج.</p>
      <Link href={contactHref} className="footer-cta">{contactLabel} <ArrowUpLeft size={17}/></Link>
    <div style={{display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px'}}>
        <Link href="/stories" style={{color: 'var(--primary)'}}>قصص وتجارب</Link>
        <Link href="/safe-space" style={{color: 'var(--muted-foreground)'}}>مساحة آمنة</Link>
        <Link href="/assessment" style={{color: 'var(--muted-foreground)'}}>التقييمات</Link>
      </div></footer>

  </div>;
}
