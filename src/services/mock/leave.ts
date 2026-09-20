// ============================================================
// Mock Leave Applications Service
// ============================================================

export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";
export type LeaveType = "Sick Leave" | "Casual Leave" | "Emergency Leave";

export type LeaveRequest = {
  id: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  attachmentName: string | null;
  status: LeaveStatus;
  appliedOn: string;
  duration?: "Full Day" | "Half Day (Morning)" | "Half Day (Afternoon)";
};

const leaveSTU001: LeaveRequest[] = [
  {
    id: "L001",
    type: "Sick Leave",
    startDate: "2026-08-15",
    endDate: "2026-08-16",
    reason: "Viral fever",
    attachmentName: "medical_certificate.pdf",
    status: "Approved",
    appliedOn: "2026-08-14",
    duration: "Full Day",
  },
];

const leaveSTU002: LeaveRequest[] = [
  {
    id: "L101",
    type: "Casual Leave",
    startDate: "2026-09-05",
    endDate: "2026-09-05",
    reason: "Family function",
    attachmentName: null,
    status: "Rejected",
    appliedOn: "2026-09-02",
    duration: "Full Day",
  },
];

const leaveSTU003: LeaveRequest[] = [];

const allLeave: Record<string, LeaveRequest[]> = {
  STU001: leaveSTU001,
  STU002: leaveSTU002,
  STU003: leaveSTU003,
};

export function getLeaveRequests(studentId: string): LeaveRequest[] {
  return allLeave[studentId] ?? [];
}

export function addLeaveRequest(
  studentId: string,
  type: LeaveType,
  startDate: string,
  endDate: string,
  reason: string,
  attachmentName: string | null,
  duration: "Full Day" | "Half Day (Morning)" | "Half Day (Afternoon)" = "Full Day"
): LeaveRequest[] {
  const newReq: LeaveRequest = {
    id: `L${Date.now()}`,
    type,
    startDate,
    endDate,
    reason,
    attachmentName,
    status: "Pending",
    appliedOn: new Date().toISOString().split("T")[0],
    duration,
  };
  if (!allLeave[studentId]) allLeave[studentId] = [];
  allLeave[studentId] = [newReq, ...allLeave[studentId]];
  return [...allLeave[studentId]];
}

export function cancelLeaveRequest(studentId: string, id: string): LeaveRequest[] {
  if (allLeave[studentId]) {
    allLeave[studentId] = allLeave[studentId].map((r) => (r.id === id ? { ...r, status: "Cancelled" as const } : r));
  }
  return allLeave[studentId] ?? [];
}

/** Mock class-teacher review — resolves most requests to Approved after review. */
export function resolveLeaveRequest(studentId: string, id: string): LeaveRequest[] {
  if (allLeave[studentId]) {
    allLeave[studentId] = allLeave[studentId].map((r) => (r.id === id && r.status === "Pending" ? { ...r, status: "Approved" as const } : r));
  }
  return allLeave[studentId] ?? [];
}
