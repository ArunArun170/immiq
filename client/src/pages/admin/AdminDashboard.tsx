import {
  ArrowRight,
  BarChart3,
  FileText,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminModule {
  title: string;
  description: string;
  path?: string;
  active: boolean;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const userData = localStorage.getItem(
    "immiq_admin_user"
  );

  const user = userData
    ? JSON.parse(userData)
    : null;

  const handleLogout = () => {
    localStorage.removeItem("immiq_admin_token");
    localStorage.removeItem("immiq_admin_user");

    navigate("/admin/login");
  };

  const modules: AdminModule[] = [
    {
      title: "Corporate Learning",
      description:
        "Manage corporate learning accounts, assign learners and monitor training programs.",
      path: "/admin/corporate",
      active: true,
    },
    {
      title: "Clients",
      description:
        "Manage client companies and featured clients.",
      path: "/admin/clients",
      active: true,
    },
    {
      title: "Achievements",
      description:
        "Manage milestones, awards and certifications.",
      path: "/admin/achievements",
      active: true,
    },
    {
        title: "Blog",
        description:
            "Create, edit and publish blog articles.",
        path: "/admin/blog",
        active: true,
    },
    {
        title: "Services",
        description:
            "Manage digital services displayed on the website.",
        path: "/admin/services",
        active: true,
    },

    {
      title: "Courses",
      description:
        "Create and manage IMMIQ technology training programs.",
      path: "/admin/courses",
      active: true,
    },

    {
      title: "Certificates",
      description:
        "View issued certificates and manage verification status.",
      path: "/admin/certificates",
      active: true,
    },
    {
      title: "Invoices & Payments",
      description:
        "Monitor learner invoices, revenue and payment transactions.",
      path: "/admin/invoices",
      active: true,
    },

    {
        title: "Leads",
        description:
            "Manage website enquiries and sales prospects.",
        path: "/admin/leads",
        active: true,
    },
    {
        title: "Team",
        description:
            "Manage IMMIQ team members and profiles.",
        path: "/admin/team",
        active: true,
    },
    {
        title: "Testimonials",
        description:
            "Manage client testimonials and feedback.",
        path: "/admin/testimonials",
        active: true,
    },
    {
  title: "Media",
  description:
    "Manage images, videos and digital assets.",
  path: "/admin/media",
  active: true,
},
{
  title: "Users & Roles",
  description:
    "Manage users, roles and permissions.",
  path: "/admin/users",
  active: true,
},
{
  title: "Settings",
  description:
    "Manage site information, SEO and integrations.",
  path: "/admin/settings",
  active: true,
},

  ];

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* Header */}
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                IMMIQ ADMIN
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Dashboard
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                Welcome back,{" "}
                <span className="font-medium text-slate-200">
                  {user?.name || "Admin"}
                </span>
                . Manage your IMMIQ platform from here.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-slate-300 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Clients
              </span>

              <Users className="h-5 w-5 text-cyan-400" />
            </div>

            <p className="mt-4 text-3xl font-bold">
              10
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Current database records
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Achievements
              </span>

              <BarChart3 className="h-5 w-5 text-cyan-400" />
            </div>

            <p className="mt-4 text-3xl font-bold">
              8
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Milestones & recognitions
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Blog Posts
              </span>

              <FileText className="h-5 w-5 text-cyan-400" />
            </div>

            <p className="mt-4 text-3xl font-bold">
              8
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Published content
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Role
              </span>

              <Settings className="h-5 w-5 text-cyan-400" />
            </div>

            <p className="mt-4 truncate text-xl font-bold capitalize">
              {user?.role || "Admin"}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Current access level
            </p>
          </div>
        </section>

        {/* CMS */}
        <section className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              CMS
            </p>

            <h2 className="mt-1 text-2xl font-semibold">
              Content Management
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your IMMIQ website content from one
              central workspace.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => {
              if (module.active && module.path) {
                return (
                  <button
                    key={module.title}
                    type="button"
                    onClick={() =>
                      navigate(module.path!)
                    }
                    className="group relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-400/[0.07] hover:shadow-xl hover:shadow-cyan-950/20"
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl transition group-hover:bg-cyan-400/20" />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold text-white">
                          {module.title}
                        </h3>

                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-300">
                          Active
                        </span>
                      </div>

                      <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-400">
                        {module.description}
                      </p>

                      <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400">
                        Manage {module.title}

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </button>
                );
              }

              return (
                <div
                  key={module.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 opacity-70"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-slate-300">
                      {module.title}
                    </h3>

                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                      Soon
                    </span>
                  </div>

                  <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
                    {module.description}
                  </p>

                  <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-slate-700">
                    Coming next
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer Info */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-700 sm:text-left">
          IMMIQ Admin CMS
          <span className="mx-2">•</span>
          Curiosity First. Technology Next.
        </div>
      </div>
    </main>
  );
}