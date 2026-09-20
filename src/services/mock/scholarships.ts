// ============================================================
// Mock Scholarship & Financial Concession Service
// ============================================================

export type ScholarshipCategory = "Government" | "Institutional Merit" | "Sports Excellence" | "Family & Welfare";
export type ScholarshipStatus = "Not Applied" | "Submitted" | "Under Review" | "Approved" | "Disbursed" | "Rejected";

export type Scholarship = {
  id: string;
  name: string;
  category: ScholarshipCategory;
  provider: string;
  badgeTag: string;
  description: string;
  eligibilityCriteria: string[];
  amount: string;
  amountValue: number;
  deadline: string;
  daysRemaining: number;
  requiredDocs: string[];
  disbursementType: "Tuition Fee Rebate" | "Direct Bank Credit";
};

export type ApplicationStep = {
  title: string;
  status: "completed" | "current" | "upcoming";
  date?: string;
  note?: string;
};

export type ScholarshipApplication = {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  category: ScholarshipCategory;
  appliedDate: string;
  status: ScholarshipStatus;
  amountGranted: string;
  disbursementStatus: "Pending Scrutiny" | "Credited to Fee Ledger" | "Bank Transfer Completed" | "Action Needed";
  remarks?: string;
  documentsSubmitted: string[];
  timeline: ApplicationStep[];
};

const availableScholarships: Scholarship[] = [
  {
    id: "SCH1",
    name: "Tamil Nadu CM STEM Excellence Concession",
    category: "Government",
    provider: "Department of School Education, Govt. of Tamil Nadu",
    badgeTag: "TN Govt Scheme",
    description: "State government initiative supporting high-performing science and mathematics students in matriculation schools.",
    eligibilityCriteria: [
      "Minimum 85% aggregate in last academic year Science & Mathematics",
      "Regular attendance > 80% throughout the term",
      "Enrolled in Class IX to XII in Tamil Nadu State Board / Matriculation",
    ],
    amount: "₹10,000 / Year",
    amountValue: 10000,
    deadline: "31 Oct 2026",
    daysRemaining: 41,
    requiredDocs: ["Grade 9 Mark Sheet", "Aadhaar Card", "Income Certificate (< ₹2.5 Lakhs/yr)"],
    disbursementType: "Tuition Fee Rebate",
  },
  {
    id: "SCH2",
    name: "Ravion Chairman's Academic Merit Grant",
    category: "Institutional Merit",
    provider: "Ravion Educational Trust",
    badgeTag: "Trust Concession",
    description: "Full or partial tuition grant for top 3 rank holders in class examinations and regional academic contests.",
    eligibilityCriteria: [
      "Top 5% rank in class term exams",
      "Exemplary discipline and active participation in academic clubs",
    ],
    amount: "₹15,000 / Year",
    amountValue: 15000,
    deadline: "15 Nov 2026",
    daysRemaining: 56,
    requiredDocs: ["Term 1 Official Mark Statement", "Class Teacher Recommendation Letter"],
    disbursementType: "Tuition Fee Rebate",
  },
  {
    id: "SCH3",
    name: "Pudhumai Penn / Moovalur Ramamirtham Ammiyar Scheme",
    category: "Government",
    provider: "Social Welfare & Women Empowerment Dept, TN",
    badgeTag: "Girls Empowerment",
    description: "State welfare assistance scheme providing direct monthly financial stipend to female students.",
    eligibilityCriteria: [
      "Female student enrolled in regular Tamil Nadu school curriculum",
      "Studied continuously in TN schools from Class 6 to 10",
    ],
    amount: "₹1,000 / Month",
    amountValue: 12000,
    deadline: "10 Nov 2026",
    daysRemaining: 51,
    requiredDocs: ["EMIS Student ID Proof", "Aadhaar Card", "Parent Savings Bank Passbook"],
    disbursementType: "Direct Bank Credit",
  },
  {
    id: "SCH4",
    name: "Sibling Tuition Concession",
    category: "Family & Welfare",
    provider: "Ravion Higher Secondary School",
    badgeTag: "Family Benefit",
    description: "15% tuition fee waiver for families with two or more siblings concurrently enrolled at Ravion School.",
    eligibilityCriteria: [
      "Two or more biological siblings actively studying in Ravion School",
      "No fee arrears in previous academic terms",
    ],
    amount: "15% Fee Concession",
    amountValue: 7500,
    deadline: "Rolling (Apply Anytime)",
    daysRemaining: 180,
    requiredDocs: ["Both Siblings Admission ID Cards", "Parent Identity Proof"],
    disbursementType: "Tuition Fee Rebate",
  },
  {
    id: "SCH5",
    name: "District Sports Champion Grant",
    category: "Sports Excellence",
    provider: "Sports Development Authority of Tamil Nadu (SDAT)",
    badgeTag: "Sports Honor",
    description: "One-time financial honorarium and sports kit allowance for district and state level athletics champions.",
    eligibilityCriteria: [
      "Gold or Silver medal in SDAT recognized district/state sports tournament",
      "Active member of school sports team",
    ],
    amount: "₹8,000 One-time",
    amountValue: 8000,
    deadline: "15 Dec 2026",
    daysRemaining: 86,
    requiredDocs: ["Official Sports Medalist Certificate", "Physical Director Sign-off"],
    disbursementType: "Direct Bank Credit",
  },
];

const applicationsSTU001: ScholarshipApplication[] = [
  {
    id: "SAPP001",
    scholarshipId: "SCH1",
    scholarshipName: "Tamil Nadu CM STEM Excellence Concession",
    category: "Government",
    appliedDate: "05 Sep 2026",
    status: "Approved",
    amountGranted: "₹10,000 / Year",
    disbursementStatus: "Credited to Fee Ledger",
    remarks: "Verified & Approved by State Nodal Officer. ₹5,000 credited towards Term 1 fee ledger.",
    documentsSubmitted: ["Grade 9 Mark Sheet", "Aadhaar Card", "Income Certificate"],
    timeline: [
      { title: "Application Submitted", status: "completed", date: "05 Sep 2026", note: "Application ID: SAPP001" },
      { title: "Document Scrutiny", status: "completed", date: "08 Sep 2026", note: "Approved by School Nodal Officer" },
      { title: "State Department Approval", status: "completed", date: "12 Sep 2026", note: "Sanction Order #TN-STEM-8841" },
      { title: "Fee Ledger Credit", status: "completed", date: "15 Sep 2026", note: "Adjusted in Term 2 Ledger" },
    ],
  },
  {
    id: "SAPP002",
    scholarshipId: "SCH2",
    scholarshipName: "Ravion Chairman's Academic Merit Grant",
    category: "Institutional Merit",
    appliedDate: "14 Sep 2026",
    status: "Under Review",
    amountGranted: "₹15,000 / Year",
    disbursementStatus: "Pending Scrutiny",
    remarks: "Class rank & term 1 marks under review by Academic Council.",
    documentsSubmitted: ["Term 1 Official Mark Statement"],
    timeline: [
      { title: "Application Submitted", status: "completed", date: "14 Sep 2026" },
      { title: "Academic Council Review", status: "current", note: "Meeting scheduled for 25 Sep" },
      { title: "Trustee Sign-off", status: "upcoming" },
      { title: "Disbursement to Ledger", status: "upcoming" },
    ],
  },
];

const applicationsSTU002: ScholarshipApplication[] = [
  {
    id: "SAPP101",
    scholarshipId: "SCH4",
    scholarshipName: "Sibling Tuition Concession",
    category: "Family & Welfare",
    appliedDate: "12 Jun 2026",
    status: "Approved",
    amountGranted: "₹7,500 Concession",
    disbursementStatus: "Credited to Fee Ledger",
    remarks: "Concession applied automatically to Term 2 tuition fee.",
    documentsSubmitted: ["Sibling ID Cards", "Parent Aadhaar"],
    timeline: [
      { title: "Application Submitted", status: "completed", date: "12 Jun 2026" },
      { title: "Admin Clearance", status: "completed", date: "14 Jun 2026" },
      { title: "Ledger Discount Applied", status: "completed", date: "15 Jun 2026" },
    ],
  },
];

const applicationsSTU003: ScholarshipApplication[] = [];

const allApplications: Record<string, ScholarshipApplication[]> = {
  STU001: applicationsSTU001,
  STU002: applicationsSTU002,
  STU003: applicationsSTU003,
};

export function getAvailableScholarships(): Scholarship[] {
  return availableScholarships;
}

export function getScholarshipApplications(studentId: string): ScholarshipApplication[] {
  return allApplications[studentId] ?? [];
}

export function applyForScholarship(
  _studentId: string,
  applications: ScholarshipApplication[],
  scholarship: Scholarship,
  documents: string[] = [],
  reason: string = ""
): ScholarshipApplication[] {
  const todayStr = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const newApp: ScholarshipApplication = {
    id: `SAPP${Date.now().toString().slice(-4)}`,
    scholarshipId: scholarship.id,
    scholarshipName: scholarship.name,
    category: scholarship.category,
    appliedDate: todayStr,
    status: "Submitted",
    amountGranted: scholarship.amount,
    disbursementStatus: "Pending Scrutiny",
    remarks: reason ? `Reason noted: ${reason}` : "Application logged for review by School Administration.",
    documentsSubmitted: documents.length > 0 ? documents : scholarship.requiredDocs,
    timeline: [
      { title: "Application Submitted", status: "completed", date: todayStr, note: `Disbursement: ${scholarship.disbursementType}` },
      { title: "School Level Verification", status: "current", note: "Under review by Nodal Officer" },
      { title: "Authority Approval", status: "upcoming" },
      { title: "Disbursement & Ledger Credit", status: "upcoming" },
    ],
  };

  return [newApp, ...applications];
}
