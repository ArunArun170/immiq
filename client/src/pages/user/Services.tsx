import {
  ArrowRight,
  BarChart3,
  Cloud,
  Code2,
  Globe,
  Layers3,
  Settings2,
  ShieldCheck,
  Smartphone,
  Workflow,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Code2,
    title: "Web & Application Development",
    description:
      "Modern, scalable web applications and business platforms designed around real-world requirements.",
    tags: ["React", "Node.js", "APIs"],
  },
  {
    icon: Smartphone,
    title: "Mobile Applications",
    description:
      "Digital experiences for mobile users with scalable architecture, intuitive interfaces, and reliable performance.",
    tags: ["Mobile", "UX", "Backend"],
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description:
      "Cloud-ready infrastructure and application architectures built for scalability, reliability, and growth.",
    tags: ["Cloud", "DevOps", "Scale"],
  },
  {
    icon: BarChart3,
    title: "Data & Analytics",
    description:
      "Turn business data into useful insights, dashboards, reports, and smarter decision-making systems.",
    tags: ["Data", "Analytics", "BI"],
  },
  {
    icon: Workflow,
    title: "Business Automation",
    description:
      "Automate repetitive workflows and connect systems to reduce manual effort and improve operational efficiency.",
    tags: ["Automation", "Workflows", "Integration"],
  },
  {
    icon: ShieldCheck,
    title: "Digital Transformation",
    description:
      "Modernize legacy processes and build technology ecosystems that support long-term digital growth.",
    tags: ["Strategy", "Modernization", "Transformation"],
  },
];

const capabilities = [
  "Custom software development",
  "API and system integration",
  "Cloud application architecture",
  "Enterprise dashboards",
  "Workflow automation",
  "AI-powered digital solutions",
];

const workSteps = [
  {
    number: "01",
    title: "Understand",
    description:
      "Understand your business, users, processes, challenges, and desired outcomes before deciding on technology.",
  },
  {
    number: "02",
    title: "Build",
    description:
      "Design and engineer reliable digital solutions using modern technologies and development practices.",
  },
  {
    number: "03",
    title: "Evolve",
    description:
      "Continuously improve products, systems, and workflows as your business and technology needs change.",
  },
];

function Services() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-white/10">

        <div className="absolute right-[-180px] top-[-100px] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[110px] sm:h-[600px] sm:w-[600px]" />

        <div className="absolute left-[-120px] top-72 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8 lg:pb-28 lg:pt-32">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-medium text-cyan-300 backdrop-blur sm:text-sm">
              <Settings2 className="h-4 w-4" />
              Digital Services
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Technology that
              <span className="block text-cyan-400">
                moves business forward.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:mt-8 sm:text-lg sm:leading-8">
              From digital products to intelligent business systems, IMMIQ
              helps organizations design, build, integrate, and evolve their
              technology.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">

              <a
                href="#services"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-400 px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.99]"
              >
                Explore Services

                <ArrowRight className="h-[18px] w-[18px] transition group-hover:translate-x-1" />
              </a>

              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/5"
              >
                Discuss a Project
              </Link>
            </div>
          </div>

          {/* HERO STATS */}
          <div className="mt-12 grid gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-4 lg:mt-20">

            <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.04] sm:rounded-3xl sm:p-7">
              <Globe className="h-6 w-6 text-cyan-400" />

              <p className="mt-5 text-xl font-semibold sm:mt-6 sm:text-2xl">
                Digital First
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Build experiences around modern users and connected systems.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.04] sm:rounded-3xl sm:p-7">
              <Layers3 className="h-6 w-6 text-cyan-400" />

              <p className="mt-5 text-xl font-semibold sm:mt-6 sm:text-2xl">
                Scalable
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Architect solutions that can grow with your organization.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.04] sm:rounded-3xl sm:p-7">
              <Zap className="h-6 w-6 text-cyan-400" />

              <p className="mt-5 text-xl font-semibold sm:mt-6 sm:text-2xl">
                Future Ready
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Combine software engineering with emerging technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================= */}
      <section
        id="services"
        className="border-b border-white/10 py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              What we build
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
              Digital solutions built around your goals.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
              We combine product thinking, engineering, cloud technologies,
              automation, and emerging technology to solve practical business
              problems.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">

            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.04] sm:rounded-3xl sm:p-7"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400 sm:h-12 sm:w-12">
                      <Icon className="h-[22px] w-[22px]" />
                    </div>

                    <ArrowRight className="h-[18px] w-[18px] text-slate-700 transition group-hover:translate-x-1 group-hover:text-cyan-400" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold sm:mt-7">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400 sm:mt-4">
                    {service.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[11px] text-slate-500 sm:text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          CAPABILITIES
      ========================================================= */}
      <section className="border-b border-white/10 bg-white/[0.015] py-16 sm:py-20 lg:py-24">

        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Our capabilities
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
              From a single application to an entire digital ecosystem.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
              IMMIQ can support individual technology initiatives or work
              across multiple layers of your digital environment.
            </p>

            <Link
              to="/contact"
              className="group mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cyan-400 transition hover:text-cyan-300 sm:mt-8"
            >
              Talk to our team

              <ArrowRight className="h-[17px] w-[17px] transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="space-y-3">

            {capabilities.map((capability, index) => (
              <div
                key={capability}
                className="group flex min-h-14 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 transition hover:border-cyan-400/20 hover:bg-white/[0.04] sm:gap-5 sm:px-6 sm:py-5"
              >

                <span className="w-7 shrink-0 text-xs font-semibold text-cyan-400 sm:text-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="text-sm text-slate-300 sm:text-base">
                  {capability}
                </span>

                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-700 transition group-hover:translate-x-1 group-hover:text-cyan-400" />
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =========================================================
          HOW WE WORK
      ========================================================= */}
      <section className="border-b border-white/10 py-16 sm:py-20 lg:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              How we work
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
              Clear thinking.
              <span className="block text-slate-500">
                Strong engineering.
              </span>
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
              Technology works best when the problem is understood before
              the solution is built.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-3 lg:gap-6">

            {workSteps.map((step) => (
              <div
                key={step.number}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.04] sm:p-7"
              >

                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-cyan-400">
                    {step.number}
                  </span>

                  <ArrowRight className="h-4 w-4 text-slate-700 transition group-hover:translate-x-1 group-hover:text-cyan-400" />
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="relative overflow-hidden border-t border-white/10">

        <div className="absolute inset-0 bg-cyan-500/[0.04]" />

        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.035] px-5 py-12 text-center sm:rounded-[2rem] sm:px-10 sm:py-16 lg:px-12">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
              <Settings2 className="h-6 w-6 text-cyan-400" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Work with IMMIQ
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
              Have a digital challenge?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
              Tell us what you are trying to build, improve, automate, or
              transform. We can explore the right technology together.
            </p>

            <Link
              to="/contact"
              className="group mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-cyan-400 px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.99]"
            >
              Start a Conversation

              <ArrowRight className="h-[18px] w-[18px] transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Services;