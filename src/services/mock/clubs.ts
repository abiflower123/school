// ============================================================
// Mock Clubs & Activities Service
// ============================================================

export type ClubCategory = "Science" | "Arts" | "Sports" | "Cultural" | "Literary" | "Technology";
export type MembershipStatus = "Member" | "Pending" | "Not Joined";

export type ClubEvent = {
  title: string;
  date: string;
  description: string;
};

export type Club = {
  id: string;
  name: string;
  category: ClubCategory;
  description: string;
  teacherInCharge: string;
  memberCount: number;
  meetingSchedule: string;
  upcomingEvents: ClubEvent[];
};

export type StudentClubMembership = {
  clubId: string;
  status: MembershipStatus;
  role?: string;
  joinedDate?: string;
};

export const mockClubs: Club[] = [
  {
    id: "CLB001",
    name: "Science Club",
    category: "Science",
    description: "Explore the wonders of science through experiments, projects, and competitions. Members participate in the annual Science Exhibition and district-level science fairs.",
    teacherInCharge: "Mrs. Priya Devi",
    memberCount: 28,
    meetingSchedule: "Every Friday, 3:00 PM – 4:30 PM",
    upcomingEvents: [
      { title: "Annual Science Exhibition", date: "12 Oct 2026", description: "Inter-school science exhibition. Register your project by 25 Sep." },
      { title: "Science Quiz", date: "05 Oct 2026", description: "In-school science quiz for all members." },
    ],
  },
  {
    id: "CLB002",
    name: "Literary Club",
    category: "Literary",
    description: "For students who love reading, writing, and public speaking. Activities include essay competitions, debate, storytelling, and poetry recitation.",
    teacherInCharge: "Ms. Anitha Kumari",
    memberCount: 22,
    meetingSchedule: "Every Wednesday, 3:00 PM – 4:00 PM",
    upcomingEvents: [
      { title: "Debate Competition", date: "08 Oct 2026", description: "Topic: 'Technology is doing more harm than good'. Teams of 2." },
    ],
  },
  {
    id: "CLB003",
    name: "Computer & Coding Club",
    category: "Technology",
    description: "Learn programming, web development, and robotics. Members compete in regional tech fests and coding challenges.",
    teacherInCharge: "Mr. Arun Prasad",
    memberCount: 18,
    meetingSchedule: "Every Thursday, 3:30 PM – 5:00 PM",
    upcomingEvents: [
      { title: "Hackathon — Build for School", date: "15 Oct 2026", description: "Build a useful app/website for a school problem in 4 hours." },
    ],
  },
  {
    id: "CLB004",
    name: "Cultural Club",
    category: "Cultural",
    description: "Celebrate Tamil culture and arts through classical dance, Bharatanatyam, Carnatic music, and folk performances for school events and competitions.",
    teacherInCharge: "Mrs. Meena Sundaram",
    memberCount: 35,
    meetingSchedule: "Tuesday and Friday, 3:00 PM – 4:30 PM",
    upcomingEvents: [
      { title: "Navratri Cultural Programme", date: "02 Oct 2026", description: "Annual cultural evening with performances by all club members." },
    ],
  },
  {
    id: "CLB005",
    name: "Sports Club",
    category: "Sports",
    description: "Trains students for inter-house and inter-school sports competitions including cricket, football, kabaddi, athletics, and chess.",
    teacherInCharge: "Mr. Suresh Babu",
    memberCount: 45,
    meetingSchedule: "Monday, Wednesday, Friday – 7:00 AM – 8:00 AM",
    upcomingEvents: [
      { title: "Inter-House Sports Day", date: "10 Oct 2026", description: "Annual sports day with track and field events for all houses." },
    ],
  },
  {
    id: "CLB006",
    name: "Art & Craft Club",
    category: "Arts",
    description: "Develop artistic skills through painting, sketching, clay modelling, and craft activities. Members display their work in the Annual Art Exhibition.",
    teacherInCharge: "Ms. Vani Raj",
    memberCount: 20,
    meetingSchedule: "Every Wednesday, 3:30 PM – 5:00 PM",
    upcomingEvents: [
      { title: "Art Exhibition Preparation", date: "28 Sep 2026", description: "Work session to prepare pieces for the Annual Art Exhibition." },
    ],
  },
];

const membershipsSTU001: StudentClubMembership[] = [
  { clubId: "CLB001", status: "Member", role: "Secretary", joinedDate: "Jun 2026" },
  { clubId: "CLB003", status: "Member", role: "Member", joinedDate: "Jun 2026" },
  { clubId: "CLB005", status: "Member", role: "Member", joinedDate: "Jun 2026" },
];

const membershipsSTU002: StudentClubMembership[] = [
  { clubId: "CLB004", status: "Member", role: "Member", joinedDate: "Jun 2026" },
  { clubId: "CLB006", status: "Pending" },
];

const membershipsSTU003: StudentClubMembership[] = [
  { clubId: "CLB001", status: "Member", role: "President", joinedDate: "Jun 2025" },
  { clubId: "CLB002", status: "Member", role: "Vice President", joinedDate: "Jun 2025" },
  { clubId: "CLB003", status: "Member", role: "Member", joinedDate: "Jun 2026" },
];

const allMemberships: Record<string, StudentClubMembership[]> = {
  STU001: membershipsSTU001,
  STU002: membershipsSTU002,
  STU003: membershipsSTU003,
};

export function getClubs(): Club[] {
  return mockClubs;
}

export function getMemberships(studentId: string): StudentClubMembership[] {
  return allMemberships[studentId] ?? [];
}

export function getMembershipStatus(studentId: string, clubId: string): MembershipStatus {
  const memberships = getMemberships(studentId);
  return memberships.find((m) => m.clubId === clubId)?.status ?? "Not Joined";
}

export function joinClub(memberships: StudentClubMembership[], clubId: string): StudentClubMembership[] {
  return [...memberships, { clubId, status: "Pending" }];
}
