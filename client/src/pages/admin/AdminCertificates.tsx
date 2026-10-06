import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck, XCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

type Certificate = {
  _id: string;
  certificateNumber: string;
  learnerName: string;
  courseTitle: string;
  issuedAt: string;
  status: "issued" | "revoked";
  learner?: { name?: string; email?: string };
};

export default function AdminCertificates() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const token = localStorage.getItem("immiq_admin_token");

  const load = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/certificates`, { headers: { Authorization: `Bearer ${token || ""}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load certificates");
      setItems(data.certificates || []);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const revoke = async (id: string) => {
    if (!window.confirm("Revoke this certificate? Public verification will no longer show it as valid.")) return;
    try {
      setRevoking(id);
      const response = await fetch(`${API_URL}/admin/certificates/${id}/revoke`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to revoke certificate");
      setItems((previous) => previous.map((item) => item._id === id ? { ...item, status: "revoked" } : item));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to revoke certificate");
    } finally {
      setRevoking(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Phase 2.4</p><h1 className="mt-2 text-3xl font-bold">Certificates</h1><p className="mt-2 text-sm text-slate-500">View issued certificates and manage verification status.</p></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">{items.length} certificates</div>
        </div>

        {loading ? <div className="flex min-h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div> : items.length === 0 ? <div className="mt-8 rounded-3xl border border-dashed border-white/10 p-12 text-center text-slate-500"><ShieldCheck className="mx-auto h-10 w-10 text-slate-700" /><p className="mt-4">No certificates issued yet.</p></div> : <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Certificate</th><th className="px-5 py-4">Learner</th><th className="px-5 py-4">Course</th><th className="px-5 py-4">Issued</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Action</th></tr></thead><tbody className="divide-y divide-white/10">{items.map((item) => <tr key={item._id} className="hover:bg-white/[0.02]"><td className="px-5 py-4 font-semibold text-cyan-300">{item.certificateNumber}</td><td className="px-5 py-4"><p className="font-medium">{item.learner?.name || item.learnerName}</p><p className="text-xs text-slate-600">{item.learner?.email || ""}</p></td><td className="px-5 py-4 text-slate-300">{item.courseTitle}</td><td className="px-5 py-4 text-slate-400">{new Date(item.issuedAt).toLocaleDateString("en-IN")}</td><td className="px-5 py-4">{item.status === "issued" ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300"><CheckCircle2 className="h-3 w-3" />Issued</span> : <span className="inline-flex items-center gap-1 rounded-full bg-red-400/10 px-3 py-1 text-xs font-semibold text-red-300"><XCircle className="h-3 w-3" />Revoked</span>}</td><td className="px-5 py-4">{item.status === "issued" && <button disabled={revoking === item._id} onClick={() => revoke(item._id)} className="rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs font-semibold text-red-300 disabled:opacity-50">{revoking === item._id ? "Revoking..." : "Revoke"}</button>}</td></tr>)}</tbody></table></div></div>}
      </div>
    </main>
  );
}
