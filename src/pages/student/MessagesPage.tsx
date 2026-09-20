import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquare, Search, Send, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getConversations, type Conversation } from "../../services/mock/messages";

export default function MessagesPage() {
  const { selectedChild } = useAuth();
  const sid = selectedChild?.id ?? "STU001";
  const location = useLocation();

  const [conversations, setConversations] = useState(() => getConversations(sid));
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");
  const [search, setSearch] = useState("");

  // Re-sync when the selected child changes, and open a deep-linked
  // conversation if navigated here from the Teachers page.
  useEffect(() => {
    const freshConvs = getConversations(sid);
    setConversations(freshConvs);
    const targetId = (location.state as { conversationId?: string } | null)?.conversationId;
    const target = targetId ? freshConvs.find((c) => c.id === targetId) : undefined;
    setActiveConv(target ? { ...target, unreadCount: 0 } : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sid, location.state]);

  const filtered = conversations.filter(c => 
    !search || c.teacherName.toLowerCase().includes(search.toLowerCase()) || c.teacherRole.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConv) return;
    
    const newMsg = {
      id: `M${Date.now()}`,
      sender: "student" as const,
      text: replyText,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    
    const updated = {
      ...activeConv,
      messages: [...activeConv.messages, newMsg],
      lastMessage: replyText,
      lastMessageTime: newMsg.timestamp,
    };
    
    setConversations(prev => prev.map(c => c.id === activeConv.id ? updated : c));
    setActiveConv(updated);
    setReplyText("");
  };

  return (
    <div className="mx-auto w-full max-w-5xl h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Messages</h1>
        <p className="mt-1 text-sm text-zinc-500">Communicate with teachers and school administration.</p>
      </section>

      <div className="flex flex-1 min-h-0 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {/* Chat List */}
        <div className={`w-full flex-col border-r border-zinc-200 sm:w-1/3 sm:flex ${activeConv ? 'hidden sm:flex' : 'flex'}`}>
          <div className="border-b border-zinc-100 p-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-zinc-400 focus:bg-white"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
            {filtered.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare size={24} className="mx-auto text-zinc-300" />
                <p className="mt-2 text-sm text-zinc-400">No conversations found.</p>
              </div>
            ) : (
              filtered.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    const readConv = { ...c, unreadCount: 0 };
                    setConversations(prev => prev.map(p => p.id === c.id ? readConv : p));
                    setActiveConv(readConv);
                  }}
                  className={`w-full flex items-start gap-3 p-4 text-left transition hover:bg-zinc-50 ${activeConv?.id === c.id ? 'bg-zinc-50' : ''}`}
                >
                  <div className="relative">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 font-bold text-zinc-600">
                      {c.teacherInitials}
                    </div>
                    {c.unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[9px] font-bold text-white border-2 border-white">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className="text-sm font-semibold text-zinc-900 truncate pr-2">{c.teacherName}</p>
                      <p className="text-[10px] font-medium text-zinc-400 whitespace-nowrap">{c.lastMessageTime}</p>
                    </div>
                    <p className={`text-xs truncate ${c.unreadCount > 0 ? 'font-semibold text-zinc-700' : 'text-zinc-500'}`}>
                      {c.lastMessage}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex-col sm:flex ${!activeConv ? 'hidden sm:flex' : 'flex'}`}>
          {activeConv ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-zinc-100 p-4">
                <button 
                  onClick={() => setActiveConv(null)}
                  className="sm:hidden p-1.5 -ml-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 font-bold text-zinc-600">
                  {activeConv.teacherInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{activeConv.teacherName}</p>
                  <p className="text-xs text-zinc-500">{activeConv.teacherRole}</p>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-zinc-50/50">
                {activeConv.messages.map((m, i) => {
                  const showDate = i === 0 || activeConv.messages[i-1].date !== m.date;
                  return (
                    <div key={m.id} className="flex flex-col">
                      {showDate && (
                        <div className="flex justify-center mb-4">
                          <span className="rounded-full bg-white px-3 py-1 text-[10px] font-medium text-zinc-400 border border-zinc-200">
                            {m.date}
                          </span>
                        </div>
                      )}
                      <div className={`flex flex-col max-w-[80%] ${m.sender === "student" ? "self-end items-end" : "self-start items-start"}`}>
                        <div className={`rounded-xl px-4 py-2.5 text-sm ${
                          m.sender === "student" 
                            ? "bg-zinc-900 text-white rounded-tr-sm" 
                            : "bg-white text-zinc-700 border border-zinc-200 rounded-tl-sm"
                        }`}>
                          {m.text}
                        </div>
                        <span className="mt-1 text-[10px] text-zinc-400 px-1">{m.timestamp}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Input */}
              <form onSubmit={handleSend} className="border-t border-zinc-100 p-4 bg-white">
                <div className="flex items-end gap-3">
                  <textarea
                    rows={1}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 min-h-[44px] max-h-32 resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-zinc-400 focus:bg-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white transition hover:bg-zinc-800 disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center p-8 bg-zinc-50/50">
              <MessageSquare size={48} className="text-zinc-300 mb-4" strokeWidth={1} />
              <p className="text-base font-semibold text-zinc-700">Your Messages</p>
              <p className="mt-1 text-sm text-zinc-500 max-w-sm">
                Select a conversation from the list to view messages or start a new conversation with a teacher.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}