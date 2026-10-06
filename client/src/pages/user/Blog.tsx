import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Loader2,
  Search,
  Tag,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

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
  createdAt: string;
  updatedAt: string;
}

function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/public/blog`);

        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to fetch blog posts"
          );
        }

        setPosts(result.data || []);
      } catch (err) {
        console.error("Blog fetch error:", err);
        setError("Unable to load blog posts right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(posts.map((post) => post.category))
    );

    return ["All", ...uniqueCategories];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" ||
        post.category === activeCategory;

      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );

      return matchesCategory && matchesSearch;
    });
  }, [posts, search, activeCategory]);

  const featuredPost = posts.find((post) => post.featured);

  const formatDate = (date?: string) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_35%)]" />

        <div className="absolute -right-32 top-10 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl sm:h-96 sm:w-96" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 backdrop-blur sm:text-sm">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              IMMIQ Insights
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Ideas worth
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                exploring.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              Explore ideas, practical insights, emerging technologies,
              AI, software development, learning, and the future of
              digital business.
            </p>

            {!loading && !error && posts.length > 0 && (
              <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-2xl font-semibold sm:text-3xl">
                    {posts.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Articles
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-2xl font-semibold sm:text-3xl">
                    {categories.length - 1}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Topics
                  </p>
                </div>

                <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:col-span-1">
                  <p className="text-2xl font-semibold sm:text-3xl">
                    AI
                  </p>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Technology focus
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

        {/* Section Heading */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
            Knowledge
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Explore the latest thinking.
          </h2>
        </div>

        {/* Search */}
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search articles, topics, tags..."
              aria-label="Search blog articles"
              className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:bg-white/[0.07]"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {!loading && !error && search && (
            <p className="text-sm text-slate-500">
              {filteredPosts.length} result
              {filteredPosts.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Categories */}
        {!loading && !error && categories.length > 1 && (
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
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center text-slate-400">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
              </div>

              <p className="text-sm">
                Loading blog posts...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-7 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10">
                <BookOpen className="h-5 w-5 text-red-300" />
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

        {/* Featured Post */}
        {!loading &&
          !error &&
          activeCategory === "All" &&
          !search.trim() &&
          featuredPost && (
            <article className="mb-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
              <div className="grid lg:grid-cols-2">

                {/* Image */}
                <div className="relative min-h-[260px] overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-slate-900 sm:min-h-[320px] lg:min-h-[440px]">
                  {featuredPost.image ? (
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full min-h-[260px] items-center justify-center sm:min-h-[320px] lg:min-h-[440px]">
                      <BookOpen className="h-16 w-16 text-cyan-400/20 sm:h-20 sm:w-20" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                  <div className="absolute left-5 top-5 rounded-full border border-cyan-400/20 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-cyan-300 backdrop-blur sm:left-6 sm:top-6">
                    Featured
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">

                  <div className="mb-4 flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-300">
                      {featuredPost.category}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(
                        featuredPost.publishedAt ||
                          featuredPost.createdAt
                      )}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {featuredPost.readTime} min read
                    </span>
                  </div>

                  <h2 className="text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">
                    {featuredPost.title}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                    {featuredPost.excerpt}
                  </p>

                  <div className="mt-7">
                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
                    >
                      Read article
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredPosts.length === 0 && (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="text-center text-slate-400">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <BookOpen className="h-6 w-6" />
                </div>

                <p className="mt-5 text-sm">
                  No blog posts found.
                </p>

                {(search || activeCategory !== "All") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}

        {/* Blog Grid */}
        {!loading &&
          !error &&
          filteredPosts.length > 0 && (
            <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <article
                  key={post._id}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.05]"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-slate-900 sm:h-56">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-14 w-14 text-cyan-400/20" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

                    {post.featured && (
                      <span className="absolute left-4 top-4 rounded-full border border-cyan-400/20 bg-slate-950/70 px-3 py-1.5 text-xs text-cyan-300 backdrop-blur">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="flex h-full flex-col p-6">

                    {/* Meta */}
                    <div className="mb-4 flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-400">
                        {post.category}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime} min
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold leading-snug text-white">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-xs text-slate-500"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-6">
                      <div className="flex items-end justify-between gap-4 border-t border-white/10 pt-5">

                        <div className="min-w-0">
                          <p className="truncate text-xs text-slate-500">
                            By {post.author}
                          </p>

                          <p className="mt-1 text-xs text-slate-600">
                            {formatDate(
                              post.publishedAt ||
                                post.createdAt
                            )}
                          </p>
                        </div>

                        <Link
                          to={`/blog/${post.slug}`}
                          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
                        >
                          Read
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>

      {/* Bottom CTA */}
      {!loading && !error && posts.length > 0 && (
        <section className="border-t border-white/10 bg-slate-900/50">
          <div className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-6 sm:py-24 lg:px-8">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Keep exploring
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Stay curious. Keep learning.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
              Technology keeps moving. Follow IMMIQ as we explore
              ideas, products, emerging technologies and practical
              ways to build with them.
            </p>

            <Link
              to="/contact"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Talk to IMMIQ
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

export default Blog;