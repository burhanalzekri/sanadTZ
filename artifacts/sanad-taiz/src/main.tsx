import { createRoot } from 'react-dom/client';

import { App } from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';
import './styles/brand-foundation.css';
import './styles/global-components.css';
import './styles/content-pages.css';
import './styles/admin-overrides.css';
import './styles/sanad-experience.css';

// ============================================
// ✨ Scroll Effect: تفاعل الشريط العلوي عند التمرير
// ============================================
function initScrollEffect() {
  const updateHeader = () => {
    const header = document.querySelector('.site-header') as HTMLElement | null;
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // تفعيل عند التحميل
  updateHeader();

  // تفعيل عند التمرير (passive للسرعة)
  window.addEventListener('scroll', updateHeader, { passive: true });
}

// ============================================
// ✨ Scroll Reveal: ظهور العناصر تدريجياً
// ============================================
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  // مراقبة العناصر عند التحميل (بعد تأخير بسيط لضمان وجود DOM)
  setTimeout(() => {
    document
      .querySelectorAll(
        '.pathway-card, .resource-card, .step-card, .hero-content, .section-heading, .closing-cta'
      )
      .forEach((el) => {
        el.classList.add('reveal-init');
        observer.observe(el);
      });
  }, 300);
}

// ============================================
// تشغيل التأثيرات بعد تحميل React
// ============================================
const root = createRoot(document.getElementById('root')!, {
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
});

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

// تشغيل بعد أن ينتهي React من الرسم الأول
setTimeout(() => {
  initScrollEffect();
  initScrollReveal();
}, 100);

// PWA: تسجيل Service Worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('SW registration failed:', err);
    });
  });
}
