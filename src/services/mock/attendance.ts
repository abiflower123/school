// ============================================================
// Mock Attendance Service
// Replace with API calls later.
// ============================================================

export type AttendanceStatus = "Present" | "Absent" | "Late" | "Holiday" | "Leave";

export type DayAttendance = {
  date: string; // DD MMM YYYY
  day: string;
  status: AttendanceStatus;
  remarks: string;
  isAppealed?: boolean;
};

export type SubjectAttendance = {
  subject: string;
  present: number;
  total: number;
  percentage: number;
  shortage: boolean; // below 75%
};

export type AttendanceSummary = {
  overallPercentage: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  lateDays: number;
  totalWorkingDays: number;
  monthlyPercentage: number;
  currentMonthName: string;
  shortage: boolean;
};

// ---- Data per student ----

const attendanceRecordsSTU001: DayAttendance[] = [
  { date: "19 Sep 2026", day: "Saturday", status: "Present", remarks: "Regular attendance" },
  { date: "18 Sep 2026", day: "Friday", status: "Present", remarks: "Regular attendance" },
  { date: "17 Sep 2026", day: "Thursday", status: "Present", remarks: "Regular attendance" },
  { date: "16 Sep 2026", day: "Wednesday", status: "Present", remarks: "Regular attendance" },
  { date: "15 Sep 2026", day: "Tuesday", status: "Present", remarks: "Regular attendance" },
  { date: "13 Sep 2026", day: "Saturday", status: "Present", remarks: "Regular attendance" },
  { date: "12 Sep 2026", day: "Friday", status: "Present", remarks: "Regular attendance" },
  { date: "11 Sep 2026", day: "Thursday", status: "Absent", remarks: "Medical leave" },
  { date: "10 Sep 2026", day: "Wednesday", status: "Present", remarks: "Regular attendance" },
  { date: "09 Sep 2026", day: "Tuesday", status: "Late", remarks: "Arrived at 9:10 AM" },
  { date: "08 Sep 2026", day: "Monday", status: "Present", remarks: "Regular attendance" },
  { date: "06 Sep 2026", day: "Saturday", status: "Present", remarks: "Regular attendance" },
  { date: "05 Sep 2026", day: "Friday", status: "Leave", remarks: "Approved medical leave" },
  { date: "04 Sep 2026", day: "Thursday", status: "Leave", remarks: "Approved medical leave" },
  { date: "03 Sep 2026", day: "Wednesday", status: "Present", remarks: "Regular attendance" },
  { date: "02 Sep 2026", day: "Tuesday", status: "Present", remarks: "Regular attendance" },
  { date: "01 Sep 2026", day: "Monday", status: "Present", remarks: "Regular attendance" },
  { date: "31 Aug 2026", day: "Monday", status: "Present", remarks: "Regular attendance" },
  { date: "30 Aug 2026", day: "Sunday", status: "Holiday", remarks: "Weekend" },
  { date: "29 Aug 2026", day: "Saturday", status: "Present", remarks: "Regular attendance" },
  { date: "28 Aug 2026", day: "Friday", status: "Present", remarks: "Regular attendance" },
  { date: "27 Aug 2026", day: "Thursday", status: "Absent", remarks: "Sick Leave" },
  { date: "26 Aug 2026", day: "Wednesday", status: "Present", remarks: "Regular attendance" },
  { date: "25 Aug 2026", day: "Tuesday", status: "Present", remarks: "Regular attendance" },
  { date: "24 Aug 2026", day: "Monday", status: "Late", remarks: "Traffic" },
];

const attendanceRecordsSTU002: DayAttendance[] = [
  { date: "19 Sep 2026", day: "Saturday", status: "Present", remarks: "Regular attendance" },
  { date: "18 Sep 2026", day: "Friday", status: "Absent", remarks: "Unexcused absence" },
  { date: "17 Sep 2026", day: "Thursday", status: "Present", remarks: "Regular attendance" },
  { date: "16 Sep 2026", day: "Wednesday", status: "Present", remarks: "Regular attendance" },
  { date: "15 Sep 2026", day: "Tuesday", status: "Late", remarks: "Arrived at 9:20 AM" },
  { date: "13 Sep 2026", day: "Saturday", status: "Present", remarks: "Regular attendance" },
  { date: "12 Sep 2026", day: "Friday", status: "Absent", remarks: "Fever" },
  { date: "11 Sep 2026", day: "Thursday", status: "Present", remarks: "Regular attendance" },
  { date: "10 Sep 2026", day: "Wednesday", status: "Present", remarks: "Regular attendance" },
  { date: "09 Sep 2026", day: "Tuesday", status: "Present", remarks: "Regular attendance" },
  { date: "08 Sep 2026", day: "Monday", status: "Present", remarks: "Regular attendance" },
  { date: "06 Sep 2026", day: "Saturday", status: "Present", remarks: "Regular attendance" },
  { date: "05 Sep 2026", day: "Friday", status: "Present", remarks: "Regular attendance" },
  { date: "04 Sep 2026", day: "Thursday", status: "Present", remarks: "Regular attendance" },
  { date: "03 Sep 2026", day: "Wednesday", status: "Absent", remarks: "Stomach ache" },
  { date: "02 Sep 2026", day: "Tuesday", status: "Present", remarks: "Regular attendance" },
  { date: "01 Sep 2026", day: "Monday", status: "Present", remarks: "Regular attendance" },
];

const attendanceRecordsSTU003: DayAttendance[] = [
  { date: "19 Sep 2026", day: "Saturday", status: "Present", remarks: "Regular attendance" },
  { date: "18 Sep 2026", day: "Friday", status: "Present", remarks: "Regular attendance" },
  { date: "17 Sep 2026", day: "Thursday", status: "Absent", remarks: "Family event" },
  { date: "16 Sep 2026", day: "Wednesday", status: "Present", remarks: "Regular attendance" },
  { date: "15 Sep 2026", day: "Tuesday", status: "Present", remarks: "Regular attendance" },
  { date: "13 Sep 2026", day: "Saturday", status: "Present", remarks: "Regular attendance" },
  { date: "12 Sep 2026", day: "Friday", status: "Late", remarks: "Arrived at 9:05 AM" },
  { date: "11 Sep 2026", day: "Thursday", status: "Present", remarks: "Regular attendance" },
  { date: "10 Sep 2026", day: "Wednesday", status: "Present", remarks: "Regular attendance" },
  { date: "09 Sep 2026", day: "Tuesday", status: "Present", remarks: "Regular attendance" },
  { date: "08 Sep 2026", day: "Monday", status: "Present", remarks: "Regular attendance" },
];

const subjectAttendanceSTU001: SubjectAttendance[] = [
  { subject: "Mathematics", present: 38, total: 40, percentage: 95, shortage: false },
  { subject: "Science", present: 36, total: 40, percentage: 90, shortage: false },
  { subject: "English", present: 37, total: 40, percentage: 92.5, shortage: false },
  { subject: "Social Science", present: 35, total: 40, percentage: 87.5, shortage: false },
  { subject: "Tamil", present: 39, total: 40, percentage: 97.5, shortage: false },
  { subject: "Computer Science", present: 27, total: 30, percentage: 90, shortage: false },
  { subject: "Physical Education", present: 16, total: 20, percentage: 80, shortage: false },
];

const subjectAttendanceSTU002: SubjectAttendance[] = [
  { subject: "Mathematics", present: 28, total: 40, percentage: 70, shortage: true },
  { subject: "Science", present: 32, total: 40, percentage: 80, shortage: false },
  { subject: "English", present: 30, total: 40, percentage: 75, shortage: false },
  { subject: "Social Science", present: 29, total: 40, percentage: 72.5, shortage: true },
  { subject: "Tamil", present: 35, total: 40, percentage: 87.5, shortage: false },
  { subject: "Physical Education", present: 14, total: 20, percentage: 70, shortage: true },
];

const subjectAttendanceSTU003: SubjectAttendance[] = [
  { subject: "Mathematics", present: 37, total: 40, percentage: 92.5, shortage: false },
  { subject: "Science", present: 38, total: 40, percentage: 95, shortage: false },
  { subject: "English", present: 36, total: 40, percentage: 90, shortage: false },
  { subject: "Social Science", present: 35, total: 40, percentage: 87.5, shortage: false },
  { subject: "Tamil", present: 38, total: 40, percentage: 95, shortage: false },
  { subject: "Computer Science", present: 28, total: 30, percentage: 93.3, shortage: false },
];

const summaryData: Record<string, AttendanceSummary> = {
  STU001: {
    overallPercentage: 92,
    presentDays: 138,
    absentDays: 8,
    leaveDays: 4,
    lateDays: 4,
    totalWorkingDays: 150,
    monthlyPercentage: 87.5,
    currentMonthName: "September",
    shortage: false,
  },
  STU002: {
    overallPercentage: 71,
    presentDays: 107,
    absentDays: 30,
    leaveDays: 5,
    lateDays: 8,
    totalWorkingDays: 150,
    monthlyPercentage: 68,
    currentMonthName: "September",
    shortage: true,
  },
  STU003: {
    overallPercentage: 94,
    presentDays: 141,
    absentDays: 6,
    leaveDays: 2,
    lateDays: 3,
    totalWorkingDays: 150,
    monthlyPercentage: 94,
    currentMonthName: "September",
    shortage: false,
  },
};

const allRecords: Record<string, DayAttendance[]> = {
  STU001: attendanceRecordsSTU001,
  STU002: attendanceRecordsSTU002,
  STU003: attendanceRecordsSTU003,
};

const allSubjectAttendance: Record<string, SubjectAttendance[]> = {
  STU001: subjectAttendanceSTU001,
  STU002: subjectAttendanceSTU002,
  STU003: subjectAttendanceSTU003,
};

// ---- Service functions ----

export function getAttendanceSummary(studentId: string): AttendanceSummary {
  return summaryData[studentId] ?? summaryData.STU001;
}

export function getRecentAttendanceRecords(studentId: string, limit: number = 10): DayAttendance[] {
  return (allRecords[studentId] ?? []).slice(0, limit);
}

export function getAllAttendanceRecords(studentId: string): DayAttendance[] {
  return allRecords[studentId] ?? [];
}

export function appealAttendance(studentId: string, date: string): DayAttendance[] {
  if (allRecords[studentId]) {
    allRecords[studentId] = allRecords[studentId].map((r) => 
      r.date === date ? { ...r, isAppealed: true } : r
    );
  }
  return allRecords[studentId] ?? [];
}

export function getSubjectAttendance(studentId: string): SubjectAttendance[] {
  return allSubjectAttendance[studentId] ?? [];
}

// Returns map of date string → status for calendar rendering
export function getMonthAttendanceMap(studentId: string, monthStr: string, yearStr: string): Record<string, AttendanceStatus> {
  const records = allRecords[studentId] ?? [];
  const map: Record<string, AttendanceStatus> = {};
  
  records.forEach((r) => {
    const parts = r.date.split(" ");
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parts[1];
      const year = parts[2];
      if (month === monthStr && year === yearStr) {
        map[day] = r.status;
      }
    }
  });
  return map;
}
