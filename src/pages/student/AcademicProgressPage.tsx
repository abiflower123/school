import { useEffect, useState } from "react";
import { TrendingUp, BookOpen, BarChart2, Target } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useAuth } from "../../context/AuthContext";
import { getProgress, type SubjectProgress } from "../../services/mock/progress";

export default function AcademicProgressPage() {
  const { selectedChild } = useAuth();
  const sid = selectedChild?.id ?? "STU001";

  const [progressList, setProgressList] = useState<SubjectProgress[]>(() => getProgress(sid));
  const [selectedSubject, setSelectedSubject] = useState<SubjectProgress | null>(null);

  useEffect(() => {
    const list = getProgress(sid);
    setProgressList(list);
    setSelectedSubject(null);
  }, [sid]);

  const totalCompleted = progressList.reduce((acc, p) => acc + p.completedTopics, 0);
  const totalTopics = progressList.reduce((acc, p) => acc + p.totalTopics, 0);
  const overallPercentage = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Academic Progress</h1>
        <p className="mt-1 text-sm text-zinc-500">Track syllabus completion and topic-wise progress.</p>
      </section>

      {/* Analytics Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">Subject Mastery Radar</p>
              <p className="text-xs text-zinc-500">Overall completion: {overallPercentage}%</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={progressList}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar
                  name="Mastery"
                  dataKey="percentage"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.4}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <BarChart2 size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">Topics Completion</p>
              <p className="text-xs text-zinc-500">Completed vs Total topics</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressList} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="completedTopics" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="totalTopics" name="Total" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject List */}
        <section className="lg:col-span-2 space-y-4">
          {progressList.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject)}
              className={`w-full text-left rounded-xl border transition-all p-5 ${
                selectedSubject?.id === subject.id 
                  ? "border-zinc-400 shadow-sm bg-white" 
                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-50 text-zinc-600 border border-zinc-100">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900">{subject.subject}</h3>
                    <p className="mt-0.5 text-xs text-zinc-500">Teacher: {subject.teacherName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-zinc-900">{subject.percentage}%</span>
                  <p className="mt-0.5 text-[10px] text-zinc-400">{subject.completedTopics}/{subject.totalTopics}</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${subject.percentage >= 75 ? "bg-emerald-500" : subject.percentage >= 50 ? "bg-blue-500" : "bg-amber-500"}`}
                  style={{ width: `${subject.percentage}%` }}
                />
              </div>
            </button>
          ))}
        </section>

        {/* Topic Details */}
        <section className="lg:col-span-1">
          {selectedSubject ? (
            <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden sticky top-6">
              <div className="border-b border-zinc-100 p-5 bg-zinc-50/50">
                <h3 className="font-semibold text-zinc-900">{selectedSubject.subject}</h3>
                <p className="text-xs text-zinc-500 mt-1">Teacher: {selectedSubject.teacherName}</p>
              </div>
              <div className="border-b border-zinc-100 p-5 space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Syllabus</p>
                  <p className="mt-1 text-sm text-zinc-600 leading-relaxed">{selectedSubject.syllabus}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Learning Objectives</p>
                  <ul className="mt-1.5 space-y-1.5">
                    {selectedSubject.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                        <Target size={13} className="mt-0.5 shrink-0 text-zinc-400" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="border-b border-zinc-100 px-5 py-3 bg-zinc-50/50">
                <p className="text-xs font-semibold text-zinc-500">Topic-wise completion</p>
              </div>
              <div className="divide-y divide-zinc-100 max-h-[400px] overflow-y-auto">
                {selectedSubject.topics.map((topic, i) => (
                  <div key={i} className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                        topic.status === "Completed" ? "bg-emerald-500" : 
                        topic.status === "In Progress" ? "bg-amber-500" : "bg-zinc-200"
                      }`} />
                      <p className={`text-sm truncate ${topic.status === "Completed" ? "text-zinc-900 font-medium" : "text-zinc-600"}`}>
                        {topic.name}
                      </p>
                    </div>
                    <span className="text-[10px] font-medium text-zinc-400 shrink-0">
                      {topic.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center sticky top-6">
              <BarChart2 size={32} className="mx-auto text-zinc-300 mb-3" />
              <p className="text-sm font-medium text-zinc-600">Select a subject</p>
              <p className="text-xs text-zinc-400 mt-1">Click on a subject to view topic-wise details.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}