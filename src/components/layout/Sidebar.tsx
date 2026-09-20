import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  CalendarDays,
  Clock3,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  X,
  GraduationCap,
  CreditCard,
  Bus,
  UserRound,
  FileBadge,
  Users,
  HelpCircle,
  Newspaper,
  Award,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage, type TranslationKey } from "../../context/LanguageContext";

type SidebarProps = {
  mobile?: boolean;
  onClose?: () => void;
};

type NavItem = {
  labelKey: TranslationKey;
  icon: React.ElementType;
  path: string;
};

const mainItems: NavItem[] = [
  { labelKey: "dashboard", icon: LayoutDashboard, path: "/" },
];

const learningItems: NavItem[] = [
  { labelKey: "timetable", icon: Clock3, path: "/timetable" },
  { labelKey: "attendanceLeave", icon: CalendarCheck, path: "/attendance" },
  { labelKey: "subjectsProgress", icon: BookOpen, path: "/academic-progress" },
  { labelKey: "studyMaterials", icon: BookOpen, path: "/resources" },
  { labelKey: "assignments", icon: ClipboardList, path: "/assignments" },
  { labelKey: "examsResults", icon: FileText, path: "/exams" },
  { labelKey: "reportCards", icon: GraduationCap, path: "/progress-reports" },
];

const financeItems: NavItem[] = [
  { labelKey: "feesPayments", icon: CreditCard, path: "/fees" },
  { labelKey: "scholarship", icon: Award, path: "/scholarship" },
  { labelKey: "transport", icon: Bus, path: "/transport" },
];

const servicesItems: NavItem[] = [
  { labelKey: "myTeachers", icon: Users, path: "/teachers" },
  { labelKey: "announcements", icon: Newspaper, path: "/announcements" },
  { labelKey: "messages", icon: MessageSquare, path: "/messages" },
  { labelKey: "calendarEvents", icon: CalendarDays, path: "/calendar" },
  { labelKey: "clubsActivities", icon: Users, path: "/clubs" },
  { labelKey: "certificates", icon: FileBadge, path: "/certificates" },
  { labelKey: "helpdesk", icon: HelpCircle, path: "/helpdesk" },
];

const profileItems: NavItem[] = [
  { labelKey: "myProfile", icon: UserRound, path: "/profile" },
  { labelKey: "settings", icon: Settings, path: "/settings" },
];

export default function Sidebar({ mobile = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { logout, selectedChild, getInitials } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    onClose?.();
  };

  const renderSection = (labelKey: TranslationKey, items: NavItem[]) => (
    <div>
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {t(labelKey)}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/50"
                    : "text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={17}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={isActive ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600"}
                  />
                  <span className="leading-none">{t(item.labelKey)}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside
      className={
        mobile
          ? "flex h-full w-full flex-col bg-zinc-50 text-zinc-900"
          : "hidden min-h-screen w-64 flex-col border-r border-zinc-200 bg-zinc-50 text-zinc-900 lg:flex"
      }
    >
      {/* Brand */}
      <div className="flex h-16 items-center justify-between border-b border-zinc-100 px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 shadow-sm">
            <GraduationCap size={18} className="text-white" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-900 leading-none">Ravion</p>
            <p className="text-[10px] font-medium text-zinc-500 leading-none mt-0.5">Student Portal</p>
          </div>
        </div>
        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Student badge (mobile) */}
      {mobile && selectedChild && (
        <div className="border-b border-zinc-100 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
              {getInitials(selectedChild.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-zinc-900">{selectedChild.name}</p>
              <p className="text-xs font-medium text-zinc-500">Class {selectedChild.class}-{selectedChild.section}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {renderSection("main", mainItems)}
        {renderSection("learning", learningItems)}
        {renderSection("finance", financeItems)}
        {renderSection("schoolServices", servicesItems)}
        {renderSection("profile", profileItems)}
      </nav>

      {/* Logout */}
      <div className="border-t border-zinc-100 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-zinc-50 hover:text-rose-600"
        >
          <LogOut size={17} strokeWidth={1.5} />
          <span>{t("signOut")}</span>
        </button>
      </div>
    </aside>
  );
}