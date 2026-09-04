import {
  Activity,
  CalendarDays,
  FileText,
  UserRound,
} from "lucide-react";
import { EmptyState, Pagination, Spinner } from '../components/ui';
import { usePagedApi } from '../hooks/usePagedApi';



export function AuditPage() {


  const state = usePagedApi("/audit-logs");
  const logs = state.data.logs ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600">
                <Activity className="h-4 w-4" />
                Compliance
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Activity Log
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                A chronological record of authorized account actions.
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <FileText className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* <Notice message={state.error} /> */}

        {state.loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <Spinner />
          </div>
        ) : logs.length ? (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Section header */}
            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Activity className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    System Activity
                  </h2>

                  <p className="text-xs text-slate-500">
                    Recent authorized actions across the platform
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {logs.length} records
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actor
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Target
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      When
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr
                      key={log._id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      {/* Action */}
                      <td className="px-6 py-4">
                        <code className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700">
                          {log.action}
                        </code>
                      </td>

                      {/* Actor */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                            <UserRound className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {log.actor?.name ?? "System"}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {log.actor?.email ?? "System generated"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Target */}
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                          {log.targetType}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays className="h-4 w-4 text-slate-400" />

                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-slate-200 px-5 py-4 sm:px-6">
              <Pagination
                meta={state.meta}
                onChange={state.setPage}
              />
            </div>
          </section>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <EmptyState title="No activity recorded" />
          </div>
        )}
      </div>
    </div>
  );
}
