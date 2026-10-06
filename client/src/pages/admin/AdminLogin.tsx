import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>
) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      if (
        ![
          "editor",
          "manager",
          "admin",
          "super_admin",
        ].includes(data.user.role)
      ) {
        throw new Error(
          "You do not have admin access."
        );
      }

      localStorage.setItem("immiq_admin_token", data.token);
      localStorage.setItem(
        "immiq_admin_user",
        JSON.stringify(data.user)
      );

      navigate("/admin");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-12 text-white sm:px-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-3xl font-bold tracking-[0.16em]"
          >
            IMMIQ
            <span className="text-cyan-400">.</span>
          </button>

          <p className="mt-4 text-sm text-slate-500">
            Administration Portal
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <ShieldCheck className="h-6 w-6 text-cyan-400" />
            </div>

            <h1 className="text-2xl font-semibold">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Sign in to manage your IMMIQ website.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="admin@immiq.in"
                  className="h-12 w-full rounded-xl border border-white/10 bg-slate-900/80 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-xl border border-white/10 bg-slate-900/80 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in to Admin
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          IMMIQ Admin • Secure access
        </p>
      </div>
    </main>
  );
}