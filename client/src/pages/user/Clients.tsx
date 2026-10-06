import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Factory,
  GraduationCap,
  HeartPulse,
  Landmark,
  Laptop2,
  /* Loader2, */
  MapPin,
  ShoppingBag,
  Truck,
  Users,
  Workflow,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Client = {
  _id: string;
  name: string;
  industry: string;
  description: string;
  projectType: string;
  location: string;
  website?: string;
  logo?: string;
  featured: boolean;
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

const industries = [
  "All",
  "Manufacturing",
  "Agritech",
  "Education",
  "Logistics",
  "Healthcare",
  "Retail",
  "Media",
  "Automotive",
  "Finance",
  "Startup",
];

const getIndustryIcon = (industry: string) => {
  switch (industry) {
    case "Manufacturing":
      return Factory;
    case "Agritech":
      return Workflow;
    case "Education":
      return GraduationCap;
    case "Logistics":
      return Truck;
    case "Healthcare":
      return HeartPulse;
    case "Retail":
      return ShoppingBag;
    case "Media":
      return Laptop2;
    case "Automotive":
      return Building2;
    case "Finance":
      return Landmark;
    case "Startup":
      return Users;
    default:
      return Building2;
  }
};

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [activeIndustry, setActiveIndustry] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/public/clients`);

        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to fetch clients"
          );
        }

        setClients(result.data || []);
      } catch (err) {
        console.error("Clients API error:", err);
        setError(
          "Unable to load client information right now."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    if (activeIndustry === "All") {
      return clients;
    }

    return clients.filter(
      (client) => client.industry === activeIndustry
    );
  }, [clients, activeIndustry]);

  const featuredClients = useMemo(
    () => clients.filter((client) => client.featured),
    [clients]
  );

  const industryCount = useMemo(() => {
    return new Set(clients.map((client) => client.industry)).size;
  }, [clients]);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute left-1/2 top-0 h-[420px] w-[650px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px] sm:h-[500px] sm:w-[800px]" />

        <div className="absolute right-0 top-20 h-56 w-56 rounded-full bg-blue-500/5 blur-3xl sm:h-80 sm:w-80" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8 lg:pb-24 lg:pt-32">

          <div className="max-w-4xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs text-cyan-300 backdrop-blur sm:text-sm">
              <Building2 className="h-4 w-4" />
              Clients & Partnerships
            </div>

            <h1 className="text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Technology built around
              <span className="block text-cyan-400">
                real businesses.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:mt-7 sm:text-lg sm:leading-8">
              We work with businesses, institutions and teams to turn
              technology challenges into meaningful digital products,
              learning experiences and transformation initiatives.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4">

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="text-2xl font-semibold sm:text-3xl">
                {loading ? "—" : clients.length || "—"}
              </div>

              <div className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
                Organisations & teams
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="text-2xl font-semibold sm:text-3xl">
                {loading ? "—" : `${industryCount}+`}
              </div>

              <div className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
                Industries reached
              </div>
            </div>

            <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:col-span-1 sm:p-6">
              <div className="text-2xl font-semibold sm:text-3xl">
                4
              </div>

              <div className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
                Technology pillars
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Clients */}
      {featuredClients.length > 0 && (
        <section className="border-b border-white/10 bg-slate-900/40 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

            <div className="mb-10 max-w-3xl sm:mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
                Selected relationships
              </p>

              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Working with teams that want to move forward.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                A selection of organisations and teams represented
                in the IMMIQ ecosystem.
              </p>
            </div>

            <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredClients.map((client) => {
                const Icon = getIndustryIcon(client.industry);

                return (
                  <article
                    key={client._id}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 sm:p-7"
                  >
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-500/5 blur-2xl transition group-hover:bg-cyan-500/10" />

                    <div className="relative">

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/10 text-cyan-400">
                          <Icon className="h-6 w-6" />
                        </div>

                        <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400/50" />
                      </div>

                      <div className="mt-7">
                        <p className="text-xs uppercase tracking-[0.16em] text-cyan-400">
                          {client.industry}
                        </p>

                        <h3 className="mt-2 text-xl font-semibold leading-snug">
                          {client.name}
                        </h3>

                        <p className="mt-4 text-sm leading-7 text-slate-400">
                          {client.description}
                        </p>
                      </div>

                      <div className="mt-7 border-t border-white/10 pt-5">
                        <div className="flex items-start gap-2 text-sm text-slate-500">
                          <Workflow className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/70" />

                          <span>{client.projectType}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Client Ecosystem */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Our client ecosystem
            </p>

            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Different industries.
              <span className="block text-slate-500">
                One technology mindset.
              </span>
            </h2>
          </div>

          {/* Filters */}
          <div className="mt-8 overflow-x-auto pb-3 sm:mt-10">
            <div className="flex min-w-max gap-2 sm:flex-wrap sm:min-w-0 sm:gap-3">
              {industries.map((industry) => {
                const isActive =
                  activeIndustry === industry;

                return (
                  <button
                    key={industry}
                    type="button"
                    onClick={() =>
                      setActiveIndustry(industry)
                    }
                    className={`min-h-10 rounded-full border px-4 py-2 text-xs font-medium transition sm:px-5 sm:text-sm ${
                      isActive
                        ? "border-cyan-400 bg-cyan-400 text-slate-950"
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {industry}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7"
                >
                  <div className="animate-pulse">
                    <div className="h-11 w-11 rounded-xl bg-white/10" />
                    <div className="mt-6 h-5 w-2/3 rounded bg-white/10" />
                    <div className="mt-4 h-4 w-full rounded bg-white/5" />
                    <div className="mt-2 h-4 w-5/6 rounded bg-white/5" />
                    <div className="mt-6 h-px bg-white/5" />
                    <div className="mt-5 h-4 w-1/2 rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="mt-10 flex min-h-[240px] items-center justify-center rounded-3xl border border-red-400/20 bg-red-400/5 p-8 text-center">
              <div>
                <p className="text-sm leading-6 text-red-300">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-5 min-h-10 rounded-xl border border-red-400/20 px-5 py-2 text-sm font-medium text-red-300 transition hover:bg-red-400/10"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            filteredClients.length === 0 && (
              <div className="mt-10 flex min-h-[260px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Building2 className="h-6 w-6 text-slate-600" />
                  </div>

                  <p className="mt-5 text-sm text-slate-400">
                    No clients found for this industry.
                  </p>

                  {activeIndustry !== "All" && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndustry("All")
                      }
                      className="mt-4 text-sm font-medium text-cyan-400 hover:text-cyan-300"
                    >
                      View all clients
                    </button>
                  )}
                </div>
              </div>
            )}

          {/* Clients */}
          {!loading &&
            !error &&
            filteredClients.length > 0 && (
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredClients.map((client) => {
                  const Icon = getIndustryIcon(
                    client.industry
                  );

                  return (
                    <article
                      key={client._id}
                      className="group rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.04] sm:p-7"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-400">
                          <Icon className="h-5 w-5" />
                        </div>

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-500">
                          {client.industry}
                        </span>
                      </div>

                      <h3 className="mt-6 text-xl font-semibold leading-snug">
                        {client.name}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-400">
                        {client.description}
                      </p>

                      <div className="mt-6 space-y-3 border-t border-white/10 pt-5">

                        <div className="flex items-start gap-2 text-sm text-slate-500">
                          <Workflow className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/70" />

                          <span>{client.projectType}</span>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-slate-500">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/70" />

                          <span>{client.location}</span>
                        </div>
                      </div>

                      {client.website && (
                        <a
                          href={client.website}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
                        >
                          Visit website
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </a>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
        </div>
      </section>

      {/* How We Work */}
      <section className="border-y border-white/10 bg-slate-900/40 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              How we work
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              We don't just deliver technology.
              <span className="mt-1 block text-slate-500">
                We understand the problem first.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
              From training programmes to SaaS products and digital
              transformation, our approach starts with understanding
              the business, people and outcomes behind the technology.
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4">
            {[
              "Understand the business challenge",
              "Design the right technology approach",
              "Build with modern engineering practices",
              "Measure, improve and evolve",
            ].map((item, index) => (
              <div
                key={item}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950 p-4 transition hover:border-cyan-400/20 sm:p-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/10 bg-cyan-400/10 text-xs font-semibold text-cyan-400">
                  0{index + 1}
                </div>

                <span className="text-sm leading-6 text-slate-300">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">

        <div className="absolute left-1/2 top-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[110px] sm:h-[400px] sm:w-[700px] sm:blur-[130px]" />

        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
            Work with IMMIQ
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Have a technology challenge?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
            Tell us what you are trying to build, improve or explore.
            Let's figure out the right technology path together.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-400 px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Start a conversation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}