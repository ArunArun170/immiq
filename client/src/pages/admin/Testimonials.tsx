import { useEffect, useMemo, useState } from "react";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  photo: string;
  rating: number;
  featured: boolean;
  active: boolean;
  order: number;
}

interface FormState {
  name: string;
  role: string;
  company: string;
  content: string;
  photo: string;
  rating: string;
  featured: boolean;
  active: boolean;
  order: string;
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

const emptyForm: FormState = {
  name: "",
  role: "",
  company: "",
  content: "",
  photo: "",
  rating: "5",
  featured: false,
  active: true,
  order: "0",
};

export default function Testimonials() {
  const [items, setItems] =
    useState<Testimonial[]>([]);

  const [form, setForm] =
    useState<FormState>(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token =
    localStorage.getItem("immiq_admin_token") || "";

  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/testimonials`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setItems(data.testimonials || []);
      }
    } catch (error) {
      console.error(
        "Failed to fetch testimonials:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const filteredItems = useMemo(() => {
    const query = search
      .toLowerCase()
      .trim();

    if (!query) return items;

    return items.filter(
      (item) =>
        item.name
          .toLowerCase()
          .includes(query) ||
        item.role
          .toLowerCase()
          .includes(query) ||
        item.company
          .toLowerCase()
          .includes(query) ||
        item.content
          .toLowerCase()
          .includes(query)
    );
  }, [items, search]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? (
              event.target as HTMLInputElement
            ).checked
          : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.role.trim() ||
      !form.company.trim() ||
      !form.content.trim()
    ) {
      alert(
        "Name, role, company and content are required."
      );

      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        company: form.company.trim(),
        content: form.content.trim(),
        photo: form.photo.trim(),
        rating: Number(form.rating),
        featured: form.featured,
        active: form.active,
        order: Number(form.order) || 0,
      };

      const url = editingId
        ? `${API_URL}/admin/testimonials/${editingId}`
        : `${API_URL}/admin/testimonials`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to save testimonial"
        );
      }

      if (editingId) {
        setItems((current) =>
          current.map((item) =>
            item._id === editingId
              ? data.testimonial
              : item
          )
        );
      } else {
        setItems((current) => [
          data.testimonial,
          ...current,
        ]);
      }

      resetForm();
    } catch (error) {
      console.error(
        "Save testimonial error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save testimonial"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (
    item: Testimonial
  ) => {
    setEditingId(item._id);

    setForm({
      name: item.name,
      role: item.role,
      company: item.company,
      content: item.content,
      photo: item.photo || "",
      rating: String(item.rating),
      featured: item.featured,
      active: item.active,
      order: String(item.order ?? 0),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Delete this testimonial?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/admin/testimonials/${id}`,
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
            "Failed to delete testimonial"
        );
      }

      setItems((current) =>
        current.filter(
          (item) => item._id !== id
        )
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(
        "Delete testimonial error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete testimonial"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              CMS / Testimonials
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Testimonials
            </h1>

            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Manage client feedback displayed
              across the IMMIQ website.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchTestimonials}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10"
          >
            Refresh
          </button>
        </div>

        {/* FORM */}

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                {editingId
                  ? "Edit Testimonial"
                  : "Add Testimonial"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add authentic client feedback.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
              >
                Cancel
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 lg:grid-cols-2"
          >
            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Client name"
            />

            <Input
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="CEO / HR Head / CTO"
            />

            <Input
              label="Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company name"
            />

            <Input
              label="Photo URL"
              name="photo"
              value={form.photo}
              onChange={handleChange}
              placeholder="https://..."
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Rating
              </label>

              <select
                name="rating"
                value={form.rating}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    rating:
                      event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
              >
                <option value="5">
                  5 Stars
                </option>

                <option value="4">
                  4 Stars
                </option>

                <option value="3">
                  3 Stars
                </option>

                <option value="2">
                  2 Stars
                </option>

                <option value="1">
                  1 Star
                </option>
              </select>
            </div>

            <Input
              label="Display Order"
              name="order"
              type="number"
              value={form.order}
              onChange={handleChange}
              placeholder="0"
            />

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Testimonial
              </label>

              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={5}
                placeholder="What did the client say about IMMIQ?"
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div className="flex flex-wrap gap-6 lg:col-span-2">
              <Checkbox
                label="Featured"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />

              <Checkbox
                label="Active"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Testimonial"
                    : "Add Testimonial"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/10 px-6 py-3 font-semibold hover:bg-white/5"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* SEARCH */}

        <div className="mb-6">
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search testimonials..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
          />
        </div>

        {/* LIST */}

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-slate-400">
            Loading testimonials...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="font-semibold">
              No testimonials found
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Add your first testimonial above.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-cyan-400/30"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
                        {item.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold">
                        {item.name}
                      </h3>

                      <p className="text-xs text-slate-500">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      item.active
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {item.active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <div className="mb-4 flex gap-1 text-lg text-cyan-400">
                  {"★".repeat(item.rating)}
                  <span className="text-slate-700">
                    {"★".repeat(
                      5 - item.rating
                    )}
                  </span>
                </div>

                <p className="line-clamp-5 text-sm leading-7 text-slate-300">
                  “{item.content}”
                </p>

                <p className="mt-4 text-xs font-medium text-slate-500">
                  {item.company}
                </p>

                <div className="mt-5 flex items-center gap-2">
                  {item.featured && (
                    <span className="rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-950">
                      Featured
                    </span>
                  )}
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(item)
                    }
                    className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/10"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(item._id)
                    }
                    className="rounded-xl border border-red-400/20 px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-400/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
      />
    </div>
  );
}

function Checkbox({
  label,
  name,
  checked,
  onChange,
}: {
  label: string;
  name: string;
  checked: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-cyan-400"
      />

      {label}
    </label>
  );
}