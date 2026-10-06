import { useEffect, useMemo, useState } from "react";
import { Award, CheckCircle2, Loader2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

type Lesson = { _id: string; title: string; description?: string; content?: string; videoUrl?: string; duration?: string; completed?: boolean; order: number };
type Module = { _id: string; title: string; description?: string; lessons: Lesson[]; order: number };
type Certificate = { certificateNumber: string };

export default function LearnerCourse() {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState({ totalLessons: 0, completedLessons: 0, percentage: 0 });
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);
  const [error, setError] = useState("");
  const [certificateMessage, setCertificateMessage] = useState("");
  const token = localStorage.getItem("immiq_learner_token");

  const load = async () => {
    if (!token || !enrollmentId) { navigate("/login", { replace: true }); return; }
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/learning/enrollments/${enrollmentId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load course");
      setModules(data.modules || []);
      setProgress(data.progress || { totalLessons: 0, completedLessons: 0, percentage: 0 });
      const first = (data.modules || []).flatMap((m: Module) => m.lessons)[0];
      setSelected(first || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load course");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [enrollmentId]);

  const markComplete = async () => {
    if (!selected || !enrollmentId || !token || selected.completed) return;
    try {
      setCompleting(true);
      const response = await fetch(`${API_URL}/learning/enrollments/${enrollmentId}/lessons/${selected._id}/complete`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update progress");
      setProgress(data.progress);
      setModules((previous) => previous.map((module) => ({ ...module, lessons: module.lessons.map((lesson) => lesson._id === selected._id ? { ...lesson, completed: true } : lesson) })));
      setSelected({ ...selected, completed: true });
      if (data.progress?.percentage === 100) setCertificateMessage("Course completed. Your certificate is ready to generate.");
    } catch (err) { setCertificateMessage(err instanceof Error ? err.message : "Unable to update progress"); }
    finally { setCompleting(false); }
  };

  const generateCertificate = async () => {
    if (!enrollmentId || !token || progress.percentage < 100) return;
    try {
      setGeneratingCertificate(true);
      setCertificateMessage("");
      const response = await fetch(`${API_URL}/certificates/generate/${enrollmentId}`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to generate certificate");
      setCertificate(data.certificate);
    } catch (err) { setCertificateMessage(err instanceof Error ? err.message : "Unable to generate certificate"); }
    finally { setGeneratingCertificate(false); }
  };

  const next = useMemo(() => {
    const all = modules.flatMap((module) => module.lessons);
    const index = all.findIndex((lesson) => lesson._id === selected?._id);
    return index >= 0 ? all[index + 1] : undefined;
  }, [modules, selected]);

  if (loading) return <main className="min-h-screen bg-slate-950 px-5 py-20 text-white"><div className="mx-auto max-w-6xl">Loading your course...</div></main>;
  if (error) return <main className="min-h-screen bg-slate-950 px-5 py-20 text-white"><div className="mx-auto max-w-2xl rounded-2xl border border-red-400/20 bg-red-400/5 p-6">{error}</div></main>;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><Link to="/portal" className="text-sm text-cyan-400">← Learner Portal</Link><h1 className="mt-2 text-3xl font-bold">Learning Workspace</h1><p className="mt-1 text-slate-400">Complete lessons and track your course progress.</p></div>
          <div className="min-w-56"><div className="flex justify-between text-xs text-slate-400"><span>Progress</span><span>{progress.percentage}%</span></div><div className="mt-2 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-cyan-400 transition-all" style={{ width: `${progress.percentage}%` }} /></div></div>
        </div>

        {progress.percentage === 100 && (
          <section className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><div className="flex items-center gap-2 text-emerald-300"><CheckCircle2 className="h-5 w-5" /><span className="font-bold">Course completed</span></div><p className="mt-1 text-sm text-slate-400">Congratulations! Generate your official IMMIQ certificate.</p></div>
              {certificate ? <Link to={`/portal/certificates/${certificate.certificateNumber}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950"><Award className="h-4 w-4" />View Certificate</Link> : <button onClick={generateCertificate} disabled={generatingCertificate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 disabled:opacity-60">{generatingCertificate ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}{generatingCertificate ? "Generating..." : "Generate Certificate"}</button>}
            </div>
            {certificateMessage && <p className="mt-3 text-sm text-slate-400">{certificateMessage}</p>}
          </section>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="mb-4 text-xs font-semibold uppercase tracking-widest text-cyan-400">Course modules</p>{modules.map((module) => <div key={module._id} className="mb-5"><h2 className="font-semibold">{module.title}</h2><div className="mt-2 space-y-1">{module.lessons.map((lesson) => <button key={lesson._id} onClick={() => setSelected(lesson)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${selected?._id === lesson._id ? "bg-cyan-400/10 text-cyan-300" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><span className="truncate">{lesson.title}</span><span>{lesson.completed ? "✓" : ""}</span></button>)}</div></div>)}</aside>
          <section className="min-h-[520px] rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">
            {selected ? <><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-widest text-cyan-400">Lesson</p><h2 className="mt-2 text-2xl font-bold">{selected.title}</h2></div>{selected.duration && <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">{selected.duration}</span>}</div>{selected.videoUrl && <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-black"><video controls className="w-full" src={selected.videoUrl} /></div>}<div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-300">{selected.content || selected.description || "Lesson content will appear here."}</div><div className="mt-8 flex flex-wrap gap-3"><button disabled={selected.completed || completing} onClick={markComplete} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">{completing && <Loader2 className="h-4 w-4 animate-spin" />}{selected.completed ? "Lesson completed" : completing ? "Saving..." : "Mark lesson complete"}</button>{next && <button onClick={() => setSelected(next)} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/5">Next lesson →</button>}</div></> : <div className="flex h-full items-center justify-center text-slate-400">No lessons available yet.</div>}
          </section>
        </div>
      </div>
    </main>
  );
}
