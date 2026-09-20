import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMonthAttendanceMap, type AttendanceStatus } from "../../services/mock/attendance";
import { getUpcomingExams } from "../../services/mock/exams";
import { getCalendarEventsForMonth } from "../../services/mock/academicCalendar";

const eventColors: Record<string, string> = {
  Holiday: "bg-blue-50 border-blue-100 text-blue-700",
  PTM: "bg-emerald-50 border-emerald-100 text-emerald-700",
  Event: "bg-amber-50 border-amber-100 text-amber-700",
};

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-500",
  Absent: "bg-rose-500",
  Late: "bg-amber-400",
  Holiday: "bg-blue-300",
  Leave: "bg-violet-400",
};

export default function CalendarPage() {
  const { selectedChild } = useAuth();
  const sid = selectedChild?.id ?? "STU001";
  
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const attMap = getMonthAttendanceMap(sid);
  const exams = getUpcomingExams(sid);
  const monthEvents = getCalendarEventsForMonth(currentDate.getFullYear(), currentDate.getMonth());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  const cells = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    if (day > 0 && day <= daysInMonth) return day;
    return null;
  });

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Calendar & Events</h1>
        <p className="mt-1 text-sm text-zinc-500">School calendar, holidays, and your attendance.</p>
      </section>

      <section className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Calendar Widget */}
        <div className="flex-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-100 p-5">
            <h2 className="text-lg font-bold text-zinc-900">{monthName} {year}</h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"><ChevronLeft size={20}/></button>
              <button onClick={nextMonth} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"><ChevronRight size={20}/></button>
            </div>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{d}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2 text-center">
              {cells.map((day, i) => {
                const isCurrentMonth = currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth();
                const status = day ? attMap[day] : null;
                const hasExam = day && exams.some(e => e.date.startsWith(day.toString().padStart(2, '0')));
                const isToday = isCurrentMonth && day === today.getDate();
                const hasEvent = day && monthEvents.some(e => new Date(e.date).getDate() === day);

                return (
                  <div key={i} className={`flex h-14 flex-col items-center justify-start rounded-lg p-1.5 transition ${day ? 'bg-zinc-50 hover:bg-zinc-100 cursor-pointer border border-zinc-100' : 'opacity-0'}`}>
                    {day && (
                      <>
                        <span className={`text-sm font-semibold ${isToday ? "bg-zinc-900 text-white w-6 h-6 rounded-full flex items-center justify-center" : "text-zinc-700"}`}>
                          {day}
                        </span>
                        <div className="mt-auto flex gap-1">
                          {status && <div className={`h-1.5 w-1.5 rounded-full ${STATUS_COLORS[status]}`} />}
                          {hasExam && <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />}
                          {hasEvent && <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 flex flex-wrap gap-4 border-t border-zinc-100 pt-4 px-2">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500"><div className="h-2.5 w-2.5 rounded-full bg-emerald-500"/> Present</div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500"><div className="h-2.5 w-2.5 rounded-full bg-rose-500"/> Absent</div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500"><div className="h-2.5 w-2.5 rounded-full bg-blue-300"/> Holiday</div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500"><div className="h-2.5 w-2.5 rounded-full bg-violet-500"/> Exam</div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500"><div className="h-2.5 w-2.5 rounded-full bg-amber-500"/> Event/PTM</div>
            </div>
          </div>
        </div>
        
        {/* Upcoming Events List */}
        <div className="w-full lg:w-80 space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
            <div className="border-b border-zinc-100 p-4">
              <h3 className="font-semibold text-zinc-900">Upcoming in {monthName}</h3>
            </div>
            <div className="divide-y divide-zinc-100">
              {exams.length === 0 && monthEvents.length === 0 && (
                <div className="p-6 text-center text-sm text-zinc-400">Nothing scheduled this month.</div>
              )}
              {exams.map(e => (
                <div key={e.id} className="p-4 flex gap-3">
                  <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-violet-50 border border-violet-100 shrink-0">
                    <span className="text-xs font-bold text-violet-700">{e.date.split(" ")[0]}</span>
                    <span className="text-[9px] font-medium text-violet-500">{e.date.split(" ")[1]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 leading-tight">{e.title}</p>
                    <p className="text-xs text-zinc-500 mt-1">{e.time}</p>
                  </div>
                </div>
              ))}
              {monthEvents.map(ev => {
                const d = new Date(ev.date);
                const colorClass = eventColors[ev.type] ?? "bg-zinc-50 border-zinc-100 text-zinc-700";
                return (
                  <div key={ev.id} className="p-4 flex gap-3">
                    <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg border shrink-0 ${colorClass}`}>
                      <span className="text-xs font-bold">{d.getDate()}</span>
                      <span className="text-[9px] font-medium">{d.toLocaleString("default", { month: "short" })}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 leading-tight">{ev.title}</p>
                      <p className="text-xs text-zinc-500 mt-1">{ev.timeLabel}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}