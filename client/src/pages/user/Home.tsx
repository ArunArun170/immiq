import { useEffect, useState } from "react";
import {
  ArrowRight,
  Brain,
  Cloud,
  Code2,
  Cpu,
  Layers3,
  Sparkles,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

const pillars = [
  {
    icon: Code2,
    title: "Corporate Training",
    description:
      "Industry-focused technology training that helps students, professionals and teams build practical skills.",
    href: "/training",
  },
  {
    icon: Layers3,
    title: "SaaS Development",
    description:
      "Design and develop scalable software products that solve real business problems.",
    href: "/saas",
  },
  {
    icon: Cpu,
    title: "Emerging Technology Lab",
    description:
      "Explore AI, AR/VR/XR, spatial computing and other technologies shaping the future.",
    href: "/technology",
  },
  {
    icon: Cloud,
    title: "Digital Services",
    description:
      "Build modern digital experiences, platforms and solutions for organizations.",
    href: "/services",
  },
];

const technologies = [
  "Artificial Intelligence",
  "Machine Learning",
  "Cloud Computing",
  "Full Stack Development",
  "SaaS",
  "AR / VR / XR",
  "Spatial Computing",
  "Automation",
];

interface Client {
  _id: string;
  name: string;
  industry: string;
  description: string;
  projectType: string;
  location: string;
  website?: string;
  logo?: string;
  featured: boolean;
}

interface Achievement {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image?: string;
  featured: boolean;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: number;
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  image?: string;
  tags: string[];
}

interface HomeData {
  clients: Client[];
  achievements: Achievement[];
  blogs: BlogPost[];
}

export default function Home() {
  const [homeData, setHomeData] = useState<HomeData>({
    clients: [],
    achievements: [],
    blogs: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch(`${API_URL}/public/home`);

        if (!response.ok) {
          throw new Error("Failed to fetch home page data");
        }

        const result = await response.json();

        if (result.success) {
          setHomeData(result.data);
        }
      } catch (error) {
        console.error("Home data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 lg:px-8 lg:pb-32 lg:pt-32">
          <div className="max-w-5xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300">
              <Sparkles size={15} />
              Technology • Innovation • Learning
            </div>

            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Building technology
              <span className="block text-cyan-400">
                for what comes next.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
              IMMIQ is a technology company focused on training, software
              products, emerging technologies and digital transformation.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="/training"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Explore Training
                <ArrowRight size={18} />
              </a>

              <a
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-3.5 font-semibold text-white transition hover:bg-white/5"
              >
                Discover IMMIQ
              </a>
            </div>
          </div>

          <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
            <div className="bg-slate-950 p-7">
              <p className="text-3xl font-semibold">04</p>
              <p className="mt-2 text-sm text-slate-400">
                Core technology pillars
              </p>
            </div>

            <div className="bg-slate-950 p-7">
              <p className="text-3xl font-semibold">40+</p>
              <p className="mt-2 text-sm text-slate-400">
                Technologies & capabilities
              </p>
            </div>

            <div className="bg-slate-950 p-7">
              <p className="text-3xl font-semibold">∞</p>
              <p className="mt-2 text-sm text-slate-400">
                Possibilities to create
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-y border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              What we do
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Technology across learning, products and innovation.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              IMMIQ brings together technology education, product engineering,
              emerging technology research and digital services under one
              platform.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <a
                  key={pillar.title}
                  href={pillar.href}
                  className="group rounded-2xl border border-white/10 bg-white/[0.025] p-8 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                      <Icon size={22} className="text-cyan-400" />
                    </div>

                    <ArrowRight
                      size={20}
                      className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                    />
                  </div>

                  <h3 className="mt-7 text-2xl font-semibold">
                    {pillar.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-400">
                    {pillar.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Our vision
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Technology should create possibilities, not limitations.
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-slate-400">
              We believe technology becomes meaningful when people understand
              it, build with it and use it to solve real problems. IMMIQ
              connects learning, innovation and engineering to help individuals
              and organizations move forward.
            </p>

            <a
              href="/about"
              className="mt-8 inline-flex items-center gap-2 font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Learn more about IMMIQ
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="border-y border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                <Brain size={22} className="text-cyan-400" />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Technology landscape
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                Exploring the technologies shaping tomorrow.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-400">
                From artificial intelligence to spatial computing, we
                continuously explore technologies that can create new
                opportunities.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {technologies.map((technology) => (
                <div
                  key={technology}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950 p-5"
                >
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="text-sm text-slate-300">
                    {technology}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Clients */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Trusted by organizations
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Our clients
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
                Organizations working with IMMIQ across technology, training
                and digital transformation.
              </p>
            </div>

            <a
              href="/clients"
              className="inline-flex items-center gap-2 font-semibold text-cyan-400 hover:text-cyan-300"
            >
              View all clients
              <ArrowRight size={18} />
            </a>
          </div>

          {loading ? (
            <div className="mt-12 text-slate-500">
              Loading clients...
            </div>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {homeData.clients.map((client) => (
                <div
                  key={client._id}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition hover:border-cyan-400/30"
                >
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="mb-5 h-12 w-auto object-contain"
                    />
                  ) : (
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-lg font-bold text-cyan-400">
                      {client.name.charAt(0)}
                    </div>
                  )}

                  <p className="text-xs uppercase tracking-wider text-cyan-400">
                    {client.industry}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    {client.name}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                    {client.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Achievements */}
      <section className="border-y border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Milestones
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              What we have achieved
            </h2>
          </div>

          {loading ? (
            <div className="mt-12 text-slate-500">
              Loading achievements...
            </div>
          ) : (
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {homeData.achievements.map((achievement) => (
                <div
                  key={achievement._id}
                  className="rounded-2xl border border-white/10 bg-slate-950 p-7"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-cyan-400">
                      {achievement.category}
                    </span>

                    <span className="text-sm text-slate-500">
                      {achievement.date}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold">
                    {achievement.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          <a
            href="/achievements"
            className="mt-10 inline-flex items-center gap-2 font-semibold text-cyan-400 hover:text-cyan-300"
          >
            View all achievements
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* Latest Blog */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                From the lab
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Latest insights
              </h2>
            </div>

            <a
              href="/blog"
              className="inline-flex items-center gap-2 font-semibold text-cyan-400 hover:text-cyan-300"
            >
              View all articles
              <ArrowRight size={18} />
            </a>
          </div>

          {loading ? (
            <div className="mt-12 text-slate-500">
              Loading articles...
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {homeData.blogs.map((blog) => (
                <a
                  key={blog._id}
                  href={`/blog/${blog.slug}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition hover:-translate-y-1 hover:border-cyan-400/30"
                >
                  <p className="text-xs uppercase tracking-wider text-cyan-400">
                    {blog.category}
                  </p>

                  <h3 className="mt-4 text-xl font-semibold transition group-hover:text-cyan-400">
                    {blog.title}
                  </h3>

                  <p className="mt-4 line-clamp-3 leading-7 text-slate-400">
                    {blog.excerpt}
                  </p>

                  <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                    <span>{blog.author}</span>
                    <span>{blog.readTime} min read</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-500/5" />

        <div className="relative mx-auto max-w-5xl px-6 py-28 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Let's build
          </p>

          <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Have an idea, a challenge or a technology goal?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Whether you want to learn, build a product or explore emerging
            technology, let's start a conversation.
          </p>

          <a
            href="/contact"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Talk to IMMIQ
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
      
    </div>
  );
}