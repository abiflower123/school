export type Resource = {
  id: string;
  title: string;
  type: "PDF" | "Video" | "Document" | "Link" | "Presentation";
  subject: string;
  size: string;
  dateAdded: string;
  url: string;
};

export type ResourceFolder = {
  id: string;
  name: string;
  description: string;
  resources: Resource[];
};

const resourcesSTU001: ResourceFolder[] = [
  {
    id: "F1",
    name: "Previous Year Papers",
    description: "Question papers from the last 5 years.",
    resources: [
      { id: "R1", title: "Math Annual 2025", type: "PDF", subject: "Mathematics", size: "2.4 MB", dateAdded: "Aug 12, 2026", url: "#" },
      { id: "R2", title: "Science Half-Yearly 2025", type: "PDF", subject: "Science", size: "1.8 MB", dateAdded: "Aug 15, 2026", url: "#" },
    ],
  },
  {
    id: "F2",
    name: "Study Materials & Notes",
    description: "Teacher uploaded reference notes.",
    resources: [
      { id: "R3", title: "Geometry Formulas Sheet", type: "Document", subject: "Mathematics", size: "1.1 MB", dateAdded: "Sep 01, 2026", url: "#" },
      { id: "R4", title: "Photosynthesis Explained", type: "Video", subject: "Science", size: "15 MB", dateAdded: "Sep 05, 2026", url: "#" },
      { id: "R5", title: "Quadratic Equations — Slides", type: "Presentation", subject: "Mathematics", size: "3.2 MB", dateAdded: "Sep 10, 2026", url: "#" },
    ],
  },
  {
    id: "F3",
    name: "Syllabus Copies",
    description: "Official board syllabus for the current year.",
    resources: [
      { id: "R6", title: "Term 1 Syllabus — All Subjects", type: "PDF", subject: "General", size: "4.5 MB", dateAdded: "Jun 10, 2026", url: "#" },
    ],
  },
];

const resourcesSTU002: ResourceFolder[] = [
  {
    id: "F101",
    name: "Study Materials & Notes",
    description: "Teacher uploaded reference notes.",
    resources: [
      { id: "R101", title: "Fractions & Decimals — Worksheet", type: "Document", subject: "Mathematics", size: "0.8 MB", dateAdded: "Sep 02, 2026", url: "#" },
      { id: "R102", title: "Plants — Video Lesson", type: "Video", subject: "Science", size: "22 MB", dateAdded: "Aug 28, 2026", url: "#" },
    ],
  },
  {
    id: "F102",
    name: "Syllabus Copies",
    description: "Official board syllabus for the current year.",
    resources: [
      { id: "R103", title: "Term 1 Syllabus — Class 7", type: "PDF", subject: "General", size: "3.1 MB", dateAdded: "Jun 10, 2026", url: "#" },
    ],
  },
];

const resourcesSTU003: ResourceFolder[] = [
  {
    id: "F201",
    name: "Previous Year Papers",
    description: "Question papers from the last 5 years.",
    resources: [
      { id: "R201", title: "Polynomials — Unit Test Bank", type: "PDF", subject: "Mathematics", size: "1.6 MB", dateAdded: "Aug 20, 2026", url: "#" },
    ],
  },
  {
    id: "F202",
    name: "Study Materials & Notes",
    description: "Teacher uploaded reference notes.",
    resources: [
      { id: "R202", title: "Python Loops — Reference Sheet", type: "Document", subject: "Computer Science", size: "0.6 MB", dateAdded: "Sep 08, 2026", url: "#" },
      { id: "R203", title: "Grammar — Tenses Slides", type: "Presentation", subject: "English", size: "2.1 MB", dateAdded: "Sep 12, 2026", url: "#" },
    ],
  },
];

const allResources: Record<string, ResourceFolder[]> = {
  STU001: resourcesSTU001,
  STU002: resourcesSTU002,
  STU003: resourcesSTU003,
};

export function getResources(studentId: string): ResourceFolder[] {
  return allResources[studentId] ?? [];
}
