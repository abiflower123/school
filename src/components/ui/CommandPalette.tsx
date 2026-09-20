import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, FileText, Settings, BookOpen, Clock3, MessageSquare, Briefcase, CreditCard, Award, Bus, Newspaper, Bell, FileBadge, UserRound } from "lucide-react";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const routes = [
    { name: "Dashboard", path: "/", icon: BookOpen },
    { name: "Timetable", path: "/timetable", icon: Clock3 },
    { name: "Attendance & Leave", path: "/attendance", icon: Calendar },
    { name: "Apply for Leave", path: "/leave", icon: Calendar },
    { name: "Assignments & Homework", path: "/assignments", icon: FileText },
    { name: "Exams & Results", path: "/exams", icon: FileText },
    { name: "Academic Progress", path: "/academic-progress", icon: BookOpen },
    { name: "Study Materials", path: "/resources", icon: BookOpen },
    { name: "Progress Reports", path: "/progress-reports", icon: FileText },
    { name: "Fees & Payments", path: "/fees", icon: CreditCard },
    { name: "Scholarship & Concession", path: "/scholarship", icon: Award },
    { name: "Transport", path: "/transport", icon: Bus },
    { name: "My Teachers", path: "/teachers", icon: MessageSquare },
    { name: "Announcements", path: "/announcements", icon: Newspaper },
    { name: "Notifications", path: "/notifications", icon: Bell },
    { name: "Messages", path: "/messages", icon: MessageSquare },
    { name: "Calendar & Events", path: "/calendar", icon: Calendar },
    { name: "Clubs & Activities", path: "/clubs", icon: Briefcase },
    { name: "Certificates & Documents", path: "/certificates", icon: FileBadge },
    { name: "My Profile", path: "/profile", icon: UserRound },
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "Helpdesk", path: "/helpdesk", icon: MessageSquare },
  ];

  const filtered = routes.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Palette */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-zinc-200">
        <div className="flex items-center border-b border-zinc-100 px-4">
          <Search size={20} className="text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            className="h-14 w-full bg-transparent px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
            placeholder="Search pages and actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1">
            <kbd className="hidden rounded bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-500 sm:block">ESC</kbd>
          </div>
        </div>
        
        {query.length > 0 && (
          <div className="max-h-72 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-sm text-zinc-500">No results found.</div>
            ) : (
              <ul className="space-y-1">
                {filtered.map((route) => (
                  <li key={route.path}>
                    <button
                      type="button"
                      onClick={() => {
                        navigate(route.path);
                        setIsOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50 hover:text-cyan-700"
                    >
                      <route.icon size={16} className="text-zinc-400" />
                      {route.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
