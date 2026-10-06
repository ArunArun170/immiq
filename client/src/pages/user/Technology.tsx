import {
  ArrowRight,
  Brain,
  Cpu,
  Eye,
  Layers3,
  Network,
  Sparkles,
  Zap,
} from "lucide-react";

const technologies = [
  {
    icon: Brain,
    title: "Artificial Intelligence",
    description:
      "Intelligent systems that help businesses automate decisions, discover insights, and create new digital experiences.",
    tags: ["AI", "LLMs", "Generative AI"],
  },
  {
    icon: Cpu,
    title: "Machine Learning",
    description:
      "Data-driven models designed for prediction, classification, recommendation, and intelligent automation.",
    tags: ["ML", "Predictive", "Analytics"],
  },
  {
    icon: Layers3,
    title: "AR / VR / XR",
    description:
      "Immersive technology experiences for learning, simulation, visualization, training, and enterprise applications.",
    tags: ["AR", "VR", "XR"],
  },
  {
    icon: Network,
    title: "Spatial Computing",
    description:
      "Exploring the intersection of digital content, physical environments, computer vision, and immersive interaction.",
    tags: ["3D", "Spatial", "Immersive"],
  },
  {
    icon: Eye,
    title: "Computer Vision",
    description:
      "Technology that enables systems to understand images, video, objects, environments, and visual patterns.",
    tags: ["Vision", "Image AI", "Detection"],
  },
  {
    icon: Zap,
    title: "IoT & Automation",
    description:
      "Connected systems and intelligent workflows that bring data, devices, software, and automation together.",
    tags: ["IoT", "Automation", "Connected"],
  },
];

const process = [
  {
    number: "01",
    title: "Explore",
    description:
      "Identify emerging technologies and understand where they can create meaningful business value.",
  },
  {
    number: "02",
    title: "Experiment",
    description:
      "Build prototypes, proof-of-concepts, and experimental solutions to validate ideas quickly.",
  },
  {
    number: "03",
    title: "Validate",
    description:
      "Test technical feasibility, user experience, scalability, and real-world applicability.",
  },
  {
    number: "04",
    title: "Transform",
    description:
      "Turn successful experiments into practical products, services, and intelligent business solutions.",
  },
];

const innovationAreas = [
  "Artificial Intelligence",
  "Machine Learning",
  "Extended Reality",
  "Spatial Computing",
  "Computer Vision",
  "IoT & Automation",
  "Cloud Intelligence",
  "Data & Analytics",
];

function Technology() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#05070a] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-[-120px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl sm:h-[520px] sm:w-[520px]" />

        <div className="pointer-events-none absolute right-[-160px] top-[280px] h-[320px] w-[320px] rounded-full bg-blue-500/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8 lg:pb-32 lg:pt-40">
          <div className="max-w-4xl">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-400 sm:text-sm sm:tracking-[0.22em]">
              <Sparkles size={15} className="shrink-0" />
              <span>Emerging Technology Lab</span>
            </div>

            <h1 className="mt-7 text-[2.8rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              Exploring what
              <span className="block text-cyan-400">
                comes next.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-gray-400 sm:mt-8 sm:text-lg sm:leading-8 lg:text-xl">
              IMMIQ explores emerging technologies and transforms promising
              ideas into practical digital experiences, intelligent systems,
              and future-ready solutions.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
              <a
                href="#technologies"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-black transition duration-300 hover:bg-cyan-300"
              >
                Explore Technologies
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>

              <a
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition duration-300 hover:border-cyan-400/50 hover:bg-white/5"
              >
                Start an Innovation Project
              </a>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="mt-16 grid gap-4 sm:mt-20 lg:grid-cols-3">
            {/* Innovation Landscape */}
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8 lg:col-span-2">
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/[0.06] blur-3xl" />

              <div className="relative flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                    Innovation landscape
                  </p>

                  <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                    Technology without limits.
                  </h2>
                </div>

                <div className="hidden shrink-0 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-400 sm:block">
                  <Brain size={25} />
                </div>
              </div>

              <div className="relative mt-8 grid grid-cols-2 gap-2.5 sm:mt-10 sm:grid-cols-4 sm:gap-3">
                {innovationAreas.map((item) => (
                  <div
                    key={item}
                    className="flex min-h-16 items-center justify-center rounded-xl border border-white/10 bg-black/20 px-3 py-4 text-center text-xs text-gray-300 transition duration-300 hover:border-cyan-400/25 hover:bg-cyan-400/[0.04] hover:text-white sm:text-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Lab Mindset */}
            <div className="relative overflow-hidden rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/[0.04] p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">
                Lab mindset
              </p>

              <div className="mt-7 space-y-6 sm:mt-8">
                <div>
                  <p className="text-2xl font-semibold sm:text-3xl">
                    Explore.
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Discover new possibilities.
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-semibold sm:text-3xl">
                    Experiment.
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Turn ideas into prototypes.
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-semibold sm:text-3xl">
                    Build.
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Create real-world impact.
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-cyan-400/[0.07] blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES */}
      <section
        id="technologies"
        className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              What we explore
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Technology at the edge of possibility.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:mt-6 sm:text-lg sm:leading-8">
              We continuously explore technologies that can change how people
              learn, work, build products, and interact with digital systems.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
            {technologies.map((technology) => {
              const Icon = technology.icon;

              return (
                <div
                  key={technology.title}
                  className="group rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.04] sm:rounded-3xl sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-400">
                      <Icon size={22} />
                    </div>

                    <ArrowRight
                      size={18}
                      className="mt-1 text-gray-700 transition duration-300 group-hover:translate-x-1 group-hover:text-cyan-400"
                    />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    {technology.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-400">
                    {technology.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {technology.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-gray-500"
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

      {/* RESEARCH / EXPERIMENTATION */}
      <section className="border-t border-white/10 bg-white/[0.015] py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Innovation Lab
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Curiosity becomes capability.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-400 sm:mt-6 sm:text-lg sm:leading-8">
              Emerging technology is not about following trends. It is about
              understanding what is useful, experimenting with it, and finding
              meaningful ways to apply it.
            </p>

            <p className="mt-4 max-w-xl text-base leading-7 text-gray-400 sm:mt-5 sm:text-lg sm:leading-8">
              Our lab mindset connects research, experimentation, product
              engineering, and real-world business challenges.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {[
              {
                icon: Cpu,
                title: "Research",
                description:
                  "Study emerging technologies and identify meaningful use cases.",
              },
              {
                icon: Zap,
                title: "Prototyping",
                description:
                  "Rapidly turn concepts into working technical prototypes.",
              },
              {
                icon: Network,
                title: "Integration",
                description:
                  "Connect emerging technology with existing digital ecosystems.",
              },
              {
                icon: Sparkles,
                title: "Innovation",
                description:
                  "Transform validated ideas into practical technology solutions.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-white/10 bg-black/10 p-6 transition duration-300 hover:border-cyan-400/20 hover:bg-white/[0.02] sm:rounded-3xl sm:p-7"
                >
                  <Icon className="text-cyan-400" size={24} />

                  <h3 className="mt-5 text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-t border-white/10 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Our approach
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              From experiment to impact.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:mt-6 sm:text-lg sm:leading-8">
              We move from curiosity to practical outcomes through a focused
              cycle of exploration, experimentation, validation, and
              transformation.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:mt-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {process.map((item) => (
              <div
                key={item.number}
                className="relative border-t border-white/10 pt-6"
              >
                <span className="text-sm font-semibold text-cyan-400">
                  {item.number}
                </span>

                <h3 className="mt-4 text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-cyan-400/[0.04] px-6 py-14 sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative">
              <Sparkles
                className="mx-auto text-cyan-400"
                size={30}
              />

              <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Have an idea worth exploring?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:mt-6 sm:text-lg sm:leading-8">
                Let’s explore the technology, build a prototype, and discover
                what your idea could become.
              </p>

              <a
                href="/contact"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-400 px-7 py-3 font-semibold text-black transition duration-300 hover:bg-cyan-300"
              >
                Talk to IMMIQ
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Technology;