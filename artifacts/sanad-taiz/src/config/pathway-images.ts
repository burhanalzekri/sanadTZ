// ============================================================
// 🎨 صور المسارات — تدرجات CSS (مضمونة وسريعة)
// ============================================================

export interface PathwayImage {
  src: string;       // فارغ — نستخدم gradient
  gradient: string;  // التدرج
  overlay: string;   // overlay داكن
  icon: string;      // إيموجي كبديل بصري
}

export const pathwayImages: Record<string, PathwayImage> = {
  'القلق': {
    src: '',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
    overlay: 'linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.75) 100%)',
    icon: '🌊',
  },
  'التوتر': {
    src: '',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #fb923c 100%)',
    overlay: 'linear-gradient(180deg, rgba(66,20,3,0.2) 0%, rgba(66,20,3,0.75) 100%)',
    icon: '🔥',
  },
  'الحزن': {
    src: '',
    gradient: 'linear-gradient(135deg, #374151 0%, #6b7280 50%, #9ca3af 100%)',
    overlay: 'linear-gradient(180deg, rgba(17,24,39,0.2) 0%, rgba(17,24,39,0.75) 100%)',
    icon: '🌧️',
  },
  'الغضب': {
    src: '',
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #f87171 100%)',
    overlay: 'linear-gradient(180deg, rgba(69,10,10,0.2) 0%, rgba(69,10,10,0.75) 100%)',
    icon: '⚡',
  },
  'الإرهاق': {
    src: '',
    gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #fbbf24 100%)',
    overlay: 'linear-gradient(180deg, rgba(41,20,6,0.2) 0%, rgba(41,20,6,0.75) 100%)',
    icon: '🌅',
  },
  'الخوف': {
    src: '',
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)',
    overlay: 'linear-gradient(180deg, rgba(30,10,60,0.2) 0%, rgba(30,10,60,0.75) 100%)',
    icon: '🌫️',
  },
  'الامتنان': {
    src: '',
    gradient: 'linear-gradient(135deg, #831843 0%, #db2777 50%, #f472b6 100%)',
    overlay: 'linear-gradient(180deg, rgba(50,10,30,0.2) 0%, rgba(50,10,30,0.75) 100%)',
    icon: '💖',
  },
  'الأمل': {
    src: '',
    gradient: 'linear-gradient(135deg, #92400e 0%, #f59e0b 50%, #fcd34d 100%)',
    overlay: 'linear-gradient(180deg, rgba(60,30,5,0.2) 0%, rgba(60,30,5,0.75) 100%)',
    icon: '🌅',
  },
};

export const defaultPathwayImage: PathwayImage = {
  src: '',
  gradient: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #a78bfa 100%)',
  overlay: 'linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.75) 100%)',
  icon: '🌱',
};

export function getPathwayImage(title: string): PathwayImage {
  return pathwayImages[title] || defaultPathwayImage;
}
