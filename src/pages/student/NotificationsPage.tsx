import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getNotifications,
  formatNotificationTime,
  type NotificationCategory,
  type AppNotification,
} from "../../services/mock/notifications";
import { useNavigate } from "react-router-dom";

const CATEGORY_FILTERS: { label: string; value: NotificationCategory | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Academic", value: "Academic" },
  { label: "Finance", value: "Finance" },
  { label: "Attendance", value: "Attendance" },
  { label: "Exam", value: "Exam" },
  { label: "Assignment", value: "Assignment" },
  { label: "General", value: "General" },
];

const categoryColors: Record<NotificationCategory, string> = {
  Academic: "bg-blue-50 text-blue-700",
  Finance: "bg-amber-50 text-amber-700",
  Attendance: "bg-emerald-50 text-emerald-700",
  Exam: "bg-violet-50 text-violet-700",
  Assignment: "bg-cyan-50 text-cyan-700",
  General: "bg-zinc-100 text-zinc-600",
  Communication: "bg-rose-50 text-rose-700",
};

export default function NotificationsPage() {
  const { selectedChild } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    selectedChild ? getNotifications(selectedChild.id) : []
  );
  const [filter, setFilter] = useState<NotificationCategory | "All">("All");

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const filtered = filter === "All" ? notifications : notifications.filter((n) => n.category === filter);
  const unread = notifications.filter((n) => !n.read).length;

  const handleClick = (n: AppNotification) => {
    markRead(n.id);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Notifications</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {unread > 0 ? `${unread} unread notification${unread !== 1 ? "s" : ""}` : "All notifications are read."}
          </p>
        </div>
        {unread > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 px-3.5 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
          >
            <CheckCheck size={15} />
            Mark all read
          </button>
        )}
      </section>

      {/* Filter Tabs */}
      <section className="overflow-x-auto rounded-xl border border-zinc-200 bg-white p-2">
        <div className="flex min-w-max gap-1">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                filter === f.value
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Notifications List */}
      <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Bell size={36} className="mx-auto text-zinc-300" strokeWidth={1.5} />
            <p className="mt-3 text-sm font-medium text-zinc-600">No notifications</p>
            <p className="mt-1 text-xs text-zinc-400">
              {filter !== "All" ? `No ${filter} notifications found.` : "You're all caught up!"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filtered.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => handleClick(n)}
                className={`flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-zinc-50 ${!n.read ? "bg-cyan-50/30" : ""}`}
              >
                <div className="mt-1 flex-shrink-0">
                  {!n.read ? (
                    <div className="h-2 w-2 rounded-full bg-zinc-900" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-transparent" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`text-sm font-semibold ${n.read ? "text-zinc-700" : "text-zinc-900"}`}>
                      {n.title}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColors[n.category]}`}>
                      {n.category}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm leading-5 text-zinc-500">{n.body}</p>
                  <p className="mt-1 text-xs text-zinc-400">{formatNotificationTime(n.timestamp)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
