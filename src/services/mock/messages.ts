// ============================================================
// Mock Messages Service
// ============================================================

export type MessageSender = "student" | "teacher";

export type ChatMessage = {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string; // HH:MM AM/PM
  date: string; // DD MMM YYYY
};

export type Conversation = {
  id: string;
  teacherName: string;
  teacherRole: string;
  teacherInitials: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
};

const conversationsSTU001: Conversation[] = [
  {
    id: "CONV001",
    teacherName: "Mrs. Kavitha Sundaram",
    teacherRole: "Class Teacher · Class 10-A",
    teacherInitials: "KS",
    lastMessage: "Please complete the revision worksheet before Monday.",
    lastMessageTime: "10:30 AM",
    unreadCount: 1,
    messages: [
      { id: "M001", sender: "teacher", text: "Good morning, Arjun. Please complete the revision worksheet before Monday.", timestamp: "10:25 AM", date: "19 Sep 2026" },
      { id: "M002", sender: "student", text: "Good morning, ma'am. I will complete it and submit on time.", timestamp: "10:28 AM", date: "19 Sep 2026" },
      { id: "M003", sender: "teacher", text: "Thank you. Please let me know if you need any clarification on any topic.", timestamp: "10:30 AM", date: "19 Sep 2026" },
    ],
  },
  {
    id: "CONV002",
    teacherName: "Mr. Rajesh Kumar",
    teacherRole: "Mathematics Teacher",
    teacherInitials: "RK",
    lastMessage: "Your Arithmetic Progression assignment has been reviewed.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      { id: "M101", sender: "teacher", text: "Arjun, I have reviewed your Arithmetic Progression worksheet. You scored 18/20. Well done!", timestamp: "03:15 PM", date: "18 Sep 2026" },
      { id: "M102", sender: "student", text: "Thank you, sir. I will review the two mistakes.", timestamp: "04:30 PM", date: "18 Sep 2026" },
      { id: "M103", sender: "teacher", text: "Yes, please check the last two problems. The formula was applied incorrectly.", timestamp: "04:35 PM", date: "18 Sep 2026" },
    ],
  },
  {
    id: "CONV003",
    teacherName: "School Administration",
    teacherRole: "Office",
    teacherInitials: "SA",
    lastMessage: "Reminder: Parent-Teacher Meeting on 27 Sep 2026.",
    lastMessageTime: "18 Sep",
    unreadCount: 0,
    messages: [
      { id: "M201", sender: "teacher", text: "Dear Arjun, this is a reminder about the Parent-Teacher Meeting scheduled for 27 September 2026. Please inform your parents and ask them to register at the school office for a time slot.", timestamp: "11:00 AM", date: "18 Sep 2026" },
    ],
  },
];

const conversationsSTU002: Conversation[] = [
  {
    id: "CONV201",
    teacherName: "Mr. Senthil Kumar",
    teacherRole: "Class Teacher · Class 7-B",
    teacherInitials: "SK",
    lastMessage: "Priya, please submit the overdue Social Science assignment.",
    lastMessageTime: "09:00 AM",
    unreadCount: 1,
    messages: [
      { id: "M301", sender: "teacher", text: "Priya, the Social Science map activity assignment was due on 12 Sep 2026. Please submit it immediately.", timestamp: "09:00 AM", date: "19 Sep 2026" },
    ],
  },
  {
    id: "CONV202",
    teacherName: "Mrs. Lakshmi Priya",
    teacherRole: "Mathematics Teacher",
    teacherInitials: "LP",
    lastMessage: "Unit test on fractions on 24 Sep. Be prepared.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      { id: "M401", sender: "teacher", text: "Class 7-B students, there will be a unit test on fractions and decimals on 24 September. Please revise Chapter 2 thoroughly.", timestamp: "02:00 PM", date: "18 Sep 2026" },
      { id: "M402", sender: "student", text: "Yes ma'am. Will the test be written or MCQ?", timestamp: "04:00 PM", date: "18 Sep 2026" },
      { id: "M403", sender: "teacher", text: "It will be written — 50 marks in 1 hour.", timestamp: "04:05 PM", date: "18 Sep 2026" },
    ],
  },
];

const conversationsSTU003: Conversation[] = [
  {
    id: "CONV301",
    teacherName: "Mr. Anand Krishnamurthy",
    teacherRole: "Class Teacher · Class 10-B",
    teacherInitials: "AK",
    lastMessage: "Kavya, excellent work on the polynomials test!",
    lastMessageTime: "10:00 AM",
    unreadCount: 1,
    messages: [
      { id: "M501", sender: "teacher", text: "Kavya, congratulations on your excellent performance in the Unit Test on Polynomials. You scored 48/50. Keep it up!", timestamp: "10:00 AM", date: "19 Sep 2026" },
      { id: "M502", sender: "student", text: "Thank you, sir! I studied hard for it.", timestamp: "10:30 AM", date: "19 Sep 2026" },
    ],
  },
  {
    id: "CONV302",
    teacherName: "Mr. Arun Prasad",
    teacherRole: "Computer Science Teacher",
    teacherInitials: "AP",
    lastMessage: "Complete the Python loops assignment by 20 Sep.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      { id: "M601", sender: "teacher", text: "Kavya, please complete the Python Lists and Loops assignment by 20 September. Submit as a printed listing.", timestamp: "03:00 PM", date: "18 Sep 2026" },
    ],
  },
];

const allConversations: Record<string, Conversation[]> = {
  STU001: conversationsSTU001,
  STU002: conversationsSTU002,
  STU003: conversationsSTU003,
};

export function getConversations(studentId: string): Conversation[] {
  return allConversations[studentId] ?? [];
}

export function getTotalUnread(studentId: string): number {
  return getConversations(studentId).reduce((sum, c) => sum + c.unreadCount, 0);
}
