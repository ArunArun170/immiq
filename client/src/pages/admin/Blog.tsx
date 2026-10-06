import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Edit3,
  FileText,
  Loader2,
  Plus,
  Save,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

interface BlogForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  featured: boolean;
  published: boolean;
  image: string;
  tags: string;
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

const emptyForm: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  author: "IMMIQ Team",
  readTime: "5",
  featured: false,
  published: false,
  image: "",
  tags: "",
};

export default function Blog() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<BlogForm>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem(
    "immiq_admin_token"
  );

  /* =========================
     FETCH POSTS
  ========================= */

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/blog`,
        {
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch blog posts"
        );
      }

      setPosts(data.posts || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* =========================
     FORM HELPERS
  ========================= */

  const updateField = (
    field: keyof BlogForm,
    value: string | boolean
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const startEdit = (post: BlogPost) => {
    setEditingId(post._id);

    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author,
      readTime: String(post.readTime || 5),
      featured: post.featured,
      published: post.published,
      image: post.image || "",
      tags: (post.tags || []).join(", "),
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     SAVE POST
  ========================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        slug:
          form.slug.trim() ||
          generateSlug(form.title),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        category: form.category.trim(),
        author: form.author.trim(),
        readTime: Number(form.readTime) || 5,
        featured: form.featured,
        published: form.published,
        image: form.image.trim(),
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const url = editingId
        ? `${API_URL}/admin/blog/${editingId}`
        : `${API_URL}/admin/blog`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save blog post"
        );
      }

      await fetchPosts();

      resetForm();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save blog post"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     DELETE POST
  ========================= */

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog post?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(
        `${API_URL}/admin/blog/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete blog post"
        );
      }

      setPosts((previous) =>
        previous.filter((post) => post._id !== id)
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete blog post"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* HEADER */}

        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 transition hover:text-cyan-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Admin Dashboard
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                  <FileText className="h-6 w-6 text-cyan-400" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                    IMMIQ CMS
                  </p>

                  <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                    Blog
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
                Create, edit and publish technology-focused
                content for the IMMIQ website.
              </p>
            </div>

            <button
              type="button"
              onClick={startCreate}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              <Plus className="h-5 w-5" />
              New Blog Post
            </button>
          </div>
        </header>

        {/* FORM */}

        {showForm && (
          <section className="mt-6 rounded-3xl border border-cyan-400/20 bg-white/[0.03] p-5 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  {editingId ? "Edit Post" : "Create Post"}
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {editingId
                    ? "Update Blog Article"
                    : "Create New Article"}
                </h2>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid gap-5 lg:grid-cols-2">
                {/* TITLE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Title
                  </label>

                  <input
                    required
                    value={form.title}
                    onChange={(event) => {
                      const title = event.target.value;

                      updateField("title", title);

                      if (!editingId) {
                        updateField(
                          "slug",
                          generateSlug(title)
                        );
                      }
                    }}
                    placeholder="The Future of AI in Business"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/50"
                  />
                </div>

                {/* SLUG */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Slug
                  </label>

                  <input
                    required
                    value={form.slug}
                    onChange={(event) =>
                      updateField(
                        "slug",
                        event.target.value
                      )
                    }
                    placeholder="future-of-ai-in-business"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/50"
                  />
                </div>

                {/* CATEGORY */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Category
                  </label>

                  <input
                    required
                    value={form.category}
                    onChange={(event) =>
                      updateField(
                        "category",
                        event.target.value
                      )
                    }
                    placeholder="Artificial Intelligence"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/50"
                  />
                </div>

                {/* AUTHOR */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Author
                  </label>

                  <input
                    required
                    value={form.author}
                    onChange={(event) =>
                      updateField(
                        "author",
                        event.target.value
                      )
                    }
                    placeholder="IMMIQ Team"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/50"
                  />
                </div>

                {/* READ TIME */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Read Time (minutes)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={form.readTime}
                    onChange={(event) =>
                      updateField(
                        "readTime",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                  />
                </div>

                {/* IMAGE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Image URL
                  </label>

                  <input
                    value={form.image}
                    onChange={(event) =>
                      updateField(
                        "image",
                        event.target.value
                      )
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/50"
                  />
                </div>
              </div>

              {/* EXCERPT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Excerpt
                </label>

                <textarea
                  required
                  rows={3}
                  value={form.excerpt}
                  onChange={(event) =>
                    updateField(
                      "excerpt",
                      event.target.value
                    )
                  }
                  placeholder="Short description shown on blog cards..."
                  className="w-full resize-y rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-700 focus:border-cyan-400/50"
                />
              </div>

              {/* CONTENT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Content
                </label>

                <textarea
                  required
                  rows={12}
                  value={form.content}
                  onChange={(event) =>
                    updateField(
                      "content",
                      event.target.value
                    )
                  }
                  placeholder="Write the complete article content..."
                  className="w-full resize-y rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-7 outline-none transition placeholder:text-slate-700 focus:border-cyan-400/50"
                />
              </div>

              {/* TAGS */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Tags
                </label>

                <input
                  value={form.tags}
                  onChange={(event) =>
                    updateField(
                      "tags",
                      event.target.value
                    )
                  }
                  placeholder="AI, Technology, SaaS, Innovation"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/50"
                />

                <p className="mt-2 text-xs text-slate-600">
                  Separate multiple tags with commas.
                </p>
              </div>

              {/* OPTIONS */}

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900/70 p-4 transition hover:border-cyan-400/30">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      updateField(
                        "featured",
                        event.target.checked
                      )
                    }
                    className="h-4 w-4 accent-cyan-400"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Featured Post
                    </p>

                    <p className="text-xs text-slate-600">
                      Highlight this article.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900/70 p-4 transition hover:border-cyan-400/30">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(event) =>
                      updateField(
                        "published",
                        event.target.checked
                      )
                    }
                    className="h-4 w-4 accent-cyan-400"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Published
                    </p>

                    <p className="text-xs text-slate-600">
                      Make this article public.
                    </p>
                  </div>
                </label>
              </div>

              {/* ACTIONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="min-h-11 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-slate-400 transition hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Post"
                      : "Create Post"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* POSTS */}

        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                Content
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                All Blog Posts
              </h2>
            </div>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400">
              {posts.length} Posts
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-60 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
              <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
              <FileText className="mx-auto h-10 w-10 text-slate-700" />

              <h3 className="mt-4 text-lg font-semibold">
                No blog posts yet
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Create your first IMMIQ article.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:border-cyan-400/20"
                >
                  <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center">
                    {/* IMAGE */}

                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-40 w-full rounded-2xl object-cover lg:h-28 lg:w-44"
                      />
                    ) : (
                      <div className="flex h-40 w-full shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 lg:h-28 lg:w-44">
                        <FileText className="h-8 w-8 text-slate-700" />
                      </div>
                    )}

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-300">
                          {post.category}
                        </span>

                        {post.published && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">
                            <Check className="h-3 w-3" />
                            Published
                          </span>
                        )}

                        {!post.published && (
                          <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-300">
                            Draft
                          </span>
                        )}

                        {post.featured && (
                          <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 line-clamp-2 text-lg font-bold text-white sm:text-xl">
                        {post.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {post.excerpt}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                        <span>
                          By {post.author}
                        </span>

                        <span>
                          {post.readTime} min read
                        </span>

                        <span>
                          /{post.slug}
                        </span>
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex shrink-0 gap-2 lg:flex-col">
                      <button
                        type="button"
                        onClick={() => startEdit(post)}
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300 lg:flex-none"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={
                          deletingId === post._id
                        }
                        onClick={() =>
                          handleDelete(post._id)
                        }
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-400/5 px-4 text-xs font-semibold text-red-300 transition hover:bg-red-400/10 disabled:opacity-50 lg:flex-none"
                      >
                        {deletingId === post._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}

                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-700">
          IMMIQ Admin CMS
          <span className="mx-2">•</span>
          Curiosity First. Technology Next.
        </div>
      </div>
    </main>
  );
}