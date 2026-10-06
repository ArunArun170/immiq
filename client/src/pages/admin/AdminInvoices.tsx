import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
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
  paymentStatus: string;
  paymentId?: string;
  issuedAt: string;
  learner?: {
    name?: string;
    email?: string;
  };
};

type Transaction = {
  _id: string;
  courseTitle: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed" | "refunded";
  orderId: string;
  paymentId?: string;
  createdAt: string;
  learner?: {
    name?: string;
    email?: string;
  };
};

const money = (amount: number, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const date = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const status = (value: string) => {
  if (value === "paid") {
    return {
      label: "Paid",
      icon: CheckCircle2,
      className:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    };
  }

  if (value === "failed") {
    return {
      label: "Failed",
      icon: XCircle,
      className:
        "border-red-400/20 bg-red-400/10 text-red-300",
    };
  }

  if (value === "refunded") {
    return {
      label: "Refunded",
      icon: RefreshCcw,
      className:
        "border-amber-400/20 bg-amber-400/10 text-amber-300",
    };
  }

  return {
    label: "Payment started",
    icon: Clock3,
    className:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  };
};

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("immiq_admin_token");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/invoices`,
        {
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load invoices"
        );
      }

      setInvoices(data.invoices || []);
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load invoices"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const revenue = useMemo(
    () =>
      invoices
        .filter((item) => item.paymentStatus === "paid")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [invoices]
  );

  const paidTransactions = transactions.filter(
    (item) => item.status === "paid"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
              PHASE 2.5
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Invoices & Payments
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Monitor learner billing records and payment transactions
              across the IMMIQ learning platform.
            </p>
          </div>

          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-slate-300 hover:border-cyan-400/30 hover:text-cyan-300 disabled:opacity-50"
          >
            <RefreshCcw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </header>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-slate-600">
              Paid revenue
            </p>
            <div className="mt-3 flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-cyan-400" />
              <p className="text-2xl font-bold">{money(revenue)}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-slate-600">
              Invoices
            </p>
            <p className="mt-3 text-2xl font-bold">
              {invoices.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-slate-600">
              Successful payments
            </p>
            <p className="mt-3 text-2xl font-bold">
              {paidTransactions}
            </p>
          </div>
        </section>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center">
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
                    Issued invoices
                  </h2>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-slate-600">
                      <tr>
                        <th className="px-5 py-4">Invoice</th>
                        <th className="px-5 py-4">Learner</th>
                        <th className="px-5 py-4">Course</th>
                        <th className="px-5 py-4">Amount</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Issued</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {invoices.map((invoice) => (
                        <tr
                          key={invoice._id}
                          className="hover:bg-white/[0.02]"
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold text-cyan-300">
                              {invoice.invoiceNumber}
                            </p>
                            <p className="mt-1 font-mono text-[11px] text-slate-600">
                              {invoice.paymentId || "-"}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-medium text-slate-200">
                              {invoice.learner?.name || "Learner"}
                            </p>
                            <p className="mt-1 text-xs text-slate-600">
                              {invoice.learner?.email || ""}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-slate-300">
                            {invoice.courseTitle}
                          </td>
                          <td className="px-5 py-4 font-semibold">
                            {money(
                              invoice.amount,
                              invoice.currency
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {invoice.paymentStatus}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-slate-500">
                            {date(invoice.issuedAt)}
                          </td>
                        </tr>
                      ))}

                      {invoices.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-5 py-12 text-center text-slate-600"
                          >
                            No invoices available yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="mt-10 pb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
                  Transactions
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  Payment activity
                </h2>
              </div>

              <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-slate-600">
                      <tr>
                        <th className="px-5 py-4">Learner</th>
                        <th className="px-5 py-4">Course</th>
                        <th className="px-5 py-4">Amount</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Reference</th>
                        <th className="px-5 py-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {transactions.map((transaction) => {
                        const meta = status(transaction.status);
                        const Icon = meta.icon;

                        return (
                          <tr
                            key={transaction._id}
                            className="hover:bg-white/[0.02]"
                          >
                            <td className="px-5 py-4">
                              <p className="font-medium">
                                {transaction.learner?.name ||
                                  "Learner"}
                              </p>
                              <p className="mt-1 text-xs text-slate-600">
                                {transaction.learner?.email || ""}
                              </p>
                            </td>
                            <td className="px-5 py-4 text-slate-300">
                              {transaction.courseTitle}
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
                            <td className="px-5 py-4 text-slate-500">
                              {date(transaction.createdAt)}
                            </td>
                          </tr>
                        );
                      })}

                      {transactions.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-5 py-12 text-center text-slate-600"
                          >
                            No payment transactions available yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
