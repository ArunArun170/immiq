import { useEffect, useMemo, useState } from "react";

type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "closed";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject?: string;
  message: string;
  type: string;
  status: LeadStatus;
  notes?: string;
  source?: string;
  createdAt: string;
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

const statuses: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "closed",
];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] =
    useState<Lead | null>(null);
  const [filter, setFilter] = useState("all");
  const [saving, setSaving] = useState(false);

  const token =
    localStorage.getItem("immiq_admin_token") || "";

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/leads`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateLead = async (
    id: string,
    status: LeadStatus,
    notes: string
  ) => {
    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/admin/leads/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            notes,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setLeads((current) =>
          current.map((lead) =>
            lead._id === id ? data.lead : lead
          )
        );

        setSelectedLead(data.lead);
      }
    } catch (error) {
      console.error("Failed to update lead:", error);
    } finally {
      setSaving(false);
    }
  };

  const filteredLeads = useMemo(() => {
    if (filter === "all") return leads;

    return leads.filter(
      (lead) => lead.status === filter
    );
  }, [leads, filter]);

  const stats = {
    total: leads.length,
    new: leads.filter(
      (lead) => lead.status === "new"
    ).length,
    contacted: leads.filter(
      (lead) => lead.status === "contacted"
    ).length,
    qualified: leads.filter(
      (lead) => lead.status === "qualified"
    ).length,
    converted: leads.filter(
      (lead) => lead.status === "converted"
    ).length,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
              CRM / Leads
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Leads
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Manage website enquiries, track prospects and
              move opportunities through your sales pipeline.
            </p>
          </div>

          <button
            onClick={fetchLeads}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            Refresh Leads
          </button>
        </div>

        {/* STATS */}

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {[
            ["Total", stats.total],
            ["New", stats.new],
            ["Contacted", stats.contacted],
            ["Qualified", stats.qualified],
            ["Converted", stats.converted],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-sm text-slate-400">
                {label}
              </p>

              <p className="mt-2 text-2xl font-bold">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* FILTER */}

        <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
          {["all", ...statuses].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === status
                  ? "bg-cyan-400 text-slate-950"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {status === "all"
                ? "All Leads"
                : status.charAt(0).toUpperCase() +
                  status.slice(1)}
            </button>
          ))}
        </div>

        {/* CONTENT */}

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">

          {/* LEADS LIST */}

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            {loading ? (
              <div className="p-10 text-center text-slate-400">
                Loading leads...
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-lg font-semibold">
                  No leads found
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Website enquiries will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {filteredLeads.map((lead) => (
                  <button
                    key={lead._id}
                    onClick={() =>
                      setSelectedLead(lead)
                    }
                    className={`w-full p-5 text-left transition hover:bg-white/[0.05] ${
                      selectedLead?._id === lead._id
                        ? "bg-white/[0.07]"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            {lead.name}
                          </h3>

                          <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                            {lead.type}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-sm text-slate-400">
                          {lead.email}
                        </p>

                        <p className="mt-3 line-clamp-2 text-sm text-slate-300">
                          {lead.message}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs capitalize">
                          {lead.status}
                        </span>

                        <span className="text-xs text-slate-500">
                          {new Date(
                            lead.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}

          <div className="h-fit rounded-2xl border border-white/10 bg-white/[0.03]">
            {!selectedLead ? (
              <div className="p-8 text-center text-slate-400">
                <p className="font-medium text-white">
                  Select a lead
                </p>

                <p className="mt-2 text-sm">
                  Lead details will appear here.
                </p>
              </div>
            ) : (
              <LeadDetails
                lead={selectedLead}
                saving={saving}
                onUpdate={updateLead}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadDetails({
  lead,
  saving,
  onUpdate,
}: {
  lead: Lead;
  saving: boolean;
  onUpdate: (
    id: string,
    status: LeadStatus,
    notes: string
  ) => void;
}) {
  const [status, setStatus] =
    useState<LeadStatus>(lead.status);

  const [notes, setNotes] = useState(
    lead.notes || ""
  );

  useEffect(() => {
    setStatus(lead.status);
    setNotes(lead.notes || "");
  }, [lead]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
          Lead Details
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          {lead.name}
        </h2>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <p className="text-slate-500">
            Email
          </p>
          <p className="mt-1 break-all text-slate-200">
            {lead.email}
          </p>
        </div>

        <div>
          <p className="text-slate-500">
            Phone
          </p>
          <p className="mt-1 text-slate-200">
            {lead.phone}
          </p>
        </div>

        {lead.company && (
          <div>
            <p className="text-slate-500">
              Company
            </p>
            <p className="mt-1 text-slate-200">
              {lead.company}
            </p>
          </div>
        )}

        {lead.subject && (
          <div>
            <p className="text-slate-500">
              Subject
            </p>
            <p className="mt-1 text-slate-200">
              {lead.subject}
            </p>
          </div>
        )}

        <div>
          <p className="text-slate-500">
            Message
          </p>

          <div className="mt-2 rounded-xl border border-white/10 bg-black/20 p-4 leading-6 text-slate-300">
            {lead.message}
          </div>
        </div>

        <div>
          <label className="text-slate-500">
            Status
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as LeadStatus
              )
            }
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
          >
            {statuses.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item.charAt(0).toUpperCase() +
                  item.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-slate-500">
            Internal Notes
          </label>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            rows={5}
            placeholder="Add internal notes..."
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
          />
        </div>

        <button
          disabled={saving}
          onClick={() =>
            onUpdate(
              lead._id,
              status,
              notes
            )
          }
          className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </div>
  );
}