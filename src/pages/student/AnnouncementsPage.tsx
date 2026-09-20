import { useState } from "react";
import { Calendar, AlertTriangle, ArrowLeft } from "lucide-react";
import { getAnnouncements, type Announcement, type AnnouncementCategory } from "../../services/mock/announcements";

const categoryColors: Record<AnnouncementCategory, string> = {
  Academic: "bg-blue-50 text-blue-700",
  Event: "bg-violet-50 text-violet-700",
  Finance: "bg-amber-50 text-amber-700",
  Holiday: "bg-emerald-50 text-emerald-700",
  Sports: "bg-rose-50 text-rose-700",
  General: "bg-zinc-100 text-zinc-700",
  Exam: "bg-cyan-50 text-cyan-700",
};

export default function AnnouncementsPage() {
  const [announcements] = useState(() => getAnnouncements());
  const [activeAnn, setActiveAnn] = useState<Announcement | null>(null);

  if (activeAnn) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <button 
          onClick={() => setActiveAnn(null)}
          className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition"
        >
          <ArrowLeft size={16} />
          Back to announcements
        </button>
        
        <article className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
          <div className="border-b border-zinc-100 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[activeAnn.category]}`}>
                {activeAnn.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                <Calendar size={14} />
                {activeAnn.date}
              </span>
              {activeAnn.important && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                  <AlertTriangle size={14} />
                  Important
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
              {activeAnn.title}
            </h1>
            <p className="mt-4 text-sm font-medium text-zinc-500">
              Posted by <span className="text-zinc-700">{activeAnn.postedBy}</span>
            </p>
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="prose prose-slate prose-sm sm:prose-base max-w-none">
              {activeAnn.fullContent.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-zinc-700 leading-relaxed last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Announcements</h1>
        <p className="mt-1 text-sm text-zinc-500">Stay updated with the latest news and notices from the school.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {announcements.map((ann) => (
          <button
            key={ann.id}
            onClick={() => setActiveAnn(ann)}
            className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200/50 hover:border-zinc-300 relative overflow-hidden group"
          >
            {ann.important && (
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-4 -right-5 bg-rose-500 text-white text-[10px] font-bold py-1 w-24 text-center rotate-45 transform">
                  URGENT
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-3 pr-8">
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${categoryColors[ann.category]}`}>
                {ann.category}
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                {ann.date}
              </span>
            </div>
            
            <h2 className="text-base font-bold text-zinc-900 leading-snug mb-2 group-hover:text-cyan-700 transition-colors">
              {ann.title}
            </h2>
            
            <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed mb-4 flex-1">
              {ann.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-zinc-400 mt-auto pt-4 border-t border-zinc-100">
              <span>{ann.postedBy}</span>
              <span className="font-medium text-zinc-500 group-hover:text-cyan-600 flex items-center gap-1">
                Read more &rarr;
              </span>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
}