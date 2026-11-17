import { type ReactNode } from 'react';
import { CircleHelp, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="page-intro page-enter"><div className="eyebrow">{eyebrow}</div><h1 className="serif-ar">{title}</h1>{description && <p>{description}</p>}</div>;
}

export function LoadingBlock() { return <div className="grid gap-4 md:grid-cols-2" aria-label="جار التحميل" data-testid="status-loading">{[1,2,3,4].map(n => <div key={n} className="skeleton-block"><div/><span/></div>)}</div>; }

export function ErrorBlock({ retry, label = 'تعذّر تحميل المحتوى الآن' }: { retry: () => void; label?: string }) { return <div className="notice-card" role="alert" data-testid="status-error"><CircleHelp/><div><b>{label}</b><p>تحقق من اتصالك وحاول مرة أخرى.</p></div><Button variant="outline" onClick={retry} data-testid="button-retry">إعادة المحاولة</Button></div>; }

export function EmptyBlock({ title = 'لا يوجد محتوى هنا بعد', hint = 'نضيف الموارد بهدوء، ويمكنك العودة لاحقاً.' }: { title?: string; hint?: string }) { return <div className="empty-card" data-testid="status-empty"><span className="empty-mark"><Leaf size={22}/></span><h3>{title}</h3><p>{hint}</p></div>; }

export function Pill({ children }: { children: ReactNode }) { return <span className="pill">{children}</span>; }
