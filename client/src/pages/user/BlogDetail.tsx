import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Loader2,
  Tag,
  User,
} from "lucide-react";

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

function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError("Blog article not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/public/blog/${slug}`
        );

        if (!response.ok) {
          throw new Error("Blog post not found");
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error(
            result.message || "Blog post not found"
          );
        }

        setPost(result.data);
      } catch (err) {
        console.error("Blog detail fetch error:", err);
        setError("Unable to load this article right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (date?: string) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-950 px-5 text-white">
        <div className="flex flex-col items-center gap-4 text-center text-slate-400">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
          </div>

          <p className="text-sm">Loading article...</p>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-950 px-5 text-white">
        <div className="w-full max-w-md text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Tag className="h-6 w-6 text-cyan-400" />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Article not found
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
            {error ||
              "The article you're looking for doesn't exist."}
          </p>

          <Link
            to="/blog"
            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_35%)]" />

        <div className="absolute -right-24 top-20 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl sm:h-96 sm:w-96" />

        <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">

          {/* Back */}
          <Link
            to="/blog"
            className="mb-8 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white sm:mb-10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">

            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-cyan-300">
              {post.category}
            </span>

            {post.featured && (
              <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1.5 text-purple-300">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            {post.excerpt}
          </p>

          {/* Author / Date / Read time */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-slate-500 sm:text-sm">

            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4 text-cyan-400" />
              {post.author}
            </span>

            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-cyan-400" />
              {formatDate(
                post.publishedAt || post.createdAt
              )}
            </span>

            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              {post.readTime} min read
            </span>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

        {/* Featured Image */}
        {post.image && (
          <div className="mb-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl sm:mb-14 sm:rounded-3xl">
            <img
              src={post.image}
              alt={post.title}
              loading="eager"
              className="max-h-[600px] w-full object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-none">

          {post.content.split("\n").map((paragraph, index) => {
            const trimmed = paragraph.trim();

            if (!trimmed) {
              return (
                <div
                  key={index}
                  className="h-3 sm:h-4"
                />
              );
            }

            if (trimmed.startsWith("## ")) {
              return (
                <h2
                  key={index}
                  className="mb-4 mt-10 text-2xl font-semibold leading-tight tracking-tight text-white sm:mt-12 sm:text-3xl"
                >
                  {trimmed.replace("## ", "")}
                </h2>
              );
            }

            if (trimmed.startsWith("# ")) {
              return (
                <h2
                  key={index}
                  className="mb-5 mt-10 text-3xl font-bold leading-tight tracking-tight text-white sm:mt-12 sm:text-4xl"
                >
                  {trimmed.replace("# ", "")}
                </h2>
              );
            }

            if (trimmed.startsWith("### ")) {
              return (
                <h3
                  key={index}
                  className="mb-3 mt-8 text-xl font-semibold leading-tight text-white sm:mt-10 sm:text-2xl"
                >
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }

            return (
              <p
                key={index}
                className="mb-5 text-[15px] leading-8 text-slate-300 sm:text-base sm:leading-8"
              >
                {trimmed}
              </p>
            );
          })}
        </article>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 border-t border-white/10 pt-8 sm:mt-16">

            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-300">
              <Tag className="h-4 w-4 text-cyan-400" />
              Topics
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 transition hover:border-cyan-400/20 hover:text-cyan-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Article Footer */}
        <div className="mt-12 border-t border-white/10 pt-8 sm:mt-16">

          <Link
            to="/blog"
            className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            Explore more articles
          </Link>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/10 bg-slate-900/50">

        <div className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-6 sm:py-24 lg:px-8">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
            Keep exploring
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Curious about what's next?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
            Explore more ideas from IMMIQ or start a conversation
            about technology, learning, software and innovation.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/blog"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
            >
              Browse all articles
            </Link>

            <Link
              to="/contact"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Talk to IMMIQ
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BlogDetail;