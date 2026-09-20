import React, { useState, useMemo } from "react";
import {
  FileBadge,
  Download,
  Plus,
  Clock3,
  CheckCircle2,
  ShieldCheck,
  Award,
  Search,
  Printer,
  X,
  ExternalLink,
  QrCode,
  Calendar,
  Building2,
  Sparkles,
  Zap,
  ArrowRight,
  ChevronRight,
  Filter,
  Layers,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getIssuedDocuments,
  getDocumentRequests,
  addDocumentRequest,
  type DocumentType,
  type IssuedDocument,
  type DocumentRequest,
  type DocumentCategory,
} from "../../services/mock/documents";

const DOC_TYPE_OPTIONS: { type: DocumentType; description: string; icon: any; color: string }[] = [
  {
    type: "Bonafide Certificate",
    description: "Proof of enrollment for banks, passports, bus passes & govt schemes",
    icon: ShieldCheck,
    color: "from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200/60",
  },
  {
    type: "Study Certificate",
    description: "Academic proof for state scholarships and higher education admissions",
    icon: FileText,
    color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200/60",
  },
  {
    type: "Character & Conduct Certificate",
    description: "Official testimonial of discipline and conduct from the Principal",
    icon: BadgeCheck,
    color: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200/60",
  },
  {
    type: "Academic Transcript",
    description: "Consolidated grade sheet and exam transcript across academic terms",
    icon: Layers,
    color: "from-purple-500/10 to-violet-500/10 text-purple-600 border-purple-200/60",
  },
  {
    type: "Transfer Certificate",
    description: "Official TC issued upon completion or school transfer clearance",
    icon: FileBadge,
    color: "from-rose-500/10 to-pink-500/10 text-rose-600 border-rose-200/60",
  },
];

const statusBadgeStyles: Record<string, string> = {
  Available: "bg-emerald-500/10 text-emerald-700 border-emerald-200/60",
  Ready: "bg-emerald-500/10 text-emerald-700 border-emerald-200/60 ring-1 ring-emerald-500/30",
  Processing: "bg-blue-500/10 text-blue-700 border-blue-200/60 animate-pulse",
  Pending: "bg-amber-500/10 text-amber-700 border-amber-200/60",
  Issued: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

export default function CertificatesPage() {
  const { selectedChild } = useAuth();
  const studentId = selectedChild?.id ?? "STU001";
  const studentName = selectedChild?.name ?? "Kavya Ranganathan";
  const studentClass = selectedChild?.grade ? `Class ${selectedChild.grade}` : "Class X-A";
  const rollNo = selectedChild?.rollNo ?? "2026-X-042";

  const [issuedDocs] = useState<IssuedDocument[]>(() => getIssuedDocuments(studentId));
  const [requests, setRequests] = useState<DocumentRequest[]>(() => getDocumentRequests(studentId));
  const [activeTab, setActiveTab] = useState<"official" | "merit" | "request" | "history">("official");
  const [selectedCategory, setSelectedCategory] = useState<"All" | DocumentCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Request Form States
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>("Bonafide Certificate");
  const [purpose, setPurpose] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<"Digital PDF" | "Physical Copy (School Counter)" | "Both">("Digital PDF");
  const [urgency, setUrgency] = useState<"Standard (5-7 Days)" | "Express Priority (48 Hrs)">("Standard (5-7 Days)");
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Certificate Modal State
  const [previewCert, setPreviewCert] = useState<IssuedDocument | null>(null);
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  // Filtered Documents
  const filteredIssuedDocs = useMemo(() => {
    return issuedDocs.filter((doc) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (selectedCategory === "Official" && (doc.category === "Official" || doc.category === "Academic")) ||
        doc.category === selectedCategory;

      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.certificateNo.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [issuedDocs, selectedCategory, searchQuery]);

  // Split Official vs Merit
  const officialDocs = useMemo(() => filteredIssuedDocs.filter((d) => d.category === "Official" || d.category === "Academic"), [filteredIssuedDocs]);
  const meritDocs = useMemo(() => filteredIssuedDocs.filter((d) => d.category === "Achievement" || d.category === "Sports"), [filteredIssuedDocs]);

  const handleDownload = (doc: IssuedDocument) => {
    const textContent = `====================================================
RAVION MATRICULATION HIGHER SECONDARY SCHOOL, CHENNAI
Affiliated to Tamil Nadu State Board | Estd. 1994
====================================================

OFFICIAL CERTIFICATE RECORD
Certificate No: ${doc.certificateNo}
Verification QR Code: ${doc.verificationCode}
Issue Date: ${doc.issuedDate}
Academic Year: ${doc.academicYear}

Student Name: ${studentName}
Roll Number: ${rollNo}
Class & Section: ${studentClass}

DOCUMENT TITLE: ${doc.title.toUpperCase()}
Type: ${doc.type}
Category: ${doc.category}

Purpose: ${doc.purpose}
Issuer Authority: ${doc.issuedBy}

Description:
${doc.description ?? "Official certificate issued by Ravion Higher Secondary School."}

----------------------------------------------------
DIGITAL AUTHENTICATION SEAL: VERIFIED & SEALED
Verify online at: https://verify.ravionschool.edu.in/cert/${doc.verificationCode}
====================================================`;

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadNotification(`Downloaded "${doc.title}" successfully!`);
    setTimeout(() => setDownloadNotification(null), 3500);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;

    const updated = addDocumentRequest(studentId, requests, selectedDocType, purpose, deliveryMode, urgency);
    setRequests(updated);
    setPurpose("");
    setSubmittedMessage(`Request for ${selectedDocType} logged successfully! Reference ID: ${updated[0].id}`);
    setTimeout(() => setSubmittedMessage(null), 4000);
    setActiveTab("history");
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-12">
      {/* Toast Download Notification */}
      {downloadNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-zinc-900 px-5 py-3.5 text-sm font-medium text-white shadow-2xl ring-1 ring-white/20 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 size={18} />
          </div>
          <span>{downloadNotification}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-zinc-900 via-indigo-950 to-zinc-900 p-6 sm:p-8 text-white shadow-xl">
        {/* Subtle Background Glows */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
              <ShieldCheck size={14} className="text-amber-400" />
              <span>Digital Credential Vault & Honors</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl text-white">
              Certificates & Achievements
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-zinc-300">
              Access tamper-proof official school certificates, state honors, and merit credentials. Request new bonafide or study documents online.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md text-center">
              <p className="text-xs text-zinc-400 font-medium">Issued Credentials</p>
              <p className="mt-1 text-2xl font-bold text-white">{issuedDocs.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md text-center">
              <p className="text-xs text-zinc-400 font-medium">Merit & Honors</p>
              <p className="mt-1 text-2xl font-bold text-amber-400">
                {issuedDocs.filter((d) => d.category === "Achievement" || d.category === "Sports").length}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md text-center">
              <p className="text-xs text-zinc-400 font-medium">Active Requests</p>
              <p className="mt-1 text-2xl font-bold text-blue-400">{requests.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200/80 pb-3">
        <div className="flex overflow-x-auto gap-2 no-scrollbar">
          {[
            { key: "official", label: "Official Certificates", icon: ShieldCheck, count: officialDocs.length },
            { key: "merit", label: "Merit & Awards", icon: Award, count: meritDocs.length },
            { key: "request", label: "Request New Document", icon: Plus, highlight: true },
            { key: "history", label: "Application Tracker", icon: Clock3, count: requests.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/10"
                    : tab.highlight
                    ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border border-amber-200/60"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/60"
                }`}
              >
                <Icon size={16} className={isActive ? "text-amber-400" : "text-zinc-500"} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                      isActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar for Official / Merit */}
        {(activeTab === "official" || activeTab === "merit") && (
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search document name..."
              className="w-full rounded-2xl border border-zinc-200/80 bg-white pl-10 pr-4 py-2 text-xs font-medium text-zinc-700 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition"
            />
          </div>
        )}
      </div>

      {/* TAB CONTENT 1: OFFICIAL CERTIFICATES */}
      {activeTab === "official" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Verified Educational & Institutional Certificates
            </p>
            <span className="text-xs text-zinc-400">{officialDocs.length} items available</span>
          </div>

          {officialDocs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
              <ShieldCheck size={44} className="mx-auto text-zinc-300" strokeWidth={1.5} />
              <h3 className="mt-3 text-base font-semibold text-zinc-800">No official documents found</h3>
              <p className="mt-1 text-xs text-zinc-500">
                {searchQuery ? "Try refining your search terms." : "Submit a request to issue a Bonafide or Conduct certificate."}
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("request")}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-zinc-800 transition"
              >
                <Plus size={15} />
                Request Certificate Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {officialDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-lg"
                >
                  {/* Decorative Left Ribbon Accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-blue-600" />

                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:scale-105 transition">
                          <ShieldCheck size={22} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-zinc-900 group-hover:text-indigo-600 transition">
                            {doc.title}
                          </h3>
                          <p className="text-xs font-medium text-zinc-400">Ref: {doc.certificateNo}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
                        <CheckCircle2 size={12} />
                        Verified
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                      {doc.description ?? `Purpose: ${doc.purpose}`}
                    </p>

                    <div className="rounded-2xl bg-zinc-50 p-3 text-xs space-y-1 text-zinc-500 border border-zinc-100">
                      <div className="flex items-center justify-between">
                        <span>Issued Date:</span>
                        <span className="font-semibold text-zinc-700">{doc.issuedDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Authority:</span>
                        <span className="font-semibold text-zinc-700">{doc.issuedBy}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>QR Auth Code:</span>
                        <span className="font-mono text-[11px] text-indigo-600 font-medium">{doc.verificationCode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-3">
                    <button
                      type="button"
                      onClick={() => setPreviewCert(doc)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition"
                    >
                      <Sparkles size={14} className="text-amber-500" />
                      Preview Certificate
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 transition"
                    >
                      <Download size={14} />
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: MERIT & ACHIEVEMENTS */}
      {activeTab === "merit" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Co-Curricular Honors, Sports & Competition Trophies
            </p>
            <span className="text-xs text-zinc-400">{meritDocs.length} items</span>
          </div>

          {meritDocs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-amber-300/80 bg-amber-50/30 px-6 py-16 text-center">
              <Award size={44} className="mx-auto text-amber-400" strokeWidth={1.5} />
              <h3 className="mt-3 text-base font-semibold text-zinc-800">No merit awards registered yet</h3>
              <p className="mt-1 text-xs text-zinc-500">
                Participation certificates in school olympiads and annual sports will be credited automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {meritDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Shiny Golden Corner Badge */}
                  <div className="absolute top-0 right-0 rounded-bl-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 text-[11px] font-bold text-white shadow-md flex items-center gap-1">
                    <Award size={13} />
                    <span>{doc.awardBadge ?? "Merit Honor"}</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
                        <Award size={24} />
                      </div>
                      <div className="pr-16">
                        <h3 className="text-base font-bold text-zinc-900 group-hover:text-amber-700 transition">
                          {doc.title}
                        </h3>
                        <p className="text-xs font-semibold text-amber-700">{doc.issuedBy}</p>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {doc.description ?? doc.purpose}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] rounded-2xl bg-white/80 p-3 border border-amber-100">
                      <div>
                        <span className="text-zinc-400 block">Academic Year</span>
                        <span className="font-semibold text-zinc-700">{doc.academicYear}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block">Awarded On</span>
                        <span className="font-semibold text-zinc-700">{doc.issuedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 border-t border-amber-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setPreviewCert(doc)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-amber-500 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:bg-amber-600 transition"
                    >
                      <Sparkles size={14} />
                      View Certificate Canvas
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition"
                    >
                      <Download size={14} />
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: REQUEST NEW CERTIFICATE */}
      {activeTab === "request" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Interactive Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-white">
                  <Plus size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-900">Request Official Certificate</h2>
                  <p className="text-xs text-zinc-500">Select certificate type and specify your purpose</p>
                </div>
              </div>

              {submittedMessage && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 animate-in fade-in">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>{submittedMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmitRequest} className="mt-6 space-y-5">
                {/* Visual Document Selector Cards */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-3">
                    1. Select Document Type
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {DOC_TYPE_OPTIONS.map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedDocType === item.type;
                      return (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setSelectedDocType(item.type)}
                          className={`relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 ${
                            isSelected
                              ? "border-zinc-900 bg-zinc-900 text-white shadow-lg shadow-zinc-900/10 scale-[1.01]"
                              : "border-zinc-200/80 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                isSelected ? "bg-white/10 text-amber-400" : "bg-zinc-100 text-zinc-600"
                              }`}
                            >
                              <Icon size={18} />
                            </div>
                            {isSelected && (
                              <CheckCircle2 size={16} className="text-amber-400" />
                            )}
                          </div>

                          <div className="mt-3">
                            <p className="text-xs font-bold">{item.type}</p>
                            <p
                              className={`mt-1 text-[11px] leading-relaxed ${
                                isSelected ? "text-zinc-300" : "text-zinc-500"
                              }`}
                            >
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Purpose Field */}
                <div>
                  <label htmlFor="docPurpose" className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                    2. Specific Purpose for Request <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="docPurpose"
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g., Savings Bank Account Opening (HDFC Bank), Passport Verification, NEET Registration"
                    required
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-xs font-medium text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition"
                  />
                </div>

                {/* Preferences: Delivery & Speed */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                      3. Preferred Delivery Format
                    </label>
                    <select
                      value={deliveryMode}
                      onChange={(e) => setDeliveryMode(e.target.value as any)}
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-xs font-medium text-zinc-800 focus:border-zinc-900 focus:outline-none transition"
                    >
                      <option value="Digital PDF">Digital PDF (Downloadable Online)</option>
                      <option value="Physical Copy (School Counter)">Physical Copy (School Administrative Counter)</option>
                      <option value="Both">Both (Digital PDF + Counter Pickup)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                      4. Processing Speed
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as any)}
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-xs font-medium text-zinc-800 focus:border-zinc-900 focus:outline-none transition"
                    >
                      <option value="Standard (5-7 Days)">Standard Processing (5-7 Working Days)</option>
                      <option value="Express Priority (48 Hrs)">Express Priority (48 Hours - Urgent Need)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!purpose.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-3.5 text-xs font-bold text-white shadow-lg shadow-zinc-900/10 hover:bg-zinc-800 transition disabled:opacity-50"
                  >
                    <Zap size={16} className="text-amber-400" />
                    <span>Submit Certificate Application</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Helpful Instructions & SLA info */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/50 to-orange-50/30 p-6">
              <div className="flex items-center gap-2 text-amber-800">
                <ShieldCheck size={20} className="text-amber-600" />
                <h3 className="text-sm font-bold">Important Guidelines</h3>
              </div>

              <ul className="mt-4 space-y-3 text-xs text-zinc-600">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>
                    Official certificates bear the <strong>State Board Seal & Principal Digital Signature</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>
                    Physical copies can be collected from Room 102 (School Office) between 9:00 AM and 3:30 PM on working days.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>
                    Every document features a <strong>Unique Verification Code & QR</strong> for instant online authenticity verification.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Need Special Assistance?</h3>
              <p className="text-xs text-zinc-600">
                For urgent passport verification or migration clearance, visit the Principal&apos;s office directly or contact:
              </p>
              <div className="rounded-2xl bg-zinc-50 p-3 text-xs font-medium text-zinc-800 border border-zinc-100">
                📞 School Office: +91 44 2847 9900
                <br />
                ✉️ admin@ravionschool.edu.in
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: APPLICATION TRACKER */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Track Status of Submitted Document Applications
            </p>
            <span className="text-xs text-zinc-400">{requests.length} applications</span>
          </div>

          {requests.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
              <Clock3 size={44} className="mx-auto text-zinc-300" strokeWidth={1.5} />
              <h3 className="mt-3 text-base font-semibold text-zinc-800">No application history found</h3>
              <p className="mt-1 text-xs text-zinc-500">You have not submitted any certificate requests yet.</p>
              <button
                type="button"
                onClick={() => setActiveTab("request")}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-zinc-800 transition"
              >
                <Plus size={15} />
                Apply for a Certificate
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm hover:shadow-md transition space-y-5"
                >
                  {/* Header info */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                          {req.id}
                        </span>
                        <h3 className="text-base font-bold text-zinc-900">{req.type}</h3>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">
                        Purpose: <span className="font-medium text-zinc-700">{req.purpose}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${
                          statusBadgeStyles[req.status] ?? "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        <Clock3 size={13} />
                        {req.status}
                      </span>
                      {req.status === "Ready" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDownload({
                              id: req.id,
                              title: req.type,
                              type: req.type,
                              category: "Official",
                              issuedDate: req.estimatedDate ?? "Today",
                              issuedBy: "Dr. K. Ranganathan (Principal)",
                              purpose: req.purpose,
                              certificateNo: `RHS/${req.id}/2026`,
                              verificationCode: `VER-${req.id}-99`,
                              academicYear: "2026-2027",
                              description: `Approved request for ${req.purpose}`,
                            })
                          }
                          className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
                        >
                          <Download size={14} />
                          Download Certificate
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Multi-step Timeline Stepper */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Application Progress Stepper
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                      {req.timeline.map((step, idx) => {
                        const isDone = step.status === "completed";
                        const isCurrent = step.status === "current";
                        return (
                          <div
                            key={idx}
                            className={`relative rounded-2xl border p-3 text-xs transition-all ${
                              isDone
                                ? "border-emerald-200 bg-emerald-50/40 text-emerald-900"
                                : isCurrent
                                ? "border-indigo-300 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-500/20"
                                : "border-zinc-100 bg-zinc-50/50 text-zinc-400"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-[11px]">Step {idx + 1}</span>
                              {isDone && <CheckCircle2 size={14} className="text-emerald-600" />}
                              {isCurrent && <Clock3 size={14} className="text-indigo-600 animate-spin" />}
                            </div>
                            <p className="font-semibold text-xs leading-snug">{step.title}</p>
                            {step.date && <p className="mt-1 text-[10px] opacity-75">{step.date}</p>}
                            {step.note && <p className="mt-0.5 text-[10px] font-medium opacity-90">{step.note}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {req.remarks && (
                    <div className="rounded-2xl bg-zinc-50 p-3 text-xs text-zinc-600 border border-zinc-100">
                      <span className="font-bold text-zinc-800">Latest Note: </span>
                      {req.remarks}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REALISTIC CERTIFICATE PREVIEW MODAL */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10 max-h-[90vh] flex flex-col">
            {/* Modal Header Controls */}
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 bg-zinc-900 text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-amber-400" />
                <h3 className="text-sm font-bold">Authentic Certificate Live Canvas</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(previewCert)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition"
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewCert(null)}
                  className="rounded-xl bg-white/10 p-1.5 text-zinc-300 hover:bg-white/20 transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Certificate Body Canvas */}
            <div className="overflow-y-auto p-6 sm:p-8 bg-amber-50/20">
              <div className="relative border-8 border-double border-amber-700/60 bg-white p-8 sm:p-12 shadow-inner text-center space-y-6 rounded-lg">
                {/* School Crest & Header */}
                <div className="space-y-2">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 border-2 border-amber-600 text-amber-700 font-extrabold text-xl shadow-md">
                    RHS
                  </div>
                  <h2 className="text-xl font-black tracking-widest text-zinc-900 uppercase font-serif">
                    RAVION MATRICULATION HIGHER SECONDARY SCHOOL
                  </h2>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
                    CHENNAI, TAMIL NADU · RECOGNIZED BY GOVT. OF TAMIL NADU
                  </p>
                  <div className="mx-auto h-0.5 w-32 bg-amber-600" />
                </div>

                {/* Certificate Title */}
                <div className="py-2">
                  <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold">Official Credential</span>
                  <h3 className="text-2xl font-serif font-extrabold text-zinc-900 underline decoration-amber-500 decoration-2 underline-offset-8">
                    {previewCert.title.toUpperCase()}
                  </h3>
                </div>

                {/* Main Calligraphic Text Body */}
                <div className="max-w-xl mx-auto text-sm leading-relaxed text-zinc-700 font-serif space-y-4">
                  <p>
                    This is to officially certify that <strong className="text-zinc-900 text-base">{studentName}</strong>,
                    bearing Roll Number <strong className="text-zinc-900">{rollNo}</strong>, is a bonafide student of{" "}
                    <strong className="text-zinc-900">{studentClass}</strong> at Ravion Higher Secondary School during the Academic Year{" "}
                    <strong className="text-zinc-900">{previewCert.academicYear}</strong>.
                  </p>

                  <p className="text-xs text-zinc-600 italic">
                    {previewCert.description ??
                      `This document is issued upon request for ${previewCert.purpose}. During the period of study, the student's conduct and character have been consistently EXCELLENT.`}
                  </p>
                </div>

                {/* Certificate Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-left text-xs bg-amber-50/60 p-4 rounded-xl border border-amber-200/60 max-w-lg mx-auto">
                  <div>
                    <span className="text-zinc-400 block font-sans text-[10px]">Certificate No</span>
                    <span className="font-mono font-bold text-zinc-800">{previewCert.certificateNo}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block font-sans text-[10px]">Issue Date</span>
                    <span className="font-semibold text-zinc-800">{previewCert.issuedDate}</span>
                  </div>
                </div>

                {/* Signatures & Verification QR Footer */}
                <div className="pt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-t border-amber-200/60">
                  {/* Left Signature */}
                  <div className="text-left space-y-1">
                    <div className="font-serif italic font-bold text-indigo-900 text-lg">K. Ranganathan</div>
                    <div className="h-0.5 w-28 bg-zinc-800" />
                    <p className="text-[11px] font-bold text-zinc-800">DR. K. RANGANATHAN</p>
                    <p className="text-[10px] text-zinc-500">Principal & Senior Administrator</p>
                  </div>

                  {/* Golden Wax Seal Mock */}
                  <div className="mx-auto sm:mx-0 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-serif font-black text-center text-[10px] leading-tight shadow-xl ring-4 ring-amber-200">
                    SEAL OF
                    <br />
                    AUTHENTICITY
                    <br />
                    1994
                  </div>

                  {/* Right QR Verification */}
                  <div className="text-right space-y-1">
                    <div className="inline-block p-1.5 bg-white border border-amber-300 rounded-lg shadow-sm">
                      <QrCode size={48} className="text-zinc-900" />
                    </div>
                    <p className="text-[9px] font-mono text-zinc-500">VER: {previewCert.verificationCode}</p>
                    <p className="text-[9px] text-emerald-700 font-bold">✓ Digitally Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
