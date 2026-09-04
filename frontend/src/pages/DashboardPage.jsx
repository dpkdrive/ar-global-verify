import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Boxes,
  Clock3,
  PackageCheck,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { apiRequest } from "../api";
import {
  EmptyState,
  Notice,
  Spinner,
  StatusBadge,
} from "../components/ui";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const payload = await apiRequest("/dashboard/summary");
        setData(payload.data);
      } catch (err) {
        setError(
          err?.message ||
          "Unable to load dashboard data."
        );
      }
    };

    loadDashboard();
  }, []);

  /* =====================================================
     ERROR STATE
  ====================================================== */

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <Notice message={error} />
        </div>
      </main>
    );
  }

  /* =====================================================
     LOADING STATE
  ====================================================== */

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-sm font-medium text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  /* =====================================================
     STATS
  ====================================================== */

  const stats = [
    {
      label: "Protected Products",
      value: data.products.total,
      note: `${data.products.active} active`,
      icon: PackageCheck,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Verifications",
      value: data.verifications.total,
      note: `${data.verifications.verified} authenticated`,
      icon: ShieldCheck,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Inactive / Recalled",
      value: data.verifications.inactive,
      note: "Verification attempts",
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      label: "Risk Threshold",
      value: data.suspiciousThreshold,
      note: "Scans per product",
      icon: Activity,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =================================================
          HEADER
      ================================================== */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            {/* Heading */}

            <div>

              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>

                <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                  Admin Workspace
                </span>

              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Good to see you.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                A live snapshot of product protection and
                authentication activity across your account.
              </p>

            </div>


            {/* Actions */}

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/risk-monitor")
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-900 hover:bg-slate-950 hover:text-white"
              >
                <Activity className="h-4 w-4" />
                Risk Monitor
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/products")
                }
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
              >
                <Boxes className="h-4 w-4" />
                Manage Products
                <ArrowRight className="h-4 w-4" />
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          DASHBOARD CONTENT
      ================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">


        {/* =================================================
            STATS GRID
        ================================================== */}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat) => {

            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      {stat.label}
                    </p>

                    <p className="mt-4 text-4xl font-black tracking-tight text-slate-950">
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}
                  >
                    <Icon
                      className={`h-6 w-6 ${stat.iconColor}`}
                    />
                  </div>

                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">

                  <TrendingUp className="h-4 w-4 text-slate-400" />

                  <span className="text-xs font-semibold text-slate-500">
                    {stat.note}
                  </span>

                </div>

              </article>
            );
          })}

        </section>


        {/* =================================================
            RECENT VERIFICATIONS
        ================================================== */}

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Panel Header */}

          <div className="flex flex-col gap-5 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between lg:p-7">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950">
                  <BadgeCheck className="h-5 w-5 text-white" />
                </div>

                <div>

                  <h2 className="text-lg font-black uppercase tracking-tight text-slate-950 sm:text-xl">
                    Recent Verifications
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Latest product authentication activity.
                  </p>

                </div>

              </div>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate("/admin/risk-monitor")
              }
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-slate-700 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
            >
              View Risk Monitor
              <ArrowRight className="h-4 w-4" />
            </button>

          </div>


          {/* =================================================
              TABLE
          ================================================== */}

          {data.recentVerifications.length ? (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50">

                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400 lg:px-7">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                      SKU
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Outcome
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400 lg:px-7">
                      Time
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {data.recentVerifications.map(
                    (event, index) => (
                      <tr
                        key={`${event.createdAt}-${index}`}
                        className="transition hover:bg-slate-50"
                      >

                        {/* Product */}

                        <td className="px-6 py-5 lg:px-7">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                              <PackageCheck className="h-5 w-5 text-slate-600" />
                            </div>

                            <div>

                              <p className="text-sm font-bold text-slate-900">
                                {event.product.name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                Product verification
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* SKU */}

                        <td className="px-6 py-5">

                          <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600">
                            {event.product.sku}
                          </span>

                        </td>


                        {/* Outcome */}

                        <td className="px-6 py-5">

                          <StatusBadge
                            value={event.outcome}
                          />

                        </td>


                        {/* Time */}

                        <td className="px-6 py-5 lg:px-7">

                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">

                            <Clock3 className="h-4 w-4 text-slate-400" />

                            {new Date(
                              event.createdAt
                            ).toLocaleString()}

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="p-8">

              <EmptyState
                title="No verifications yet"
                description="Product scans will appear here once customers start checking codes."
              />

            </div>

          )}

        </section>


        {/* =================================================
            BOTTOM QUICK ACTIONS
        ================================================== */}

        <section className="mt-8 grid gap-5 md:grid-cols-3">

          <QuickAction
            icon={PackageCheck}
            title="Manage Products"
            description="Add, update or deactivate protected products."
            onClick={() =>
              navigate("/admin/products")
            }
          />

          <QuickAction
            icon={Activity}
            title="Risk Monitor"
            description="Review suspicious verification activity."
            onClick={() =>
              navigate("/admin/risk-monitor")
            }
          />

          <QuickAction
            icon={ShieldCheck}
            title="Public Verification"
            description="Open the customer product verification page."
            onClick={() => navigate("/verify")}
          />

        </section>

      </div>

    </main>
  );
}


/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
    >

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white transition group-hover:bg-red-600">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">

        <div className="flex items-center justify-between gap-3">

          <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
            {title}
          </h3>

          <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-red-600" />

        </div>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

    </button>
  );
}
