import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Calendar,
  CheckCircle2,
  Handshake,
  Loader2,
  Medal,
  Newspaper,
  ShieldCheck,
  Target,
  Trophy,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

interface Achievement {
  _id: string;
  title: string;
  description: string;
  date: string;
  category:
    | "Milestone"
    | "Award"
    | "Media"
    | "Partnership"
    | "Certification";
  image?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const categoryIcons = {
  Milestone: Target,
  Award: Trophy,
  Media: Newspaper,
  Partnership: Handshake,
  Certification: ShieldCheck,
};

const categories = [
  "All",
  "Milestone",
  "Award",
  "Media",
  "Partnership",
  "Certification",
];

function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/public/achievements`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch achievements");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to fetch achievements"
          );
        }

        setAchievements(result.data || []);
      } catch (err) {
        console.error("Achievements fetch error:", err);
        setError(
          "Unable to load achievement information right now."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const filteredAchievements = useMemo(() => {
    if (activeCategory === "All") {
      return achievements;
    }

    return achievements.filter(
      (achievement) => achievement.category === activeCategory
    );
  }, [achievements, activeCategory]);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_35%)]" />

        <div className="absolute -right-32 top-20 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl sm:h-96 sm:w-96" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 backdrop-blur sm:text-sm">
              <Award className="h-4 w-4 text-cyan-400" />
              Our Journey
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Achievements that
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                move us forward.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              Every milestone reflects our commitment to curiosity,
              technology, learning, and building meaningful outcomes
              for the people and businesses we work with.
            </p>

            {/* Small Stats */}
            {!loading && !error && achievements.length > 0 && (
              <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-2xl font-semibold sm:text-3xl">
                    {achievements.length}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Milestones
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-2xl font-semibold sm:text-3xl">
                    {
                      achievements.filter(
                        (achievement) => achievement.featured
                      ).length
                    }
                  </p>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Featured
                  </p>
                </div>

                <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:col-span-1">
                  <p className="text-2xl font-semibold sm:text-3xl">
                    2026
                  </p>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Current journey
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

        {/* Section Header */}
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
            Milestones
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            The journey so far.
          </h2>
        </div>

        {/* Category Filters */}
        <div className="mb-10 overflow-x-auto pb-2 sm:mb-12">
          <div className="flex min-w-max gap-2 sm:flex-wrap sm:min-w-0 sm:gap-3">
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`min-h-10 rounded-full border px-4 py-2 text-xs font-medium transition sm:px-5 sm:text-sm ${
                    isActive
                      ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300"
                      : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center text-slate-400">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
              </div>

              <p className="text-sm">
                Loading achievements...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-7 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10">
                <Award className="h-5 w-5 text-red-300" />
              </div>

              <p className="mt-4 text-sm leading-6 text-red-300">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 min-h-10 rounded-lg border border-red-400/20 px-5 py-2 text-sm font-medium text-red-300 transition hover:bg-red-400/10"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredAchievements.length === 0 && (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="text-center text-slate-400">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Medal className="h-6 w-6" />
                </div>

                <p className="mt-5 text-sm">
                  No achievements found in this category.
                </p>
              </div>
            </div>
          )}

        {/* Achievement Cards */}
        {!loading &&
          !error &&
          filteredAchievements.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
              {filteredAchievements.map((achievement) => {
                const Icon =
                  categoryIcons[achievement.category] || Award;

                return (
                  <article
                    key={achievement._id}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.04] sm:p-7 lg:p-8"
                  >
                    {/* Glow */}
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl transition duration-500 group-hover:bg-cyan-500/20" />

                    <div className="relative">

                      {/* Top */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                          <Icon className="h-5 w-5 text-cyan-400 sm:h-6 sm:w-6" />
                        </div>

                        {achievement.featured && (
                          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1.5 text-[10px] font-medium text-emerald-300 sm:px-3 sm:text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="mb-4 mt-6 flex flex-wrap items-center gap-2.5 text-xs">
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-300">
                          {achievement.category}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-slate-500">
                          <Calendar className="h-3.5 w-3.5" />
                          {achievement.date}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-semibold leading-snug text-white sm:text-2xl">
                        {achievement.title}
                      </h2>

                      {/* Description */}
                      <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                        {achievement.description}
                      </p>

                      {/* Image */}
                      {achievement.image && (
                        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                          <img
                            src={achievement.image}
                            alt={achievement.title}
                            loading="lazy"
                            className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56"
                          />
                        </div>
                      )}

                      {/* Bottom Accent */}
                      <div className="mt-7 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-slate-600 transition group-hover:text-cyan-400">
                        <span className="h-px w-6 bg-current" />
                        IMMIQ Journey
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </section>

      {/* Bottom CTA */}
      {!loading && !error && (
        <section className="border-t border-white/10 bg-slate-900/50">
          <div className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              What's next
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              The journey is only getting started.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
              From learning and experimentation to products and
              partnerships, IMMIQ continues to explore what technology
              can make possible.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}

export default Achievements;