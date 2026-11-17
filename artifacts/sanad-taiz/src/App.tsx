import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ToastProvider } from '@/components/toast-system';
import { ConfirmProvider } from '@/components/confirm-dialog';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { Shell } from '@/components/layout';
import { QuickExit } from '@/components/support-ui';

const AudiencePage = lazy(() => import('@/pages/audience').then(m => ({ default: m.AudiencePage })));
const StoriesPage = lazy(() => import('@/pages/stories').then(m => ({ default: m.StoriesPage })));
const Home = lazy(() => import('@/pages/home').then(m => ({ default: m.Home })));
const PathwaysPage = lazy(() => import('@/pages/pathways').then(m => ({ default: m.PathwaysPage })));
const PathwayDetail = lazy(() => import('@/pages/pathway-detail').then(m => ({ default: m.PathwayDetailPage })));
const ExercisesPage = lazy(() => import('@/pages/exercises').then(m => ({ default: m.ExercisesPage })));
const AssessmentPage = lazy(() => import('@/pages/assessment').then(m => ({ default: m.AssessmentPage })));
const SafeSpacePage = lazy(() => import('@/pages/safe-space').then(m => ({ default: m.SafeSpacePage })));
const LibraryPage = lazy(() => import('@/pages/library').then(m => ({ default: m.LibraryPage })));
const BookingPage = lazy(() => import('@/pages/booking').then(m => ({ default: m.BookingPage })));
const AdminPage = lazy(() => import('@/pages/admin').then(m => ({ default: m.AdminPage })));
const SignInPage = lazy(() => import('@/pages/auth').then(m => ({ default: m.SignInPage })));
const NotFound = lazy(() => import('@/pages/not-found-custom').then(m => ({ default: m.NotFound })));
const HelpNowPage = lazy(() => import('@/pages/support').then(m => ({ default: m.HelpNowPage })));
const PrivacyPage = lazy(() => import('@/pages/support').then(m => ({ default: m.PrivacyPage })));
const SelfCarePage = lazy(() => import('@/pages/self-care').then(m => ({ default: m.SelfCarePage })));
const SelfCareExercisePage = lazy(() => import('@/pages/self-care').then(m => ({ default: m.SelfCareExercisePage })));

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function Router(){
  const [location]=useLocation();
  return <ErrorBoundary resetKey={location}><QuickExit/><Suspense fallback={<div className="content-wrap page-space" role="status">جارٍ تحميل الصفحة…</div>}><Switch>
    <Route path="/sign-in" component={SignInPage}/>
    <Route path="/"><Shell><Home/>
<div className="zen-exit-btn" onClick={() => document.body.classList.remove("zen-mode")}>✕ الخروج من وضع الهدوء</div>
</Shell></Route>
    <Route path="/pathways"><Shell><PathwaysPage/>
<div className="zen-exit-btn" onClick={() => document.body.classList.remove("zen-mode")}>✕ الخروج من وضع الهدوء</div>
</Shell></Route><Route path="/pathways/:slug"><Shell><PathwayDetail/>
<div className="zen-exit-btn" onClick={() => document.body.classList.remove("zen-mode")}>✕ الخروج من وضع الهدوء</div>
</Shell></Route>
    <Route path="/pathways/:slug/exercises"><Shell><ExercisesPage/></Shell></Route>
    <Route path="/stories"><Shell><StoriesPage/></Shell></Route>
    <Route path="/assessment"><Shell><AssessmentPage/>
<div className="zen-exit-btn" onClick={() => document.body.classList.remove("zen-mode")}>✕ الخروج من وضع الهدوء</div>
</Shell></Route><Route path="/safe-space"><Shell><SafeSpacePage/>
<div className="zen-exit-btn" onClick={() => document.body.classList.remove("zen-mode")}>✕ الخروج من وضع الهدوء</div>
</Shell></Route>
    <Route path="/self-care"><Shell><SelfCarePage/>
<div className="zen-exit-btn" onClick={() => document.body.classList.remove("zen-mode")}>✕ الخروج من وضع الهدوء</div>
</Shell></Route><Route path="/self-care/:key"><Shell><SelfCareExercisePage/>
<div className="zen-exit-btn" onClick={() => document.body.classList.remove("zen-mode")}>✕ الخروج من وضع الهدوء</div>
</Shell></Route><Route path="/library"><Shell><LibraryPage/>
<div className="zen-exit-btn" onClick={() => document.body.classList.remove("zen-mode")}>✕ الخروج من وضع الهدوء</div>
</Shell></Route><Route path="/tv"><Shell><LibraryPage filter="video"/>
<div className="zen-exit-btn" onClick={() => document.body.classList.remove("zen-mode")}>✕ الخروج من وضع الهدوء</div>
</Shell></Route><Route path="/radio"><Shell><LibraryPage filter="audio"/>
<div className="zen-exit-btn" onClick={() => document.body.classList.remove("zen-mode")}>✕ الخروج من وضع الهدوء</div>
</Shell></Route>
    <Route path="/booking"><Shell><BookingPage/>
<div className="zen-exit-btn" onClick={() => document.body.classList.remove("zen-mode")}>✕ الخروج من وضع الهدوء</div>
</Shell></Route><Route path="/admin"><Shell><AdminPage/>
<div className="zen-exit-btn" onClick={() => document.body.classList.remove("zen-mode")}>✕ الخروج من وضع الهدوء</div>
</Shell></Route><Route path="/help-now"><Shell><HelpNowPage/>
<div className="zen-exit-btn" onClick={() => document.body.classList.remove("zen-mode")}>✕ الخروج من وضع الهدوء</div>
</Shell></Route><Route path="/privacy"><Shell><PrivacyPage/>
<div className="zen-exit-btn" onClick={() => document.body.classList.remove("zen-mode")}>✕ الخروج من وضع الهدوء</div>
</Shell></Route><Route path="/audiences/:slug"><Shell><AudiencePage/></Shell></Route><Route><Shell><NotFound/>
<div className="zen-exit-btn" onClick={() => document.body.classList.remove("zen-mode")}>✕ الخروج من وضع الهدوء</div>
</Shell></Route>
  </Switch></Suspense></ErrorBoundary>;
}

export function App(){return <WouterRouter base={basePath}><QueryClientProvider client={queryClient}><ToastProvider><ConfirmProvider><TooltipProvider><Router/><Toaster/></TooltipProvider></ConfirmProvider></ToastProvider></QueryClientProvider></WouterRouter>;}
