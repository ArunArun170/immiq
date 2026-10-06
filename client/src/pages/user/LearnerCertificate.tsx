import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

type Certificate = {
  certificateNumber: string;
  learnerName: string;
  courseTitle: string;
  issuedAt: string;
  status: "issued" | "revoked";
};

export default function LearnerCertificate() {
  const { certificateNumber } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!certificateNumber) return;
      try {
        const response = await fetch(
          `${API_URL}/certificates/verify/${encodeURIComponent(certificateNumber)}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Certificate not found");
        setCertificate(data.certificate);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Certificate not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [certificateNumber]);

  if (loading) {
    return <main className="min-h-screen bg-slate-950 px-5 py-20 text-white"><div className="mx-auto max-w-4xl">Loading certificate...</div></main>;
  }

  if (error || !certificate) {
    return (
      <main className="min-h-screen bg-slate-950 px-5 py-20 text-white">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-400/20 bg-red-400/5 p-8 text-center">
          <h1 className="text-2xl font-bold">Certificate unavailable</h1>
          <p className="mt-3 text-slate-400">{error || "Certificate not found"}</p>
          <button onClick={() => navigate("/portal/certificates")} className="mt-6 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950">Back to certificates</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link to="/portal/certificates" className="text-sm text-cyan-400">← My Certificates</Link>
          <button onClick={() => window.print()} className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950">Print / Save PDF</button>
        </div>

        <section className="rounded-[2rem] border border-cyan-300/30 bg-white/[0.04] p-6 shadow-2xl shadow-cyan-950/30 sm:p-12">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-8 text-center sm:p-14">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">IMMIQ</p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">Certificate of Completion</p>
            <div className="mx-auto mt-10 h-px max-w-xl bg-white/10" />
            <p className="mt-10 text-sm text-slate-400">This certificate is proudly awarded to</p>
            <h1 className="mt-4 text-3xl font-bold sm:text-5xl">{certificate.learnerName}</h1>
            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-slate-400">for successfully completing the learning requirements for</p>
            <h2 className="mt-3 text-2xl font-semibold text-cyan-300 sm:text-3xl">{certificate.courseTitle}</h2>
            <div className="mx-auto mt-10 h-px max-w-xl bg-white/10" />
            <div className="mt-8 grid gap-6 text-sm sm:grid-cols-2">
              <div><p className="text-slate-600">Certificate Number</p><p className="mt-1 font-semibold text-slate-200">{certificate.certificateNumber}</p></div>
              <div><p className="text-slate-600">Issued On</p><p className="mt-1 font-semibold text-slate-200">{new Date(certificate.issuedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p></div>
            </div>
            <p className="mt-10 text-xs text-slate-600">Verify this certificate at /verify/{certificate.certificateNumber}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
