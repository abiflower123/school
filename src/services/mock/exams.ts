// ============================================================
// Mock Exams & Results Service
// ============================================================

export type ExamStatus = "Upcoming" | "Today" | "Completed";

export type Exam = {
  id: string;
  subject: string;
  title: string;
  date: string;
  day: string;
  time: string;
  duration: string;
  room: string;
  syllabus: string;
  status: ExamStatus;
};

export type ExamResult = {
  id: string;
  examTitle: string;
  subject: string;
  date: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  teacherRemark?: string;
};

export type TermReport = {
  term: "Term 1" | "Term 2" | "Annual";
  year: string;
  subjects: {
    subject: string;
    marksObtained: number;
    totalMarks: number;
    percentage: number;
    grade: string;
    internalMarks?: number;
    externalMarks?: number;
  }[];
  overallPercentage: number;
  overallGrade: string;
  rank: number;
  totalStudents: number;
  classAverage: number;
  teacherRemark: string;
  reportPublished: boolean;
};

function getGrade(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  return "D";
}

const upcomingExamsSTU001: Exam[] = [
  { id: "E001", subject: "Mathematics", title: "Unit Test — Algebra", date: "22 Sep 2026", day: "Tuesday", time: "09:00 AM – 10:00 AM", duration: "1 hour", room: "Room 10-A", syllabus: "Chapter 4 — Quadratic Equations; Chapter 5 — Arithmetic Progressions", status: "Upcoming" },
  { id: "E002", subject: "Science", title: "Periodic Assessment", date: "26 Sep 2026", day: "Saturday", time: "10:30 AM – 11:30 AM", duration: "1 hour", room: "Room 10-A", syllabus: "Chemistry — Chapters 1–3; Biology — Chapters 4–5", status: "Upcoming" },
];

const pastResultsSTU001: ExamResult[] = [
  { id: "R001", examTitle: "Grammar Assessment", subject: "English", date: "05 Sep 2026", marksObtained: 42, totalMarks: 50, percentage: 84, grade: "A", teacherRemark: "Good performance. Work on essay length." },
  { id: "R002", examTitle: "Chapter Test — History", subject: "Social Science", date: "02 Sep 2026", marksObtained: 45, totalMarks: 50, percentage: 90, grade: "A+", teacherRemark: "Excellent!" },
  { id: "R003", examTitle: "Programming Basics Test", subject: "Computer Science", date: "29 Aug 2026", marksObtained: 47, totalMarks: 50, percentage: 94, grade: "A+", teacherRemark: "Outstanding!" },
  { id: "R004", examTitle: "Unit Test — Real Numbers", subject: "Mathematics", date: "22 Aug 2026", marksObtained: 38, totalMarks: 50, percentage: 76, grade: "B+", teacherRemark: "Needs more practice on proofs." },
  { id: "R005", examTitle: "Science Lab Assessment", subject: "Science", date: "15 Aug 2026", marksObtained: 46, totalMarks: 50, percentage: 92, grade: "A+", teacherRemark: "Excellent practical skills." },
];

const termReportsSTU001: TermReport[] = [
  {
    term: "Term 1",
    year: "2026–2027",
    subjects: [
      { subject: "Mathematics", marksObtained: 86, totalMarks: 100, percentage: 86, grade: "A" },
      { subject: "Science", marksObtained: 91, totalMarks: 100, percentage: 91, grade: "A+" },
      { subject: "English", marksObtained: 84, totalMarks: 100, percentage: 84, grade: "A" },
      { subject: "Social Science", marksObtained: 88, totalMarks: 100, percentage: 88, grade: "A" },
      { subject: "Tamil", marksObtained: 90, totalMarks: 100, percentage: 90, grade: "A+" },
      { subject: "Computer Science", marksObtained: 94, totalMarks: 100, percentage: 94, grade: "A+" },
    ],
    overallPercentage: 88.8,
    overallGrade: "A",
    rank: 4,
    totalStudents: 42,
    classAverage: 76.5,
    teacherRemark: "Arjun has shown consistent progress throughout the term. He participates actively in classroom activities and demonstrates a good understanding of the subjects. Continued focus on revision and regular practice is recommended.",
    reportPublished: true,
  },
];

const upcomingExamsSTU002: Exam[] = [
  { id: "E101", subject: "Mathematics", title: "Chapter Test — Fractions", date: "24 Sep 2026", day: "Thursday", time: "09:00 AM – 10:00 AM", duration: "1 hour", room: "Room 7-B", syllabus: "Chapter 2 — Fractions and Decimals", status: "Upcoming" },
];

const pastResultsSTU002: ExamResult[] = [
  { id: "R101", examTitle: "Unit Test — Integers", subject: "Mathematics", date: "05 Sep 2026", marksObtained: 32, totalMarks: 50, percentage: 64, grade: "B", teacherRemark: "Needs more practice. Review negative number operations." },
  { id: "R102", examTitle: "English Reading Comprehension", subject: "English", date: "02 Sep 2026", marksObtained: 38, totalMarks: 50, percentage: 76, grade: "B+", teacherRemark: "Good reading speed." },
  { id: "R103", examTitle: "Science — Plants", subject: "Science", date: "28 Aug 2026", marksObtained: 42, totalMarks: 50, percentage: 84, grade: "A", teacherRemark: "Well done on diagrams!" },
];

const termReportsSTU002: TermReport[] = [
  {
    term: "Term 1",
    year: "2026–2027",
    subjects: [
      { subject: "Mathematics", marksObtained: 58, totalMarks: 100, percentage: 58, grade: "C" },
      { subject: "Science", marksObtained: 74, totalMarks: 100, percentage: 74, grade: "B+" },
      { subject: "English", marksObtained: 70, totalMarks: 100, percentage: 70, grade: "B+" },
      { subject: "Social Science", marksObtained: 68, totalMarks: 100, percentage: 68, grade: "B" },
      { subject: "Tamil", marksObtained: 82, totalMarks: 100, percentage: 82, grade: "A" },
    ],
    overallPercentage: 70.4,
    overallGrade: "B+",
    rank: 22,
    totalStudents: 40,
    classAverage: 68.2,
    teacherRemark: "Priya is a cheerful student who participates actively. She needs to focus more on Mathematics and Social Science. Regular revision will improve her scores significantly.",
    reportPublished: true,
  },
];

const upcomingExamsSTU003: Exam[] = [
  { id: "E201", subject: "Mathematics", title: "Unit Test — Algebra", date: "22 Sep 2026", day: "Tuesday", time: "09:00 AM – 10:00 AM", duration: "1 hour", room: "Room 10-B", syllabus: "Chapter 4 — Quadratic Equations; Chapter 5 — Arithmetic Progressions", status: "Upcoming" },
  { id: "E202", subject: "English", title: "Grammar Assessment", date: "25 Sep 2026", day: "Friday", time: "11:00 AM – 12:00 PM", duration: "1 hour", room: "Room 10-B", syllabus: "Grammar — Tenses, Reported Speech, Letter Writing", status: "Upcoming" },
];

const pastResultsSTU003: ExamResult[] = [
  { id: "R201", examTitle: "Unit Test — Polynomials", subject: "Mathematics", date: "05 Sep 2026", marksObtained: 48, totalMarks: 50, percentage: 96, grade: "A+", teacherRemark: "Excellent!" },
  { id: "R202", examTitle: "Science Lab Test", subject: "Science", date: "02 Sep 2026", marksObtained: 46, totalMarks: 50, percentage: 92, grade: "A+", teacherRemark: "Very good practical skills." },
];

const termReportsSTU003: TermReport[] = [
  {
    term: "Term 1",
    year: "2026–2027",
    subjects: [
      { subject: "Mathematics", marksObtained: 94, totalMarks: 100, percentage: 94, grade: "A+" },
      { subject: "Science", marksObtained: 96, totalMarks: 100, percentage: 96, grade: "A+" },
      { subject: "English", marksObtained: 88, totalMarks: 100, percentage: 88, grade: "A" },
      { subject: "Social Science", marksObtained: 82, totalMarks: 100, percentage: 82, grade: "A" },
      { subject: "Tamil", marksObtained: 90, totalMarks: 100, percentage: 90, grade: "A+" },
      { subject: "Computer Science", marksObtained: 97, totalMarks: 100, percentage: 97, grade: "A+" },
    ],
    overallPercentage: 91.2,
    overallGrade: "A+",
    rank: 2,
    totalStudents: 44,
    classAverage: 78.3,
    teacherRemark: "Kavya is an outstanding student who consistently performs at the top of her class. She is disciplined, attentive, and has excellent problem-solving skills. Keep it up!",
    reportPublished: true,
  },
];

const allUpcomingExams: Record<string, Exam[]> = { STU001: upcomingExamsSTU001, STU002: upcomingExamsSTU002, STU003: upcomingExamsSTU003 };
const allPastResults: Record<string, ExamResult[]> = { STU001: pastResultsSTU001, STU002: pastResultsSTU002, STU003: pastResultsSTU003 };
const allTermReports: Record<string, TermReport[]> = { STU001: termReportsSTU001, STU002: termReportsSTU002, STU003: termReportsSTU003 };

export function getUpcomingExams(studentId: string): Exam[] {
  return allUpcomingExams[studentId] ?? [];
}

export function getPastResults(studentId: string): ExamResult[] {
  return allPastResults[studentId] ?? [];
}

export function getTermReports(studentId: string): TermReport[] {
  return allTermReports[studentId] ?? [];
}

export function getLatestTermReport(studentId: string): TermReport | undefined {
  const reports = getTermReports(studentId);
  return reports[reports.length - 1];
}

export { getGrade };
