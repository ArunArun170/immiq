import { useEffect, useMemo, useState } from "react";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  photo: string;
  skills: string[];
  linkedin: string;
  email: string;
  featured: boolean;
  active: boolean;
  order: number;
}

interface FormState {
  name: string;
  role: string;
  department: string;
  bio: string;
  photo: string;
  skills: string;
  linkedin: string;
  email: string;
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
  department: "",
  bio: "",
  photo: "",
  skills: "",
  linkedin: "",
  email: "",
  featured: false,
  active: true,
  order: "0",
};

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>(
    []
  );

  const [form, setForm] =
    useState<FormState>(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token =
    localStorage.getItem("immiq_admin_token") || "";

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/team`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error(
        "Failed to fetch team members:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return members;

    return members.filter(
      (member) =>
        member.name
          .toLowerCase()
          .includes(query) ||
        member.role
          .toLowerCase()
          .includes(query) ||
        member.department
          .toLowerCase()
          .includes(query)
    );
  }, [members, search]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
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
      !form.department.trim() ||
      !form.bio.trim()
    ) {
      alert(
        "Name, role, department and bio are required."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        department: form.department.trim(),
        bio: form.bio.trim(),
        photo: form.photo.trim(),
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        linkedin: form.linkedin.trim(),
        email: form.email.trim(),
        featured: form.featured,
        active: form.active,
        order: Number(form.order) || 0,
      };

      const url = editingId
        ? `${API_URL}/admin/team/${editingId}`
        : `${API_URL}/admin/team`;

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
            "Failed to save team member"
        );
      }

      if (editingId) {
        setMembers((current) =>
          current.map((member) =>
            member._id === editingId
              ? data.member
              : member
          )
        );
      } else {
        setMembers((current) => [
          data.member,
          ...current,
        ]);
      }

      resetForm();
    } catch (error) {
      console.error(
        "Failed to save team member:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save team member"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member._id);

    setForm({
      name: member.name,
      role: member.role,
      department: member.department,
      bio: member.bio,
      photo: member.photo || "",
      skills: member.skills?.join(", ") || "",
      linkedin: member.linkedin || "",
      email: member.email || "",
      featured: member.featured,
      active: member.active,
      order: String(member.order ?? 0),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this team member?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/admin/team/${id}`,
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
            "Failed to delete team member"
        );
      }

      setMembers((current) =>
        current.filter(
          (member) => member._id !== id
        )
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(
        "Failed to delete team member:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete team member"
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
              CMS / Team
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Team Members
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Manage IMMIQ team profiles, roles,
              skills and visibility.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchMembers}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            Refresh
          </button>
        </div>

        {/* FORM */}

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                {editingId
                  ? "Edit Team Member"
                  : "Add Team Member"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? "Update the selected profile."
                  : "Create a new team profile."}
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
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
              placeholder="Team member name"
            />

            <Input
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. CTO / AI Engineer"
            />

            <Input
              label="Department"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="e.g. Technology"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@immiq.in"
            />

            <Input
              label="Photo URL"
              name="photo"
              value={form.photo}
              onChange={handleChange}
              placeholder="https://..."
            />

            <Input
              label="LinkedIn URL"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
            />

            <Input
              label="Display Order"
              name="order"
              type="number"
              value={form.order}
              onChange={handleChange}
              placeholder="0"
            />

            <Input
              label="Skills"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="AI, React, Cloud, Python"
            />

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Bio
              </label>

              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={5}
                placeholder="Short professional biography..."
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
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
                className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Member"
                    : "Add Member"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/10 px-6 py-3 font-semibold text-slate-300 hover:bg-white/5"
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
            placeholder="Search by name, role or department..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
          />
        </div>

        {/* TEAM GRID */}

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-slate-400">
            Loading team members...
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="font-semibold">
              No team members found
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Add your first team member above.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredMembers.map((member) => (
              <div
                key={member._id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-cyan-400/30"
              >
                {/* IMAGE */}

                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl font-bold text-cyan-400">
                      {member.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="absolute left-4 top-4 flex gap-2">
                    {member.featured && (
                      <span className="rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-950">
                        Featured
                      </span>
                    )}

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        member.active
                          ? "bg-emerald-400/90 text-slate-950"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {member.active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}

                <div className="p-5">
                  <h3 className="text-xl font-bold">
                    {member.name}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-cyan-400">
                    {member.role}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {member.department}
                  </p>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                    {member.bio}
                  </p>

                  {member.skills?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {member.skills
                        .slice(0, 5)
                        .map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(member)
                      }
                      className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(member._id)
                      }
                      className="rounded-xl border border-red-400/20 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
                    >
                      Delete
                    </button>
                  </div>
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
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
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