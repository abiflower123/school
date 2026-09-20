import { useState } from "react";
import {
  FileText,
  CalendarDays,
  Clock3,
  MapPin,
  X,
  BookOpen,
  Info,
  Download,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getUpcomingExams,
  type Exam,
} from "../../services/mock/exams";

export default function ExamsPage() {
  const { selectedChild } = useAuth();
  const sid = selectedChild?.id ?? "STU001";

  const upcoming = getUpcomingExams(sid);
  const [detailExam, setDetailExam] = useState<Exam | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadHallTicket = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert("Hall Ticket PDF downloaded successfully! Please print it for your exams.");
    }, 1500);
  };

  const rules = [
    "Students must carry their physical Hall Ticket and School ID to the examination hall.",
    "Arrive at least 15 minutes prior to the commencement of the exam.",
    "No electronic devices (smartwatches, mobile phones) are allowed inside.",
    "Borrowing of stationery is strictly prohibited during the examination.",
    "Students arriving more than 30 minutes late will not be permitted to write the exam."
  ];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 lg:space-y-8 relative">
      
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Exam Schedule</h1>
          <p className="mt-1 text-sm text-zinc-500">
            View your upcoming timetables, syllabus, and download hall tickets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadHallTicket}
            disabled={isDownloading}
            className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 shadow-sm disabled:opacity-50"
          >
            <Download size={16} />
            {isDownloading ? "Generating..." : "Download Hall Ticket"}
          </button>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Column: Upcoming Exams Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <CalendarDays size={20} className="text-zinc-400" /> Upcoming Examinations
          </h2>
          
          {upcoming.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-200 py-16 text-center bg-white">
              <CheckCircle2 size={36} className="mx-auto text-emerald-400 mb-3" />
              <p className="text-sm font-bold text-zinc-900">No Upcoming Exams</p>
              <p className="text-xs text-zinc-500 mt-1">You are all caught up for now!</p>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
              <div className="bg-zinc-50/50 border-b border-zinc-100 px-5 py-3">
                 <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Term 1 Schedule</span>
              </div>
              <div className="divide-y divide-zinc-100">
                {upcoming.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => setDetailExam(exam)}
                    className="flex w-full flex-col gap-4 px-5 py-5 text-left transition hover:bg-zinc-50 sm:flex-row sm:items-center group"
                  >
                    {/* Date Block */}
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 group-hover:border-zinc-300 group-hover:bg-zinc-200 transition-colors">
                      <p className="text-xl font-black text-zinc-900 leading-none">{exam.date.split(" ")[0]}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">{exam.date.split(" ")[1]}</p>
                    </div>
                    
                    {/* Details Block */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-base font-bold text-zinc-900">{exam.title}</p>
                        <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-700">
                          {exam.subject}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500">
                        <span className="flex items-center gap-1.5"><Clock3 size={14} className="text-zinc-400" /> {exam.time}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-zinc-400" /> {exam.room}</span>
                      </div>
                    </div>
                    
                    {/* View Details Action */}
                    <div className="shrink-0 hidden sm:flex items-center text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Syllabus <span className="ml-1">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Guidelines */}
        <div className="space-y-4">
           <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
             <Info size={20} className="text-zinc-400" /> Exam Guidelines
           </h2>
           <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
             <div className="flex items-start gap-3 mb-4">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-amber-900">Mandatory Instructions</p>
             </div>
             <ul className="space-y-3">
               {rules.map((rule, idx) => (
                 <li key={idx} className="text-xs text-amber-800 leading-relaxed flex items-start gap-2">
                   <span className="font-bold text-amber-900/50">{idx + 1}.</span>
                   {rule}
                 </li>
               ))}
             </ul>
           </div>
        </div>
      </div>

      {/* SYLLABUS & DETAILS DRAWER */}
      {detailExam && (
        <div className="fixed inset-0 z-50 flex justify-end bg-zinc-900/40 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
             
             {/* Drawer Header */}
             <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-zinc-50/50">
               <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-white">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h2 className="font-bold text-zinc-900">{detailExam.subject}</h2>
                    <p className="text-xs text-zinc-500 font-medium">{detailExam.title}</p>
                  </div>
               </div>
               <button 
                 onClick={() => setDetailExam(null)}
                 className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
               >
                 <X size={20} />
               </button>
             </div>

             {/* Drawer Scrollable Content */}
             <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Exam Metadata Grid */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Date</p>
                      <p className="text-sm font-semibold text-zinc-900">{detailExam.date}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{detailExam.day}</p>
                   </div>
                   <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Time & Duration</p>
                      <p className="text-sm font-semibold text-zinc-900">{detailExam.time}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{detailExam.duration}</p>
                   </div>
                   <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-4 col-span-2 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Location</p>
                        <p className="text-sm font-semibold text-zinc-900">{detailExam.room}</p>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <MapPin size={16} />
                      </div>
                   </div>
                </div>

                {/* Syllabus Block */}
                <div>
                   <h3 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">
                     <FileText size={16} className="text-zinc-400" /> Exam Syllabus
                   </h3>
                   <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                      <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-line">
                        {detailExam.syllabus}
                      </p>
                   </div>
                </div>

                {/* Study Checklist Mock */}
                <div>
                   <h3 className="font-bold text-zinc-900 mb-3">Preparation Checklist</h3>
                   <div className="space-y-2">
                      {detailExam.syllabus.split(';').map((item, idx) => (
                        <label key={idx} className="flex items-start gap-3 rounded-lg border border-zinc-100 p-3 hover:bg-zinc-50 cursor-pointer">
                           <input type="checkbox" className="mt-1 accent-zinc-900 w-4 h-4 rounded border-zinc-300" />
                           <span className="text-sm text-zinc-700 leading-snug">{item.trim()}</span>
                        </label>
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