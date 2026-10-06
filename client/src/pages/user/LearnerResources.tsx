import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ExternalLink, FileText, Link2, Search, Video, ClipboardCheck, FolderOpen } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

type Resource = {
  _id: string;
  title: string;
  description?: string;
  type: "PDF" | "Video" | "Link" | "Notes" | "Assignment" | "Other";
  url: string;
  course?: { _id?: string; title?: string; slug?: string } | null;
};

const icons = { PDF: FileText, Video, Link: Link2, Notes: BookOpen, Assignment: ClipboardCheck, Other: FolderOpen };

export default function LearnerResources() {
  const token = localStorage.getItem("immiq_learner_token") || "";
  const [items, setItems] = useState<Resource[]>([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/resources/my`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to load resources");
        setItems(data.resources || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load resources");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const filtered = useMemo(() => items.filter((item) => {
    const matchesType = type === "All" || item.type === type;
    const haystack = `${item.title} ${item.description || ""} ${item.course?.title || ""}`.toLowerCase();
    return matchesType && haystack.includes(query.toLowerCase());
  }), [items, query, type]);

  const types = ["All", ...Array.from(new Set(items.map((item) => item.type)))];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/portal" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300">← Back to portal</Link>
        <section className="mt-5 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-cyan-950/40 p-6 sm:p-8">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">IMMIQ LEARNING LIBRARY</span>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Learning Resources</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Guides, videos, notes, assignments and useful links available for your learning journey.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search resources..." className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400/50" /></label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm outline-none focus:border-cyan-400/50">{types.map((item) => <option key={item}>{item}</option>)}</select>
          </div>
        </section>

        {error && <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</div>}
        {loading ? <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><div className="h-48 animate-pulse rounded-3xl bg-white/5" /><div className="h-48 animate-pulse rounded-3xl bg-white/5" /><div className="h-48 animate-pulse rounded-3xl bg-white/5" /></div> : filtered.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((resource) => { const Icon = icons[resource.type] || FolderOpen; return <a key={resource._id} href={resource.url} target="_blank" rel="noreferrer" className="group rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/[0.055]"><div className="flex items-start justify-between gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300"><Icon className="h-5 w-5" /></span><ExternalLink className="h-4 w-4 text-slate-600 transition group-hover:text-cyan-400" /></div><p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-cyan-400">{resource.type}</p><h2 className="mt-2 font-bold leading-6">{resource.title}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{resource.description || "Learning resource from IMMIQ."}</p>{resource.course?.title && <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500"><BookOpen className="h-3.5 w-3.5" />{resource.course.title}</div>}</a>; })}</div> : <div className="mt-8 rounded-3xl border border-dashed border-white/10 px-6 py-14 text-center text-sm text-slate-400"><FolderOpen className="mx-auto h-8 w-8 text-slate-600" /><p className="mt-3">No matching resources found.</p></div>}
      </div>
    </main>
  );
}
