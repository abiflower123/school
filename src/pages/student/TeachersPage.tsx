import { Mail, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTeachers } from "../../services/mock/teachers";

export default function TeachersPage() {
  const { selectedChild } = useAuth();
  const sid = selectedChild?.id ?? "STU001";
  const teachers = getTeachers(sid);
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">My Teachers</h1>
        <p className="mt-1 text-sm text-zinc-500">View and contact your subject teachers.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map(teacher => (
          <div key={teacher.id} className="flex flex-col rounded-xl border border-zinc-200 bg-white overflow-hidden transition hover:shadow-sm hover:border-zinc-300">
            <div className="p-5 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 text-lg font-bold">
                {teacher.avatar}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-zinc-900 truncate">{teacher.name}</h2>
                <p className="text-sm text-cyan-600 font-medium">{teacher.subject}</p>
                <div className="mt-1 inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">
                  {teacher.role}
                </div>
              </div>
            </div>
            <div className="mt-auto border-t border-zinc-100 bg-zinc-50 p-4">
              <div className="flex items-center gap-2 mb-3 text-xs text-zinc-500">
                <Mail size={14} className="text-zinc-400" />
                <span className="truncate">{teacher.email}</span>
              </div>
              <button
                onClick={() => navigate("/messages", { state: { conversationId: teacher.conversationId } })}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                <MessageSquare size={16} />
                Send Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
