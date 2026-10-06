import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

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

interface ClientForm {
  name: string;
  industry: string;
  description: string;
  projectType: string;
  location: string;
  website: string;
  logo: string;
  featured: boolean;
}

const emptyForm: ClientForm = {
  name: "",
  industry: "",
  description: "",
  projectType: "",
  location: "Coimbatore, Tamil Nadu",
  website: "",
  logo: "",
  featured: false,
};

export default function Clients() {
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<ClientForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("immiq_admin_token");

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/clients`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load clients"
        );
      }

      setClients(data.clients);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load clients"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>
) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const url = editingId
        ? `${API_URL}/admin/clients/${editingId}`
        : `${API_URL}/admin/clients`;

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
          data.message || "Failed to save client"
        );
      }

      setForm(emptyForm);
      setEditingId(null);

      await fetchClients();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save client"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingId(client._id);

    setForm({
      name: client.name,
      industry: client.industry,
      description: client.description,
      projectType: client.projectType,
      location: client.location,
      website: client.website || "",
      logo: client.logo || "",
      featured: client.featured,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/admin/clients/${id}`,
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
          data.message || "Failed to delete client"
        );
      }

      await fetchClients();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete client"
      );
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-cyan-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>

            <p className="text-sm font-medium text-cyan-400">
              IMMIQ ADMIN
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Clients
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Manage client companies displayed across IMMIQ.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Client" : "Add Client"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? "Update client information."
                  : "Add a new client company."}
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >
            <input
              required
              placeholder="Company name"
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name: event.target.value,
                })
              }
              className="h-12 rounded-xl border border-white/10 bg-slate-900 px-4 text-sm outline-none focus:border-cyan-400/50"
            />

            <input
              required
              placeholder="Industry"
              value={form.industry}
              onChange={(event) =>
                setForm({
                  ...form,
                  industry: event.target.value,
                })
              }
              className="h-12 rounded-xl border border-white/10 bg-slate-900 px-4 text-sm outline-none focus:border-cyan-400/50"
            />

            <input
              required
              placeholder="Project type"
              value={form.projectType}
              onChange={(event) =>
                setForm({
                  ...form,
                  projectType: event.target.value,
                })
              }
              className="h-12 rounded-xl border border-white/10 bg-slate-900 px-4 text-sm outline-none focus:border-cyan-400/50"
            />

            <input
              placeholder="Location"
              value={form.location}
              onChange={(event) =>
                setForm({
                  ...form,
                  location: event.target.value,
                })
              }
              className="h-12 rounded-xl border border-white/10 bg-slate-900 px-4 text-sm outline-none focus:border-cyan-400/50"
            />

            <input
              type="url"
              placeholder="Website URL"
              value={form.website}
              onChange={(event) =>
                setForm({
                  ...form,
                  website: event.target.value,
                })
              }
              className="h-12 rounded-xl border border-white/10 bg-slate-900 px-4 text-sm outline-none focus:border-cyan-400/50"
            />

            <input
              placeholder="Logo URL"
              value={form.logo}
              onChange={(event) =>
                setForm({
                  ...form,
                  logo: event.target.value,
                })
              }
              className="h-12 rounded-xl border border-white/10 bg-slate-900 px-4 text-sm outline-none focus:border-cyan-400/50"
            />

            <textarea
              required
              placeholder="Client description"
              value={form.description}
              onChange={(event) =>
                setForm({
                  ...form,
                  description: event.target.value,
                })
              }
              className="min-h-32 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50 md:col-span-2"
            />

            <label className="flex min-h-12 items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  setForm({
                    ...form,
                    featured: event.target.checked,
                  })
                }
                className="h-4 w-4 accent-cyan-400"
              />
              Featured client
            </label>

            <div className="flex justify-end md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Client"
                    : "Add Client"}
              </button>
            </div>
          </form>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                All Clients
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {clients.length} client
                {clients.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-500">
              Loading clients...
            </div>
          ) : clients.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-500">
              No clients found.
            </div>
          ) : (
            <div className="grid gap-4">
              {clients.map((client) => (
                <div
                  key={client._id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold">
                          {client.name}
                        </h3>

                        {client.featured && (
                          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span>{client.industry}</span>
                        <span>•</span>
                        <span>{client.projectType}</span>
                        <span>•</span>
                        <span>{client.location}</span>
                      </div>

                      <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
                        {client.description}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(client)}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(client._id)
                        }
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-400/20 bg-red-400/5 px-4 text-sm text-red-300 transition hover:bg-red-400/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}