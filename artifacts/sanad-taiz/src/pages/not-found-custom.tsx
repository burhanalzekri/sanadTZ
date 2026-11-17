import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { PageIntro } from '@/components/page-ui';

export function NotFound(){return <div className="content-wrap page-space"><PageIntro eyebrow="الرابط غير موجود" title="يبدو أنك وصلت إلى طريق جانبي." description="لا بأس. يمكنك العودة إلى البداية أو اختيار مسار آخر."/><Link href="/" className="button-primary">الرئيسية <ArrowLeft size={16}/></Link></div>; }
