import React, { useState, useMemo } from "react";
import {
  Award,
  CalendarClock,
  CheckCircle2,
  Clock3,
  X,
  Building2,
  Sparkles,
  Zap,
  ArrowRight,
  FileText,
  Search,
  AlertCircle,
  IndianRupee,
  Users,
  BadgeCheck,
  Calculator,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getAvailableScholarships,
  getScholarshipApplications,
  applyForScholarship,
  type Scholarship,
  type ScholarshipApplication,
  type ScholarshipCategory,
} from "../../services/mock/scholarships";
import { StatusBadge, type StatusVariant } from "../../components/ui/StatusBadge";
import { AttachmentList } from "../../components/ui/AttachmentList";

const categoryIcons: Record<ScholarshipCategory, any> = {
  Government: Building2,
  "Institutional Merit": Award,
  "Sports Excellence": Zap,
  "Family & Welfare": Users,
};

const STATUS_VARIANT: Record<ScholarshipApplication["status"], StatusVariant> = {
  Approved: "success",
  Disbursed: "success",
  "Under Review": "warning",
  Submitted: "info",
  Rejected: "danger",
  "Not Applied": "neutral",
};

export default function ScholarshipPage() {
  const { selectedChild } = useAuth();
  const studentId = selectedChild?.id ?? "STU001";
  const studentName = selectedChild?.name ?? "Kavya Ranganathan";
  const studentClass = selectedChild ? `Class ${selectedChild.class}-${selectedChild.section}` : "Class X-A";
  const rollNo = selectedChild?.rollNumber ?? "2026-X-042";

  const scholarships = useMemo(() => getAvailableScholarships(), []);
  const [applications, setApplications] = useState<ScholarshipApplication[]>(() =>
    getScholarshipApplications(studentId)
  );

  const [activeTab, setActiveTab] = useState<"available" | "history" | "estimator">("available");
  const [selectedCategory, setSelectedCategory] = useState<"All" | ScholarshipCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Application Modal / Drawer State
  const [applyingScheme, setApplyingScheme] = useState<Scholarship | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File | null>>({});
  const [reasonNotes, setReasonNotes] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estimator Calculator Tool State
  const [estPercentage, setEstPercentage] = useState<number>(92);
  const [estAttendance, setEstAttendance] = useState<number>(91);
  const [estHasSports, setEstHasSports] = useState<boolean>(false);
  const [estHasSibling, setEstHasSibling] = useState<boolean>(true);

  const appliedIds = useMemo(() => new Set(applications.map((a) => a.scholarshipId)), [applications]);

  // Total Approved Financial Aid Value
  const totalApprovedAid = useMemo(() => {
    return applications
      .filter((a) => a.status === "Approved" || a.status === "Disbursed")
      .reduce((acc, a) => {
        if (a.amountGranted.includes("10,000")) return acc + 10000;
        if (a.amountGranted.includes("15,000")) return acc + 15000;
        if (a.amountGranted.includes("7,500")) return acc + 7500;
        if (a.amountGranted.includes("8,000")) return acc + 8000;
        return acc + 5000;
      }, 0);
  }, [applications]);

  // Filter Schemes
  const filteredSchemes = useMemo(() => {
    return scholarships.filter((s) => {
      const matchesCat = selectedCategory === "All" || s.category === selectedCategory;
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [scholarships, selectedCategory, searchQuery]);

  // Filter Qualified Schemes in Estimator
  const estimatedQualifiedSchemes = useMemo(() => {
    return scholarships.filter((s) => {
      if (s.id === "SCH1" && estPercentage >= 85 && estAttendance >= 80) return true;
      if (s.id === "SCH2" && estPercentage >= 90) return true;
      if (s.id === "SCH3" && estAttendance >= 75) return true;
      if (s.id === "SCH4" && estHasSibling) return true;
      if (s.id === "SCH5" && estHasSports) return true;
      return false;
    });
  }, [scholarships, estPercentage, estAttendance, estHasSports, estHasSibling]);

  const handleOpenApplyModal = (scheme: Scholarship) => {
    setApplyingScheme(scheme);
    setUploadedDocs({});
    setReasonNotes("");
  };

  const handleFileSelect = (docName: string, file: File | null) => {
    setUploadedDocs((prev) => ({ ...prev, [docName]: file }));
  };

  const allDocsUploaded =
    !!applyingScheme && applyingScheme.requiredDocs.every((doc) => !!uploadedDocs[doc]);

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingScheme || !allDocsUploaded) return;

    const attachments = applyingScheme.requiredDocs.map((doc) => {
      const file = uploadedDocs[doc]!;
      return {
        name: file.name,
        type: file.type.includes("pdf") ? ("PDF" as const) : file.type.startsWith("image") ? ("Image" as const) : ("Document" as const),
        size: `${(file.size / 1024).toFixed(0)} KB`,
      };
    });

    const updated = applyForScholarship(studentId, applications, applyingScheme, attachments, reasonNotes);
    setApplications(updated);
    setApplyingScheme(null);
    setToastMessage(`Application for "${applyingScheme.name}" submitted successfully! Ref: ${updated[0].id}`);
    setTimeout(() => setToastMessage(null), 4000);
    setActiveTab("history");
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-zinc-900 px-5 py-3.5 text-sm font-medium text-white shadow-2xl ring-1 ring-white/20 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 size={18} />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-zinc-900 via-indigo-950 to-zinc-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md">
              <Sparkles size={14} className="text-emerald-400" />
              <span>Financial Aid & Merit Concession Portal</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl text-white">
              Scholarships & Grants Hub
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-zinc-300">
              Access Tamil Nadu Government education schemes, institutional merit grants, and family fee waivers to support your academic journey.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md text-center">
              <p className="text-xs text-zinc-400 font-medium">Approved Aid Received</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400">₹{totalApprovedAid.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md text-center">
              <p className="text-xs text-zinc-400 font-medium">Active Schemes</p>
              <p className="mt-1 text-2xl font-bold text-white">{scholarships.length}</p>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md text-center">
              <p className="text-xs text-zinc-400 font-medium">Applied Grants</p>
              <p className="mt-1 text-2xl font-bold text-amber-400">{applications.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200/80 pb-3">
        <div className="flex overflow-x-auto gap-2 no-scrollbar">
          {[
            { key: "available", label: "Explore Grants & Schemes", icon: Award, count: scholarships.length },
            { key: "history", label: "My Applications & Ledger", icon: Clock3, count: applications.length },
            { key: "estimator", label: "Eligibility Checker", icon: Calculator },
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

        {/* Search Bar when on Explore Grants tab */}
        {activeTab === "available" && (
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheme name..."
              className="w-full rounded-2xl border border-zinc-200/80 bg-white pl-10 pr-4 py-2 text-xs font-medium text-zinc-700 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition"
            />
          </div>
        )}
      </div>

      {/* TAB CONTENT 1: EXPLORE SCHEMES & GRANTS */}
      {activeTab === "available" && (
        <div className="space-y-5">
          {/* Category Filter Pills */}
          <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
            {(["All", "Government", "Institutional Merit", "Sports Excellence", "Family & Welfare"] as const).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200 ring-1 ring-indigo-500/20"
                      : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/60"
                  }`}
                >
                  {cat === "All" ? "All Categories" : cat}
                </button>
              )
            )}
          </div>

          {/* Scheme Cards Grid */}
          {filteredSchemes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
              <Award size={44} className="mx-auto text-zinc-300" strokeWidth={1.5} />
              <h3 className="mt-3 text-base font-semibold text-zinc-800">No schemes found</h3>
              <p className="mt-1 text-xs text-zinc-500">Try broadening your search query or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {filteredSchemes.map((scheme) => {
                const isApplied = appliedIds.has(scheme.id);
                const CatIcon = categoryIcons[scheme.category] ?? Award;
                const existingApp = applications.find((a) => a.scholarshipId === scheme.id);

                return (
                  <div
                    key={scheme.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    {/* Top Header Badge */}
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:scale-105 transition">
                            <CatIcon size={22} />
                          </div>
                          <div>
                            <span className="inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200/60 mb-1">
                              {scheme.badgeTag}
                            </span>
                            <h3 className="text-base font-bold text-zinc-900 group-hover:text-indigo-600 transition">
                              {scheme.name}
                            </h3>
                            <p className="text-xs font-medium text-zinc-400">{scheme.provider}</p>
                          </div>
                        </div>

                        <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-right border border-emerald-100">
                          <span className="text-[10px] text-emerald-600 font-semibold block">Grant Value</span>
                          <span className="text-sm font-extrabold text-emerald-700">{scheme.amount}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-zinc-400">
                        Posted by {scheme.publishedBy} · {scheme.postedDate}
                      </p>

                      {scheme.recommendedBy && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 border border-blue-200/60">
                          <Sparkles size={11} />
                          Recommended by {scheme.recommendedBy}
                        </span>
                      )}

                      <p className="text-xs text-zinc-600 leading-relaxed">{scheme.description}</p>

                      {/* Eligibility Criteria Checklist */}
                      <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block">
                          Eligibility Criteria
                        </span>
                        <ul className="space-y-1.5 text-xs text-zinc-600">
                          {scheme.eligibilityCriteria.map((crit, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                              <span>{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-5 border-t border-zinc-100 pt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
                        <CalendarClock size={14} className="text-amber-500" />
                        <span>Deadline: {scheme.deadline}</span>
                      </div>

                      {isApplied ? (
                        <div className="flex items-center gap-2">
                          <StatusBadge
                            label={existingApp?.status ?? "Applied"}
                            variant={existingApp ? STATUS_VARIANT[existingApp.status] : "info"}
                            icon={<BadgeCheck size={12} />}
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenApplyModal(scheme)}
                          className="inline-flex items-center gap-1.5 rounded-2xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-zinc-900/10 hover:bg-zinc-800 transition"
                        >
                          <span>Apply For Grant</span>
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: APPLICATION TRACKER & LEDGER */}
      {activeTab === "history" && (
        <div className="space-y-6">
          {/* Approved Benefits Ledger Overview */}
          <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 p-6 shadow-sm space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <IndianRupee size={20} className="text-emerald-600" />
                <h3 className="text-base font-bold text-zinc-900">Scholarship Disbursement Ledger Summary</h3>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                Direct Ledger Adjustment Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
              <div className="rounded-2xl bg-white p-4 border border-emerald-100 shadow-2xs">
                <span className="text-zinc-400 block">Term 2 Original Tuition Fee</span>
                <span className="text-lg font-bold text-zinc-800">₹25,000</span>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-emerald-100 shadow-2xs">
                <span className="text-emerald-600 block font-semibold">Total Concession Rebate</span>
                <span className="text-lg font-bold text-emerald-600">-₹{totalApprovedAid.toLocaleString()}</span>
              </div>
              <div className="rounded-2xl bg-zinc-900 p-4 text-white shadow-sm">
                <span className="text-zinc-400 block">Net Fee Payable Now</span>
                <span className="text-lg font-bold text-amber-400">
                  ₹{Math.max(0, 25000 - totalApprovedAid).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Applications Timeline List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Submitted Applications & Approval Progress
              </p>
              <span className="text-xs text-zinc-400">{applications.length} items logged</span>
            </div>

            {applications.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
                <Clock3 size={44} className="mx-auto text-zinc-300" strokeWidth={1.5} />
                <h3 className="mt-3 text-base font-semibold text-zinc-800">No applications logged</h3>
                <p className="mt-1 text-xs text-zinc-500">Explore available government and school schemes to apply.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("available")}
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-zinc-800 transition"
                >
                  <Award size={15} />
                  Explore Schemes
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm hover:shadow-md transition space-y-5"
                  >
                    {/* Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                            {app.id}
                          </span>
                          <h3 className="text-base font-bold text-zinc-900">{app.scholarshipName}</h3>
                        </div>
                        <p className="mt-1 text-xs text-zinc-500">
                          Applied Date: <span className="font-semibold text-zinc-700">{app.appliedDate}</span> · Category:{" "}
                          <span className="font-semibold text-zinc-700">{app.category}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-400 block">Sanctioned Value</span>
                          <span className="text-sm font-bold text-emerald-600">{app.amountGranted}</span>
                        </div>
                        <StatusBadge label={app.status} variant={STATUS_VARIANT[app.status]} icon={<BadgeCheck size={12} />} />
                      </div>
                    </div>

                    {/* Progress Timeline Stepper */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Sanction Workflow Stepper
                      </p>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                        {app.timeline.map((step, idx) => {
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
                              <div className="flex items-center justify-between mb-1">
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

                    {app.remarks && (
                      <div className="rounded-2xl bg-zinc-50 p-3 text-xs text-zinc-600 border border-zinc-100">
                        <span className="font-bold text-zinc-800">Admin Remarks: </span>
                        {app.remarks}
                      </div>
                    )}

                    {app.documentsSubmitted.length > 0 && (
                      <div>
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                          Documents Submitted
                        </p>
                        <AttachmentList attachments={app.documentsSubmitted} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: ELIGIBILITY CHECKER ESTIMATOR TOOL */}
      {activeTab === "estimator" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Estimator Controls */}
          <div className="lg:col-span-1 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Calculator size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900">Eligibility Estimator</h2>
                <p className="text-xs text-zinc-500">Calculate qualified schemes instantly</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-zinc-700">Term 1 Exam Score (%)</label>
                  <span className="font-bold text-indigo-600 text-sm">{estPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={estPercentage}
                  onChange={(e) => setEstPercentage(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-zinc-700">Attendance Rate (%)</label>
                  <span className="font-bold text-indigo-600 text-sm">{estAttendance}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="100"
                  value={estAttendance}
                  onChange={(e) => setEstAttendance(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="pt-2 space-y-3 border-t border-zinc-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={estHasSibling}
                    onChange={(e) => setEstHasSibling(e.target.checked)}
                    className="h-4 w-4 rounded-md text-indigo-600 accent-indigo-600"
                  />
                  <span className="font-semibold text-zinc-700">Has Sibling Enrolled in Ravion</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={estHasSports}
                    onChange={(e) => setEstHasSports(e.target.checked)}
                    className="h-4 w-4 rounded-md text-indigo-600 accent-indigo-600"
                  />
                  <span className="font-semibold text-zinc-700">District/State Sports Representative</span>
                </label>
              </div>
            </div>
          </div>

          {/* Qualified Schemes Output */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Matching Schemes based on Student Profile
              </p>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {estimatedQualifiedSchemes.length} Schemes Qualified
              </span>
            </div>

            {estimatedQualifiedSchemes.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center">
                <AlertCircle size={36} className="mx-auto text-amber-500" />
                <h3 className="mt-2 text-sm font-bold text-zinc-800">No matching schemes for current parameters</h3>
                <p className="mt-1 text-xs text-zinc-500">Adjust the exam score slider or check sibling options above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {estimatedQualifiedSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-emerald-200/80 bg-white p-5 shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          QUALIFIED ✓
                        </span>
                        <span className="text-xs text-zinc-400 font-medium">{scheme.badgeTag}</span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900">{scheme.name}</h4>
                      <p className="text-xs text-emerald-700 font-semibold">Grant Value: {scheme.amount}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenApplyModal(scheme)}
                      className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition"
                    >
                      <span>Apply Now</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* APPLICATION DRAWER MODAL */}
      {applyingScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 bg-zinc-900 text-white">
              <div className="flex items-center gap-2">
                <Award size={20} className="text-amber-400" />
                <h3 className="text-sm font-bold">Scholarship Application Form</h3>
              </div>
              <button
                type="button"
                onClick={() => setApplyingScheme(null)}
                className="rounded-xl bg-white/10 p-1.5 text-zinc-300 hover:bg-white/20 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="overflow-y-auto p-6 space-y-5">
              {/* Scheme Summary Header */}
              <div className="rounded-2xl bg-indigo-50/60 p-4 border border-indigo-100 space-y-1">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                  Applying for
                </span>
                <h4 className="text-base font-bold text-zinc-900">{applyingScheme.name}</h4>
                <p className="text-xs text-zinc-600">{applyingScheme.provider}</p>
                <div className="pt-2 text-xs font-extrabold text-emerald-700">
                  Grant Benefit: {applyingScheme.amount} ({applyingScheme.disbursementType})
                </div>
              </div>

              {/* Student Record Verification */}
              <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100 space-y-2 text-xs">
                <span className="font-bold text-zinc-700 block">Verified Student Credentials</span>
                <div className="grid grid-cols-2 gap-2 text-zinc-600">
                  <div>
                    <span>Student Name: </span>
                    <strong className="text-zinc-800">{studentName}</strong>
                  </div>
                  <div>
                    <span>Class & Section: </span>
                    <strong className="text-zinc-800">{studentClass}</strong>
                  </div>
                  <div>
                    <span>Roll Number: </span>
                    <strong className="text-zinc-800">{rollNo}</strong>
                  </div>
                  <div>
                    <span>Term 1 Aggregate: </span>
                    <strong className="text-emerald-700">94.2% (Qualified)</strong>
                  </div>
                </div>
              </div>

              {/* Document Proof Uploads */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">
                  Attach Required Documents
                </label>
                <div className="space-y-2">
                  {applyingScheme.requiredDocs.map((docName) => {
                    const file = uploadedDocs[docName];
                    return (
                      <label
                        key={docName}
                        className={`flex items-center justify-between gap-3 rounded-2xl border p-3 text-xs font-medium cursor-pointer transition ${
                          file
                            ? "border-emerald-300 bg-emerald-50/50 text-emerald-900"
                            : "border-dashed border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <FileText size={16} className={file ? "text-emerald-600" : "text-zinc-400"} />
                          <div className="min-w-0">
                            <p>{docName}</p>
                            {file && <p className="truncate text-[10px] font-normal text-emerald-700">{file.name}</p>}
                          </div>
                        </div>
                        <span className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                          file ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                        }`}>
                          {file ? "Uploaded" : "Choose File"}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileSelect(docName, e.target.files?.[0] ?? null)}
                        />
                      </label>
                    );
                  })}
                </div>
                {!allDocsUploaded && (
                  <p className="text-[11px] text-zinc-400">All required documents must be attached before submitting.</p>
                )}
              </div>

              {/* Statement of Purpose */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                  Statement of Purpose / Additional Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={reasonNotes}
                  onChange={(e) => setReasonNotes(e.target.value)}
                  placeholder="Mention academic achievements, income details, or special requests..."
                  className="w-full rounded-2xl border border-zinc-200 bg-white p-3 text-xs font-medium text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none transition"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setApplyingScheme(null)}
                  className="flex-1 rounded-2xl border border-zinc-200 bg-white py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!allDocsUploaded}
                  className="flex-1 rounded-2xl bg-zinc-900 py-3 text-xs font-bold text-white shadow-lg shadow-zinc-900/10 hover:bg-zinc-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
