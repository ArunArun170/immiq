import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  Layers3,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";

const capabilities = [
  {
    icon: Code2,
    title: "Product Engineering",
    description:
      "Turn ideas into reliable software products through modern engineering, thoughtful architecture and continuous iteration.",
  },
  {
    icon: Cloud,
    title: "Cloud-Native Products",
    description:
      "Build applications designed for modern cloud infrastructure, deployment, scalability and long-term growth.",
  },
  {
    icon: Database,
    title: "Data & Intelligence",
    description:
      "Connect your product with meaningful data, analytics and intelligent capabilities that improve decision-making.",
  },
  {
    icon: Workflow,
    title: "Business Automation",
    description:
      "Transform repetitive workflows into efficient digital systems that help teams save time and operate smarter.",
  },
];

const process = [
  {
    number: "01",
    title: "Discover",
    description:
      "Understand the business problem, users, goals and technology requirements.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Define the product experience, architecture and technical direction.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Develop the product using modern, scalable and maintainable technologies.",
  },
  {
    number: "04",
    title: "Scale",
    description:
      "Improve, optimize and evolve the product as your business grows.",
  },
];

const technologies = [
  "React",
  "Node.js",
  "TypeScript",
  "MongoDB",
  "Cloud",
  "APIs",
  "AI / ML",
  "Automation",
];

export default function SaaS() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-white/10">

        <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[110px] sm:h-[600px] sm:w-[600px]" />

        <div className="absolute left-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8 lg:pb-28 lg:pt-32">

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">

            {/* Hero content */}
            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-medium text-cyan-300 backdrop-blur sm:text-sm">
                <Sparkles className="h-4 w-4" />
                SaaS & Product Engineering
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                From idea
                <span className="block text-cyan-400">
                  to scalable product.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:mt-8 sm:text-lg sm:leading-8 lg:text-xl">
                We design and build modern software products that solve real
                business problems, create better experiences and scale with
                your ambitions.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">

                <Link
                  to="/contact"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-400 px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.99]"
                >
                  Start a Product

                  <ArrowRight className="h-[18px] w-[18px] transition group-hover:translate-x-1" />
                </Link>

                <a
                  href="#capabilities"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/5"
                >
                  Explore Capabilities
                </a>
              </div>

              {/* Small trust points */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500 sm:text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  Scalable architecture
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  Modern technology
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  Built to evolve
                </div>
              </div>
            </div>

            {/* Architecture visual */}
            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">

              <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-3 shadow-2xl backdrop-blur sm:p-5">

                <div className="rounded-2xl border border-white/10 bg-slate-950 p-5 sm:p-6">

                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
                        Product architecture
                      </p>

                      <p className="mt-2 text-lg font-semibold sm:text-xl">
                        Built to scale
                      </p>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
                      <Rocket className="h-[19px] w-[19px] text-cyan-400" />
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 sm:mt-6">

                    {/* UX */}
                    <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                      <div className="flex items-center gap-3">
                        <Layers3 className="h-[18px] w-[18px] text-cyan-400" />

                        <span className="text-sm font-medium">
                          User Experience
                        </span>
                      </div>
                    </div>

                    <div className="mx-auto h-4 w-px bg-white/10" />

                    {/* Application */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                      <div className="flex items-center gap-3">
                        <Code2 className="h-[18px] w-[18px] text-cyan-400" />

                        <span className="text-sm font-medium">
                          Application Layer
                        </span>
                      </div>
                    </div>

                    <div className="mx-auto h-4 w-px bg-white/10" />

                    {/* Data / Cloud */}
                    <div className="grid grid-cols-2 gap-3">

                      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                        <Database className="h-[18px] w-[18px] text-cyan-400" />

                        <p className="mt-3 text-xs text-slate-400">
                          Data
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                        <Cloud className="h-[18px] w-[18px] text-cyan-400" />

                        <p className="mt-3 text-xs text-slate-400">
                          Cloud
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-5 left-4 hidden rounded-2xl border border-cyan-400/20 bg-slate-900/95 p-4 shadow-xl backdrop-blur sm:block lg:-left-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">
                    <ShieldCheck className="h-5 w-5 text-cyan-400" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Built for growth
                    </p>

                    <p className="mt-1 text-[11px] text-slate-500">
                      Secure • Scalable • Maintainable
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRODUCTION
      ========================================================= */}
      <section className="border-b border-white/10 bg-slate-900/50">

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
                Product thinking
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
                Software should solve a business problem first.
              </h2>
            </div>

            <div>

              <p className="text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
                Great products are not just collections of features. They
                understand users, simplify complex workflows and create
                measurable value. Our product engineering approach connects
                business objectives with technology decisions.
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">

                {[
                  "User-first",
                  "Business-focused",
                  "Technology-driven",
                  "Built to evolve",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-xs text-slate-300 sm:text-sm"
                  >
                    {item}
                  </span>
                ))}

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CAPABILITIES
      ========================================================= */}
      <section
        id="capabilities"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >

        <div className="max-w-3xl">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
            What we build
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
            Product capabilities for modern businesses.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
            From the first product idea to a growing platform, we help
            organizations build technology that can evolve.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-2 lg:gap-6">

          {capabilities.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.04] sm:p-8"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                  <Icon className="h-[22px] w-[22px] text-cyan-400" />
                </div>

                <h3 className="mt-6 text-xl font-semibold sm:mt-7 sm:text-2xl">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400 sm:mt-4 sm:text-base">
                  {item.description}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cyan-400 sm:mt-7">
                  Explore capability

                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* =========================================================
          PROCESS
      ========================================================= */}
      <section className="border-y border-white/10 bg-slate-900/50">

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Our process
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
              A clear path from concept to product.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">

            {process.map((step) => (
              <div
                key={step.number}
                className="group rounded-2xl border border-white/10 bg-slate-950 p-6 transition hover:border-cyan-400/20 sm:p-7"
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
          TECHNOLOGY
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">

          <div>

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 sm:mb-6">
              <BarChart3 className="h-[22px] w-[22px] text-cyan-400" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Technology stack
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
              Modern technologies.
              <span className="block text-slate-500">
                Practical architecture.
              </span>
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
              We select technologies based on the product's actual needs,
              balancing speed, reliability, scalability and maintainability.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">

            {technologies.map((technology) => (
              <div
                key={technology}
                className="flex min-h-14 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-cyan-400/20 hover:bg-white/[0.04] sm:p-5"
              >
                <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-cyan-400" />

                <span className="text-sm text-slate-300">
                  {technology}
                </span>
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

        <div className="relative mx-auto max-w-5xl px-5 py-20 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-28">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
            Build with IMMIQ
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
            Have a product idea?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
            Let's turn your idea into a thoughtful, scalable and
            technology-driven product.
          </p>

          <Link
            to="/contact"
            className="group mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-cyan-400 px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.99] sm:mt-9"
          >
            Start a Conversation

            <ArrowRight className="h-[18px] w-[18px] transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

    </main>
  );
}