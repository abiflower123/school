// ============================================================
// Mock Timetable Service
// Timetable per student per day. Replace with API later.
// ============================================================

export type Period = {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  type: "Lecture" | "Practical" | "Activity" | "Break" | "Assembly";
};

export type DayTimetable = {
  day: string;
  periods: Period[];
};

// Days are 0=Sunday … 6=Saturday; school is Mon(1)–Sat(6)
const timetableSTU001: Record<number, Period[]> = {
  1: [
    { id: "p1", time: "08:45 – 09:30", subject: "Assembly", teacher: "", room: "Ground", type: "Assembly" },
    { id: "p2", time: "09:30 – 10:15", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "Room 10-A", type: "Lecture" },
    { id: "p3", time: "10:15 – 11:00", subject: "Science", teacher: "Mrs. Priya Devi", room: "Room 10-A", type: "Lecture" },
    { id: "p4", time: "11:15 – 12:00", subject: "English", teacher: "Ms. Anitha Kumari", room: "Room 10-A", type: "Lecture" },
    { id: "p5", time: "12:00 – 12:45", subject: "Social Science", teacher: "Mr. Kumar Selvam", room: "Room 10-A", type: "Lecture" },
    { id: "p6", time: "13:30 – 14:15", subject: "Computer Science", teacher: "Mr. Arun Prasad", room: "Computer Lab", type: "Practical" },
    { id: "p7", time: "14:15 – 15:00", subject: "Physical Education", teacher: "Mr. Suresh Babu", room: "Ground", type: "Activity" },
  ],
  2: [
    { id: "p1", time: "09:00 – 09:45", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "Room 10-A", type: "Lecture" },
    { id: "p2", time: "09:45 – 10:30", subject: "Tamil", teacher: "Mrs. Meena Sundaram", room: "Room 10-A", type: "Lecture" },
    { id: "p3", time: "10:45 – 11:30", subject: "Science", teacher: "Mrs. Priya Devi", room: "Science Lab", type: "Practical" },
    { id: "p4", time: "11:30 – 12:15", subject: "English", teacher: "Ms. Anitha Kumari", room: "Room 10-A", type: "Lecture" },
    { id: "p5", time: "13:15 – 14:00", subject: "Social Science", teacher: "Mr. Kumar Selvam", room: "Room 10-A", type: "Lecture" },
    { id: "p6", time: "14:00 – 14:45", subject: "Computer Science", teacher: "Mr. Arun Prasad", room: "Computer Lab", type: "Practical" },
  ],
  3: [
    { id: "p1", time: "09:00 – 09:45", subject: "Tamil", teacher: "Mrs. Meena Sundaram", room: "Room 10-A", type: "Lecture" },
    { id: "p2", time: "09:45 – 10:30", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "Room 10-A", type: "Lecture" },
    { id: "p3", time: "10:45 – 11:30", subject: "English", teacher: "Ms. Anitha Kumari", room: "Room 10-A", type: "Lecture" },
    { id: "p4", time: "11:30 – 12:15", subject: "Science", teacher: "Mrs. Priya Devi", room: "Room 10-A", type: "Lecture" },
    { id: "p5", time: "13:15 – 14:00", subject: "Social Science", teacher: "Mr. Kumar Selvam", room: "Room 10-A", type: "Lecture" },
    { id: "p6", time: "14:00 – 14:45", subject: "Art & Craft", teacher: "Ms. Vani Raj", room: "Art Room", type: "Activity" },
  ],
  4: [
    { id: "p1", time: "09:00 – 09:45", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "Room 10-A", type: "Lecture" },
    { id: "p2", time: "09:45 – 10:30", subject: "Science", teacher: "Mrs. Priya Devi", room: "Science Lab", type: "Practical" },
    { id: "p3", time: "10:45 – 11:30", subject: "Tamil", teacher: "Mrs. Meena Sundaram", room: "Room 10-A", type: "Lecture" },
    { id: "p4", time: "11:30 – 12:15", subject: "Computer Science", teacher: "Mr. Arun Prasad", room: "Computer Lab", type: "Practical" },
    { id: "p5", time: "13:15 – 14:00", subject: "English", teacher: "Ms. Anitha Kumari", room: "Room 10-A", type: "Lecture" },
    { id: "p6", time: "14:00 – 14:45", subject: "Social Science", teacher: "Mr. Kumar Selvam", room: "Room 10-A", type: "Lecture" },
  ],
  5: [
    { id: "p1", time: "09:00 – 09:45", subject: "English", teacher: "Ms. Anitha Kumari", room: "Room 10-A", type: "Lecture" },
    { id: "p2", time: "09:45 – 10:30", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "Room 10-A", type: "Lecture" },
    { id: "p3", time: "10:45 – 11:30", subject: "Social Science", teacher: "Mr. Kumar Selvam", room: "Room 10-A", type: "Lecture" },
    { id: "p4", time: "11:30 – 12:15", subject: "Tamil", teacher: "Mrs. Meena Sundaram", room: "Room 10-A", type: "Lecture" },
    { id: "p5", time: "13:15 – 14:00", subject: "Physical Education", teacher: "Mr. Suresh Babu", room: "Ground", type: "Activity" },
    { id: "p6", time: "14:00 – 14:45", subject: "Science", teacher: "Mrs. Priya Devi", room: "Room 10-A", type: "Lecture" },
  ],
  6: [
    { id: "p1", time: "09:00 – 09:45", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "Room 10-A", type: "Lecture" },
    { id: "p2", time: "09:45 – 10:30", subject: "Science", teacher: "Mrs. Priya Devi", room: "Room 10-A", type: "Lecture" },
    { id: "p3", time: "10:45 – 11:30", subject: "English", teacher: "Ms. Anitha Kumari", room: "Room 10-A", type: "Lecture" },
    { id: "p4", time: "11:30 – 12:15", subject: "Social Science", teacher: "Mr. Kumar Selvam", room: "Room 10-A", type: "Lecture" },
    { id: "p5", time: "13:15 – 14:00", subject: "Computer Science", teacher: "Mr. Arun Prasad", room: "Computer Lab", type: "Practical" },
    { id: "p6", time: "14:00 – 14:45", subject: "Physical Education", teacher: "Mr. Suresh Babu", room: "Ground", type: "Activity" },
  ],
};

const timetableSTU002: Record<number, Period[]> = {
  1: [
    { id: "p1", time: "09:00 – 09:45", subject: "Mathematics", teacher: "Mrs. Lakshmi Priya", room: "Room 7-B", type: "Lecture" },
    { id: "p2", time: "09:45 – 10:30", subject: "Science", teacher: "Mr. Venkat Raman", room: "Room 7-B", type: "Lecture" },
    { id: "p3", time: "10:45 – 11:30", subject: "Tamil", teacher: "Mrs. Saraswathi", room: "Room 7-B", type: "Lecture" },
    { id: "p4", time: "11:30 – 12:15", subject: "English", teacher: "Mr. David Raj", room: "Room 7-B", type: "Lecture" },
    { id: "p5", time: "13:15 – 14:00", subject: "Social Science", teacher: "Mrs. Usha", room: "Room 7-B", type: "Lecture" },
    { id: "p6", time: "14:00 – 14:45", subject: "Art", teacher: "Ms. Geetha", room: "Art Room", type: "Activity" },
  ],
  2: [
    { id: "p1", time: "09:00 – 09:45", subject: "Tamil", teacher: "Mrs. Saraswathi", room: "Room 7-B", type: "Lecture" },
    { id: "p2", time: "09:45 – 10:30", subject: "Mathematics", teacher: "Mrs. Lakshmi Priya", room: "Room 7-B", type: "Lecture" },
    { id: "p3", time: "10:45 – 11:30", subject: "English", teacher: "Mr. David Raj", room: "Room 7-B", type: "Lecture" },
    { id: "p4", time: "11:30 – 12:15", subject: "Science", teacher: "Mr. Venkat Raman", room: "Science Lab", type: "Practical" },
    { id: "p5", time: "13:15 – 14:00", subject: "Physical Education", teacher: "Mr. Suresh", room: "Ground", type: "Activity" },
  ],
  3: [
    { id: "p1", time: "09:00 – 09:45", subject: "English", teacher: "Mr. David Raj", room: "Room 7-B", type: "Lecture" },
    { id: "p2", time: "09:45 – 10:30", subject: "Social Science", teacher: "Mrs. Usha", room: "Room 7-B", type: "Lecture" },
    { id: "p3", time: "10:45 – 11:30", subject: "Mathematics", teacher: "Mrs. Lakshmi Priya", room: "Room 7-B", type: "Lecture" },
    { id: "p4", time: "11:30 – 12:15", subject: "Tamil", teacher: "Mrs. Saraswathi", room: "Room 7-B", type: "Lecture" },
    { id: "p5", time: "13:15 – 14:00", subject: "Science", teacher: "Mr. Venkat Raman", room: "Room 7-B", type: "Lecture" },
  ],
  4: [
    { id: "p1", time: "09:00 – 09:45", subject: "Science", teacher: "Mr. Venkat Raman", room: "Room 7-B", type: "Lecture" },
    { id: "p2", time: "09:45 – 10:30", subject: "Tamil", teacher: "Mrs. Saraswathi", room: "Room 7-B", type: "Lecture" },
    { id: "p3", time: "10:45 – 11:30", subject: "Mathematics", teacher: "Mrs. Lakshmi Priya", room: "Room 7-B", type: "Lecture" },
    { id: "p4", time: "11:30 – 12:15", subject: "English", teacher: "Mr. David Raj", room: "Room 7-B", type: "Lecture" },
    { id: "p5", time: "13:15 – 14:00", subject: "Social Science", teacher: "Mrs. Usha", room: "Room 7-B", type: "Lecture" },
  ],
  5: [
    { id: "p1", time: "09:00 – 09:45", subject: "Mathematics", teacher: "Mrs. Lakshmi Priya", room: "Room 7-B", type: "Lecture" },
    { id: "p2", time: "09:45 – 10:30", subject: "English", teacher: "Mr. David Raj", room: "Room 7-B", type: "Lecture" },
    { id: "p3", time: "10:45 – 11:30", subject: "Social Science", teacher: "Mrs. Usha", room: "Room 7-B", type: "Lecture" },
    { id: "p4", time: "11:30 – 12:15", subject: "Science", teacher: "Mr. Venkat Raman", room: "Science Lab", type: "Practical" },
    { id: "p5", time: "13:15 – 14:00", subject: "Physical Education", teacher: "Mr. Suresh", room: "Ground", type: "Activity" },
  ],
  6: [
    { id: "p1", time: "09:00 – 09:45", subject: "Tamil", teacher: "Mrs. Saraswathi", room: "Room 7-B", type: "Lecture" },
    { id: "p2", time: "09:45 – 10:30", subject: "Mathematics", teacher: "Mrs. Lakshmi Priya", room: "Room 7-B", type: "Lecture" },
    { id: "p3", time: "10:45 – 11:30", subject: "Science", teacher: "Mr. Venkat Raman", room: "Room 7-B", type: "Lecture" },
    { id: "p4", time: "11:30 – 12:15", subject: "English", teacher: "Mr. David Raj", room: "Room 7-B", type: "Lecture" },
    { id: "p5", time: "13:15 – 14:00", subject: "Social Science", teacher: "Mrs. Usha", room: "Room 7-B", type: "Lecture" },
  ],
};

const timetableSTU003 = timetableSTU001; // Same class, slightly reused for brevity

const timetables: Record<string, Record<number, Period[]>> = {
  STU001: timetableSTU001,
  STU002: timetableSTU002,
  STU003: timetableSTU003,
};

export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function getTimetableForDay(studentId: string, dayIndex: number): Period[] {
  return timetables[studentId]?.[dayIndex] ?? [];
}

export function getTodayTimetable(studentId: string): Period[] {
  const today = new Date().getDay();
  return getTimetableForDay(studentId, today);
}

export function getNextClasses(studentId: string, count: number = 3): Period[] {
  const now = new Date();
  const todayPeriods = getTodayTimetable(studentId);
  // Filter to upcoming periods by parsing time
  const upcoming = todayPeriods.filter((p) => {
    const [start] = p.time.split("–").map((t) => t.trim());
    const [h, m] = start.split(":").map(Number);
    const periodTime = new Date();
    periodTime.setHours(h, m, 0);
    return periodTime > now;
  });
  return upcoming.slice(0, count).length > 0 ? upcoming.slice(0, count) : todayPeriods.slice(0, count);
}
