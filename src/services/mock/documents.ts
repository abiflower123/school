// ============================================================
// Mock Documents & Certificates Service
// ============================================================

export type DocumentType =
  | "Bonafide Certificate"
  | "Transfer Certificate"
  | "Character & Conduct Certificate"
  | "Medical Certificate"
  | "Study Certificate"
  | "Academic Transcript"
  | "Sports Excellence Award"
  | "Science Olympiad Championship"
  | "Cultural Fest Top Ranker";

export type DocumentCategory = "Official" | "Academic" | "Achievement" | "Sports";
export type DocumentStatus = "Available" | "Pending" | "Processing" | "Ready" | "Issued";

export type IssuedDocument = {
  id: string;
  title: string;
  type: DocumentType;
  category: DocumentCategory;
  issuedDate: string;
  issuedBy: string;
  purpose: string;
  certificateNo: string;
  verificationCode: string;
  academicYear: string;
  awardBadge?: string;
  description?: string;
  downloadUrl?: string;
};

export type RequestStep = {
  title: string;
  status: "completed" | "current" | "upcoming";
  date?: string;
  note?: string;
};

export type DocumentRequest = {
  id: string;
  type: DocumentType;
  purpose: string;
  requestedDate: string;
  status: DocumentStatus;
  estimatedDate?: string;
  remarks?: string;
  deliveryMode: "Digital PDF" | "Physical Copy (School Counter)" | "Both";
  urgency: "Standard (5-7 Days)" | "Express Priority (48 Hrs)";
  timeline: RequestStep[];
};

const issuedDocsSTU001: IssuedDocument[] = [
  {
    id: "DOC001",
    title: "Official Bonafide Student Certificate",
    type: "Bonafide Certificate",
    category: "Official",
    issuedDate: "10 Jun 2026",
    issuedBy: "Dr. K. Ranganathan (Principal)",
    purpose: "Bank Account Opening & Passport Verification",
    certificateNo: "RHS/BON/2026/0842",
    verificationCode: "VER-BON-2026-9921",
    academicYear: "2026-2027",
    description: "Certifies that the student is a bonafide regular student of Class X-A at Ravion Higher Secondary School.",
  },
  {
    id: "DOC002",
    title: "Academic Excellence Study & Conduct Certificate",
    type: "Study Certificate",
    category: "Official",
    issuedDate: "15 Apr 2026",
    issuedBy: "Mrs. S. Meenakshi (Vice Principal)",
    purpose: "State Merit Scholarship Application",
    certificateNo: "RHS/STD/2026/0319",
    verificationCode: "VER-STD-2026-4410",
    academicYear: "2025-2026",
    description: "Attests good moral conduct, exemplary attendance, and high academic performance during 2025-26.",
  },
  {
    id: "DOC003",
    title: "1st Place - Tamil Nadu State Science Olympiad",
    type: "Science Olympiad Championship",
    category: "Achievement",
    issuedDate: "28 Feb 2026",
    issuedBy: "Tamil Nadu Science & Tech Council",
    purpose: "State Level Academic Honor",
    certificateNo: "TN-SCI-OLY-2026-004",
    verificationCode: "VER-OLY-2026-1082",
    academicYear: "2025-2026",
    awardBadge: "Gold Medalist",
    description: "Awarded First Rank in the Senior Physics & Innovation Category for the Smart Solar Irrigation prototype.",
  },
  {
    id: "DOC004",
    title: "Gold Medal - District Inter-School 400m Athletics",
    type: "Sports Excellence Award",
    category: "Sports",
    issuedDate: "12 Dec 2025",
    issuedBy: "Chennai District Sports Authority",
    purpose: "District Sports Recognition",
    certificateNo: "CDSA/ATH/2025/112",
    verificationCode: "VER-SPT-2025-8831",
    academicYear: "2025-2026",
    awardBadge: "Champion",
    description: "Secured First Position in 400m Boys Sprint with a timing of 52.4 seconds.",
  },
];

const requestsSTU001: DocumentRequest[] = [
  {
    id: "REQ001",
    type: "Character & Conduct Certificate",
    purpose: "Higher Secondary Board Scholarship & Regional Sports Trials",
    requestedDate: "14 Sep 2026",
    status: "Processing",
    estimatedDate: "22 Sep 2026",
    deliveryMode: "Both",
    urgency: "Standard (5-7 Days)",
    remarks: "Under verification by Class Teacher and Discipline Committee.",
    timeline: [
      { title: "Application Submitted", status: "completed", date: "14 Sep 2026", note: "Submitted via Student Portal" },
      { title: "Class Teacher Verification", status: "completed", date: "16 Sep 2026", note: "Approved by Mr. Rajesh Kumar" },
      { title: "Principal Sign-off & Seal", status: "current", date: "In Progress", note: "Awaiting final digital signature" },
      { title: "Ready for Download & Counter Pickup", status: "upcoming", note: "Expected by 22 Sep 2026" },
    ],
  },
];

const issuedDocsSTU002: IssuedDocument[] = [
  {
    id: "DOC101",
    title: "Official Bonafide Student Certificate",
    type: "Bonafide Certificate",
    category: "Official",
    issuedDate: "12 Jun 2026",
    issuedBy: "Dr. K. Ranganathan (Principal)",
    purpose: "Library & Concession Pass",
    certificateNo: "RHS/BON/2026/0911",
    verificationCode: "VER-BON-2026-3021",
    academicYear: "2026-2027",
    description: "Official student verification document for local municipal library access.",
  },
];

const requestsSTU002: DocumentRequest[] = [];

const issuedDocsSTU003: IssuedDocument[] = [
  {
    id: "DOC201",
    title: "Study Certificate",
    type: "Study Certificate",
    category: "Official",
    issuedDate: "20 May 2026",
    issuedBy: "Dr. K. Ranganathan (Principal)",
    purpose: "Scholarship Renewal",
    certificateNo: "RHS/STD/2026/0402",
    verificationCode: "VER-STD-2026-5591",
    academicYear: "2025-2026",
  },
  {
    id: "DOC202",
    title: "Official Bonafide Certificate",
    type: "Bonafide Certificate",
    category: "Official",
    issuedDate: "05 Aug 2026",
    issuedBy: "Dr. K. Ranganathan (Principal)",
    purpose: "Passport Application",
    certificateNo: "RHS/BON/2026/1104",
    verificationCode: "VER-BON-2026-7740",
    academicYear: "2026-2027",
  },
];

const requestsSTU003: DocumentRequest[] = [
  {
    id: "REQ201",
    type: "Bonafide Certificate",
    purpose: "NEET Coaching Registration",
    requestedDate: "16 Sep 2026",
    status: "Ready",
    estimatedDate: "19 Sep 2026",
    deliveryMode: "Digital PDF",
    urgency: "Express Priority (48 Hrs)",
    remarks: "Approved & Ready! Digital copy signed and ready for immediate download.",
    timeline: [
      { title: "Application Submitted", status: "completed", date: "16 Sep 2026" },
      { title: "Class Teacher Verification", status: "completed", date: "17 Sep 2026" },
      { title: "Principal Sign-off & Seal", status: "completed", date: "18 Sep 2026" },
      { title: "Ready for Download", status: "completed", date: "19 Sep 2026", note: "Available in Vault" },
    ],
  },
];

const allIssuedDocs: Record<string, IssuedDocument[]> = {
  STU001: issuedDocsSTU001,
  STU002: issuedDocsSTU002,
  STU003: issuedDocsSTU003,
};

const allRequests: Record<string, DocumentRequest[]> = {
  STU001: requestsSTU001,
  STU002: requestsSTU002,
  STU003: requestsSTU003,
};

export function getIssuedDocuments(studentId: string): IssuedDocument[] {
  return allIssuedDocs[studentId] ?? [];
}

export function getDocumentRequests(studentId: string): DocumentRequest[] {
  return allRequests[studentId] ?? [];
}

export function addDocumentRequest(
  _studentId: string,
  requests: DocumentRequest[],
  type: DocumentType,
  purpose: string,
  deliveryMode: "Digital PDF" | "Physical Copy (School Counter)" | "Both" = "Digital PDF",
  urgency: "Standard (5-7 Days)" | "Express Priority (48 Hrs)" = "Standard (5-7 Days)"
): DocumentRequest[] {
  const isExpress = urgency.includes("48 Hrs");
  const daysToAdd = isExpress ? 2 : 6;
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysToAdd);

  const formattedDate = targetDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const todayStr = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const newReq: DocumentRequest = {
    id: `REQ${Date.now().toString().slice(-4)}`,
    type,
    purpose,
    requestedDate: todayStr,
    status: "Pending",
    estimatedDate: formattedDate,
    deliveryMode,
    urgency,
    remarks: isExpress
      ? "Express priority request logged. Expedited approval queued."
      : "Standard processing ticket logged.",
    timeline: [
      { title: "Application Submitted", status: "completed", date: todayStr, note: `Delivery: ${deliveryMode}` },
      { title: "Class Teacher Verification", status: "current", note: "Under review" },
      { title: "Principal Sign-off & Seal", status: "upcoming" },
      { title: "Ready for Download / Counter Pickup", status: "upcoming", note: `Est. ${formattedDate}` },
    ],
  };

  return [newReq, ...requests];
}
