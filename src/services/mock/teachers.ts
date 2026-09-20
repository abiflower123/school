export type Teacher = {
  id: string;
  name: string;
  subject: string;
  email: string;
  role: string;
  avatar: string;
  conversationId?: string;
};

const teachersSTU001: Teacher[] = [
  { id: "T001", name: "Mrs. Kavitha Sundaram", subject: "Social Science", email: "kavitha.s@ravionschool.edu", role: "Class Teacher", avatar: "KS", conversationId: "CONV001" },
  { id: "T002", name: "Mr. Rajesh Kumar", subject: "Mathematics", email: "rajesh.k@ravionschool.edu", role: "Subject Teacher", avatar: "RK", conversationId: "CONV002" },
  { id: "T003", name: "Mrs. Meena Verma", subject: "Science", email: "meena.v@ravionschool.edu", role: "Subject Teacher", avatar: "MV" },
  { id: "T004", name: "Ms. Sunita Gupta", subject: "English", email: "sunita.g@ravionschool.edu", role: "Subject Teacher", avatar: "SG" },
];

const teachersSTU002: Teacher[] = [
  { id: "T101", name: "Mr. Senthil Kumar", subject: "Social Science", email: "senthil.k@ravionschool.edu", role: "Class Teacher", avatar: "SK", conversationId: "CONV201" },
  { id: "T102", name: "Mrs. Lakshmi Priya", subject: "Mathematics", email: "lakshmi.p@ravionschool.edu", role: "Subject Teacher", avatar: "LP", conversationId: "CONV202" },
];

const teachersSTU003: Teacher[] = [
  { id: "T201", name: "Mr. Anand Krishnamurthy", subject: "Mathematics", email: "anand.k@ravionschool.edu", role: "Class Teacher", avatar: "AK", conversationId: "CONV301" },
  { id: "T202", name: "Mr. Arun Prasad", subject: "Computer Science", email: "arun.p@ravionschool.edu", role: "Subject Teacher", avatar: "AP", conversationId: "CONV302" },
];

const allTeachers: Record<string, Teacher[]> = {
  STU001: teachersSTU001,
  STU002: teachersSTU002,
  STU003: teachersSTU003,
};

export function getTeachers(studentId: string): Teacher[] {
  return allTeachers[studentId] ?? [];
}
