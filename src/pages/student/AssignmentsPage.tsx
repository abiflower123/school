import { useState, useMemo } from "react";
import {
  ClipboardList,
  Search,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  ArrowUpDown,
  Paperclip
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAssignments, type Assignment } from "../../services/mock/assignments";
import { StatusBadge, type StatusVariant } from "../../components/ui/StatusBadge";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { SkeletonCard, SkeletonRow } from "../../components/ui/Skeleton";
import { useMockLoading } from "../../hooks/useMockLoading";
import { PublishedByRow } from "../../components/ui/PublishedByRow";
import { AttachmentList } from "../../components/ui/AttachmentList";

const STATUS_VARIANT: Record<Assignment["status"], StatusVariant> = {
  Pending: "warning",
  Submitted: "info",
  Overdue: "danger",
  Graded: "success",
};

export default function AssignmentsPage() {
  const { selectedChild } = useAuth();
  const sid = selectedChild?.id ?? "STU001";

  const allAssignments = getAssignments(sid);
  const [filterStatus, setFilterStatus] = useState<Assignment["status"] | "All" | "Homework">("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"Due Date" | "Assigned Date">("Due Date");
  const [detailItem, setDetailItem] = useState<Assignment | null>(null);
  const loading = useMockLoading([sid]);

  const FILTERS = ["All", "Pending", "Submitted", "Graded", "Overdue", "Homework"] as const;

  // 1. Filter
  const filtered = useMemo(() => {
    return allAssignments.filter((a) => {
      const matchesStatus =
        filterStatus === "All" ? true :
        filterStatus === "Homework" ? a.isHomework :
        a.status === filterStatus;
      const matchesSearch =
        !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.subject.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [allAssignments, filterStatus, search]);

  // 2. Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      // Very simple mock sorting based on string dates (for demonstration)
      // Real app would parse actual ISO dates
      const dateA = sortBy === "Due Date" ? new Date(a.dueDate) : new Date(a.assignedDate);
      const dateB = sortBy === "Due Date" ? new Date(b.dueDate) : new Date(b.assignedDate);
      return dateA.getTime() - dateB.getTime();
    });
  }, [filtered, sortBy]);

  // 3. Group by Urgency/Category
  const grouped = useMemo(() => {
    const groups: Record<string, Assignment[]> = {
      "Action Required (Overdue)": [],
      "Upcoming (Pending)": [],
      "In Review (Submitted)": [],
      "Completed (Graded)": []
    };

    sorted.forEach((a) => {
      if (a.status === "Overdue") groups["Action Required (Overdue)"].push(a);
      else if (a.status === "Pending") groups["Upcoming (Pending)"].push(a);
      else if (a.status === "Submitted") groups["In Review (Submitted)"].push(a);
      else if (a.status === "Graded") groups["Completed (Graded)"].push(a);
    });

    return groups;
  }, [sorted]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 lg:space-y-8">
      <PageHeader
        title="Assignments & Homework"
        subtitle="View your coursework, due dates and teacher-updated status."
      />

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
          { label: "Total Tasks", value: allAssignments.length, color: "text-zinc-900", icon: ClipboardList, bg: "bg-zinc-100" },
          { label: "Pending", value: allAssignments.filter((a) => a.status === "Pending").length, color: "text-amber-700", icon: Clock, bg: "bg-amber-50" },
          { label: "Overdue", value: allAssignments.filter((a) => a.status === "Overdue").length, color: "text-rose-700", icon: AlertCircle, bg: "bg-rose-50" },
          { label: "Graded", value: allAssignments.filter((a) => a.status === "Graded").length, color: "text-emerald-700", icon: CheckCircle2, bg: "bg-emerald-50" },
        ].map((s) => (
          <div key={s.label} className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300">
            <div className="flex items-center justify-between">
               <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                 <s.icon size={18} className={s.color} strokeWidth={2} />
               </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-zinc-500">{s.label}</p>
              <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </section>
      )}

      {/* Search & Filters */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-2 overflow-x-auto px-2 py-2 sm:w-auto">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilterStatus(f)}
                className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                  filterStatus === f
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 px-2 py-2">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm font-medium outline-none transition focus:border-zinc-400 focus:bg-white"
              />
            </div>
            <button
              onClick={() => setSortBy(sortBy === "Due Date" ? "Assigned Date" : "Due Date")}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition shadow-sm"
              title="Toggle Sort"
            >
              <ArrowUpDown size={14} />
              <span className="hidden sm:inline">Sort: {sortBy}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Assignment List */}
      {loading ? (
        <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white shadow-sm">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No assignments found"
          message="Try adjusting your filters or search query."
          className="bg-white shadow-sm"
        />
      ) : (
        <section className="space-y-8">
          {Object.entries(grouped).map(([groupName, items]) => {
            if (items.length === 0) return null;
            return (
              <div key={groupName} className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 pl-1">
                  {groupName} <span className="ml-2 rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] text-zinc-600">{items.length}</span>
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                          item.status === "Overdue" ? "bg-rose-500" : 
                          item.status === "Pending" ? "bg-amber-500" : 
                          item.status === "Graded" ? "bg-emerald-500" : "bg-blue-500"
                        }`} />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{item.subject}</span>
                            <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[9px] font-bold text-cyan-700 uppercase tracking-widest">{item.type}</span>
                          </div>
                          <h3 className="text-base font-bold text-zinc-900 leading-snug">{item.title}</h3>
                          <p className="mt-1 text-xs text-zinc-400">{item.teacherName}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-zinc-500">
                            <span className="flex items-center gap-1.5">
                               <Clock size={14} className="text-zinc-400" />
                               Due: {item.dueDate}
                            </span>
                            {item.marks && (
                              <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                                <CheckCircle2 size={14} />
                                Score: {item.marks}{item.maxMarks ? `/${item.maxMarks}` : ""}
                              </span>
                            )}
                            {item.attachments && item.attachments.length > 0 && (
                              <span className="flex items-center gap-1.5">
                                <Paperclip size={14} className="text-zinc-400" />
                                {item.attachments.length} attachment{item.attachments.length !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t border-zinc-100 pt-4 sm:border-0 sm:pt-0">
                         <StatusBadge label={item.status} variant={STATUS_VARIANT[item.status]} />
                         <button
                           onClick={() => setDetailItem(item)}
                           className="flex items-center gap-1.5 rounded-lg bg-zinc-50 px-4 py-2 text-xs font-bold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
                         >
                           {item.status === "Graded" ? "VIEW FEEDBACK" : "VIEW DETAILS"}
                           <ArrowRight size={14} className="text-zinc-400" />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Detail Modal (Slide-over / Centered elegant modal) */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 px-4 py-6 backdrop-blur-sm sm:px-0">
          <div className="flex w-full max-w-2xl flex-col max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-200">
            {/* Header */}
            <div className="flex shrink-0 items-start justify-between border-b border-zinc-100 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1.5">{detailItem.subject}</p>
                <h2 className="text-xl font-bold text-zinc-900">{detailItem.title}</h2>
              </div>
              <button onClick={() => setDetailItem(null)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition">
                <X size={20} />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Posted by */}
              {detailItem.teacherName && (
                <PublishedByRow
                  name={detailItem.teacherName}
                  avatar={detailItem.teacherAvatar}
                  role={detailItem.type}
                  date={`Assigned ${detailItem.assignedDate}`}
                />
              )}

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                 <StatusBadge label={detailItem.status} variant={STATUS_VARIANT[detailItem.status]} />
                 <div className="flex items-center gap-1.5 text-zinc-500 font-medium">
                   <Clock size={16} /> Due: {detailItem.dueDate}
                 </div>
                 {detailItem.marks && (
                   <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                     <CheckCircle2 size={16} /> Score: {detailItem.marks}{detailItem.maxMarks ? `/${detailItem.maxMarks}` : ""}
                   </div>
                 )}
              </div>

              {/* Description Box */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Instructions</h3>
                <div className="rounded-xl bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700">
                  {detailItem.description}
                </div>
              </div>

              {/* Attachments */}
              {detailItem.attachments && detailItem.attachments.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Attachments</h3>
                  <AttachmentList attachments={detailItem.attachments} />
                </div>
              )}

              {/* Teacher Feedback */}
              {detailItem.teacherFeedback && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Teacher Feedback</h3>
                  <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                    <MessageSquare size={18} className="mt-0.5 text-emerald-600 shrink-0" />
                    <p className="text-sm leading-relaxed text-emerald-800">{detailItem.teacherFeedback}</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}