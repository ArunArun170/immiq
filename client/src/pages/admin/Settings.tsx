import {
  useEffect,
  useState,
} from "react";

interface SettingsData {
  siteName: string;
  tagline: string;

  email: string;
  phone: string;
  address: string;
  whatsapp: string;

  linkedin: string;
  instagram: string;
  facebook: string;
  youtube: string;
  twitter: string;

  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImage: string;

  googleAnalyticsId: string;
  googleSearchConsoleCode: string;

  maintenanceMode: boolean;
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

const defaultSettings: SettingsData = {
  siteName: "IMMIQ",
  tagline:
    "CURIOSITY FIRST. TECHNOLOGY NEXT.",

  email: "",
  phone: "",
  address:
    "Coimbatore, Tamil Nadu, India",
  whatsapp: "",

  linkedin: "",
  instagram: "",
  facebook: "",
  youtube: "",
  twitter: "",

  seoTitle:
    "IMMIQ | Curiosity First. Technology Next.",

  seoDescription:
    "IMMIQ is a technology company focused on corporate training, SaaS development, emerging technologies and digital services.",

  seoKeywords:
    "IMMIQ, technology, corporate training, SaaS, emerging technology, digital services, Coimbatore",

  ogImage: "",

  googleAnalyticsId: "",
  googleSearchConsoleCode: "",

  maintenanceMode: false,
};

export default function Settings() {
  const [settings, setSettings] =
    useState<SettingsData>(
      defaultSettings
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const token = localStorage.getItem(
    "immiq_admin_token"
  );

  /* =========================
     FETCH
  ========================= */

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/settings`,
        {
          headers: {
            Authorization: `Bearer ${
              token || ""
            }`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load settings"
        );
      }

      if (data.data) {
        setSettings({
          ...defaultSettings,
          ...data.data,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load settings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  /* =========================
     CHANGE
  ========================= */

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const {
      name,
      value,
      type,
    } = event.target;

    const checked =
      "checked" in event.target
        ? event.target.checked
        : false;

    setSettings((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =========================
     SAVE
  ========================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${
              token || ""
            }`,
          },
          body: JSON.stringify(
            settings
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update settings"
        );
      }

      setSettings({
        ...defaultSettings,
        ...data.data,
      });

      setSuccess(
        "Settings saved successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-12 text-center text-slate-400">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Admin CMS
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Site Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Manage IMMIQ brand information,
            contact details, social links and
            SEO configuration.
          </p>
        </div>

        {/* ALERTS */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* BRAND */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
            <h2 className="text-lg font-semibold">
              Brand Information
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Site Name
                </label>

                <input
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Tagline
                </label>

                <input
                  name="tagline"
                  value={settings.tagline}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

            </div>
          </section>

          {/* CONTACT */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
            <h2 className="text-lg font-semibold">
              Contact Information
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  value={settings.email}
                  onChange={handleChange}
                  placeholder="hello@immiq.in"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Phone
                </label>

                <input
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  WhatsApp
                </label>

                <input
                  name="whatsapp"
                  value={settings.whatsapp}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Address
                </label>

                <input
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

            </div>
          </section>

          {/* SOCIAL */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
            <h2 className="text-lg font-semibold">
              Social Media
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              {[
                ["linkedin", "LinkedIn URL"],
                ["instagram", "Instagram URL"],
                ["facebook", "Facebook URL"],
                ["youtube", "YouTube URL"],
                ["twitter", "X / Twitter URL"],
              ].map(
                ([name, label]) => (
                  <div key={name}>
                    <label className="mb-2 block text-sm text-slate-300">
                      {label}
                    </label>

                    <input
                      name={name}
                      value={
                        settings[
                          name as keyof SettingsData
                        ] as string
                      }
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                    />
                  </div>
                )
              )}

            </div>
          </section>

          {/* SEO */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
            <div>
              <h2 className="text-lg font-semibold">
                SEO Settings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search engine title, description,
                keywords and social preview.
              </p>
            </div>

            <div className="mt-5 space-y-5">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  SEO Title
                </label>

                <input
                  name="seoTitle"
                  value={settings.seoTitle}
                  onChange={handleChange}
                  maxLength={70}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />

                <p className="mt-1 text-xs text-slate-600">
                  {settings.seoTitle.length}/70
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  SEO Description
                </label>

                <textarea
                  name="seoDescription"
                  value={
                    settings.seoDescription
                  }
                  onChange={handleChange}
                  rows={4}
                  maxLength={170}
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />

                <p className="mt-1 text-xs text-slate-600">
                  {
                    settings.seoDescription
                      .length
                  }
                  /170
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  SEO Keywords
                </label>

                <textarea
                  name="seoKeywords"
                  value={
                    settings.seoKeywords
                  }
                  onChange={handleChange}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Open Graph Image URL
                </label>

                <input
                  name="ogImage"
                  value={settings.ogImage}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

            </div>
          </section>

          {/* ANALYTICS */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
            <h2 className="text-lg font-semibold">
              Analytics & Verification
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Google Analytics ID
                </label>

                <input
                  name="googleAnalyticsId"
                  value={
                    settings.googleAnalyticsId
                  }
                  onChange={handleChange}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Search Console Verification
                </label>

                <input
                  name="googleSearchConsoleCode"
                  value={
                    settings.googleSearchConsoleCode
                  }
                  onChange={handleChange}
                  placeholder="Verification code"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

            </div>
          </section>

          {/* MAINTENANCE */}

          <section className="rounded-3xl border border-amber-400/10 bg-amber-400/[0.03] p-5 sm:p-7">
            <label className="flex cursor-pointer items-start gap-4">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={
                  settings.maintenanceMode
                }
                onChange={handleChange}
                className="mt-1 h-5 w-5 accent-amber-400"
              />

              <div>
                <p className="font-semibold">
                  Maintenance Mode
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Enable this only when the public
                  website needs to be temporarily
                  taken offline.
                </p>
              </div>
            </label>
          </section>

          {/* SAVE */}

          <div className="sticky bottom-4 z-20 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-cyan-400 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-400/10 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Settings"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}