import {
  useEffect,
  useMemo,
  useState,
} from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

interface MediaItem {
  _id: string;
  title: string;
  url: string;
  type:
    | "image"
    | "video"
    | "document"
    | "other";
  alt: string;
  description: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
}

const emptyForm = {
  title: "",
  url: "",
  type: "image",
  alt: "",
  description: "",
  featured: false,
  active: true,
};

export default function Media() {
  const [media, setMedia] =
    useState<MediaItem[]>([]);

  const [form, setForm] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const token =
    localStorage.getItem(
      "immiq_admin_token"
    );

  const headers = {
    "Content-Type":
      "application/json",
    Authorization: `Bearer ${token || ""}`,
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/media`,
        {
          headers,
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch media"
        );
      }

      setMedia(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch media"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const filteredMedia =
    useMemo(() => {
      const value =
        search
          .toLowerCase()
          .trim();

      if (!value) {
        return media;
      }

      return media.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(value) ||
          item.type
            .toLowerCase()
            .includes(value) ||
          item.alt
            .toLowerCase()
            .includes(value)
      );
    }, [media, search]);

  const handleChange = (
    field: string,
    value: string | boolean
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError(
        "Media title is required"
      );
      return;
    }

    if (!form.url.trim()) {
      setError(
        "Media URL is required"
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const url = editingId
        ? `${API_URL}/admin/media/${editingId}`
        : `${API_URL}/admin/media`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(
        url,
        {
          method,
          headers,
          body: JSON.stringify(
            form
          ),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to save media"
        );
      }

      resetForm();
      await fetchMedia();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save media"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (
    item: MediaItem
  ) => {
    setEditingId(item._id);

    setForm({
      title: item.title,
      url: item.url,
      type: item.type,
      alt: item.alt,
      description:
        item.description,
      featured: item.featured,
      active: item.active,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Delete this media item?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/admin/media/${id}`,
          {
            method: "DELETE",
            headers,
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete media"
        );
      }

      await fetchMedia();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete media"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
              Content Management
            </p>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Media Library
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Manage images, videos,
              documents and other
              media used across the
              IMMIQ website.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Total Media
            </p>

            <p className="mt-1 text-2xl font-black">
              {media.length}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Form */}

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-bold">
              {editingId
                ? "Edit Media"
                : "Add Media"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a hosted media URL
              and manage its metadata.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 lg:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Title
              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  handleChange(
                    "title",
                    e.target.value
                  )
                }
                placeholder="Hero Banner"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Media Type
              </label>

              <select
                value={form.type}
                onChange={(e) =>
                  handleChange(
                    "type",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="image">
                  Image
                </option>
                <option value="video">
                  Video
                </option>
                <option value="document">
                  Document
                </option>
                <option value="other">
                  Other
                </option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Media URL
              </label>

              <input
                value={form.url}
                onChange={(e) =>
                  handleChange(
                    "url",
                    e.target.value
                  )
                }
                placeholder="https://..."
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Alt Text
              </label>

              <input
                value={form.alt}
                onChange={(e) =>
                  handleChange(
                    "alt",
                    e.target.value
                  )
                }
                placeholder="IMMIQ technology lab"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Description
              </label>

              <input
                value={form.description}
                onChange={(e) =>
                  handleChange(
                    "description",
                    e.target.value
                  )
                }
                placeholder="Short description"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex flex-wrap gap-6 lg:col-span-2">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    handleChange(
                      "featured",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4"
                />
                Featured
              </label>

              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    handleChange(
                      "active",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4"
                />
                Active
              </label>
            </div>

            <div className="flex flex-wrap gap-3 lg:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Media"
                  : "Add Media"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/10 px-6 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search */}

        <div className="mb-6">
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search media..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm outline-none focus:border-cyan-400"
          />
        </div>

        {/* Media Grid */}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center text-slate-400">
            Loading media...
          </div>
        ) : filteredMedia.length ===
          0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">
            <p className="text-lg font-bold">
              No media found
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Add your first media item
              above.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredMedia.map(
              (item) => (
                <article
                  key={item._id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-cyan-400/30"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-900">
                    {item.type ===
                    "image" ? (
                      <img
                        src={item.url}
                        alt={item.alt}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        {item.type ===
                        "video"
                          ? "▶"
                          : item.type ===
                            "document"
                          ? "📄"
                          : "◈"}
                      </div>
                    )}

                    <div className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                      {item.type}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold">
                        {item.title}
                      </h3>

                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                          item.active
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-red-400/10 text-red-300"
                        }`}
                      >
                        {item.active
                          ? "ACTIVE"
                          : "OFF"}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                      {item.description ||
                        item.url}
                    </p>

                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() =>
                          handleEdit(
                            item
                          )
                        }
                        className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold transition hover:bg-white/10"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            item._id
                          )
                        }
                        className="flex-1 rounded-xl bg-red-400/10 px-4 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-400/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}