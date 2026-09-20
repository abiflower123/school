// ============================================================
// Mock Students + Guardians
// This is the single source of truth for all user/child data.
// Replace with API calls later: getStudentById(id), getChildrenForParent(parentId)
// ============================================================

export type Guardian = {
  id: string;
  name: string;
  relationship: "Father" | "Mother" | "Guardian";
  phone: string;
  email: string;
  occupation: string;
};

export type Student = {
  id: string;
  name: string;
  admissionNumber: string;
  rollNumber: string;
  class: string;
  section: string;
  academicYear: string;
  dob: string; // DD MMM YYYY
  gender: "Male" | "Female";
  bloodGroup: string;
  house: string;
  photo: string | null; // URL or null (uses initials)
  guardians: Guardian[];
  emergencyContact: { name: string; phone: string; relationship: string };
  classTeacher: string;
  status: "Active" | "Inactive";
};

export type ParentAccount = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string; // mock only
  childIds: string[];
};

export type StudentAccount = {
  id: string;
  studentId: string;
  email: string;
  password: string; // mock only
};

// ---- Mock Students ----

export const mockStudents: Student[] = [
  {
    id: "STU001",
    name: "Arjun Rajan",
    admissionNumber: "ADM-2024-001",
    rollNumber: "10A-01",
    class: "10",
    section: "A",
    academicYear: "2026–2027",
    dob: "15 Mar 2011",
    gender: "Male",
    bloodGroup: "O+",
    house: "Blue House",
    photo: null,
    classTeacher: "Mrs. Kavitha Sundaram",
    status: "Active",
    guardians: [
      {
        id: "G001a",
        name: "Mr. Rajan Murugan",
        relationship: "Father",
        phone: "+91 98400 12345",
        email: "rajan.m@example.com",
        occupation: "Engineer",
      },
      {
        id: "G001b",
        name: "Mrs. Priya Rajan",
        relationship: "Mother",
        phone: "+91 98400 67890",
        email: "priya.r@example.com",
        occupation: "Teacher",
      },
    ],
    emergencyContact: {
      name: "Mr. Rajan Murugan",
      phone: "+91 98400 12345",
      relationship: "Father",
    },
  },
  {
    id: "STU002",
    name: "Priya Rajan",
    admissionNumber: "ADM-2022-047",
    rollNumber: "7B-12",
    class: "7",
    section: "B",
    academicYear: "2026–2027",
    dob: "22 Jul 2014",
    gender: "Female",
    bloodGroup: "A+",
    house: "Green House",
    photo: null,
    classTeacher: "Mr. Senthil Kumar",
    status: "Active",
    guardians: [
      {
        id: "G001a",
        name: "Mr. Rajan Murugan",
        relationship: "Father",
        phone: "+91 98400 12345",
        email: "rajan.m@example.com",
        occupation: "Engineer",
      },
      {
        id: "G001b",
        name: "Mrs. Priya Rajan",
        relationship: "Mother",
        phone: "+91 98400 67890",
        email: "priya.r@example.com",
        occupation: "Teacher",
      },
    ],
    emergencyContact: {
      name: "Mr. Rajan Murugan",
      phone: "+91 98400 12345",
      relationship: "Father",
    },
  },
  {
    id: "STU003",
    name: "Kavya Nair",
    admissionNumber: "ADM-2025-088",
    rollNumber: "10B-08",
    class: "10",
    section: "B",
    academicYear: "2026–2027",
    dob: "03 Nov 2011",
    gender: "Female",
    bloodGroup: "B+",
    house: "Red House",
    photo: null,
    classTeacher: "Mr. Anand Krishnamurthy",
    status: "Active",
    guardians: [
      {
        id: "G002a",
        name: "Mr. Suresh Nair",
        relationship: "Father",
        phone: "+91 94450 55555",
        email: "suresh.n@example.com",
        occupation: "Business",
      },
    ],
    emergencyContact: {
      name: "Mr. Suresh Nair",
      phone: "+91 94450 55555",
      relationship: "Father",
    },
  },
];

// ---- Mock Accounts ----

export const mockParentAccounts: ParentAccount[] = [
  {
    id: "PAR001",
    name: "Mr. Rajan Murugan",
    email: "rajan.m@example.com",
    phone: "+91 98400 12345",
    password: "parent123",
    childIds: ["STU001", "STU002"],
  },
  {
    id: "PAR002",
    name: "Mr. Suresh Nair",
    email: "suresh.n@example.com",
    phone: "+91 94450 55555",
    password: "parent123",
    childIds: ["STU003"],
  },
];

export const mockStudentAccounts: StudentAccount[] = [
  {
    id: "ACC001",
    studentId: "STU001",
    email: "arjun.r@student.school.in",
    password: "student123",
  },
  {
    id: "ACC002",
    studentId: "STU003",
    email: "kavya.n@student.school.in",
    password: "student123",
  },
];

// ---- Service functions ----

export function getStudentById(id: string): Student | undefined {
  return mockStudents.find((s) => s.id === id);
}

export function getStudentsByIds(ids: string[]): Student[] {
  return mockStudents.filter((s) => ids.includes(s.id));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
