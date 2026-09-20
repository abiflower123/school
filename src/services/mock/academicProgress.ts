// ============================================================
// Mock Academic Progress Service
// ============================================================

export type Assessment = {
  id: string;
  name: string;
  type: "Exam" | "Unit Test" | "Internal" | "Assignment";
  subject: string;
  date: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  status: "Completed" | "Upcoming" | "Missed";
};

export type SubjectPerformance = {
  subject: string;
  currentMarks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  previousPercentage: number;
  trend: "Improving" | "Stable" | "Declining";
};

export type PerformanceTrend = {
  name: string;
  overall: number;
  classAverage: number;
  [subject: string]: any; // dynamic subject marks
};

export type AcademicMetrics = {
  overallPercentage: number;
  overallGrade: string;
  averageMarks: number;
  assessmentsCompleted: number;
  currentTermPercentage: number;
  previousTermPercentage: number;
  targetPercentage: number;
};

export type AcademicInsight = {
  id: string;
  type: "Strong Performance" | "Improving" | "Needs Attention" | "Consistent";
  message: string;
};

// ---- Mock Data ----

const metricsSTU001: AcademicMetrics = {
  overallPercentage: 88.8,
  overallGrade: "A",
  averageMarks: 88,
  assessmentsCompleted: 14,
  currentTermPercentage: 88.8,
  previousTermPercentage: 84.5,
  targetPercentage: 95.0,
};

const insightsSTU001: AcademicInsight[] = [
  { id: "i1", type: "Strong Performance", message: "Computer Science performance is outstanding at 94%." },
  { id: "i2", type: "Improving", message: "Mathematics has shown consistent improvement across the last three assessments (+8%)." },
  { id: "i3", type: "Needs Attention", message: "English literature marks decreased slightly compared to the previous term." },
];

const subjectPerformanceSTU001: SubjectPerformance[] = [
  { subject: "Mathematics", currentMarks: 86, totalMarks: 100, percentage: 86, grade: "A", previousPercentage: 78, trend: "Improving" },
  { subject: "Science", currentMarks: 91, totalMarks: 100, percentage: 91, grade: "A+", previousPercentage: 90, trend: "Stable" },
  { subject: "English", currentMarks: 84, totalMarks: 100, percentage: 84, grade: "A", previousPercentage: 86, trend: "Declining" },
  { subject: "Social Science", currentMarks: 88, totalMarks: 100, percentage: 88, grade: "A", previousPercentage: 85, trend: "Improving" },
  { subject: "Tamil", currentMarks: 90, totalMarks: 100, percentage: 90, grade: "A+", previousPercentage: 88, trend: "Improving" },
  { subject: "Computer Science", currentMarks: 94, totalMarks: 100, percentage: 94, grade: "A+", previousPercentage: 92, trend: "Stable" },
];

const trendDataSTU001: PerformanceTrend[] = [
  { name: "Jul", overall: 82, classAverage: 75, Mathematics: 78, Science: 85, English: 86 },
  { name: "Aug", overall: 85, classAverage: 76, Mathematics: 82, Science: 88, English: 84 },
  { name: "Sep", overall: 88.8, classAverage: 76.5, Mathematics: 86, Science: 91, English: 84 },
];

const assessmentHistorySTU001: Assessment[] = [
  { id: "a1", name: "Unit Test 2", type: "Unit Test", subject: "Mathematics", date: "18 Sep 2026", marksObtained: 43, totalMarks: 50, percentage: 86, grade: "A", status: "Completed" },
  { id: "a2", name: "Grammar Assessment", type: "Assignment", subject: "English", date: "05 Sep 2026", marksObtained: 42, totalMarks: 50, percentage: 84, grade: "A", status: "Completed" },
  { id: "a3", name: "Chapter Test - History", type: "Unit Test", subject: "Social Science", date: "02 Sep 2026", marksObtained: 45, totalMarks: 50, percentage: 90, grade: "A+", status: "Completed" },
  { id: "a4", name: "Programming Basics", type: "Internal", subject: "Computer Science", date: "29 Aug 2026", marksObtained: 47, totalMarks: 50, percentage: 94, grade: "A+", status: "Completed" },
  { id: "a5", name: "Unit Test 1", type: "Unit Test", subject: "Mathematics", date: "10 Jul 2026", marksObtained: 39, totalMarks: 50, percentage: 78, grade: "B+", status: "Completed" },
  { id: "a6", name: "Quarterly Examination", type: "Exam", subject: "Mathematics", date: "22 Sep 2026", marksObtained: 0, totalMarks: 100, percentage: 0, grade: "-", status: "Upcoming" },
];

const allData = {
  STU001: {
    metrics: metricsSTU001,
    insights: insightsSTU001,
    subjects: subjectPerformanceSTU001,
    trends: trendDataSTU001,
    assessments: assessmentHistorySTU001,
  }
};

export function getAcademicMetrics(studentId: string): AcademicMetrics {
  return allData[studentId as keyof typeof allData]?.metrics ?? metricsSTU001;
}

export function getAcademicInsights(studentId: string): AcademicInsight[] {
  return allData[studentId as keyof typeof allData]?.insights ?? insightsSTU001;
}

export function getSubjectPerformanceList(studentId: string): SubjectPerformance[] {
  return allData[studentId as keyof typeof allData]?.subjects ?? subjectPerformanceSTU001;
}

export function getPerformanceTrends(studentId: string): PerformanceTrend[] {
  return allData[studentId as keyof typeof allData]?.trends ?? trendDataSTU001;
}

export function getAssessmentHistory(studentId: string): Assessment[] {
  return allData[studentId as keyof typeof allData]?.assessments ?? assessmentHistorySTU001;
}
