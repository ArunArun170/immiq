import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  ReceiptText,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

type Invoice = {
  _id: string;
  invoiceNumber: string;
  courseTitle: string;
  amount: number;
  currency: string;
  paymentStatus: "paid" | "refunded" | "cancelled";
  paymentId?: string;
  orderId?: string;
  billingName?: string;
  billingEmail?: string;
  billingPhone?: string;
  issuedAt: string;
  paidAt?: string;
  course?: { title?: string; slug?: string };
  enrollment?: {
    _id?: string;
    amount?: number;
    paymentStatus?: string;
    paymentId?: string;
    enrolledAt?: string;
  };
};

type Transaction = {
  _id: string;
  orderId: string;
  paymentId?: string;
  amount: number;
  currency: string;
  status: string;
  method?: string;
  createdAt: string;
  paidAt?: string;
};

const money = (amount: number, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const fullDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";

export default function LearnerInvoiceDetail() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("immiq_learner_token");

  useEffect(() => {
    const load = async () => {
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      if (!invoiceId) {
        setError("Invoice ID is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/invoices/my/${invoiceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load invoice"
          );
        }

        setInvoice(data.invoice);
        setTransactions(data.transactions || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load invoice"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [invoiceId, navigate, token]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </main>
    );
  }

  if (error || !invoice) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-400/20 bg-red-400/5 p-8 text-center">
          <h1 className="text-2xl font-bold">
            Invoice unavailable
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            {error || "Invoice not found"}
          </p>
          <button
            type="button"
            onClick={() => navigate("/portal/invoices")}
            className="mt-6 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950"
          >
            Back to invoices
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-black">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            to="/portal/invoices"
            className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Invoices
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            <Download className="h-4 w-4" />
            Print / Save PDF
          </button>
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20 print:rounded-none print:border-0 print:bg-white print:shadow-none">
          <div className="border-b border-white/10 bg-cyan-400/[0.06] p-6 sm:p-10 print:border-slate-200 print:bg-white">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300 print:border print:border-slate-200 print:text-slate-900">
                    <ReceiptText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400 print:text-slate-500">
                      IMMIQ
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                      Learning Invoice
                    </p>
                  </div>
                </div>
                <h1 className="mt-7 text-3xl font-bold">
                  Invoice
                </h1>
                <p className="mt-2 font-mono text-sm text-slate-400 print:text-slate-600">
                  {invoice.invoiceNumber}
                </p>
              </div>

              <div className="sm:text-right">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300 print:border-slate-300 print:bg-white print:text-slate-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {invoice.paymentStatus}
                </span>
                <p className="mt-3 text-sm text-slate-500">
                  Issued {fullDate(invoice.issuedAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Billed to
                </p>
                <p className="mt-3 text-lg font-semibold">
                  {invoice.billingName || "Learner"}
                </p>
                <p className="mt-1 text-sm text-slate-400 print:text-slate-600">
                  {invoice.billingEmail || "-"}
                </p>
                {invoice.billingPhone && (
                  <p className="mt-1 text-sm text-slate-400 print:text-slate-600">
                    {invoice.billingPhone}
                  </p>
                )}
              </div>

              <div className="sm:text-right">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Payment
                </p>
                <p className="mt-3 font-mono text-sm text-slate-300 print:text-slate-700">
                  {invoice.paymentId || "-"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Paid {fullDate(invoice.paidAt || invoice.issuedAt)}
                </p>
              </div>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 print:border-slate-200">
              <div className="grid gap-4 bg-white/[0.03] p-5 sm:grid-cols-[1fr_auto] sm:items-center print:bg-slate-50">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Training program
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">
                    {invoice.courseTitle}
                  </h2>
                </div>
                <p className="text-xl font-bold">
                  {money(invoice.amount, invoice.currency)}
                </p>
              </div>

              <div className="grid gap-4 border-t border-white/10 p-5 sm:grid-cols-3 print:border-slate-200">
                <div>
                  <p className="text-xs text-slate-600">
                    Currency
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {invoice.currency}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">
                    Order ID
                  </p>
                  <p className="mt-1 break-all font-mono text-xs text-slate-400 print:text-slate-600">
                    {invoice.orderId || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">
                    Enrollment
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {invoice.enrollment?._id
                      ? String(invoice.enrollment._id)
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-white/10 pt-7 print:border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-400 print:text-slate-600" />
                <p className="text-sm font-semibold">
                  Payment activity
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between print:border-slate-200 print:bg-white"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {transaction.status}
                      </p>
                      <p className="mt-1 break-all font-mono text-xs text-slate-500">
                        {transaction.paymentId ||
                          transaction.orderId}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-semibold">
                        {money(
                          transaction.amount,
                          transaction.currency
                        )}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {fullDate(
                          transaction.paidAt ||
                            transaction.createdAt
                        )}
                      </p>
                    </div>
                  </div>
                ))}

                {transactions.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No transaction details available.
                  </p>
                )}
              </div>
            </div>

            <p className="mt-10 text-xs leading-5 text-slate-600">
              This invoice is generated electronically by IMMIQ for
              the learner training enrollment shown above.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
