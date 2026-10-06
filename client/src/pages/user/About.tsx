import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Code2,
  Cpu,
  Layers3,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const capabilities = [
  {
    icon: Code2,
    title: "Technology Training",
    description:
      "Practical learning programs designed around modern technologies, real projects and industry needs.",
    href: "/training",
  },
  {
    icon: Layers3,
    title: "Product Engineering",
    description:
      "End-to-end software product development from ideas and prototypes to scalable digital platforms.",
    href: "/saas",
  },
  {
    icon: Cpu,
    title: "Emerging Technology",
    description:
      "Research and experimentation across AI, AR/VR/XR, spatial computing and other emerging technologies.",
    href: "/technology",
  },
  {
    icon: Brain,
    title: "Digital Transformation",
    description:
      "Technology solutions that help organizations modernize processes, experiences and digital capabilities.",
    href: "/services",
  },
];

const principles = [
  {
    number: "01",
    title: "Curiosity First",
    description:
      "We start with questions, exploration and genuine curiosity before choosing a technology or solution.",
  },
  {
    number: "02",
    title: "Learn by Building",
    description:
      "We believe technology becomes meaningful when people learn it through practical projects and real challenges.",
  },
  {
    number: "03",
    title: "Experiment Without Fear",
    description:
      "Emerging technology requires experimentation. We explore, test, learn and continuously improve.",
  },
  {
    number: "04",
    title: "Create Real Impact",
    description:
      "The goal is not technology for technology's sake. We focus on useful outcomes for people and businesses.",
  },
];

const journey = [
  {
    icon: Sparkles,
    title: "Interest",
    description:
      "Discover what excites you and identify the possibilities technology can unlock.",
  },
  {
    icon: Brain,
    title: "Learn",
    description:
      "Build strong foundations through practical, structured and technology-focused learning.",
  },
  {
    icon: Code2,
    title: "Build",
    description:
      "Turn knowledge into real projects, products, prototypes and digital experiences.",
  },
  {
    icon: Target,
    title: "Impact",
    description:
      "Use technology to solve meaningful problems and create measurable outcomes.",
  },
];

const whyImmiq = [
  "Practical and project-driven approach",
  "Modern technology and emerging technology focus",
  "Learning connected directly to real-world problems",
  "Engineering mindset with continuous experimentation",
  "One technology partner across multiple capabilities",
];

export default function About() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-3xl sm:h-[500px] sm:w-[500px] lg:h-[650px] lg:w-[650px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[280px] w-[280px] rounded-full bg-blue-500/5 blur-3xl sm:h-[450px] sm:w-[450px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="max-w-5xl">
            <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs text-cyan-300 sm:text-sm">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>About IMMIQ</span>
            </div>

            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Building with technology.
              <span className="mt-2 block text-cyan-400 sm:mt-3">
                Learning what comes next.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:mt-8 sm:text-lg sm:leading-8 lg:text-xl">
              IMMIQ is a technology company bringing together learning,
              engineering, innovation and digital transformation to create
              meaningful technology solutions.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Talk to IMMIQ
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/technology"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
              >
                Explore Technology
              </Link>
            </div>
          </div>

          {/* Hero Metrics */}
          <div className="mt-14 grid overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:mt-20 sm:grid-cols-3">
            <div className="border-b border-white/10 bg-slate-950/80 p-6 sm:border-b-0 sm:border-r sm:p-7">
              <p className="text-3xl font-semibold sm:text-4xl">04</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Core technology pillars
              </p>
            </div>

            <div className="border-b border-white/10 bg-slate-950/80 p-6 sm:border-b-0 sm:border-r sm:p-7">
              <p className="text-3xl font-semibold sm:text-4xl">40+</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Technologies explored
              </p>
            </div>

            <div className="bg-slate-950/80 p-6 sm:p-7">
              <p className="text-3xl font-semibold sm:text-4xl">∞</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Possibilities to create
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="border-b border-white/10 bg-slate-900/50">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8 lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Who we are
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              A technology company built around possibilities.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-7 text-slate-400 sm:space-y-6 sm:text-lg sm:leading-8">
            <p>
              IMMIQ works across technology training, software development,
              emerging technologies and digital services.
            </p>

            <p>
              Our goal is simple: help people and organizations understand
              technology, build with it and use it to solve meaningful
              problems.
            </p>

            <p>
              We combine practical learning, engineering expertise and
              experimentation to create technology experiences that are
              relevant today and ready for tomorrow.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl sm:h-96 sm:w-96" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Our philosophy
            </p>

            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              CURIOSITY FIRST.
              <span className="block text-cyan-400">
                TECHNOLOGY NEXT.
              </span>
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-7 text-slate-400 sm:mt-8 sm:text-lg sm:leading-8">
              Technology changes quickly. Curiosity is what keeps us learning.
              We believe the best technology journeys begin with the desire
              to understand, explore and build something better.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle) => (
              <div
                key={principle.number}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.04] sm:p-7"
              >
                <span className="text-sm font-semibold text-cyan-400">
                  {principle.number}
                </span>

                <h3 className="mt-5 text-xl font-semibold">
                  {principle.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section
        id="capabilities"
        className="scroll-mt-24 border-y border-white/10 bg-slate-900/50"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              What we do
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Four areas. One technology vision.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              Our capabilities connect education, engineering and innovation
              into one technology ecosystem.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:mt-14 md:grid-cols-2">
            {capabilities.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.04] sm:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                    <Icon className="h-5 w-5 text-cyan-400" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">
                    {item.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-cyan-400">
                    Explore capability
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning Journey */}
      <section>
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
                How we think
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                From curiosity to real-world impact.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
                Whether someone joins us to learn technology or works with us
                to build a product, the journey starts with curiosity and
                ends with something meaningful.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {journey.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="relative rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-7"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                        <Icon className="h-5 w-5 text-cyan-400" />
                      </div>

                      <span className="text-xs font-semibold text-slate-600">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="border-y border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-7 sm:p-9 lg:p-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                <Target className="h-5 w-5 text-cyan-400" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
                Vision
              </p>

              <h3 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
                Make technology more accessible, practical and impactful.
              </h3>

              <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
                We envision a future where individuals and organizations can
                confidently use emerging technology to create new
                possibilities.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950 p-7 sm:p-9 lg:p-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                <Zap className="h-5 w-5 text-cyan-400" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
                Mission
              </p>

              <h3 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
                Learn. Build. Experiment. Transform.
              </h3>

              <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
                We bring together training, engineering and emerging
                technology to help people and businesses move from ideas to
                meaningful digital outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why IMMIQ */}
      <section>
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
                Why IMMIQ
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                One ecosystem for learning, building and exploring.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
                Instead of looking at learning, engineering and emerging
                technology as separate worlds, IMMIQ brings them together.
              </p>
            </div>

            <div className="space-y-4">
              {whyImmiq.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:p-5"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

                  <span className="text-sm leading-6 text-slate-300 sm:text-base">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="border-y border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-950 p-7 sm:p-9 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
                Built from Coimbatore
              </p>

              <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
                Technology from Tamil Nadu, built for the world.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
                IMMIQ is rooted in Coimbatore and focused on creating
                technology experiences, products and learning opportunities
                that can reach beyond geography.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
            >
              Start a conversation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-500/5" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 py-20 text-center sm:px-6 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
            Work with us
          </p>

          <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Let's build something meaningful with technology.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            Whether you are looking to learn, build or explore technology,
            IMMIQ is ready to work with you.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-400 px-7 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Talk to IMMIQ
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}