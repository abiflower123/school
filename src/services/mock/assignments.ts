// ============================================================
// Mock Assignments & Homework Service
// ============================================================

export type AssignmentStatus = "Pending" | "Submitted" | "Overdue" | "Graded";

export type Assignment = {
  id: string;
  subject: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  status: AssignmentStatus;
  marks?: string;
  maxMarks?: number;
  teacherFeedback?: string;
  isHomework: boolean;
};

const assignmentsSTU001: Assignment[] = [
  { id: "A001", subject: "Mathematics", title: "Quadratic Equations", description: "Solve the given quadratic equations using factorisation and the quadratic formula. Complete all problems from Exercise 4.3 in the textbook.", assignedDate: "12 Sep 2026", dueDate: "19 Sep 2026", status: "Pending", isHomework: false },
  { id: "A002", subject: "Mathematics", title: "Coordinate Geometry", description: "Complete the exercise on distance formula and section formula from Chapter 7.", assignedDate: "10 Sep 2026", dueDate: "15 Sep 2026", status: "Overdue", isHomework: false },
  { id: "A003", subject: "Mathematics", title: "Arithmetic Progression — Worksheet", description: "Answer the worksheet questions from Exercise 5.2.", assignedDate: "05 Sep 2026", dueDate: "12 Sep 2026", status: "Graded", marks: "18/20", maxMarks: 20, teacherFeedback: "Excellent work! Few errors in the last two problems.", isHomework: false },
  { id: "A004", subject: "Mathematics", title: "Triangles — Theorems", description: "Write and prove the important theorems related to similar triangles.", assignedDate: "01 Sep 2026", dueDate: "08 Sep 2026", status: "Graded", marks: "20/20", maxMarks: 20, teacherFeedback: "Perfect! All proofs were correct and well-presented.", isHomework: false },
  { id: "A005", subject: "Science", title: "Human Digestive System", description: "Draw and label the human digestive system in your science notebook. Include all organs and their functions.", assignedDate: "11 Sep 2026", dueDate: "17 Sep 2026", status: "Submitted", isHomework: false },
  { id: "A006", subject: "Science", title: "Chemical Reactions — Daily Life", description: "Write five examples of chemical reactions from daily life with balanced equations.", assignedDate: "06 Sep 2026", dueDate: "13 Sep 2026", status: "Pending", isHomework: false },
  { id: "A007", subject: "Science", title: "Light Reflection Numericals", description: "Complete the numerical problems from Chapter 10 — Reflection of Light.", assignedDate: "02 Sep 2026", dueDate: "09 Sep 2026", status: "Graded", marks: "16/20", maxMarks: 20, teacherFeedback: "Good attempt. Review the sign convention for concave mirrors.", isHomework: false },
  { id: "A008", subject: "English", title: "Grammar — Tenses Worksheet", description: "Complete the grammar worksheet on all twelve tenses with examples.", assignedDate: "10 Sep 2026", dueDate: "16 Sep 2026", status: "Pending", isHomework: false },
  { id: "A009", subject: "English", title: "Letter Writing", description: "Write a formal letter to the municipal commissioner requesting better road conditions in your locality.", assignedDate: "04 Sep 2026", dueDate: "11 Sep 2026", status: "Graded", marks: "9/10", maxMarks: 10, teacherFeedback: "Well-structured letter. Work on formal salutation.", isHomework: false },
  { id: "A010", subject: "Social Science", title: "Indian National Movement — Timeline", description: "Prepare a detailed timeline of important events of the Indian freedom movement from 1857 to 1947.", assignedDate: "12 Sep 2026", dueDate: "19 Sep 2026", status: "Pending", isHomework: false },
  { id: "A011", subject: "Social Science", title: "Resources and Development", description: "Complete the map activity and answer the textbook questions from Chapter 1.", assignedDate: "07 Sep 2026", dueDate: "14 Sep 2026", status: "Graded", marks: "17/20", maxMarks: 20, teacherFeedback: "Good map work. A few answers were incomplete.", isHomework: false },
  { id: "A012", subject: "Computer Science", title: "Python Basics", description: "Write simple Python programs using variables, input(), and conditional statements. Submit as a printed listing.", assignedDate: "13 Sep 2026", dueDate: "20 Sep 2026", status: "Pending", isHomework: false },
  // Homework
  { id: "H001", subject: "Mathematics", title: "Practice Quadratic Equations", description: "Practice 5 additional problems from the reference book.", assignedDate: "18 Sep 2026", dueDate: "19 Sep 2026", status: "Pending", isHomework: true },
  { id: "H002", subject: "Science", title: "Read Light Reflection", description: "Read and take notes from Chapter 10 pages 162–170.", assignedDate: "18 Sep 2026", dueDate: "19 Sep 2026", status: "Submitted", isHomework: true },
  { id: "H003", subject: "English", title: "Vocabulary — Chapter 3", description: "Learn the new vocabulary words from Chapter 3 and use them in sentences.", assignedDate: "17 Sep 2026", dueDate: "18 Sep 2026", status: "Submitted", isHomework: true },
];

const assignmentsSTU002: Assignment[] = [
  { id: "B001", subject: "Mathematics", title: "Fractions and Decimals", description: "Complete the exercise on addition and subtraction of unlike fractions.", assignedDate: "12 Sep 2026", dueDate: "19 Sep 2026", status: "Pending", isHomework: false },
  { id: "B002", subject: "Science", title: "Plant Kingdom", description: "Draw and label the parts of a flowering plant and write about their functions.", assignedDate: "10 Sep 2026", dueDate: "16 Sep 2026", status: "Graded", marks: "17/20", maxMarks: 20, teacherFeedback: "Well done! Diagram was clear.", isHomework: false },
  { id: "B003", subject: "English", title: "Essay — My Favourite Hobby", description: "Write an essay of 150–200 words on your favourite hobby.", assignedDate: "08 Sep 2026", dueDate: "14 Sep 2026", status: "Graded", marks: "8/10", maxMarks: 10, teacherFeedback: "Good vocabulary. Work on paragraph structure.", isHomework: false },
  { id: "B004", subject: "Social Science", title: "India's Physical Features", description: "Label the physical features on the outline map of India.", assignedDate: "06 Sep 2026", dueDate: "12 Sep 2026", status: "Overdue", isHomework: false },
  { id: "H101", subject: "Mathematics", title: "Tables Revision", description: "Revise multiplication tables from 2 to 20.", assignedDate: "18 Sep 2026", dueDate: "19 Sep 2026", status: "Pending", isHomework: true },
];

const assignmentsSTU003: Assignment[] = [
  { id: "C001", subject: "Mathematics", title: "Quadratic Equations — Extra Practice", description: "Solve Exercise 4.4 from the textbook.", assignedDate: "12 Sep 2026", dueDate: "19 Sep 2026", status: "Pending", isHomework: false },
  { id: "C002", subject: "Science", title: "Chemical Reactions — Lab Report", description: "Write a lab report for the experiment on displacement reaction conducted in the lab.", assignedDate: "10 Sep 2026", dueDate: "17 Sep 2026", status: "Submitted", isHomework: false },
  { id: "C003", subject: "English", title: "Poem Analysis", description: "Write an appreciation of the poem 'Dust of Snow' by Robert Frost.", assignedDate: "08 Sep 2026", dueDate: "14 Sep 2026", status: "Graded", marks: "9/10", maxMarks: 10, teacherFeedback: "Excellent analysis! Very insightful.", isHomework: false },
  { id: "C004", subject: "Computer Science", title: "Python — Lists and Loops", description: "Write programs demonstrating list operations and loops in Python.", assignedDate: "12 Sep 2026", dueDate: "20 Sep 2026", status: "Pending", isHomework: false },
  { id: "H201", subject: "Mathematics", title: "Revision — Chapter 3", description: "Revise all formulas from Chapter 3 for tomorrow's test.", assignedDate: "18 Sep 2026", dueDate: "19 Sep 2026", status: "Pending", isHomework: true },
];

const allAssignments: Record<string, Assignment[]> = {
  STU001: assignmentsSTU001,
  STU002: assignmentsSTU002,
  STU003: assignmentsSTU003,
};

export function getAssignments(studentId: string): Assignment[] {
  return allAssignments[studentId] ?? [];
}

export function getHomework(studentId: string): Assignment[] {
  return getAssignments(studentId).filter((a) => a.isHomework);
}

export function getPendingAssignments(studentId: string): Assignment[] {
  return getAssignments(studentId).filter(
    (a) => !a.isHomework && (a.status === "Pending" || a.status === "Overdue")
  );
}

export function getAssignmentsBySubject(studentId: string): Record<string, Assignment[]> {
  const result: Record<string, Assignment[]> = {};
  getAssignments(studentId).forEach((a) => {
    if (!result[a.subject]) result[a.subject] = [];
    result[a.subject].push(a);
  });
  return result;
}
