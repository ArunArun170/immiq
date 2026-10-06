import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, Clock3, ExternalLink, MapPin, Video, XCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

type EventItem = {
  _id: string;
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  mode?: "Online" | "Offline" | "Hybrid";
  venue?: string;
  link?: string;
};

type Registration = {
  _id: string;
  status: "registered" | "cancelled";
  event?: EventItem;
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

export default function LearnerEvents() {
  const token = localStorage.getItem("immiq_learner_token") || "";
  const [events, setEvents] = useState<EventItem[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [tab, setTab] = useState<"upcoming" | "registered">("upcoming");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [eventsResponse, registrationsResponse] = await Promise.all([
        fetch(`${API_URL}/events`),
        fetch(`${API_URL}/events/my`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const eventsData = await eventsResponse.json();
      const registrationsData = await registrationsResponse.json();
      if (!eventsResponse.ok) throw new Error(eventsData.message || "Failed to load events");
      if (!registrationsResponse.ok) throw new Error(registrationsData.message || "Failed to load registrations");
      setEvents(eventsData.events || []);
      setRegistrations(registrationsData.registrations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const activeRegistrationMap = useMemo(() => {
    const map = new Map<string, Registration>();
    registrations.forEach((registration) => {
      if (registration.event?._id) map.set(registration.event._id, registration);
    });
    return map;
  }, [registrations]);

  const register = async (id: string) => {
    try {
      setBusyId(id);
      setMessage("");
      const response = await fetch(`${API_URL}/events/${id}/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to register");
      setMessage("You are registered for this event.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register");
    } finally {
      setBusyId("");
    }
  };

  const cancel = async (id: string) => {
    if (!window.confirm("Cancel your registration for this event?")) return;
    try {
      setBusyId(id);
      setMessage("");
      const response = await fetch(`${API_URL}/events/${id}/register`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to cancel registration");
      setMessage("Event registration cancelled.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to cancel registration");
    } finally {
      setBusyId("");
    }
  };

  const registered = registrations.filter((item) => item.status === "registered" && item.event);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/portal" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300">← Back to portal</Link>

        <section className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-cyan-950/40 p-6 shadow-2xl sm:p-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">IMMIQ LEARNING</span>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Events & Webinars</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">Join practical sessions, technology discussions and live learning experiences curated for IMMIQ learners.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={() => setTab("upcoming")} className={`rounded-xl px-4 py-2.5 text-sm font-bold ${tab === "upcoming" ? "bg-cyan-400 text-slate-950" : "bg-white/10 text-white hover:bg-white/15"}`}>Upcoming events</button>
            <button onClick={() => setTab("registered")} className={`rounded-xl px-4 py-2.5 text-sm font-bold ${tab === "registered" ? "bg-cyan-400 text-slate-950" : "bg-white/10 text-white hover:bg-white/15"}`}>My registrations ({registered.length})</button>
          </div>
        </section>

        {message && <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{message}</div>}
        {error && <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</div>}

        {loading ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2"><div className="h-56 animate-pulse rounded-3xl bg-white/5" /><div className="h-56 animate-pulse rounded-3xl bg-white/5" /></div>
        ) : tab === "upcoming" ? (
          events.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {events.map((event) => {
                const registration = activeRegistrationMap.get(event._id);
                const isRegistered = registration?.status === "registered";
                return (
                  <article key={event._id} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-cyan-400/30 hover:bg-white/[0.05]">
                    <div className="flex items-start justify-between gap-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-300"><CalendarDays className="h-4 w-4" />{formatDate(event.date)}</span>
                      <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">{event.mode || "Online"}</span>
                    </div>
                    <h2 className="mt-5 text-xl font-bold">{event.title}</h2>
                    <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{event.description || "IMMIQ learning event."}</p>
                    <div className="mt-5 space-y-2 text-sm text-slate-300">
                      <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-cyan-400" />{formatTime(event.date)}{event.endDate ? ` – ${formatTime(event.endDate)}` : ""}</div>
                      {event.venue && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-cyan-400" />{event.venue}</div>}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {isRegistered ? (
                        <>
                          <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-400/10 px-4 py-2.5 text-sm font-bold text-emerald-300"><CheckCircle2 className="h-4 w-4" />Registered</span>
                          <button onClick={() => cancel(event._id)} disabled={busyId === event._id} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 disabled:opacity-50"><XCircle className="h-4 w-4" />{busyId === event._id ? "Cancelling..." : "Cancel"}</button>
                          {event.link && <a href={event.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-bold hover:bg-indigo-400"><Video className="h-4 w-4" />Join event<ExternalLink className="h-3.5 w-3.5" /></a>}
                        </>
                      ) : (
                        <button onClick={() => register(event._id)} disabled={busyId === event._id} className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50">{busyId === event._id ? "Registering..." : "Register now"}</button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : <EmptyState text="No upcoming events are published yet." />
        ) : registered.length ? (
          <div className="mt-8 grid gap-4">{registered.map((registration) => registration.event && <article key={registration._id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Registered</p><h2 className="mt-1 text-lg font-bold">{registration.event.title}</h2><p className="mt-1 text-sm text-slate-400">{formatDate(registration.event.date)} · {registration.event.mode || "Online"}</p></div>{registration.event.link && <a href={registration.event.link} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-bold">Join event <ExternalLink className="h-4 w-4" /></a>}</div></article>)}</div>
        ) : <EmptyState text="You have not registered for any upcoming event." />}
      </div>
    </main>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center text-sm text-slate-400"><CalendarDays className="mx-auto h-8 w-8 text-slate-600" /><p className="mt-3">{text}</p></div>;
}
