import {
  BookOpen,
  CalendarCheck,
  ClipboardList,
  FileText,
  ArrowUpRight,
  Clock3,
  CreditCard,
  AlertTriangle,
  ChevronRight,
  GraduationCap,
  TrendingUp,
  Megaphone,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAttendanceSummary } from "../../services/mock/attendance";
import { getPendingAssignments, getHomework } from "../../services/mock/assignments";
import { getUpcomingExams, getLatestTermReport } from "../../services/mock/exams";
import { getFeeSummary, formatINR } from "../../services/mock/fees";
import { getNextClasses, DAYS } from "../../services/mock/timetable";
import { getAnnouncements } from "../../services/mock/announcements";
import { getProgress } from "../../services/mock/progress";
import { SectionHeader } from "../../components/ui/PageHeader";
import { EmptyState } from "../../components/ui/EmptyState";
import { SkeletonCard, SkeletonRow } from "../../components/ui/Skeleton";
import { useMockLoading } from "../../hooks/useMockLoading";

// ─── helpers ───────────────────────────────────────────────
function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getStatusColor(pct: number) {
  if (pct >= 90) return { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" };
  if (pct >= 75) return { dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" };
  if (pct >= 60) return { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" };
  return { dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50" };
}

// ─── Main Dashboard ────────────────────────────────────────
export default function StudentOverviewPage() {
  const { selectedChild } = useAuth();
  const navigate = useNavigate();
  const loading = useMockLoading([selectedChild?.id]);

  if (!selectedChild) return null;

  const sid = selectedChild.id;

  // --- data ---
  const att = getAttendanceSummary(sid);
  const pendingAssignments = getPendingAssignments(sid);
  const pendingHomework = getHomework(sid).filter((h) => h.status === "Pending");
  const overdueAssignments = pendingAssignments.filter((a) => a.status === "Overdue");
  const exams = getUpcomingExams(sid);
  const feeSummary = getFeeSummary(sid);
  const nextClasses = getNextClasses(sid, 5);
  const announcements = getAnnouncements().slice(0, 3);
  const progress = getProgress(sid);
  const latestReport = getLatestTermReport(sid);

  const today = new Date();
  const todayDay = DAYS[today.getDay()];

  // Next exam countdown
  const nextExam = exams[0];
  const daysUntilExam = nextExam ? getDaysUntil(nextExam.date) : null;

  // Combined assignment list (deduplicated, prioritising overdue)
  const assignmentItems = [
    ...overdueAssignments.slice(0, 2),
    ...pendingAssignments.filter((a) => a.status !== "Overdue").slice(0, 2),
    ...pendingHomework.slice(0, 2),
  ]
    .filter((item, idx, arr) => arr.findIndex((x) => x.id === item.id) === idx)
    .slice(0, 4);

  // ─── KPI Cards config ─────────────────────────────────
  const kpiCards = [
    {
      title: "Attendance",
      value: `${att.overallPercentage}%`,
      subValue: `${att.monthlyPercentage}% this ${att.currentMonthName}`,
      icon: CalendarCheck,
      hasAlert: att.shortage,
      alertText: "Below 75% — Action needed",
      link: "/attendance",
      accentBar: att.shortage ? "bg-amber-400" : att.overallPercentage >= 90 ? "bg-emerald-400" : "bg-blue-400",
    },
    {
      title: "Assignments",
      value: `${pendingAssignments.length}`,
      subValue: overdueAssignments.length > 0
        ? `${overdueAssignments.length} overdue`
        : `${pendingHomework.length} homework pending`,
      icon: ClipboardList,
      hasAlert: overdueAssignments.length > 0,
      alertText: `${overdueAssignments.length} overdue`,
      link: "/assignments",
      accentBar: overdueAssignments.length > 0 ? "bg-rose-400" : "bg-zinc-300",
    },
    {
      title: "Upcoming Exams",
      value: `${exams.length}`,
      subValue: daysUntilExam !== null
        ? daysUntilExam === 0
          ? `${nextExam?.subject} — Today!`
          : `Next: ${nextExam?.subject} in ${daysUntilExam}d`
        : "No exams scheduled",
      icon: FileText,
      hasAlert: daysUntilExam !== null && daysUntilExam <= 2,
      alertText: daysUntilExam === 0 ? "Today!" : `In ${daysUntilExam} days`,
      link: "/exams",
      accentBar: daysUntilExam !== null && daysUntilExam <= 2 ? "bg-amber-400" : "bg-zinc-300",
    },
    {
      title: "Fees Due",
      value: feeSummary.totalDue > 0 ? formatINR(feeSummary.totalDue) : "Cleared",
      subValue: feeSummary.hasOverdue
        ? "Overdue — Pay immediately"
        : feeSummary.nextDueDate
        ? `Due by ${feeSummary.nextDueDate}`
        : "All paid up",
      icon: CreditCard,
      hasAlert: feeSummary.hasOverdue,
      alertText: "Overdue",
      link: "/fees",
      accentBar: feeSummary.hasOverdue ? "bg-rose-400" : feeSummary.totalDue > 0 ? "bg-amber-400" : "bg-emerald-400",
    },
  ];

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">{todayDay}'s Overview</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {selectedChild.name}&nbsp;&middot;&nbsp;Class {selectedChild.class}&#8209;{selectedChild.section}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">

      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">
            {todayDay}'s Overview
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {selectedChild.name}&nbsp;&middot;&nbsp;Class {selectedChild.class}&#8209;{selectedChild.section}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/timetable")}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
          >
            <Clock3 size={13} strokeWidth={1.5} />
            Timetable
          </button>
          <button
            type="button"
            onClick={() => navigate("/academic-progress")}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
          >
            <TrendingUp size={13} strokeWidth={1.5} />
            Progress
          </button>
        </div>
      </div>

      {/* Alert Banners */}
      {(feeSummary.hasOverdue || att.shortage) && (
        <div className="space-y-2">
          {feeSummary.hasOverdue && (
            <button
              type="button"
              role="alert"
              onClick={() => navigate("/fees")}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-left transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              <AlertTriangle size={16} className="shrink-0 text-rose-600" strokeWidth={2} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-rose-800">Fee Payment Overdue</p>
                <p className="text-xs text-rose-600">
                  Pending: {formatINR(feeSummary.totalDue)} &mdash; Click to pay now and avoid daily penalty.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                Pay Now
              </span>
            </button>
          )}
          {att.shortage && (
            <button
              type="button"
              role="alert"
              onClick={() => navigate("/attendance")}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <AlertTriangle size={16} className="shrink-0 text-amber-600" strokeWidth={2} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-amber-800">Attendance Warning</p>
                <p className="text-xs text-amber-700">
                  Overall attendance ({att.overallPercentage}%) is below 75%. Click to view details.
                </p>
              </div>
              <ChevronRight size={15} className="shrink-0 text-amber-500" />
            </button>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              type="button"
              onClick={() => navigate(card.link)}
              className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-zinc-300"
            >
              <div className={`absolute inset-x-0 top-0 h-0.5 ${card.accentBar}`} />
              <div className="flex items-start justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  {card.title}
                </p>
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-50 transition group-hover:bg-zinc-100">
                  <Icon size={14} strokeWidth={1.8} className="text-zinc-500" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight text-zinc-900">
                {card.value}
              </p>
              <p className={`mt-1 truncate text-[11px] font-medium ${card.hasAlert ? "text-rose-600" : "text-zinc-400"}`}>
                {card.hasAlert ? card.alertText : card.subValue}
              </p>
            </button>
          );
        })}
      </section>

      {/* Academic Snapshot */}
      {(latestReport || progress.length > 0) && (
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <SectionHeader
            title="Academic Snapshot"
            subtitle={latestReport ? `${latestReport.term} ${latestReport.year}` : "Subject progress"}
            linkLabel="Full progress"
            onLink={() => navigate("/academic-progress")}
          />
          <div className="p-5">
            {latestReport && (
              <div className="mb-4 flex flex-wrap items-center gap-4 rounded-lg bg-zinc-50 px-4 py-3">
                <div className="flex flex-col items-center">
                  <p className="text-2xl font-bold text-zinc-900">{latestReport.overallPercentage}%</p>
                  <p className="text-[10px] font-semibold text-zinc-400">Overall</p>
                </div>
                <div className="h-8 w-px bg-zinc-200" />
                <div className="flex flex-col items-center">
                  <p className="text-lg font-bold text-zinc-900">{latestReport.overallGrade}</p>
                  <p className="text-[10px] font-semibold text-zinc-400">Grade</p>
                </div>
                <div className="h-8 w-px bg-zinc-200" />
                <div className="flex flex-col items-center">
                  <p className="text-lg font-bold text-zinc-900">
                    {latestReport.rank}
                    <span className="text-xs font-normal text-zinc-400">/{latestReport.totalStudents}</span>
                  </p>
                  <p className="text-[10px] font-semibold text-zinc-400">Class Rank</p>
                </div>
                <div className="hidden h-8 w-px bg-zinc-200 sm:block" />
                <div className="hidden flex-col items-center sm:flex">
                  <p className="text-sm font-semibold text-zinc-600">{latestReport.classAverage}%</p>
                  <p className="text-[10px] font-semibold text-zinc-400">Class Avg</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/progress-reports")}
                  className="ml-auto flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                >
                  Report Card <ArrowUpRight size={12} />
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {progress.slice(0, 6).map((subj) => {
                const colors = getStatusColor(subj.percentage);
                return (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => navigate("/academic-progress")}
                    className="flex items-center gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-left transition hover:border-zinc-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-200"
                  >
                    <div className={`h-8 w-8 shrink-0 flex items-center justify-center rounded-lg ${colors.bg}`}>
                      <GraduationCap size={14} strokeWidth={1.8} className={colors.text} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-xs font-semibold text-zinc-800">{subj.subject}</p>
                        <p className={`ml-2 shrink-0 text-[11px] font-bold ${colors.text}`}>{subj.percentage}%</p>
                      </div>
                      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-zinc-200">
                        <div
                          className={`h-full rounded-full ${colors.dot}`}
                          style={{ width: `${subj.percentage}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Today's Classes + Assignments */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Today's Classes */}
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <SectionHeader
            title="Today's Classes"
            subtitle={todayDay}
            linkLabel="Full timetable"
            onLink={() => navigate("/timetable")}
          />
          {nextClasses.length === 0 ? (
            <EmptyState icon={CheckCircle2} dashed={false} title="No classes today" message="No classes scheduled for today." />
          ) : (
            <div className="divide-y divide-zinc-50">
              {nextClasses.map((period) => {
                const now = new Date();
                const timeParts = period.time.split("–");
                let isNow = false;
                let isPast = false;
                if (timeParts.length === 2) {
                  const parseTime = (t: string) => {
                    const [h, m] = t.trim().split(":").map(Number);
                    const d = new Date();
                    d.setHours(h, m, 0, 0);
                    return d;
                  };
                  const start = parseTime(timeParts[0]);
                  const end = parseTime(timeParts[1]);
                  isNow = start <= now && now <= end;
                  isPast = end < now;
                }
                return (
                  <button
                    key={period.id}
                    type="button"
                    onClick={() => navigate("/timetable")}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50"
                  >
                    <div className="flex w-14 shrink-0 flex-col">
                      <p className={`text-[10px] font-semibold ${isPast ? "text-zinc-300" : isNow ? "text-emerald-600" : "text-zinc-500"}`}>
                        {period.time.split("–")[0]?.trim()}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`h-2 w-2 rounded-full ${isNow ? "bg-emerald-400 animate-pulse" : isPast ? "bg-zinc-200" : "bg-zinc-300"}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold truncate ${isPast ? "text-zinc-400" : "text-zinc-900"}`}>
                        {period.subject}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {period.room}{period.teacher ? ` · ${period.teacher}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isNow && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          Now
                        </span>
                      )}
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        period.type === "Practical" ? "bg-blue-50 text-blue-700"
                        : period.type === "Activity" ? "bg-emerald-50 text-emerald-700"
                        : period.type === "Assembly" ? "bg-amber-50 text-amber-700"
                        : "bg-zinc-100 text-zinc-500"
                      }`}>
                        {period.type}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Homework & Assignments */}
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <SectionHeader
            title="Homework & Assignments"
            subtitle={`${pendingAssignments.length} pending · ${overdueAssignments.length} overdue`}
            linkLabel="View all"
            onLink={() => navigate("/assignments")}
          />
          {assignmentItems.length === 0 ? (
            <EmptyState icon={CheckCircle2} dashed={false} title="All caught up" message="Nothing pending right now." />
          ) : (
            <div className="divide-y divide-zinc-50">
              {assignmentItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate("/assignments")}
                  className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                    <BookOpen size={14} strokeWidth={1.8} className={item.status === "Overdue" ? "text-rose-500" : "text-zinc-500"} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">{item.title}</p>
                    <p className="text-[11px] text-zinc-400">
                      {item.subject} &middot; Due {item.dueDate}{item.isHomework ? " · Homework" : ""}
                    </p>
                  </div>
                  {item.status === "Overdue" ? (
                    <span className="shrink-0 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">Overdue</span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">Pending</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Exams + Announcements */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Upcoming Exams */}
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <SectionHeader
            title="Upcoming Exams"
            subtitle={`${exams.length} scheduled`}
            linkLabel="View all"
            onLink={() => navigate("/exams")}
          />
          {exams.length === 0 ? (
            <EmptyState icon={CheckCircle2} dashed={false} title="No exams scheduled" message="No upcoming exams scheduled." />
          ) : (
            <div className="divide-y divide-zinc-50">
              {exams.map((exam) => {
                const daysLeft = getDaysUntil(exam.date);
                const isUrgent = daysLeft <= 3;
                return (
                  <button
                    key={exam.id}
                    type="button"
                    onClick={() => navigate("/exams")}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50"
                  >
                    <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-zinc-900 text-white">
                      <p className="text-sm font-bold leading-none">{exam.date.split(" ")[0]}</p>
                      <p className="text-[9px] font-medium uppercase tracking-wide leading-none mt-0.5 opacity-70">
                        {exam.date.split(" ")[1]}
                      </p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-zinc-900">{exam.title}</p>
                      <p className="mt-0.5 text-[11px] text-zinc-400">{exam.subject} &middot; {exam.time}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={`text-xs font-bold ${isUrgent ? "text-rose-600" : "text-zinc-500"}`}>
                        {daysLeft === 0 ? "Today" : daysLeft === 1 ? "Tomorrow" : `${daysLeft}d`}
                      </p>
                      <p className="text-[10px] text-zinc-400">{exam.day}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Announcements */}
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <SectionHeader
            title="Announcements"
            subtitle="Latest from school"
            linkLabel="View all"
            onLink={() => navigate("/announcements")}
          />
          {announcements.length === 0 ? (
            <EmptyState icon={CheckCircle2} dashed={false} title="No announcements" message="No announcements at this time." />
          ) : (
            <div className="divide-y divide-zinc-50">
              {announcements.map((ann) => (
                <button
                  key={ann.id}
                  type="button"
                  onClick={() => navigate("/announcements")}
                  className="flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50"
                >
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${ann.important ? "bg-rose-50" : "bg-zinc-100"}`}>
                    <Megaphone size={13} strokeWidth={1.8} className={ann.important ? "text-rose-500" : "text-zinc-400"} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-zinc-900 leading-snug">{ann.title}</p>
                      {ann.important && (
                        <span className="shrink-0 rounded-full bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-rose-600">
                          Important
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-zinc-500">{ann.description}</p>
                    <p className="mt-1 text-[10px] text-zinc-400">{ann.date} &middot; {ann.category}</p>
                  </div>
                  <ChevronRight size={14} className="mt-1 shrink-0 text-zinc-300" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}