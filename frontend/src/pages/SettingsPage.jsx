import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { apiRequest } from '../api';
import { useAuth } from '../auth/AuthProvider';
import { Notice, Spinner } from '../components/ui';

export default function SettingsPage() {
  const { updateUser } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const submit = async (event) => { event.preventDefault(); setSaving(true); setError(''); setMessage(''); try { const payload = await apiRequest('/auth/change-password', { method: 'PATCH', body: form }); localStorage.setItem('ar_access_token', payload.data.accessToken); updateUser(payload.data.user); setForm({ currentPassword: '', newPassword: '' }); setMessage('Password updated. Previous sessions have been invalidated.'); } catch (err) { setError(err.message); } finally { setSaving(false); } };
  return <div className="min-h-screen bg-slate-50"><header className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><p className="mb-2 text-xs font-bold uppercase tracking-widest text-red-600">Account</p><h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Settings</h1><p className="mt-2 text-sm text-slate-500">Keep your account credentials secure.</p></div></header><div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><section className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-6 flex items-start gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-red-50 text-red-600"><KeyRound className="size-5" /></span><div><h2 className="font-semibold text-slate-900">Change password</h2><p className="mt-1 text-sm text-slate-500">Use at least 12 characters and a password you do not use elsewhere.</p></div></div><form className="grid gap-5" onSubmit={submit}><Notice message={error} /><Notice message={message} type="success" /><label className="grid gap-2 text-sm font-semibold text-slate-700">Current password<input type="password" required value={form.currentPassword} onChange={(event) => setForm({ ...form, currentPassword: event.target.value })} /></label><label className="grid gap-2 text-sm font-semibold text-slate-700">New password<input type="password" required minLength="12" value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} /></label><button className="w-fit rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-70" disabled={saving}>{saving ? <Spinner /> : 'Update password'}</button></form></section></div></div>;
}
