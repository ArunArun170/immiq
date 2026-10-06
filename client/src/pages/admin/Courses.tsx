import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  BookOpen,
  Edit3,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

type Course = {
  _id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  technology: string;
  audience: string;
  level:
    | "Beginner"
    | "Intermediate"
    | "Advanced";
  mode:
    | "Online"
    | "Offline"
    | "Hybrid";
  duration: string;
  fee: number;
  thumbnail: string;
  featured: boolean;
  active: boolean;
  order: number;
};

type CourseForm = {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  technology: string;
  audience: string;
  level:
    | "Beginner"
    | "Intermediate"
    | "Advanced";
  mode:
    | "Online"
    | "Offline"
    | "Hybrid";
  duration: string;
  fee: string;
  thumbnail: string;
  featured: boolean;
  active: boolean;
  order: string;
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

const emptyForm: CourseForm = {
  title: "",
  slug: "",
  tagline: "",
  description: "",
  technology: "",
  audience: "",
  level: "Beginner",
  mode: "Online",
  duration: "",
  fee: "0",
  thumbnail: "",
  featured: false,
  active: true,
  order: "0",
};

const makeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(
    []
  );

  const [form, setForm] =
    useState<CourseForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const token =
    localStorage.getItem(
      "immiq_admin_token"
    );

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token || ""}`,
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/courses`,
        {
          headers: {
            Authorization: `Bearer ${
              token || ""
            }`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch courses"
        );
      }

      setCourses(data.courses || []);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to fetch courses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const updateField = (
    field: keyof CourseForm,
    value: string | boolean
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleTitleChange = (
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      title: value,
      slug: editingId
        ? previous.slug
        : makeSlug(value),
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (course: Course) => {
    setEditingId(course._id);

    setForm({
      title: course.title,
      slug: course.slug,
      tagline: course.tagline || "",
      description:
        course.description || "",
      technology:
        course.technology || "",
      audience:
        course.audience || "",
      level:
        course.level || "Beginner",
      mode:
        course.mode || "Online",
      duration:
        course.duration || "",
      fee: String(course.fee ?? 0),
      thumbnail:
        course.thumbnail || "",
      featured:
        Boolean(course.featured),
      active:
        Boolean(course.active),
      order: String(course.order ?? 0),
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.slug.trim() ||
      !form.description.trim() ||
      !form.technology.trim()
    ) {
      alert(
        "Title, slug, description and technology are required."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        fee: Number(form.fee) || 0,
        order: Number(form.order) || 0,
      };

      const url = editingId
        ? `${API_URL}/admin/courses/${editingId}`
        : `${API_URL}/admin/courses`;

      const response = await fetch(url, {
        method: editingId
          ? "PUT"
          : "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save course"
        );
      }

      alert(
        editingId
          ? "Course updated successfully."
          : "Course created successfully."
      );

      resetForm();
      await fetchCourses();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save course"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(
        `${API_URL}/admin/courses/${id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete course"
        );
      }

      setCourses((previous) =>
        previous.filter(
          (course) =>
            course._id !== id
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete course"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Phase 2
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Course Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Create and manage IMMIQ training
              programs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setShowForm(true);
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-bold text-slate-950 hover:bg-cyan-300"
          >
            <Plus className="h-4 w-4" />
            Add Course
          </button>
        </header>

        {showForm && (
          <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-400">
                  {editingId
                    ? "Edit Course"
                    : "New Course"}
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {editingId
                    ? "Update training program"
                    : "Create training program"}
                </h2>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 p-2 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Course Title *
                  </label>

                  <input
                    value={form.title}
                    onChange={(event) =>
                      handleTitleChange(
                        event.target.value
                      )
                    }
                    placeholder="Full Stack Development"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Slug *
                  </label>

                  <input
                    value={form.slug}
                    onChange={(event) =>
                      updateField(
                        "slug",
                        event.target.value
                      )
                    }
                    placeholder="full-stack-development"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Tagline
                  </label>

                  <input
                    value={form.tagline}
                    onChange={(event) =>
                      updateField(
                        "tagline",
                        event.target.value
                      )
                    }
                    placeholder="Build modern production-ready applications"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Technology *
                  </label>

                  <input
                    value={form.technology}
                    onChange={(event) =>
                      updateField(
                        "technology",
                        event.target.value
                      )
                    }
                    placeholder="MERN Stack"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Audience
                  </label>

                  <input
                    value={form.audience}
                    onChange={(event) =>
                      updateField(
                        "audience",
                        event.target.value
                      )
                    }
                    placeholder="Students, Graduates, Professionals"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Duration
                  </label>

                  <input
                    value={form.duration}
                    onChange={(event) =>
                      updateField(
                        "duration",
                        event.target.value
                      )
                    }
                    placeholder="12 Weeks"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Level
                  </label>

                  <select
                    value={form.level}
                    onChange={(event) =>
                      updateField(
                        "level",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none"
                  >
                    <option>
                      Beginner
                    </option>
                    <option>
                      Intermediate
                    </option>
                    <option>
                      Advanced
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Mode
                  </label>

                  <select
                    value={form.mode}
                    onChange={(event) =>
                      updateField(
                        "mode",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none"
                  >
                    <option>Online</option>
                    <option>Offline</option>
                    <option>Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Fee
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.fee}
                    onChange={(event) =>
                      updateField(
                        "fee",
                        event.target.value
                      )
                    }
                    placeholder="25000"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Display Order
                  </label>

                  <input
                    type="number"
                    value={form.order}
                    onChange={(event) =>
                      updateField(
                        "order",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Thumbnail URL
                </label>

                <input
                  value={form.thumbnail}
                  onChange={(event) =>
                    updateField(
                      "thumbnail",
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description *
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value
                    )
                  }
                  rows={5}
                  placeholder="Describe what learners will learn and build..."
                  className="w-full resize-y rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 outline-none focus:border-cyan-400/50"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/70 p-4">
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
                      Featured Course
                    </p>

                    <p className="text-xs text-slate-500">
                      Highlight this course.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) =>
                      updateField(
                        "active",
                        event.target.checked
                      )
                    }
                    className="h-4 w-4 accent-cyan-400"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Active
                    </p>

                    <p className="text-xs text-slate-500">
                      Show this course publicly.
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Course"
                      : "Create Course"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                CMS
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                All Courses
              </h2>
            </div>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400">
              {courses.length} Courses
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-60 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
              <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
            </div>
          ) : courses.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-slate-700" />

              <h3 className="mt-4 text-lg font-semibold">
                No courses yet
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Create your first training program.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <article
                  key={course._id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-cyan-400/20"
                >
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-cyan-400/[0.05]">
                      <BookOpen className="h-12 w-12 text-cyan-400/40" />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                        {course.level}
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {course.mode}
                      </span>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          course.active
                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                            : "border-red-400/20 bg-red-400/10 text-red-300"
                        }`}
                      >
                        {course.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold">
                      {course.title}
                    </h3>

                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                      {course.technology}
                    </p>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                      {course.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                      {course.duration && (
                        <span>
                          {course.duration}
                        </span>
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

                    <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/course-content/${course._id}`)
                        }
                        className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-300 sm:w-auto sm:flex-1"
                      >
                        <BookOpen className="h-4 w-4" />
                        Manage Content
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(course)
                        }
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-slate-300 hover:border-cyan-400/30 hover:text-cyan-300"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={
                          deletingId ===
                          course._id
                        }
                        onClick={() =>
                          handleDelete(
                            course._id
                          )
                        }
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-400/5 text-xs font-semibold text-red-300 hover:bg-red-400/10 disabled:opacity-50"
                      >
                        {deletingId ===
                        course._id ? (
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
          IMMIQ Course Management
          <span className="mx-2">•</span>
          Phase 2 Learning Platform
        </div>
      </div>
    </main>
  );
}