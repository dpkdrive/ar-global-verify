import { useState } from "react";
import {
  Building2,
  Mail,
  ShieldCheck,
  UserPlus,
  UsersRound,
} from "lucide-react";

import CreateUserModal from "../components/users/CreateUserModal";
import {
  EmptyState,
  Notice,
  Pagination,
  Spinner,
  StatusBadge,
} from "../components/ui";
import { usePagedApi } from "../hooks/usePagedApi";
import { apiRequest } from "../api";

export default function UsersPage() {
  const state = usePagedApi("/users");

  const users = state.data.users ?? [];

  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const changeActiveState = async (user) => {
    setUpdatingUserId(user._id);
    setError("");

    try {
      await apiRequest(`/users/${user._id}`, {
        method: "PATCH",
        body: {
          isActive: !user.isActive,
        },
      });

      await state.reload();
    } catch (err) {
      setError(err?.message || "Unable to update user status.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Heading */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <UsersRound className="h-4 w-4 text-red-600" />

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                  Administration
                </p>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Users
              </h1>

              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Provision accounts and control access to the platform.
              </p>
            </div>

            {/* Add User */}
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20"
            >
              <UserPlus className="h-4 w-4" />
              Add User
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Error */}
        <Notice message={error || state.error} />

        {/* ===================================================
            LOADING
        ==================================================== */}
        {state.loading ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Spinner />
          </div>
        ) : users.length ? (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* =================================================
                CARD HEADER
            ================================================== */}
            <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <UsersRound className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Platform Users
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {users.length} user
                    {users.length !== 1 ? "s" : ""} on this page
                  </p>
                </div>
              </div>

              {/* Small status indicator */}
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-semibold text-slate-600">
                  Account Management
                </span>
              </div>
            </div>

            {/* =================================================
                TABLE
            ================================================== */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px]">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Company
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => {
                    const isUpdating = updatingUserId === user._id;

                    return (
                      <tr
                        key={user._id}
                        className="group transition-colors hover:bg-slate-50"
                      >
                        {/* =====================================
                            USER
                        ====================================== */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold uppercase text-white">
                              {user.name?.charAt(0) || "U"}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900">
                                {user.name}
                              </p>

                              <div className="mt-1 flex items-center gap-1.5">
                                <Mail className="h-3 w-3 text-slate-400" />

                                <p className="truncate text-xs text-slate-400">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* =====================================
                            COMPANY
                        ====================================== */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-slate-400" />

                            <span className="text-sm font-medium text-slate-600">
                              {user.companyName || "—"}
                            </span>
                          </div>
                        </td>

                        {/* =====================================
                            ROLE
                        ====================================== */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-slate-400" />

                            <StatusBadge value={user.role} />
                          </div>
                        </td>

                        {/* =====================================
                            STATUS
                        ====================================== */}
                        <td className="px-6 py-5">
                          <StatusBadge
                            value={user.isActive ? "active" : "disabled"}
                          />
                        </td>

                        {/* =====================================
                            ACTION
                        ====================================== */}
                        <td className="px-6 py-5 text-right">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => changeActiveState(user)}
                            className={`inline-flex min-w-[105px] items-center justify-center rounded-lg px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${user.isActive
                              ? "text-red-600 hover:bg-red-50"
                              : "text-emerald-600 hover:bg-emerald-50"
                              }`}
                          >
                            {isUpdating ? (
                              <Spinner />
                            ) : user.isActive ? (
                              "Deactivate"
                            ) : (
                              "Activate"
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* =================================================
                PAGINATION
            ================================================== */}
            <div className="border-t border-slate-200 px-5 py-4 sm:px-6">
              <Pagination
                meta={state.meta}
                onChange={state.setPage}
              />
            </div>
          </section>
        ) : (
          /* =================================================
             EMPTY STATE
          ================================================== */
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <EmptyState
              title="No users found"
              description="Create an account to give a teammate access."
            />
          </div>
        )}
      </main>

      {/* =====================================================
          CREATE USER MODAL
      ====================================================== */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            state.reload();
          }}
        />
      )}
    </div>
  );
}
