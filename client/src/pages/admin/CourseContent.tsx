import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Edit3,
  FileText,
  Film,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://immiq.onrender.com/api/v1";

type Lesson = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  videoUrl: string;
  duration: string;
  order: number;
  freePreview: boolean;
  active: boolean;
};

type CourseModule = {
  _id: string;
  title: string;
  description: string;
  order: number;
  active: boolean;
  lessons: Lesson[];
};

type ContentResponse = {
  success?: boolean;
  message?: string;
  course?: { _id: string; title: string; slug?: string };
  modules?: CourseModule[];
};

type ModuleForm = {
  title: string;
  description: string;
  order: string;
  active: boolean;
};

type LessonForm = {
  title: string;
  slug: string;
  description: string;
  content: string;
  videoUrl: string;
  duration: string;
  order: string;
  freePreview: boolean;
  active: boolean;
};

const emptyModule: ModuleForm = { title: "", description: "", order: "1", active: true };
const emptyLesson: LessonForm = {
  title: "", slug: "", description: "", content: "", videoUrl: "", duration: "", order: "1", freePreview: false, active: true,
};

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function CourseContent() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const token = localStorage.getItem("immiq_admin_token");

  const [courseTitle, setCourseTitle] = useState("Course Content");
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const [moduleForm, setModuleForm] = useState<ModuleForm>(emptyModule);
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [showModuleForm, setShowModuleForm] = useState(false);

  const [lessonForm, setLessonForm] = useState<LessonForm>(emptyLesson);
  const [lessonModuleId, setLessonModuleId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);

  const headers = useMemo(() => ({ Authorization: `Bearer ${token || ""}` }), [token]);
  const jsonHeaders = useMemo(() => ({ "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` }), [token]);

  const load = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/course-content/${courseId}`, { headers });
      const data = (await response.json()) as ContentResponse;
      if (!response.ok) throw new Error(data.message || "Failed to load course content");
      setCourseTitle(data.course?.title || "Course Content");
      const sorted = [...(data.modules || [])].sort((a, b) => a.order - b.order);
      setModules(sorted);
      setExpanded(Object.fromEntries(sorted.map((module) => [module._id, true])));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to load course content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [courseId]);

  const resetModule = () => {
    setModuleForm(emptyModule);
    setEditingModule(null);
    setShowModuleForm(false);
  };

  const resetLesson = () => {
    setLessonForm(emptyLesson);
    setLessonModuleId(null);
    setEditingLesson(null);
  };

  const saveModule = async (event: FormEvent) => {
    event.preventDefault();
    if (!courseId || !moduleForm.title.trim()) return alert("Module title is required.");
    try {
      setSaving(true);
      const editing = Boolean(editingModule);
      const url = editing
        ? `${API_URL}/admin/course-content/modules/${editingModule}`
        : `${API_URL}/admin/course-content/${courseId}/modules`;
      const response = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: jsonHeaders,
        body: JSON.stringify({
          title: moduleForm.title.trim(),
          description: moduleForm.description.trim(),
          order: Number(moduleForm.order) || 0,
          active: moduleForm.active,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save module");
      resetModule();
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save module");
    } finally { setSaving(false); }
  };

  const removeModule = async (moduleId: string) => {
    if (!window.confirm("Delete this module and all its lessons?")) return;
    try {
      setDeleting(`module-${moduleId}`);
      const response = await fetch(`${API_URL}/admin/course-content/modules/${moduleId}`, { method: "DELETE", headers });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete module");
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete module");
    } finally { setDeleting(null); }
  };

  const saveLesson = async (event: FormEvent) => {
    event.preventDefault();
    if (!lessonModuleId || !lessonForm.title.trim()) return alert("Lesson title is required.");
    try {
      setSaving(true);
      const editing = Boolean(editingLesson);
      const url = editing
        ? `${API_URL}/admin/course-content/modules/${lessonModuleId}/lessons/${editingLesson}`
        : `${API_URL}/admin/course-content/${lessonModuleId}/lessons`;
      const response = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: jsonHeaders,
        body: JSON.stringify({
          title: lessonForm.title.trim(), slug: lessonForm.slug.trim() || slugify(lessonForm.title),
          description: lessonForm.description.trim(), content: lessonForm.content,
          videoUrl: lessonForm.videoUrl.trim(), duration: lessonForm.duration.trim(),
          order: Number(lessonForm.order) || 0, freePreview: lessonForm.freePreview, active: lessonForm.active,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save lesson");
      resetLesson();
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save lesson");
    } finally { setSaving(false); }
  };

  const removeLesson = async (moduleId: string, lessonId: string) => {
    if (!window.confirm("Delete this lesson?")) return;
    try {
      setDeleting(`lesson-${lessonId}`);
      const response = await fetch(`${API_URL}/admin/course-content/modules/${moduleId}/lessons/${lessonId}`, { method: "DELETE", headers });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete lesson");
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete lesson");
    } finally { setDeleting(null); }
  };

  const startNewModule = () => {
    setModuleForm({ ...emptyModule, order: String(modules.length + 1) });
    setEditingModule(null);
    setShowModuleForm(true);
  };

  const startEditModule = (module: CourseModule) => {
    setModuleForm({ title: module.title, description: module.description || "", order: String(module.order), active: module.active });
    setEditingModule(module._id);
    setShowModuleForm(true);
  };

  const startNewLesson = (module: CourseModule) => {
    setLessonForm({ ...emptyLesson, order: String(module.lessons.length + 1) });
    setLessonModuleId(module._id);
    setEditingLesson(null);
  };

  const startEditLesson = (moduleId: string, lesson: Lesson) => {
    setLessonModuleId(moduleId);
    setEditingLesson(lesson._id);
    setLessonForm({
      title: lesson.title, slug: lesson.slug, description: lesson.description || "", content: lesson.content || "",
      videoUrl: lesson.videoUrl || "", duration: lesson.duration || "", order: String(lesson.order),
      freePreview: lesson.freePreview, active: lesson.active,
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <button onClick={() => navigate("/admin/courses")} className="mt-1 rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></button>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Phase 2.3 · Admin CMS</p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Course Content</h1>
              <p className="mt-1 text-sm text-slate-500">{courseTitle}</p>
            </div>
          </div>
          <button onClick={startNewModule} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300"><Plus className="h-4 w-4" />Add Module</button>
        </header>

        {showModuleForm && (
          <section className="mt-7 rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-cyan-400">{editingModule ? "Edit" : "New"} Module</p><h2 className="mt-1 text-2xl font-bold">{editingModule ? "Update module" : "Create module"}</h2></div><button onClick={resetModule} className="rounded-xl border border-white/10 p-2 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button></div>
            <form onSubmit={saveModule} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-[1fr_180px]">
                <label className="text-sm font-medium text-slate-300">Title *<input value={moduleForm.title} onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400/50" placeholder="Module 1 - Introduction" /></label>
                <label className="text-sm font-medium text-slate-300">Order<input type="number" value={moduleForm.order} onChange={(e) => setModuleForm({ ...moduleForm, order: e.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400/50" /></label>
              </div>
              <label className="block text-sm font-medium text-slate-300">Description<textarea rows={3} value={moduleForm.description} onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400/50" /></label>
              <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={moduleForm.active} onChange={(e) => setModuleForm({ ...moduleForm, active: e.target.checked })} className="h-4 w-4 accent-cyan-400" />Active module</label>
              <div className="flex justify-end gap-3"><button type="button" onClick={resetModule} className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-400">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{editingModule ? "Update Module" : "Create Module"}</button></div>
            </form>
          </section>
        )}

        {lessonModuleId && (
          <section className="mt-7 rounded-3xl border border-indigo-400/20 bg-indigo-400/[0.04] p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-indigo-300">{editingLesson ? "Edit" : "New"} Lesson</p><h2 className="mt-1 text-2xl font-bold">{editingLesson ? "Update lesson" : "Create lesson"}</h2></div><button onClick={resetLesson} className="rounded-xl border border-white/10 p-2 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button></div>
            <form onSubmit={saveLesson} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-300">Title *<input value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value, slug: editingLesson ? lessonForm.slug : slugify(e.target.value) })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-400/50" placeholder="Introduction to React" /></label>
                <label className="text-sm font-medium text-slate-300">Slug<input value={lessonForm.slug} onChange={(e) => setLessonForm({ ...lessonForm, slug: e.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-400/50" /></label>
                <label className="text-sm font-medium text-slate-300">Duration<input value={lessonForm.duration} onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-400/50" placeholder="20 min" /></label>
                <label className="text-sm font-medium text-slate-300">Order<input type="number" value={lessonForm.order} onChange={(e) => setLessonForm({ ...lessonForm, order: e.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-400/50" /></label>
              </div>
              <label className="block text-sm font-medium text-slate-300">Description<textarea rows={3} value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-400/50" /></label>
              <label className="block text-sm font-medium text-slate-300"><span className="flex items-center gap-2"><FileText className="h-4 w-4 text-indigo-300" />Lesson Content</span><textarea rows={9} value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 leading-7 outline-none focus:border-indigo-400/50" placeholder="Write the lesson content here..." /></label>
              <label className="block text-sm font-medium text-slate-300"><span className="flex items-center gap-2"><Film className="h-4 w-4 text-indigo-300" />Video URL</span><input value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-400/50" placeholder="https://www.youtube.com/embed/..." /></label>
              <div className="flex flex-wrap gap-6"><label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={lessonForm.freePreview} onChange={(e) => setLessonForm({ ...lessonForm, freePreview: e.target.checked })} className="h-4 w-4 accent-indigo-400" />Free preview</label><label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={lessonForm.active} onChange={(e) => setLessonForm({ ...lessonForm, active: e.target.checked })} className="h-4 w-4 accent-indigo-400" />Active</label></div>
              <div className="flex justify-end gap-3"><button type="button" onClick={resetLesson} className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-400">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-400 px-6 py-3 text-sm font-bold text-slate-950 disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{editingLesson ? "Update Lesson" : "Create Lesson"}</button></div>
            </form>
          </section>
        )}

        <section className="mt-7">
          {loading ? <div className="flex min-h-64 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div> : modules.length === 0 ? <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center"><BookOpen className="mx-auto h-10 w-10 text-slate-700" /><h2 className="mt-4 text-xl font-bold">No modules yet</h2><p className="mt-2 text-sm text-slate-500">Create the first module to start building this course.</p></div> : <div className="space-y-4">
            {modules.map((module, index) => {
              const open = expanded[module._id] ?? true;
              const lessons = [...module.lessons].sort((a, b) => a.order - b.order);
              return <article key={module._id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <button onClick={() => setExpanded({ ...expanded, [module._id]: !open })} className="flex min-w-0 items-start gap-4 text-left"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 font-bold text-cyan-300">{index + 1}</span><span><span className="flex items-center gap-2 text-lg font-bold">{open ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}{module.title}</span>{module.description && <span className="mt-1 block text-sm text-slate-500">{module.description}</span>}<span className="mt-2 block text-xs text-slate-600">{lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}</span></span></button>
                  <div className="flex flex-wrap gap-2"><span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${module.active ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-red-400/20 bg-red-400/10 text-red-300"}`}>{module.active ? "Active" : "Inactive"}</span><button onClick={() => startEditModule(module)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300"><Edit3 className="h-4 w-4" />Edit</button><button disabled={deleting === `module-${module._id}`} onClick={() => removeModule(module._id)} className="inline-flex items-center gap-2 rounded-xl border border-red-400/10 px-3 py-2 text-xs font-semibold text-red-300 disabled:opacity-50">{deleting === `module-${module._id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}Delete</button></div>
                </div>
                {open && <div className="border-t border-white/10 bg-black/10 p-4 sm:p-6"><div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">Lessons</p><p className="mt-1 text-sm text-slate-500">Build the learning sequence.</p></div><button onClick={() => startNewLesson(module)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-400 px-4 py-2.5 text-xs font-bold text-slate-950"><Plus className="h-4 w-4" />Add Lesson</button></div>{lessons.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 p-7 text-center text-sm text-slate-600">No lessons in this module.</div> : <div className="space-y-3">{lessons.map((lesson, lessonIndex) => <div key={lesson._id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex min-w-0 items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-slate-400">{lessonIndex + 1}</span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{lesson.title}</h3>{lesson.freePreview && <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-300">Preview</span>}<span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${lesson.active ? "border-emerald-400/20 text-emerald-300" : "border-red-400/20 text-red-300"}`}>{lesson.active ? "Active" : "Inactive"}</span></div><p className="mt-1 text-xs text-slate-600">{lesson.duration || "No duration"}{lesson.videoUrl ? " · Video" : ""} · Order {lesson.order}</p></div></div><div className="flex gap-2"><button onClick={() => startEditLesson(module._id, lesson)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300"><Edit3 className="h-4 w-4" />Edit</button><button disabled={deleting === `lesson-${lesson._id}`} onClick={() => removeLesson(module._id, lesson._id)} className="inline-flex items-center gap-2 rounded-xl border border-red-400/10 px-3 py-2 text-xs font-semibold text-red-300 disabled:opacity-50">{deleting === `lesson-${lesson._id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}Delete</button></div></div>)}</div>}</div>}
              </article>;
            })}
          </div>}
        </section>
      </div>
    </main>
  );
}
