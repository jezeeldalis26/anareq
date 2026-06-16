import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { AnareQLogo } from './components/common/AnareQLogo';

const AnareQApplication = lazy(() => import('./components/AnareQApp'));

const normalizePath = (value) => {
  const path = value || '/';
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path;
};

const APP_ROUTES = new Set(['/login', '/registro', '/app']);

function LoadingScreen() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#f4f2f0] p-6 text-stone-900">
      <div className="text-center">
        <AnareQLogo className="mx-auto h-auto w-[180px]" />
        <div className="mt-6 mx-auto h-8 w-8 rounded-full border-4 border-stone-200 border-t-orange-600 animate-spin" />
      </div>
    </div>
  );
}

function LandingPage({ navigate }) {
  const handleNavigate = (event, path) => {
    event.preventDefault();
    navigate(path);
  };

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#f4f2f0] text-stone-900">
      <section className="relative flex min-h-[100dvh] items-center justify-center px-5 py-10 sm:px-8">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-28 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="absolute top-1/3 -right-28 h-96 w-96 rounded-full bg-stone-900/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-400/10 blur-3xl" />
        </div>

        <div className="relative w-full max-w-6xl">
          <header className="flex items-center justify-between gap-4 rounded-3xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur sm:px-5">
            <AnareQLogo className="h-auto w-[132px]" />
            <nav className="flex items-center gap-2">
              <a
                href="/login"
                onClick={(event) => handleNavigate(event, '/login')}
                className="rounded-full px-4 py-2 text-xs font-black text-stone-600 transition hover:bg-stone-100 hover:text-stone-950"
              >
                Entrar
              </a>
              <a
                href="/registro"
                onClick={(event) => handleNavigate(event, '/registro')}
                className="rounded-full bg-stone-950 px-4 py-2 text-xs font-black text-white shadow-lg shadow-stone-950/10 transition hover:bg-black"
              >
                Crear cuenta
              </a>
            </nav>
          </header>

          <div className="mt-8 grid items-center gap-7 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[34px] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-stone-900/5 backdrop-blur sm:p-9 lg:p-11">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-orange-600">anareQ</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[0.94] tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
                Analiza antes de escalar.
              </h1>
              <p className="mt-5 max-w-2xl text-base font-bold leading-7 text-stone-600 sm:text-lg">
                Audita inversión, ventas, facturación y rentabilidad real de campañas Meta Ads con reportes claros para decidir mejor.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/registro"
                  onClick={(event) => handleNavigate(event, '/registro')}
                  className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-orange-600/20 transition hover:bg-orange-700"
                >
                  Probar anareQ
                </a>
                <a
                  href="/login"
                  onClick={(event) => handleNavigate(event, '/login')}
                  className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-6 py-4 text-sm font-black text-stone-800 shadow-sm transition hover:border-orange-200 hover:bg-orange-50"
                >
                  Ya tengo cuenta
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['Score claro', 'Rentabilidad y estabilidad en una lectura simple.'],
                  ['PDF profesional', 'Reporte listo para enviar al cliente.'],
                  ['Meta + negocio', 'Cruza datos publicitarios con ventas reales.'],
                ].map(([title, desc]) => (
                  <article key={title} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <h2 className="text-sm font-black text-stone-950">{title}</h2>
                    <p className="mt-1 text-xs font-bold leading-5 text-stone-500">{desc}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-orange-500/18 via-white/60 to-stone-950/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white shadow-2xl shadow-stone-900/10">
                <img
                  src="/imagen-logeo.png"
                  alt="Vista de anareQ"
                  className="h-[590px] w-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useMemo(() => (nextPath) => {
    const normalizedNextPath = normalizePath(nextPath);
    if (normalizePath(window.location.pathname) !== normalizedNextPath) {
      window.history.pushState({}, '', normalizedNextPath);
    }
    setPath(normalizedNextPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!APP_ROUTES.has(path)) {
    return <LandingPage navigate={navigate} />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <AnareQApplication
        initialAuthMode={path === '/registro' ? 'signup' : 'signin'}
        routePath={path}
        navigate={navigate}
      />
    </Suspense>
  );
}
