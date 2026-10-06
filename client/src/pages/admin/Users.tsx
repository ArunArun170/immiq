import {
  useEffect,
  useMemo,
  useState,
} from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

type UserRole =
  | "learner"
  | "client"
  | "editor"
  | "manager"
  | "admin"
  | "super_admin";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
}

const roles: UserRole[] = [
  "learner",
  "client",
  "editor",
  "manager",
  "admin",
  "super_admin",
];

const permissionOptions = [
  "dashboard:read",

  "client:create",
  "client:read",
  "client:update",
  "client:delete",

  "achievement:create",
  "achievement:read",
  "achievement:update",
  "achievement:delete",

  "blog:create",
  "blog:read",
  "blog:update",
  "blog:delete",

  "service:create",
  "service:read",
  "service:update",
  "service:delete",

  "lead:read",
  "lead:update",

  "team:create",
  "team:read",
  "team:update",
  "team:delete",

  "testimonial:create",
  "testimonial:read",
  "testimonial:update",
  "testimonial:delete",

  "media:create",
  "media:read",
  "media:update",
  "media:delete",

  "user:create",
  "user:read",
  "user:update",
  "user:delete",

  "settings:read",
  "settings:update",
];

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "learner" as UserRole,
  permissions: [] as string[],
  isActive: true,
};

export default function Users() {
  const [users, setUsers] =
    useState<UserItem[]>([]);

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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/users`,
        {
          headers,
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch users"
        );
      }

      setUsers(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers =
    useMemo(() => {
      const value =
        search
          .toLowerCase()
          .trim();

      if (!value) {
        return users;
      }

      return users.filter(
        (user) =>
          user.name
            .toLowerCase()
            .includes(value) ||
          user.email
            .toLowerCase()
            .includes(value) ||
          user.role
            .toLowerCase()
            .includes(value)
      );
    }, [users, search]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (
    user: UserItem
  ) => {
    setEditingId(user.id);

    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      permissions:
        user.permissions || [],
      isActive: user.isActive,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const togglePermission = (
    permission: string
  ) => {
    setForm((current) => {
      const exists =
        current.permissions.includes(
          permission
        );

      return {
        ...current,
        permissions: exists
          ? current.permissions.filter(
              (item) =>
                item !== permission
            )
          : [
              ...current.permissions,
              permission,
            ],
      };
    });
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError(
        "Name is required"
      );
      return;
    }

    if (!form.email.trim()) {
      setError(
        "Email is required"
      );
      return;
    }

    if (
      !editingId &&
      form.password.length < 6
    ) {
      setError(
        "Password must contain at least 6 characters"
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const url = editingId
        ? `${API_URL}/admin/users/${editingId}`
        : `${API_URL}/admin/users`;

      const method = editingId
        ? "PUT"
        : "POST";

      const body = {
        name: form.name,
        email: form.email,
        role: form.role,
        permissions:
          form.permissions,
        isActive:
          form.isActive,
        ...(form.password
          ? {
              password:
                form.password,
            }
          : {}),
      };

      const response = await fetch(
        url,
        {
          method,
          headers,
          body: JSON.stringify(
            body
          ),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to save user"
        );
      }

      resetForm();
      await fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save user"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Delete this user permanently?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/admin/users/${id}`,
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
            "Failed to delete user"
        );
      }

      await fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete user"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
              Access Management
            </p>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Users & Roles
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Manage IMMIQ users, roles
              and granular permissions.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Total Users
            </p>

            <p className="mt-1 text-2xl font-black">
              {users.length}
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
                ? "Edit User"
                : "Create User"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create accounts and control
              access using roles and
              permissions.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 lg:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Name
              </label>

              <input
                value={form.name}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    email:
                      e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                {editingId
                  ? "New Password (optional)"
                  : "Password"}
              </label>

              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    password:
                      e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Role
              </label>

              <select
                value={form.role}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    role: e.target
                      .value as UserRole,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                {roles.map(
                  (role) => (
                    <option
                      key={role}
                      value={role}
                    >
                      {role}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="flex items-center lg:col-span-2">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={
                    form.isActive
                  }
                  onChange={(e) =>
                    setForm(
                      (current) => ({
                        ...current,
                        isActive:
                          e.target
                            .checked,
                      })
                    )
                  }
                  className="h-4 w-4"
                />
                Account active
              </label>
            </div>

            {/* Permissions */}

            <div className="lg:col-span-2">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold">
                    Permissions
                  </h3>

                  <p className="text-xs text-slate-500">
                    Super Admin automatically
                    has full access.
                  </p>
                </div>

                <span className="text-xs text-cyan-400">
                  {
                    form.permissions
                      .length
                  }{" "}
                  selected
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {permissionOptions.map(
                  (permission) => (
                    <label
                      key={permission}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-xs text-slate-300 transition hover:border-cyan-400/30"
                    >
                      <input
                        type="checkbox"
                        checked={form.permissions.includes(
                          permission
                        )}
                        onChange={() =>
                          togglePermission(
                            permission
                          )
                        }
                        className="h-4 w-4 shrink-0"
                      />

                      <span className="break-all">
                        {permission}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 lg:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update User"
                  : "Create User"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/10 px-6 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"
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
            placeholder="Search users by name, email or role..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm outline-none focus:border-cyan-400"
          />
        </div>

        {/* Users */}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center text-slate-400">
            Loading users...
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map(
              (user) => (
                <article
                  key={user.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-400/20"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 font-black text-cyan-300">
                        {user.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-bold">
                          {user.name}
                        </h3>

                        <p className="truncate text-sm text-slate-500">
                          {user.email}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold uppercase text-cyan-300">
                            {user.role}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                              user.isActive
                                ? "bg-emerald-400/10 text-emerald-300"
                                : "bg-red-400/10 text-red-300"
                            }`}
                          >
                            {user.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handleEdit(
                            user
                          )
                        }
                        className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold hover:bg-white/10"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            user.id
                          )
                        }
                        className="rounded-xl bg-red-400/10 px-5 py-2.5 text-xs font-bold text-red-300 hover:bg-red-400/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              )
            )}

            {filteredUsers.length ===
              0 && (
              <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center text-slate-500">
                No users found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}