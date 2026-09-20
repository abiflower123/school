// ============================================================
// Mock Announcements Service (school-wide)
// ============================================================

export type AnnouncementCategory = "Academic" | "Holiday" | "Event" | "Finance" | "General" | "Sports" | "Exam";

export type Announcement = {
  id: string;
  title: string;
  description: string;
  fullContent: string;
  date: string;
  category: AnnouncementCategory;
  important: boolean;
  postedBy: string;
};

export const mockAnnouncements: Announcement[] = [
  {
    id: "ANN001",
    title: "Parent-Teacher Meeting — 27 September 2026",
    description: "The parent-teacher meeting for Classes 9–12 is scheduled for 27 September 2026 from 9 AM to 1 PM. Parents are requested to book their slot through the school office.",
    fullContent: "Dear Parents,\n\nWe are pleased to inform you that the Parent-Teacher Meeting (PTM) for Classes 9 to 12 is scheduled for Saturday, 27 September 2026 from 9:00 AM to 1:00 PM.\n\nKindly book your preferred time slot by visiting the school office or contacting the class teacher. Parents are requested to bring their ward's report card for reference.\n\nWarm regards,\nSchool Administration",
    date: "19 Sep 2026",
    category: "Event",
    important: true,
    postedBy: "School Administration",
  },
  {
    id: "ANN002",
    title: "Term 2 Fee Payment Deadline — 30 September",
    description: "Term 2 tuition fees must be paid before 30 September 2026. Late payment will attract a penalty of ₹100 per day.",
    fullContent: "Dear Parents,\n\nThis is a reminder that the Term 2 tuition fee payment deadline is 30 September 2026. Parents who have not yet completed their payment are requested to do so at the earliest.\n\nPenalty for late payment: ₹100 per day after the deadline.\n\nPayment can be made online through this portal (Fees section) or at the school accounts office.\n\nThank you for your cooperation.\nAccounts Department",
    date: "18 Sep 2026",
    category: "Finance",
    important: true,
    postedBy: "Accounts Department",
  },
  {
    id: "ANN003",
    title: "Annual Science Exhibition — Registration Open",
    description: "Students interested in participating in the Annual Science Exhibition (12 October 2026) can register with the Science department before 25 September.",
    fullContent: "Dear Students,\n\nRegistrations are now open for the Annual Science Exhibition scheduled for 12 October 2026.\n\nStudents who wish to participate should submit their project topic and team details to the Science department by 25 September 2026. Projects can be individual or in teams of up to 3 students.\n\nPrizes will be awarded in the following categories:\n- Best Innovation\n- Best Presentation\n- Best Environmental Project\n\nFor registration and queries, contact Mrs. Priya Devi or the Science department office.\n\nAll the best!\nScience Department",
    date: "17 Sep 2026",
    category: "Academic",
    important: false,
    postedBy: "Science Department",
  },
  {
    id: "ANN004",
    title: "School Holiday — 25 September 2026",
    description: "The school will remain closed on 25 September 2026 (Thursday) on account of a gazetted public holiday.",
    fullContent: "Dear Students and Parents,\n\nPlease note that the school will remain closed on Thursday, 25 September 2026 on account of a gazetted public holiday.\n\nClasses will resume on Friday, 26 September 2026 as per the regular schedule.\n\nRegards,\nSchool Administration",
    date: "15 Sep 2026",
    category: "Holiday",
    important: false,
    postedBy: "School Administration",
  },
  {
    id: "ANN005",
    title: "Uniform and ID Card — Compliance Notice",
    description: "All students must wear the prescribed school uniform and carry their student ID card every day. Students found without ID cards will be noted.",
    fullContent: "Dear Students,\n\nThis is a reminder that wearing the school's prescribed uniform and carrying your student identity card is mandatory every school day.\n\nStudents who repeatedly come without their ID card or in incorrect uniform will be referred to the class teacher and may face disciplinary action.\n\nParents are requested to ensure compliance.\n\nThank you,\nDiscipline Committee",
    date: "12 Sep 2026",
    category: "General",
    important: false,
    postedBy: "Discipline Committee",
  },
  {
    id: "ANN006",
    title: "Inter-House Sports Day — 10 October 2026",
    description: "The Annual Inter-House Sports Day is scheduled for 10 October 2026. Students interested in participating should register with the Physical Education department by 30 September.",
    fullContent: "Dear Students,\n\nThe Annual Inter-House Sports Day will be held on 10 October 2026 at the school grounds.\n\nEvents include:\n- 100m, 200m, 400m sprint\n- Long jump & High jump\n- Relay race\n- Shot put & Discus\n- Kabaddi and Kho-Kho\n\nStudents wishing to participate should register their name and preferred events with the Physical Education department (Mr. Suresh Babu) before 30 September.\n\nAll the best to all houses!\nSports Department",
    date: "10 Sep 2026",
    category: "Sports",
    important: false,
    postedBy: "Sports Department",
  },
];

export function getAnnouncements(): Announcement[] {
  return mockAnnouncements;
}

export function getAnnouncementById(id: string): Announcement | undefined {
  return mockAnnouncements.find((a) => a.id === id);
}

export function getImportantAnnouncements(): Announcement[] {
  return mockAnnouncements.filter((a) => a.important);
}
