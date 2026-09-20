import { useState } from "react";
import {
  HelpCircle,
  Send,
  ChevronRight,
  CheckCircle2,
  MessageSquare,
  Plus,
  Lock,
  Star,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getTickets,
  addTicket,
  addReply,
  closeTicket,
  rateResolution,
  type TicketCategory,
  type SupportTicket,
} from "../../services/mock/helpdesk";

const CATEGORIES: TicketCategory[] = ["Academic", "Attendance", "Finance", "Transport", "Facilities", "App Issue", "Other"];

const statusStyles = {
  Open: "bg-blue-50 text-blue-700",
  "In Review": "bg-amber-50 text-amber-700",
  Resolved: "bg-emerald-50 text-emerald-700",
  Closed: "bg-zinc-100 text-zinc-600",
};

export default function HelpdeskPage() {
  const { selectedChild } = useAuth();
  const studentId = selectedChild?.id ?? "STU001";

  const [tickets, setTickets] = useState(() => getTickets(studentId));
  const [view, setView] = useState<"list" | "new" | "detail">("list");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const [category, setCategory] = useState<TicketCategory>("Academic");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [replyText, setReplyText] = useState("");

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    setTickets((prev) => addTicket(prev, category, subject, description));
    setSubject("");
    setDescription("");
    setSubmitted(true);
    setView("list");
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    const updated = addReply(tickets, selectedTicket.id, replyText);
    setTickets(updated);
    setSelectedTicket(updated.find((t) => t.id === selectedTicket.id) ?? null);
    setReplyText("");
  };

  const handleCloseTicket = () => {
    if (!selectedTicket) return;
    const updated = closeTicket(tickets, selectedTicket.id);
    setTickets(updated);
    setSelectedTicket(updated.find((t) => t.id === selectedTicket.id) ?? null);
  };

  const handleRate = (rating: 1 | 2 | 3 | 4 | 5) => {
    if (!selectedTicket) return;
    const updated = rateResolution(tickets, selectedTicket.id, rating);
    setTickets(updated);
    setSelectedTicket(updated.find((t) => t.id === selectedTicket.id) ?? null);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Helpdesk & Support</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Raise complaints, requests, or feedback. Track the status of your tickets.
          </p>
        </div>
        {view === "list" && (
          <button
            type="button"
            onClick={() => setView("new")}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            <Plus size={15} />
            New Ticket
          </button>
        )}
        {view !== "list" && (
          <button type="button" onClick={() => { setView("list"); setSelectedTicket(null); }} className="text-sm text-zinc-500 hover:text-zinc-900">
            ← Back to tickets
          </button>
        )}
      </section>

      {submitted && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 size={16} />
          Your ticket has been submitted. We will review it shortly.
        </div>
      )}

      {/* Summary */}
      {view === "list" && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Tickets", value: tickets.length, color: "text-zinc-900" },
            { label: "Open", value: tickets.filter((t) => t.status === "Open").length, color: "text-blue-700" },
            { label: "In Review", value: tickets.filter((t) => t.status === "In Review").length, color: "text-amber-700" },
            { label: "Resolved", value: tickets.filter((t) => t.status === "Resolved").length, color: "text-emerald-700" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="mt-1 text-xs text-zinc-500">{s.label}</p>
            </div>
          ))}
        </section>
      )}

      {/* Ticket List */}
      {view === "list" && (
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          {tickets.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <HelpCircle size={36} className="mx-auto text-zinc-300" strokeWidth={1.5} />
              <p className="mt-3 text-sm font-medium text-zinc-600">No tickets yet</p>
              <p className="mt-1 text-xs text-zinc-400">Click "New Ticket" to raise a request or complaint.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => { setSelectedTicket(ticket); setView("detail"); }}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-zinc-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                    <MessageSquare size={17} className="text-zinc-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-zinc-900 truncate">{ticket.subject}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[ticket.status]}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {ticket.ticketNumber} · {ticket.category} · {ticket.submittedDate}
                    </p>
                    {ticket.replies.length > 0 && (
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {ticket.replies.length} response{ticket.replies.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-zinc-300" />
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* New Ticket Form */}
      {view === "new" && (
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="border-b border-zinc-100 px-5 py-4">
            <h2 className="text-base font-semibold text-zinc-900">New Support Ticket</h2>
            <p className="mt-0.5 text-sm text-zinc-500">Describe your issue and we will get back to you.</p>
          </div>
          <form onSubmit={handleSubmitTicket} className="space-y-4 p-5">
            <div>
              <label htmlFor="ticketCat" className="mb-1.5 block text-sm font-medium text-zinc-700">Category</label>
              <select
                id="ticketCat"
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-400"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="ticketSubject" className="mb-1.5 block text-sm font-medium text-zinc-700">Subject</label>
              <input
                id="ticketSubject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                required
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400"
              />
            </div>
            <div>
              <label htmlFor="ticketDesc" className="mb-1.5 block text-sm font-medium text-zinc-700">Description</label>
              <textarea
                id="ticketDesc"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide as much detail as possible..."
                required
                className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400"
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setView("list")} className="flex-1 rounded-lg border border-zinc-200 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!subject.trim() || !description.trim()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
              >
                <Send size={15} />
                Submit Ticket
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Ticket Detail */}
      {view === "detail" && selectedTicket && (
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="border-b border-zinc-100 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-zinc-900">{selectedTicket.subject}</p>
                <p className="mt-0.5 text-xs text-zinc-400">
                  {selectedTicket.ticketNumber} · {selectedTicket.category} · {selectedTicket.submittedDate}
                </p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[selectedTicket.status]}`}>
                {selectedTicket.status}
              </span>
            </div>
          </div>
          {/* Original message */}
          <div className="bg-zinc-50 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Your Message</p>
            <p className="mt-2 text-sm leading-6 text-zinc-700">{selectedTicket.description}</p>
          </div>
          {/* Replies */}
          {selectedTicket.replies.length > 0 && (
            <div className="divide-y divide-zinc-100">
              {selectedTicket.replies.map((reply) => (
                <div key={reply.id} className={`px-5 py-4 ${reply.sender === "admin" ? "bg-white" : "bg-zinc-50/60"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${reply.sender === "admin" ? "bg-zinc-900 text-white" : "bg-zinc-200 text-zinc-700"}`}>
                      {reply.sender === "admin" ? "A" : "S"}
                    </div>
                    <p className="text-xs font-semibold text-zinc-700">{reply.sender === "admin" ? "School Administration" : "You"}</p>
                    <p className="ml-auto text-[11px] text-zinc-400">{reply.timestamp}</p>
                  </div>
                  <p className="text-sm leading-6 text-zinc-700 pl-9">{reply.text}</p>
                </div>
              ))}
            </div>
          )}
          {/* Post-resolution feedback */}
          {selectedTicket.status === "Resolved" && (
            <div className="border-t border-zinc-100 px-5 py-4 bg-zinc-50/60">
              <p className="text-sm font-semibold text-zinc-900 mb-2">Rate this resolution</p>
              <div className="flex items-center gap-1 mb-3">
                {([1, 2, 3, 4, 5] as const).map((n) => (
                  <button key={n} type="button" onClick={() => handleRate(n)} aria-label={`Rate ${n} star`}>
                    <Star
                      size={22}
                      className={(selectedTicket.resolutionRating ?? 0) >= n ? "text-amber-400 fill-amber-400" : "text-zinc-300"}
                    />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCloseTicket}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3.5 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50"
              >
                <Lock size={13} />
                Close Ticket
              </button>
            </div>
          )}
          {/* Reply form */}
          {selectedTicket.status !== "Closed" && (
            <form onSubmit={handleSendReply} className="border-t border-zinc-100 p-4">
              <div className="flex items-end gap-3">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Add a reply..."
                  className="flex-1 resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white transition hover:bg-zinc-800 disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          )}
        </section>
      )}
    </div>
  );
}
