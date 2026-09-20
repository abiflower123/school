import { NavLink } from "react-router-dom";
import { LayoutDashboard, Clock3, CreditCard, MessageSquare, Menu } from "lucide-react";

type BottomNavProps = {
  onMoreClick: () => void;
};

const items = [
  { label: "Home", icon: LayoutDashboard, path: "/" },
  { label: "Timetable", icon: Clock3, path: "/timetable" },
  { label: "Fees", icon: CreditCard, path: "/fees" },
  { label: "Messages", icon: MessageSquare, path: "/messages" },
];

export default function BottomNav({ onMoreClick }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch border-t border-zinc-200 bg-white lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition ${
                isActive ? "text-zinc-900" : "text-zinc-400"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                {item.label}
              </>
            )}
          </NavLink>
        );
      })}
      <button
        type="button"
        onClick={onMoreClick}
        className="flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium text-zinc-400 transition hover:text-zinc-600"
      >
        <Menu size={20} strokeWidth={1.5} />
        More
      </button>
    </nav>
  );
}
