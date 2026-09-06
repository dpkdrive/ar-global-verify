import { useState } from "react";
import {
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";

import { apiRequest } from "../../api";
import { Modal, Notice, Spinner } from "../ui";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "manufacturer",
  companyName: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

export default function CreateUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      await apiRequest("/users", {
        method: "POST",
        body: form,
      });

      onCreated();
    } catch (err) {
      setError(err?.message || "Unable to create user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Create new user" onClose={onClose} showHeader={false}>
      <div className="max-h-[calc(100vh-2rem)] overflow-y-auto p-5 sm:p-7">
        {/* Header */}
        <div className="mb-6 flex items-start gap-4 border-b border-slate-100 pb-5 ">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <UserPlus className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Create new user
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a new administrator or manufacturer account.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {/* Error */}
          {error && (
            <div>
              <Notice message={error} />
            </div>
          )}

          {/* Name + Email */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label htmlFor="name" className={labelClass}>
                Full name
              </label>

              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  value={form.name}
                  onChange={updateField}
                  placeholder="Enter full name"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={updateField}
                  placeholder="user@example.com"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>
          </div>

          {/* Password + Role */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Password */}
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={12}
                  value={form.password}
                  onChange={updateField}
                  placeholder="Minimum 12 characters"
                  className={`${inputClass} pl-11 pr-11`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Use at least 12 characters.
              </p>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className={labelClass}>
                Account role
              </label>

              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={updateField}
                  className={`${inputClass} cursor-pointer appearance-none pl-11`}
                >
                  <option value="manufacturer">
                    Manufacturer
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <label htmlFor="companyName" className={labelClass}>
              Company name
              <span className="ml-1 font-normal text-slate-400">
                (Optional)
              </span>
            </label>

            <div className="relative">
              <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="companyName"
                name="companyName"
                type="text"
                value={form.companyName}
                onChange={updateField}
                placeholder="Enter company name"
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>

          {/* Security Info */}
          <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

            <div>
              <p className="text-xs font-bold text-slate-700">
                Account security
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Make sure the password is strong and is not shared with
                anyone. The user can update their password later.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Spinner />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
