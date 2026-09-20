import { useState, useEffect } from "react";
import {
  Clock3,
  MapPin,
  UserRound,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Languages,
  Monitor,
  Palette,
  Dumbbell,
  Music,
  Users,
  Coffee,
  CalendarDays,
  Video,
  FileText,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getTimetableForDay, DAYS, type Period } from "../../services/mock/timetable";

// ─── Helpers ───────────────────────────────────────────────

function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDateDisplay(d: Date) {
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" });
}

function formatDateForAttendance(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function getSubjectIcon(subject: string) {
  const s = subject.toLowerCase();
  if (s.includes("math")) return Calculator;
  if (s.includes("sci") && !s.includes("social") && !s.includes("computer")) return FlaskConical;
  if (s.includes("social") || s.includes("history") || s.includes("geo")) return Globe;
  if (s.includes("eng") || s.includes("lang") || s.includes("tamil") || s.includes("hindi")) return Languages;
  if (s.includes("comp") || s.includes("it")) return Monitor;
  if (s.includes("art") || s.includes("craft")) return Palette;
  if (s.includes("physical") || s.includes("sport") || s.includes("pt")) return Dumbbell;
  if (s.includes("music")) return Music;
  if (s.includes("assembly")) return Users;
  if (s.includes("break") || s.includes("lunch")) return Coffee;
  return BookOpen;
}

function getSubjectColor(subject: string) {
  const s = subject.toLowerCase();
  if (s.includes("math")) return "bg-blue-50 text-blue-600";
  if (s.includes("sci") && !s.includes("social") && !s.includes("computer")) return "bg-emerald-50 text-emerald-600";
  if (s.includes("social") || s.includes("history") || s.includes("geo")) return "bg-amber-50 text-amber-600";
  if (s.includes("eng") || s.includes("lang") || s.includes("tamil") || s.includes("hindi")) return "bg-violet-50 text-violet-600";
  if (s.includes("comp") || s.includes("it")) return "bg-cyan-50 text-cyan-600";
  if (s.includes("art") || s.includes("craft")) return "bg-pink-50 text-pink-600";
  if (s.includes("physical") || s.includes("sport") || s.includes("pt")) return "bg-orange-50 text-orange-600";
  if (s.includes("assembly")) return "bg-indigo-50 text-indigo-600";
  if (s.includes("break") || s.includes("lunch")) return "bg-zinc-100 text-zinc-500";
  return "bg-zinc-100 text-zinc-600";
}

import { getAllAttendanceRecords } from "../../services/mock/attendance";

// ─── Component ──────────────────────────────────────────────
export default function TimetablePage() {
  const { selectedChild } = useAuth();
  const sid = selectedChild?.id ?? "STU001";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [weekStart, setWeekStart] = useState<Date>(getMonday(today));
  const [selectedDate, setSelectedDate] = useState<Date>(today.getDay() === 0 ? getMonday(today) : today);

  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const selectedDayIndex = selectedDate.getDay();
  const periods = getTimetableForDay(sid, selectedDayIndex);
  
  const allAttendance = getAllAttendanceRecords(sid);
  const formattedSelectedDate = formatDateForAttendance(selectedDate);
  const attendanceRecord = allAttendance.find(a => a.date === formattedSelectedDate);
  const isHoliday = attendanceRecord?.status === "Holiday" || selectedDayIndex === 0;

  // Generate the 6 days of the week (Mon-Sat)
  const weekDays = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const handlePrevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
    // Auto-select Monday of that week
    setSelectedDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
    setSelectedDate(next);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 lg:space-y-8">
      {/* Page Header */}
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Timetable</h1>
        <p className="mt-1 text-sm text-zinc-500">
          View the daily class schedule and active periods.
        </p>
      </section>

      {/* Segmented Control / Date Selector */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-semibold text-zinc-900">
            {weekStart.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevWeek}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition"
            >
              &lt;
            </button>
            <button
              type="button"
              onClick={() => {
                setWeekStart(getMonday(today));
                setSelectedDate(today.getDay() === 0 ? getMonday(today) : today);
              }}
              className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 px-2 transition"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleNextWeek}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition"
            >
              &gt;
            </button>
          </div>
        </div>

        <div className="flex w-full overflow-x-auto rounded-xl bg-zinc-100 p-1">
          <div className="flex min-w-max flex-1 gap-1">
            {weekDays.map((dayDate) => {
              const isSelected = selectedDate.getTime() === dayDate.getTime();
              const isToday = today.getTime() === dayDate.getTime();
              return (
                <button
                  key={dayDate.toISOString()}
                  type="button"
                  onClick={() => setSelectedDate(dayDate)}
                  className={`relative flex flex-1 flex-col items-center justify-center rounded-lg px-6 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-zinc-300 ${
                    isSelected
                      ? "bg-white text-zinc-900 shadow-sm font-semibold"
                      : "text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-900 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {formatDateDisplay(dayDate)}
                    {isToday && (
                      <span
                        className={`hidden h-1.5 w-1.5 rounded-full sm:block ${
                          isSelected ? "bg-emerald-500" : "bg-emerald-400"
                        }`}
                      />
                    )}
                  </div>
                  {isToday && (
                    <span
                      className={`text-[9px] uppercase tracking-wider sm:hidden ${
                        isSelected ? "text-emerald-600" : "text-emerald-500"
                      }`}
                    >
                      Today
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Layout */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">{DAYS[selectedDayIndex]}'s Schedule</h2>
            <p className="mt-0.5 text-sm text-zinc-400">
              {periods.length > 0 ? `${periods.length} scheduled periods` : "No classes scheduled"}
            </p>
          </div>
          <CalendarDays className="text-zinc-300" size={24} strokeWidth={1.5} />
        </div>

        {isHoliday ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <CalendarDays size={28} className="text-blue-500" strokeWidth={1.5} />
            </div>
            <p className="mt-4 text-base font-bold text-zinc-900">School Holiday</p>
            <p className="mt-1 text-sm text-zinc-500 max-w-sm">
              {selectedDayIndex === 0 ? "Sunday is a holiday. Enjoy the weekend!" : `It's an official holiday on ${formattedSelectedDate}. Enjoy your day off!`}
            </p>
          </div>
        ) : periods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50">
              <Coffee size={28} className="text-zinc-300" strokeWidth={1.5} />
            </div>
            <p className="mt-4 text-base font-semibold text-zinc-900">No classes scheduled</p>
            <p className="mt-1 text-sm text-zinc-500">
              {selectedDayIndex === 0 ? "Sunday is a holiday. Enjoy the weekend!" : "You have a free day today."}
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[39px] top-4 bottom-4 w-px bg-zinc-200 sm:left-[119px]" />

            <div className="space-y-6">
              {periods.map((period) => {
                const nowTime = new Date();
                const isToday = today.getTime() === selectedDate.getTime();

                let isNow = false;
                let isPast = false;

                if (isToday) {
                  const timeParts = period.time.split("–");
                  if (timeParts.length === 2) {
                    const parseTime = (t: string) => {
                      const [h, m] = t.trim().split(":").map(Number);
                      const d = new Date();
                      d.setHours(h, m, 0, 0);
                      return d;
                    };
                    const start = parseTime(timeParts[0]);
                    const end = parseTime(timeParts[1]);
                    isNow = start <= nowTime && nowTime <= end;
                    isPast = end < nowTime;
                  }
                } else if (selectedDate.getTime() < today.getTime()) {
                   isPast = true;
                }

                const SubjectIcon = getSubjectIcon(period.subject);
                const colorClass = getSubjectColor(period.subject);

                return (
                  <div key={period.id} className="relative flex items-start gap-4 sm:gap-6 group">
                    {/* Time (Desktop left column) */}
                    <div className="hidden w-24 shrink-0 flex-col items-end pt-1 sm:flex">
                      <span className={`text-sm font-semibold ${isPast ? "text-zinc-300" : isNow ? "text-emerald-600" : "text-zinc-700"}`}>
                        {period.time.split("–")[0]?.trim()}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        {period.time.split("–")[1]?.trim()}
                      </span>
                    </div>

                    {/* Timeline Node */}
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center pt-1 z-10 sm:w-12">
                      <div className="flex h-full items-start justify-center">
                        <div
                          className={`mt-1 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm ring-1 ring-zinc-200 transition-all ${
                            isNow
                              ? "bg-emerald-500 ring-emerald-200 ring-offset-2 animate-pulse"
                              : isPast
                              ? "bg-zinc-200 ring-transparent"
                              : "bg-white"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Main Card */}
                    <div
                      className={`flex-1 rounded-xl border border-zinc-200/80 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-sm ${
                        isNow ? "ring-1 ring-emerald-500/20 shadow-[0_4px_20px_rgba(16,185,129,0.06)]" : ""
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          {/* Subject Icon Box */}
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                            <SubjectIcon size={20} strokeWidth={1.5} />
                          </div>
                          
                          <div className="min-w-0">
                            {/* Time (Mobile only) */}
                            <p className={`mb-1 text-[11px] font-semibold sm:hidden ${isPast ? "text-zinc-400" : isNow ? "text-emerald-600" : "text-zinc-500"}`}>
                              {period.time}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className={`truncate text-base font-bold ${isPast ? "text-zinc-500" : "text-zinc-900"}`}>
                                {period.subject}
                              </h3>
                              {isNow && (
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                                  Now
                                </span>
                              )}
                            </div>
                            
                            {/* Teacher only, clutter removed */}
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-zinc-500">
                              {period.teacher && (
                                <div className="flex items-center gap-1.5">
                                  <UserRound size={13} className="text-zinc-400" strokeWidth={1.8} />
                                  <span className="truncate">{period.teacher}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Interactive Actions for Current/Future Classes */}
                            {!isPast && (
                              <div className="mt-3 flex items-center gap-2">
                                {isNow && (
                                  <button className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 transition hover:bg-emerald-100">
                                    <Video size={12} strokeWidth={2} />
                                    JOIN CLASS
                                  </button>
                                )}
                                <button className="flex items-center gap-1.5 rounded-md bg-zinc-50 px-2.5 py-1.5 text-[10px] font-bold text-zinc-600 transition hover:bg-zinc-100 border border-zinc-200">
                                  <FileText size={12} strokeWidth={2} />
                                  MATERIALS
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right side contextual arrow */}
                        <div className="hidden sm:flex items-center justify-center pl-2">
                           <button className="p-2 text-zinc-300 hover:text-zinc-600 transition rounded-lg hover:bg-zinc-50">
                             <ChevronRight size={18} />
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}