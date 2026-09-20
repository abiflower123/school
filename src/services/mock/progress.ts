export type TopicStatus = "Completed" | "In Progress" | "Not Started";

export type Topic = {
  name: string;
  status: TopicStatus;
};

export type SubjectProgress = {
  id: string;
  subject: string;
  teacherName: string;
  percentage: number;
  completedTopics: number;
  totalTopics: number;
  syllabus: string;
  learningObjectives: string[];
  topics: Topic[];
};

const progressSTU001: SubjectProgress[] = [
  {
    id: "SUBJ1", subject: "Mathematics", teacherName: "Mr. Rajesh Kumar", percentage: 86,
    completedTopics: 17, totalTopics: 20,
    syllabus: "Real Numbers, Polynomials, Quadratic Equations, Arithmetic Progressions, Triangles, Coordinate Geometry, Trigonometry.",
    learningObjectives: ["Apply quadratic formula to solve real-world problems", "Derive and use the nth term of an AP", "Prove similarity of triangles"],
    topics: [
      { name: "Algebra", status: "Completed" },
      { name: "Geometry", status: "Completed" },
      { name: "Trigonometry", status: "In Progress" },
      { name: "Calculus Basics", status: "Not Started" },
    ],
  },
  {
    id: "SUBJ2", subject: "Science", teacherName: "Mrs. Meena Verma", percentage: 91,
    completedTopics: 18, totalTopics: 20,
    syllabus: "Chemical Reactions, Acids & Bases, Life Processes, Control & Coordination, Light — Reflection & Refraction.",
    learningObjectives: ["Balance chemical equations", "Explain the human nervous system", "Apply laws of reflection to solve numericals"],
    topics: [
      { name: "Physics: Motion", status: "Completed" },
      { name: "Chemistry: Acids", status: "Completed" },
      { name: "Biology: Cells", status: "Completed" },
      { name: "Physics: Gravity", status: "In Progress" },
    ],
  },
  {
    id: "SUBJ3", subject: "English", teacherName: "Ms. Sunita Gupta", percentage: 84,
    completedTopics: 15, totalTopics: 18,
    syllabus: "Prose & Poetry (First Flight), Grammar — Tenses & Reported Speech, Writing Skills — Letters & Essays.",
    learningObjectives: ["Analyse tone and theme in poetry", "Write formal letters and essays", "Use reported speech correctly"],
    topics: [
      { name: "Grammar: Tenses", status: "Completed" },
      { name: "Literature: Poetry", status: "Completed" },
      { name: "Writing: Essays", status: "In Progress" },
    ],
  },
];

const progressSTU002: SubjectProgress[] = [
  {
    id: "SUBJ101", subject: "Mathematics", teacherName: "Mrs. Lakshmi Priya", percentage: 58,
    completedTopics: 10, totalTopics: 18,
    syllabus: "Integers, Fractions & Decimals, Data Handling, Simple Equations, Lines & Angles.",
    learningObjectives: ["Perform operations on fractions and decimals", "Solve simple linear equations", "Read and interpret bar graphs"],
    topics: [
      { name: "Integers", status: "Completed" },
      { name: "Fractions & Decimals", status: "In Progress" },
      { name: "Simple Equations", status: "Not Started" },
    ],
  },
  {
    id: "SUBJ102", subject: "Science", teacherName: "Mr. Senthil Kumar", percentage: 74,
    completedTopics: 13, totalTopics: 18,
    syllabus: "Nutrition in Plants, Fibre to Fabric, Heat, Acids Bases and Salts, Weather & Climate.",
    learningObjectives: ["Explain photosynthesis", "Classify materials as acidic, basic or neutral", "Describe how fabric is made from fibre"],
    topics: [
      { name: "Nutrition in Plants", status: "Completed" },
      { name: "Heat", status: "Completed" },
      { name: "Acids & Bases", status: "In Progress" },
    ],
  },
  {
    id: "SUBJ103", subject: "English", teacherName: "Mr. Senthil Kumar", percentage: 70,
    completedTopics: 11, totalTopics: 16,
    syllabus: "Honeycomb — Prose & Poetry, Grammar — Tenses & Determiners, Letter Writing.",
    learningObjectives: ["Identify parts of speech correctly", "Write informal and formal letters", "Comprehend short unseen passages"],
    topics: [
      { name: "Grammar Basics", status: "Completed" },
      { name: "Comprehension", status: "In Progress" },
      { name: "Letter Writing", status: "Not Started" },
    ],
  },
];

const progressSTU003: SubjectProgress[] = [
  {
    id: "SUBJ201", subject: "Mathematics", teacherName: "Mr. Anand Krishnamurthy", percentage: 94,
    completedTopics: 19, totalTopics: 20,
    syllabus: "Real Numbers, Polynomials, Quadratic Equations, Arithmetic Progressions, Triangles, Coordinate Geometry, Trigonometry.",
    learningObjectives: ["Apply quadratic formula to solve real-world problems", "Derive and use the nth term of an AP", "Prove similarity of triangles"],
    topics: [
      { name: "Algebra", status: "Completed" },
      { name: "Geometry", status: "Completed" },
      { name: "Trigonometry", status: "Completed" },
      { name: "Calculus Basics", status: "In Progress" },
    ],
  },
  {
    id: "SUBJ202", subject: "Science", teacherName: "Mrs. Meena Verma", percentage: 96,
    completedTopics: 19, totalTopics: 20,
    syllabus: "Chemical Reactions, Acids & Bases, Life Processes, Control & Coordination, Light — Reflection & Refraction.",
    learningObjectives: ["Balance chemical equations", "Explain the human nervous system", "Apply laws of reflection to solve numericals"],
    topics: [
      { name: "Physics: Motion", status: "Completed" },
      { name: "Chemistry: Acids", status: "Completed" },
      { name: "Biology: Cells", status: "Completed" },
    ],
  },
  {
    id: "SUBJ203", subject: "Computer Science", teacherName: "Mr. Arun Prasad", percentage: 97,
    completedTopics: 14, totalTopics: 15,
    syllabus: "Python Basics, Lists & Loops, Functions, Introduction to Databases, HTML Basics.",
    learningObjectives: ["Write Python programs using loops and lists", "Define and call functions with parameters", "Create a basic HTML page"],
    topics: [
      { name: "Python Basics", status: "Completed" },
      { name: "Lists & Loops", status: "Completed" },
      { name: "Functions", status: "In Progress" },
    ],
  },
];

const allProgress: Record<string, SubjectProgress[]> = {
  STU001: progressSTU001,
  STU002: progressSTU002,
  STU003: progressSTU003,
};

/** Percentage is derived from the student's published term marks per subject where available. */
export function getProgress(studentId: string): SubjectProgress[] {
  return allProgress[studentId] ?? [];
}
