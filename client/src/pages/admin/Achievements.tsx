import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
}

interface AchievementForm {
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  featured: boolean;
}

const emptyForm: AchievementForm = {
  title: "",
  description: "",
  date: "",
  category: "Milestone",
  image: "",
  featured: false,
};

const categories = [
  "Milestone",
  "Award",
  "Media",
  "Partnership",
  "Certification",
];

export default function Achievements() {
  const navigate = useNavigate();

  const [achievements, setAchievements] = useState<
    Achievement[]
  >([]);

  const [form, setForm] =
    useState<AchievementForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem(
    "immiq_admin_token"
  );

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/achievements`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load achievements"
        );
      }

      setAchievements(data.achievements);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load achievements"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const url = editingId
        ? `${API_URL}/admin/achievements/${editingId}`
        : `${API_URL}/admin/achievements`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to save achievement"
        );
      }

      setForm(emptyForm);
      setEditingId(null);

      await fetchAchievements();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save achievement"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (
    achievement: Achievement
  ) => {
    setEditingId(achievement._id);

    setForm({
      title: achievement.title,
      description: achievement.description,
      date: achievement.date,
      category: achievement.category,
      image: achievement.image || "",
      featured: achievement.featured,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this achievement?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/admin/achievements/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete achievement"
        );
      }

      await fetchAchievements();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete achievement"
      );
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-cyan-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              IMMIQ ADMIN
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Achievements
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Manage milestones, awards, media features,
              partnerships and certifications.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Total
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {achievements.length}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <section className="mb-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/10">
          <div className="border-b border-white/10 bg-white/[0.02] px-5 py-5 sm:px-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  {editingId
                    ? "Update"
                    : "Create"}
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {editingId
                    ? "Edit Achievement"
                    : "Add Achievement"}
                </h2>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-slate-400 transition hover:text-white"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Cancel
                  </span>
                </button>
              )}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 p-5 sm:p-7 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Title
              </label>

              <input
                required
                value={form.title}
                onChange={(event) =>
                  setForm({
                    ...form,
                    title: event.target.value,
                  })
                }
                placeholder="Achievement title"
                className="h-12 w-full rounded-xl border border-white/10 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Date
              </label>

              <input
                required
                value={form.date}
                onChange={(event) =>
                  setForm({
                    ...form,
                    date: event.target.value,
                  })
                }
                placeholder="Sep 2026"
                className="h-12 w-full rounded-xl border border-white/10 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Category
              </label>

              <select
                value={form.category}
                onChange={(event) =>
                  setForm({
                    ...form,
                    category: event.target.value,
                  })
                }
                className="h-12 w-full rounded-xl border border-white/10 bg-slate-900 px-4 text-sm text-white outline-none focus:border-cyan-400/50"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Image URL
              </label>

              <input
                type="url"
                value={form.image}
                onChange={(event) =>
                  setForm({
                    ...form,
                    image: event.target.value,
                  })
                }
                placeholder="https://..."
                className="h-12 w-full rounded-xl border border-white/10 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Description
              </label>

              <textarea
                required
                value={form.description}
                onChange={(event) =>
                  setForm({
                    ...form,
                    description:
                      event.target.value,
                  })
                }
                placeholder="Describe this achievement..."
                className="min-h-32 w-full resize-y rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            <div className="flex items-center">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      featured:
                        event.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-cyan-400"
                />

                <span>
                  Feature this achievement
                </span>
              </label>
            </div>

            <div className="flex justify-start md:justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Plus className="h-4 w-4" />

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Achievement"
                    : "Add Achievement"}
              </button>
            </div>
          </form>
        </section>

        {/* List */}
        <section>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              Content
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              All Achievements
            </h2>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
              <p className="text-sm text-slate-500">
                Loading achievements...
              </p>
            </div>
          ) : achievements.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
              <p className="text-sm text-slate-500">
                No achievements found.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {achievements.map((achievement) => (
                <article
                  key={achievement._id}
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.045] sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/5 sm:flex">
                        <Star className="h-5 w-5 text-cyan-400" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold sm:text-lg">
                            {achievement.title}
                          </h3>

                          {achievement.featured && (
                            <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-300">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>
                            {achievement.date}
                          </span>

                          <span>•</span>

                          <span className="text-cyan-400/80">
                            {achievement.category}
                          </span>
                        </div>

                        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
                          {achievement.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2 border-t border-white/10 pt-4 lg:border-0 lg:pt-0">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(achievement)
                        }
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300 sm:flex-none"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            achievement._id
                          )
                        }
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/5 px-4 text-sm text-red-300 transition hover:bg-red-400/10 sm:flex-none"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}