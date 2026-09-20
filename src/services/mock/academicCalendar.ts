// ============================================================
// Mock Academic Calendar Service — school-wide (not per-child)
// ============================================================

export type CalendarEventType = "Holiday" | "Event" | "PTM";

export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: CalendarEventType;
  timeLabel: string;
};

const events: CalendarEvent[] = [
  { id: "CE1", title: "Public Holiday — Gandhi Jayanti", date: "2026-10-02", type: "Holiday", timeLabel: "School Closed" },
  { id: "CE2", title: "Parent Teacher Meeting", date: "2026-09-27", type: "PTM", timeLabel: "09:00 AM – 01:00 PM" },
  { id: "CE3", title: "Annual Sports Day", date: "2026-09-30", type: "Event", timeLabel: "08:00 AM onwards" },
  { id: "CE4", title: "Diwali Break Begins", date: "2026-11-05", type: "Holiday", timeLabel: "School Closed" },
  { id: "CE5", title: "Independence Day", date: "2026-08-15", type: "Holiday", timeLabel: "School Closed" },
];

export function getCalendarEvents(): CalendarEvent[] {
  return events;
}

export function getCalendarEventsForMonth(year: number, monthIndex: number): CalendarEvent[] {
  return events.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === monthIndex;
  });
}
