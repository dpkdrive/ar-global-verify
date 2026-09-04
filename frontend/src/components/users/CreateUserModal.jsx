import { useState } from 'react';
import { apiRequest } from '../../api';
import { Modal, Notice, Spinner } from '../ui';

const initialForm = { name: '', email: '', password: '', role: 'manufacturer', companyName: '' };

export default function CreateUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try { await apiRequest('/users', { method: 'POST', body: form }); onCreated(); } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  return <Modal title="Add user" onClose={onClose}><form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}><div className="sm:col-span-2"><Notice message={error} /></div><label className="grid gap-1.5 text-sm font-medium text-slate-700">Name<input name="name" required minLength="2" value={form.name} onChange={updateField} /></label><label className="grid gap-1.5 text-sm font-medium text-slate-700">Email<input name="email" type="email" required value={form.email} onChange={updateField} /></label><label className="grid gap-1.5 text-sm font-medium text-slate-700">Password<input name="password" type="password" minLength="12" required value={form.password} onChange={updateField} /></label><label className="grid gap-1.5 text-sm font-medium text-slate-700">Role<select name="role" value={form.role} onChange={updateField}><option value="manufacturer">Manufacturer</option><option value="admin">Admin</option></select></label><label className="grid gap-1.5 text-sm font-medium text-slate-700 sm:col-span-2">Company name<input name="companyName" value={form.companyName} onChange={updateField} /></label><div className="flex justify-end gap-3 sm:col-span-2"><button type="button" onClick={onClose}>Cancel</button><button className="primary" disabled={saving}>{saving ? <Spinner /> : 'Create user'}</button></div></form></Modal>;
}
