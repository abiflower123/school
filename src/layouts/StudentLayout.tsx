import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu, Check, LogOut, Search, BadgeCheck } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import BottomNav from "../components/layout/BottomNav";
import { CommandPalette } from "../components/ui/CommandPalette";
import { StudentIdCard } from "../components/ui/StudentIdCard";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getNotifications, getUnreadCount } from "../services/mock/notifications";
import { formatNotificationTime } from "../services/mock/notifications";

function useGreeting(): string {
  const { t } = useLanguage();
  const h = new Date().getHours();
  if (h < 12) return t("goodMorning");
  if (h < 17) return t("goodAfternoon");
  return t("goodEvening");
}

function getTodayString(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export default function StudentLayout() {
  const { user, selectedChild, children, isParent, switchChild, logout, getInitials } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [childSwitcherOpen, setChildSwitcherOpen] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [idCardOpen, setIdCardOpen] = useState(false);
  const [notifications, setNotifications] = useState(() =>
    selectedChild ? getNotifications(selectedChild.id) : []
  );

  const childSwitcherRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Update notifications when child changes
  useEffect(() => {
    if (selectedChild) setNotifications(getNotifications(selectedChild.id));
  }, [selectedChild?.id]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (childSwitcherRef.current && !childSwitcherRef.current.contains(e.target as Node)) {
        setChildSwitcherOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = selectedChild ? getUnreadCount(selectedChild.id) : 0;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initials = selectedChild ? getInitials(selectedChild.name) : "??";
  const greeting = useGreeting();
  const todayStr = getTodayString();

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-zinc-950/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar Drawer */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 lg:hidden ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar mobile onClose={() => setMobileMenuOpen(false)} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* ── Mobile Header ── */}
          <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Child switcher — mobile */}
            {isParent && children.length > 1 ? (
              <div className="relative" ref={childSwitcherRef}>
                <button
                  type="button"
                  onClick={() => setChildSwitcherOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white">
                    {initials}
                  </div>
                  <span className="max-w-[120px] truncate">{selectedChild?.name}</span>
                  <ChevronDown size={14} className="text-zinc-400" />
                </button>
                {childSwitcherOpen && (
                  <ChildDropdown children={children} selectedChild={selectedChild} switchChild={switchChild} onClose={() => setChildSwitcherOpen(false)} getInitials={getInitials} />
                )}
              </div>
            ) : (
              <p className="text-sm font-semibold text-zinc-900">{selectedChild?.name}</p>
            )}

            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifPanelOpen((v) => !v)}
                className="relative rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100"
                aria-label="Notifications"
              >
                <Bell size={20} strokeWidth={1.5} />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifPanelOpen && (
                <NotificationPanel notifications={notifications} markAllRead={markAllRead} onNavigate={(link) => { navigate(link); setNotifPanelOpen(false); }} />
              )}
            </div>
          </header>

          {/* ── Desktop Top Header ── */}
          <header className="hidden h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 lg:flex">
            {/* Greeting */}
            <div>
              <p className="text-sm font-medium text-zinc-700">
                {greeting}, {selectedChild?.name?.split(" ")[0] ?? user?.name?.split(" ")[0]} ✨
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">{todayStr}</p>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* ID Card */}
              <button
                type="button"
                onClick={() => setIdCardOpen(true)}
                title="View ID Card"
                className="hidden lg:flex items-center justify-center rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                <BadgeCheck size={20} strokeWidth={1.5} />
              </button>

              {/* Search Shortcut */}
              <div className="hidden lg:flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-zinc-400">
                <Search size={15} />
                <span className="text-xs font-medium">Search</span>
                <kbd className="ml-2 rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500 shadow-sm border border-zinc-200">Ctrl K</kbd>
              </div>

              {/* Child switcher — desktop */}
              {isParent && children.length > 1 && (
                <div className="relative" ref={childSwitcherRef}>
                  <button
                    type="button"
                    id="child-switcher-btn"
                    onClick={() => setChildSwitcherOpen((v) => !v)}
                    className="flex items-center gap-2.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-bold text-white">
                      {initials}
                    </div>
                    <div className="text-left">
                      <p className="max-w-[130px] truncate text-sm font-semibold text-zinc-900">{selectedChild?.name}</p>
                      <p className="text-[11px] text-zinc-400">Class {selectedChild?.class}-{selectedChild?.section}</p>
                    </div>
                    <ChevronDown size={15} className="text-zinc-400" />
                  </button>
                  {childSwitcherOpen && (
                    <ChildDropdown children={children} selectedChild={selectedChild} switchChild={switchChild} onClose={() => setChildSwitcherOpen(false)} getInitials={getInitials} />
                  )}
                </div>
              )}

              {/* Academic year */}
              <div className="hidden border-l border-zinc-200 pl-3 text-right xl:block">
                <p className="text-[11px] text-zinc-400">Academic Year</p>
                <p className="text-xs font-medium text-zinc-700">{selectedChild?.academicYear ?? "2026–2027"}</p>
              </div>

              {/* Notification bell */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifPanelOpen((v) => !v)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900"
                  aria-label="Notifications"
                >
                  <Bell size={18} strokeWidth={1.5} />
                  {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zinc-900 text-[8px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                {notifPanelOpen && (
                  <NotificationPanel notifications={notifications} markAllRead={markAllRead} onNavigate={(link) => { navigate(link); setNotifPanelOpen(false); }} />
                )}
              </div>

              {/* User menu */}
              <div className="relative flex items-center gap-2 border-l border-zinc-200 pl-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                  {isParent ? getInitials(user?.name ?? "") : initials}
                </div>
                <div className="hidden xl:block">
                  <p className="text-xs font-semibold text-zinc-900">{user?.name}</p>
                  <p className="text-[11px] text-zinc-400">{isParent ? "Parent" : `Class ${selectedChild?.class}-${selectedChild?.section}`}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign out"
                  className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-rose-600"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 pb-24 sm:p-6 lg:pb-6">
            <Outlet />
          </main>
        </div>
      </div>

      <BottomNav onMoreClick={() => setMobileMenuOpen(true)} />

      {/* Global Modals */}
      <CommandPalette />
      <StudentIdCard isOpen={idCardOpen} onClose={() => setIdCardOpen(false)} />
    </div>
  );
}

// ── Child Dropdown ──
function ChildDropdown({
  children,
  selectedChild,
  switchChild,
  onClose,
  getInitials,
}: {
  children: ReturnType<typeof useAuth>["children"];
  selectedChild: ReturnType<typeof useAuth>["selectedChild"];
  switchChild: (id: string) => void;
  onClose: () => void;
  getInitials: (name: string) => string;
}) {
  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/60">
      <div className="border-b border-zinc-100 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Switch Child</p>
      </div>
      <div className="p-2">
        {children.map((child) => {
          const isSelected = child.id === selectedChild?.id;
          return (
            <button
              key={child.id}
              type="button"
              onClick={() => { switchChild(child.id); onClose(); }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${isSelected ? "bg-zinc-900 text-white" : "hover:bg-zinc-50"}`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${isSelected ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-700"}`}>
                {getInitials(child.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-semibold ${isSelected ? "text-white" : "text-zinc-900"}`}>{child.name}</p>
                <p className={`text-xs ${isSelected ? "text-white/70" : "text-zinc-400"}`}>Class {child.class}-{child.section}</p>
              </div>
              {isSelected && <Check size={16} className="shrink-0 text-cyan-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Notification Panel ──
function NotificationPanel({
  notifications,
  markAllRead,
  onNavigate,
}: {
  notifications: ReturnType<typeof getNotifications>;
  markAllRead: () => void;
  onNavigate: (link: string) => void;
}) {
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/60">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">Notifications</p>
          {unread > 0 && <p className="text-xs text-zinc-400">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button type="button" onClick={markAllRead} className="text-xs font-medium text-zinc-500 hover:text-zinc-900">
            Mark all read
          </button>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Bell size={24} className="mx-auto text-zinc-300" />
            <p className="mt-2 text-sm text-zinc-400">No notifications</p>
          </div>
        ) : (
          notifications.slice(0, 6).map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => n.link && onNavigate(n.link)}
              className={`flex w-full items-start gap-3 border-b border-zinc-50 px-4 py-3 text-left transition last:border-b-0 hover:bg-zinc-50 ${!n.read ? "bg-cyan-50/40" : ""}`}
            >
              {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />}
              <div className={`min-w-0 flex-1 ${n.read ? "pl-3" : ""}`}>
                <p className="truncate text-xs font-semibold text-zinc-900">{n.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">{n.body}</p>
                <p className="mt-1 text-[10px] text-zinc-400">{formatNotificationTime(n.timestamp)}</p>
              </div>
            </button>
          ))
        )}
      </div>
      <div className="border-t border-zinc-100 px-4 py-3">
        <button
          type="button"
          onClick={() => onNavigate("/notifications")}
          className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
        >
          View all notifications →
        </button>
      </div>
    </div>
  );
}