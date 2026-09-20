import { useState } from "react";
import {
  Users, CalendarDays, User, CheckCircle2, Clock3, X,
  Trophy, BookOpen, Music, Microscope, MonitorPlay, CalendarHeart,
  MapPin, Sparkles, MoveRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getClubs, getMemberships, joinClub,
  type Club, type StudentClubMembership
} from "../../services/mock/clubs";

export default function ClubsPage() {
  const { selectedChild } = useAuth();
  const studentId = selectedChild?.id ?? "STU001";

  const clubs = getClubs();
  const [memberships, setMemberships] = useState<StudentClubMembership[]>(() => getMemberships(studentId));
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const getMemberStatus = (clubId: string) => memberships.find((m) => m.clubId === clubId);

  const handleJoin = (clubId: string) => {
    setMemberships((prev) => joinClub(prev, clubId));
  };

  const myClubs = clubs.filter((c) => {
    const m = getMemberStatus(c.id);
    return m?.status === "Member" || m?.status === "Pending";
  });

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "Science": return { bg: "bg-blue-500", text: "text-blue-700", light: "bg-blue-50", border: "border-blue-100", icon: <Microscope size={24} /> };
      case "Arts": return { bg: "bg-rose-500", text: "text-rose-700", light: "bg-rose-50", border: "border-rose-100", icon: <Sparkles size={24} /> };
      case "Sports": return { bg: "bg-amber-500", text: "text-amber-700", light: "bg-amber-50", border: "border-amber-100", icon: <Trophy size={24} /> };
      case "Cultural": return { bg: "bg-violet-500", text: "text-violet-700", light: "bg-violet-50", border: "border-violet-100", icon: <Music size={24} /> };
      case "Literary": return { bg: "bg-emerald-500", text: "text-emerald-700", light: "bg-emerald-50", border: "border-emerald-100", icon: <BookOpen size={24} /> };
      case "Technology": return { bg: "bg-cyan-500", text: "text-cyan-700", light: "bg-cyan-50", border: "border-cyan-100", icon: <MonitorPlay size={24} /> };
      default: return { bg: "bg-zinc-500", text: "text-zinc-700", light: "bg-zinc-50", border: "border-zinc-100", icon: <Users size={24} /> };
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 lg:space-y-10 relative">
      
      {/* Header */}
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Clubs & Activities</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Discover your passions, manage memberships, and participate in upcoming events.
        </p>
      </section>

      {/* My Clubs Horizontal Dashboard */}
      {myClubs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Users size={16} /> My Memberships
          </h2>
          <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
            {myClubs.map((club) => {
              const mem = getMemberStatus(club.id)!;
              const theme = getCategoryTheme(club.category);
              return (
                <button
                  key={`my-${club.id}`}
                  onClick={() => setSelectedClub(club)}
                  className="group relative flex w-72 shrink-0 flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-all hover:shadow-lg hover:border-zinc-300 overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-transform group-hover:scale-110 ${theme.bg}`} />
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${theme.light} ${theme.text} ${theme.border} border`}>
                      {theme.icon}
                    </div>
                    {mem.status === "Member" ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                        <Clock3 size={12} /> Pending
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-6 relative z-10">
                    <p className="text-lg font-bold text-zinc-900 leading-tight group-hover:text-blue-600 transition-colors">{club.name}</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mt-1 flex items-center gap-1.5">
                       <User size={12} /> Role: {mem.role || "Member"}
                    </p>
                  </div>

                  {/* Quick Next Event Snippet */}
                  {club.upcomingEvents.length > 0 && (
                     <div className="mt-4 pt-4 border-t border-zinc-100 relative z-10">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Next Event</p>
                        <p className="text-xs font-semibold text-zinc-700 truncate">{club.upcomingEvents[0].title}</p>
                        <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5"><CalendarDays size={10} /> {club.upcomingEvents[0].date}</p>
                     </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* All Clubs Discovery Grid */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
           <Sparkles size={16} /> Discover Clubs
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => {
            const mem = getMemberStatus(club.id);
            const theme = getCategoryTheme(club.category);
            return (
              <div key={club.id} className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition hover:shadow-lg hover:border-zinc-300 relative group">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border ${theme.light} ${theme.text} ${theme.border} group-hover:scale-110 transition-transform`}>
                    {theme.icon}
                  </div>
                  {mem && (
                    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                      mem.status === "Member" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {mem.status === "Member" ? <CheckCircle2 size={10} /> : <Clock3 size={10} />}
                      {mem.status}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                   <h3 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{club.name}</h3>
                   <span className={`inline-block mt-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${theme.light} ${theme.text}`}>
                     {club.category}
                   </span>
                   <p className="mt-4 text-sm leading-relaxed text-zinc-500 line-clamp-2">{club.description}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    <Users size={14} /> {club.memberCount} MBRS
                  </div>
                  <button
                    onClick={() => setSelectedClub(club)}
                    className="flex items-center gap-1 text-sm font-bold text-zinc-900 hover:text-blue-600 transition-colors"
                  >
                    Details <MoveRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Slide-in Detail Drawer */}
      {selectedClub && (() => {
         const theme = getCategoryTheme(selectedClub.category);
         const mem = getMemberStatus(selectedClub.id);
         
         return (
         <div className="fixed inset-0 z-50 flex justify-end bg-zinc-900/40 backdrop-blur-sm transition-opacity">
           <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
             
             {/* Drawer Header (Thematic) */}
             <div className={`relative px-6 pt-12 pb-6 border-b ${theme.border} ${theme.light} overflow-hidden`}>
               <div className={`absolute -right-10 -top-10 w-48 h-48 rounded-full ${theme.bg} opacity-10 blur-2xl`} />
               
               <button onClick={() => setSelectedClub(null)} className="absolute top-4 right-4 rounded-full p-2 bg-white/50 text-zinc-500 hover:bg-white hover:text-zinc-900 transition-colors backdrop-blur-md">
                 <X size={20} />
               </button>
               
               <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white border ${theme.border} ${theme.text} mb-4 shadow-sm`}>
                 {theme.icon}
               </div>
               
               <h2 className="text-2xl font-black text-zinc-900 leading-tight">{selectedClub.name}</h2>
               <div className="mt-3 flex flex-wrap gap-2">
                 <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-white ${theme.text} border ${theme.border}`}>
                   {selectedClub.category}
                 </span>
                 {mem && (
                   <span className="inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
                     {mem.status}
                   </span>
                 )}
               </div>
             </div>

             {/* Drawer Content */}
             <div className="flex-1 overflow-y-auto p-6 space-y-8">
               
               {/* About */}
               <div>
                 <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-2">About the Club</p>
                 <p className="text-sm leading-relaxed text-zinc-700">{selectedClub.description}</p>
               </div>

               {/* Quick Info Grid */}
               <div className="grid grid-cols-2 gap-4">
                 <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                   <User size={16} className="text-zinc-400 mb-2" />
                   <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Teacher In-Charge</p>
                   <p className="text-sm font-bold text-zinc-900 mt-0.5">{selectedClub.teacherInCharge}</p>
                 </div>
                 <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                   <CalendarDays size={16} className="text-zinc-400 mb-2" />
                   <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Schedule</p>
                   <p className="text-sm font-bold text-zinc-900 mt-0.5">{selectedClub.meetingSchedule}</p>
                 </div>
               </div>

               {/* Upcoming Events Timeline */}
               <div>
                 <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                    <CalendarHeart size={16} /> Upcoming Events
                 </p>
                 
                 {selectedClub.upcomingEvents.length === 0 ? (
                    <p className="text-sm text-zinc-500 italic">No upcoming events scheduled.</p>
                 ) : (
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
                      {selectedClub.upcomingEvents.map((ev, i) => (
                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${theme.bg} ${theme.text} bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}>
                             <MapPin size={14} />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">{ev.date}</p>
                            <p className="text-sm font-bold text-zinc-900">{ev.title}</p>
                            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{ev.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                 )}
               </div>

             </div>

             {/* Footer Actions */}
             {!mem && (
               <div className="border-t border-zinc-100 p-6 bg-zinc-50/50">
                 <button
                   onClick={() => { handleJoin(selectedClub.id); setSelectedClub(null); }}
                   className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition shadow-lg hover:scale-[1.02] ${theme.bg} shadow-${theme.bg}/20`}
                 >
                   Join {selectedClub.name}
                 </button>
               </div>
             )}
             
             {mem && (
                <div className="border-t border-zinc-100 p-6 bg-zinc-50/50 text-center">
                   <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 flex items-center justify-center gap-2">
                     <CheckCircle2 size={16} /> You are a {mem.role || "Member"}
                   </p>
                </div>
             )}

           </div>
         </div>
       )
      })()}

    </div>
  );
}
