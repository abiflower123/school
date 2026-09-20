// ============================================================
// Mock Helpdesk Service
// ============================================================

export type TicketCategory = "Academic" | "Attendance" | "Finance" | "Transport" | "Facilities" | "App Issue" | "Other";
export type TicketStatus = "Open" | "In Review" | "Resolved" | "Closed";

export type TicketReply = {
  id: string;
  sender: "student" | "admin";
  text: string;
  timestamp: string;
};

export type SupportTicket = {
  id: string;
  ticketNumber: string;
  category: TicketCategory;
  subject: string;
  description: string;
  submittedDate: string;
  status: TicketStatus;
  replies: TicketReply[];
  resolutionRating?: 1 | 2 | 3 | 4 | 5;
};

const ticketsSTU001: SupportTicket[] = [
  {
    id: "TKT001",
    ticketNumber: "TKT-2026-001",
    category: "Academic",
    subject: "Request for additional Mathematics practice material",
    description: "Additional practice questions would be very helpful before the upcoming unit test on Quadratic Equations.",
    submittedDate: "14 Sep 2026",
    status: "In Review",
    replies: [
      { id: "R001", sender: "admin", text: "Thank you for your request. We have forwarded this to the Mathematics department. The teacher will provide additional material within 2 working days.", timestamp: "15 Sep 2026, 10:30 AM" },
    ],
  },
  {
    id: "TKT002",
    ticketNumber: "TKT-2026-002",
    category: "App Issue",
    subject: "Cannot download progress report PDF",
    description: "When I click the Download Report button on the Progress Reports page, nothing happens. I need the report for the PTM.",
    submittedDate: "10 Sep 2026",
    status: "Resolved",
    replies: [
      { id: "R002", sender: "admin", text: "We are looking into this issue. The PDF download feature will be restored shortly.", timestamp: "11 Sep 2026, 09:00 AM" },
      { id: "R003", sender: "admin", text: "The issue has been fixed. You can now download your progress report. Please let us know if the issue persists.", timestamp: "12 Sep 2026, 11:00 AM" },
      { id: "R004", sender: "student", text: "It is working now. Thank you!", timestamp: "12 Sep 2026, 04:00 PM" },
    ],
  },
];

const ticketsSTU002: SupportTicket[] = [
  {
    id: "TKT201",
    ticketNumber: "TKT-2026-201",
    category: "Attendance",
    subject: "Attendance marked incorrectly on 12 Sep 2026",
    description: "I was present on 12 September 2026 (Friday) but the attendance shows as Absent. Please correct this.",
    submittedDate: "13 Sep 2026",
    status: "In Review",
    replies: [
      { id: "R201", sender: "admin", text: "We have noted your complaint and will verify with the class teacher. We will update you within 2 days.", timestamp: "14 Sep 2026, 10:00 AM" },
    ],
  },
];

const ticketsSTU003: SupportTicket[] = [
  {
    id: "TKT301",
    ticketNumber: "TKT-2026-301",
    category: "Finance",
    subject: "Transport fee payment not reflecting",
    description: "I paid the Term 2 transport fee online on 15 Sep 2026 but it still shows as overdue in the portal.",
    submittedDate: "18 Sep 2026",
    status: "Open",
    replies: [],
  },
];

const allTickets: Record<string, SupportTicket[]> = { STU001: ticketsSTU001, STU002: ticketsSTU002, STU003: ticketsSTU003 };

export function getTickets(studentId: string): SupportTicket[] {
  return allTickets[studentId] ?? [];
}

export function addTicket(
  tickets: SupportTicket[],
  category: TicketCategory,
  subject: string,
  description: string
): SupportTicket[] {
  const newTicket: SupportTicket = {
    id: `TKT${Date.now()}`,
    ticketNumber: `TKT-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`,
    category,
    subject,
    description,
    submittedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    status: "Open",
    replies: [],
  };
  return [newTicket, ...tickets];
}

export function closeTicket(tickets: SupportTicket[], ticketId: string): SupportTicket[] {
  return tickets.map((t) => (t.id === ticketId ? { ...t, status: "Closed" as const } : t));
}

export function reopenTicket(tickets: SupportTicket[], ticketId: string): SupportTicket[] {
  return tickets.map((t) => (t.id === ticketId ? { ...t, status: "Open" as const } : t));
}

export function rateResolution(tickets: SupportTicket[], ticketId: string, rating: 1 | 2 | 3 | 4 | 5): SupportTicket[] {
  return tickets.map((t) => (t.id === ticketId ? { ...t, resolutionRating: rating } : t));
}

export function addReply(tickets: SupportTicket[], ticketId: string, text: string): SupportTicket[] {
  return tickets.map((t) => {
    if (t.id !== ticketId) return t;
    const newReply: TicketReply = {
      id: `R${Date.now()}`,
      sender: "student",
      text,
      timestamp: new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    };
    return { ...t, replies: [...t.replies, newReply] };
  });
}
