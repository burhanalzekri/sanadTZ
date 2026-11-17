import { useListPublicPathways } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { ArrowLeft, Compass } from 'lucide-react';
import { PageIntro, LoadingBlock, ErrorBlock, EmptyBlock } from '@/components/page-ui';

const pathwayImages: Record<string, string> = {
  'القلق': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
  'التوتر': 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop',
  'الحزن': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
  'الخوف': 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=800&auto=format&fit=crop',
  'الإرهاق': 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop',
  'الغضب': 'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=800&auto=format&fit=crop',
  'الضغوط': 'https://images.unsplash.com/photo-1506744626753-eda818c6cce5?q=80&w=800&auto=format&fit=crop',
};

function getPathwayImage(title: string): string | null {
  for (const key in pathwayImages) {
    if (title.includes(key)) return pathwayImages[key];
  }
  return null;
}

export function PathwaysPage() {
  const query = useListPublicPathways();
  const pathways = query.data || [];

  return (
    <div className="content-wrap page-space">
      <PageIntro
        eyebrow="مسارات الدعم"
        title="مساحة صغيرة، لك أنت."
        description="اختر مساراً قريباً مما تحتاجه اليوم. لا يوجد ترتيب ولا استعجال."
      />

      {query.isLoading ? (
        <LoadingBlock />
      ) : query.isError ? (
        <ErrorBlock retry={() => query.refetch()} />
      ) : pathways.length ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '25px',
          perspective: '1200px',
          marginTop: '30px'
        }}>
          {pathways.map((p, i) => {
            // المنطق: هل يوجد صورة في قاعدة البيانات أم في الخريطة؟
            const imageFromDb = (p as any).coverImage || (p as any).cover_image;
            const imageFromMap = getPathwayImage(p.title);
            const hasImage = imageFromDb || imageFromMap;
            const imageSrc = imageFromDb || imageFromMap;

            return (
              <Link key={p.id} href={`/pathways/${p.id}`} style={{textDecoration: 'none'}}>
                <div
                  style={{
                    background: 'var(--surface)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    boxShadow: '0 15px 35px -5px var(--shadow-color), 0 0 20px rgba(16,185,129,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    cursor: 'pointer',
                    height: '100%',
                    padding: '20px',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.02) rotateX(3deg)';
                    e.currentTarget.style.boxShadow = '0 25px 50px -10px var(--shadow-hover), 0 0 30px rgba(16,185,129,0.3)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
                    e.currentTarget.style.boxShadow = '0 15px 35px -5px var(--shadow-color), 0 0 20px rgba(16,185,129,0.1)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%',
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)',
                    transform: 'skewX(-25deg)', transition: '0.6s', zIndex: 10, pointerEvents: 'none'
                  }} className="shine-effect" />

                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    margin: '0 auto 15px auto',
                    border: '4px solid var(--primary)',
                    boxShadow: '0 10px 20px rgba(16,185,129,0.3)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: hasImage ? 'transparent' : 'var(--primary-glow)'
                  }}>
                    {hasImage ? (
                      <img src={imageSrc!} alt={p.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                      <Compass size={50} style={{color: 'var(--primary)'}} />
                    )}
                    <div style={{
                      position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
                      background: 'var(--primary)', color: 'white', borderRadius: '50%',
                      width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', fontSize: '0.9em', border: '2px solid white'
                    }}>
                      {i + 1}
                    </div>
                  </div>

                  <h3 style={{ color: 'var(--text)', fontSize: '1.3em', marginBottom: '10px', fontWeight: 'bold' }}>{p.title}</h3>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95em', flexGrow: 1, marginBottom: '15px' }}>{p.description}</p>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    افتح المسار <ArrowLeft size={16} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyBlock title="مسارات الدعم قريباً" hint="نعمل على تجهيز مسارات جديدة لك." />
      )}
    </div>
  );
}
