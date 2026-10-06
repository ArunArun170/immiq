import { useEffect, useState } from "react";

type Course = {
  _id: string;
  title: string;
  technology?: string;
  level?: string;
};

type Batch = {
  _id: string;
  course?: Course;
  name: string;
  startDate: string;
  endDate?: string;
  schedule?: string;
  mode?: "Online" | "Offline" | "Hybrid";
  venue?: string;
  link?: string;
  seatsTotal?: number;
  seatsFilled?: number;
  priceOverride?: number;
  earlyBirdTill?: string;
  status?: "upcoming" | "running" | "completed" | "cancelled";
};

type BatchForm = {
  course: string;
  name: string;
  startDate: string;
  endDate: string;
  schedule: string;
  mode: "Online" | "Offline" | "Hybrid";
  venue: string;
  link: string;
  seatsTotal: string;
  seatsFilled: string;
  priceOverride: string;
  earlyBirdTill: string;
  status: "upcoming" | "running" | "completed" | "cancelled";
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

const emptyForm: BatchForm = {
  course: "",
  name: "",
  startDate: "",
  endDate: "",
  schedule: "",
  mode: "Online",
  venue: "",
  link: "",
  seatsTotal: "20",
  seatsFilled: "0",
  priceOverride: "",
  earlyBirdTill: "",
  status: "upcoming",
};

export default function Batches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [form, setForm] = useState<BatchForm>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("immiq_admin_token");

  const authHeaders = {
    Authorization: `Bearer ${token || ""}`,
    "Content-Type": "application/json",
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [batchResponse, courseResponse] =
        await Promise.all([
          fetch(`${API_URL}/admin/batches`, {
            headers: {
              Authorization: `Bearer ${token || ""}`,
            },
          }),
          fetch(`${API_URL}/admin/courses`, {
            headers: {
              Authorization: `Bearer ${token || ""}`,
            },
          }),
        ]);

      const batchData = await batchResponse.json();
      const courseData = await courseResponse.json();

      if (!batchResponse.ok) {
        throw new Error(
          batchData.message || "Failed to load batches"
        );
      }

      if (!courseResponse.ok) {
        throw new Error(
          courseData.message || "Failed to load courses"
        );
      }

      setBatches(batchData.batches || []);
      setCourses(courseData.courses || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load batch data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (
    field: keyof BatchForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.course) {
      setError("Please select a course.");
      return;
    }

    if (!form.name.trim()) {
      setError("Batch name is required.");
      return;
    }

    if (!form.startDate) {
      setError("Start date is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        course: form.course,
        name: form.name.trim(),
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        schedule: form.schedule.trim(),
        mode: form.mode,
        venue: form.venue.trim(),
        link: form.link.trim(),
        seatsTotal: Number(form.seatsTotal || 20),
        seatsFilled: Number(form.seatsFilled || 0),
        priceOverride:
          form.priceOverride === ""
            ? 0
            : Number(form.priceOverride),
        earlyBirdTill:
          form.earlyBirdTill || undefined,
        status: form.status,
      };

      const url = editingId
        ? `${API_URL}/admin/batches/${editingId}`
        : `${API_URL}/admin/batches`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save batch"
        );
      }

      setSuccess(
        editingId
          ? "Batch updated successfully."
          : "Batch created successfully."
      );

      resetForm();
      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save batch"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (batch: Batch) => {
    setError("");
    setSuccess("");

    setEditingId(batch._id);

    setForm({
      course:
        typeof batch.course === "string"
          ? batch.course
          : batch.course?._id || "",

      name: batch.name || "",

      startDate: batch.startDate
        ? new Date(batch.startDate)
            .toISOString()
            .slice(0, 10)
        : "",

      endDate: batch.endDate
        ? new Date(batch.endDate)
            .toISOString()
            .slice(0, 10)
        : "",

      schedule: batch.schedule || "",

      mode: batch.mode || "Online",

      venue: batch.venue || "",

      link: batch.link || "",

      seatsTotal: String(
        batch.seatsTotal ?? 20
      ),

      seatsFilled: String(
        batch.seatsFilled ?? 0
      ),

      priceOverride:
        batch.priceOverride &&
        batch.priceOverride > 0
          ? String(batch.priceOverride)
          : "",

      earlyBirdTill: batch.earlyBirdTill
        ? new Date(batch.earlyBirdTill)
            .toISOString()
            .slice(0, 10)
        : "",

      status: batch.status || "upcoming",
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
      "Are you sure you want to delete this batch?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/admin/batches/${id}`,
        {
          method: "DELETE",
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
            "Failed to delete batch"
        );
      }

      setSuccess(
        "Batch deleted successfully."
      );

      if (editingId === id) {
        resetForm();
      }

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete batch"
      );
    }
  };

  const formatDate = (
    value?: string
  ) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClass = (
    status?: string
  ) => {
    switch (status) {
      case "running":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-400/20";

      case "completed":
        return "bg-blue-500/15 text-blue-300 border-blue-400/20";

      case "cancelled":
        return "bg-red-500/15 text-red-300 border-red-400/20";

      default:
        return "bg-cyan-500/15 text-cyan-300 border-cyan-400/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-cyan-400">
              Learning Platform
            </p>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Batch Management
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Create and manage upcoming course batches.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              Cancel Editing
            </button>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {success}
          </div>
        )}

        {/* Form */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              {editingId
                ? "Edit Batch"
                : "Create New Batch"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Link the batch to an existing course.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {/* Course */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Course *
              </label>

              <select
                value={form.course}
                onChange={(event) =>
                  handleChange(
                    "course",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-[#0c192b] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
              >
                <option value="">
                  Select Course
                </option>

                {courses.map((course) => (
                  <option
                    key={course._id}
                    value={course._id}
                  >
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Batch Name *
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  handleChange(
                    "name",
                    event.target.value
                  )
                }
                placeholder="Eg: AI & ML Weekend Batch"
                className="w-full rounded-xl border border-white/10 bg-[#0c192b] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400/50"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Start Date *
              </label>

              <input
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  handleChange(
                    "startDate",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-[#0c192b] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                End Date
              </label>

              <input
                type="date"
                value={form.endDate}
                onChange={(event) =>
                  handleChange(
                    "endDate",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-[#0c192b] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
              />
            </div>

            {/* Schedule */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Schedule
              </label>

              <input
                type="text"
                value={form.schedule}
                onChange={(event) =>
                  handleChange(
                    "schedule",
                    event.target.value
                  )
                }
                placeholder="Eg: Sat & Sun, 10 AM - 1 PM"
                className="w-full rounded-xl border border-white/10 bg-[#0c192b] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400/50"
              />
            </div>

            {/* Mode */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Mode
              </label>

              <select
                value={form.mode}
                onChange={(event) =>
                  handleChange(
                    "mode",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-[#0c192b] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
              >
                <option value="Online">
                  Online
                </option>

                <option value="Offline">
                  Offline
                </option>

                <option value="Hybrid">
                  Hybrid
                </option>
              </select>
            </div>

            {/* Venue */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Venue
              </label>

              <input
                type="text"
                value={form.venue}
                onChange={(event) =>
                  handleChange(
                    "venue",
                    event.target.value
                  )
                }
                placeholder="Eg: IMMIQ Training Centre"
                className="w-full rounded-xl border border-white/10 bg-[#0c192b] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400/50"
              />
            </div>

            {/* Online Link */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Online Meeting Link
              </label>

              <input
                type="url"
                value={form.link}
                onChange={(event) =>
                  handleChange(
                    "link",
                    event.target.value
                  )
                }
                placeholder="https://..."
                className="w-full rounded-xl border border-white/10 bg-[#0c192b] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400/50"
              />
            </div>

            {/* Seats */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Total Seats
              </label>

              <input
                type="number"
                min="1"
                value={form.seatsTotal}
                onChange={(event) =>
                  handleChange(
                    "seatsTotal",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-[#0c192b] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
              />
            </div>

            {/* Filled Seats */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Seats Filled
              </label>

              <input
                type="number"
                min="0"
                value={form.seatsFilled}
                onChange={(event) =>
                  handleChange(
                    "seatsFilled",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-[#0c192b] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
              />
            </div>

            {/* Price Override */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Batch Price Override
              </label>

              <input
                type="number"
                min="0"
                value={form.priceOverride}
                onChange={(event) =>
                  handleChange(
                    "priceOverride",
                    event.target.value
                  )
                }
                placeholder="Leave empty to use course fee"
                className="w-full rounded-xl border border-white/10 bg-[#0c192b] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400/50"
              />
            </div>

            {/* Early Bird */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Early Bird Till
              </label>

              <input
                type="date"
                value={form.earlyBirdTill}
                onChange={(event) =>
                  handleChange(
                    "earlyBirdTill",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-[#0c192b] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Status
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  handleChange(
                    "status",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-[#0c192b] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
              >
                <option value="upcoming">
                  Upcoming
                </option>

                <option value="running">
                  Running
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Batch"
                  : "Create Batch"}
              </button>
            </div>
          </form>
        </div>

        {/* Batch List */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                All Batches
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {batches.length} batch
                {batches.length !== 1
                  ? "es"
                  : ""}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-slate-400">
              Loading batches...
            </div>
          ) : batches.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 py-12 text-center">
              <p className="text-sm text-slate-400">
                No batches created yet.
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Create your first batch using the form above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {batches.map((batch) => {
                const seatsTotal =
                  batch.seatsTotal ?? 0;

                const seatsFilled =
                  batch.seatsFilled ?? 0;

                const seatsLeft = Math.max(
                  seatsTotal - seatsFilled,
                  0
                );

                return (
                  <div
                    key={batch._id}
                    className="rounded-xl border border-white/10 bg-[#0a1627] p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-white">
                            {batch.name}
                          </h3>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getStatusClass(
                              batch.status
                            )}`}
                          >
                            {batch.status ||
                              "upcoming"}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-medium text-cyan-300">
                          {batch.course?.title ||
                            "Course unavailable"}
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-400 sm:grid-cols-4">
                          <div>
                            <span className="block text-slate-600">
                              Start
                            </span>

                            <span className="text-slate-300">
                              {formatDate(
                                batch.startDate
                              )}
                            </span>
                          </div>

                          <div>
                            <span className="block text-slate-600">
                              Mode
                            </span>

                            <span className="text-slate-300">
                              {batch.mode ||
                                "Online"}
                            </span>
                          </div>

                          <div>
                            <span className="block text-slate-600">
                              Seats
                            </span>

                            <span className="text-slate-300">
                              {seatsFilled}/
                              {seatsTotal}
                            </span>
                          </div>

                          <div>
                            <span className="block text-slate-600">
                              Available
                            </span>

                            <span className="text-slate-300">
                              {seatsLeft}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(batch)
                          }
                          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              batch._id
                            )
                          }
                          className="rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}