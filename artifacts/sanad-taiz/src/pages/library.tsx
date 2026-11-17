import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useListPublicResources } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { PageIntro, LoadingBlock, ErrorBlock, EmptyBlock } from '@/components/page-ui';
import { ResourceCard } from '@/components/media';

export function LibraryPage({ filter }: { filter?: 'video'|'audio' }) {
  const query=useListPublicResources(); const [search,setSearch]=useState(''); const [category,setCategory]=useState('الكل');
  const items=useMemo(()=>query.data?.filter(item=>(!filter||item.kind===filter)&&(`${item.title} ${item.summary} ${item.category}`).toLowerCase().includes(search.toLowerCase())&&(category==='الكل'||item.category===category))||[],[query.data,filter,search,category]);
  const categories=['الكل',...Array.from(new Set((query.data||[]).filter(item=>!filter||item.kind===filter).map(item=>item.category)))];
  const title=filter==='video'?'سَنَد مرئي':filter==='audio'?'سَنَد مسموع':'مكتبة سَنَد';
  const description=query.isLoading?'جارٍ تحميل المواد المنشورة.':query.isError?'تعذّر تحميل المكتبة حالياً.':items.length?(filter==='audio'?'استكشف المواد المسموعة المنشورة حالياً.':filter==='video'?'استكشف المواد المرئية المنشورة حالياً.':'استكشف المواد المنشورة بحسب النوع والموضوع.'):(filter==='audio'?'لا توجد مواد مسموعة منشورة حالياً.':filter==='video'?'لا توجد مواد مرئية منشورة حالياً.':'لا يوجد محتوى منشور بعد.');
  return <div className="content-wrap page-space"><PageIntro eyebrow={filter==='video'?'مشاهدة':'استكشف المكتبة'} title={title} description={description}/>
<div style={{display: 'flex', gap: '10px', marginBottom: '30px', padding: '8px', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '50px', width: 'fit-content', margin: '0 auto', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'}}>
  <Link to="/library" style={{padding: '10px 25px', borderRadius: '40px', background: !filter ? 'linear-gradient(135deg, hsl(var(--primary)), #0f766e)' : 'transparent', color: !filter ? 'white' : 'hsl(var(--muted-foreground))', fontWeight: '700', fontSize: '0.95em', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s', boxShadow: !filter ? '0 5px 15px rgba(16,185,129,0.3)' : 'none'}}>📖 المقروء</Link>
  <Link to="/tv" style={{padding: '10px 25px', borderRadius: '40px', background: filter==='video' ? 'linear-gradient(135deg, hsl(var(--primary)), #0f766e)' : 'transparent', color: filter==='video' ? 'white' : 'hsl(var(--muted-foreground))', fontWeight: '700', fontSize: '0.95em', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s', boxShadow: filter==='video' ? '0 5px 15px rgba(16,185,129,0.3)' : 'none'}}>🎬 المرئي</Link>
  <Link to="/radio" style={{padding: '10px 25px', borderRadius: '40px', background: filter==='audio' ? 'linear-gradient(135deg, hsl(var(--primary)), #0f766e)' : 'transparent', color: filter==='audio' ? 'white' : 'hsl(var(--muted-foreground))', fontWeight: '700', fontSize: '0.95em', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s', boxShadow: filter==='audio' ? '0 5px 15px rgba(16,185,129,0.3)' : 'none'}}>🎧 المسموع</Link>
</div>
    <div className="library-controls"><label className="search-box"><Search size={18}/><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث عن موضوع…" aria-label="ابحث عن محتوى" data-testid="input-library-search"/></label><div className="category-pills">{categories.map(cat=><button key={cat} onClick={()=>setCategory(cat)} className={category===cat?'category-pill active':'category-pill'} data-testid={`filter-category-${cat}`}>{cat}</button>)}</div></div>
    {query.isLoading?<LoadingBlock/>:query.isError?<ErrorBlock retry={()=>query.refetch()}/>:items.length?<div className="resource-grid">{items.map(item=><ResourceCard item={item} key={item.id}/>)}</div>:<EmptyBlock title={search?'لا توجد نتائج مطابقة':'لا يوجد محتوى منشور بعد'} hint={search?'جرّب كلمات أخرى أو غيّر التصنيف.':'سيظهر المحتوى هنا عند نشره.'}/>}
  </div>;
}
