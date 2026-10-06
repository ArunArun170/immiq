import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Sparkles,
  Users2,
} from "lucide-react";

import { useEffect, useState } from "react";

type Course = {
  _id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  technology: string;
  audience: string;
  level: string;
  mode: string;
  duration: string;
  fee: number;
  thumbnail: string;
  featured: boolean;
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

const trainingPoints = [
  "Industry-oriented curriculum",
  "Hands-on project-based learning",
  "Experienced technology mentors",
  "Real-world development practices",
  "Beginner to advanced learning paths",
  "Corporate and institutional programs",
];

const corporatePoints = [
  "Technology stack",
  "Team skill levels",
  "Business objectives",
  "Project requirements",
  "Duration & delivery format",
];

export default function Training() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch(
          `${API_URL}/public/courses`
        );

        const data = await response.json();

        if (response.ok) {
          setCourses(data.courses || []);
        } else {
          console.error(
            "Failed to load courses:",
            data.message
          );
        }
      } catch (error) {
        console.error(
          "Failed to load courses:",
          error
        );
      } finally {
        setCoursesLoading(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-[-140px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl sm:h-[550px] sm:w-[550px]" />

        <div className="pointer-events-none absolute right-[-180px] top-[300px] h-[350px] w-[350px] rounded-full bg-blue-500/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8 lg:pb-32 lg:pt-40">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300 sm:text-sm sm:tracking-[0.2em]">
              <Sparkles
                size={15}
                className="shrink-0"
              />
              Technology Training
            </div>

            <h1 className="mt-7 text-[2.8rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              Learn technology.
              <span className="block text-cyan-400">
                Build what comes next.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:mt-8 sm:text-lg sm:leading-8 lg:text-xl">
              Practical, industry-focused technology
              training designed to transform learners
              into confident builders, developers and
              technology professionals.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
              <a
                href="#programs"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-400 px-7 py-3 font-semibold text-slate-950 transition duration-300 hover:bg-cyan-300"
              >
                Explore Programs
                <ArrowRight size={18} />
              </a>

              <a
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-7 py-3 font-semibold text-white transition duration-300 hover:border-cyan-400/40 hover:bg-white/5"
              >
                Talk to Our Team
              </a>
            </div>
          </div>

          {/* HERO STATS */}
          <div className="mt-14 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.025] sm:mt-20 sm:rounded-3xl">
            <div className="grid sm:grid-cols-3">
              <div className="border-b border-white/10 p-6 sm:border-b-0 sm:border-r sm:p-7">
                <p className="text-3xl font-semibold sm:text-4xl">
                  01
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Industry-focused approach
                </p>
              </div>

              <div className="border-b border-white/10 p-6 sm:border-b-0 sm:border-r sm:p-7">
                <p className="text-3xl font-semibold sm:text-4xl">
                  ∞
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Opportunities to build
                </p>
              </div>

              <div className="p-6 sm:p-7">
                <p className="text-3xl font-semibold sm:text-4xl">
                  360°
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Technology learning
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="border-y border-white/10 bg-slate-900/50">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-8 lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Our approach
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Training that goes beyond theory.
            </h2>

            <div className="mt-6 h-px w-20 bg-cyan-400/50" />
          </div>

          <div>
            <p className="text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              At IMMIQ, learning is connected to real
              technology, real projects and real-world
              problem solving. Our programs are designed
              to help learners understand not just how
              technology works, but how to use it to
              create meaningful solutions.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {trainingPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition duration-300 hover:border-cyan-400/20 hover:bg-white/[0.04]"
                >
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-cyan-400"
                  />

                  <span className="text-sm leading-6 text-slate-300">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section
        id="programs"
        className="scroll-mt-24 border-b border-white/10 py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Learning programs
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Technology programs built for the future.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
              Explore technology domains that help
              learners and organizations stay ready for
              a rapidly changing digital world.
            </p>
          </div>

          {coursesLoading ? (
            <div className="mt-12 grid gap-4 sm:mt-14 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-72 animate-pulse rounded-[1.5rem] border border-white/10 bg-white/[0.025] sm:rounded-3xl"
                />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="mt-12 rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-10 text-center sm:mt-14 sm:rounded-3xl">
              <Code2 className="mx-auto h-10 w-10 text-cyan-400/50" />

              <h3 className="mt-5 text-xl font-semibold">
                New training programs are coming soon.
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
                Our latest technology programs will
                appear here once they are published.
              </p>

              <a
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Talk to IMMIQ
                <ArrowRight size={16} />
              </a>
            </div>
          ) : (
            <div className="mt-12 grid gap-4 sm:mt-14 md:grid-cols-2">
              {courses.map((course) => (
                <article
                  key={course._id}
                  className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.025] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.04] sm:rounded-3xl"
                >
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-cyan-400/[0.04]">
                      <Code2 className="h-12 w-12 text-cyan-400/30" />
                    </div>
                  )}

                  <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
                          {course.level}
                        </span>

                        <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-slate-400">
                          {course.mode}
                        </span>
                      </div>

                      {course.featured && (
                        <span className="shrink-0 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-300">
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 className="mt-7 text-xl font-semibold sm:text-2xl">
                      {course.title}
                    </h3>

                    {course.tagline && (
                      <p className="mt-2 text-sm font-medium text-cyan-400">
                        {course.tagline}
                      </p>
                    )}

                    <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                      {course.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {course.technology && (
                        <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-slate-400">
                          {course.technology}
                        </span>
                      )}

                      {course.audience && (
                        <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-slate-400">
                          {course.audience}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-500">
                      {course.duration && (
                        <span>{course.duration}</span>
                      )}

                      {course.fee > 0 && (
                        <span>
                          • ₹
                          {course.fee.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      )}
                    </div>

                    <a
                      href={`/training/${course.slug}`}
                      className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 transition duration-300 hover:gap-3 hover:text-cyan-300"
                    >
                      Explore course
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LEARNING MODEL */}
      <section className="border-b border-white/10 bg-white/[0.015] py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
                The IMMIQ learning model
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Learn. Experiment. Build. Grow.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
                Technology becomes meaningful when learners
                can apply what they know. Our learning
                approach connects concepts with
                experimentation and real project building.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {[
                {
                  number: "01",
                  title: "Learn",
                  text: "Understand the fundamentals and the technology behind the tools.",
                },
                {
                  number: "02",
                  title: "Experiment",
                  text: "Practice through exercises, challenges and guided exploration.",
                },
                {
                  number: "03",
                  title: "Build",
                  text: "Turn knowledge into practical projects and working solutions.",
                },
                {
                  number: "04",
                  title: "Grow",
                  text: "Develop the confidence to solve real-world technology problems.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="rounded-[1.5rem] border border-white/10 bg-slate-950 p-6 transition duration-300 hover:border-cyan-400/20 sm:rounded-3xl sm:p-7"
                >
                  <span className="text-sm font-semibold text-cyan-400">
                    {item.number}
                  </span>

                  <h3 className="mt-4 text-xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CORPORATE TRAINING */}
      <section
  id="corporate"
  className="scroll-mt-24 border-b border-white/10 bg-slate-900/50"
>
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <Users2
                  size={22}
                  className="text-cyan-400"
                />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
                For organizations
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Upskill your teams for the technology ahead.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
                Custom corporate training programs
                designed around your organization's
                technology stack, business goals and team
                capabilities.
              </p>

              <a
                href="/contact"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold transition duration-300 hover:border-cyan-400/40 hover:bg-white/5 sm:text-base"
              >
                Discuss Corporate Training
                <ArrowRight size={17} />
              </a>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950 p-6 sm:rounded-3xl sm:p-8">
              <p className="text-sm font-medium text-slate-500">
                Training can be customized around
              </p>

              <div className="mt-6 space-y-4">
                {corporatePoints.map(
                  (item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0"
                    >
                      <span className="w-6 shrink-0 text-sm font-medium text-cyan-400">
                        0{index + 1}
                      </span>

                      <span className="text-sm text-slate-300 sm:text-base">
                        {item}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 py-20 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
            Start learning
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to build your next technology skill?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
            Tell us what you want to learn, build or
            improve. We'll help you find the right
            technology learning path.
          </p>

          <a
            href="/contact"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-400 px-7 py-3 font-semibold text-slate-950 transition duration-300 hover:bg-cyan-300"
          >
            Talk to IMMIQ
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}