import { useState, useEffect, useMemo } from "react";
import {
  Download, FileText, TrendingUp, Award, Target,
  ChevronRight, BookOpen, AlertCircle, TrendingDown,
  CheckCircle2, BookOpenCheck, Clock, CheckCircle, Lightbulb,
  X,
  History
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import {
  getAcademicMetrics,
  getAcademicInsights,
  getSubjectPerformanceList,
  getPerformanceTrends,
  getAssessmentHistory,
  type Assessment,
  type SubjectPerformance
} from "../../services/mock/academicProgress";
import { getTermReports, type TermReport } from "../../services/mock/exams";

export default function ProgressReportsPage() {
  const { selectedChild } = useAuth();
  const sid = selectedChild?.id ?? "STU001";

  // Data
  const metrics = getAcademicMetrics(sid);
  const insights = getAcademicInsights(sid);
  const subjects = getSubjectPerformanceList(sid);
  const trends = getPerformanceTrends(sid);
  const assessments = getAssessmentHistory(sid);
  const [termReports, setTermReports] = useState<TermReport[]>(() => getTermReports(sid));

  useEffect(() => {
    setTermReports(getTermReports(sid));
  }, [sid]);

  // UI State
  const [activeTab, setActiveTab] = useState<"overview" | "subjects" | "assessments" | "reports">("overview");
  
  // Subject Drawer State
  const [selectedSubject, setSelectedSubject] = useState<SubjectPerformance | null>(null);

  // Assessment Filters
  const [assessmentFilter, setAssessmentFilter] = useState<"All" | "Exam" | "Unit Test" | "Internal" | "Assignment">("All");

  const filteredAssessments = useMemo(() => {
    if (assessmentFilter === "All") return assessments;
    return assessments.filter(a => a.type === assessmentFilter);
  }, [assessments, assessmentFilter]);

  const handleDownload = () => {
    alert("Downloading Official Term Report PDF...");
  };

  const renderTrendIcon = (trend: string, size = 16) => {
    if (trend === "Improving") return <TrendingUp size={size} className="text-emerald-500" />;
    if (trend === "Declining") return <TrendingDown size={size} className="text-rose-500" />;
    return <TrendingUp size={size} className="text-amber-500" />; // Stable
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 lg:space-y-8 relative">
      
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Academic Progress</h1>
          <p className="mt-1 text-sm text-zinc-500">Track performance, monitor improvements, and view official reports.</p>
        </div>
        <div className="flex items-center gap-3">
           <select className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 outline-none focus:border-zinc-400">
             <option>2026-2027</option>
             <option>2025-2026</option>
           </select>
        </div>
      </section>

      {/* Tabs */}
      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto border-b border-zinc-200 bg-zinc-50/50 px-2 sm:px-6 hide-scrollbar">
          {[
            { key: "overview", label: "Overview" },
            { key: "subjects", label: "Subject Analysis" },
            { key: "assessments", label: "Assessment History" },
            { key: "reports", label: "Report Cards" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`relative shrink-0 px-4 py-4 text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? "text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              
              {/* Top Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Overall Score</p>
                  <p className="mt-2 text-3xl font-black text-zinc-900">{metrics.overallPercentage}%</p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
                    <TrendingUp size={12} /> +{(metrics.overallPercentage - metrics.previousTermPercentage).toFixed(1)}% vs Last Term
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Overall Grade</p>
                  <p className="mt-2 text-3xl font-black text-zinc-900">{metrics.overallGrade}</p>
                  <p className="mt-2 text-xs font-medium text-zinc-500">Maintaining Top 10%</p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Target Goal</p>
                  <p className="mt-2 text-3xl font-black text-zinc-900">{metrics.targetPercentage}%</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(metrics.overallPercentage / metrics.targetPercentage) * 100}%` }} />
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Assessments</p>
                  <p className="mt-2 text-3xl font-black text-zinc-900">{metrics.assessmentsCompleted}</p>
                  <p className="mt-2 text-xs font-medium text-zinc-500">Completed this term</p>
                </div>
              </div>

              {/* Insights & Chart Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Insights Column */}
                <div className="lg:col-span-1 space-y-4">
                  <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                    <Lightbulb size={18} className="text-amber-500" /> Performance Insights
                  </h3>
                  {insights.map(i => (
                    <div key={i.id} className="flex gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                      <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        i.type === 'Strong Performance' ? 'bg-emerald-100 text-emerald-700' :
                        i.type === 'Needs Attention' ? 'bg-rose-100 text-rose-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {i.type === 'Strong Performance' ? <Award size={12} /> :
                         i.type === 'Needs Attention' ? <AlertCircle size={12} /> :
                         <TrendingUp size={12} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-900 mb-0.5">{i.type}</p>
                        <p className="text-xs text-zinc-600 leading-relaxed">{i.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart Column */}
                <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                   <h3 className="font-bold text-zinc-900 mb-4">Overall Performance Trend</h3>
                   <div className="h-[250px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={trends} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                         <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} domain={[50, 100]} />
                         <Tooltip 
                           contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                           itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                           labelStyle={{ fontSize: '12px', color: '#71717a', marginBottom: '4px' }}
                         />
                         <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                         <Line type="monotone" name="Your Performance" dataKey="overall" stroke="#18181b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                         <Line type="monotone" name="Class Average" dataKey="classAverage" stroke="#a1a1aa" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                       </LineChart>
                     </ResponsiveContainer>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUBJECT ANALYSIS */}
          {activeTab === "subjects" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map(s => {
                const diff = s.percentage - s.previousPercentage;
                const isPositive = diff >= 0;
                return (
                  <button
                    key={s.subject}
                    onClick={() => setSelectedSubject(s)}
                    className="group flex flex-col text-left rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-900 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between w-full mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                          <BookOpen size={18} />
                        </div>
                        <h3 className="font-bold text-zinc-900">{s.subject}</h3>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xl font-black text-zinc-900">{s.percentage}%</span>
                        <span className="text-[10px] font-bold text-zinc-400">Grade {s.grade}</span>
                      </div>
                    </div>
                    <div className="w-full flex items-center justify-between mt-auto pt-4 border-t border-zinc-100">
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        {renderTrendIcon(s.trend)}
                        <span className={isPositive ? "text-emerald-700" : "text-rose-700"}>
                          {isPositive ? "+" : ""}{diff}% vs Last
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-zinc-400 group-hover:text-zinc-900" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 3: ASSESSMENT HISTORY */}
          {activeTab === "assessments" && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["All", "Exam", "Unit Test", "Internal", "Assignment"].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setAssessmentFilter(filter as any)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                      assessmentFilter === filter 
                        ? "bg-zinc-900 text-white" 
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Table / List */}
              {filteredAssessments.length === 0 ? (
                <div className="py-12 text-center">
                  <History size={32} className="mx-auto text-zinc-300 mb-3" />
                  <p className="text-sm font-bold text-zinc-900">No assessments found</p>
                  <p className="text-xs text-zinc-500 mt-1">Try changing your filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-400">
                        <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Assessment</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Subject</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Date</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-[10px] text-right">Score</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-[10px] text-center">Grade</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-[10px] text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredAssessments.map(a => (
                        <tr key={a.id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="py-4">
                            <p className="font-bold text-zinc-900">{a.name}</p>
                            <p className="text-[10px] font-medium text-zinc-500 uppercase">{a.type}</p>
                          </td>
                          <td className="py-4 font-medium text-zinc-700">{a.subject}</td>
                          <td className="py-4 text-zinc-500">{a.date}</td>
                          <td className="py-4 text-right">
                            {a.status === "Completed" ? (
                              <>
                                <span className="font-bold text-zinc-900">{a.percentage}%</span>
                                <p className="text-[10px] text-zinc-400">{a.marksObtained}/{a.totalMarks}</p>
                              </>
                            ) : (
                              <span className="text-zinc-400">-</span>
                            )}
                          </td>
                          <td className="py-4 text-center">
                            {a.status === "Completed" ? (
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-900">
                                {a.grade}
                              </span>
                            ) : (
                              <span className="text-zinc-400">-</span>
                            )}
                          </td>
                          <td className="py-4 text-right">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                              a.status === "Completed" ? "bg-emerald-50 text-emerald-700" :
                              a.status === "Upcoming" ? "bg-blue-50 text-blue-700" :
                              "bg-rose-50 text-rose-700"
                            }`}>
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REPORT CARDS */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              {termReports.map((term) => (
                <div key={term.term} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <div>
                      <h2 className="text-base font-bold text-zinc-900">{term.term} Report Card</h2>
                      <p className="text-sm text-zinc-500 mt-1">Academic Year {term.year}</p>
                    </div>
                    {term.reportPublished ? (
                      <button onClick={handleDownload} className="mt-4 sm:mt-0 flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800">
                        <Download size={16} />
                        Download PDF
                      </button>
                    ) : (
                      <span className="mt-4 sm:mt-0 inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-500 uppercase tracking-widest w-fit">
                        Not Published
                      </span>
                    )}
                  </div>
                  
                  {term.reportPublished && (
                    <div className="p-5">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="rounded-lg bg-zinc-50 p-4 border border-zinc-100 text-center">
                          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Overall</p>
                          <p className="mt-1 text-xl font-black text-zinc-900">{term.overallPercentage}%</p>
                        </div>
                        <div className="rounded-lg bg-zinc-50 p-4 border border-zinc-100 text-center">
                          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Grade</p>
                          <p className="mt-1 text-xl font-black text-zinc-900">{term.overallGrade}</p>
                        </div>
                        <div className="rounded-lg bg-zinc-50 p-4 border border-zinc-100 text-center">
                          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Class Rank</p>
                          <p className="mt-1 text-xl font-black text-zinc-900">{term.rank}<span className="text-xs text-zinc-400">/{term.totalStudents}</span></p>
                        </div>
                        <div className="rounded-lg bg-zinc-50 p-4 border border-zinc-100 text-center">
                          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Class Avg</p>
                          <p className="mt-1 text-xl font-black text-zinc-900">{term.classAverage}%</p>
                        </div>
                      </div>

                      <div className="rounded-lg border border-zinc-200 overflow-hidden">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-zinc-50">
                            <tr className="border-b border-zinc-200">
                              <th className="px-4 py-3 font-bold text-zinc-900 text-xs uppercase tracking-wider">Subject</th>
                              <th className="px-4 py-3 font-bold text-zinc-900 text-xs uppercase tracking-wider text-center">Marks</th>
                              <th className="px-4 py-3 font-bold text-zinc-900 text-xs uppercase tracking-wider text-center">Grade</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100">
                            {term.subjects.map((r, i) => (
                              <tr key={i}>
                                <td className="px-4 py-3 font-semibold text-zinc-700">{r.subject}</td>
                                <td className="px-4 py-3 text-center text-zinc-600">{r.marksObtained}/{r.totalMarks}</td>
                                <td className="px-4 py-3 text-center font-bold text-zinc-900">{r.grade}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-6 rounded-xl bg-blue-50/50 border border-blue-100 p-4">
                        <p className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-2">Class Teacher's Remark</p>
                        <p className="text-sm text-blue-900 leading-relaxed">{term.teacherRemark}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* SUBJECT DRAWER / MODAL */}
      {selectedSubject && (
        <div className="fixed inset-0 z-50 flex justify-end bg-zinc-900/40 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
             
             {/* Drawer Header */}
             <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-zinc-50/50">
               <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-white">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h2 className="font-bold text-zinc-900">{selectedSubject.subject}</h2>
                    <p className="text-xs text-zinc-500 font-medium">Performance Detail</p>
                  </div>
               </div>
               <button 
                 onClick={() => setSelectedSubject(null)}
                 className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
               >
                 <X size={20} />
               </button>
             </div>

             {/* Drawer Scrollable Content */}
             <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Metric Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-4 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Current Score</p>
                    <p className="mt-1 text-2xl font-black text-zinc-900">{selectedSubject.percentage}%</p>
                  </div>
                  <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-4 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Grade</p>
                    <p className="mt-1 text-2xl font-black text-zinc-900">{selectedSubject.grade}</p>
                  </div>
                </div>

                {/* Subject Trend Chart */}
                <div>
                  <h3 className="font-bold text-zinc-900 mb-4">Historical Trend</h3>
                  <div className="h-[200px] w-full rounded-xl border border-zinc-100 bg-white p-3">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={trends} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} />
                         <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} domain={[0, 100]} />
                         <Tooltip 
                           cursor={{ fill: '#f4f4f5' }}
                           contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                         />
                         <Bar dataKey={selectedSubject.subject} fill="#18181b" radius={[4, 4, 0, 0]} />
                       </BarChart>
                     </ResponsiveContainer>
                  </div>
                </div>

                {/* Assessment History for this subject */}
                <div>
                  <h3 className="font-bold text-zinc-900 mb-4">Recent Assessments</h3>
                  <div className="space-y-3">
                    {assessments.filter(a => a.subject === selectedSubject.subject).map(a => (
                      <div key={a.id} className="flex items-center justify-between rounded-xl border border-zinc-100 bg-white p-3">
                         <div>
                           <p className="font-bold text-zinc-900 text-sm">{a.name}</p>
                           <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">{a.date}</p>
                         </div>
                         <div className="text-right">
                           <p className="font-bold text-zinc-900">{a.status === "Completed" ? `${a.percentage}%` : "-"}</p>
                           <p className="text-[10px] font-bold text-zinc-400">{a.status === "Completed" ? a.grade : a.status}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

             </div>
          </div>
        </div>
      )}

    </div>
  );
}
