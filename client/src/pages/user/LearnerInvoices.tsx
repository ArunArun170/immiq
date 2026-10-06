import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  IndianRupee,
  Loader2,
  ReceiptText,
  RefreshCcw,
  XCircle,
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
  issuedAt: string;
  paidAt?: string;
};

type Transaction = {
  _id: string;
  courseTitle: string;
  orderId: string;
  paymentId?: string;
  invoiceNumber?: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed" | "refunded";
  method?: string;
  createdAt: string;
  paidAt?: string;
  failedAt?: string;
  refundedAt?: string;
};

const money = (amount: number, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const date = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

const statusMeta = (status: Transaction["status"]) => {
  switch (status) {
    case "paid":
      return {
        label: "Paid",
        icon: CheckCircle2,
        className:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      };
    case "failed":
      return {
        label: "Failed",
        icon: XCircle,
        className:
          "border-red-400/20 bg-red-400/10 text-red-300",
      };
    case "refunded":
      return {
        label: "Refunded",
        icon: RefreshCcw,
        className:
          "border-amber-400/20 bg-amber-400/10 text-amber-300",
      };
    default:
      return {
        label: "Payment started",
        icon: Clock3,
        className:
          "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
      };
  }
};

export default function LearnerInvoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("immiq_learner_token");

  const load = async () => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/invoices/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load payment history"
        );
      }

      setInvoices(data.invoices || []);
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load payment history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const paidTotal = useMemo(
    () =>
      invoices
        .filter((item) => item.paymentStatus === "paid")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [invoices]
  );

  const paidCount = invoices.filter(
    (item) => item.paymentStatus === "paid"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/portal"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Learner Portal
            </Link>

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              PHASE 2.5
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Invoices & Payment History
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              View your IMMIQ invoices, payment transactions and
              downloadable billing records in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300 disabled:opacity-50"
          >
            <RefreshCcw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Total paid
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {money(paidTotal)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
                <ReceiptText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Paid invoices
                </p>
                <p className="mt-1 text-2xl font-bold">{paidCount}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-violet-400/10 p-3 text-violet-300">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Transactions
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {transactions.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : (
          <>
            <section className="mt-10">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
                    Billing
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold">
                    Your invoices
                  </h2>
                </div>
                <span className="text-xs text-slate-600">
                  {invoices.length} record{invoices.length === 1 ? "" : "s"}
                </span>
              </div>

              {invoices.length === 0 ? (
                <div className="mt-5 rounded-3xl border border-dashed border-white/10 p-10 text-center">
                  <ReceiptText className="mx-auto h-10 w-10 text-slate-700" />
                  <p className="mt-4 text-sm text-slate-500">
                    No invoices have been generated yet.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid gap-4">
                  {invoices.map((invoice) => (
                    <article
                      key={invoice._id}
                      className="group rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.045] sm:p-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                              {invoice.invoiceNumber}
                            </p>
                            <h3 className="mt-1 text-lg font-semibold">
                              {invoice.courseTitle}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              Issued {date(invoice.issuedAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <div>
                            <p className="text-xs text-slate-600">Amount</p>
                            <p className="mt-1 text-xl font-bold">
                              {money(invoice.amount, invoice.currency)}
                            </p>
                          </div>

                          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {invoice.paymentStatus}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/portal/invoices/${invoice._id}`
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
                          >
                            View invoice
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-12 pb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
                  Transactions
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  Payment activity
                </h2>
              </div>

              {transactions.length === 0 ? (
                <div className="mt-5 rounded-3xl border border-dashed border-white/10 p-10 text-center text-sm text-slate-500">
                  No payment transactions recorded yet.
                </div>
              ) : (
                <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-slate-600">
                        <tr>
                          <th className="px-5 py-4">Course</th>
                          <th className="px-5 py-4">Date</th>
                          <th className="px-5 py-4">Amount</th>
                          <th className="px-5 py-4">Status</th>
                          <th className="px-5 py-4">Reference</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {transactions.map((transaction) => {
                          const meta = statusMeta(transaction.status);
                          const Icon = meta.icon;

                          return (
                            <tr
                              key={transaction._id}
                              className="hover:bg-white/[0.02]"
                            >
                              <td className="px-5 py-4">
                                <p className="font-medium text-slate-200">
                                  {transaction.courseTitle}
                                </p>
                                <p className="mt-1 text-xs text-slate-600">
                                  {transaction.invoiceNumber ||
                                    "No invoice yet"}
                                </p>
                              </td>
                              <td className="px-5 py-4 text-slate-400">
                                {date(transaction.createdAt)}
                              </td>
                              <td className="px-5 py-4 font-semibold">
                                {money(
                                  transaction.amount,
                                  transaction.currency
                                )}
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${meta.className}`}
                                >
                                  <Icon className="h-3.5 w-3.5" />
                                  {meta.label}
                                </span>
                              </td>
                              <td className="px-5 py-4 font-mono text-xs text-slate-500">
                                {transaction.paymentId ||
                                  transaction.orderId}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
