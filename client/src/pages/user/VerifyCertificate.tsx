import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export default function VerifyCertificate() {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState<any>(null);
  const [status, setStatus] = useState("Loading...");

  const verify = async () => {
    if (!certificateId) return;
    try {
      const response = await fetch(`${API_URL}/certificates/verify/${encodeURIComponent(certificateId)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Certificate not found");
      setCertificate(data.certificate);
      setStatus("");
    } catch (error) {
      setCertificate(null);
      setStatus(error instanceof Error ? error.message : "Certificate not found");
    }
  };

  useEffect(() => {
    verify();
  }, [certificateId]);

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="text-sm text-cyan-400">← IMMIQ</Link>
        <h1 className="mt-3 text-3xl font-bold">Certificate Verification</h1>
        {status && <p className="mt-8 rounded-2xl border border-white/10 p-6 text-slate-400">{status}</p>}
        {certificate && (
          <section className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-7">
            <p className="text-xs uppercase tracking-widest text-cyan-400">Verified IMMIQ Certificate</p>
            <h2 className="mt-3 text-2xl font-bold">{certificate.courseTitle}</h2>
            <p className="mt-3 text-slate-300">Awarded to <strong>{certificate.learnerName}</strong></p>
            <p className="mt-2 text-sm text-slate-400">Certificate No: {certificate.certificateNumber}</p>
            <p className="mt-1 text-sm text-slate-400">Issued: {new Date(certificate.issuedAt).toLocaleDateString("en-IN")}</p>
          </section>
        )}
      </div>
    </main>
  );
}
