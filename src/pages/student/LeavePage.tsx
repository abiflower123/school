import { useEffect, useState } from "react";
import { FileText, Plus, X, Paperclip, Clock3 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getLeaveRequests,
  addLeaveRequest,
  cancelLeaveRequest,
  resolveLeaveRequest,
  type LeaveRequest,
  type LeaveType,
} from "../../services/mock/leave";

export default function LeavePage() {
  const { selectedChild } = useAuth();
  const studentId = selectedChild?.id ?? "STU001";

  const [requests, setRequests] = useState<LeaveRequest[]>(() => getLeaveRequests(studentId));

  useEffect(() => {
    setRequests(getLeaveRequests(studentId));
  }, [studentId]);

  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<LeaveType>("Sick Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) return;

    const updated = addLeaveRequest(requests, type, startDate, endDate, reason, attachmentName);
    setRequests(updated);
    setShowForm(false);
    setStartDate("");
    setEndDate("");
    setReason("");
    setAttachmentName(null);

    // Simulate the class teacher reviewing the request shortly after submission.
    const newId = updated[0].id;
    setTimeout(() => {
      setRequests((prev) => resolveLeaveRequest(prev, newId));
    }, 4000);
  };

  const handleCancel = (id: string) => {
    setRequests((prev) => cancelLeaveRequest(prev, id));
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Leave Applications</h1>
          <p className="mt-1 text-sm text-zinc-500">Apply for leave and track approval status.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            <Plus size={16} />
            Apply Leave
          </button>
        )}
      </section>

      {showForm && (
        <section className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-100 p-5 bg-zinc-50">
            <h2 className="font-semibold text-zinc-900">New Leave Application</h2>
            <button onClick={() => setShowForm(false)} className="text-zinc-400 hover:text-zinc-600">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Leave Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as LeaveType)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-400"
                >
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Emergency Leave</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={3}
                placeholder="Briefly state the reason for leave..."
                className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Supporting Document <span className="font-normal text-zinc-400">(optional — e.g. medical certificate)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-100">
                <Paperclip size={15} className="text-zinc-400" />
                {attachmentName ?? "Choose a file to attach"}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setAttachmentName(e.target.files?.[0]?.name ?? null)}
                />
              </label>
              <p className="mt-1 text-xs text-zinc-400">Your class teacher can view and download this file to verify your request.</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Submit Application
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="rounded-xl border border-zinc-200 bg-white p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-zinc-900">{req.type}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    req.status === "Approved" ? "bg-emerald-50 text-emerald-700" :
                    req.status === "Rejected" ? "bg-rose-50 text-rose-700" :
                    req.status === "Cancelled" ? "bg-zinc-100 text-zinc-500" :
                    "bg-amber-50 text-amber-700"
                  }`}>
                    {req.status === "Pending" && <Clock3 size={10} className="mr-1 inline" />}
                    {req.status}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 mb-2">{req.reason}</p>
                <div className="flex items-center gap-4 text-xs text-zinc-500 flex-wrap">
                  <span>From: <span className="font-medium text-zinc-700">{req.startDate}</span></span>
                  <span>To: <span className="font-medium text-zinc-700">{req.endDate}</span></span>
                  {req.attachmentName && (
                    <span className="flex items-center gap-1 text-zinc-500">
                      <Paperclip size={11} /> {req.attachmentName}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <div className="text-left sm:text-right">
                  <p className="text-[10px] text-zinc-400">Applied on</p>
                  <p className="text-xs font-medium text-zinc-600 mt-0.5">{req.appliedOn}</p>
                </div>
                {req.status === "Pending" && (
                  <button
                    type="button"
                    onClick={() => handleCancel(req.id)}
                    className="text-xs font-medium text-rose-600 hover:text-rose-800"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-200 p-12 text-center">
            <FileText size={32} className="mx-auto text-zinc-300 mb-3" />
            <p className="text-sm font-medium text-zinc-600">No leave applications</p>
            <p className="text-xs text-zinc-400 mt-1">You haven't applied for any leave yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
