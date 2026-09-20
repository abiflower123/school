import { useState, useEffect, useMemo } from "react";
import {
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  BookOpen,
  FileText,
  Plus,
  X,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  Info,
  Download,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getAttendanceSummary,
  getAllAttendanceRecords,
  getSubjectAttendance,
  getMonthAttendanceMap,
  appealAttendance,
  type AttendanceStatus,
  type DayAttendance
} from "../../services/mock/attendance";
import {
  getLeaveRequests,
  addLeaveRequest,
  cancelLeaveRequest,
  resolveLeaveRequest,
  type LeaveRequest,
  type LeaveType,
} from "../../services/mock/leave";
import { StatusBadge, type StatusVariant } from "../../components/ui/StatusBadge";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { SkeletonCard } from "../../components/ui/Skeleton";
import { useMockLoading } from "../../hooks/useMockLoading";

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-50 text-emerald-700",
  Absent: "bg-rose-50 text-rose-700",
  Late: "bg-amber-50 text-amber-700",
  Holiday: "bg-zinc-100 text-zinc-600",
  Leave: "bg-violet-50 text-violet-700",
};

const LEAVE_STATUS_VARIANT: Record<LeaveRequest["status"], StatusVariant> = {
  Approved: "success",
  Rejected: "danger",
  Cancelled: "neutral",
  Pending: "warning",
};

const CELL_COLORS: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-500",
  Absent: "bg-rose-500",
  Late: "bg-amber-400",
  Holiday: "bg-zinc-300",
  Leave: "bg-violet-400",
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthNamesLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Mock Holidays for the new tab
const UPCOMING_HOLIDAYS = [
  { date: "02 Oct 2026", day: "Friday", name: "Gandhi Jayanti", type: "National Holiday" },
  { date: "23 Oct 2026", day: "Friday", name: "Dussehra", type: "Festival Holiday" },
  { date: "12 Nov 2026", day: "Thursday", name: "Diwali", type: "Festival Holiday" },
  { date: "25 Dec 2026", day: "Friday", name: "Christmas Day", type: "Festival Holiday" },
  { date: "01 Jan 2027", day: "Friday", name: "New Year's Day", type: "Term Break" },
];

export default function AttendancePage() {
  const { selectedChild } = useAuth();
  const sid = selectedChild?.id ?? "STU001";

  // Dynamic Month Navigation State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); 

  // Attendance Data
  const summary = getAttendanceSummary(sid);
  const [allRecords, setAllRecords] = useState<DayAttendance[]>([]);
  const subjectAtt = getSubjectAttendance(sid);
  
  useEffect(() => {
    setAllRecords(getAllAttendanceRecords(sid));
  }, [sid]);

  // Derived Data based on current month
  const yearStr = currentDate.getFullYear().toString();
  const monthStrShort = monthNamesShort[currentDate.getMonth()];
  const monthStrLong = monthNamesLong[currentDate.getMonth()];
  
  const calendarMap = getMonthAttendanceMap(sid, monthStrShort, yearStr);
  const monthlyRecords = useMemo(() => {
    return allRecords.filter(r => r.date.includes(`${monthStrShort} ${yearStr}`));
  }, [allRecords, monthStrShort, yearStr]);

  // Leave Data
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => getLeaveRequests(sid));
  useEffect(() => {
    setLeaveRequests(getLeaveRequests(sid));
  }, [sid]);

  // UI State
  const [activeTab, setActiveTab] = useState<"overview" | "calendar" | "subjects" | "leaves" | "holidays">("overview");
  const [showAllLeaves, setShowAllLeaves] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Leave Form State
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [type, setType] = useState<LeaveType>("Sick Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState<"Full Day" | "Half Day (Morning)" | "Half Day (Afternoon)">("Full Day");
  const [reason, setReason] = useState("");
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  const loading = useMockLoading([sid]);

  // Calendar rendering setup
  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const calendarCells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const handlePrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) return;

    const finalDuration = startDate === endDate ? duration : "Full Day";
    const updated = addLeaveRequest(sid, type, startDate, endDate, reason, attachmentName, finalDuration);
    setLeaveRequests(updated);
    setShowLeaveForm(false);
    
    // Reset form
    setStartDate("");
    setEndDate("");
    setDuration("Full Day");
    setReason("");
    setAttachmentName(null);

    const newId = updated[0].id;
    setTimeout(() => {
      setLeaveRequests(resolveLeaveRequest(sid, newId));
    }, 4000);
  };

  const requestCancelLeave = (id: string) => {
    setCancelTargetId(id);
  };

  const confirmCancelLeave = () => {
    if (cancelTargetId) setLeaveRequests(cancelLeaveRequest(sid, cancelTargetId));
    setCancelTargetId(null);
  };

  const handleAppeal = (date: string) => {
    setAllRecords(appealAttendance(sid, date));
    alert(`Discrepancy report for ${date} has been sent to your class teacher.`);
  };

  const handleDownloadReport = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert("Attendance Report (PDF) downloaded successfully!");
    }, 1500);
  };

  const displayedLeaves = showAllLeaves ? leaveRequests : leaveRequests.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 lg:space-y-8">
      <PageHeader
        title="Attendance & Leave"
        subtitle="Track your attendance and manage leave requests in one place."
        actions={
          <>
            <button
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 shadow-sm disabled:opacity-50"
            >
              <Download size={16} />
              {isDownloading ? "Generating..." : "Download Report"}
            </button>
            <button
              onClick={() => {
                setActiveTab("leaves");
                setShowLeaveForm(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 shadow-sm"
            >
              <Plus size={16} />
              Apply Leave
            </button>
          </>
        }
      />

      {/* Proactive Shortage Alert */}
      {summary.shortage && (
        <section className="overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-sm ring-1 ring-rose-500/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
                <AlertTriangle size={24} className="text-rose-600" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-900">Attention Required: Attendance Shortage</h3>
                <p className="mt-1 text-sm text-rose-700 leading-relaxed max-w-xl">
                  Your overall attendance has fallen to <strong>{summary.overallPercentage}%</strong>, which is below the mandatory 75% threshold. Please ensure regular attendance to avoid academic penalties.
                </p>
              </div>
            </div>
            <div className="flex shrink-0">
               <button onClick={() => setActiveTab("subjects")} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm ring-1 ring-inset ring-rose-200 hover:bg-rose-50 transition">
                 View Subjects
               </button>
            </div>
          </div>
        </section>
      )}

      {/* Summary Cards */}
      {loading ? (
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </section>
      ) : (
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Overall Attendance", value: `${summary.overallPercentage}%`, sub: "Total up to date", icon: CalendarCheck, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Days Present", value: summary.presentDays, sub: `Out of ${summary.totalWorkingDays} days`, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Days Absent", value: summary.absentDays, sub: "Requires attention", icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "This Month", value: `${summary.monthlyPercentage}%`, sub: summary.currentMonthName, icon: Clock3, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((card) => (
          <div key={card.label} className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300">
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
                <card.icon size={18} className={card.color} strokeWidth={2} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-zinc-500">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">{card.value}</p>
              <p className="mt-1 text-xs text-zinc-400">{card.sub}</p>
            </div>
          </div>
        ))}
      </section>
      )}

      {/* Main Tabbed Interface */}
      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-wrap border-b border-zinc-200 bg-zinc-50/50 px-2 sm:px-6">
          {[
            { key: "overview", label: "Daily Log" },
            { key: "calendar", label: "Calendar View" },
            { key: "subjects", label: "Subject-wise" },
            { key: "leaves", label: "Leave Requests" },
            { key: "holidays", label: "Holidays" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`relative px-4 py-4 text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? "text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />
              )}
            </button>
          ))}
        </div>

        <div className="p-0 sm:p-6">
          
          {/* Dynamic Month Navigator (Only for Daily Log and Calendar) */}
          {(activeTab === "overview" || activeTab === "calendar") && (
            <div className="flex items-center justify-between bg-zinc-50/50 sm:bg-transparent px-4 py-3 sm:p-0 mb-4 rounded-lg sm:rounded-none border-b border-zinc-100 sm:border-0">
               <button onClick={handlePrevMonth} className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900">
                 <ChevronLeft size={18} />
               </button>
               <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">{monthStrLong} {yearStr}</h3>
               <button onClick={handleNextMonth} className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900">
                 <ChevronRight size={18} />
               </button>
            </div>
          )}

          {/* Daily Records */}
          {activeTab === "overview" && (
            <div className="divide-y divide-zinc-100 px-4 sm:px-0">
              {monthlyRecords.length === 0 ? (
                <EmptyState
                  icon={CalendarCheck}
                  title="No records found"
                  message={`There are no attendance logs for ${monthStrLong} ${yearStr}.`}
                />
              ) : (
                monthlyRecords.map((r) => (
                  <div key={r.date} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 pr-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-w-0">
                      <div className="w-32 shrink-0">
                        <p className="text-sm font-bold text-zinc-900">{r.date}</p>
                        <p className="text-xs font-medium text-zinc-500">{r.day}</p>
                      </div>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[r.status]}`}>
                          {r.status}
                        </span>
                        <p className="truncate text-sm text-zinc-600">{r.remarks}</p>
                      </div>
                    </div>
                    {/* Advanced Appeal Feature */}
                    {(r.status === "Absent" || r.status === "Late") && (
                       <div className="shrink-0">
                         {r.isAppealed ? (
                           <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                             <Clock3 size={14} /> Appeal Pending
                           </span>
                         ) : (
                           <button
                             onClick={() => handleAppeal(r.date)}
                             className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-600 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-900 opacity-0 group-hover:opacity-100 focus:opacity-100"
                           >
                             <AlertCircle size={14} />
                             Report Error
                           </button>
                         )}
                       </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Calendar View */}
          {activeTab === "calendar" && (
            <div className="p-4 sm:p-0">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 text-center">
                {weekdays.map((d) => (
                  <div key={d} className="pb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {d}
                  </div>
                ))}
                {calendarCells.map((day, i) => {
                  const status = day ? calendarMap[day] : null;
                  return (
                    <div
                      key={i}
                      className={`flex flex-col items-center justify-start rounded-xl py-2.5 sm:py-4 min-h-[60px] sm:min-h-[80px] transition-colors ${
                        day ? "border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50" : ""
                      }`}
                    >
                      {day && (
                        <>
                          <span className={`text-sm font-bold ${status === 'Absent' ? 'text-rose-900' : 'text-zinc-700'}`}>{day}</span>
                          {status && (
                            <div className="mt-2 flex flex-col items-center gap-1">
                              <div className={`h-1.5 w-1.5 rounded-full ${CELL_COLORS[status]}`} />
                              <span className="hidden text-[9px] font-medium text-zinc-400 sm:block">{status}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 rounded-xl bg-zinc-50 p-4 border border-zinc-100">
                {Object.entries(CELL_COLORS).map(([status, cls]) => (
                  <div key={status} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    <div className={`h-2.5 w-2.5 rounded-full ${cls}`} />
                    {status}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subject-wise */}
          {activeTab === "subjects" && (
            <div className="p-4 sm:p-0">
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 border border-blue-100">
                <Info size={16} className="text-blue-600 shrink-0" />
                <p className="text-xs font-medium text-blue-800">
                  Subject-wise attendance represents the cumulative total for the Academic Year 2026-2027.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjectAtt.map((s) => (
                  <div key={s.subject} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                          <BookOpen size={18} className="text-zinc-600" strokeWidth={1.5} />
                        </div>
                        <h4 className="font-bold text-zinc-900">{s.subject}</h4>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${s.shortage ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                        {s.percentage}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className={`h-full rounded-full ${s.shortage ? "bg-rose-500" : "bg-emerald-500"}`}
                        style={{ width: `${s.percentage}%` }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                       <span className="font-medium text-zinc-500">Attended: {s.present}/{s.total}</span>
                       {s.shortage && <span className="font-semibold text-rose-600">Shortage</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leave Requests */}
          {activeTab === "leaves" && (
            <div className="p-4 sm:p-0 space-y-6">
              
              {/* Inline Form */}
              {showLeaveForm && (
                <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-zinc-900">New Leave Application</h3>
                    <button onClick={() => setShowLeaveForm(false)} className="rounded-md p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700">
                      <X size={18} />
                    </button>
                  </div>
                  <form onSubmit={handleLeaveSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Leave Type</label>
                        <select
                          value={type}
                          onChange={(e) => setType(e.target.value as LeaveType)}
                          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-zinc-400"
                        >
                          <option>Sick Leave</option>
                          <option>Casual Leave</option>
                          <option>Emergency Leave</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-zinc-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-zinc-400"
                        />
                      </div>
                    </div>
                    {/* Half-Day Option for Single Day Leaves */}
                    {startDate && endDate && startDate === endDate && (
                       <div className="rounded-lg border border-zinc-200 bg-white p-3">
                         <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Duration</label>
                         <div className="flex flex-wrap gap-3">
                           {["Full Day", "Half Day (Morning)", "Half Day (Afternoon)"].map((opt) => (
                             <label key={opt} className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                               <input
                                 type="radio"
                                 name="duration"
                                 value={opt}
                                 checked={duration === opt}
                                 onChange={() => setDuration(opt as any)}
                                 className="text-zinc-900 focus:ring-zinc-900"
                               />
                               {opt}
                             </label>
                           ))}
                         </div>
                       </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Reason for Leave</label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        rows={2}
                        placeholder="Briefly state the reason..."
                        className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-zinc-400"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
                          <Paperclip size={16} className="text-zinc-400" />
                          {attachmentName ?? "Attach Document (Optional)"}
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => setAttachmentName(e.target.files?.[0]?.name ?? null)}
                          />
                        </label>
                      </div>
                      <div className="flex gap-3">
                         <button
                           type="button"
                           onClick={() => setShowLeaveForm(false)}
                           className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100"
                         >
                           Cancel
                         </button>
                         <button
                           type="submit"
                           className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
                         >
                           Submit Application
                         </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Leave List */}
              <div className="grid grid-cols-1 gap-4">
                {leaveRequests.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="No leave requests"
                    message="You haven't applied for any leave yet."
                  />
                ) : (
                  <>
                    {displayedLeaves.map((req) => (
                      <div key={req.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                         <div>
                           <div className="flex items-center gap-3 mb-2">
                             <h4 className="font-bold text-zinc-900">{req.type}</h4>
                             <StatusBadge label={req.status} variant={LEAVE_STATUS_VARIANT[req.status]} />
                           </div>
                           <p className="text-sm text-zinc-600 mb-3">{req.reason}</p>
                           <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500">
                              <div className="flex items-center gap-1.5">
                                <CalendarCheck size={14} className="text-zinc-400" />
                                {req.startDate} to {req.endDate}
                                {req.duration && req.duration !== "Full Day" && ` • ${req.duration}`}
                              </div>
                              {req.attachmentName && (
                                <div className="flex items-center gap-1.5 text-blue-600">
                                  <Paperclip size={14} />
                                  {req.attachmentName}
                                </div>
                              )}
                           </div>
                         </div>
                         
                         <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 w-full sm:w-auto border-t sm:border-t-0 border-zinc-100 pt-3 sm:pt-0">
                            <div className="text-left sm:text-right">
                               <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Applied On</p>
                               <p className="text-xs font-semibold text-zinc-700 mt-0.5">{req.appliedOn}</p>
                            </div>
                            {req.status === "Pending" && (
                              <button
                                type="button"
                                onClick={() => requestCancelLeave(req.id)}
                                className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-50"
                              >
                                Cancel
                              </button>
                            )}
                         </div>
                      </div>
                    ))}
                    
                    {leaveRequests.length > 3 && (
                      <button
                        onClick={() => setShowAllLeaves(!showAllLeaves)}
                        className="mt-2 flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 py-3 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100"
                      >
                        {showAllLeaves ? "View Less" : `View All (${leaveRequests.length})`}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Upcoming Holidays */}
          {activeTab === "holidays" && (
            <div className="p-4 sm:p-0">
               <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                 <h3 className="text-lg font-bold text-zinc-900">Upcoming Holidays 2026-2027</h3>
                 <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{UPCOMING_HOLIDAYS.length} Holidays Planned</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {UPCOMING_HOLIDAYS.map((h, i) => (
                   <div key={i} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300">
                      <div className="flex items-center gap-4">
                         <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-zinc-100 text-zinc-900">
                           <span className="text-xs font-bold uppercase">{h.date.split(' ')[1]}</span>
                           <span className="text-lg font-black leading-none">{h.date.split(' ')[0]}</span>
                         </div>
                         <div>
                           <h4 className="font-bold text-zinc-900">{h.name}</h4>
                           <p className="text-xs font-medium text-zinc-500 mt-0.5">{h.day} · {h.type}</p>
                         </div>
                      </div>
                      <div className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                         Holiday
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={cancelTargetId !== null}
        title="Cancel this leave request?"
        message="This will withdraw your pending leave application. You can submit a new one anytime."
        confirmLabel="Cancel Request"
        cancelLabel="Keep Request"
        onConfirm={confirmCancelLeave}
        onCancel={() => setCancelTargetId(null)}
      />
    </div>
  );
}