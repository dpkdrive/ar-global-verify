import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Activity,
  Boxes,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "../auth/AuthProvider";

const navigation = [
  {
    path: "/admin/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    path: "/admin/products",
    label: "Products",
    icon: Boxes,
  },
  {
    path: "/admin/risk-monitor",
    label: "Risk Monitor",
    icon: ShieldCheck,
  },
  {
    path: "/admin/activity",
    label: "Activity",
    icon: Activity,
  },
  {
    path: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const links =
    user?.role === "admin"
      ? [
        ...navigation.slice(0, 4),
        {
          path: "/admin/users",
          label: "Users",
          icon: Users,
        },
        navigation[4],
      ]
      : navigation;

  const logout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}


      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          border-r border-slate-800 bg-slate-950 text-white
          transition-all duration-300

          ${collapsed ? "lg:w-20" : "lg:w-64"}

          w-72
          ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"}
        `}
      >

        {/* =================================================
            BRAND
        ================================================== */}

        <div
          className={`
            flex h-20 shrink-0 items-center border-b border-white/10
            px-5
            ${collapsed ? "lg:justify-center lg:px-0" : "justify-between"}
          `}
        >

          <NavLink
            to="/admin/dashboard"
            onClick={closeMobileSidebar}
            className="flex items-center gap-3"
          >

            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-sm font-black tracking-tight text-white shadow-lg shadow-red-600/20">
              AR
            </span>

            <div
              className={`
                transition-opacity duration-200
                ${collapsed ? "lg:hidden" : ""}
              `}
            >
              <p className="text-sm font-black uppercase tracking-wide">
                Authentica
              </p>

              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Admin Console
              </p>
            </div>

          </NavLink>


          {/* Mobile close */}

          <button
            type="button"
            onClick={closeMobileSidebar}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================== */}

        <div className="flex-1 overflow-y-auto px-3 py-6">

          <p
            className={`
              mb-3 px-3 text-[10px] font-black uppercase
              tracking-[0.2em] text-slate-600
              ${collapsed ? "lg:hidden" : ""}
            `}
          >
            Workspace
          </p>


          <nav className="space-y-1">

            {links.map(
              ({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={closeMobileSidebar}
                  title={collapsed ? label : undefined}
                  className={({ isActive }) =>
                    `
                    group flex items-center gap-3 rounded-xl
                    px-3 py-3 text-sm font-semibold
                    transition-all duration-200

                    ${isActive
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }

                    ${collapsed ? "lg:justify-center" : ""}
                    `
                  }
                >

                  <Icon className="h-5 w-5 shrink-0" />

                  <span
                    className={`
                      truncate
                      ${collapsed ? "lg:hidden" : ""}
                    `}
                  >
                    {label}
                  </span>

                  {/* Active indicator */}

                  <span
                    className={`
                      ml-auto h-1.5 w-1.5 rounded-full bg-white
                      ${collapsed
                        ? "lg:hidden"
                        : ""
                      }
                    `}
                  />

                </NavLink>
              )
            )}

          </nav>

        </div>


        {/* =================================================
            ACCOUNT
        ================================================== */}

        <div className="border-t border-white/10 p-3">

          <div
            className={`
              rounded-xl bg-white/5 p-3
              ${collapsed ? "lg:p-2" : ""}
            `}
          >

            <div
              className={`
                flex items-center gap-3
                ${collapsed ? "lg:justify-center" : ""}
              `}
            >

              {/* Avatar */}

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-black uppercase text-white">
                {user?.name?.slice(0, 1) || "U"}
              </div>


              {/* User info */}

              <div
                className={`
                  min-w-0 flex-1
                  ${collapsed ? "lg:hidden" : ""}
                `}
              >

                <p className="truncate text-sm font-bold text-white">
                  {user?.name || "User"}
                </p>

                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {user?.role || "member"}
                </p>

              </div>

            </div>


            {/* Sign out */}

            <button
              type="button"
              onClick={logout}
              title={collapsed ? "Sign out" : undefined}
              className={`
                mt-3 flex w-full items-center gap-2
                rounded-lg px-3 py-2.5
                text-xs font-bold uppercase tracking-wider
                text-slate-400
                transition
                hover:bg-red-600/10 hover:text-red-400

                ${collapsed
                  ? "lg:justify-center"
                  : ""}
              `}
            >

              <LogOut className="h-4 w-4 shrink-0" />

              <span
                className={
                  collapsed ? "lg:hidden" : ""
                }
              >
                Sign Out
              </span>

            </button>

          </div>

        </div>


        {/* =================================================
            COLLAPSE BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-slate-950 hover:text-white lg:flex"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

      </aside>


      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div
        className={`
          min-h-screen transition-all duration-300
          ${collapsed ? "lg:pl-20" : "lg:pl-64"}
        `}
      >

        {/* =================================================
            MOBILE TOP BAR
        ================================================== */}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur lg:hidden">

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100"
          >
            <Menu className="h-6 w-6" />
          </button>


          <NavLink
            to="/admin/dashboard"
            className="flex items-center gap-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-xs font-black text-white">
              AR
            </span>

            <span className="text-sm font-black uppercase tracking-wide text-slate-950">
              Authentica
            </span>
          </NavLink>


          <div className="h-9 w-9" />

        </header>


        {/* =================================================
            PAGE CONTENT
        ================================================== */}

        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
