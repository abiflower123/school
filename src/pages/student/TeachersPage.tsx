import { Mail, MessageSquare, Users, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTeachers } from "../../services/mock/teachers";
import { PageHeader } from "../../components/ui/PageHeader";
import { EmptyState } from "../../components/ui/EmptyState";

export default function TeachersPage() {
  const { selectedChild } = useAuth();
  const sid = selectedChild?.id ?? "STU001";
  const teachers = getTeachers(sid);
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <PageHeader title="My Teachers" subtitle="View and contact your subject teachers." />

      {teachers.length === 0 ? (
        <EmptyState icon={Users} title="No teachers assigned yet" message="Teacher assignments will appear here once published by the school." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map(teacher => {
            const canMessage = !!teacher.conversationId;
            return (
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
                  {canMessage ? (
                    <button
                      onClick={() => navigate("/messages", { state: { conversationId: teacher.conversationId } })}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                      <MessageSquare size={16} />
                      Send Message
                    </button>
                  ) : (
                    <div
                      title="This teacher hasn't opened a direct message channel yet — contact via your class teacher or the school office."
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-200 px-4 py-2.5 text-xs font-medium text-zinc-400"
                    >
                      <Lock size={13} />
                      Contact via class teacher
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
