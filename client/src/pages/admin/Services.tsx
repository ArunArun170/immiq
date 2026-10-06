import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Edit3,
  Loader2,
  Plus,
  Save,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  features: string[];
  featured: boolean;
  active: boolean;
}

interface ServiceForm {
  title: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  features: string;
  featured: boolean;
  active: boolean;
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

const emptyForm: ServiceForm = {
  title: "",
  slug: "",
  description: "",
  category: "",
  icon: "Code2",
  features: "",
  featured: false,
  active: true,
};

export default function Services() {
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>(
    []
  );

  const [form, setForm] =
    useState<ServiceForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const token = localStorage.getItem(
    "immiq_admin_token"
  );

  const fetchServices = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/services`,
        {
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch services"
        );
      }

      setServices(data.services || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const updateField = (
    field: keyof ServiceForm,
    value: string | boolean
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

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

  const startEdit = (service: Service) => {
    setEditingId(service._id);

    setForm({
      title: service.title,
      slug: service.slug,
      description: service.description,
      category: service.category,
      icon: service.icon,
      features: service.features.join(", "),
      featured: service.featured,
      active: service.active,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
        description: form.description.trim(),
        category: form.category.trim(),
        icon: form.icon.trim() || "Code2",
        features: form.features
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        featured: form.featured,
        active: form.active,
      };

      const url = editingId
        ? `${API_URL}/admin/services/${editingId}`
        : `${API_URL}/admin/services`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save service"
        );
      }

      await fetchServices();
      resetForm();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save service"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this service?"
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(
        `${API_URL}/admin/services/${id}`,
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
          data.message || "Failed to delete service"
        );
      }

      setServices((previous) =>
        previous.filter(
          (service) => service._id !== id
        )
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete service"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* HEADER */}

        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 hover:text-cyan-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Admin Dashboard
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                  <Settings className="h-6 w-6 text-cyan-400" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                    IMMIQ CMS
                  </p>

                  <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                    Services
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
                Manage the digital services displayed across
                the IMMIQ website.
              </p>
            </div>

            <button
              type="button"
              onClick={startCreate}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-bold text-slate-950 hover:bg-cyan-300"
            >
              <Plus className="h-5 w-5" />
              New Service
            </button>
          </div>
        </header>

        {/* FORM */}

        {showForm && (
          <section className="mt-6 rounded-3xl border border-cyan-400/20 bg-white/[0.03] p-5 sm:p-7">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  {editingId
                    ? "Edit Service"
                    : "Create Service"}
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {editingId
                    ? "Update Service"
                    : "Create New Service"}
                </h2>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid gap-5 lg:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Service Title
                  </label>

                  <input
                    required
                    value={form.title}
                    onChange={(event) => {
                      const value =
                        event.target.value;

                      updateField("title", value);

                      if (!editingId) {
                        updateField(
                          "slug",
                          generateSlug(value)
                        );
                      }
                    }}
                    placeholder="Web & App Development"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                  />
                </div>

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
                    placeholder="web-app-development"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                  />
                </div>

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
                    placeholder="Digital Services"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Icon
                  </label>

                  <input
                    value={form.icon}
                    onChange={(event) =>
                      updateField(
                        "icon",
                        event.target.value
                      )
                    }
                    placeholder="Code2"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>

                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Describe this service..."
                  className="w-full resize-y rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Features
                </label>

                <input
                  value={form.features}
                  onChange={(event) =>
                    updateField(
                      "features",
                      event.target.value
                    )
                  }
                  placeholder="Responsive UI, API Integration, Cloud Deployment"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                />

                <p className="mt-2 text-xs text-slate-600">
                  Separate features with commas.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900/70 p-4">
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
                      Featured Service
                    </p>

                    <p className="text-xs text-slate-600">
                      Highlight on the website.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900/70 p-4">
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

                    <p className="text-xs text-slate-600">
                      Show this service publicly.
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="min-h-11 rounded-xl border border-white/10 bg-white/5 px-5 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Service"
                      : "Create Service"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* SERVICES */}

        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                CMS
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                All Services
              </h2>
            </div>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400">
              {services.length} Services
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-60 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
              <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center">
              <Settings className="mx-auto h-10 w-10 text-slate-700" />

              <h3 className="mt-4 text-lg font-semibold">
                No services yet
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Create your first IMMIQ service.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service._id}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/20 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                      <Settings className="h-5 w-5 text-cyan-400" />
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      {service.featured && (
                        <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-300">
                          Featured
                        </span>
                      )}

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          service.active
                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                            : "border-red-400/20 bg-red-400/10 text-red-300"
                        }`}
                      >
                        {service.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400">
                    {service.category}
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    {service.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  {service.features.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {service.features
                        .slice(0, 3)
                        .map((feature) => (
                          <div
                            key={feature}
                            className="flex items-center gap-2 text-xs text-slate-500"
                          >
                            <Check className="h-3.5 w-3.5 text-cyan-400" />
                            {feature}
                          </div>
                        ))}
                    </div>
                  )}

                  <div className="mt-6 flex gap-2 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        startEdit(service)
                      }
                      className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-slate-300 hover:border-cyan-400/30 hover:text-cyan-300"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={
                        deletingId === service._id
                      }
                      onClick={() =>
                        handleDelete(service._id)
                      }
                      className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-400/5 text-xs font-semibold text-red-300 hover:bg-red-400/10 disabled:opacity-50"
                    >
                      {deletingId === service._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete
                    </button>
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