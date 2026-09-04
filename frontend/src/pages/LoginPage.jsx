import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

const FieldIcon = ({ type }) => type === 'email'
  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
  : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(form);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return <main className="min-h-screen bg-slate-950 p-4 sm:p-8 lg:p-12">
    <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-indigo-950/30 lg:grid-cols-[1.12fr_.88fr]">
      <section className="relative hidden overflow-hidden bg-indigo-600 p-12 text-white lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,.28),transparent_28%),radial-gradient(circle_at_85%_85%,rgba(129,140,248,.8),transparent_34%)]" />
        <div className="relative flex items-center gap-3 text-lg font-bold tracking-tight"><span className="grid size-10 place-items-center rounded-xl bg-white text-sm tracking-tighter text-indigo-600 shadow-lg">AR</span> Authentica</div>
        <div className="relative my-auto max-w-md"><p className="mb-5 text-sm font-bold uppercase tracking-[.2em] text-indigo-100">Secure workspace</p><h1 className="mb-6 text-5xl font-semibold leading-[1.06] tracking-tight text-white">Trust, visible in every scan.</h1><p className="mb-0 text-lg leading-8 text-indigo-100">Manage your protected catalog and understand verification activity from one focused workspace.</p></div>
        <div className="relative flex items-center gap-3 text-sm text-indigo-100"><span className="flex size-8 items-center justify-center rounded-full border border-white/30">✓</span> Privacy-safe verification records</div>
      </section>
      <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="w-full max-w-sm">
          <button className="mb-10 flex items-center gap-2 bg-transparent p-0 text-base font-bold text-slate-900 lg:hidden" onClick={() => navigate('/')}><span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-xs tracking-tighter text-white">AR</span> Authentica</button>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-indigo-600">Admin portal</p>
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-slate-950">Welcome back</h1>
          <p className="mb-8 text-[15px] leading-6 text-slate-500">Sign in to manage products and monitor their authentication activity.</p>
          <form className="mt-0 grid gap-5" onSubmit={submit} noValidate>
            {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">{error}</div>}
            <label className="grid gap-2 text-sm font-semibold text-slate-700">Work email
              <span className="relative block"><span className="pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center text-slate-400"><FieldIcon type="email" /></span><input className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 text-[15px] font-normal text-slate-950 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="email" autoComplete="email" required placeholder="you@company.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></span>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">Password
              <span className="relative block"><span className="pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center text-slate-400"><FieldIcon type="password" /></span><input className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 text-[15px] font-normal text-slate-950 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="password" autoComplete="current-password" required placeholder="Enter your password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></span>
            </label>
            <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus-visible:outline-4 focus-visible:outline-indigo-200 disabled:cursor-not-allowed disabled:opacity-70" disabled={loading}>{loading && <span className="size-4 animate-spin rounded-full border-2 border-white/80 border-r-transparent" />} {loading ? 'Signing in…' : 'Sign in securely'}</button>
          </form>
          <div className="mt-8 border-t border-slate-100 pt-6 text-center"><button className="bg-transparent p-0 text-sm font-semibold text-indigo-600 hover:text-indigo-800" onClick={() => navigate('/verify')}>Need to verify a product? <span aria-hidden="true">→</span></button></div>
        </div>
      </section>
    </div>
  </main>;
}
