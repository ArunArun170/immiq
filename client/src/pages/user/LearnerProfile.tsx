import { useEffect, useMemo, useState } from "react";
import type { ReactNode, SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Globe2,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  ExternalLink,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

interface LearnerProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  avatarUrl: string;
  bio: string;
  city: string;
  state: string;
  country: string;
  linkedinUrl: string;
  websiteUrl: string;
  learningGoal: string;
  createdAt?: string;
}

const emptyProfile: LearnerProfileData = {
  id: "",
  name: "",
  email: "",
  role: "learner",
  phone: "",
  avatarUrl: "",
  bio: "",
  city: "",
  state: "",
  country: "India",
  linkedinUrl: "",
  websiteUrl: "",
  learningGoal: "",
};

export default function LearnerProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("immiq_learner_token") || "";

  const [profile, setProfile] =
    useState<LearnerProfileData>(emptyProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const load = async () => {
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(`${API_URL}/learner/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("immiq_learner_token");
          localStorage.removeItem("immiq_learner_user");

          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile");
        }

        setProfile({
          ...emptyProfile,
          ...(data.profile || {}),
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate, token]);

  const initials = useMemo(() => {
    const parts = profile.name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return (
      parts
        .slice(0, 2)
        .map((part) => part[0])
        .join("") || "IM"
    ).toUpperCase();
  }, [profile.name]);

  const update = (
    field: keyof LearnerProfileData,
    value: string
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage("");
    setError("");
  };

  const saveProfile = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/learner/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          avatarUrl: profile.avatarUrl,
          bio: profile.bio,
          city: profile.city,
          state: profile.state,
          country: profile.country,
          linkedinUrl: profile.linkedinUrl,
          websiteUrl: profile.websiteUrl,
          learningGoal: profile.learningGoal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save profile"
        );
      }

      const updatedProfile = {
        ...profile,
        ...(data.profile || {}),
      };

      setProfile(updatedProfile);

      localStorage.setItem(
        "immiq_learner_user",
        JSON.stringify({
          id: updatedProfile.id || profile.id,
          name: updatedProfile.name || profile.name,
          email: updatedProfile.email || profile.email,
          role: updatedProfile.role || "learner",
        })
      );

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (!passwords.currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPasswordError(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (
      passwords.newPassword !== passwords.confirmPassword
    ) {
      setPasswordError(
        "New password and confirmation do not match."
      );
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch(
        `${API_URL}/learner/profile/password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to change password"
        );
      }

      setPasswordMessage(
        data.message || "Password changed successfully."
      );

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        localStorage.removeItem("immiq_learner_token");
        localStorage.removeItem("immiq_learner_user");

        navigate("/login", {
          replace: true,
        });
      }, 1200);
    } catch (err) {
      setPasswordError(
        err instanceof Error
          ? err.message
          : "Unable to change password"
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-5 py-20 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 text-slate-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading your profile...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Top navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/portal"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to learner portal
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            Account & security
          </div>
        </div>

        {/* Header */}
        <header className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-500/20 via-slate-900 to-cyan-500/10 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

            <div className="relative shrink-0">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-24 w-24 rounded-3xl border border-white/20 object-cover shadow-xl"
                />
              ) : (
                <div className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-2xl font-black text-white shadow-xl">
                  {initials}
                </div>
              )}

              <span className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full border-4 border-slate-950 bg-cyan-400 text-slate-950">
                <Camera className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                IMMIQ LEARNING
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Your learner profile
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Keep your contact details and learning goals up to date
                so your IMMIQ learning experience stays connected to you.
              </p>
            </div>
          </div>
        </header>

        {/* Messages */}
        {error && (
          <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </div>
        )}

        {/* Main form */}
        <form
          onSubmit={saveProfile}
          className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]"
        >
          {/* Profile information */}
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 sm:p-7">

            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Personal information
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Profile details
                </h2>
              </div>

              <UserRound className="h-5 w-5 text-slate-500" />
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <Field
                label="Full name"
                value={profile.name}
                onChange={(value) => update("name", value)}
                icon={<UserRound className="h-4 w-4" />}
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Email
                </label>

                <div className="flex min-h-11 items-center gap-3 rounded-xl border border-white/10 bg-slate-900/70 px-3 text-sm text-slate-400">
                  <Mail className="h-4 w-4 shrink-0" />
                  {profile.email}
                </div>

                <p className="mt-1.5 text-[11px] text-slate-500">
                  Email is managed through your account.
                </p>
              </div>

              <Field
                label="Phone"
                value={profile.phone}
                onChange={(value) => update("phone", value)}
                placeholder="+91 98765 43210"
                icon={<Phone className="h-4 w-4" />}
              />

              <Field
                label="Avatar URL"
                value={profile.avatarUrl}
                onChange={(value) =>
                  update("avatarUrl", value)
                }
                placeholder="https://..."
                icon={<Camera className="h-4 w-4" />}
              />
            </div>

            {/* Bio */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                About you
              </label>

              <textarea
                value={profile.bio}
                onChange={(event) =>
                  update("bio", event.target.value)
                }
                maxLength={500}
                rows={4}
                placeholder="Tell us a little about yourself..."
                className="w-full resize-y rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
              />

              <p className="mt-1 text-right text-[11px] text-slate-500">
                {profile.bio.length}/500
              </p>
            </div>

            {/* Location */}
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                Location
              </p>

              <div className="mt-4 grid gap-5 sm:grid-cols-3">
                <Field
                  label="City"
                  value={profile.city}
                  onChange={(value) =>
                    update("city", value)
                  }
                  icon={<MapPin className="h-4 w-4" />}
                />

                <Field
                  label="State"
                  value={profile.state}
                  onChange={(value) =>
                    update("state", value)
                  }
                />

                <Field
                  label="Country"
                  value={profile.country}
                  onChange={(value) =>
                    update("country", value)
                  }
                />
              </div>
            </div>

            {/* Professional links */}
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                Professional links
              </p>

              <div className="mt-4 grid gap-5 sm:grid-cols-2">

                <Field
                  label="LinkedIn"
                  value={profile.linkedinUrl}
                  onChange={(value) =>
                    update("linkedinUrl", value)
                  }
                  placeholder="https://linkedin.com/in/..."
                  icon={
                    <ExternalLink className="h-4 w-4" />
                  }
                />

                <Field
                  label="Website / portfolio"
                  value={profile.websiteUrl}
                  onChange={(value) =>
                    update("websiteUrl", value)
                  }
                  placeholder="https://..."
                  icon={
                    <Globe2 className="h-4 w-4" />
                  }
                />
              </div>
            </div>

            {/* Learning goal */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Learning goal
              </label>

              <textarea
                value={profile.learningGoal}
                onChange={(event) =>
                  update(
                    "learningGoal",
                    event.target.value
                  )
                }
                maxLength={300}
                rows={3}
                placeholder="What do you want to build or become better at?"
                className="w-full resize-y rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            {/* Save */}
            <button
              disabled={saving}
              type="submit"
              className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save profile"}
            </button>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">

            {/* Account status */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                Account
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Account status
              </h2>

              <div className="mt-5 space-y-3">
                <InfoRow
                  label="Role"
                  value="Learner"
                />

                <InfoRow
                  label="Member since"
                  value={
                    profile.createdAt
                      ? new Date(
                          profile.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "-"
                  }
                />

                <InfoRow
                  label="Email"
                  value="Verified account"
                />
              </div>
            </section>

            {/* Security */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">

              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-400/10 text-indigo-300">
                  <LockKeyhole className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                    Security
                  </p>

                  <h2 className="font-bold">
                    Change password
                  </h2>
                </div>
              </div>

              <form
                onSubmit={changePassword}
                className="mt-5 space-y-4"
              >
                <PasswordField
                  label="Current password"
                  value={
                    passwords.currentPassword
                  }
                  onChange={(value) =>
                    setPasswords((current) => ({
                      ...current,
                      currentPassword: value,
                    }))
                  }
                />

                <PasswordField
                  label="New password"
                  value={passwords.newPassword}
                  onChange={(value) =>
                    setPasswords((current) => ({
                      ...current,
                      newPassword: value,
                    }))
                  }
                />

                <PasswordField
                  label="Confirm password"
                  value={
                    passwords.confirmPassword
                  }
                  onChange={(value) =>
                    setPasswords((current) => ({
                      ...current,
                      confirmPassword: value,
                    }))
                  }
                />

                {passwordError && (
                  <p className="text-xs leading-5 text-red-300">
                    {passwordError}
                  </p>
                )}

                {passwordMessage && (
                  <p className="flex gap-2 text-xs leading-5 text-emerald-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    {passwordMessage}
                  </p>
                )}

                <button
                  disabled={changingPassword}
                  type="submit"
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 text-sm font-bold transition hover:bg-white/15 disabled:opacity-60"
                >
                  <KeyRound className="h-4 w-4" />
                  {changingPassword
                    ? "Updating..."
                    : "Update password"}
                </button>
              </form>

              <p className="mt-4 text-[11px] leading-5 text-slate-500">
                For security, you will be signed out after
                changing your password.
              </p>
            </section>
          </aside>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-200">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </span>
        )}

        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          className={`min-h-11 w-full rounded-xl border border-white/10 bg-slate-900/70 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10 ${
            icon ? "pl-10 pr-3" : "px-3"
          }`}
        />
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-300">
        {label}
      </label>

      <input
        type="password"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        autoComplete="new-password"
        className="min-h-10 w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
      />
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 text-sm last:border-0 last:pb-0">
      <span className="text-slate-500">
        {label}
      </span>

      <span className="text-right font-semibold text-slate-200">
        {value}
      </span>
    </div>
  );
}