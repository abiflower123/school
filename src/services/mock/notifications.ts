// ============================================================
// Mock Notifications Service
// ============================================================

export type NotificationCategory = "Academic" | "Finance" | "Attendance" | "Exam" | "Assignment" | "General" | "Communication";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  timestamp: string; // ISO 8601
  read: boolean;
  link?: string; // route to navigate on click
};

const notificationsSTU001: AppNotification[] = [
  { id: "N001", title: "Exam Results Published", body: "Your Chapter Test results for Social Science have been published. You scored 45/50 (90%).", category: "Exam", timestamp: "2026-09-19T10:30:00+05:30", read: false, link: "/exams" },
  { id: "N002", title: "Assignment Due Tomorrow", body: "Mathematics — Quadratic Equations assignment is due on 20 Sep 2026. Please submit on time.", category: "Assignment", timestamp: "2026-09-19T09:00:00+05:30", read: false, link: "/assignments" },
  { id: "N003", title: "Fee Payment Reminder", body: "Term 2 Transport Fee (₹4,500) is overdue. Please pay immediately to avoid penalty.", category: "Finance", timestamp: "2026-09-18T11:00:00+05:30", read: false, link: "/fees" },
  { id: "N004", title: "Attendance Update", body: "Your attendance for the week ending 13 Sep 2026: 5/6 days present.", category: "Attendance", timestamp: "2026-09-14T08:00:00+05:30", read: true, link: "/attendance" },
  { id: "N005", title: "New Announcement", body: "Parent-Teacher Meeting scheduled for 27 September 2026. Book your slot now.", category: "General", timestamp: "2026-09-19T08:30:00+05:30", read: false, link: "/announcements" },
  { id: "N006", title: "Teacher Message", body: "Mrs. Kavitha Sundaram sent you a message.", category: "Communication", timestamp: "2026-09-18T14:30:00+05:30", read: true, link: "/messages" },
  { id: "N007", title: "Assignment Graded", body: "Your Arithmetic Progression worksheet has been graded: 18/20. Feedback from teacher available.", category: "Assignment", timestamp: "2026-09-16T10:00:00+05:30", read: true, link: "/assignments" },
  { id: "N008", title: "Leave Request Approved", body: "Your leave request for 5–6 Sep 2026 (Medical Leave) has been approved.", category: "Attendance", timestamp: "2026-09-04T14:00:00+05:30", read: true, link: "/leave" },
];

const notificationsSTU002: AppNotification[] = [
  { id: "N201", title: "Attendance Shortage Warning", body: "Your overall attendance has dropped below 75%. Please ensure regular attendance to avoid detention.", category: "Attendance", timestamp: "2026-09-19T09:00:00+05:30", read: false, link: "/attendance" },
  { id: "N202", title: "Assignment Overdue", body: "Social Science — India's Physical Features assignment is now overdue. Please submit at the earliest.", category: "Assignment", timestamp: "2026-09-13T08:00:00+05:30", read: false, link: "/assignments" },
  { id: "N203", title: "Exam Results Published", body: "Science — Plants Test results are published. You scored 42/50 (84%).", category: "Exam", timestamp: "2026-09-12T11:00:00+05:30", read: true, link: "/exams" },
  { id: "N204", title: "New Announcement", body: "Parent-Teacher Meeting scheduled for 27 September 2026.", category: "General", timestamp: "2026-09-19T08:30:00+05:30", read: false, link: "/announcements" },
];

const notificationsSTU003: AppNotification[] = [
  { id: "N301", title: "Exam Results Published", body: "Mathematics Unit Test results published. You scored 48/50 (96%). Excellent!", category: "Exam", timestamp: "2026-09-19T10:00:00+05:30", read: false, link: "/exams" },
  { id: "N302", title: "Fee Payment Reminder", body: "Transport Fee Term 2 (₹4,500) is overdue. Please pay immediately.", category: "Finance", timestamp: "2026-09-18T11:00:00+05:30", read: false, link: "/fees" },
  { id: "N303", title: "New Announcement", body: "Parent-Teacher Meeting scheduled for 27 September 2026.", category: "General", timestamp: "2026-09-19T08:30:00+05:30", read: true, link: "/announcements" },
  { id: "N304", title: "Assignment Due Tomorrow", body: "Mathematics — Quadratic Equations Extra Practice is due tomorrow.", category: "Assignment", timestamp: "2026-09-19T09:00:00+05:30", read: false, link: "/assignments" },
];

const allNotifications: Record<string, AppNotification[]> = {
  STU001: notificationsSTU001,
  STU002: notificationsSTU002,
  STU003: notificationsSTU003,
};

export function getNotifications(studentId: string): AppNotification[] {
  return allNotifications[studentId] ?? [];
}

export function getUnreadCount(studentId: string): number {
  return getNotifications(studentId).filter((n) => !n.read).length;
}

export function formatNotificationTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}
